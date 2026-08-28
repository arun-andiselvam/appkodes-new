/**
 * The admin session: a signed cookie in place of the browser's own Basic Auth
 * dialog.
 *
 * !! RUNS IN MIDDLEWARE, SO THIS FILE STAYS EDGE-COMPATIBLE !!
 *
 * proxy.ts imports this, and Next's Edge runtime is a Web Crypto environment,
 * not a Node one - `crypto.subtle`, not `node:crypto`. No `server-only`
 * import here either: that guard is about keeping server secrets out of a
 * browser bundle, and middleware is a second server context this file has to
 * work in just as much as a route handler does.
 *
 * !! ON THE CLIENT'S INSTRUCTION OF 28 AUGUST 2026 !!
 *
 * The gate used to be plain HTTP Basic Auth, and proxy.ts defended that choice
 * at length: "a session cookie and a login form would be more code defending
 * the same secret." True, and overridden anyway - what changed is not the
 * threat model, it is that the browser's own credential dialog reads as
 * something broken rather than something deliberate to whoever is typing into
 * it. A real page costs the extra code below; it is what was asked for.
 *
 * No new environment variable. The signing secret is derived from
 * ADMIN_PASSWORD itself (see deriveSecret), which has a useful side effect
 * for free: rotating the password invalidates every session that was signed
 * with the old one.
 */

export const ADMIN_COOKIE = "hitasoft_admin";

/** Long enough that a work session does not get interrupted, short enough
 *  that a stolen cookie is not a standing key. */
const SESSION_HOURS = 12;

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Buffer.from(signature).toString("base64url");
}

/**
 * Constant time, same reasoning and same implementation as proxy.ts's
 * original safeEqual - hashing both sides first guarantees equal-length
 * buffers, which is the usual way timingSafeEqual gets called wrong.
 */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const x = new Uint8Array(left);
  const y = new Uint8Array(right);
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) diff |= x[i] ^ y[i];
  return diff === 0;
}

/** Tied to the current password, not a secret of its own - see the module note. */
function deriveSecret(password: string): string {
  return `hitasoft-admin-session:${password}`;
}

/** Username and password, checked against ADMIN_USER / ADMIN_PASSWORD. */
export async function checkCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const wantUser = process.env.ADMIN_USER;
  const wantPassword = process.env.ADMIN_PASSWORD;
  if (!wantUser || !wantPassword) return false;

  const [okUser, okPassword] = await Promise.all([
    safeEqual(username, wantUser),
    safeEqual(password, wantPassword),
  ]);
  return okUser && okPassword;
}

/**
 * A fresh session token: an expiry and a signature over it, nothing that
 * identifies who signed in beyond "held the password" - there is only one
 * admin account, so there is nothing else worth encoding.
 */
export async function issueSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const signature = await hmac(deriveSecret(password), String(exp));
  return `${exp}.${signature}`;
}

/** Whether a token is well-formed, correctly signed, and not expired. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !token) return false;

  const dot = token.indexOf(".");
  if (dot < 0) return false;

  const exp = Number(token.slice(0, dot));
  const signature = token.slice(dot + 1);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const expected = await hmac(deriveSecret(password), String(exp));
  return safeEqual(signature, expected);
}

export const SESSION_MAX_AGE_SECONDS = SESSION_HOURS * 60 * 60;
