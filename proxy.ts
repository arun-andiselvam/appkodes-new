import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

/**
 * Per-request nonce-based Content-Security-Policy.
 *
 * Next.js detects the `Content-Security-Policy` header on the incoming request
 * and stamps the same nonce onto the framework's own inline scripts, so no
 * `unsafe-inline` is needed for script-src.
 *
 * Trade-off: reading a per-request nonce opts pages out of full static
 * generation. See docs/security.md for the static-CSP alternative if you would
 * rather keep the page fully cacheable at the edge.
 */
/**
 * The gate on /admin.
 *
 * !! THIS ONE FAILS CLOSED, UNLIKE EVERY OTHER INTEGRATION HERE !!
 *
 * The rule everywhere else on this site is that a missing key means a feature
 * is absent rather than broken - no Resend key, no email; no Anthropic key, no
 * assistant. Applying that rule here would mean an unconfigured admin page is
 * an OPEN admin page, publishing every conversation anybody has had with the
 * assistant, along with their name and email address.
 *
 * So: no ADMIN_USER or no ADMIN_PASSWORD means nobody gets in, ever. The
 * failure mode is being locked out of your own archive, which is recoverable
 * in the time it takes to set an environment variable.
 *
 * !! A REAL LOGIN PAGE, ON THE CLIENT'S INSTRUCTION OF 28 AUGUST 2026 !!
 *
 * This used to be plain HTTP Basic Auth, with a comment here arguing it was
 * enough - "a session cookie and a login form would be more code defending
 * the same secret." Correct, and overridden anyway: the browser's own
 * credential dialog is what was actually being objected to, not the strength
 * of the scheme behind it. app/admin/login now renders a real page, and
 * lib/admin-auth.ts is what verifies what it sets - see the shouted note
 * there about why that file has to stay Edge-compatible rather than reaching
 * for node:crypto the way most of this codebase does.
 */
async function adminGate(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  const noStore = { "cache-control": "no-store" };

  /*
   * 404 rather than a login page when nothing is configured. A login form
   * advertises that there is something here worth guessing credentials for.
   */
  if (!user || !password) {
    return new NextResponse("Not found.", { status: 404, headers: noStore });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token)) return null;

  /*
   * /api/admin is read by fetch() from the admin pages' own client
   * components (approve-button.tsx and friends) - a redirect there lands as
   * an opaque failed fetch, not a navigation, so it gets a plain 401 instead.
   * /admin pages go to the login form, carrying where they were headed so a
   * successful login lands back on it rather than always on the queue.
   */
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "unauthenticated" },
      { status: 401, headers: noStore },
    );
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login, { headers: noStore });
}

export default async function proxy(request: NextRequest) {
  /*
   * !! /api/admin IS GATED HERE TOO, AND IT IS NOT OPTIONAL !!
   *
   * The pages under /admin only read. The routes under /api/admin act: they
   * approve an estimate and email a price to a lead. Left ungated, anybody who
   * guessed the path could send a generated figure to a real client under this
   * company's name, which is a worse outcome than the archive leaking.
   *
   * Checked here rather than inside each route for the reason the note above
   * gives for the pages: one gate that runs before anything else is one thing
   * to keep right, and a per-route check is the one somebody forgets on the
   * route they add next.
   */
  const { pathname } = request.nextUrl;

  /*
   * The login page and the route it posts to are the one place under /admin
   * that has to be reachable without the cookie the gate checks for - a login
   * form behind its own login gate is a locked door with the key inside it.
   */
  const isLoginRoute = pathname === "/admin/login" || pathname === "/api/admin/login";

  if (!isLoginRoute && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    const denied = await adminGate(request);
    if (denied) return denied;
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  /*
   * !! BUILT AS TOKENS, NOT A TEMPLATE LITERAL WITH A CONDITIONAL EMPTY STRING !!
   *
   * The previous version was `` `script-src 'self' ... 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""}` ``,
   * which in production evaluates to a directive ending in a literal trailing
   * space before its semicolon: "...'strict-dynamic' ; style-src...". That is
   * inside the grammar - CSP allows whitespace around semicolons - but it is
   * exactly the one irregular byte in an otherwise clean policy, and it is
   * what sat behind a real bug found on 28 August 2026: admin/login's native
   * form POST was refused with a `form-action` violation even though the
   * policy plainly says `form-action 'self'` and the form's own action was
   * same-origin. Filtering to an array first and joining with a single space
   * makes that trailing artifact structurally impossible rather than relying
   * on the regex cleanup below to catch it after the fact.
   */
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDev ? ["'unsafe-eval'"] : [])].join(
    " ",
  );

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' lets Next's bootstrap script load its own chunks.
    // Dev additionally needs 'unsafe-eval' for React Refresh / HMR.
    `script-src ${scriptSrc}`,
    // Tailwind and Next inject <style> tags at runtime; there is no nonce path
    // for those, so inline styles stay allowed. Styles are not a script vector.
    `style-src 'self' 'unsafe-inline'`,
    // next/font self-hosts Instrument Sans/Serif and JetBrains Mono at build
    // time, so no external font origin is required.
    `font-src 'self' data:`,
    /*
      google-analytics.com is the image beacon GA falls back to when it
      cannot use fetch. Wildcards because GA4 collects on regional hosts
      (region1.google-analytics.com and siblings) picked per visitor, so
      naming them one by one would break for somebody in the wrong country.
    */
    `img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com`,
    /*
      Where GA4 actually sends the hit.

      !! THE BARE HOSTS ARE LISTED SEPARATELY, AND THAT IS NOT REDUNDANT !!

      A CSP wildcard matches subdomains only. `*.analytics.google.com` does
      NOT match `analytics.google.com` itself, which is the host GA4 posts
      /g/collect to. The first version of this line had only the wildcards,
      and the result was the worst kind of failure: gtag.js loaded, the page
      looked fine, no error surfaced to a visitor, and every hit was blocked
      so the property collected nothing at all. Caught on 25 August 2026 by
      watching a real browser rather than reading the header. Same trap
      applies to www.google-analytics.com, listed here for the same reason.

      *.googletagmanager.com is here because gtag.js fetches its own config
      from there after loading.

      !! script-src IS DELIBERATELY UNCHANGED FOR GA !!

      Under 'strict-dynamic' a host allowlist in script-src is ignored
      entirely, so adding googletagmanager.com there would be a no-op that
      looks like it is doing something. The gtag tags carry the per-request
      nonce and strict-dynamic extends that trust to what gtag.js loads for
      itself. Same reasoning as the Turnstile note below.

      !! stats.g.doubleclick.net AND www.google.<tld> ARE LEFT OUT ON PURPOSE !!

      GA4 also tries those two when Google Signals is enabled on the
      property: doubleclick for the advertising ping, and a country specific
      google.co.in / google.de / google.fr for the ga-audiences remarketing
      pixel. Both are blocked here and both stay blocked.

      They are advertising and remarketing rather than analytics. Page views,
      events and every report this company actually reads work without them,
      which was verified in a browser rather than assumed. And this site
      publishes a security section about where a client's data goes, so
      quietly shipping ad network tracking to every reader would be the sort
      of thing content/security.ts exists to argue against.

      Leaving them blocked means the browser console shows a handful of CSP
      warnings for those hosts on each load. That is cosmetic and expected.
      The clean fix is to turn Google Signals off in the GA4 property, at
      which point GA stops attempting them at all.

      vitals.vercel-insights.com was here for @vercel/analytics and went with
      it on 25 August 2026. Nothing had talked to it since this stopped being
      a Vercel deployment: that component fetches a script off Vercel's edge
      which 404s on a self hosted droplet. See
      components/analytics/google-analytics.tsx.
    */
    `connect-src 'self' https://analytics.google.com https://*.analytics.google.com https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com${isDev ? " ws: http://localhost:*" : ""}`,
    `frame-ancestors 'none'`,
    // Client videos are the only thing this page frames. The host is the
    // no-cookie one and the iframe is not mounted until a visitor presses
    // play, so nothing reaches Google on load.
    //
    // widget.trustpilot.com was allowed here while a TrustBox was embedded.
    // That embed rendered empty and was replaced by a plain link, so the
    // permission went with it. See docs/positioning.md if it comes back.
    //
    // challenges.cloudflare.com was added 24 August 2026 for the contact
    // form's spam check. script-src needed no change for it: the widget's
    // own script tag carries the same per-request nonce everything else on
    // this page does, and Cloudflare's docs document that as the supported
    // path for a strict-dynamic policy, ahead of allowlisting the origin by
    // name. frame-src has no nonce mechanism, so this is the one directive
    // that genuinely needs the host added. See components/sections/
    // contact-form.tsx.
    //
    // www.google.com was added 10 September 2026 for the two office maps on
    // the contact page, which embed google.com/maps?q=...&output=embed with no
    // API key. Unlike the video they load on scroll rather than on a click,
    // so Google does see a visitor who scrolls down to them. The privacy
    // policy in content/legal.ts does not name Google Maps yet.
    `frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com https://www.google.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `manifest-src 'self'`,
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ]
    /* Belt and braces alongside the scriptSrc fix above - see the note there. */
    .map((line) => line.trim())
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimizer output, which are
     * served straight from the CDN and carry no inline scripts.
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:webp|png|jpg|jpeg|svg|ico|woff2)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
