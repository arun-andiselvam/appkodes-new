import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Where uploaded requirement documents live, and the rules for putting them
 * there.
 *
 * !! THE BYTES GO ON DISK, THE METADATA GOES IN POSTGRES !!
 *
 * Decided with the client on 27 August 2026, against the two alternatives.
 * Bytea columns would put every requirement document into every database dump,
 * which turns a small archive into a large one for no benefit. Object storage
 * is the right answer at volume and is a service, credentials and a monthly
 * bill this does not need yet. A directory on the droplet is the honest size
 * of the problem.
 *
 * !! IT MUST BE A DOCKER VOLUME IN PRODUCTION OR THE FILES VANISH !!
 *
 * QUOTE_UPLOAD_DIR has to point somewhere that survives a container being
 * replaced. Left on the default below, every redeploy takes the uploads with
 * it, and the first anybody knows is an estimate job that cannot read the
 * document it was supposed to price. The default is right for development and
 * wrong for the server, deliberately - a default that silently half-works in
 * production is worse than one that obviously does not.
 *
 * Worth remembering that this droplet has filled its disk before. Nothing here
 * deletes anything, so a retention sweep is a real thing this will want.
 */

/* --------------------------------------------------------------- the limits */

/**
 * Per file, matching ATTACHMENT.maxBytes in content/quote-flow.ts.
 *
 * !! DO NOT RAISE THIS WITHOUT READING THE NOTE IN app/api/quote/route.ts !!
 *
 * That route explains the trap: this project runs proxy.ts, so Next buffers
 * every request body to let both the proxy and the handler read it, and that
 * buffer is capped at 10MB by default. A body over the cap is TRUNCATED WITH A
 * WARNING rather than rejected, which from the browser looks like an upload
 * that worked and a file that arrived corrupt. Eight megabytes plus multipart
 * overhead sits under the cap with room to spare, which is the only reason
 * this is safe without touching experimental.proxyClientMaxBodySize.
 *
 * This is also why uploads are one file per request rather than a multi-file
 * form. Five files in one POST would blow straight through the buffer.
 */
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

/** Files per conversation. Enough for a spec, wireframes and a deck. */
export const MAX_FILES = 10;

/** And a ceiling on the lot, so ten maximum-size files cannot fill the disk. */
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

/**
 * What we accept, by media type.
 *
 * A superset of ATTACHMENT.allowedTypes: images are here and are not there,
 * because "screenshot of the screen that is slow" is one of the most useful
 * things a visitor can hand over and the scripted form's single-attachment
 * field was never the place for it.
 *
 * The extension is ours, not theirs. It is looked up from this table and never
 * taken from the uploaded filename - see storedPathFor below.
 */
const ACCEPTED: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "application/rtf": ".rtf",
  "text/plain": ".txt",
  "text/markdown": ".md",
  "text/csv": ".csv",
  "application/json": ".json",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const ACCEPT_ATTRIBUTE = Object.keys(ACCEPTED).join(",");

export function isAccepted(mime: string) {
  return Object.hasOwn(ACCEPTED, mime);
}

/**
 * Types whose bytes can be read as text directly.
 *
 * Everything else is stored and handed to the model as a document rather than
 * as extracted text - see lib/quote-estimate.ts. That is why there is no PDF
 * parser in this project: the model reads PDFs natively, and adding a
 * dependency to do badly what the API does properly would be work for a worse
 * result.
 */
const TEXT_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
]);

/**
 * How much extracted text is kept per file.
 *
 * The estimate prompt carries every file's text, and a visitor who attaches a
 * 400 page specification would otherwise put the whole thing into one request.
 * Sixty thousand characters is roughly fifteen thousand tokens, which is a
 * long specification and still leaves room for the conversation beside it.
 * Truncation is marked in the text so the model knows it is reading a part.
 */
const MAX_EXTRACTED_CHARS = 60_000;

/* ----------------------------------------------------------------- the disk */

export function uploadRoot() {
  return process.env.QUOTE_UPLOAD_DIR || path.join(process.cwd(), ".uploads");
}

/**
 * Where a file is stored, relative to the root.
 *
 * !! BUILT FROM OUR OWN IDS. NOTHING THE BROWSER SENT REACHES THIS PATH. !!
 *
 * The uploaded filename is attacker-controlled text. A name like
 * "../../../etc/passwd" or one carrying a null byte is a directory traversal
 * waiting for somebody to join it onto a path, and "report.pdf.exe" is a
 * different trick against whoever opens it later. So the stored name is a
 * UUID we generated, and the extension is looked up from the accepted-types
 * table by media type. The visitor's name is kept in the database as a label
 * and is never a path component anywhere.
 */
export function storedPathFor(conversationId: string, fileId: string, mime: string) {
  return path.join(conversationId, `${fileId}${ACCEPTED[mime] ?? ".bin"}`);
}

/**
 * Writes the bytes, creating the conversation's directory on the way.
 *
 * Resolves the final path and checks it is still inside the root before
 * writing. Both inputs are UUIDs this server generated, so it cannot currently
 * escape - which is exactly why the check is cheap to keep. It costs nothing
 * now and it is the thing that holds if somebody later decides the stored name
 * should include something friendlier.
 */
export async function storeFile(
  relativePath: string,
  bytes: Buffer,
): Promise<void> {
  const root = uploadRoot();
  const full = path.resolve(root, relativePath);

  if (!full.startsWith(path.resolve(root) + path.sep)) {
    throw new Error("Refusing to write outside the upload root.");
  }

  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, bytes);
}

/** Reads a stored file back, for the estimate job and the admin download. */
export async function readStoredFile(relativePath: string): Promise<Buffer> {
  const root = uploadRoot();
  const full = path.resolve(root, relativePath);

  if (!full.startsWith(path.resolve(root) + path.sep)) {
    throw new Error("Refusing to read outside the upload root.");
  }

  return readFile(full);
}

/* ------------------------------------------------------------ the extraction */

/**
 * Pulls readable text out of a file, where that is possible without a parser.
 *
 * Returns null for anything else, which is not a failure - it is the signal
 * that the file has to be handed to the model as a document instead. The
 * estimate job checks for exactly that and does the right thing with each.
 *
 * The control-character strip matters more than it looks: a file that claims
 * text/plain and holds binary would otherwise put raw bytes into a prompt,
 * where at best it wastes tokens and at worst it carries something that reads
 * as an instruction.
 */
export function extractText(mime: string, bytes: Buffer): string | null {
  if (!TEXT_TYPES.has(mime)) return null;

  const text = bytes
    .toString("utf8")
    .replace(/\x00/g, "")
    .replace(/[\x01-\x08\x0b\x0c\x0e-\x1f]/g, " ")
    .trim();

  if (!text) return null;

  if (text.length > MAX_EXTRACTED_CHARS) {
    return `${text.slice(0, MAX_EXTRACTED_CHARS)}\n\n[truncated — the uploaded file is longer than this]`;
  }

  return text;
}

/**
 * A filename fit to store and show back to a person.
 *
 * Path separators stripped, because a name is never a path here and one that
 * looks like one is only ever confusing. Length capped so the admin table does
 * not have to cope with a two hundred character name.
 */
export function safeFilename(name: string) {
  return (name.split(/[/\\]/).pop() || "document").replace(/[\x00-\x1f]/g, "").slice(0, 120);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
