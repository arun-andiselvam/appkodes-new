import "server-only";

/**
 * Sending email through Resend.
 *
 * !! WHY THIS EXISTS WHEN TWO ROUTES ALREADY DO IT INLINE !!
 *
 * app/api/contact/route.ts and app/api/quote/route.ts each build this fetch
 * themselves, and the second one says why: "a second integration against one
 * endpoint still does not earn a dependency". That was right, and it is still
 * right about the `resend` package - nothing here imports one.
 *
 * What changed is the count. The assistant adds two more senders, the code and
 * the estimate, and four copies of the same authorization header with four
 * copies of the same from-address fallback is where one of them quietly drifts
 * and somebody spends an afternoon working out why one email in four comes
 * from the wrong domain. This is a helper, not a dependency.
 *
 * The two existing routes are deliberately NOT rewritten to use it. They work,
 * they are tested, and a refactor of the live contact form is not something to
 * smuggle into a feature branch about a chatbot. They can move when somebody
 * has a reason to touch them.
 */

export type Attachment = {
  filename: string;
  /** Base64, which is the only thing Resend's JSON API takes. */
  content: string;
};

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** The team's inbox, same precedence the quote route already uses. */
export function teamInbox() {
  return process.env.QUOTE_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "info@hitasoft.com";
}

/**
 * Escapes text dropped into an HTML email body.
 *
 * Every value these emails interpolate came from a visitor - the address they
 * typed, the project they described, the filename they uploaded. This is what
 * stands between that and HTML injection into whatever reads the notification.
 * Same helper and same reason as /api/contact and /api/quote.
 */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends one email. True if Resend accepted it.
 *
 * Returns false rather than throwing on a rejection, and throws only when the
 * network itself failed, matching the shape the existing routes expect. The
 * caller decides what a failure means, because it differs: a code that does
 * not send has to be reported to the visitor immediately, while an estimate
 * that does not send should stay queued and be retried.
 *
 * !! IT NEVER PRETENDS. A false HERE MUST NOT BECOME A SUCCESS UPSTREAM. !!
 *
 * /api/quote refuses to thank somebody for a message it could not deliver, and
 * calls that the worst failure available on a conversion surface. Everything
 * built on this helper is held to the same standard.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM_EMAIL || "Hitasoft site <contact@hitasoft.com>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      ...(mail.attachments?.length ? { attachments: mail.attachments } : {}),
    }),
  });

  if (!response.ok) {
    /*
     * The body carries Resend's reason - an unverified domain, a suppressed
     * address, a malformed attachment. Without it every failure looks the same
     * in the log and the first hour of debugging is spent finding out which.
     */
    console.error(
      `[quote-email] Resend rejected: ${response.status}`,
      await response.text().catch(() => ""),
    );
    return false;
  }

  return true;
}

/* ------------------------------------------------------------- the wrapper */

/**
 * The shell every email from the assistant sits in.
 *
 * Inline styles and a table-free layout, because email clients are not
 * browsers and Outlook in particular is not a browser. Nothing here is clever
 * on purpose - a plain centred column renders the same everywhere, and an
 * estimate that arrives looking broken undoes the work that produced it.
 */
export function wrap(body: string) {
  return `
<div style="margin:0;padding:24px;background:#f4f5f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    ${body}
    <p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
      Hitasoft — Madurai, Tamil Nadu, India
    </p>
  </div>
</div>`.trim();
}
