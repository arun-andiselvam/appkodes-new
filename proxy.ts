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
 * generation. See SECURITY.md for the static-CSP alternative if you would
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
    `frame-src 'none'`,
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
