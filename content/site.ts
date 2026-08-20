import type { NavLink } from "./types";

/** Brand-level facts referenced across the whole site. */
export const site = {
  name: "Hitasoft",
  /**
   * Absolute origin, needed for canonical URLs, Open Graph tags, the sitemap
   * and robots.txt. Every one of those has to be absolute, so guessing it per
   * file is how a staging URL ends up in production metadata. Set
   * NEXT_PUBLIC_SITE_URL on preview deployments to point them at themselves.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://appkodes.com",
  /**
   * The Hitasoft wordmark, replacing the Appkodes one on 20 August 2026.
   *
   * width and height are the asset's real pixels rather than a display size.
   * Both places that render it set the height in CSS - `h-7` in the header,
   * `h-6` once it shrinks on scroll, `h-8` in the footer - so these numbers
   * only ever serve as the aspect ratio Next reserves space with, and a wrong
   * ratio is what makes a logo jump on load.
   *
   * The .webp is public/hitasoft-logo-c.png with its white background keyed
   * out and the resulting transparent margin cropped off, 831x216 down to
   * 818x167. The source does carry an alpha channel, but it only covers an
   * outer border: 42 per cent of the file is opaque white sitting behind and
   * between the letters, which rendered as a slab on the page background.
   * Trusting that alpha and skipping the key is exactly the bug to avoid.
   *
   * That source is small for a logo, so: at `h-7` the mark draws 137 by 28,
   * which the 818 by 167 asset still covers at 3x. Much beyond `h-12` would
   * start to soften it.
   */
  logo: {
    src: "/hitasoft-logo.webp",
    width: 818,
    height: 167,
    alt: "Hitasoft",
  },
  // A proof point rather than a label: the headline already says what we do,
  // so this slot carries evidence the reader can weigh. Both figures are from
  // appkodes.com and are safe to publish. See docs/positioning.md.
  eyebrow: "18 years, 1000+ businesses served",
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

/**
 * Where the site's two recurring calls to action point.
 *
 * Named here because the same two appear in the header, the hero, the mobile
 * menu and the closing panel, and three of those were plain buttons with no
 * destination at all. "#contact" is the closing panel, which every page ends
 * with. Swap it for a booking link when there is one and every control on the
 * site follows.
 */
export const actions = {
  book: "#contact",
  caseStudies: "/results",
} as const;

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
  /*
   * Changed on 20 August 2026.
   *
   * It read "Your systems keep running while we change them. We have spent 15
   * years moving businesses from paper to software, and AI is the next
   * chapter." Two problems with it.
   *
   * The first sentence answered a fear that belongs to a different buyer.
   * docs/positioning.md lists downtime third, and the enterprise column of the
   * framing table is where "zero downtime cutover" sits. A 40 person company
   * worries about it, but not before it has decided whether to bother with AI
   * at all, and the hero is where that decision starts.
   *
   * The second sentence repeated site.eyebrow, which renders directly above it
   * and already says "18 years, 1000+ businesses served". The hero spent its
   * only paragraph on a figure the reader had just met.
   *
   * It leads on the fourth fear now: another AI project that dies at proof of
   * concept. That one is specific to AI rather than to software work in
   * general, which is what this page is selling, and it is the fear a buyer
   * arrives with rather than one they develop later.
   */
  description:
    "Most AI projects never get past a demo. We build the ones that end up in daily use, which is a different job from building something impressive.",
  primaryCta: "Book an automation review",
  secondaryCta: "See case studies",
} as const;

/** Stats ticker under the hero. Real figures from appkodes.com. */
export const heroStats = [
  { value: "18 years", label: "of delivery experience" },
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
 * Rewritten on 20 August 2026. It had been the offer from
 * content/how-it-works.ts said a second time, which docs/positioning.md
 * recorded as deliberate: end on the same first step the process section
 * opens with rather than invent a new one. On the page that reads as the
 * reader being told about two weeks and a costed plan twice inside one scroll,
 * and on /how-we-work it is the third time.
 *
 * So the close now carries the argument rather than the mechanics. The reader
 * has seen what we do, how the engagement runs and who says it worked. What
 * the page never says out loud is why any of it is worth paying for, which is
 * that work done by hand is already being paid for and costs more than
 * software doing the same thing.
 *
 * !! NO FIGURES HERE ON PURPOSE !!
 *
 * Every number in content/metrics.ts is a draft rather than a measurement, so
 * a percentage or an hours count in this paragraph would be invented. The
 * claim is the shape of the saving, not its size. See docs/positioning.md,
 * claims discipline.
 *
 * The headline gives up the callback to the photographs above it. "A table or
 * a call. Either one works." picked up the meetings section, which was worth
 * doing while the paragraph underneath had nothing else to say. It also meant
 * three sentences in a row about where a meeting happens. What the buyer is
 * weighing at the bottom of the page is money, not venue.
 *
 * "Talk to sales" stays gone. This buyer is one person who decides, and there
 * is no sales team between them and the people who build.
 */
export const ctaCopy = {
  eyebrow: "Next step",
  headline: "Your team was not hired",
  headlineAccent: "to do what software does.",
  description:
    "The repeat work is already sitting on your payroll. Software doing it instead costs less every month, which is the figure whoever holds the budget asks for.",
  primaryCta: "Book an automation review",
  secondaryCta: "See how we work",
  secondaryHref: "/how-we-work",
} as const;
