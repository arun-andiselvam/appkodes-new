import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { databaseConfigured } from "@/lib/db";
import { emailConfigured, escapeHtml, sendMail, wrap } from "@/lib/quote-email";
import {
  CODE_TTL_SECONDS,
  MAX_SENDS_PER_HOUR,
  RESEND_COOLDOWN_SECONDS,
  generateCode,
  hashCode,
  looksLikeEmail,
  normaliseEmail,
  normaliseWhatsapp,
} from "@/lib/quote-otp";
import { getSession, insertOtp, patchSession, recentSendsTo } from "@/lib/quote-store";
import { callerKey, overLimit } from "@/lib/rate-limit";

/**
 * Sends the verification code.
 *
 * !! THIS ENDPOINT PUTS EMAIL INTO A STRANGER'S INBOX ON REQUEST !!
 *
 * That is the thing to hold in mind about every check below. Nothing here
 * authenticates the caller, and the address is whatever was typed into a chat
 * window - so an unguarded version of this route is a machine for sending mail
 * to people who never asked for it, from a domain we had to verify to be
 * allowed to send from at all. Getting that domain a reputation for it would
 * cost more than this whole feature is worth.
 *
 * Four gates, cheapest first:
 *
 *   1. The conversation must exist and be standing at the verify phase. (db)
 *   2. The caller must be inside the per-address hourly ceiling.         (db)
 *   3. The caller must be past the resend cooldown.                      (db)
 *   4. The caller's IP must be inside its own budget.                (memory)
 *
 * Gate 1 is the strongest and the least obvious. A conversation only reaches
 * `verify` by actually having one - the model has to have talked to somebody
 * about a project first. Sending a code costs an attacker a real conversation
 * per address, which is a far better defence than any counter.
 */

const CONVERSATION_ID = /^[a-f0-9-]{8,64}$/i;

export async function POST(request: Request) {
  /*
   * No database, no assistant. Stated plainly rather than degraded: with
   * nowhere to keep a phase there is nothing to verify against, and a code
   * sent that nothing can check is worse than no code. The modal never gets
   * here - it is told the assistant is unavailable when it opens - so this is
   * the belt to that braces.
   */
  if (!databaseConfigured()) {
    return NextResponse.json(
      { error: "unconfigured", message: "Verification is not switched on." },
      { status: 503 },
    );
  }

  if (!emailConfigured()) {
    return NextResponse.json(
      {
        error: "unconfigured",
        message:
          "I cannot send a code right now. Leave your address with the team and somebody will pick this up directly.",
      },
      { status: 503 },
    );
  }

  let body: {
    conversationId?: unknown;
    email?: unknown;
    whatsapp?: unknown;
    name?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const conversationId =
    typeof body.conversationId === "string" && CONVERSATION_ID.test(body.conversationId)
      ? body.conversationId
      : null;

  if (!conversationId) {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? normaliseEmail(body.email) : "";
  if (!looksLikeEmail(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "That does not look like an email address." },
      { status: 400 },
    );
  }

  /*
   * !! REQUIRED, AND ENFORCED HERE - NOT ONLY IN THE FORM !!
   *
   * Collected on the client's instruction of 28 August 2026, alongside the
   * address. Same reasoning as everywhere else the server re-checks what a
   * form already validated: a client control is a suggestion, and the PDF
   * this name ends up on ("Prepared for ...") is a document a person reads,
   * not a field a request can leave blank.
   */
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  if (!name) {
    return NextResponse.json(
      { error: "invalid_name", message: "What name should the estimate go to?" },
      { status: 400 },
    );
  }

  /* Cheap and in memory, so an obvious flood never reaches the database. */
  if (overLimit("otp-send", callerKey(request), 8, 60 * 60_000)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many codes requested. Try again later." },
      { status: 429 },
    );
  }

  try {
    const session = await getSession(conversationId);

    if (!session) {
      return NextResponse.json({ error: "Could not read that." }, { status: 400 });
    }

    /*
     * Already done. Answered as a success rather than an error, because the
     * realistic cause is a double-tapped button or a retried request, and the
     * outcome the caller wanted is already true. Telling them it failed would
     * make the UI ask for a code that will never be sent.
     */
    if (session.verifiedEmail) {
      return NextResponse.json({ ok: true, alreadyVerified: true, phase: session.phase });
    }

    /*
     * !! THE PHASE GATE. THIS IS THE REAL DEFENCE ON THIS ROUTE. !!
     *
     * A conversation reaches `verify` only by having had one, which makes
     * sending a code to an arbitrary address cost an attacker several model
     * turns rather than a single POST. Every counter in this file is a
     * secondary limit on top of that.
     */
    if (session.phase !== "verify") {
      return NextResponse.json(
        {
          error: "wrong_phase",
          message: "Let us talk about the project a little first.",
        },
        { status: 409 },
      );
    }

    /* Cooldown, counted against the address across every conversation. */
    if (await recentSendsTo(email, RESEND_COOLDOWN_SECONDS)) {
      return NextResponse.json(
        {
          error: "cooldown",
          message: `A code went out less than a minute ago. Give it a moment — check spam while you wait.`,
          retryAfter: RESEND_COOLDOWN_SECONDS,
        },
        { status: 429 },
      );
    }

    if ((await recentSendsTo(email, 60 * 60)) >= MAX_SENDS_PER_HOUR) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message:
            "That address has had several codes in the last hour. Try again later, or reach the team directly.",
        },
        { status: 429 },
      );
    }

    /*
     * The WhatsApp number, if they offered one.
     *
     * Written before the code is sent and never required. Nothing downstream
     * blocks on it - see the column comment in scripts/quote-schema.sql - so a
     * visitor who declines loses nothing, and one who gives it does not have
     * to repeat it if the send then fails.
     */
    const whatsapp =
      typeof body.whatsapp === "string" ? normaliseWhatsapp(body.whatsapp) : null;

    /*
     * Written together, in one statement - the name is required and the
     * WhatsApp number is not, but there is only one write to make either way
     * and no reason to split it into two.
     */
    await patchSession(conversationId, { name, whatsapp });

    const code = generateCode();

    /*
     * Written down before it is sent, not after.
     *
     * The other order loses the code whenever the email succeeds and the
     * insert then fails: the visitor is holding a perfectly good code that
     * nothing here can recognise. This way the failure mode is a stored code
     * that never arrived, which the resend button already fixes.
     */
    await insertOtp({
      id: randomUUID(),
      conversationId,
      email,
      codeHash: hashCode(code, conversationId),
      expiresAt: new Date(Date.now() + CODE_TTL_SECONDS * 1000),
    });

    const minutes = Math.round(CODE_TTL_SECONDS / 60);
    const sent = await sendMail({
      to: email,
      subject: `${code} is your Hitasoft verification code`,
      html: wrap(`
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Hitasoft</p>
        <h1 style="margin:0 0 16px;font-size:20px;color:#111827;font-weight:600;">Your verification code</h1>
        <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
          Enter this in the chat window to carry on. Your estimate will be sent to this address.
        </p>
        <p style="margin:0 0 20px;font-size:34px;letter-spacing:8px;font-weight:600;color:#111827;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
          ${escapeHtml(code)}
        </p>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          It expires in ${minutes} minutes. If you did not ask for this, ignore it — nothing happens until the code is used.
        </p>
      `),
      text: [
        `Your Hitasoft verification code is ${code}`,
        ``,
        `Enter it in the chat window to carry on. Your estimate will be sent to this address.`,
        `The code expires in ${minutes} minutes.`,
        ``,
        `If you did not ask for this, ignore it - nothing happens until the code is used.`,
      ].join("\n"),
    });

    /*
     * !! IT NEVER CLAIMS TO HAVE SENT SOMETHING IT DID NOT !!
     *
     * The same standard /api/quote holds itself to. A UI that asks for a code
     * which is not coming leaves somebody staring at an empty inbox blaming
     * themselves, and it is the assistant that failed.
     */
    if (!sent) {
      return NextResponse.json(
        {
          error: "send_failed",
          message: "The code would not send. Try once more, or give the team a call.",
        },
        { status: 502 },
      );
    }

    console.info("[quote/otp] code sent", { conversationId });

    /*
     * The address is echoed back so the window can say "check bob@x.com"
     * rather than "check your email", which is what catches a typo before
     * somebody spends ten minutes waiting on a code that went to the wrong
     * place. It is the address they just typed - nothing is disclosed.
     */
    return NextResponse.json({
      ok: true,
      email,
      expiresIn: CODE_TTL_SECONDS,
      resendAfter: RESEND_COOLDOWN_SECONDS,
    });
  } catch (cause) {
    console.error("[quote/otp] failed:", cause);
    return NextResponse.json(
      { error: "server", message: "That did not work. Try again in a moment." },
      { status: 500 },
    );
  }
}
