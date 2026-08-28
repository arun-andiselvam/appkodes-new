import { NextResponse } from "next/server";

/**
 * Where the quote assistant posts.
 *
 * Same origin rule as /api/contact, and for the same reason: proxy.ts sets
 * `form-action 'self'` and a connect-src allowing only this origin, so a fetch
 * straight to a third party form service is blocked before it leaves the page.
 *
 * !! IT NEVER CLAIMS TO HAVE SENT SOMETHING IT DID NOT !!
 *
 * Two delivery channels, checked in this order - the same pair, and the same
 * order, as /api/contact:
 *
 *   RESEND_API_KEY        preferred. Emails the enquiry, with the answer trail
 *                         as a table and the attached document carried as a
 *                         real attachment.
 *   QUOTE_WEBHOOK_URL     fallback, or CONTACT_WEBHOOK_URL if that is unset.
 *                         A JSON POST for Zapier, Make, n8n or Slack. The
 *                         document is named rather than carried; see below.
 *
 * With neither set this returns 503 and says so. A form that thanks somebody
 * and drops the message is the worst failure available on a conversion
 * surface, and /api/contact refuses to do it - this route is not allowed to be
 * the one that does.
 *
 * Multipart rather than JSON, because of the attachment. Route handlers read
 * it with request.formData() and no configuration.
 *
 * !! THE 8MB CEILING IS NOT ARBITRARY !!
 *
 * This project runs proxy.ts, so Next clones and buffers every request body in
 * memory to let both the proxy and this handler read it. That buffer is capped
 * at 10MB by default, and a body over the cap is TRUNCATED WITH A WARNING
 * rather than rejected - from the browser that looks like an upload that
 * worked and an attachment that vanished. Raising ATTACHMENT.maxBytes means
 * raising experimental.proxyClientMaxBodySize in next.config.mjs in the same
 * change, and neither should go far.
 */

import { ATTACHMENT } from "@/content/quote-flow";
import { founderContact } from "@/content/contact";
import { recordSubmission } from "@/lib/db";

/** Longest we accept in any one field, to keep a paste bomb out. */
const LIMITS = { name: 120, email: 200, brief: 6000, answers: 4000 };

type Answer = { field: string; label: string; value: string };

/**
 * Escapes text dropped into the HTML email body.
 *
 * Every field here is supplied by whoever filled the form in, so this is what
 * stands between a submission and HTML injection in whatever reads the
 * notification. Same helper, same reason, as /api/contact.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asString(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Good enough, deliberately - the same call /api/contact makes.
 *
 * Full RFC 5322 validation rejects addresses that work and accepts ones that
 * do not. The only question worth asking is whether somebody typed something
 * shaped like an address; the real check is that a reply arrives.
 */
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * The answer trail, parsed back into something printable.
 *
 * Everything here was posted by a browser and none of it is trusted. The
 * shape is checked field by field rather than cast, and anything that is not
 * a well formed row is dropped rather than allowed through to the email
 * template.
 */
function parseAnswers(raw: string): Answer[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is Answer =>
          typeof row === "object" &&
          row !== null &&
          typeof (row as Answer).field === "string" &&
          typeof (row as Answer).label === "string",
      )
      .slice(0, 12)
      .map((row) => ({
        field: row.field.slice(0, 40),
        label: row.label.slice(0, 200),
        value: String(row.value ?? "").slice(0, 60),
      }));
  } catch {
    return [];
  }
}

type Delivery = {
  name: string;
  email: string;
  brief: string;
  answers: Answer[];
  attachment: { filename: string; base64: string } | null;
};

/**
 * Sends the enquiry as an email through Resend's HTTP API.
 *
 * A plain fetch rather than the `resend` package, matching /api/contact: that
 * route makes the same call the same way, and a second integration against one
 * endpoint still does not earn a dependency. (The Anthropic SDK is a different
 * case and its route says why - parsing a streamed SSE response is not one
 * JSON POST.)
 *
 * Returns true/false for delivered/rejected. Throws only on a network failure,
 * so the caller can tell "they said no" apart from "we could not reach them".
 */
async function deliverViaResend(fields: Delivery) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from = process.env.RESEND_FROM_EMAIL || "Hitasoft site <contact@hitasoft.com>";
  /*
   * Its own address if one is set, so quotes can be routed somewhere different
   * from general contact form traffic, falling back to the contact inbox and
   * then to the same default that route uses.
   */
  const to =
    process.env.QUOTE_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "info@hitasoft.com";

  /*
   * The answer trail as a real table.
   *
   * This is the reason the quote has its own route rather than reusing
   * /api/contact. Flattened into that route's single message field, the trail
   * arrives as a paragraph somebody has to read twice; as rows it can be
   * skimmed in the inbox preview and triaged without opening anything.
   */
  const rows = fields.answers
    .map(
      (answer) => `
      <tr>
        <td style="padding:9px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;white-space:nowrap;">${escapeHtml(answer.field)}</td>
        <td style="padding:9px 0;font-size:15px;color:#1a1a1a;">${escapeHtml(answer.label)}</td>
      </tr>`,
    )
    .join("");

  const attachmentNote = fields.attachment
    ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280;">Attached: ${escapeHtml(fields.attachment.filename)}</p>`
    : "";

  // #146f90 is --brand-blue in app/brand.css, the same colour as the site's
  // primary button. Everything is inline because email clients do not read a
  // <style> block reliably, let alone Tailwind.
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#146f90;padding:24px 32px;border-radius:8px 8px 0 0;">
    <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ffffffb3;">Hitasoft</p>
    <p style="margin:4px 0 0;font-size:20px;font-weight:600;color:#ffffff;">Quote request</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:8px 32px 28px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:9px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;white-space:nowrap;">Name</td>
        <td style="padding:9px 0;font-size:15px;color:#1a1a1a;">${escapeHtml(fields.name)}</td>
      </tr>
      <tr>
        <td style="padding:9px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;white-space:nowrap;">Email</td>
        <td style="padding:9px 0;font-size:15px;">
          <a href="mailto:${escapeHtml(fields.email)}" style="color:#146f90;text-decoration:none;">${escapeHtml(fields.email)}</a>
        </td>
      </tr>
      ${rows}
    </table>
    ${
      fields.brief
        ? `<div style="margin-top:12px;padding-top:20px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">In their words</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:15px;color:#1a1a1a;">${escapeHtml(fields.brief)}</p>
    </div>`
        : ""
    }
    ${attachmentNote}
  </div>
  <p style="margin:16px 4px 0;font-size:12px;color:#9ca3af;">Sent from the quote assistant at hitasoft.com. Reply to this email to reach ${escapeHtml(fields.name)} directly.</p>
</div>`;

  /*
   * The budget rides in the subject line, so the inbox is triageable without
   * opening anything. It is the one answer that decides who picks this up.
   */
  const budget = fields.answers.find((answer) => answer.field === "Budget");
  const subject = budget
    ? `Quote request from ${fields.name} - ${budget.label}`
    : `Quote request from ${fields.name}`;

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
      subject,
      html,
      text: [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        ...fields.answers.map((answer) => `${answer.field}: ${answer.label}`),
        ``,
        fields.brief || "(nothing typed)",
        fields.attachment ? `\nAttached: ${fields.attachment.filename}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      /*
       * The document they attached, forwarded as a real attachment rather than
       * a link - there is nowhere on this site that stores files, and a link
       * would need one.
       */
      ...(fields.attachment
        ? {
            attachments: [
              {
                filename: fields.attachment.filename,
                content: fields.attachment.base64,
              },
            ],
          }
        : {}),
    }),
  });

  return response.ok;
}

/**
 * The acknowledgement, sent to the person who wrote in.
 *
 * !! THIS IS THE SECOND EMAIL, AND IT IS NOT OPTIONAL POLISH !!
 *
 * For a while the route sent one email, to us. Somebody described their
 * business in a textarea, attached a document, pressed send, and got a line on
 * a screen they were about to close. No record of what they said, no proof the
 * file arrived, and nothing in their inbox to reply to until a person got
 * round to it. A company selling automation that cannot manage an
 * acknowledgement is a poor first impression.
 *
 * !! IT PROMISES NO RESPONSE TIME !!
 *
 * "We will reply within 24 hours" is exactly the kind of figure
 * content/services.ts bans, and this is the worst place to publish one - it is
 * a promise made to somebody's face, in writing, that somebody else has to
 * keep. It says a person will read it and write back, which is a promise about
 * form rather than a number to be held to.
 *
 * The attachment is named, not re-attached. They have their own copy; sending
 * it back to them is bytes nobody needs.
 *
 * Failure here is logged and swallowed. The enquiry is already delivered by
 * the time this runs, and telling somebody their message did not send because
 * their own copy bounced would be a lie with consequences.
 */
async function acknowledgeToVisitor(fields: Delivery) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL || "Hitasoft <contact@hitasoft.com>";
  /* Replies come back to whoever handles enquiries, not into the void. */
  const replyTo =
    process.env.QUOTE_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "info@hitasoft.com";

  const rows = fields.answers
    .map(
      (answer) => `
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;width:120px;vertical-align:top;">${escapeHtml(answer.field)}</td>
        <td style="padding:8px 0;font-size:15px;color:#1a1a1a;">${escapeHtml(answer.label)}</td>
      </tr>`,
    )
    .join("");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:#146f90;padding:24px 32px;border-radius:8px 8px 0 0;">
    <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ffffffb3;">Hitasoft</p>
    <p style="margin:4px 0 0;font-size:20px;font-weight:600;color:#ffffff;">We have your enquiry</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px 32px 28px;">
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1a1a1a;">
      Thanks ${escapeHtml(fields.name.split(" ")[0] || fields.name)} — this is a copy of what you sent us, so you have it.
      Someone will read it properly and write back to you here.
    </p>

    ${
      rows
        ? `<table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">${rows}</table>`
        : ""
    }

    ${
      fields.brief
        ? `<div style="margin-top:16px;padding-top:20px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">What you told us</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:15px;color:#1a1a1a;">${escapeHtml(fields.brief)}</p>
    </div>`
        : ""
    }

    ${
      fields.attachment
        ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280;">Your document <strong>${escapeHtml(fields.attachment.filename)}</strong> came through with it.</p>`
        : ""
    }

    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">If it is easier to talk it through:</p>
      <p style="margin:0;font-size:15px;">
        <a href="${founderContact.whatsapp}" style="color:#146f90;text-decoration:none;">WhatsApp</a>
        &nbsp;·&nbsp;
        <a href="${founderContact.tel}" style="color:#146f90;text-decoration:none;">${escapeHtml(founderContact.phone)}</a>
      </p>
    </div>
  </div>
  <p style="margin:16px 4px 0;font-size:12px;color:#9ca3af;">
    You are getting this because you asked for a quote at hitasoft.com. We use your address to reply to you and nothing else — no list, no sequence.
  </p>
</div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: fields.email,
        reply_to: replyTo,
        subject: "We have your enquiry — Hitasoft",
        html,
        text: [
          `Thanks ${fields.name.split(" ")[0] || fields.name} — this is a copy of what you sent us.`,
          ``,
          ...fields.answers.map((answer) => `${answer.field}: ${answer.label}`),
          ``,
          fields.brief || "",
          fields.attachment ? `\nAttached: ${fields.attachment.filename}` : "",
          ``,
          `Someone will read it and write back here.`,
          `If it is easier to talk: ${founderContact.phone}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("[quote] Acknowledgement to visitor was rejected.");
    }
  } catch (cause) {
    console.error("[quote] Acknowledgement to visitor failed:", cause);
  }
}

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  /*
   * The honeypot. A field hidden from people and left empty by them, which
   * most bots fill because they cannot see it is hidden.
   *
   * Answering 200 rather than 400 is on purpose: a bot told it failed will
   * try again differently.
   */
  if (asString(form.get("website"), 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  /*
   * Cloudflare Turnstile, the check the honeypot alone does not cover.
   *
   * Unset TURNSTILE_SECRET_KEY skips this entirely, matching /api/contact and
   * every other optional integration on this site: no key configured means no
   * check, not a wall every submission fails.
   *
   * Verified before anything else is read, and well before the file is decoded
   * or Resend is called - there is no reason to spend work on a submission
   * that is about to be refused.
   */
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = asString(form.get("cf-turnstile-response"), 2000);
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
      console.error("[quote] Turnstile verification unreachable:", cause);
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 502 },
      );
    }
  }

  const name = asString(form.get("name"), LIMITS.name);
  const email = asString(form.get("email"), LIMITS.email);
  const brief = asString(form.get("brief"), LIMITS.brief);
  const answers = parseAnswers(asString(form.get("answers"), LIMITS.answers));

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Tell us who you are.";
  if (!email) errors.email = "We need somewhere to reply.";
  else if (!looksLikeEmail(email)) errors.email = "That does not look like an email address.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: Object.values(errors)[0], errors },
      { status: 400 },
    );
  }

  /*
   * The attachment, checked again here. The modal runs the same two checks
   * before upload, but anything can post to this route, so the browser's
   * opinion of a file is a convenience rather than a control.
   */
  const upload = form.get("attachment");
  let attachment: { filename: string; base64: string; bytes: number } | null = null;

  if (upload && typeof upload !== "string" && upload.size > 0) {
    if (upload.size > ATTACHMENT.maxBytes) {
      return NextResponse.json(
        { error: "That file is over 8MB. Send a lighter copy, or describe it instead." },
        { status: 413 },
      );
    }
    if (upload.type && !ATTACHMENT.allowedTypes.includes(upload.type as never)) {
      return NextResponse.json(
        { error: "That is not a document we can read. PDF, Word or plain text." },
        { status: 415 },
      );
    }

    /*
     * Read once, here, into base64 for the mail API.
     *
     * The size was checked above, so this is bounded at 8MB in and around
     * 11MB once encoded. Doing it before the delivery call keeps a corrupt or
     * unreadable upload from being discovered halfway through sending.
     */
    const bytes = Buffer.from(await upload.arrayBuffer());
    attachment = {
      /* Strip any path a browser might send, and keep it to a sane length. */
      filename: (upload.name.split(/[/\\]/).pop() || "attachment").slice(0, 120),
      base64: bytes.toString("base64"),
      bytes: upload.size,
    };
  }

  /* ------------------------------------------------------------ delivery */

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const webhook = process.env.QUOTE_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;

  if (!resendConfigured && !webhook) {
    /*
     * Logged so an enquiry sent during setup is at least recoverable from the
     * server output rather than lost silently.
     */
    console.warn("[quote] No delivery channel configured. Enquiry not delivered:", {
      name,
      email,
      answers: answers.map((row) => `${row.field}: ${row.label}`),
    });

    return NextResponse.json(
      {
        error:
          "The quote form is not connected yet, so this did not send. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  try {
    const delivered = resendConfigured
      ? await deliverViaResend({ name, email, brief, answers, attachment })
      : await (async () => {
          const forwarded = await fetch(webhook as string, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              brief,
              answers,
              /*
               * Named, not carried. A webhook receiver is usually a chat
               * message or a spreadsheet row, and posting 11MB of base64 at
               * one is how you break it. Resend is the channel that takes the
               * document; this one says a document exists.
               */
              attachment: attachment
                ? { filename: attachment.filename, bytes: attachment.bytes }
                : null,
              // Server side rather than from the client, so it cannot be spoofed.
              receivedAt: new Date().toISOString(),
              source: "hitasoft.com quote assistant",
            }),
          });
          return forwarded.ok;
        })();

    if (!delivered) {
      console.error(
        `[quote] ${resendConfigured ? "Resend" : "webhook"} rejected the enquiry.`,
      );
      return NextResponse.json(
        { error: "That did not send. Please try again." },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error(
      `[quote] ${resendConfigured ? "Resend" : "webhook"} unreachable:`,
      cause,
    );
    return NextResponse.json(
      { error: "That did not send. Please try again." },
      { status: 502 },
    );
  }

  /*
   * Their copy, after ours. Order matters: if this ran first and the
   * notification then failed, somebody would hold a receipt for an enquiry
   * nobody received.
   */
  await acknowledgeToVisitor({ name, email, brief, answers, attachment });

  console.info("[quote] Delivered:", {
    email,
    answers: answers.length,
    attachment: attachment ? `${attachment.filename} (${attachment.bytes} bytes)` : "none",
  });

  /*
   * Archived after delivery, deliberately.
   *
   * A row carrying submitted_at means the email actually went, which is the
   * only reading of that column that is worth anything. Writing it first would
   * leave the archive claiming enquiries were sent that were refused by Resend
   * a moment later.
   *
   * recordSubmission swallows its own failures. The enquiry is already in the
   * inbox by this point, and telling somebody their message did not send
   * because a bookkeeping row failed would be the worst possible trade.
   */
  const conversationId = asString(form.get("conversationId"), 64);
  if (/^[a-f0-9-]{8,64}$/i.test(conversationId)) {
    await recordSubmission({
      id: conversationId,
      placement: asString(form.get("placement"), 40) || undefined,
      answers,
      brief,
      name,
      email,
      attachmentName: attachment?.filename ?? null,
      attachmentBytes: attachment?.bytes ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}
