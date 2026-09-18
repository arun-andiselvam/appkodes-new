import type { Feature } from "./types";

/**
 * Capability cards.
 *
 * The section heading promises the reader does not need an IT team to automate.
 * Each card has to earn that: name a job they would otherwise have to staff,
 * then say we own it. Order matters, continuity first, because nothing else is
 * heard until it is settled. See docs/positioning.md.
 */
export const features: Feature[] = [
  /*
   * Rewritten 18 September 2026 for Appkodes as an app development business.
   * No AI anywhere: that is Hitasoft.com's pitch. Cards two and four draw on
   * appkodes.com's own "Support and maintenance" and "Security" cards.
   */
  {
    number: "01",
    title: "We build it. You run the business.",
    description:
      "You never have to hire a development team. We design and launch the app while your business carries on exactly as it did before.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "Launch day is not the finish line",
    description:
      "Phones update and app stores change their rules every year. We fix the bugs and keep the app current, then send a monthly report that takes five minutes.",
    visual: "ai",
  },
  {
    number: "03",
    title: "You get a plan, not a project to manage",
    description:
      "The first step is a free costed plan. You see the price and the launch date first, and the plan stays yours whether you go ahead or not.",
    visual: "collab",
  },
  {
    number: "04",
    title: "Security from week one",
    description:
      "Your users trust you with their personal data every day. We encrypt their data and review the code for holes, so nothing surprises you after launch.",
    visual: "security",
  },
];
