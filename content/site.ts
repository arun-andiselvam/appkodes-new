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
 * Primary navigation moved to content/navigation.ts on 20 August 2026.
 *
 * It was a flat `navLinks` array of three routes and it lived here, next to
 * the brand facts, because three links need no file of their own. The silo in
 * docs/hitasoft_ai_architecture_strategy.md is a tree: five menu items, two of
 * which own six child pages between them, plus the breadcrumb trail that walks
 * back up it. That is a structure rather than a list, so it has its own file
 * and its own types.
 *
 * Import `mainNav` from content/navigation.ts. Nothing should re-add a link
 * array here; two lists of routes disagree with each other within a week.
 */

/**
 * Where the site's two recurring calls to action point.
 *
 * Named here because the same two appear in the header, the hero, every silo
 * landing page and the closing panel.
 *
 * `book` was "#contact", an anchor to the closing panel, because a booking
 * page did not exist. One does now. An anchor also broke quietly on any page
 * that happened not to render the closing panel, and a menu item called
 * Contact that scrolls a bit rather than going somewhere is the kind of thing
 * a visitor stops trusting. The panel keeps its id, so "/#contact" still
 * works if anything wants the old behaviour.
 *
 * `caseStudies` moved under Resources on 20 August 2026, when case studies
 * stopped being a menu item of its own. Everything pointing at the proof reads
 * it from here, so the move was one line.
 */
export const actions = {
  book: "/contact",
  caseStudies: "/resources/case-studies",
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
 *
 * Rewritten again on 21 August 2026, because the client read it back and could
 * not tell what it meant.
 *
 * It said "Your team was not hired to do what software does", with a paragraph
 * about payroll and "the figure whoever holds the budget asks for". Two faults.
 * The headline was a riddle: the reader has to work out what software does,
 * then work out which of their own staff are doing it, before the sentence
 * lands. And the paragraph promised a figure without ever giving one, which is
 * the worst of both. It reads as evasive rather than disciplined.
 *
 * The version below names the work instead. Data entry, repeat tickets, numbers
 * carried between systems. A reader recognises their own week in that list in
 * about a second, and nobody has to decode anything. The last line draws the
 * boundary, which is the reassurance this buyer actually needs: their people
 * are not being replaced, the dull half of the job is.
 */
export const ctaCopy = {
  eyebrow: "Next step",
  headline: "Let AI do the repetitive",
  headlineAccent: " half of the job.",
  description:
    "Data entry, answering the same tickets, chasing numbers between systems. We automate the parts that repeat. Your team keeps the parts that need judgement.",
  primaryCta: "Book an automation review",
  secondaryCta: "See how we work",
  secondaryHref: "/how-we-work",
} as const;
