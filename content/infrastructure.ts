import type { DeliveryHub } from "./types";

/**
 * Where clients are, not where we sit.
 *
 * !! THE PROJECT COUNTS BELOW ARE A DRAFT SPLIT, NOT REAL DATA !!
 *
 * They add up to the 2,000 figure appkodes.com publishes, but the distribution
 * across regions is invented and has to be replaced with the real numbers
 * before this page is published. Same for the market lists. Publishing a made
 * up count per region is the same mistake as the fabricated client stats that
 * shipped with the template. See docs/positioning.md, claims discipline.
 */
export const deliveryHubs: DeliveryHub[] = [
  {
    region: "North America",
    markets: "United States, Canada",
    projects: 620,
  },
  {
    region: "Europe and UK",
    markets: "United Kingdom, Germany, Netherlands",
    projects: 480,
  },
  {
    region: "Middle East",
    markets: "United Arab Emirates, Saudi Arabia, Qatar",
    projects: 390,
  },
  {
    region: "Asia Pacific",
    markets: "Singapore, Indonesia, Australia",
    projects: 310,
  },
  {
    region: "India and South Asia",
    markets: "India, Sri Lanka, Bangladesh",
    projects: 240,
  },
];

/**
 * Headline total, derived from the rows rather than typed twice.
 *
 * The section used to hard code "2000+" beside a list that summed to exactly
 * 2,000, so the plus sign was not earned and any edit to a row would have
 * silently contradicted the headline. Rounding down to the nearest hundred
 * keeps the claim true for any split that clears the mark.
 */
export const projectsTotal = deliveryHubs.reduce(
  (sum, hub) => sum + hub.projects,
  0,
);

export const projectsHeadline = `${Math.floor(projectsTotal / 100) * 100}+`;
