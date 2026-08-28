import "server-only";

import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

/**
 * The email verification code.
 *
 * Six digits, ten minutes, five guesses. Those three numbers are the whole
 * security model and they are chosen against each other: a million codes, five
 * attempts and a ten minute window means a guesser gets one chance in two
 * hundred thousand per code, and the resend limits below stop them buying more
 * chances by asking for more codes.
 *
 * !! WHAT THIS IS FOR, AND WHAT IT IS NOT FOR !!
 *
 * It proves somebody can read the inbox they named. That is all, and it is
 * enough: the estimate is emailed to that address, so an address nobody can
 * read is an estimate nobody receives. It is not a login, it does not
 * authenticate a person, and nothing behind it is secret. Sizing it like a
 * bank's second factor would be false comfort about what it protects.
 */

/* ----------------------------------------------------------------- the code */

const CODE_LENGTH = 6;

/** Ten minutes. Long enough to go and find the email, short enough to expire. */
export const CODE_TTL_SECONDS = 10 * 60;

/**
 * Wrong guesses allowed against one code.
 *
 * Five, not three. Somebody mistyping a six digit number off their phone is
 * the common case and three is mean to them; five still leaves the odds at one
 * in two hundred thousand.
 */
export const MAX_ATTEMPTS = 5;

/** No second code to the same address inside this. */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Codes to one address per hour, across every conversation.
 *
 * !! THIS IS THE ONE THAT MATTERS, AND IT IS NOT ABOUT OUR COSTS !!
 *
 * Anybody can type a stranger's address into this box. Without a ceiling, a
 * public form that emails on demand is a way to post mail to someone who never
 * asked for it, using our verified sending domain to do it. Five an hour is
 * generous for a real person who lost the first one and useless to somebody
 * trying to make a nuisance of themselves.
 */
export const MAX_SENDS_PER_HOUR = 5;

/**
 * A code, from a real random source.
 *
 * randomInt, not Math.random. Math.random is seeded predictably enough that
 * codes could be guessed from earlier ones, which turns the whole check into
 * theatre. The padStart keeps leading zeros, so 000123 is a valid code and not
 * a three digit one.
 */
export function generateCode() {
  return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");
}

/* --------------------------------------------------------------- the hashing */

/**
 * Hashes a code for storage, salt and all, as one string.
 *
 * !! A PLAIN SHA-256 OF A SIX DIGIT NUMBER IS NOT A HASH OF ANYTHING !!
 *
 * There are only a million of them. Anybody who can read the table can
 * pre-compute all one million in about a second and read every code in it. The
 * random per-row salt is what makes that pointless: the table cannot be
 * attacked once, only row by row.
 *
 * Being honest about the limit: somebody with a database dump and a reason to
 * care can still burn a million HMACs against one row. That is accepted,
 * because anybody holding a dump already has `verified_email` and does not
 * need the code to read it. What the salt buys is that the codes table is not
 * a free list of live codes, which is the realistic failure.
 *
 * OTP_PEPPER is mixed in when it is set, so a leaked dump alone is not enough
 * without the application environment too. It is optional, and unset is not an
 * error - the salt does the necessary work by itself, and requiring an
 * environment variable to send an email would break the rule this whole site
 * follows about a missing variable meaning a feature is absent rather than a
 * stack trace.
 *
 * The conversation id goes into the hash as well, which binds a code to the
 * conversation it was issued for: a code lifted from one cannot be replayed
 * against another even if somebody knows both.
 */
export function hashCode(code: string, conversationId: string, salt?: string) {
  const useSalt = salt ?? randomBytes(16).toString("hex");
  const pepper = process.env.OTP_PEPPER ?? "";
  const digest = createHmac("sha256", `${useSalt}${pepper}`)
    .update(`${conversationId}:${code}`)
    .digest("hex");
  return `${useSalt}:${digest}`;
}

/**
 * Checks a code against a stored hash.
 *
 * timingSafeEqual rather than ===, so the comparison takes the same time
 * whether the first digit is wrong or the last one is. With five attempts and
 * a ten minute window a timing attack here is close to theoretical, but the
 * correct comparison is one line and the incorrect one is a thing somebody
 * later has to notice.
 */
export function verifyCode(code: string, conversationId: string, stored: string) {
  const [salt] = stored.split(":");
  if (!salt) return false;

  const expected = Buffer.from(stored);
  const actual = Buffer.from(hashCode(code, conversationId, salt));

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

/* ---------------------------------------------------------------- the input */

/**
 * Good enough, deliberately - the same call /api/quote and /api/contact make.
 *
 * Their comment applies unchanged: full RFC 5322 validation rejects addresses
 * that work and accepts ones that do not, and the only real check is whether a
 * reply arrives. Here that check is literally the next thing that happens.
 */
export function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** One spelling per address, so a resend and a first send are comparable. */
export function normaliseEmail(value: string) {
  return value.trim().toLowerCase().slice(0, 200);
}

/** Six digits, however they were typed. Spaces and dashes are a person, not an attack. */
export function normaliseCode(value: string) {
  return value.replace(/\D/g, "").slice(0, CODE_LENGTH);
}

export function looksLikeCode(value: string) {
  return new RegExp(`^\\d{${CODE_LENGTH}}$`).test(value);
}

/**
 * A WhatsApp number, kept close to what somebody typed.
 *
 * Digits, and a leading plus if there was one. No country is assumed and no
 * formatting is imposed: this site serves buyers outside India, and a
 * normaliser that quietly prefixed +91 would corrupt every one of them. It is
 * stored to be read by a person who will dial it, not parsed by anything.
 *
 * Returns null for something too short to be a phone number, so a visitor who
 * types "no thanks" does not end up with that stored as their WhatsApp.
 */
export function normaliseWhatsapp(value: string): string | null {
  const trimmed = value.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return plus ? `+${digits}` : digits;
}
