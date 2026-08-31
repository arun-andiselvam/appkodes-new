import Script from "next/script";

/**
 * Google Analytics 4 - Google's own snippet, byte for byte, via next/script.
 *
 * Added 25 August 2026, against the existing property the client already
 * runs. It replaced @vercel/analytics, which had been in the root layout
 * since the template and never collected a thing: that component fetches
 * /_vercel/insights/script.js, which only exists on Vercel's own edge, and
 * this site is self hosted on a droplet behind Dokploy. It was a 404 and a
 * console error on every page load for every visitor.
 *
 * !! THIS IS A FRESH INSTALL, NOT A PATCH ON THE OLD ONE !!
 *
 * Between 26 and 31 August this file went through five different loading
 * strategies chasing Total Blocking Time, and by the last of them the
 * component had drifted a long way from Google's documented snippet: a
 * hand rolled `document.createElement("script")`, a custom `push` helper
 * standing in for a real `gtag` function, and a wait for either an
 * interaction or the page's `load` event before any of it ran. Two of those
 * changes fixed real, confirmed regressions - see the git history on this
 * file for both. Neither fixed the actual problem: GA4 Realtime read zero
 * active users through all five versions, on real devices, on a fresh
 * property lookup, with a Measurement ID confirmed against Data Streams
 * and DebugView confirmed empty.
 *
 * At that point the custom loader itself became the thing in question
 * rather than the fix. This is Google's own install instructions, exactly
 * as they are handed out for `G-NBZXFWV6LY`, with nothing rewritten: the
 * literal two script tags, the literal inline snippet, `next/script` doing
 * the loading rather than a hand written DOM insertion. It is also, not
 * coincidentally, what this file looked like on 25 August, before any of
 * the optimisation work started, when the same property was recording real
 * traffic. If this does not track either, the fault is not in how this
 * component loads gtag.js - every way of doing that has now been tried -
 * and the next place to look is the property itself, not this file again.
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
 * !! NO SCRIPT-SRC CHANGE IS NEEDED IN proxy.ts, AND HERE IS WHY !!
 *
 * The CSP is nonce based with 'strict-dynamic'. Both tags below carry the
 * per-request nonce, and strict-dynamic extends that trust to the further
 * scripts gtag.js loads for itself. Under strict-dynamic a host allowlist in
 * script-src is ignored outright, so adding googletagmanager.com there would
 * be a no-op that looked like it was doing something. connect-src and
 * img-src are the directives that actually matter for the collect calls and
 * the image beacon fallback, and both already list Google's analytics hosts.
 *
 * !! afterInteractive PUTS THIS BACK IN THE HEAD AT HIGH PRIORITY !!
 *
 * That preload cost roughly 850ms on a throttled mobile connection, measured
 * 26 August, which is the reason every later strategy tried to defer this
 * further. That cost is accepted for now: a site whose own owner cannot see
 * traffic in it is a worse outcome than a few points off a lab score, and
 * every deferred version tried instead came back reading zero regardless of
 * the saving. If this fresh install confirms tracking is working again, a
 * deferred strategy is worth trying once more, deliberately and one change
 * at a time, rather than layered on top of a component nobody yet trusts.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NBZXFWV6LY";

export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  if (!GA_ID || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      {/*
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
