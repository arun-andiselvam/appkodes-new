import type { NavLink } from "./types";

/** Brand-level facts referenced across the whole site. */
export const site = {
  name: "Appkodes",
  logo: {
    src: "/appkodes-logo.webp",
    width: 256,
    height: 40,
    alt: "Appkodes",
  },
  // A proof point rather than a label: the headline already says what we do,
  // so this slot carries evidence the reader can weigh. Both figures are from
  // appkodes.com and are safe to publish. See docs/positioning.md.
  eyebrow: "15 years, 1000+ businesses served",
  description:
    "We put AI into the systems you already run, or build the replacement, so your team spends less time on work software should be doing.",
} as const;

/**
 * Primary navigation.
 *
 * Ordered for the SMB and startup buyer: what we do, then the offer that
 * matters most (automation), then proof they are the right kind of client.
 * The ready-made product catalogue lives in the footer instead. Someone
 * choosing an automation partner should not meet a clone script in the menu.
 *
 * The last link used to read "Case Studies" and point at #studio, a leftover
 * anchor from the template. It landed the visitor on a wall of platform
 * uptime counters. That section counts outcomes now, so the label and the
 * anchor say so. Case studies come back as their own section once there is
 * delivered client work cleared to name.
 */
export const navLinks: NavLink[] = [
  { name: "AI Automation", href: "#features" },
  { name: "How we work", href: "#how-it-works" },
  { name: "Industries", href: "#integrations" },
  { name: "Results", href: "#results" },
];

/**
 * What the hero headline cycles through.
 *
 * These stopped being a subset of the Industries menu on 19 August 2026. Two
 * of them are not industries at all. B2B and B2C are business models that cut
 * across every sector, and "your business" is nobody's industry. The list
 * answers who the sentence is for rather than which markets we serve, so the
 * Industries menu below stays the real taxonomy and this does not.
 *
 * "Your business" earns the last slot. A rotating list of sectors quietly
 * excludes everyone it does not name, and most of this audience runs something
 * that fits no label on the page. Ending on the catch all turns the rotation
 * from a filter into an invitation.
 *
 * B2B and B2C, not "B2B Business". The headline already supplies the noun, so
 * the longer form reads as "AI automation for B2B Business".
 *
 * The cost is dwell time. Eight words at the old 2.5s cycle ran twenty seconds
 * end to end, long enough that most visitors would leave before their own
 * segment appeared. The interval in hero-section.tsx drops to 2s to hold the
 * full cycle near sixteen. Adding a ninth word means revisiting that again.
 */
export const heroWords: string[] = [
  "healthcare",
  "finance",
  "retail",
  "logistics",
  "media",
  "B2B",
  "B2C",
  "your business",
];

export const heroCopy = {
  headline: "AI automation for",
  headlinePrefix: "",
  description:
    "Your systems keep running while we change them. We have spent 15 years moving businesses from paper to software, and AI is the next chapter.",
  primaryCta: "Book an automation review",
  secondaryCta: "See case studies",
} as const;

/** Stats ticker under the hero. Real figures from appkodes.com. */
export const heroStats = [
  { value: "15 years", label: "of delivery experience" },
  { value: "1000+", label: "clients worldwide" },
  { value: "2000+", label: "projects delivered" },
  { value: "50+", label: "countries delivered to" },
] as const;

/** Full industry list for the Industries menu and section. */
export const industries: string[] = [
  "Healthcare",
  "Financial Services",
  "Retail & eCommerce",
  "Logistics & Mobility",
  "Manufacturing & Supply Chain",
  "Media & Entertainment",
  "Real Estate & Hospitality",
];
