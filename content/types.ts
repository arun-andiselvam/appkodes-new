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
  children?: { name: string; href: string; blurb: string }[];
};

/**
 * One item in the main menu.
 *
 * `panel` present means the item opens a mega-menu and its `href` is the silo
 * parent, which is still a real page a visitor can land on. Absent means a
 * plain link. Nothing here is allowed a `#` destination; see content/footer.ts
 * for why that rule exists.
 */
export type NavItem = {
  name: string;
  href: string;
  panel?: {
    groups: NavGroup[];
    /** The strip along the bottom of the panel, for the "see everything" link. */
    footer?: { name: string; href: string };
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
  hero: {
    eyebrow: string;
    /** The H1. Two sentences is fine; the second one earns the first. */
    title: string;
    lede: string;
    /** Short proof under the call to action. Backed claims only. */
    badges: string[];
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
   * !! `clientLocations` IS WHERE THE CLIENTS ARE, NOT WHERE WE ARE !!
   *
   * The field was called `offices` for about an hour on 21 August 2026, under
   * a heading reading "Built in five offices". The company has no office in
   * any of them. They are places where clients sit and where the team has met
   * them face to face, confirmed by the client that day, and the name says so
   * now because a vaguer one is what let the claim drift in the first place.
   *
   * Anything rendering this list has to label it as client locations. See the
   * corrected verified facts list in docs/positioning.md.
   *
   * They are displayed rather than written into the paragraph, because five
   * place names inside a sentence is an inline list of five where
   * docs/positioning.md allows two.
   *
   * `points` carry a label each. Three checkmarked lines with nothing naming
   * them made the reader work out what they had in common. The labels are the
   * questions a buyer actually arrives with, so the block reads as a spec
   * rather than as three assurances that happened to be grouped.
   */
  reach: {
    heading: string;
    body: string;
    clientLocations: string[];
    points: { label: string; body: string }[];
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
   * Rebuild against integration, side by side.
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
    rows: { label: string; rebuild: string; integration: string }[];
  };
  faqs: { question: string; answer: string }[];
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
 */
export type ArchitectureDiagram = {
  /** Read in place of the shapes by anything that cannot see them. */
  caption: string;
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
   * The hero visual.
   *
   * Not an ArchitectureDiagram. That component is the service page's
   * signature, and relabelling its boxes gave the industry page the same
   * opening as the page it is meant to be distinct from. This is a ledger
   * instead: the trade's own document, with the categories a model assigned
   * and one row held back for a person.
   *
   * The rows are an illustration of a screen, not a client's books. They are
   * written to look like nobody's real data on purpose.
   */
  ledger: {
    /** Read in place of the panel by anything that cannot see it. */
    caption: string;
    /** Header on the panel. */
    label: string;
    rows: {
      date: string;
      description: string;
      amount: string;
      category: string;
      /** Held for review rather than posted. Exactly one row should set this. */
      flagged?: boolean;
    }[];
    footnote: string;
  };
};
