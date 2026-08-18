import type { Step } from "./types";

/**
 * The engagement, not a product tour.
 *
 * The old version walked through connecting tools and shipping to production,
 * which describes software the visitor would operate themselves. We are hired
 * to do the work, so the three steps are review, build and run.
 */
export const steps: Step[] = [
  {
    number: "I",
    title: "We look at how you work today",
    description:
      "The first week changes nothing in your business. We watch the work your team does by hand, then put a cost against every step.",
    duration: "Week 1 and 2",
    panelLabel: "what we do",
    output: `Two days sitting with your team
Every manual step written down
Hours and cost against each one
Ranked by what pays back fastest`,
  },
  {
    number: "II",
    title: "You get a costed plan",
    description:
      "At the end of week two you decide. It names what to automate first and what that saves every month, in numbers you recognise.",
    duration: "End of week 2",
    panelLabel: "what you get",
    output: `What to automate first
What the build costs
What it saves every month
What we leave alone`,
  },
  {
    number: "III",
    title: "We build it and keep it running",
    description:
      "Work starts once you approve the plan. We build into the systems you already run, or replace them where that turns out cheaper.",
    duration: "From week 3",
    panelLabel: "what happens next",
    output: `Built into your current tools
Your team shown how it works
Monitored after go live
Retrained when the numbers drift`,
  },
];
