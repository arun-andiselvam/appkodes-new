import { databaseConfigured } from "@/lib/db";
import { getFile } from "@/lib/quote-store";
import { readStoredFile, safeFilename } from "@/lib/quote-uploads";

/**
 * An uploaded requirement document, for whoever is reviewing the estimate
 * behind it.
 *
 * !! SAME SHAPE AS THE PDF ROUTE NEXT DOOR, DELIBERATELY !!
 *
 * See app/api/admin/estimates/[id]/pdf/route.ts - same reasoning applies
 * here: behind proxy.ts's admin gate, the path is an unguessable uuid, and
 * this is a straight read of bytes already on disk rather than anything
 * that needs its own logic.
 *
 * Images and PDFs render inline, so a reviewer can look at a screenshot or a
 * spec without a round trip through downloads; anything else (a .docx, a
 * spreadsheet) is served as an attachment, because there is no browser-native
 * viewer for it to open into.
 */

export const dynamic = "force-dynamic";

const INLINE_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!databaseConfigured()) {
    return new Response("Not configured.", { status: 503 });
  }

  const { id } = await params;

  try {
    const file = await getFile(id);
    if (!file) return new Response("No such file.", { status: 404 });

    const bytes = await readStoredFile(file.stored_path);
    const name = safeFilename(file.filename);
    const disposition = INLINE_TYPES.has(file.mime ?? "") ? "inline" : "attachment";

    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": file.mime ?? "application/octet-stream",
        "content-disposition": `${disposition}; filename="${name.replace(/"/g, "")}"`,
        "cache-control": "no-store",
      },
    });
  } catch (cause) {
    console.error("[admin/files] failed:", cause);
    return new Response("Could not read that file.", { status: 500 });
  }
}
