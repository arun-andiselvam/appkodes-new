import type { ServiceLanding } from "./types";

/**
 * The long form service pages.
 *
 * Built on 21 August 2026 from docs/service-page-architecture.md. That file
 * specifies one page, so this holds one page. It is the template the rest of
 * the silo parents follow once their own briefs land.
 *
 * A page here also keeps its content/services.ts entry. The short form still
 * feeds the parent card in the menu and the breadcrumb trail, and dropping it
 * would take the page out of the silo it is meant to head.
 *
 * !! THE BRIEF'S FIGURES WERE NOT ALL SAFE TO PUBLISH !!
 *
 * The architecture doc asks for a regional project count per market, quoting
 * 620, 480, 390 and 310. Those live in content/infrastructure.ts under a
 * capitalised warning that the split is invented and blocking before launch,
 * and docs/positioning.md repeats it. They are not repeated here.
 *
 * The brief also claims "five delivery offices" and names an office per
 * region. There are no offices. The five places are where clients sit and
 * where the team has met them, confirmed by the client on 21 August 2026, and
 * positioning.md is corrected at source. Region pairing is rejected on top of
 * that: a row reading "Europe and UK, served from Madurai" reframes the
 * company as offshore delivery.
 *
 * The three week engagement is confirmed, decided 21 August 2026. It sits
 * beside content/how-it-works.ts, which puts two weeks on the audit alone.
 * The two describe different engagements and both stand.
 *
 * A GEO blueprint reviewed on 21 August 2026 added the summary, the
 * comparison table and three passage-level questions. What it also asked for
 * and did not get: a $50,000 rebuild price, a six to twelve month rebuild
 * duration, "seamless" in a table cell, and model version numbers. The first
 * two are figures nobody here can back, the third is on the banned list and
 * the fourth is ruled out by the families rule.
 *
 * Voice rules from docs/positioning.md apply to every string below. No em
 * dashes and no semicolons, sentences alternating short and long and never
 * landing between 11 and 14 words, and none of the banned vocabulary. The
 * brief's own copy used "seamlessly" twice and "leverage" once, so none of it
 * is pasted through unedited.
 */
export const serviceLandings: Record<string, ServiceLanding> = {
  "/services/ai-software-integration": {
    path: "/services/ai-software-integration",
    /*
     * The parent owns "AI software integration", which is the term its own
     * URL already carries.
     *
     * It was "Custom AI API Integration Services", taken from the primary
     * keyword in docs/service-page-architecture.md. That put this page in
     * competition with its own child at /custom-ai-api-integration, whose
     * whole job is that phrase. A silo parent ranking against the child it
     * exists to feed is cannibalisation, so the broad term sits here and the
     * specific one stays below. Changed 21 August 2026.
     */
    metaTitle: "AI Software Integration Services",
    // "the SaaS and internal tools you already run" was the brief's phrasing
    // and it read as a pitch to a SaaS vendor. The buyer runs the software,
    // they do not sell it. See the audience note on `problem` below.
    metaDescription:
      "Do not rebuild your software. AI software integration that adds models to the systems your company already runs, with no IT team needed. Book a review.",

    hero: {
      eyebrow: "AI integration",
      title: "Add AI to the software you already run.",
      lede: "We connect models to the software you run today, through the API it already has. Your team logs into the same system on Monday, and nobody in house has to maintain it.",
      // Both figures are the ones content/site.ts already publishes. The
      // eighteen years covers delivery, not AI, which positioning.md is
      // explicit about.
      badges: ["18 years of delivery experience", "1000+ businesses served"],
    },

    /*
     * The three points were one line each and said almost nothing: "users want
     * smart features", "somebody retypes data", "a model would help". A reader
     * who already knows they have a problem learns nothing from being told
     * they have one. Each card now names the symptom and then says what it
     * costs, which is the half that moves somebody towards an audit.
     *
     * They render three across rather than stacked, so each body is written to
     * a narrow measure and all three are held within a few words of each
     * other. A row of cards where one runs twice the length of its neighbours
     * reads as an error rather than as a set.
     *
     * !! THIS PAGE SPEAKS TO A COMPANY THAT RUNS SOFTWARE, NOT ONE THAT SELLS IT !!
     *
     * The first card was "Your users are asking for it", about a roadmap that
     * could not reach the features end users wanted. That is a SaaS vendor,
     * and it came straight out of the brief, which asks for "add AI to
     * existing SaaS" and pain copy reading "users are demanding smart
     * features". docs/positioning.md overrides it. The buyer is a 20 to 100
     * person company whose operations lead owns the systems, and who most
     * often has no IT department at all.
     *
     * So the three symptoms are read from that seat. The records nobody can
     * question, the person who moves data by hand, and the public model that
     * has never seen the company's own data. Corrected 21 August 2026.
     *
     * The brief's SaaS reading is not pure invention. positioning.md carries a
     * fourth segment, existing product clients who bought an Appkodes platform
     * and run it with end users of their own. That case stays reachable
     * through the capabilities and the FAQ. It does not lead.
     */
    problem: {
      heading: "Your software works. It just does not think yet.",
      body: "A rebuild costs a year you do not have, and it needs an IT team you do not have either. The software already holds the data a model needs. What is missing is the layer between the two, and that is a project of weeks rather than a rewrite.",
      points: [
        {
          title: "The software records, nobody reads it back",
          body: "It stores every quote and every ticket, and it answers nothing about any of them. Somebody has to dig back through the history by hand before every decision gets made.",
        },
        {
          title: "Somebody is the integration",
          body: "Someone moves data between two systems every morning. That costs a salary, and it costs a great deal more on the morning they paste the wrong row.",
        },
        {
          title: "A general model does not know you",
          body: "Public models know the internet. They have never seen your contracts or your pricing, so the answers come back fluent and wrong, which is worse than no answer.",
        },
      ],
    },

    /*
     * These three ran to 17, 25 and 20 words and rendered as a row where the
     * first card was half empty beside the second. They are now held between
     * 32 and 34, one sentence naming the work and one saying what it means for
     * a company with nobody in house to run it. Levelled 21 August 2026, and
     * the same rule the problem cards are written under.
     *
     * The brief's copy for the middle card ended "for your users", which is
     * the SaaS reading corrected out of this page. See the audience note on
     * `problem` below. Staff asking a question in plain words is the same
     * capability, described from the seat the buyer actually sits in.
     */
    capabilities: {
      // The category term, not the child page's phrase. See the note on
      // metaTitle above.
      heading: "What AI software integration covers",
      items: [
        {
          title: "LLM API integration",
          body: "A model gets wired into the system you already run, through the framework it was built on. No new software arrives for anyone to learn, and nobody has to keep a second login.",
        },
        {
          title: "Custom AI wrappers",
          body: "A layer sits over your existing logic, and it reads the records you already hold. Staff ask a question in plain words, and the answer comes from your data rather than from the internet.",
        },
        {
          title: "Legacy system upgrades",
          body: "We build an encrypted bridge, so older CRM and ERP systems can reach a current model. The core code stays where it is, which matters most when the original developer is long gone.",
        },
      ],
    },

    process: {
      heading: "Three weeks, audit to live",
      steps: [
        {
          when: "Week one",
          title: "The technical audit",
          body: "We read your codebase and your endpoints, then pick the integration points that carry the least risk to the people using it now.",
        },
        {
          when: "Week two",
          title: "Secure integration",
          body: "The models get connected, with retention switched off so your inputs stay out of training sets. Private instances go in where the data cannot leave.",
        },
        {
          when: "Week three",
          title: "Testing and go live",
          body: "We watch the outputs against your real traffic. You finish with the keys and a written record of every decision made on the way.",
        },
      ],
    },

    /*
     * All three lines were replaced 21 August 2026. Two of them restated the
     * hero badges word for word, and the third repeated the working hours
     * sentence sitting directly beside it. A list that says what the paragraph
     * next to it already said is padding. These answer the question the
     * heading actually raises, which is where the work runs.
     *
     * Restructured again the same day. The locations came out of the
     * paragraph, where five place names ran as an inline list of five and the
     * one fact worth proving was buried mid sentence. The points gained
     * labels. Bodies are held at fifteen words each so the row sits level.
     *
     * !! THERE IS NO OFFICE IN ANY OF THESE PLACES !!
     *
     * The heading read "Built in five offices" and the row under it was
     * labelled Offices. Both were false. Confirmed by the client on 21 August
     * 2026: these are places where clients are and where the team has met them
     * in person, and nothing more.
     *
     * The claim arrived by two upgrades in a row. docs/positioning.md said
     * "Delivery presence", which was itself wrong and has been corrected at
     * source. docs/service-page-architecture.md then turned presence into
     * "five delivery offices", and a brief is not the authority on what the
     * company can claim.
     *
     * So the heading no longer claims geography at all. It claims deployment,
     * which the three points below actually back. The place names stay,
     * labelled as what they are, which is also the better local signal: a
     * buyer searching from Dubai wants to know there are clients in Dubai.
     *
     * Note for anything reusing this list. Dubai and Sharjah are both in the
     * UAE, so it is five locations across four countries. Never five
     * countries.
     */
    reach: {
      heading: "Deployed where your data is allowed to live",
      body: "Your integration runs where your own rules say it can, not where it happens to suit us. Clients meet the engineers who do the work rather than an account manager relaying it.",
      clientLocations: ["India", "Indonesia", "Dubai", "Vietnam", "Sharjah"],
      points: [
        {
          label: "Where it runs",
          body: "Hosted endpoints or your own servers, depending on where the data is allowed to sit.",
        },
        {
          label: "Who owns it",
          body: "The same engineer stays on your integration, from the first audit right through to handover.",
        },
        {
          label: "Data residency",
          body: "Residency questions are answered in week one, long before any model sees a single record.",
        },
      ],
    },

    /*
     * Rebuilt 21 August 2026 to match the home page marquee: a mark, the name,
     * and a line saying what the thing is for.
     *
     * It was four groups of bare chips running 4, 2, 2 and 2, which left three
     * quarters of the panel empty and told a buyer with no IT department
     * nothing at all. "pgvector" is not self explanatory to the person this
     * page is written for.
     *
     * !! EVERY ENTRY AND EVERY CATEGORY LINE IS COPIED FROM content/integrations.ts !!
     *
     * Nothing here is new. That file is the vetted list of what Appkodes
     * actually builds with, it carries its own confirm before launch warning,
     * and widening a claim on a service page is how the office count got out.
     * The category strings are reused verbatim rather than reworded, so the
     * two pages cannot describe the same tool differently.
     *
     * OpenAI has no mark. simple-icons pulled it, so it falls back to a
     * monogram, which is why the home page lists the family as GPT. Same
     * choice here.
     *
     * Families rather than version numbers, which positioning.md requires: a
     * page naming a specific release dates itself the week it ships.
     */
    stack: {
      heading: "The models and frameworks we use",
      body: "We fit the AI into the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "Models",
          items: [
            { name: "Claude", category: "Documents nobody wants to read", icon: "siClaude" },
            { name: "GPT", category: "General purpose work" },
            { name: "Gemini", category: "Long files and video", icon: "siGooglegemini" },
            { name: "Llama", category: "Runs on your own server", icon: "siMeta" },
            { name: "Mistral", category: "Small and cheap to run", icon: "siMistralai" },
          ],
        },
        {
          label: "What we plug into",
          items: [
            { name: "Python", category: "Where the automation lives", icon: "siPython" },
            { name: "TypeScript", category: "Web and APIs", icon: "siTypescript" },
            { name: "Laravel", category: "PHP systems you already run", icon: "siLaravel" },
            { name: "React", category: "Screens your team uses", icon: "siReact" },
          ],
        },
        {
          label: "Your own data",
          items: [
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "pgvector", category: "Your documents, made searchable" },
            { name: "Embeddings", category: "Search across your own files" },
            { name: "Redis", category: "Queues and caching", icon: "siRedis" },
          ],
        },
        {
          label: "Where it runs",
          items: [
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
            { name: "AWS", category: "Hosting and storage" },
            { name: "MCP", category: "Models plugged into your tools", icon: "siModelcontextprotocol" },
            { name: "n8n", category: "Steps joined into a workflow", icon: "siN8n" },
          ],
        },
      ],
    },

    // Written for an answer engine to quote whole. Model families rather than
    // versions, because "Llama 3" in the blueprint dates the page the week it
    // is superseded. See docs/positioning.md.
    // Reworded 21 August 2026. The first draft restated the opening FAQ answer
    // almost word for word, which is duplicate content on one page. This one
    // answers who and what, and the FAQ keeps the mechanism.
    //
    // The opening clause used to read "has built software since 2008", which
    // was the third time the page made that claim: the hero badge says
    // eighteen years and the reach section said it twice more. The tenure now
    // appears once in prose, in the hero, and the Organization schema in
    // lib/service-landing-route.tsx still carries foundingDate for machines.
    // This paragraph defines the service instead, which is what a Service
    // schema description is supposed to hold.
    summary: {
      heading: "What this service is",
      body: "Hitasoft connects trained models to software that already exists, over the APIs that software already exposes. A system gains document summaries and search that understands a question, and its core code is never rewritten to get them. The work runs against your own records rather than a public index, and the integration can be removed as cleanly as it went in.",
    },

    comparison: {
      heading: "Rebuild against integration",
      body: "Both routes end with an intelligent platform. They differ in what happens to the system you run now, and in what your team has to absorb.",
      columns: ["Ground-up rebuild", "AI API integration"],
      rows: [
        {
          label: "Time to live",
          rebuild: "Months, then a migration",
          integration: "Three weeks, audit to live",
        },
        {
          // Was "Your codebase", which assumes the buyer owns source code. A
          // company running a bought CRM owns systems, not a repository.
          label: "Your systems",
          rebuild: "Replaced outright",
          integration: "Left alone, bridged by middleware",
        },
        {
          label: "Your team",
          rebuild: "Retrained on a new system",
          integration: "Same screens on Monday",
        },
        {
          // Added 21 August 2026. positioning.md names "no internal IT
          // department" as what defines this buyer, and fear two as being left
          // with something nobody in house understands. The table answered
          // neither until this row.
          label: "Who runs it after",
          rebuild: "Somebody you have to hire",
          integration: "We do, and the handover is written down",
        },
        {
          label: "Data handling",
          rebuild: "Security designed again from scratch",
          integration: "Retention off, private hosting where needed",
        },
        {
          label: "If it underperforms",
          rebuild: "You live with it",
          integration: "The layer comes back out",
        },
      ],
    },

    /*
     * "GPT-4" was in the brief for this diagram and is not here. Version
     * numbers date the page the week they are superseded, and that one was
     * already two generations old when the brief was written. See the families
     * rule in docs/positioning.md.
     */
    diagram: {
      caption:
        "Your interface and backend stay where they are. The AI layer sits beside them, with a model and a vector database behind it.",
      rows: [
        [{ label: "User Interface", tone: "brand" }],
        [
          { label: "Existing Software", sub: "Backend", tone: "brand" },
          { label: "AI Integration", sub: "Layer", tone: "accent" },
        ],
        [
          { label: "LLM Engine", sub: "OpenAI / Claude", tone: "accent" },
          { label: "Vector Database", tone: "accent" },
        ],
      ],
    },

    faqs: [
      {
        question: "What is AI software integration?",
        answer:
          "AI software integration connects a trained model to an application's own database and business logic through secure endpoints. The software gains document summaries and search that understands a question rather than a keyword. None of that requires the core application to be rewritten.",
      },
      {
        question: "How long does it take to integrate AI into existing software?",
        answer:
          "Three weeks, audit to live. Week one reviews the codebase and maps the endpoints, week two connects the models and settles the data handling, and week three tunes the prompts against real traffic before release.",
      },
      {
        question: "How does private AI integration protect proprietary business data?",
        answer:
          "Two ways, and the choice is yours. Hosted models run against enterprise endpoints with retention switched off, so your inputs stay out of training sets. Open weight models are hosted on infrastructure you control, and then the data never leaves your building.",
      },
      {
        question: "Can you integrate AI into an older, custom-built application?",
        answer:
          "Yes. Your application needs database access or a basic API, and we build the middleware that bridges it to a current model. The core code stays exactly where it is.",
      },
      {
        question: "Will my company data be used to train public AI models?",
        answer:
          "No. We configure every integration against enterprise endpoints with retention turned off, which keeps your inputs out of training sets. Somebody has to switch that on, and we check it.",
      },
      {
        question: "How does the cost compare to building from scratch?",
        answer:
          "Integration costs less than a rebuild, because your frontend and your database stay as they are. You pay for the middleware and the API work. The audit puts a number on it before you commit.",
      },
    ],
  },
};
