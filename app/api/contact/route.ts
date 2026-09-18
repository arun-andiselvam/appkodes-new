import { NextResponse } from "next/server";
import { quoteSteps } from "@/content/quote-flow";

/**
 * Where the contact form posts.
 *
 * !! IT HAS TO BE A ROUTE ON THIS ORIGIN !!
 *
 * proxy.ts sets `form-action 'self'` and a `connect-src` allowing only this
 * origin and the Vercel vitals endpoint. A third party form embed, or a fetch
 * straight to Formspree or similar from the browser, is blocked by that policy
 * before it leaves the page. Loosening the CSP to allow one is the wrong trade
 * on a site whose whole security section is about where data goes.
 *
 * So the browser posts here and the server forwards it. Two delivery
 * channels are supported, checked in this order:
 *
 *   RESEND_API_KEY=re_...
 *
 * Resend, added 25 August 2026 once hitasoft.com was a verified sending
 * domain there (see the DNS notes from that setup — a subdomain scoped
 * enough not to touch the existing Google Workspace MX records). Preferred
 * when set: it emails the submission straight to CONTACT_TO_EMAIL
 * (info@hitasoft.com if unset) with reply-to set to the sender, so replying
 * to the notification replies to them, not to this inbox.
 *
 *   CONTACT_WEBHOOK_URL=https://...
 *
 * The original, provider agnostic fallback: Zapier, Make, n8n, a Slack
 * incoming webhook and most form services all take a JSON POST. Used only
 * when RESEND_API_KEY is not set.
 *
 * !! WITH NEITHER SET, THIS RETURNS 503 AND SAYS SO !!
 *
 * It does not pretend to succeed. A form that thanks somebody and drops the
 * message is worse than a form that admits it is not connected, and this is
 * the page every call to action on the site points at.
 */

/** Longest we will accept in any one field, to keep a paste bomb out. */
const LIMITS = { name: 120, email: 200, company: 160, phone: 40, message: 4000, budget: 40 };

/*
 * Budget band value to the label a person reads, from the quote assistant's own
 * step so the two forms agree. Added 10 September 2026 with the budget field on
 * the contact form. Anything posted that is not one of these values is dropped
 * rather than forwarded, since the field is a select and a value outside it
 * means the request was not made by the form.
 */
const budgetStep = quoteSteps.budget;
const BUDGET_LABELS = new Map(
  (budgetStep && "options" in budgetStep ? budgetStep.options : []).map((option) => [
    option.value,
    option.label,
  ]),
);

type Payload = Record<string, unknown>;

function asString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Good enough, deliberately.
 *
 * Full RFC 5322 validation rejects addresses that work and accepts ones that
 * do not. The only question worth asking here is whether somebody typed
 * something shaped like an address, and the real check is that a reply
 * arrives.
 */
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

type Fields = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  /** The band's label, not its value. Empty when none was chosen. */
  budget: string;
};

/** Escapes text dropped into the HTML email body. Every field here is user
 * supplied, so this is what stands between a submission and HTML injection
 * in whatever reads the notification. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * One row in the notification email's field table.
 *
 * `value` is escaped here, so callers pass the raw field, never markup — the
 * one exception is the email row below, which builds its own `<a>` and skips
 * this helper entirely rather than fight its escaping.
 *
 * Skipped entirely (both label and value) when the field is empty, same as
 * the plain text version omits it.
 */
function fieldRow(label: string, value: string) {
  if (!value) return "";
  return `
      <tr>
        <td style="padding:10px 0;color:#6b7280;font-size:13px;width:100px;vertical-align:top;white-space:nowrap;">${label}</td>
        <td style="padding:10px 0;font-size:15px;color:#1a1a1a;">${escapeHtml(value)}</td>
      </tr>`;
}

/**
 * Sends the submission as an email via Resend's HTTP API.
 *
 * A plain fetch rather than the `resend` package: this route already talks
 * to two other HTTP APIs (the webhook, Turnstile's siteverify) with fetch
 * alone, and a one-endpoint integration does not earn a new dependency.
 *
 * Returns true/false for delivered/rejected. Throws only on a network
 * failure, same shape as the webhook path below, so the caller can tell "they
 * said no" apart from "we could not reach them".
 */
async function deliverViaResend(fields: Fields) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from = process.env.RESEND_FROM_EMAIL || "Hitasoft site <contact@hitasoft.com>";
  const to = process.env.CONTACT_TO_EMAIL || "info@hitasoft.com";

  // #0052ff is --brand-blue in app/brand.css, the same colour as the site's
  // primary button. Everything else is inline because email clients do not
  // read a <style> block reliably, let alone Tailwind.
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#0052ff;padding:24px 32px;border-radius:8px 8px 0 0;">
    <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ffffffb3;">Hitasoft</p>
    <p style="margin:4px 0 0;font-size:20px;font-weight:600;color:#ffffff;">New enquiry</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:8px 32px 28px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      ${fieldRow("Name", fields.name)}
      <tr>
        <td style="padding:10px 0;color:#6b7280;font-size:13px;width:100px;vertical-align:top;white-space:nowrap;">Email</td>
        <td style="padding:10px 0;font-size:15px;">
          <a href="mailto:${escapeHtml(fields.email)}" style="color:#0052ff;text-decoration:none;">${escapeHtml(fields.email)}</a>
        </td>
      </tr>
      ${fieldRow("Company", fields.company)}
      ${fieldRow("Phone", fields.phone)}
      ${fieldRow("Budget", fields.budget)}
    </table>
    <div style="margin-top:12px;padding-top:20px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Message</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:15px;color:#1a1a1a;">${escapeHtml(fields.message)}</p>
    </div>
  </div>
  <p style="margin:16px 4px 0;font-size:12px;color:#9ca3af;">Sent from the contact form at hitasoft.com/contact. Reply to this email to reach ${escapeHtml(fields.name)} directly.</p>
</div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      // So a reply from the inbox that receives this goes straight to the
      // person who wrote in, not back to this notification address.
      reply_to: fields.email,
      subject: `New enquiry from ${fields.name}`,
      html,
      // Kept alongside html: the client that renders no HTML at all is rare
      // but not zero, and Resend sends both in the same message either way.
      text: [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        fields.company && `Company: ${fields.company}`,
        fields.phone && `Phone: ${fields.phone}`,
        fields.budget && `Budget: ${fields.budget}`,
        "",
        fields.message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  /*
   * The honeypot. A field hidden from people and left empty by them, which
   * most bots fill in because they cannot see it is hidden.
   *
   * Answering 200 rather than 400 is on purpose: a bot told it failed will try
   * again differently.
   */
  if (asString(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  // Cloudflare Turnstile, added 24 August 2026 for what the honeypot alone
  // does not catch. Unset TURNSTILE_SECRET_KEY skips this entirely, matching
  // every other optional integration on this route: no key configured means
  // no check, not a wall every submission fails.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = asString(body["cf-turnstile-response"], 2000);
    if (!token) {
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 400 },
      );
    }

    try {
      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: token,
            remoteip: request.headers.get("cf-connecting-ip") ?? undefined,
          }),
        },
      );
      const outcome = (await verification.json().catch(() => ({}))) as {
        success?: boolean;
      };
      if (!outcome.success) {
        return NextResponse.json(
          { error: "That did not send. Please try again." },
          { status: 400 },
        );
      }
    } catch (cause) {
      console.error("[contact] Turnstile verification unreachable:", cause);
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 502 },
      );
    }
  }

  const name = asString(body.name, LIMITS.name);
  const email = asString(body.email, LIMITS.email);
  const company = asString(body.company, LIMITS.company);
  const phone = asString(body.phone, LIMITS.phone);
  const message = asString(body.message, LIMITS.message);
  // The label for a known band, or nothing. See BUDGET_LABELS above.
  const budget = BUDGET_LABELS.get(asString(body.budget, LIMITS.budget)) ?? "";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Tell us who you are.";
  if (!email) errors.email = "We need somewhere to reply.";
  else if (!looksLikeEmail(email)) errors.email = "That does not look like an email address.";
  if (!message) errors.message = "Tell us what you are trying to fix.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!resendConfigured && !webhook) {
    // Logged so a submission during setup is at least recoverable from the
    // server output rather than lost silently.
    console.warn("[contact] Neither RESEND_API_KEY nor CONTACT_WEBHOOK_URL is set. Message not delivered:", {
      name,
      email,
      company,
    });

    return NextResponse.json(
      {
        error:
          "The form is not connected yet, so this did not send. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  try {
    const delivered = resendConfigured
      ? await deliverViaResend({ name, email, company, phone, message, budget })
      : await (async () => {
          const forwarded = await fetch(webhook as string, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              company,
              phone,
              message,
              budget,
              // Server side rather than from the client, so it cannot be spoofed.
              receivedAt: new Date().toISOString(),
              source: "hitasoft.com/contact",
            }),
          });
          return forwarded.ok;
        })();

    if (!delivered) {
      console.error(
        `[contact] ${resendConfigured ? "Resend" : "webhook"} rejected the message.`,
      );
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error(
      `[contact] ${resendConfigured ? "Resend" : "webhook"} unreachable:`,
      cause,
    );
    return NextResponse.json(
      { error: "That did not send. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
