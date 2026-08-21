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
 * So the browser posts here and the server forwards it. The forwarding target
 * is a webhook URL in the environment, which keeps this provider agnostic:
 * Zapier, Make, n8n, a Slack incoming webhook and most form services all take
 * a JSON POST.
 *
 *   CONTACT_WEBHOOK_URL=https://...
 *
 * !! WITH NO WEBHOOK SET, THIS RETURNS 503 AND SAYS SO !!
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
   * A captcha would be the stronger answer and would mean allowing a third
   * party script and frame through the CSP, which is a real cost for a form
   * that will see a handful of submissions a week. Revisit if spam arrives.
   *
   * Answering 200 rather than 400 is on purpose: a bot told it failed will try
   * again differently.
   */
  if (asString(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
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

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    // Logged so a submission during setup is at least recoverable from the
    // server output rather than lost silently.
    console.warn("[contact] CONTACT_WEBHOOK_URL is not set. Message not delivered:", {
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
    const forwarded = await fetch(webhook, {
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

    if (!forwarded.ok) {
      console.error("[contact] webhook rejected the message:", forwarded.status);
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error("[contact] webhook unreachable:", cause);
    return NextResponse.json(
      { error: "That did not send. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
