import type { Award } from "./types";

/**
 * Third party recognition, in the slot the pricing tiers used to hold.
 *
 * Pricing shipped $0 and $29 subscription tiers with "1GB storage" and "Up to
 * 3 projects", which is a SaaS product's pricing page on a services company's
 * site. docs/positioning.md had already called it wrong. It was removed on 19
 * August 2026 and this took its place.
 *
 * The badges come from appkodes.com, so they are the company's own published
 * claims rather than anything assembled here. The source was a single 1274
 * pixel strip. It is split into four images so the row can wrap on a phone
 * instead of shrinking into an unreadable band, and so each badge carries its
 * own alt text.
 *
 * !! NO YEAR IS PRINTED, AND THAT IS DELIBERATE !!
 *
 * An earlier version showed 2023 against all four. Only two of them earn that.
 * TopDevelopers and ITFirms have 2023 set into their artwork, so the badge
 * says it for itself. AppFutura and SoftwareWorld print no year at all, and
 * 2023 was inferred from the fact that the four arrived on appkodes.com as one
 * image in March 2024. Inferring a date and then printing it as fact is the
 * habit this whole site has been cleaned of, so the field is gone until real
 * dates turn up.
 *
 * !! ALL FOUR ARE ABOUT APP DEVELOPMENT, NOT AUTOMATION !!
 *
 * The copy says so rather than leaving the reader to notice. They are also
 * directory awards rather than juried prizes, which is worth knowing when
 * deciding how much weight this section should carry. A recent badge, or one
 * naming the automation work, would be worth more than all four.
 */
export const awards: Award[] = [
  {
    name: "TopDevelopers",
    title: "Top Mobile App Developers",
    logo: "/awards/topdevelopers.png",
  },
  {
    name: "AppFutura",
    title: "Top App Development Company, India",
    logo: "/awards/appfutura.png",
  },
  {
    name: "SoftwareWorld",
    title: "Top Rated App Development Companies",
    logo: "/awards/softwareworld.png",
  },
  {
    name: "ITFirms",
    title: "Top Mobile App Development Companies",
    logo: "/awards/itfirms.png",
  },
];
