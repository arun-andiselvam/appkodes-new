/** Brand-level facts referenced across the whole site. */
export const site = {
  name: "Hitasoft",
  /**
   * Absolute origin, needed for canonical URLs, Open Graph tags, the sitemap
   * and robots.txt. Every one of those has to be absolute, so guessing it per
   * file is how a staging URL ends up in production metadata. Set
   * NEXT_PUBLIC_SITE_URL on preview deployments to point them at themselves.
   *
   * hitasoft.com, confirmed by the client on 23 August 2026. It defaulted to
   * appkodes.com, the old brand, which put the wrong origin on every canonical,
   * every Open Graph tag and every sitemap entry. That was the blocking launch
   * issue recorded in docs/page-progress.md.
   *
   * !! www SINCE 25 AUGUST 2026, AND THE PREFIX IS NOT COSMETIC !!
   *
   * The client chose the www host over the bare apex that day. Neither ranks
   * better than the other - Google is explicit that it does not matter, only
   * that one is chosen and used consistently - so the deciding reason is a
   * technical one this deployment actually has: a cookie set on the bare apex
   * is sent to every subdomain under it, and this domain also carries
   * cms.hitasoft.com and internship.hitasoft.com. Serving the marketing site
   * from www keeps its cookies out of the Strapi admin's requests.
   *
   * !! THIS STRING IS WHAT EVERY CANONICAL SAYS. IT MUST MATCH THE HOST THAT
   * ACTUALLY SERVES THE PAGE !!
   *
   * A canonical naming a URL that immediately redirects elsewhere is worse
   * than no canonical, so this value and the apex-to-www redirect at the edge
   * are one decision in two places. Change either and the other has to move in
   * the same deploy. See lib/site-url.ts for why production never derives this
   * from the request host.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hitasoft.com",
  /**
   * The Appkodes wordmark, replacing the Hitasoft one on 18 September 2026.
   *
   * width and height are the asset's real pixels rather than a display size.
   * Both places that render it set the height in CSS - `h-7` in the header,
   * `h-6` once it shrinks on scroll, `h-8` in the footer - so these numbers
   * only ever serve as the aspect ratio Next reserves space with, and a wrong
   * ratio is what makes a logo jump on load.
   *
   * Converted losslessly from the client's 1080x163 PNG, which arrived with a
   * clean alpha and unmatted edges, so it needed no keying or cropping. At
   * `h-7` it draws 186 by 28, which the asset covers at better than 5x.
   *
   * !! TWO FILES, BECAUSE THE NAVY HALF VANISHES ON A DARK GROUND !!
   *
   * The mark is #0065FF and #001923. The navy is 1.1:1 on the dark theme's
   * background and on the footer's emphasis panel, so `srcOnDark` is the same
   * artwork in solid white, the whole mark, by client request on 18 September
   * 2026 (an earlier cut kept the blue and whitened only the navy). The header
   * shows one or the other by theme; the footer always sits on the dark panel
   * and always uses `srcOnDark`.
   */
  logo: {
    src: "/appkodes-logo.webp",
    srcOnDark: "/appkodes-logo-white.webp",
    width: 1080,
    height: 163,
    alt: "Appkodes",
  },
  // A proof point rather than a label: the headline already says what we do,
  // so this slot carries evidence the reader can weigh. Both figures are from
  // appkodes.com and are safe to publish. See docs/positioning.md.
  eyebrow: "18 years, 1000+ businesses served",
  // App development, no AI (18 September 2026). Also the site's default meta
  // description and the footer blurb.
  description:
    "We build mobile apps, web apps and MVPs on a fixed price and a fixed launch date, for businesses in more than 50 countries.",
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

/**
 * The header's WhatsApp button, desktop and mobile menu.
 *
 * Replaced the "Free quote" assistant button on 18 September 2026, at the
 * client's request. appkodes.com ran its main CTA through WhatsApp ("Ask Me
 * How?"), the channel its India and Gulf buyers already use, to this number.
 * The in-page "Get a free costed plan" buttons still open the assistant.
 */
export const whatsappContact = {
  label: "WhatsApp us",
  href: `https://wa.me/917708004693?text=${encodeURIComponent(
    "Hi, I came from appkodes.com and I would like to talk about my app.",
  )}`,
} as const;

/*
 * The rotating noun in "Your ___, live in 30 days." Changed 18 September 2026
 * from the industry list that rotated after "AI automation for". Appkodes
 * carries no AI messaging (Hitasoft.com owns that), and the 30 day promise is
 * appkodes.com's own hook. Every item here has to be something that can ship
 * in 30 days, because the headline promises it for each one.
 */
export const heroWords: string[] = [
  "mobile app",
  "web app",
  "MVP",
  "marketplace",
];

export const heroCopy = {
  /*
   * Read as one sentence: headlinePrefix, the rotating word and a comma on
   * the first line, then headline on the second. It was "AI automation for" over the
   * rotating industry until 18 September 2026.
   */
  headline: "live in 30 days.",
  headlinePrefix: "Your",
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
  /*
   * 18 September 2026: leads on the buyer's first fear, cost and time that
   * run away, and answers it with the two fixed terms. The AI version it
   * replaced led on dead proofs of concept, which is Hitasoft's argument now.
   */
  description:
    "Most software projects run late and over budget. Ours ship on a fixed price and a fixed date. You get an app your team can run and grow.",
  /*
   * Changed 25 August 2026, from "Book an automation review". The offer was
   * always free — docs/positioning.md had it flagged as an open decision
   * ("if it is free, say so loudly") — confirmed by the client and now said
   * outright rather than left for the FAQ to clarify.
   *
   * !! IN-PAGE LABELS ARE NOT THE HEADER'S LABEL !!
   *
   * Flattened to the header's "Free quote" on 27 August 2026 and put back the
   * same day. The header is a 12px button in a crowded bar and needs two
   * words; a hero button has the width of a paragraph and should say what the
   * offer actually is. Every one of these still opens the same assistant — the
   * button says what you get, not which widget appears.
   */
  /*
   * 18 September 2026: "Get a free costed plan". An automation audit means
   * nothing to a founder with no systems yet, and a costed plan is what the
   * first step actually hands over. Still free, still said on the button.
   */
  primaryCta: "Get a free costed plan",
  secondaryCta: "See case studies",
} as const;

/**
 * Stats ticker under the hero. Real figures from appkodes.com.
 *
 * "150+ team members" is the exception: given directly by the client on
 * 24 August 2026, not sourced from appkodes.com like the other four.
 */
export const heroStats = [
  { value: "18 years", label: "of delivery experience" },
  { value: "1000+", label: "clients worldwide" },
  { value: "2000+", label: "projects delivered" },
  { value: "50+", label: "countries delivered to" },
  { value: "150+", label: "team members" },
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
  /*
   * 18 September 2026: closes on the hero's promise instead of AI. The same
   * free costed plan as the hero button, named as what the visitor receives.
   */
  // "First release": every app is built new, and the brief qualifies the
  // 30-day promise to first releases (docs/positioning.md, section 6).
  headline: "Your first release could be live",
  headlineAccent: " next month.",
  description:
    "Tell us about the app you want to build. We send back a costed plan with a fixed price and a launch date, free and yours to keep.",
  primaryCta: "Get a free costed plan",
  secondaryCta: "See case studies",
  secondaryHref: "/resources/case-studies",
} as const;
