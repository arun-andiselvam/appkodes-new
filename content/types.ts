import type { LucideIcon } from "lucide-react";

/**
 * Shared shapes for everything under content/.
 *
 * Content lives here rather than inside components so copy can be edited,
 * translated or sourced from a CMS without touching JSX. Each section imports
 * only the slice it renders.
 */

export type NavLink = {
  name: string;
  href: string;
};

export type Feature = {
  number: string;
  title: string;
  description: string;
  /** Key of the illustration rendered alongside the copy. */
  visual: string;
};

export type Step = {
  number: string;
  title: string;
  description: string;
  /** When this happens, shown in the panel footer. */
  duration: string;
  /** Label in the panel header, where a filename used to sit. */
  panelLabel: string;
  /** Plain lines listing what happens or what the client receives. */
  output: string;
};

/**
 * One card in the testimonials slider.
 *
 * Reviews and client videos share the slider, so they share a type. A video
 * can then sit between two reviews rather than being penned into its own row,
 * and the order in the array is the order on screen.
 */
export type TestimonialSlide =
  | {
      kind: "review";
      id: string;
      /** The reviewer's own display name on Trustpilot. */
      name: string;
      /** ISO country code, shown beside the date. */
      country: string;
      /** Month and year, e.g. "Apr 2025". */
      date: string;
      /** Their words, cut only at a sentence boundary and never reworded. */
      text: string;
      /**
       * Path under /public. Downloaded rather than hotlinked, which keeps
       * img-src closed and survives Trustpilot moving their CDN. Absent where
       * the reviewer has no picture, and initials show instead.
       */
      photo?: string;
    }
  | {
      kind: "video";
      id: string;
      /** YouTube id, the part after v= or youtu.be/. */
      youtubeId: string;
      /** Caption on the card and the accessible name of the player. */
      title: string;
      /** What the clip is, taken from the channel rather than invented. */
      description?: string;
      /**
       * Who is speaking. Optional because the clips are on the channel without
       * the speaker named anywhere, and a name nobody can confirm is the thing
       * this section had to be cleaned of once already.
       */
      speaker?: string;
      role?: string;
      /** Path under /public, never a YouTube thumbnail URL. */
      poster: string;
    };

export type Integration = {
  name: string;
  category: string;
  /**
   * simple-icons export name, e.g. "siClaude".
   *
   * Optional on purpose. Some entries are capabilities rather than companies,
   * and a few brands have had their marks pulled from the icon set. Anything
   * without one falls back to a monogram, never to another brand's logo.
   */
  icon?: string;
};

export type DeliveryHub = {
  /** Region clients sit in. */
  region: string;
  /** Markets inside that region we have delivered into. */
  markets: string;
  /** Projects delivered into that region. */
  projects: number;
};

export type SecurityFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Metric = {
  value: number;
  /** Unit shown after the numeral, at a smaller size so the figure leads. */
  suffix?: string;
  prefix?: string;
  label: string;
  /** Optional qualifier under the label, for how the figure is counted. */
  detail?: string;
};

/**
 * One audience the site speaks to, shown as a tab.
 *
 * docs/positioning.md names a single buyer at "roughly 10 to 500 people", but
 * every concrete detail under it describes a 20 to 100 person company. A two
 * person startup has no manual process to automate and no board to convince,
 * and a three hundred person company has both. Splitting them is what this
 * type exists for.
 */
export type AudienceSegment = {
  id: string;
  /** Tab label. */
  label: string;
  /** Company size this segment covers, shown beside the tabs. */
  headcount: string;
  /** The situation, in the buyer's words rather than ours. */
  situation: string;
  /**
   * Worked specifics, rendered as a quote rather than a spec sheet.
   *
   * One row per segment should set `emphasis`. That value renders large in the
   * display face and becomes the card's focal point, so it belongs on the fact
   * that does the most selling.
   */
  rows: { label: string; value: string; emphasis?: boolean }[];
};

/** Something true for every segment, so it sits outside the tabs. */
export type Assurance = {
  title: string;
  description: string;
};

/** A place where the team and a client were photographed together. */
export type MeetingPlace = {
  /** City or country, as the company labels it. */
  location: string;
  /** Path under /public. */
  image: string;
};

/** A badge awarded by somebody outside the company. */
export type Award = {
  /** Who gave it. */
  name: string;
  /** What it was given for. */
  title: string;
  /** Path under /public. */
  logo: string;
};

export type SocialLink = {
  name: string;
  href: string;
};

/**
 * One entry in the header's mega-menu panel.
 *
 * A group is a silo parent: it has its own page, a line saying what the silo
 * covers, and the child pages that sit under it. `children` is optional
 * because the Industries panel groups nothing - each industry is its own top
 * level page - and a group with no children renders as a single card. That
 * keeps both panels on one renderer instead of two that drift apart.
 */
export type NavGroup = {
  name: string;
  href: string;
  /** One line under the name. Written for a buyer scanning, not for a crawler. */
  blurb: string;
  /**
   * A short line under the name in the tiered panel's left rail.
   *
   * Added 23 August 2026, when the Services panel lost its "How we work"
   * footer strip and the rail inherited the height. Deliberately not `blurb`:
   * the blurbs run to about seventy characters, which wraps to two lines in a
   * 300px rail and makes the panel half as tall again. These are three or four
   * words, one line, and they say something the blurb does not, because the
   * selected silo shows both at once and two versions of one sentence reads as
   * a mistake.
   *
   * Optional. A rail without it just shows the name, which is what the
   * Industries and Resources panels do.
   */
  railNote?: string;
  children?: { name: string; href: string; blurb: string }[];
};

/**
 * One item in the main menu.
 *
 * `panel` present means the item opens a mega-menu and its `href` is the silo
 * parent, which is still a real page a visitor can land on. Absent means a
 * plain link. Nothing here is allowed a `#` destination; see content/footer.ts
 * for why that rule exists.
 *
 * `external` marks a destination outside this app, so components/layout/
 * navigation.tsx opens it in a new tab instead of routing to it, and a
 * visitor never loses the site they were on to follow it. Academy is the
 * first of these: internship.hitasoft.com is a real destination with no page
 * behind it in this repository, which the rule above otherwise requires.
 */
/**
 * The Services mega menu, 18 September 2026: an editorial list of link groups
 * (a small label and count over short, quiet links), a strip of next steps
 * under them, and a brand-blue feature card on the right.
 */
/** `icon` is a key the navigation maps to a thin-line glyph beside the label. */
export type NavColumnGroup = { name: string; icon: string; links: NavLink[] };
export type NavFeature = {
  eyebrow: string;
  title: string;
  text: string;
  stats: { value: string; label: string }[];
  cta: string;
};
/** href "quote" opens the quote assistant; "whatsapp" resolves to whatsappContact. */
export type NavStripLink = NavLink & { note: string; icon: "quote" | "whatsapp" | "cases" };

/** A plain call-to-action card on the right of a menu panel. */
export type NavCallout = { eyebrow: string; title: string; text: string; cta: NavLink };

/** One ready-made product in the Solutions menu, shown as a solution type. */
export type NavSolution = NavLink & { note: string; icon: string };

export type NavItem = {
  name: string;
  href: string;
  external?: true;
  /** Kept for the sitemap, breadcrumbs and llms.txt, but not drawn in the menu. */
  menuHidden?: true;
  /** Drawn in the menu only: allNavPages and the 404 finder skip it. */
  menuOnly?: true;
  panel?: {
    groups: NavGroup[];
    /**
     * When present, the desktop panel and the mobile accordion draw these
     * columns instead of `groups`. `groups` still feeds the sitemap, the
     * breadcrumbs and the 404 finder, which is why it is not replaced.
     */
    columns?: NavColumnGroup[][];
    /** When present, the panel draws these as a three-column list instead. */
    solutions?: NavSolution[];
    /** The card beside the solutions list. */
    callout?: NavCallout;
    feature?: NavFeature;
    strip?: NavStripLink[];
    /**
     * The strip along the bottom of the panel.
     *
     * Usually the "see everything" link for that panel's own contents. The
     * Resources panel carries the route to /how-we-work instead, which is a
     * deliberate exception rather than a mistake. See content/navigation.ts.
     *
     * !! blurb IS NOT DECORATION, IT FEEDS THE 404 FINDER !!
     *
     * `allNavPages` hardcoded one description for every footer strip, and it
     * read "How an engagement actually runs, week by week." That was written
     * when the Services panel carried How we work. The strip was removed on
     * 23 August 2026 and the sentence stayed behind, so the finder has been
     * describing "All industries" as an engagement ever since. The fix on
     * 24 August 2026 was to keep the description next to the link it
     * describes, which is why this is required rather than optional.
     */
    footer?: {
      name: string;
      href: string;
      blurb: string;
      /**
       * What a breadcrumb calls this destination, where the strip's own label
       * would not work as one.
       *
       * `name` is a call to action, because that is what a strip along the
       * bottom of a mega-menu is: "Show all resources", "All industries". A
       * breadcrumb names a place, and "Home > Resources > Show all resources >
       * How to Integrate LLM" reads like an instruction somebody left behind.
       * Google also expects a crumb to name the page it points at, and the
       * page behind that strip is titled Blog.
       *
       * Optional, and only worth setting where the two genuinely differ.
       */
      crumb?: string;
    };
  };
};

/**
 * A landing page built to the conversion blueprint in
 * docs/hitasoft_ai_architecture_strategy.md, section 4.
 *
 * Problem, solution, process, then the call to action. The blueprint also asks
 * for an ROI block, and this type gives it `outcomes` rather than numbers on
 * purpose: docs/positioning.md forbids publishing a figure nobody has
 * measured, and every percentage in a draft service page would be invented.
 * Outcomes state the shape of the return, which is claimable today. Swap in
 * measured figures when there are some.
 */
export type ServicePage = {
  /** Last segment of the URL, joined to the parent by the route file. */
  slug: string;
  /** H1, and the menu label if it differs. */
  title: string;
  /** Small label above the H1. */
  eyebrow: string;
  /** The sentence under the H1. */
  lede: string;
  /** <title> and meta description. */
  metaTitle: string;
  metaDescription: string;
  /** Step 1 of the blueprint: the friction, and what it costs to leave alone. */
  problem: { heading: string; body: string; points: string[] };
  /** Step 2: what we build, in the words a non-technical founder would use. */
  solution: { heading: string; body: string; points: string[] };
  /** Step 4: what changes afterwards. No invented figures. See above. */
  outcomes: string[];
};

/**
 * A service landing page, the long form.
 *
 * ServicePage above is the shared silo blueprint: problem, solution, outcomes,
 * eleven routes drawing the same four blocks. This is the richer shape set out
 * in docs/service-page-architecture.md, for the pages that have to rank on
 * their own rather than pass equity down a silo. It adds a hero with its own
 * proof, named capabilities, a dated process, a stack list and an FAQ.
 *
 * A page keeps its ServicePage entry as well. The silo still needs the short
 * form for the parent's card and the breadcrumb trail.
 *
 * Every figure quoted here has to be one the company can back. See the claims
 * discipline in docs/positioning.md, and note that the regional project splits
 * in content/infrastructure.ts are draft data and stay out of published copy.
 */
export type ServiceLanding = {
  /** Route path, leading slash. Keys the record and builds the canonical URL. */
  path: string;
  metaTitle: string;
  metaDescription: string;
  /**
   * The service, named plainly. Feeds both `name` and `serviceType` on the
   * Service schema.
   *
   * !! NOT THE TITLE TAG !!
   *
   * The schema used to read metaTitle, which was survivable while that read
   * "AI Software Integration Services" and became nonsense once the title was
   * written to its character budget. "AI Software Integration | Add AI to
   * Existing Apps" is a search result, pipe and all, and not the name of a
   * service. Keep this the bare phrase, lower case, matching the page's
   * primary keyword in docs/seo-standards.md.
   */
  serviceType: string;
  hero: {
    eyebrow: string;
    /** The H1. Two sentences is fine; the second one earns the first. */
    title: string;
    lede: string;
    /** Short proof under the call to action. Backed claims only. */
    badges: string[];
    /**
     * Label on the primary button, where the site's own is wrong for the page.
     *
     * Optional, and it falls back to heroCopy.primaryCta, so the nineteen
     * pages that shipped before it are untouched. IndustryLanding has carried
     * the same field since 22 August 2026, and this is that argument arriving
     * on the service side rather than a new idea.
     *
     * Added 2 September 2026 with the app development silo. The site button
     * reads "Book a free automation audit", which is the right offer on a page
     * about automating work somebody already does by hand. It is the wrong
     * offer where the premise is that the product does not exist yet, because
     * a visitor there has nothing to audit.
     */
    cta?: string;
  };
  /**
   * The friction, and what leaving it alone costs.
   *
   * `points` are titled rather than bare strings, which is the one place this
   * type diverges from ServicePage above. A silo child can carry three short
   * lines because the page around them is short. A page built to rank has to
   * say what each symptom costs, and a one line bullet has nowhere to put
   * that. They render as cards in the same vocabulary the home page uses for
   * its capability grid.
   */
  problem: {
    heading: string;
    body: string;
    points: { title: string; body: string }[];
  };
  capabilities: {
    heading: string;
    items: { title: string; body: string }[];
  };
  process: {
    heading: string;
    /** `when` carries the week, so the heading does not have to promise one. */
    steps: { when: string; title: string; body: string }[];
  };
  /**
   * Where the work is built, and where it ends up running.
   *
   * !! DO NOT PUT THE COUNTRY LIST BACK !!
   *
   * This carried `clientLocations`, a list of five countries rendered under a
   * "Clients met in person" heading. Removed from the type and from every
   * service page on 22 August 2026 at the client's request.
   *
   * It is worth knowing why the field was so carefully named, in case somebody
   * is tempted to reintroduce the idea. It was called `offices` for about an
   * hour on 21 August 2026, under a heading reading "Built in five offices",
   * and the company has no office in any of them. The corrected facts, one
   * office in Madurai, are in docs/positioning.md. Any future attempt to say
   * something about geography on these pages starts by reading that.
   *
   * `points` carry a label each. Three checkmarked lines with nothing naming
   * them made the reader work out what they had in common. The labels are the
   * questions a buyer actually arrives with, so the block reads as a spec
   * rather than as three assurances that happened to be grouped.
   *
   * `href` turns a point into a link, and it is optional because most of them
   * are not one. Added 2 September 2026 for the app development hub, whose
   * whole credibility rests on naming the two cases where a build is the wrong
   * answer and sending the reader to the silo that handles each. A section
   * that names another page and does not link to it asks a buyer to go and
   * find it, and the silo wiring in
   * docs/hitasoft_ai_architecture_strategy.md is the reason the page exists in
   * that shape at all.
   *
   * !! THIS IS NOT A ROUTE FOR SIDEWAYS LINKS IN GENERAL !!
   *
   * components/sections/service-landing.tsx sets out why the children block
   * points down and stays pointing down. This does not change that. It is one
   * page's argument about when to leave, on a page that has to make it to be
   * honest, and a page that fills all three points with links to siblings is
   * doing something the review on 22 August 2026 already rejected.
   */
  reach: {
    heading: string;
    body: string;
    points: { label: string; body: string; href?: string }[];
  };
  /**
   * What the integration is built from and plugs into.
   *
   * Items are `Integration`, the same shape the home page marquee uses, rather
   * than bare strings. That buys three things. The mark renders from the
   * shared map in components/ui/brand-mark.tsx, the category line says what
   * each entry is for instead of leaving a buyer with no IT department to
   * guess, and anything listed here can be lifted straight from
   * content/integrations.ts without being retyped and quietly reworded.
   *
   * Nothing may appear here that is not already vetted in
   * content/integrations.ts. That file carries a confirm before launch warning
   * because the list is a claim about what has actually been delivered, and a
   * service page is the last place to widen it.
   */
  stack: {
    heading: string;
    body: string;
    groups: { label: string; items: Integration[] }[];
  };
  /**
   * The same work, described in the systems it actually sits in.
   *
   * Added 22 August 2026. `capabilities` above names what we do and does it
   * conceptually: LLM API integration, custom wrappers, legacy upgrades. A
   * founder reading that cannot picture a Tuesday. These are three jobs in
   * three real systems, which is also where the long tail search traffic is,
   * since nobody types "custom AI wrapper" and plenty of people type
   * something about searching their own tickets.
   *
   * `system` is the seat it happens in rather than a product category, and
   * the order is deliberate. Internal tools first, because that is the buyer
   * docs/positioning.md describes. Customer facing last, because that is the
   * smaller segment and leading with it is the SaaS misread this page was
   * already corrected for once.
   */
  scenarios: {
    heading: string;
    body: string;
    items: { system: string; title: string; body: string }[];
  };
  /**
   * One paragraph defining the service in plain terms, for the machines.
   *
   * Added 21 August 2026 from the GEO blueprint. An answer engine quoting this
   * page needs a self-contained definition it can lift without the surrounding
   * layout, and a hero headline is too short to serve as one. This is also the
   * `description` on the Service schema, so the prose and the structured data
   * cannot say different things.
   *
   * The heading is not decoration. Shipped without one, the paragraph sat at
   * display size under the hero with nothing above it and read as an orphan.
   */
  summary: { heading: string; body: string };
  /**
   * Integration against rebuilding what the buyer already runs, side by side.
   *
   * Answer engines synthesise comparison tables readily, which is why the
   * blueprint asks for one. Every cell is a characterisation rather than a
   * statistic. The version that came in quoted "$50,000+" and "6 to 12
   * months", and neither figure is one the company can back.
   */
  comparison: {
    heading: string;
    body: string;
    /** Column headings, rebuild first. */
    columns: [string, string];
    /**
     * One row. `values` lines up with `columns`, left then right.
     *
     * These keys were `rebuild` and `integration`, named for the only
     * comparison that existed at the time. The child page compares training a
     * model against calling an API, where a field called `rebuild` holding
     * "months of data work" is a lie waiting for an editor. Renamed 22 August
     * 2026.
     */
    rows: { label: string; values: [string, string] }[];
  };
  faqs: { question: string; answer: string }[];
  /**
   * The closing panel's copy, where the site's own does not fit the page.
   *
   * Optional and partial. Anything left out falls back to ctaCopy in
   * content/site.ts, which is what every page shipped before 2 September 2026
   * still does. lib/service-landing-route.tsx hands it to CtaSection, and
   * /how-we-work has passed the same prop since 24 August 2026.
   *
   * It exists for the same reason `hero.cta` above does. The site panel reads
   * "Let AI do the repetitive half of the job", which is the automation pitch
   * and is right on eighteen of these pages. A visitor on the app development
   * silo has no repetitive half to hand over, because the software they came
   * to talk about has not been written.
   *
   * Anything set here still has to pass docs/positioning.md. An override is a
   * one line route around copy that was rewritten twice to be understood.
   */
  cta?: {
    eyebrow?: string;
    headline?: string;
    headlineAccent?: string;
    description?: string;
    primaryCta?: string;
    secondaryCta?: string;
    secondaryHref?: string;
  };
  /**
   * The architecture diagram beside the hero headline.
   *
   * Optional: a service page without one just gets a wider headline column.
   *
   * Rows run top to bottom, and the component wires them into a hierarchy: the
   * single node on the first row feeds the pair below it, and the right hand
   * node of each pair feeds the row under that. Pairs are also joined across.
   * The shape is fixed because the diagram describes one architecture, not any
   * architecture.
   *
   * `tone` is the story, not decoration. Brand blue is what the client already
   * owns and accent red is what the integration adds, so the split down the
   * diagram says which half of it is new work.
   */
  diagram?: ArchitectureDiagram;
};

/**
 * The architecture drawn beside a hero headline.
 *
 * Lifted out of ServiceLanding on 21 August 2026 when the industry pages
 * wanted one too. Rendered by components/backgrounds/integration-diagram.tsx.
 *
 * Rows run top to bottom, and the component wires them into a hierarchy: the
 * single node on the first row feeds the pair below it, and the right hand
 * node of each pair feeds the row under that. Pairs are also joined across.
 * The shape is fixed because the component draws one architecture, not any
 * architecture.
 *
 * `tone` is the story, not decoration. Brand blue is what the client already
 * owns and accent red is what the integration adds, so the split down the
 * diagram says which half of it is new work.
 *
 * !! EVERY PAGE DRAWS ITS OWN ARCHITECTURE, NOT THE HOUSE SHAPE !!
 *
 * Three pages independently arrived at the same skeleton: one node, feeding
 * one node, feeding a fork, joining into one. Read side by side on 22 August
 * 2026 they were the same picture with the labels swapped, which is how a
 * reader works out they are on a template. Rows of one and rows of two can be
 * arranged more than one way, and the connectors compute every gap from where
 * the nodes actually sit, so a different topology costs nothing.
 *
 * Before writing one, check the diagrams that already ship. If the new page's
 * shape matches one of them, either the architecture genuinely is the same, in
 * which case say so in the copy and drop the diagram, or the shape has not
 * been thought about yet. Opening on a pair rather than on a single node is
 * usually enough to tell a fan in apart from a pipeline.
 */
export type ArchitectureDiagram = {
  /** Read in place of the shapes by anything that cannot see them. */
  caption: string;
  /**
   * How a lone node sits against a pair.
   *
   * `cascade` puts it in the right hand column, which is what a hierarchy
   * wants: the interface above the layer it talks to, stepping down.
   *
   * `sequence` centres it, which is what an order of events wants, and it is
   * the only arrangement in which a pair can rejoin into one step without the
   * rule doubling back on itself.
   *
   * Defaults to cascade, which is what the parent service page draws.
   */
  align?: "cascade" | "sequence";
  /*
   * There was a `numbered` flag here that put 01 through 04 above each label.
   * Removed 22 August 2026 at the client's request. Do not reintroduce it
   * without asking: the request covered every diagram on the site, not one
   * page's.
   */
  rows: { label: string; sub?: string; tone: "brand" | "accent" }[][];
};

/**
 * An industry landing page, the long form.
 *
 * Built to docs/industry-page-architecture.md. It is a sibling of
 * ServiceLanding rather than a reuse of it, because the two argue differently.
 * A service page has to beat a rebuild, so it carries a process and a
 * comparison table. An industry page has to prove we understand a trade, so it
 * carries sector use cases, the compliance answer that trade asks first, and
 * the software that trade already runs.
 *
 * A page here keeps its content/industries.ts entry, exactly as the service
 * landings keep theirs. The short form still feeds the menu card and the
 * breadcrumb trail.
 *
 * Every claims rule from docs/positioning.md applies, and the brief for this
 * page breaks several of them. See the notes in content/industry-landings.ts.
 */
export type IndustryLanding = {
  /** Route path, leading slash. Keys the record and builds the canonical URL. */
  path: string;
  metaTitle: string;
  metaDescription: string;
  /** Sector this page speaks to, for the Service schema's audience. */
  audience: string;
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    /** Short proof under the call to action. Backed claims only. */
    badges: string[];
    /** Label on the primary button, since an industry page names its own audit. */
    cta: string;
  };
  /** The quotable definition, and the Service schema's description. */
  summary: { heading: string; body: string };
  /** The bottleneck this trade already recognises. */
  problem: { heading: string; body: string; points: { title: string; body: string }[] };
  /**
   * What we build for it, in that trade's own vocabulary.
   *
   * Full width rows rather than three cards, which is one of the things that
   * separates this page from a service page. A row has space for specifics, so
   * each one carries `detail`: short fragments naming what the integration
   * actually does, which thirty words in a third width card had no room for.
   */
  useCases: {
    heading: string;
    items: { title: string; body: string; detail: string[] }[];
  };
  /**
   * The rest of the sector, after the specific hooks have done their work.
   *
   * Optional, because not every industry has adjacent corners worth naming and
   * a page should not carry an empty gesture at breadth.
   *
   * !! THIS IS NOT A CLAIM TO COVER A WHOLE SECTOR !!
   *
   * It was suggested on 22 August 2026 as a grid headed "We build AI for the
   * full financial spectrum". That is a coverage claim, and content/
   * industries.ts states the opposite position in the file next door: the
   * industry pages are use cases rather than a claim to specialise, and a page
   * joins the list once there is something specific to say.
   *
   * So each entry says how the work maps onto capabilities already described
   * further up the page, which is true and is also the more useful answer. A
   * lending buyer wants to know we understand that a loan file is a document
   * problem before a scoring problem. Naming the sector and stopping there
   * tells them nothing.
   *
   * The strategy behind it is sound and is why it exists at all. Specific copy
   * converts and generic copy captures, so the page leads with ledgers and
   * invoices and widens here, at the bottom, where it cannot dilute them.
   */
  breadth?: {
    heading: string;
    body: string;
    items: { title: string; body: string }[];
  };
  /**
   * The pipeline for one job in this trade, end to end.
   *
   * !! ONE STEP HAS TO BE A PERSON !!
   *
   * The whole point of the section is that it names where a human still sits.
   * docs/industry-page-architecture.md asks for copy reading "without human
   * intervention" and "instantly resolving tickets", and this section is the
   * answer to why that was not published. A buyer who has had a pilot die
   * already, which docs/positioning.md says the mid size buyer has, does not
   * believe a pipeline with nobody in it.
   *
   * Step bodies run under ten words on purpose. They are captions on a
   * diagram, not prose, and the 11 to 14 word band the voice rules forbid is
   * very easy to land in when a caption is allowed to grow.
   */
  workflow: {
    heading: string;
    body: string;
    steps: { label: string; body: string; human?: boolean }[];
  };
  /**
   * The compliance answer, which an industry page cannot skip.
   *
   * Icons are lucide, imported in the content file the way content/security.ts
   * already does it. Every line has to be something the company can do by
   * deciding to do it, with no auditor involved. That file explains why.
   */
  security: {
    heading: string;
    body: string;
    items: { icon: LucideIcon; title: string; body: string }[];
  };
  /**
   * The software this trade already runs, for entity clustering.
   *
   * Same Integration shape and same shared mark map as the service page stack.
   * The framing matters: this is what clients bring us, not a list of
   * integrations we are claiming to have delivered.
   */
  ecosystem: {
    heading: string;
    body: string;
    /**
     * One flat list, because this renders as a marquee rather than a grid.
     *
     * It was grouped under four labels, the same shape the service page stack
     * uses. Grouping is what a static grid needs and a scrolling row has no
     * use for, and reusing that shape was part of why the two pages looked
     * identical. The card carries the name and what the tool is for, which is
     * the whole meaning the group labels were adding.
     *
     * Keep it above about ten entries. The set is rendered twice to loop, so a
     * short list visibly repeats itself inside one screen.
     */
    items: Integration[];
  };
  faqs: { question: string; answer: string }[];
  /**
   * The hero visual: a short stack of the trade's own paperwork, tilted.
   *
   * Not an ArchitectureDiagram. That component is the service page's
   * signature, and relabelling its boxes gave the industry page the same
   * opening as the page it is meant to be distinct from. The service hero
   * draws things connecting to each other. This draws one object sitting
   * there, which is a different grammar and cannot be mistaken for it.
   *
   * !! THE FIELD NAMES ARE DELIBERATELY NOT FINANCIAL !!
   *
   * This was `ledger`, with rows of `date`, `description`, `amount` and
   * `category`, because finance was the first industry built. Renamed 23
   * August 2026, while one page used it rather than six. A delivery note, a
   * consultation record, a marked assignment and a moderation queue are all
   * the same four columns, and an author writing the healthcare page should
   * not have to put a consultation length in a field called `amount`.
   *
   * The rows are an illustration of a screen, not a client's records. They are
   * written to look like nobody's real data on purpose.
   *
   * `label` and `footnote` were removed on 23 August 2026 along with the bar
   * that rendered them. The visual carries the argument on its own and the
   * caption carries the words.
   */
  record: {
    /**
     * Which arrangement the panel draws itself in.
     *
     * !! REQUIRED, SO EVERY PAGE HAS TO CHOOSE !!
     *
     * There was one arrangement until 23 August 2026, a three by six field. It
     * was designed for fintech and the other four industry pages inherited it,
     * which meant a ledger, a stock room, a clinic day, a feed and a gradebook
     * were all drawn as the same object. Making this optional with a default
     * would put the next page straight back into that.
     *
     * Each one says something the others cannot. See the layout functions in
     * components/backgrounds/record-stack.tsx.
     */
    layout: "field" | "shelf" | "day" | "stream" | "cohort";
    /**
     * Labels for the across axis. `cohort` only, and required by it.
     *
     * This is not the `columns` field removed on 23 August 2026 with the
     * caption bar. That one labelled the four fields of a row. This names the
     * second axis of a matrix, which only the gradebook has.
     */
    axis?: string[];
    /** Read in place of the panel by anything that cannot see it. */
    caption: string;
    rows: {
      /** Narrow left column. A date, a reference, a time. */
      when: string;
      /** The wide column, and the part a reader actually scans. */
      what: string;
      /** Right aligned and monospaced. A sum, a count, a duration. */
      value: string;
      /** The tag under `what`. What the model decided this row is. */
      status: string;
      /** Held for review rather than posted. Exactly one row should set this. */
      flagged?: boolean;
    }[];
  };
};
