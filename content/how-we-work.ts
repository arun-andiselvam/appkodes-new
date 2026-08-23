/**
 * The engagement, written out as a page rather than assembled from shared
 * sections.
 *
 * !! WHY THIS FILE EXISTS AT ALL !!
 *
 * /how-we-work rendered five sections that all belong to other pages: the
 * three step process from the home page, the audience tabs, the security
 * cards and the closing panel. It was the only page on the site with no copy
 * of its own, which is why docs/page-progress.md had it at 1,264 words with no
 * keyword and a 97 character description. A page assembled from other pages
 * cannot rank for anything, because every phrase on it belongs somewhere else.
 *
 * Built from the client brief of 24 August 2026. What follows is the record of
 * what was taken from it, what was rewritten and what was declined, because a
 * rejected suggestion comes back.
 *
 * !! THE TIMINGS COME FROM THE REPOSITORY, NOT FROM THE BRIEF !!
 *
 * The brief proposed a four phase pipeline at week 1, weeks 2 to 4, weeks 4 to
 * 5 and week 6 onward. content/how-it-works.ts and the process block on
 * /services/custom-ai-mvp-development both publish a different shape, and they
 * have been on the site for weeks: week 1 and 2 to map, a costed plan at the
 * end of week 2, and building from week 3. Two pages one click apart quoting
 * different weeks for the same engagement is the fastest way to look like
 * neither is true, so the phases below keep the published timings and carry
 * the brief's subject matter.
 *
 * The last two phases carry no week at all. Nobody here has measured how long
 * a closed testing round takes, and inventing "weeks 4 to 5" would be the same
 * class of figure as the "6 to 12 months" already rejected twice in
 * content/service-landings.ts.
 *
 * !! THE STORE REVIEW COPY IS DELIBERATELY NARROW !!
 *
 * The brief asks the page to promise an app "breezes through rigorous Google
 * Play Data safety and security reviews without frustrating rejections". No
 * agency controls a store review, docs/positioning.md forbids claiming a
 * compliance standard the company has not confirmed, and the same sentence was
 * already cut from six service pages. Phase 3 says what the build accounts
 * for, never what a reviewer will decide.
 *
 * There is an open question above this page. docs/page-progress.md records the
 * client saying store review belongs to Appkodes rather than Hitasoft, and
 * roughly seventeen strings across six service pages are written around it.
 * This page adds to that count. If the answer is that the subject is the other
 * brand's, phase 3 and one FAQ come out together.
 *
 * !! FOUR THINGS IN THE BRIEF WERE DECLINED OUTRIGHT !!
 *
 * - "Enterprise-grade models" and an "Enterprise API Integration" heading.
 *   "Enterprise" is banned in docs/positioning.md, and it is banned because
 *   the buyer this site sells to runs a 40 person company.
 * - "6-12 month timelines" against "4-6 week timelines" in the comparison
 *   table. Neither figure has been measured here. The rows characterise the
 *   two approaches instead, which is the discipline every other comparison
 *   table on the site already follows.
 * - "Zero data retention" as a guarantee. What is true, and what
 *   content/security.ts already publishes, is that retention is a setting we
 *   switch off and that nobody trains on the client's inputs.
 * - "Ready to build something that works?" as the closing headline. Voice
 *   rules in docs/positioning.md bar rhetorical questions, and a section may
 *   not open or close on one. The subtext under it survived as the paragraph.
 *
 * The brief's Anthropic reference stays as "Claude", which is how
 * content/integrations.ts already names it. Model version numbers are barred
 * and none appears here.
 */

/** A phase of the build, drawn as one step of the vertical timeline. */
export type Phase = {
  /** When it happens. Empty where no duration has been measured. */
  when: string;
  title: string;
  body: string;
};

/** One half of the split under the hero. */
export type Principle = {
  title: string;
  body: string;
};

export const meta = {
  /*
   * 48 characters, against the 49 the title budget allows once
   * app/layout.tsx appends " - Hitasoft". The brief proposed "Our AI
   * Engineering & MVP Process" at 31, which fits and spends a third of the
   * budget on the word "Our" while leaving the primary keyword out.
   *
   * "Weeks, not quarters" is the SMB framing row in docs/positioning.md
   * rather than a measured duration, which is why it survives where the
   * brief's "4-6 weeks" did not.
   */
  metaTitle: "AI MVP Development Process | Weeks, Not Quarters",
  /*
   * 155 characters, measured on the rendered page rather than counted by
   * hand. The hand count said 156 and the first draft shipped at 163, which
   * is over the 160 a result gets cut at.
   *
   * The brief's version ran to 158 and promised "flawless app store
   * compliance", which is the claim this page is not allowed to make.
   *
   * Two of the three secondary keywords are here. "software prototyping
   * process" is in the summary paragraph instead, where it reads as a
   * definition rather than as a third term crammed into one sentence.
   */
  metaDescription:
    "Architecture first, code second. Our AI MVP development process pairs agile AI engineering with secure AI app deployment and closed testing. Book a review.",
  /** Primary keyword. Registered in docs/seo-standards.md. */
  primaryKeyword: "AI MVP development process",
} as const;

export const hero = {
  /*
   * The keyword sits in the eyebrow, which is where every long form page on
   * this site puts it. The H1 carries the argument instead. See the hero on
   * /services/custom-ai-mvp-development for the same arrangement.
   */
  eyebrow: "AI MVP development process",
  /*
   * The brief's H1 was "From Concept to Compliant MVP in Weeks." One word
   * had to go. Compliance is a property a regulator or an auditor confers,
   * and docs/positioning.md bars claiming one the company has not confirmed.
   * "Tested" is the thing this process actually delivers.
   */
  title: "From concept to a tested product, in weeks.",
  lede: "Most builds spend their first month inside planning documents. We spend ours on the data model and the security decisions, because those two are what a rebuild is usually made of.",
  /*
   * Both badges are backed. The costed plan is the published engagement in
   * content/how-it-works.ts, and the accounts line is the last card in
   * content/security.ts. No client counts and no country figures, for the
   * reason set out in content/delivery-map.ts.
   */
  badges: ["A costed plan by the end of week two", "The code and the accounts are yours"],
} as const;

/**
 * The split under the hero, which the brief calls the paradigm shift.
 *
 * Two columns rather than three. The brief wrote them as "we build for
 * validation" and "we build for compliance", and the second one is the word
 * that cannot be published. What is underneath it survives whole, since
 * deciding retention and permissions early is a description of the work
 * rather than a claim about an outcome.
 */
export const principles: Principle[] = [
  {
    title: "We build to answer a question",
    body: "The core logic and the database structure come first. Polish waits until real use has said which screens deserve it, which is usually not the ones a roadmap picked.",
  },
  {
    title: "We decide the data rules in week one",
    body: "Retention and permissions get settled before the first screen exists. Leave them until submission and you are unpicking decisions that were made and paid for months earlier.",
  },
];

/**
 * The definition, set apart so an answer engine can lift it whole.
 *
 * The same job the `summary` block does on every service page. It has to
 * survive being quoted with none of the page around it, so it names the thing
 * it is defining in the first sentence and never says "this process".
 *
 * "software prototyping process" is the third secondary keyword and this is
 * the section that earns it.
 */
export const summary = {
  heading: "What the AI MVP development process is",
  body: "The AI MVP development process is a software prototyping process with the architecture settled before the code. We map the data pipeline and the security model first, then build the one feature the product stands or falls on. A closed group uses it on real data, and what they do with it decides the roadmap. The repository and the accounts hand over at the end.",
} as const;

export const phases = {
  heading: "The four phases, and what each one ends with",
  body: "Every phase ends with something you hold. Two of them end in a decision that is yours, and the work stops until you have made it.",
  steps: [
    {
      when: "Week 1 and 2",
      title: "Architecture and security mapping",
      body: "Your data pipeline gets drawn before a screen exists. We settle the multi-tenant database structure and the endpoints the model is reached through, so proprietary data never lands in a public training set. Week two ends with a costed plan.",
    },
    {
      when: "From week 3",
      title: "Prototyping and AI integration",
      body: "The functional core of the product gets built. The model reads and routes the unstructured work. Your own backend does the arithmetic, because a figure a model guessed is a figure nobody trusts.",
    },
    {
      when: "Once the core runs",
      title: "Closed testing and store readiness",
      body: "A controlled group uses the product on real data. Media permissions and the data handling declaration get checked against what the build actually does, which is the part a store review examines.",
    },
    {
      when: "At handover",
      title: "Handover and public launch",
      body: "The cloud accounts were yours from week one. You take the repository and the deployment pipelines, and we either scale the infrastructure with you or step back.",
    },
  ] satisfies Phase[],
} as const;

/**
 * The comparison, as the brief asked for and without its two figures.
 *
 * Every cell is a characterisation. "6-12 month timelines" and "4-6 week
 * timelines" both came out, for the reason recorded at the top of this file
 * and twice already in content/service-landings.ts.
 */
export const comparison = {
  heading: "How this differs from a traditional build",
  body: "Both roads end at a product. They differ in when the expensive decisions get made, and in who owns what afterwards.",
  columns: ["A traditional build", "This process"] as [string, string],
  rows: [
    {
      label: "Timeline",
      values: ["Measured in quarters", "Measured in weeks"] as [string, string],
    },
    {
      label: "Architecture",
      values: ["One system, built whole", "An API layer per part"] as [string, string],
    },
    {
      label: "Security",
      values: ["Added towards the end", "Mapped in week one"] as [string, string],
    },
    {
      label: "Model retention",
      values: ["Whatever the default was", "Switched off at the call"] as [string, string],
    },
    {
      label: "Store review",
      values: ["Met at submission", "Built for a closed track first"] as [string, string],
    },
    {
      label: "What you own after",
      values: ["A system somebody else hosts", "The repository and the accounts"] as [string, string],
    },
  ],
} as const;

/**
 * The three trust columns.
 *
 * Renamed from the brief's headings. "Enterprise API Integration" carries the
 * banned word, and "Transparent Code Ownership" describes a property of the
 * contract rather than a thing we do.
 *
 * The commitments strip under this row is content/security.ts, reused rather
 * than retyped. It is the reason this page does not also render the six card
 * security section: one page saying the same thing twice reads as padding.
 */
export const guarantees = {
  heading: "What holds the whole way through",
  body: "Three things hold from week one to handover. None of them needs an auditor, because each is a decision rather than a certificate.",
  items: [
    {
      title: "The model layer stays isolated",
      body: "Calls run through the vendor's own developer platform, with retention switched off and training disabled on the account. Your inputs get processed and not kept.",
    },
    {
      title: "The backend does the maths",
      body: "A model never calculates a number that matters. It reads and routes what arrives, and your own code works out the figures from that.",
    },
    {
      title: "No vendor to be locked into",
      body: "The proprietary logic and the vector database hand over. Nothing here is hosted on an account we control, so there is no service to be cut off from.",
    },
  ],
};

/**
 * Six questions rather than the brief's three.
 *
 * Three came from the brief. The other three exist because each of the page's
 * secondary keywords needs a section that answers it, and a question is the
 * natural home for an exact search phrasing. Rule 2 in docs/seo-standards.md.
 *
 * The store question is written to the resting position the six service pages
 * already hold. It says what the build accounts for and it says plainly that
 * nobody controls the decision.
 */
export const faqs = [
  {
    question: "How involved do I need to be during the build?",
    answer:
      "You define the business logic and supply a sample dataset. We handle the technical execution and check in at the points where a decision is yours. That is the costed plan at the end of week two, and the day the closed beta goes live.",
  },
  {
    question: "Will this MVP pass Google Play and App Store review?",
    answer:
      "Phase three is where that work sits. The data safety declaration and the media permissions get checked against what the build actually does, rather than being written the week of submission. Nobody controls what a reviewer decides on the day.",
  },
  {
    question: "What happens after the MVP is launched?",
    answer:
      "The infrastructure scales with the users who arrive. Beta feedback decides the next block of features, and the roadmap gets rewritten around what people did rather than around what the original document assumed.",
  },
  {
    question: "What does agile AI engineering mean in practice?",
    answer:
      "Agile AI engineering means the model layer stays swappable while the product is still being proved. The routing sits behind your own endpoint, so changing which model answers is a configuration decision instead of a rebuild.",
  },
  {
    question: "What does secure AI app deployment involve?",
    answer:
      "Secure AI app deployment starts with the database structure and the retention settings, not with a review at the end. The cloud accounts are yours from day one, our engineers work from named accounts, and every credential is rotated when we hand over.",
  },
  {
    question: "How is this different from a normal software prototyping process?",
    answer:
      "A prototype is usually thrown away. This one runs on production hosting in a smaller configuration, so the thing your testers used is the thing that grows. What makes an MVP disposable is a rushed data model, and that is the part we do not rush.",
  },
] as const;

/**
 * The closing panel's copy, overriding content/site.ts for this page only.
 *
 * The brief's heading was a rhetorical question, which docs/positioning.md
 * bars outright. Its subtext, "stop planning and start prototyping", is the
 * argument the whole page has been making, so it became the headline.
 *
 * The brief asked for two buttons, "Start a Prototype" and "Schedule a
 * Technical Call". Both point at /contact, and two buttons going to one place
 * is not a choice. The second keeps the site's own secondary action.
 */
export const cta = {
  eyebrow: "Next step",
  headline: "Stop planning.",
  headlineAccent: " Start prototyping.",
  description:
    "The first two weeks end with a costed plan. Bring the business rules and a sample of your data, and we will map it.",
  primaryCta: "Start a prototype",
} as const;
