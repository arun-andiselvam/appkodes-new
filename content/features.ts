import type { Feature } from "./types";

/**
 * Capability cards.
 *
 * Each one answers an objection an SMB or startup buyer is already holding,
 * rather than listing a feature. Order matters: continuity fear first, because
 * nothing else is heard until it is settled. See POSITIONING.md.
 */
export const features: Feature[] = [
  {
    number: "01",
    title: "Your business does not stop",
    description:
      "The old system stays live while we move workloads across. Each one runs in parallel until it proves itself, so you keep operating through the whole migration.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "Pilots that reach production",
    description:
      "Most AI projects stall at proof of concept. We ship with monitoring and retraining already in place, so your model still earns its keep in month six.",
    visual: "ai",
  },
  {
    number: "03",
    title: "Fixed scope before you commit",
    description:
      "Two weeks of assessment, then you decide. You walk away with a migration blueprint and a costed risk register, yours to keep either way.",
    visual: "collab",
  },
  {
    number: "04",
    title: "Built for regulated industries",
    description:
      "Compliance work starts before the first workload moves. We settle data residency and audit trails in week one, so nothing surfaces as a surprise later.",
    visual: "security",
  },
];
