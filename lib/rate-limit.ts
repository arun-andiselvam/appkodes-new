import "server-only";

/**
 * The in-process rate limiter.
 *
 * Lifted, near enough unchanged, from app/api/quote/ask/route.ts, which
 * documents the honest limitation and it holds here too: this is in memory, so
 * it resets on deploy and counts per instance rather than globally. It stops a
 * single script in a loop, which is the realistic threat against this site. A
 * shared counter would mean Redis, and none of these routes justifies a new
 * piece of infrastructure until the traffic says otherwise.
 *
 * !! IT IS NOT THE ONLY LIMIT ON ANYTHING THAT MATTERS !!
 *
 * Where the consequence of getting past it is real - emailing a code to a
 * stranger's inbox - there is a second limit in the database that counts the
 * thing itself rather than the caller. See recentSendsTo in lib/quote-store.ts.
 * This one is the cheap first gate, not the guarantee.
 */

type Bucket = { count: number; resetAt: number };

/**
 * One map per named limit, so the chat's budget and the code sender's budget
 * are not the same twelve requests. Stashed on globalThis because Next reloads
 * modules freely in development and a fresh map every hot reload is not a
 * limit at all.
 */
const globalForLimits = globalThis as unknown as {
  quoteLimits?: Map<string, Map<string, Bucket>>;
};

function bucketsFor(name: string) {
  if (!globalForLimits.quoteLimits) globalForLimits.quoteLimits = new Map();
  let map = globalForLimits.quoteLimits.get(name);
  if (!map) {
    map = new Map();
    globalForLimits.quoteLimits.set(name, map);
  }
  return map;
}

/**
 * Counts a hit. True means the caller is over the limit and should be refused.
 *
 * Sweeps expired entries on write. Without that this is a slow memory leak
 * keyed by every address that ever made a request.
 */
export function overLimit(
  name: string,
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const buckets = bucketsFor(name);
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5_000) {
      for (const [id, seen] of buckets) if (now > seen.resetAt) buckets.delete(id);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > max;
}

/**
 * Who is calling, as well as we can tell.
 *
 * Behind the droplet's proxy the socket address is the proxy, so the forwarded
 * header is what carries the visitor. It is spoofable, which is worth being
 * clear about: this identifies a caller well enough to slow down a naive
 * script and not well enough to stop a determined one.
 */
export function callerKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
