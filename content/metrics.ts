import type { Metric } from "./types";

/**
 * What the work returns, not what a server does.
 *
 * The template shipped platform telemetry here: API requests today, average
 * response time, uptime this quarter. Appkodes runs no API the buyer consumes,
 * so every one of those was a claim about a different company. The section
 * counts outcomes now, which is what docs/positioning.md argues for under the
 * track record notes. A number denominated in hours saved beats a number
 * denominated in milliseconds, because hours are what the client came for.
 *
 * Four axes, deliberately different from each other. How many businesses have
 * been through this, what it hands back, how long it took, and what it costs
 * them after. The before figure lives in the detail line of the hours tile
 * rather than in a tile of its own, since a saving and the thing it was saved
 * from are one comparison and spending two of four slots on it would crowd
 * out the money.
 *
 * Repeating the 2000+ / 1000+ / 50+ figures a third time would add no proof,
 * since the hero ticker and the track record section already spend them. The
 * client count here is the AI subset and is a smaller, later number. That is
 * the honest way round. Appkodes has 15 years of delivery and rather less than
 * that of AI work, and docs/positioning.md forbids blurring the two.
 *
 * !! ALL FOUR NUMBERS ARE DRAFTS, NOT MEASUREMENTS !!
 *
 * An earlier version had one backed figure, two weeks to a costed plan, taken
 * from the process in content/how-it-works.ts. Swapping it for time to go live
 * turned it into a measurement of past work, so nothing in this section is
 * sourced today. Every figure has to come from delivery records before the
 * page is published. Publishing an invented average is the mistake the
 * template made when it attributed "98% faster deployment" to Stripe. See
 * docs/positioning.md, claims discipline.
 *
 * The drafts are internally consistent and should stay that way when the real
 * figures land. 38 hours saved out of 52 is 73% of the labour, while the money
 * saved reads lower at 42% because tooling and our fee are in that number. A
 * buyer who does the arithmetic should find it holds.
 */
export const metrics: Metric[] = [
  {
    // DRAFT, both the count and the share without in house IT. The count is
    // the AI subset of the client base, not the 1000+ lifetime figure.
    //
    // The detail line used to read "Small teams, not enterprises", which named
    // the segment out loud and spent the line saying who we turn away. This
    // one shows the same thing through the reader instead. Someone who owns
    // the systems at a 40 person company and has nobody to hand them to should
    // finish the sentence thinking that is me. It is also the buyer described
    // in docs/positioning.md, where the operations lead often has no IT
    // department behind them at all.
    value: 40,
    label: "Businesses we have automated",
    detail: "Most had no IT department",
  },
  {
    // DRAFT. Roughly one full time role, which is why it reads as a lot to a
    // 40 person company. The detail line carries the before figure.
    value: 38,
    suffix: "hrs",
    label: "Handed back every week",
    detail: "Down from 52 hours done by hand",
  },
  {
    // DRAFT. Two weeks of review, then the build. Weeks, not quarters.
    value: 6,
    suffix: "weeks",
    label: "From first call to live",
    detail: "Your systems keep running throughout",
  },
  {
    // DRAFT. The figure the buyer takes to whoever holds the budget.
    value: 42,
    suffix: "%",
    label: "Cut from what it cost",
    detail: "Against the same process a year earlier",
  },
];
