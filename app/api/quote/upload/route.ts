import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { databaseConfigured } from "@/lib/db";
import { countFiles, getSession, insertFile, listFiles } from "@/lib/quote-store";
import {
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  extractText,
  formatBytes,
  isAccepted,
  safeFilename,
  storeFile,
  storedPathFor,
} from "@/lib/quote-uploads";
import { callerKey, overLimit } from "@/lib/rate-limit";

/**
 * One uploaded requirement document.
 *
 * !! ONE FILE PER REQUEST. THIS IS NOT A STYLE CHOICE. !!
 *
 * proxy.ts makes Next buffer every request body in memory so both the proxy
 * and the handler can read it, and that buffer is capped at 10MB - over which
 * a body is TRUNCATED WITH A WARNING rather than rejected. From the browser
 * that looks like an upload that worked and a file that arrived corrupt.
 * app/api/quote/route.ts found this the hard way and shouts about it. A
 * multi-file form would sail past the cap the moment somebody attached three
 * PDFs, so the client posts them one at a time and this handles one.
 *
 * !! UPLOADING REQUIRES A VERIFIED CONVERSATION !!
 *
 * The phase gate below is what stops this being an open file drop on a public
 * domain. Reaching `discovery` or `files` means somebody held a conversation
 * about a project AND proved they can read an email address, which is a real
 * cost per megabyte of disk. Without that gate this route is free storage for
 * anybody who finds it.
 */

const CONVERSATION_ID = /^[a-f0-9-]{8,64}$/i;

export async function POST(request: Request) {
  if (!databaseConfigured()) {
    return NextResponse.json(
      { error: "unconfigured", message: "Uploads are not switched on." },
      { status: 503 },
    );
  }

  /* Bounded before anything is read off the wire. */
  if (overLimit("upload", callerKey(request), 30, 60 * 60_000)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many uploads. Try again later." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read that upload." }, { status: 400 });
  }

  const rawId = form.get("conversationId");
  const conversationId =
    typeof rawId === "string" && CONVERSATION_ID.test(rawId) ? rawId : null;

  if (!conversationId) {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const upload = form.get("file");
  if (!(upload instanceof File) || upload.size === 0) {
    return NextResponse.json(
      { error: "no_file", message: "No file came through." },
      { status: 400 },
    );
  }

  try {
    const session = await getSession(conversationId);
    if (!session) {
      return NextResponse.json({ error: "Could not read that." }, { status: 400 });
    }

    /*
     * !! THE GATE. Verified, and at a point in the flow where files belong. !!
     *
     * `discovery` is allowed as well as `files` because somebody who wants to
     * attach their spec while still answering questions should not be told to
     * wait for permission. Anything earlier is refused: an unverified
     * conversation has proved nothing and must not be able to write to disk.
     */
    if (!session.verifiedEmail) {
      return NextResponse.json(
        {
          error: "not_verified",
          message: "Let us verify your email first, then you can attach whatever you have.",
        },
        { status: 403 },
      );
    }

    if (session.phase !== "discovery" && session.phase !== "files" && session.phase !== "wrap") {
      return NextResponse.json(
        { error: "wrong_phase", message: "That part of the conversation has finished." },
        { status: 409 },
      );
    }

    /*
     * The type, taken from the browser and checked against our own list.
     *
     * Worth being straight about what this is and is not: `upload.type` is
     * supplied by the client and a determined caller can claim anything. It is
     * checked because it decides the stored extension and because it filters
     * the honest mistakes, which are almost all of them. What actually bounds
     * the damage is that nothing on this site ever executes these files, they
     * are stored under a generated name, and they are served back only through
     * an authenticated admin route as an attachment.
     */
    const mime = (upload.type || "").toLowerCase().split(";")[0].trim();
    if (!isAccepted(mime)) {
      return NextResponse.json(
        {
          error: "wrong_type",
          message:
            "I can take documents, spreadsheets, slides and images. That one I cannot read.",
        },
        { status: 415 },
      );
    }

    if (upload.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: "too_large",
          message: `That file is ${formatBytes(upload.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)} — send the key pages, or a link to it.`,
        },
        { status: 413 },
      );
    }

    const existing = await listFiles(conversationId);

    if (existing.length >= MAX_FILES) {
      return NextResponse.json(
        {
          error: "too_many",
          message: `That is ${MAX_FILES} files, which is plenty to work from. Tell me anything else in the chat.`,
        },
        { status: 409 },
      );
    }

    const already = existing.reduce((sum, file) => sum + file.bytes, 0);
    if (already + upload.size > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        {
          error: "quota",
          message: `That would put the attachments over ${formatBytes(MAX_TOTAL_BYTES)} in total. Send the most important one and describe the rest.`,
        },
        { status: 413 },
      );
    }

    /*
     * Read after the size check, not before.
     *
     * upload.size is known from the multipart headers without pulling the
     * whole file into memory, so refusing an oversized upload here costs
     * nothing. Buffering first and then measuring would mean the limit only
     * applied after we had already paid the memory it was meant to protect.
     */
    const bytes = Buffer.from(await upload.arrayBuffer());

    /*
     * Belt and braces on the declared size. A client that lied in the
     * multipart header would otherwise walk straight past the check above.
     */
    if (bytes.byteLength > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "too_large", message: "That file is larger than it claimed to be." },
        { status: 413 },
      );
    }

    const fileId = randomUUID();
    const storedPath = storedPathFor(conversationId, fileId, mime);

    /*
     * Disk first, database second.
     *
     * This order can leave an orphaned file if the insert fails, which costs
     * some bytes and nothing else. The other order leaves a row pointing at a
     * file that is not there, and the estimate job would fail trying to read
     * it - a worse failure, and one that surfaces hours later in front of a
     * lead rather than immediately in a log.
     */
    await storeFile(storedPath, bytes);

    await insertFile({
      id: fileId,
      conversationId,
      filename: safeFilename(upload.name),
      mime,
      bytes: bytes.byteLength,
      storedPath,
      /*
       * Best effort, and null is a perfectly good answer. A PDF is handed to
       * the model as a document at estimate time rather than parsed here -
       * see the note on TEXT_TYPES in lib/quote-uploads.ts.
       */
      extractedText: extractText(mime, bytes),
    });

    const count = await countFiles(conversationId);
    console.info("[quote/upload] stored", { conversationId, mime, bytes: bytes.byteLength });

    return NextResponse.json({
      ok: true,
      file: {
        id: fileId,
        name: safeFilename(upload.name),
        size: formatBytes(bytes.byteLength),
      },
      count,
      remaining: MAX_FILES - count,
    });
  } catch (cause) {
    console.error("[quote/upload] failed:", cause);
    return NextResponse.json(
      {
        error: "server",
        message: "That upload did not save. Try it again, or just describe it to me.",
      },
      { status: 500 },
    );
  }
}
