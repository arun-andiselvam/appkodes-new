import { NextResponse } from "next/server";

import { databaseConfigured } from "@/lib/db";
import { MAX_ATTEMPTS, looksLikeCode, normaliseCode, verifyCode } from "@/lib/quote-otp";
import {
  appendTurns,
  bumpOtpAttempts,
  consumeOtp,
  getSession,
  latestOtp,
  markVerified,
} from "@/lib/quote-store";
import { callerKey, overLimit } from "@/lib/rate-limit";

/**
 * Checks the code, and is the only thing on this site that can verify anybody.
 *
 * !! THE ENTIRE TRUST BOUNDARY OF THE ASSISTANT IS THIS FILE !!
 *
 * Everything downstream - the deeper questions, the uploads, the promise of a
 * priced estimate sent by email - rests on the claim that the address belongs
 * to whoever is typing. That claim is created here and nowhere else. The model
 * cannot make it: lib/quote-session.ts has no edge from `verify` to
 * `discovery` and puts `discovery` in SERVER_ONLY besides, so an assistant
 * that decides somebody seems trustworthy moves nothing.
 *
 * Read the order of the checks below as deliberate. Expiry and the attempt
 * ceiling are both tested BEFORE the code is compared, so a burned-out code
 * cannot be brute forced by an attacker who ignores what we tell them.
 */

const CONVERSATION_ID = /^[a-f0-9-]{8,64}$/i;

export async function POST(request: Request) {
  if (!databaseConfigured()) {
    return NextResponse.json(
      { error: "unconfigured", message: "Verification is not switched on." },
      { status: 503 },
    );
  }

  let body: { conversationId?: unknown; code?: unknown };
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

  const code = typeof body.code === "string" ? normaliseCode(body.code) : "";
  if (!looksLikeCode(code)) {
    return NextResponse.json(
      { error: "invalid_code", message: "The code is six digits." },
      { status: 400 },
    );
  }

  /*
   * A ceiling on guesses per caller, on top of the per-code one below.
   *
   * The per-code ceiling is the real defence, but it is per code: somebody
   * scripting this could burn five guesses, request a fresh code, and repeat.
   * The hourly send limit in lib/quote-otp.ts bounds that to twenty-five
   * guesses an hour against one address, and this bounds it further per IP.
   */
  if (overLimit("otp-verify", callerKey(request), 20, 60 * 60_000)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  try {
    const session = await getSession(conversationId);
    if (!session) {
      return NextResponse.json({ error: "Could not read that." }, { status: 400 });
    }

    /* Already verified. Idempotent, for the same reason the send route is. */
    if (session.verifiedEmail) {
      return NextResponse.json({
        ok: true,
        alreadyVerified: true,
        email: session.verifiedEmail,
        phase: session.phase,
      });
    }

    const otp = await latestOtp(conversationId);

    if (!otp) {
      return NextResponse.json(
        { error: "no_code", message: "There is no code waiting. Ask me to send one." },
        { status: 409 },
      );
    }

    /*
     * A consumed code is dead even if it is the right one.
     *
     * Without this, a code that verified a conversation could be replayed
     * later - after the phase moved on, or against a reopened window - and the
     * whole point of consuming it would be decorative.
     */
    if (otp.consumed_at) {
      return NextResponse.json(
        { error: "used", message: "That code has been used already." },
        { status: 409 },
      );
    }

    /*
     * Attempts and expiry, both checked before the comparison.
     *
     * If the comparison came first, an attacker who ignores the "too many
     * attempts" message could keep guessing against a code whose budget was
     * spent, and the counter would be advice rather than a limit.
     */
    if (otp.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: "too_many_attempts",
          message: "That code has had too many wrong guesses. Ask me for a fresh one.",
        },
        { status: 429 },
      );
    }

    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "expired", message: "That code has expired. Ask me for a fresh one." },
        { status: 410 },
      );
    }

    if (!verifyCode(code, conversationId, otp.code_hash)) {
      const attempts = await bumpOtpAttempts(otp.id);
      const left = Math.max(0, MAX_ATTEMPTS - attempts);

      return NextResponse.json(
        {
          error: "wrong_code",
          /*
           * The remaining count is told to them plainly. It gives an attacker
           * nothing they could not work out by counting their own requests,
           * and it stops a real person burning their last try not knowing it
           * was the last one.
           */
          message: left
            ? `That is not the code. ${left} ${left === 1 ? "try" : "tries"} left.`
            : "That is not the code, and that was the last try. Ask me for a fresh one.",
          attemptsLeft: left,
        },
        { status: 401 },
      );
    }

    /*
     * Right code. Burn it first, then verify.
     *
     * consumeOtp only updates a row whose consumed_at is still null, so two
     * requests carrying the same correct code race here and exactly one wins.
     * The loser is told the code was used, which is true.
     */
    if (!(await consumeOtp(otp.id))) {
      return NextResponse.json(
        { error: "used", message: "That code has been used already." },
        { status: 409 },
      );
    }

    const verified = await markVerified(conversationId, otp.email);

    /*
     * The phase moved out from under us between the checks and here - two
     * windows on one conversation, most likely. The code is spent and the
     * address is already proved, so this is a success from where the visitor
     * is standing, and saying otherwise would be pedantry that costs a lead.
     */
    if (!verified) {
      const now = await getSession(conversationId);
      return NextResponse.json({
        ok: true,
        email: now?.verifiedEmail ?? otp.email,
        phase: now?.phase ?? "discovery",
      });
    }

    /*
     * Record the verification as a turn in the conversation.
     *
     * !! THIS IS NOT DECORATION. IT FIXES A REAL FAILURE. !!
     *
     * The email exchange happens through this route, not through the chat, so
     * without a turn here the transcript reads: assistant asks for an address,
     * visitor talks about something else. The model sees its own question
     * hanging unanswered and asks for the address a second time - which it did
     * on 27 August 2026, one turn after the address had been verified.
     *
     * Writing the confirmation closes the exchange in the history the model
     * reads, and it is also the message the window shows, so the visitor and
     * the model are looking at the same conversation.
     *
     * Failure is swallowed: the address is verified either way, and losing a
     * cosmetic line must never turn a success into an error.
     */
    try {
      await appendTurns(conversationId, [
        {
          role: "assistant",
          content: "That address is verified — thank you. Your estimate will go there once it is ready.",
          flag: "WORK",
        },
      ]);
    } catch (cause) {
      console.error("[quote/otp/verify] could not record the confirmation:", cause);
    }

    console.info("[quote/otp] verified", { conversationId });

    return NextResponse.json({
      ok: true,
      email: verified.verifiedEmail,
      phase: verified.phase,
    });
  } catch (cause) {
    console.error("[quote/otp/verify] failed:", cause);
    return NextResponse.json(
      { error: "server", message: "That did not work. Try again in a moment." },
      { status: 500 },
    );
  }
}
