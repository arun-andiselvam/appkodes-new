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
  {
    number: "01",
    title: "We do the work, not your team",
    description:
      "You do not have to staff a technology project. We fit the automation into the systems you already run, so your week carries on as normal.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "Nobody in house babysits the AI",
    description:
      "Models drift, then quietly stop paying for themselves. We watch them and retrain them, then send a monthly report that takes five minutes to read.",
    visual: "ai",
  },
  {
    number: "03",
    title: "You get a plan, not a project to manage",
    description:
      "Two weeks of review, then you decide. You walk away with a costed plan and a short list of risks, yours to keep either way.",
    visual: "collab",
  },
  {
    number: "04",
    title: "Compliance without a compliance officer",
    description:
      "Regulated work stalls when nobody owns the paperwork. We settle data residency and audit trails in week one, so nothing surfaces as a surprise later.",
    visual: "security",
  },
];
