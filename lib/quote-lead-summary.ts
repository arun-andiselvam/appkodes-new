import "server-only";

import { founderContact } from "@/content/contact";
import { serviceOptions } from "@/content/quote-chat";
import { escapeHtml, sendMail, wrap } from "@/lib/quote-email";
import { getSession, listFiles, type Session } from "@/lib/quote-store";

/**
 * The internal notification that fires the moment a lead finishes talking to
 * QuoteBot - before the estimate itself has been written, let alone approved.
 *
 * !! ADDED ON THE CLIENT'S INSTRUCTION OF 28 AUGUST 2026, AND SCOPED TO IT !!
 *
 * "Once the chat is completed for the project leads, send the conversation
 * summary to aarun@hitasoft.com." Two things fall out of reading that
 * literally rather than generalising it:
 *
 *   - The address is hardcoded to founderContact.email, not read from
 *     QUOTE_TO_EMAIL or teamInbox(). Those exist for the enquiry and estimate
 *     mail this site already sends, which go wherever the client has that
 *     routed. This is a specific, named request for a specific inbox, and
 *     treating it as configurable would be answering a question nobody asked.
 *   - It only ever fires from the one call site where a conversation reaches
 *     `queued` - see app/api/quote/chat/route.ts. Nothing here decides what
 *     "completed" means; it trusts that the caller already worked it out, the
 *     same way lib/quote-estimate.ts trusts the phase it is handed.
 *
 * !! IT NEVER BLOCKS THE VISITOR, AND IT NEVER COSTS THEM ANYTHING TWICE !!
 *
 * Always called from inside `after()` at the chat route's call site, same
 * discipline as kicking off the estimate job there - the visitor already has
 * their reply by the time this runs. And it is fire-and-forget on failure:
 * a notification email is bookkeeping for this company, not a promise made to
 * whoever was just talking to the assistant, so a failed send here is logged
 * and swallowed rather than surfaced anywhere a visitor could see it. The
 * lead is not lost if it fails - the estimate job and the /admin queue do not
 * depend on this in any way.
 */
export async function sendLeadSummary(conversationId: string): Promise<void> {
  try {
    const session = await getSession(conversationId);
    if (!session) {
      console.error("[quote/lead-summary] no such conversation", { conversationId });
      return;
    }

    const files = await listFiles(conversationId);

    const service =
      serviceOptions.find((option) => option.value === session.service)?.label ??
      session.service ??
      "not stated";

    const who = session.name || session.verifiedEmail || "a visitor";

    const sent = await sendMail({
      to: founderContact.email,
      /* So a reply from that inbox goes straight back to the lead, not into the void. */
      replyTo: session.verifiedEmail ?? undefined,
      subject: `New lead: ${who} - ${service}`,
      html: wrap(buildHtml(session, files, service)),
      text: buildText(session, files, service),
    });

    if (!sent) {
      console.error("[quote/lead-summary] send failed", { conversationId });
      return;
    }

    console.info("[quote/lead-summary] sent", { conversationId });
  } catch (cause) {
    /*
     * Never lets a broken summary email take the estimate job down with it -
     * this function runs after the estimate row already exists, and the two
     * have nothing else to do with each other.
     */
    console.error("[quote/lead-summary] failed:", cause);
  }
}

type FileRow = Awaited<ReturnType<typeof listFiles>>[number];

function buildHtml(session: Session, files: FileRow[], service: string): string {
  const rows: [string, string][] = [
    ["Name", session.name ?? "not given"],
    ["Email", session.verifiedEmail ?? "not verified"],
    ["WhatsApp", session.whatsapp ?? "not given"],
    ["Service", service],
    ["Budget", session.budget ?? "not stated"],
    ["Timeline", session.timeline ?? "not stated"],
    [
      "Files",
      files.length ? files.map((file) => file.filename).join(", ") : "none attached",
    ],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:6px 0;font-size:14px;color:#111827;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  const transcriptHtml = session.transcript
    .map((turn) => {
      const speaker = turn.role === "user" ? "Visitor" : "QuoteBot";
      return `<p style="margin:0 0 10px;font-size:13px;line-height:1.6;"><strong style="color:${turn.role === "user" ? "#0f556f" : "#6b7280"};">${speaker}:</strong> ${escapeHtml(turn.content)}</p>`;
    })
    .join("");

  return `
    <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Hitasoft</p>
    <h1 style="margin:0 0 18px;font-size:19px;color:#111827;font-weight:600;">A lead just finished talking to QuoteBot</h1>

    <table style="border-collapse:collapse;margin:0 0 22px;">
      ${rowsHtml}
    </table>

    <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
      The estimate is being written now and will need approving in
      <a href="/admin/estimates" style="color:#146f90;">/admin/estimates</a> before it goes out.
    </p>

    <p style="margin:22px 0 8px;font-size:11px;font-weight:600;letter-spacing:0.6px;color:#146f90;text-transform:uppercase;">
      Full conversation
    </p>
    <div style="border-top:1px solid #e5e7eb;padding-top:14px;">
      ${transcriptHtml}
    </div>
  `;
}

function buildText(session: Session, files: FileRow[], service: string): string {
  const lines = [
    "A lead just finished talking to QuoteBot.",
    "",
    `Name: ${session.name ?? "not given"}`,
    `Email: ${session.verifiedEmail ?? "not verified"}`,
    `WhatsApp: ${session.whatsapp ?? "not given"}`,
    `Service: ${service}`,
    `Budget: ${session.budget ?? "not stated"}`,
    `Timeline: ${session.timeline ?? "not stated"}`,
    `Files: ${files.length ? files.map((file) => file.filename).join(", ") : "none attached"}`,
    "",
    "The estimate is being written now and will need approving in /admin/estimates before it goes out.",
    "",
    "--- Full conversation ---",
    "",
    ...session.transcript.map(
      (turn) => `${turn.role === "user" ? "Visitor" : "QuoteBot"}: ${turn.content}`,
    ),
  ];

  return lines.join("\n");
}
