import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' lets Next's bootstrap script load its own chunks.
    // Dev additionally needs 'unsafe-eval' for React Refresh / HMR.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""}`,
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
    `frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `manifest-src 'self'`,
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ]
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
