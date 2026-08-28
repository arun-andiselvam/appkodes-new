/**
 * Custom events, for the funnel the quote assistant replaced.
 *
 * !! THIS EXISTS BECAUSE THE OLD CONVERSION SIGNAL WAS DELETED !!
 *
 * Every call to action on this site used to navigate to /contact, so the
 * pageview for that route WAS the conversion metric - the one number anybody
 * looked at. Commit 85e3e18 turned all of them into a modal that opens in
 * place, which produces no navigation and therefore no pageview. Without what
 * follows, the funnel goes quiet the day that ships and nothing in the code
 * explains why.
 *
 * These events replace it, and go further: a pageview could only ever say
 * somebody arrived at the form. These say which button they pressed, on which
 * page, how far into the questions they got, and where they stopped.
 *
 * !! PUSHED TO dataLayer, NOT CALLED THROUGH gtag !!
 *
 * components/analytics/google-analytics.tsx deliberately holds gtag.js back
 * until the visitor does something, because it was the largest single
 * contributor to Total Blocking Time on the live site. That means the first
 * CTA click can easily happen before gtag exists.
 *
 * dataLayer solves it: gtag.js drains whatever is already in the queue when it
 * arrives, so an event pushed beforehand is not lost - it is delivered late.
 * The array is created here if it does not exist yet, which is safe because
 * that component reads `dataLayer || []` rather than assuming it owns it.
 *
 * !! NOTHING IS SENT OUTSIDE PRODUCTION !!
 *
 * Same guard, same reason as the component: there is one GA property, and
 * analytics that counts the people building the site is worse than none. In
 * development these print to the console instead, so a flow can be checked
 * locally without filing fake traffic.
 */

/** Where a call to action lives. Becomes the `placement` on the click event. */
export type QuotePlacement =
  | "header"
  | "mobile_menu"
  | "hero"
  | "closing_panel"
  | "silo_hero"
  | "service_hero"
  | "industry_hero"
  | "blog_post"
  | "case_study"
  | "how_we_work";

type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;

  /*
   * Never let a metric break the thing it is measuring. Everything below is
   * bookkeeping, and a visitor part way through an enquiry should not lose it
   * because an analytics array was in an unexpected state.
   */
  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, params);
      return;
    }

    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    /*
     * Written as an array rather than an `arguments` object, matching the
     * shape google-analytics.tsx already pushes. gtag.js reads the first three
     * slots either way.
     */
    w.dataLayer.push(["event", event, params]);
  } catch {
    /* Measuring is never worth an exception. */
  }
}
