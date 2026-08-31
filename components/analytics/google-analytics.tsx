"use client";

import { useEffect } from "react";

/**
 * Google Analytics 4, loaded on mount rather than waiting on any event.
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
 * !! FIVE STRATEGIES IN FIVE DAYS, AND THE FOURTH WAS STILL UNVERIFIED !!
 *
 * afterInteractive first, which was wrong because Next preloads such a script
 * in the head: 169 KB at high priority, ahead of the article's own hero image,
 * costing roughly 850ms of a simulated mobile connection.
 *
 * Then next/script's lazyOnload, which fixed the preload and left the
 * execution. Measured on the live site on 26 August 2026 at a 4x CPU throttle,
 * gtag.js was still the largest single contributor to Total Blocking Time:
 * two long tasks of 101ms and 82ms, against 113ms for all of this site's own
 * JavaScript put together.
 *
 * So on the 26th it stopped being scheduled and became triggered instead:
 * nothing requested until the reader scrolled, pointed, tapped or typed. That
 * fixed the Lighthouse number and broke the thing it was measuring a proxy
 * for. GA4 Realtime went to zero active users within a day and stayed there -
 * confirmed against the client's own dashboard on 29 August 2026, correlated
 * to the hour against this file's own commit history. The reason isn't a bug
 * in the trigger, it's what the trigger *is*: a visit that never scrolls,
 * clicks, types or taps - which is not a rare visit, it's what "I opened the
 * site to check something" looks like, along with every real bounce - never
 * fires any of the four wake events, so gtag.js never loads, so nothing is
 * ever sent. No amount of fixing how the hit is queued helps a hit that is
 * never attempted.
 *
 * Back to lazyOnload, then, with the Total Blocking Time cost that implies -
 * this is the version that shipped on 29 August, waiting for the page's own
 * `load` event instead of an interaction. Its own commit message flagged an
 * open question rather than closing one: "full confidence still needs a
 * check with GA4 Realtime or Tag Assistant post-deploy, since manual
 * dataLayer pushes during testing were themselves inconsistent in a way
 * that looks more like a test environment/GA4 quirk than something this
 * component fully controls." Nobody ran that check. On 31 August the
 * client's Realtime panel was still reading zero active users, two days
 * after that deploy.
 *
 * !! IT LOADS ON MOUNT NOW, NOT ON `load` !!
 *
 * The `load`-event wait was itself still a condition sitting between a visit
 * and a hit, and it was the one variable in this file nobody had actually
 * ruled out. Removing it does not prove it was the cause - the fault may
 * turn out to sit on GA4's side of the wire rather than in this component's
 * timing - but it is the one lever left here, so it is the one to pull
 * before reaching for Tag Assistant or the GA4 admin console. If Realtime is
 * still flat after this ships, look there next rather than back in this
 * file.
 *
 * The Total Blocking Time cost that motivated every strategy above comes
 * back with it. A site whose own owner cannot see traffic in it is a worse
 * outcome than a few points off a lab score nobody but this file was
 * reading.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NBZXFWV6LY";

export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  useEffect(() => {
    if (!GA_ID || process.env.NODE_ENV !== "production") return;

    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    const push = (...args: unknown[]) => w.dataLayer!.push(args);

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    /*
     * The CSP is nonce based with 'strict-dynamic', which trusts scripts
     * inserted by an already trusted script, so this would load without a
     * nonce. It is set anyway: strict-dynamic is what makes it work today
     * and the nonce is what makes it work if that policy is ever tightened.
     * It has to be the property rather than setAttribute, because the DOM
     * hides the attribute after parse.
     */
    if (nonce) script.nonce = nonce;

    /*
     * !! PUSHED FROM onload, NOT QUEUED AHEAD OF THE SCRIPT !!
     *
     * The obvious-looking alternative is pushing 'js'/'config' to dataLayer
     * before this script exists, trusting gtag.js to drain the queue when
     * it arrives - that is Google's own snippet order. On this site's CSP
     * and script-injection setup it did not work: confirmed live on
     * www.hitasoft.com on 29 August 2026, repeatedly, across two capture
     * methods, that a config queued ahead of the script produced the GET
     * for gtag/js but never once produced a request to google-analytics.com.
     * Pushing from onload, once gtag.js has actually executed, avoids
     * whatever that was rather than explaining it. This part is unchanged by
     * the 31 August edit below - only when the script gets appended changed.
     */
    script.onload = () => {
      push("js", new Date());
      push("config", GA_ID);
    };
    document.head.appendChild(script);

    /*
     * No wait on `document.readyState` or a `load` listener any more. See
     * the block comment above for why: that wait was the one remaining
     * condition this file could still remove, and Realtime was still flat
     * with it in place two days after it shipped.
     */
  }, [nonce]);

  /*
   * Page views after the first come from GA, not from code here.
   *
   * This is an App Router site, so a click on a menu item is a history change
   * rather than a document load, and `gtag('config', ...)` fires exactly one
   * page_view: the first. GA4's Enhanced Measurement has "Page changes based
   * on browser history events" on by default and picks up the rest.
   *
   * The alternative is watching usePathname and sending page_view here. It is
   * deliberately not done, because both mechanisms firing at once double counts
   * every navigation and the dashboard setting wins by default. If Enhanced
   * Measurement is ever turned off for this property, that is the moment to add
   * manual tracking, and `send_page_view: false` has to go into the config call
   * above in the same change.
   */
  return null;
}
