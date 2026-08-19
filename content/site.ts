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
 * These became routes on 19 August 2026, when the site stopped being one long
 * page. Anchors only worked while every section shared a document, and a menu
 * that scrolls cannot show a visitor where they are or let them link a
 * colleague to one part of the pitch.
 *
 * Ordered for the SMB and startup buyer: what we do, then how the engagement
 * runs, then the proof. The ready-made product catalogue stays in the footer.
 * Someone choosing an automation partner should not meet a clone script in the
 * main menu.
 *
 * Industries is deliberately absent. It pointed at `#integrations` for months,
 * a section about models and tooling, and there is no industries content to
 * route to yet. A missing item beats one that lies about where it goes. It
 * comes back when there is something real behind it.
 */
export const navLinks: NavLink[] = [
  { name: "AI Automation", href: "/ai-automation" },
  { name: "How we work", href: "/how-we-work" },
  { name: "Results", href: "/results" },
];

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
  secondaryHref: "/how-we-work",
} as const;
