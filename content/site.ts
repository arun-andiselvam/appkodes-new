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

/**
 * The closing section.
 *
 * It read "Ready to build something great?" over "Join thousands of teams
 * shipping faster with Appkodes. Start free, scale infinitely.", with buttons
 * for "Start building free" and "Talk to sales", and "No credit card
 * required" underneath. Every line of that sells a SaaS subscription. There is
 * nothing to sign up for, no free tier, and the thousands of teams were never
 * counted.
 *
 * The headline was also a rhetorical question, which the voice rules ban
 * outright, and questions are the weakest way to close.
 *
 * It now picks up the section immediately above it. That one ends on
 * photographs of clients and the team around a table under "Not every meeting
 * happens on a screen", so the close offers the same two options back and
 * lets the reader take whichever is easier. Landing on a fresh idea after
 * those pictures wasted the warmest moment on the page.
 *
 * The offer underneath is still the one in content/how-it-works.ts, so the
 * page ends on the same first step the process section describes rather than
 * inventing a new one. Two weeks, a price named up front, and a plan that is
 * yours either way answers the first and fifth fears in docs/positioning.md.
 *
 * "Talk to sales" is gone for the same reason "enterprise" is. This buyer is
 * one person who decides, and there is no sales team between them and the
 * people who build.
 */
export const ctaCopy = {
  eyebrow: "Next step",
  headline: "A table or a call.",
  headlineAccent: "Either one works.",
  description:
    "Near one of our offices, lunch is easy to arrange. If you are not, a call does the same job. Either way the first step is two weeks at a price named before anything starts. You keep the plan whether or not we build it.",
  primaryCta: "Book an automation review",
  secondaryCta: "See how we work",
  secondaryHref: "#how-it-works",
} as const;
