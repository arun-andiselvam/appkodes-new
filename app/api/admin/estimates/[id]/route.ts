import { NextResponse } from "next/server";

import { founderContact } from "@/content/contact";
import { databaseConfigured } from "@/lib/db";
import { regenerateEstimate } from "@/lib/quote-estimate";
import type { Estimate } from "@/lib/quote-estimate-schema";
import { escapeHtml, sendMail, teamInbox, wrap } from "@/lib/quote-email";
import {
  approveEstimate,
  getEstimate,
  getSession,
  markEstimateSent,
  patchSession,
} from "@/lib/quote-store";
import { readStoredFile } from "@/lib/quote-uploads";

/**
 * Approving an estimate and sending it, or sending it back to be rewritten.
 *
 * !! THIS IS THE HUMAN GATE. IT IS THE POINT OF THE WHOLE DESIGN. !!
 *
 * Nothing else in this system emails a price to a client. The job in
 * lib/quote-estimate.ts stops at 'ready' and waits here, because every piece
 * of copy on this site refuses to state a price and content/contact.ts says
 * plainly that nobody can price work they have not looked at. A model-written
 * figure sent unread would abandon that quietly. So a person reads the
 * numbers, reads the reviewer notes, and presses a button.
 *
 * Authentication is the session-cookie gate in proxy.ts, which covers
 * /api/admin as well as /admin. Read the shouted note there before assuming
 * this route defends itself - it does not, deliberately, because one gate
 * that runs first beats a check on every route that somebody eventually
 * forgets.
 */

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!databaseConfigured()) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const { id } = await params;

  let body: { action?: unknown; budget?: unknown; timeline?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  if (body.action === "regenerate") {
    return handleRegenerate(id, body);
  }

  if (body.action !== "approve") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  try {
    /*
     * Only a 'ready' row can be approved, enforced in the UPDATE itself. Two
     * open tabs pressing approve on the same estimate means one of them moves
     * the row and the other finds nothing - so it cannot be sent twice.
     */
    const estimate = await approveEstimate(id);

    if (!estimate) {
      const current = await getEstimate(id);
      return NextResponse.json(
        {
          error: "not_ready",
          message: current
            ? `That estimate is "${current.status}", so there is nothing to approve.`
            : "No such estimate.",
        },
        { status: 409 },
      );
    }

    const session = await getSession(estimate.conversation_id);

    /*
     * No verified address, no send. This should be impossible - an estimate is
     * only queued from a conversation that reached `timeline`, which requires
     * verification - so reaching here means something upstream is broken and
     * guessing at a recipient is the wrong response.
     */
    if (!session?.verifiedEmail) {
      return NextResponse.json(
        {
          error: "no_recipient",
          message: "That conversation has no verified email address. Nothing was sent.",
        },
        { status: 409 },
      );
    }

    if (!estimate.pdf_path) {
      return NextResponse.json(
        { error: "no_pdf", message: "The PDF is missing. Re-run the estimate." },
        { status: 409 },
      );
    }

    const content = estimate.content as Estimate;
    const pdf = await readStoredFile(estimate.pdf_path);
    const reference = estimate.id.slice(0, 8).toUpperCase();

    const sent = await sendMail({
      to: session.verifiedEmail,
      /* The team sees replies, because a reply to an estimate is a lead. */
      replyTo: teamInbox(),
      subject: `Your project estimate from Hitasoft (${reference})`,
      html: wrap(`
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Hitasoft</p>
        <h1 style="margin:0 0 16px;font-size:20px;color:#111827;font-weight:600;">Your estimate is attached</h1>
        <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
          Thank you for taking the time to go through your project with us. The attached PDF sets out what we understand you need, how we would build it, what it would cost and how long it would take.
        </p>
        <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
          ${escapeHtml(content.summary)}
        </p>
        <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
          It is an estimate rather than a fixed quote, and the document is honest about what we assumed to get there. The next step is a conversation with the person who would actually run the work — just reply to this email, or reach us on ${escapeHtml(founderContact.phone)}.
        </p>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          The PDF is drafted with AI assistance and reviewed by our team before it reaches you — it can still get something wrong, so treat it as a first, honest read rather than the final word. For a detailed discussion, our founder &amp; CEO is reachable directly at ${escapeHtml(founderContact.email)} or ${escapeHtml(founderContact.phone)}.
        </p>
      `),
      text: [
        `Your estimate is attached.`,
        ``,
        `Thank you for taking the time to go through your project with us. The attached PDF sets out what we understand you need, how we would build it, what it would cost and how long it would take.`,
        ``,
        content.summary,
        ``,
        `It is an estimate rather than a fixed quote, and the document is honest about what we assumed to get there. The next step is a conversation with the person who would actually run the work - just reply to this email, or reach us on ${founderContact.phone}.`,
        ``,
        `The PDF is drafted with AI assistance and reviewed by our team before it reaches you - it can still get something wrong, so treat it as a first, honest read rather than the final word. For a detailed discussion, our founder & CEO is reachable directly at ${founderContact.email} or ${founderContact.phone}.`,
      ].join("\n"),
      attachments: [
        {
          filename: `Hitasoft-estimate-${reference}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    });

    /*
     * !! IT NEVER CLAIMS TO HAVE SENT SOMETHING IT DID NOT !!
     *
     * On a rejection the row is put back to 'ready' so it reappears in the
     * queue and can be tried again. Marking it sent regardless would lose a
     * lead silently, which is the failure /api/quote refuses to make and this
     * route is not allowed to be the one that does.
     */
    if (!sent) {
      await approveEstimateRollback(estimate.id);
      return NextResponse.json(
        {
          error: "send_failed",
          message: "Resend would not take it. Nothing was sent — try again.",
        },
        { status: 502 },
      );
    }

    await markEstimateSent(estimate.id);
    console.info("[admin/estimates] sent", { id: estimate.id });

    return NextResponse.json({ ok: true, sentTo: session.verifiedEmail });
  } catch (cause) {
    console.error("[admin/estimates] failed:", cause);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

/**
 * Puts a failed send back in the queue.
 *
 * Written as a direct status change rather than another store helper, because
 * it is the only caller and naming it in lib/quote-store.ts would invite
 * somebody to use it for something else.
 */
async function approveEstimateRollback(id: string) {
  const { queryStrict } = await import("@/lib/db");
  await queryStrict(
    `UPDATE quote_estimates SET status = 'ready', approved_at = NULL, updated_at = now() WHERE id = $1`,
    [id],
  );
}

/**
 * The admin's "correct and regenerate" button.
 *
 * !! WHAT A VISITOR TYPED IS NOT ALWAYS SOMETHING TO PRICE AGAINST !!
 *
 * "You decide" and "as soon as possible" are honest answers from a visitor
 * and useless ones for a model to write a number against - see the reviewer
 * note that shows up when that happens. This is where a person who actually
 * knows the account can put a real figure in before asking Sonnet to try
 * again, rather than the estimate being stuck with whatever the conversation
 * produced.
 *
 * Budget and timeline are optional and independent: leaving one blank keeps
 * whatever the session already has, exactly the way patchSession's own
 * COALESCE semantics work everywhere else it is called from.
 */
async function handleRegenerate(
  id: string,
  body: { budget?: unknown; timeline?: unknown },
) {
  const estimate = await getEstimate(id);
  if (!estimate) {
    return NextResponse.json({ error: "not_found", message: "No such estimate." }, { status: 404 });
  }

  const budget = typeof body.budget === "string" ? body.budget.trim().slice(0, 500) : "";
  const timeline = typeof body.timeline === "string" ? body.timeline.trim().slice(0, 500) : "";

  if (budget || timeline) {
    await patchSession(estimate.conversation_id, {
      budget: budget || undefined,
      timeline: timeline || undefined,
    });
  }

  const result = await regenerateEstimate(id);

  if (!result.ok) {
    return NextResponse.json(
      { error: "regenerate_failed", message: result.message ?? "Could not regenerate that estimate." },
      { status: 409 },
    );
  }

  console.info("[admin/estimates] regenerated", { id, budgetChanged: Boolean(budget), timelineChanged: Boolean(timeline) });
  return NextResponse.json({ ok: true });
}
