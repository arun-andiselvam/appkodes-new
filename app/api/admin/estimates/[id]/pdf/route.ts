import { databaseConfigured } from "@/lib/db";
import { getEstimate } from "@/lib/quote-store";
import { readStoredFile } from "@/lib/quote-uploads";

/**
 * The estimate PDF, for whoever is approving it.
 *
 * !! READ THE DOCUMENT BEFORE APPROVING IT. THIS IS HOW. !!
 *
 * Approving from the summary on the admin page alone would defeat the point of
 * the human gate - the figures a client reads are in the PDF, and that is what
 * has to be checked. This route is the link behind the preview.
 *
 * Behind the basic auth gate in proxy.ts, which covers /api/admin. Nothing
 * public reads it, and the path is not guessable to a stranger anyway since it
 * needs an estimate's uuid.
 *
 * The file is served inline rather than as a download, so it opens in the
 * browser's viewer and can be read without a round trip through the
 * downloads folder. Content-Disposition still names it, so saving it produces
 * a sensible filename rather than a uuid.
 */

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!databaseConfigured()) {
    return new Response("Not configured.", { status: 503 });
  }

  const { id } = await params;

  try {
    const estimate = await getEstimate(id);

    if (!estimate?.pdf_path) {
      return new Response("No PDF for that estimate.", { status: 404 });
    }

    const pdf = await readStoredFile(estimate.pdf_path);
    const reference = estimate.id.slice(0, 8).toUpperCase();

    return new Response(new Uint8Array(pdf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="Hitasoft-estimate-${reference}.pdf"`,
        /*
         * Never cached. An estimate can be regenerated after a failure, and a
         * stale copy in a browser cache is the version somebody approves.
         */
        "cache-control": "no-store",
      },
    });
  } catch (cause) {
    console.error("[admin/estimates/pdf] failed:", cause);
    return new Response("Could not read that file.", { status: 500 });
  }
}
