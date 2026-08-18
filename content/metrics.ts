import type { Metric } from "./types";

/**
 * What the work returns, not what a server does.
 *
 * The template shipped platform telemetry here: API requests today, average
 * response time, uptime this quarter. Appkodes runs no API the buyer consumes,
 * so every one of those was a claim about a different company. The section now
 * counts outcomes, which is what docs/positioning.md argues for under the
 * track record notes. A number denominated in hours saved beats a number
 * denominated in milliseconds, because hours are what the client came for.
 *
 * The four axes are deliberately different from each other. Time returned,
 * speed to a decision, money, and whether the thing survives. Repeating the
 * 2000+ / 1000+ / 50+ figures a third time would have added no proof, since
 * the hero ticker and the track record section already spend them.
 *
 * !! THREE OF THESE FOUR NUMBERS ARE DRAFTS, NOT MEASUREMENTS !!
 *
 * Only "2 weeks to a costed plan" is backed today, and it comes from the
 * process described in content/how-it-works.ts. The other three have to be
 * replaced with figures from delivered work before this page is published.
 * Publishing an invented average is the mistake the template made when it
 * attributed "98% faster deployment" to Stripe. See docs/positioning.md,
 * claims discipline.
 */
export const metrics: Metric[] = [
  {
    // DRAFT. Roughly one full time role, which is why it reads as a lot to a
    // 40 person company. Needs the real average across delivered automations.
    value: 38,
    suffix: "hrs",
    label: "Given back every week",
    detail: "Average across one delivered automation",
  },
  {
    // Backed. Week 1 and 2 are the review, the plan lands at the end of week 2.
    value: 2,
    suffix: "weeks",
    label: "From first call to a costed plan",
    detail: "Whether or not you carry on with us",
  },
  {
    // DRAFT. The figure the buyer takes to whoever holds the budget.
    value: 5,
    suffix: "months",
    label: "Before the build pays for itself",
    detail: "Against the hours it takes off the team",
  },
  {
    // DRAFT. Answers the fear that an AI project dies at proof of concept.
    value: 90,
    suffix: "%",
    label: "Still running a year later",
    detail: "Counted after go live, not at launch",
  },
];
