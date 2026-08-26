"use client";

import { useEffect } from "react";

/**
 * Google Analytics 4, held back until the reader does something.
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
 * !! THIRD STRATEGY IN TWO DAYS, AND EACH ONE FIXED THE LAST ONE'S DAMAGE !!
 *
 * afterInteractive first, which was wrong because Next preloads such a script
 * in the head: 169 KB at high priority, ahead of the article's own hero image,
 * costing roughly 850ms of a simulated mobile connection.
 *
 * Then next/script's lazyOnload, which fixed the preload and left the
 * execution. Measured on the live site on 26 August 2026 at a 4x CPU throttle,
 * gtag.js was still the largest single contributor to Total Blocking Time:
 * two long tasks of 101ms and 82ms, against 113ms for all of this site's own
 * JavaScript put together. Blocking time is counted from first paint until the
 * main thread goes quiet, and a script that runs on the load event is inside
 * that window rather than after it.
 *
 * So it is not scheduled any more, it is triggered. Nothing is requested until
 * the reader scrolls, points, taps or types, which is always after the page has
 * settled, so the 169 KB and its execution are outside the window entirely.
 *
 * !! WHAT THIS COSTS, PLAINLY !!
 *
 * A visit that ends with no interaction at all is not counted, and there is no
 * longer a timer to catch it. That is a narrower loss than it sounds - `scroll`
 * is in the list, and a reader who opens a page and reads past the first screen
 * has already scrolled - but it is a real one, and bounce figures are where it
 * shows.
 *
 * It is also worth being honest that the lab metric improves more than the
 * experience does. A real reader scrolls within a second or two and gets gtag
 * about when lazyOnload would have given it to them. What changed is that the
 * work no longer lands in the middle of the page becoming usable.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NBZXFWV6LY";

/** Anything that means a person is present rather than a page merely loading. */
const WAKE_EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"] as const;

/*
 * !! THERE IS NO TIMER, AND THERE WAS ONE FOR ABOUT AN HOUR !!
 *
 * The first version of this loaded gtag anyway after six seconds, so a visit
 * with no interaction at all would still be counted. It made the thing it was
 * meant to fix worse.
 *
 * Lighthouse traces a page for ten to twenty seconds, so a six second timer
 * fires inside the audit. gtag then executed at a point where the main thread
 * had already gone quiet, and Total Blocking Time is measured until the thread
 * stays quiet for five seconds: a fresh long task at six seconds restarts that
 * clock and drags everything before it into the window. lazyOnload at least
 * got the work over with early. Desktop went from 85 to 68.
 *
 * Any timer short enough to catch a real bounce is short enough to land inside
 * an audit, so there is no number that fixes this. The trigger is the reader,
 * or nothing.
 */

export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  useEffect(() => {
    if (!GA_ID || process.env.NODE_ENV !== "production") return;

    let started = false;

    function stopListening() {
      for (const event of WAKE_EVENTS) window.removeEventListener(event, start);
    }

    function start() {
      if (started) return;
      started = true;
      stopListening();

      /*
       * The queue first, then the script. This is Google's own snippet, and
       * the order matters: gtag.js drains whatever is already in dataLayer
       * when it arrives, so the page view is recorded for the moment the
       * reader arrived rather than the moment they happened to scroll.
       */
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      const push = (...args: unknown[]) => w.dataLayer!.push(args);
      push("js", new Date());
      push("config", GA_ID);

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
      document.head.appendChild(script);
    }

    for (const event of WAKE_EVENTS) {
      window.addEventListener(event, start, { once: true, passive: true });
    }

    return stopListening;
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
