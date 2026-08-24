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
    `img-src 'self' data: blob:`,
    `connect-src 'self' https://vitals.vercel-insights.com${isDev ? " ws: http://localhost:*" : ""}`,
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
