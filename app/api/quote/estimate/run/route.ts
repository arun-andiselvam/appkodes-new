import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { databaseConfigured } from "@/lib/db";
import { runEstimateQueue } from "@/lib/quote-estimate";

/**
 * Drains the estimate queue. The safety net behind the after() kick-off.
 *
 * app/api/quote/chat/route.ts starts an estimate the moment it is queued, so
 * in the common case this route has nothing to do. It exists for every other
 * case: the process replaced mid-job, a rate limit, a model timeout, the
 * droplet busy. Anything that did not finish went back to 'queued', and
 * nothing would ever pick it up again without this.
 *
 * Point a schedule at it - every ten minutes is plenty:
 *
 *   curl -s -X POST https://www.hitasoft.com/api/quote/estimate/run \
 *        -H "authorization: Bearer $QUOTE_CRON_SECRET"
 *
 * !! IT SPENDS MONEY, SO IT IS NOT OPEN. !!
 *
 * Every run this triggers is a call to a large model. An unauthenticated
 * endpoint that does that is a bill somebody else can run up, so it needs a
 * secret - and with QUOTE_CRON_SECRET unset it refuses rather than defaulting
 * to open. That is the one place this site's "unset means the feature is
 * absent" rule has to bite the other way round: absent here means shut, never
 * unlocked.
 */

export const dynamic = "force-dynamic";

/**
 * Constant-time comparison, so the secret cannot be recovered a byte at a
 * time by measuring how long a wrong guess takes. Cheap to do properly.
 */
function secretMatches(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.QUOTE_CRON_SECRET;

  if (!secret) {
    console.error("[quote/estimate/run] QUOTE_CRON_SECRET is not set; refusing.");
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!provided || !secretMatches(provided, secret)) {
    /* No detail. A 401 that explains itself is a 401 that helps somebody. */
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!databaseConfigured()) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  try {
    const ran = await runEstimateQueue();
    return NextResponse.json({ ok: true, ran });
  } catch (cause) {
    console.error("[quote/estimate/run] failed:", cause);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
