import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Added 25 August 2026, against the existing property the client already
 * runs. It replaced @vercel/analytics, which had been in the root layout
 * since the template and never collected a thing: that component fetches
 * /_vercel/insights/script.js, which only exists on Vercel's own edge, and
 * this site is self hosted on a droplet behind Dokploy. It was a 404 and a
 * console error on every page load for every visitor.
 *
 * !! THE MEASUREMENT ID IS PUBLIC AND BELONGS IN THE CODE !!
 *
 * It ships in the HTML of every page by definition, so treating it as a
 * secret would be theatre. It lives here as a default for the same reason
 * site.url does in content/site.ts: it is a permanent fact about this
 * property, and a value that exists only in a deployment environment is one
 * nobody can find later. NEXT_PUBLIC_GA_ID still overrides, which is what a
 * staging property would need, and setting it to an empty string turns
 * analytics off entirely.
 *
 * !! IT DOES NOT RUN OUTSIDE PRODUCTION, WHICH IS THE POINT !!
 *
 * There is one GA property. Without this guard every `pnpm dev` session, and
 * every Playwright run against localhost, would file itself as real traffic
 * against it. Analytics that counts the people building the site is worse
 * than no analytics, because it is wrong in a direction nobody checks.
 *
 * !! NO SCRIPT-SRC CHANGE WAS NEEDED IN proxy.ts, AND HERE IS WHY !!
 *
 * The CSP is nonce based with 'strict-dynamic'. Both tags below carry the
 * per-request nonce, and strict-dynamic extends that trust to the further
 * scripts gtag.js loads for itself. Under strict-dynamic a host allowlist in
 * script-src is ignored outright, so adding googletagmanager.com there would
 * have been a no-op that looked like it was doing something. connect-src and
 * img-src are a different matter: strict-dynamic does not apply to them, and
 * both had to be widened for the collect calls and the image beacon
 * fallback. Same reasoning as the Turnstile note in proxy.ts.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NBZXFWV6LY";

export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  if (!GA_ID || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {/*
        afterInteractive rather than beforeInteractive. Analytics is never
        worth delaying first paint for, and beforeInteractive would put this
        ahead of the page the visitor came to read. It is also the strategy
        Google's own snippet implies with `async`.
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      {/*
        The init snippet, byte for byte the one the GA property hands out,
        apart from carrying the nonce.

        !! PAGE VIEWS AFTER THE FIRST COME FROM GA, NOT FROM CODE HERE !!

        This is an App Router site, so a click on a menu item is a history
        change rather than a document load, and `gtag('config', ...)` fires
        exactly one page_view: the first. GA4's Enhanced Measurement has
        "Page changes based on browser history events" on by default and
        picks up the rest.

        The alternative is a client component watching usePathname and
        sending page_view itself. It is deliberately not done, because both
        mechanisms firing at once double counts every navigation, and the
        dashboard setting wins by default. If Enhanced Measurement is ever
        turned off for this property, that is the moment to add manual
        tracking, and `send_page_view: false` has to go into the config call
        below in the same change.
      */}
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
