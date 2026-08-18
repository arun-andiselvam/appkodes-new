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
 * Industries cycled by the hero headline. Deliberately four, not the full
 * seven in the Industries menu: the headline rotates on a 2.5s cycle, so a
 * longer list means the highest-value segments may never appear on screen.
 */
export const heroWords: string[] = ["healthcare", "finance", "retail", "logistics"];

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
