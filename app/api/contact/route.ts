import { NextResponse } from "next/server";

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
const LIMITS = { name: 120, email: 200, company: 160, phone: 40, message: 4000 };

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

type Fields = { name: string; email: string; company: string; phone: string; message: string };

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
      text: [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        fields.company && `Company: ${fields.company}`,
        fields.phone && `Phone: ${fields.phone}`,
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
      ? await deliverViaResend({ name, email, company, phone, message })
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
