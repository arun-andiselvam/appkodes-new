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
    /*
     * Written to docs/seo-standards.md, which this page is the worked example
     * for. Both lines are budgeted rather than eyeballed.
     *
     * The title is 49 characters, which is the whole budget: app/layout.tsx
     * appends " - Hitasoft" at 11, and 60 is where Google starts truncating.
     * A recommendation on 22 August 2026 asked for "AI Software Integration
     * Services | Add AI to Existing Apps", and that is 58 before the brand and
     * 69 after it. It would have been cut mid word with the brand lost, so
     * "Services" came out. The exact primary keyword survives either way, and
     * "Add AI to Existing Apps" carries the secondary intent and the argument
     * the H1 makes.
     *
     * The description leads with the H1's hook and then spends its length on
     * the three secondary terms the feature cards own: LLM API integration,
     * custom AI wrappers, legacy systems. It closes on the action, which the
     * recommended version dropped.
     *
     * "powerful LLMs" was in that version and is not here. An adjective nobody
     * would disagree with is a wasted word in 160 characters.
     */
    metaTitle: "AI Software Integration | Add AI to Existing Apps",
    serviceType: "AI software integration",
    metaDescription:
      "Rebuild nothing. AI software integration that adds LLM APIs and custom AI wrappers to the software and legacy systems you already run. Book a review.",

    hero: {
      eyebrow: "AI integration",
      /*
       * Two sentences, the short one first, because the differentiator is the
       * hook and the old H1 buried it.
       *
       * It read "Add AI to the software you already run." That is accurate and
       * it is also what any agency would write. The thing this buyer is
       * actually weighing is a rebuild somebody has already quoted them for,
       * and "Rebuild nothing" answers that before they have read a second
       * line. Changed 22 August 2026.
       *
       * The second sentence is the old headline kept whole, so the phrase the
       * page ranks on is untouched and the opening is not a rewrite of
       * something that worked.
       *
       * Deliberately does not reach for the beats used below it. "Same system
       * on Monday" belongs to the lede, "your software works, it just does not
       * think yet" to the problem heading, and "a year you do not have" to the
       * problem body. An H1 that borrows any of them makes the page read as
       * one idea repeated four times.
       */
      title: "Rebuild nothing. Add AI to the software you already run.",
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
          // "Legacy system upgrades" until 22 August 2026. The target phrase
          // is "legacy system AI upgrades", and the card was one word off it
          // while describing exactly that work. See docs/seo-standards.md:
          // a secondary keyword is only worth listing if a section answers it,
          // and this one did without ever saying so.
          title: "Legacy system AI upgrades",
          body: "We build an encrypted bridge, so older CRM and ERP systems can reach a current model. The core code stays where it is, which matters most when the original developer is long gone.",
        },
      ],
    },

    /*
     * The concrete half of the page, added 22 August 2026.
     *
     * `capabilities` above is conceptual by design and that is also its limit.
     * Nobody searches for "custom AI wrapper". They search for something about
     * making their own tickets searchable, and this is the section that
     * answers them.
     *
     * Every line describes work this company can do rather than work it has
     * done. No client is named, no figure is quoted, and none of these is
     * written as a case study. The moment one of them gets a number attached
     * it needs a delivery record behind it. See the claims discipline in
     * docs/positioning.md and the standing warning in content/metrics.ts.
     */
    scenarios: {
      heading: "What integration actually looks like",
      body: "Three jobs we get called in for. Each one sits in a system somebody is already running.",
      items: [
        {
          system: "Internal tools",
          title: "Your team stops asking the person who remembers",
          body: "The ticket history already sits in your database, and it can only be searched by exact match. We index it so a question in plain words returns the tickets that answer it, with the record attached.",
        },
        {
          system: "Back office",
          title: "Invoices arrive as PDFs and leave as database rows",
          body: "A vision model reads the supplier and every line item off the page and writes them into your ERP. Nobody retypes anything, and the ones it was unsure about still go to a person.",
        },
        {
          system: "Customer facing",
          title: "A dashboard that answers rather than draws a chart",
          body: "Your users ask what happened last quarter and get a sentence back, drawn from the same numbers the charts use. The dashboard does not get rebuilt to do it.",
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
      /*
       * Opens on the phrase itself, added 22 August 2026.
       *
       * "add AI to existing software" is a target secondary term and it was
       * nowhere on the page verbatim. The H1 says "the software you already
       * run" and the title says "Existing Apps", both of which are better copy
       * and neither of which is the phrase.
       *
       * This block is the right place to carry it rather than the H1, because
       * it is the passage written to be lifted whole and it is the Service
       * schema's description. A definition paragraph opening with the plain
       * phrase is what it should have said anyway.
       */
      body: "Hitasoft adds AI to existing software. It happens over the APIs those systems already expose, so no core code is rewritten. A system gains document summaries and search that understands a question rather than a keyword. The work runs against your own records rather than a public index, and the integration can be removed as cleanly as it went in.",
    },

    comparison: {
      heading: "Rebuild against integration",
      body: "Both routes end with an intelligent platform. They differ in what happens to the system you run now, and in what your team has to absorb.",
      columns: ["Ground-up rebuild", "AI API integration"],
      rows: [
        {
          label: "Time to live",
          values: ["Months, then a migration", "Three weeks, audit to live"],
        },
        {
          // Was "Your codebase", which assumes the buyer owns source code. A
          // company running a bought CRM owns systems, not a repository.
          label: "Your systems",
          values: ["Replaced outright", "Left alone, bridged by middleware"],
        },
        {
          label: "Your team",
          values: ["Retrained on a new system", "Same screens on Monday"],
        },
        {
          // Added 21 August 2026. positioning.md names "no internal IT
          // department" as what defines this buyer, and fear two as being left
          // with something nobody in house understands. The table answered
          // neither until this row.
          label: "Who runs it after",
          values: ["Somebody you have to hire", "We do, and the handover is written down"],
        },
        {
          label: "Data handling",
          values: ["Security designed again from scratch", "Retention off, private hosting where needed"],
        },
        {
          label: "If it underperforms",
          values: ["You live with it", "The layer comes back out"],
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
        // "integrate AI into" until 22 August 2026. The target phrase is "add
        // AI to existing software", and the summary carries it as "adds",
        // which Google stems but is not the phrase. A FAQ question is where a
        // search phrasing belongs verbatim, and this asks the same thing.
        question: "How long does it take to add AI to existing software?",
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

  /*
   * The child page, built 22 August 2026 from an outline the client brought.
   *
   * !! IT OWNS "custom AI API integration" AND THE PARENT DOES NOT !!
   *
   * That split is the whole reason both pages exist. docs/seo-standards.md
   * rule one, and the correction that produced it: the two pages carried the
   * same phrase in their titles and were set to compete.
   *
   * Nothing here reuses the parent's beats. "Rebuild nothing" is the parent's
   * H1, "Your software works, it just does not think yet" its problem heading,
   * "Deployed where your data is allowed to live" its reach heading. A child
   * echoing its parent reads as one page served twice.
   *
   * !! THREE THINGS IN THE OUTLINE WERE NOT WRITTEN AS ASKED !!
   *
   * "Plug Powerful LLMs Directly Into Your Current Codebase" was the proposed
   * H1. "Powerful" is the unarguable adjective positioning.md strips, and
   * "codebase" is developer language for a buyer that document describes as an
   * operations lead with no IT department.
   *
   * The medical consultation use case was to promise "strict compliance with
   * Google Play's Data safety and security policies". positioning.md line 213
   * forbids naming a compliance standard until the company confirms it holds
   * one, and this site was cleaned of exactly that once. It is written as what
   * gets configured, retention off or a model on hardware the client owns, and
   * never as a guarantee.
   *
   * "Google Play Console rejections" is written as the risk a rebuild carries,
   * which is true of any established app, rather than as something this
   * company has handled. Nothing in the repo backs the latter. If it has been
   * handled, that is a much stronger line and it should be added.
   */
  "/services/custom-ai-api-integration": {
    path: "/services/custom-ai-api-integration",
    /*
     * 39 characters, so 50 with the brand appended. See the budget in
     * docs/seo-standards.md. The old title was "Custom AI API Integration & AI
     * Wrapper Development" at 50, which rendered at 61 and was cut.
     */
    metaTitle: "Custom AI API Integration & AI Wrappers",
    serviceType: "custom AI API integration",
    metaDescription:
      "Custom AI API integration for software you already run. We wire OpenAI and Claude in, hold the keys server side, and keep token spend flat. Book a review.",

    hero: {
      eyebrow: "AI integration",
      title: "Your software already has an API. That is where the AI goes.",
      lede: "We wire OpenAI or Claude into the endpoints your system already exposes, and nothing else moves. Nobody in house holds an API key.",
      // Both are things the company does by deciding to, which is the test
      // content/security.ts sets for anything in this position. No figures.
      badges: ["Keys never leave the server", "Retention off by default"],
    },

    summary: {
      heading: "What this service is",
      body: "Custom AI API integration connects a hosted model to software that already exists, through the API that software already exposes. A wrapper sits in front of your own logic and calls it, so the model asks and your rules answer. Keys stay on the server, and the integration can be removed without touching the system underneath.",
    },

    problem: {
      heading: "The demo works. The integration is the hard part.",
      body: "Anyone can call an API once. A live product is where it gets difficult. Keys leak, and a model that times out can take a whole screen down with it. None of that argues for a rewrite.",
      points: [
        {
          title: "Nobody owns the keys",
          body: "The API key sits in somebody's environment file and the monthly bill goes to whoever set it up. Neither has an owner once that person moves on.",
        },
        {
          title: "The bill grows on its own",
          body: "Every request goes to the largest model, because that is what the demo happened to use. Usage doubles and spend doubles with it. Nobody notices until an invoice says so.",
        },
        {
          title: "A rewrite is not the answer",
          body: "An established app carries a release process and users who expect it to keep working. A rebuild puts both at risk, and a new store review, to add one feature.",
        },
      ],
    },

    capabilities: {
      heading: "What custom AI API integration covers",
      items: [
        {
          title: "LLM API integration",
          body: "We wire OpenAI and Claude in through the framework your system was already built on. Model choice stays a setting rather than a rewrite, so swapping one for the other later costs an afternoon.",
        },
        {
          title: "Custom AI wrappers",
          body: "A layer in front of your own logic, calling the functions your system already exposes. The model reads what somebody asked for, and your own rules decide what happens next.",
        },
        {
          title: "Cost and rate control",
          body: "Small models take the easy work, and the large one takes only what needs it. Caching and a hard ceiling on spend are built in rather than added after the first surprise.",
        },
      ],
    },

    /*
     * Four live systems, each with an API and a job behind it.
     *
     * Fintech leads on the client's instruction, and it earns the position:
     * /industries/fintech-and-finance is the only one of the four whose
     * industry page is built to full depth, so it is the only one whose link
     * goes somewhere substantial. The others are short form until their own
     * roll-out.
     */
    scenarios: {
      heading: "Four systems, four API integrations",
      body: "Each of these is a live application with an API and a job the model does behind it.",
      items: [
        {
          system: "Fintech",
          title: "Shared expenses that settle themselves",
          body: "A household budget or a trip splits a bill between several people, and every entry moves what each of them owes. The API recalculates those balances as transactions arrive.",
        },
        {
          system: "Retail",
          title: "Stock that says when it will run out",
          body: "An electronics inventory system already knows what sold and what is still on the shelf. An endpoint over that history predicts the stockouts and flags the lines whose valuation has drifted.",
        },
        {
          system: "Consulting",
          title: "Transcripts that never leave your control",
          body: "A live video consultation produces a transcript worth summarising and too sensitive to send anywhere. It goes through an endpoint with retention switched off, or a model on hardware you own.",
        },
        {
          system: "Communities",
          title: "A feed that moderates itself first",
          body: "A closed community generates more posts than anybody reads. The API reads each one against your own rules and sends a person only what it could not decide.",
        },
      ],
    },

    process: {
      heading: "Three weeks, first call to live",
      steps: [
        {
          when: "Week one",
          title: "Endpoints and keys",
          body: "We read what your system already exposes and pick the calls the wrapper will make. Keys move to the server, and a spend ceiling goes on before anything else runs.",
        },
        {
          when: "Week two",
          title: "Wiring and rate limits",
          body: "The wrapper goes in, with caching and a fallback for the moment the model is slow. Retention is switched off at the endpoint and then checked.",
        },
        {
          when: "Week three",
          title: "Tuning and handover",
          body: "We watch token spend against real traffic and move the cheap work to a smaller model. You finish holding the keys and the prompts, with a record of every decision made.",
        },
      ],
    },

    comparison: {
      heading: "Training a model against calling one",
      body: "Both end with software that does something intelligent. They differ in what you spend to get there and what you are left maintaining.",
      columns: ["Training a custom model", "Integrating an LLM API"],
      rows: [
        { label: "Time to first result", values: ["Months of data work", "Days"] },
        {
          label: "What it needs",
          values: ["Labelled data you may not have", "An endpoint you already expose"],
        },
        {
          label: "Ongoing cost",
          values: ["Training runs and hosting", "Tokens, and a ceiling on them"],
        },
        {
          label: "When the field moves",
          values: ["Retrain, or fall behind", "Change one setting"],
        },
        {
          label: "Who maintains it",
          values: ["Somebody who knows the model", "Whoever holds the keys"],
        },
      ],
    },

    reach: {
      heading: "Where the calls actually go",
      body: "The endpoint you call decides where your data sits, and that choice is made before anything is built. The same engineer stays with it, from the first call right through to the handover.",
      points: [
        {
          label: "Where it runs",
          body: "A hosted endpoint with retention off, or an open weight model on hardware you own.",
        },
        {
          label: "Who holds the keys",
          body: "You do, in your own account, and from the day the first call goes out.",
        },
        {
          label: "What it costs to stop",
          body: "Nothing. The wrapper lifts out and nothing underneath it has changed.",
        },
      ],
    },

    /*
     * Grouped around the call rather than around the stack, which is what
     * separates this from the parent's version of the section. Every entry is
     * still copied from content/integrations.ts, names and category lines
     * both, for the reason set out there.
     */
    stack: {
      heading: "The models and frameworks we use",
      body: "We fit the AI into the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "Model APIs",
          items: [
            { name: "Claude", category: "Documents nobody wants to read", icon: "siClaude" },
            { name: "GPT", category: "General purpose work" },
            { name: "Gemini", category: "Long files and video", icon: "siGooglegemini" },
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
          label: "Around the calls",
          items: [
            { name: "Redis", category: "Queues and caching", icon: "siRedis" },
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "pgvector", category: "Your documents, made searchable" },
            { name: "n8n", category: "Steps joined into a workflow", icon: "siN8n" },
          ],
        },
        {
          label: "Where it runs",
          items: [
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
            { name: "AWS", category: "Hosting and storage" },
            { name: "MCP", category: "Models plugged into your tools", icon: "siModelcontextprotocol" },
          ],
        },
      ],
    },

    /*
     * A sequence, not a structure, drawn with the same isometric slabs the
     * parent uses so the two pages share one visual language.
     *
     * !! THE ARRANGEMENT IS WHAT KEEPS IT FROM BEING THE PARENT AGAIN !!
     *
     * This page opened with the parent's diagram carrying different words:
     * same 1-2-2 arrangement, same tone split, same component. Two pages a
     * visitor reaches from one menu read as one page served twice.
     *
     * The rows are now the order a request travels, 1-1-2-1, which no
     * hierarchy can be. `sequence` centres the lone steps so the pair can
     * rejoin into one.
     *
     * It also says the two things the old arrangement could not. The cache is
     * checked before the model rather than beside it, and the last step is the
     * model calling back into the client's own functions, which is the whole
     * difference between a wrapper and a plain API call.
     */
    diagram: {
      caption:
        "A request reaches the wrapper, which checks a cache before calling a model API. The model then calls back into your own functions, and your rules decide what happens.",
      align: "sequence",
      rows: [
        [{ label: "A request", sub: "From your app", tone: "brand" }],
        [{ label: "The wrapper", sub: "Holds the keys", tone: "accent" }],
        [
          { label: "Cache", sub: "Checked first", tone: "accent" },
          { label: "Model API", sub: "OpenAI / Claude", tone: "accent" },
        ],
        [{ label: "Your own logic", sub: "Your rules answer", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "What happens to user data pushed through a third-party LLM API?",
        answer:
          "It goes to an enterprise endpoint with retention switched off, so your inputs are processed and not kept. Where that is not enough, an open weight model runs on hardware you control and the data never leaves it.",
      },
      {
        question: "How do you keep API costs from growing with usage?",
        answer:
          "Three levers, all of them set up during the build rather than after a large invoice. Cheap work goes to a smaller model, repeat questions come from a cache, and a hard ceiling stops spend before it surprises anybody.",
      },
      {
        question: "Can you use Claude and OpenAI in the same integration?",
        answer:
          "Yes, and it is usually worth doing. Model choice sits behind the wrapper as a setting. One can handle documents while another answers questions, and either can be swapped without touching your system.",
      },
      {
        question: "Do we have to rebuild the app to add this?",
        answer:
          "No. The wrapper calls the API your software already exposes. Your release process and the screens your users know all stay exactly as they are.",
      },
      {
        question: "Who holds the API keys?",
        answer:
          "You do. The keys live in your own provider account, and they do so from the first call. They stay server side, never shipped to a browser.",
      },
      {
        question: "What happens when the model is slow or unavailable?",
        answer:
          "The wrapper falls back rather than hanging. A timeout returns the answer your system would have given before the integration existed, so a slow model never becomes a broken screen.",
      },
    ],
  },

  /*
   * The second silo child, built 22 August 2026 from a blueprint the client
   * brought. It owns "secure AI integration services", which is the term
   * docs/hitasoft_ai_architecture_strategy.md assigns it, and neither the
   * parent nor its sibling touches that phrase.
   *
   * !! THE URL IS NOT THE ONE IN THE BLUEPRINT !!
   *
   * It asks for /services/secure-ai-compliance. The
   * page already exists at secure-ai-compliance-architecture, which is the URL
   * in the navigation, the sitemap and the strategy doc. Third time this has
   * come up, and the answer is the same: publishing the shorter one would open
   * a second page to compete with the first.
   *
   * !! FOUR THINGS IN THE BLUEPRINT WERE NOT WRITTEN AS ASKED !!
   *
   * The H1 was "Enterprise-Grade AI Security. For Mid-Sized Budgets." The same
   * line arrived on the fintech page and was changed then. positioning.md
   * bans "enterprise" for this buyer outright, and it was in the meta
   * description here too.
   *
   * The blueprint promises "maintaining compliance with global privacy
   * regulations" and asks the FAQ to say we help clients "pass Google Play and
   * App Store compliance". positioning.md line 212 is explicit: do not name a
   * standard until the company confirms it holds or handles it, describe
   * process instead. So every line here says what gets configured and what
   * gets handed over. Retention off, private hosting, the documentation
   * written down. Nothing promises an outcome somebody else decides.
   *
   * "Llama 3" was named. Families rather than version numbers.
   *
   * "| Hitasoft" was in the meta title. app/layout.tsx already appends the
   * brand, so that would have printed it twice.
   *
   * The keywords all still land. It is the promises that changed, not the
   * terms.
   *
   * !! THIS PAGE NOW OWNS "compliant AI app development" !!
   *
   * docs/hitasoft_ai_architecture_strategy.md line 102 flags that term as
   * contested between this page and the media and communities industry page,
   * and says to decide before shipping. Deciding here: compliance is this
   * page's entire subject, where it is one aspect of a sector page, and a silo
   * child is the right home for a service term.
   *
   * content/industries.ts line 134 still carries the phrase in the media and
   * communities meta description. It has to come out when that page is built
   * out, or the two compete again.
   */
  "/services/secure-ai-compliance-architecture": {
    path: "/services/secure-ai-compliance-architecture",
    metaTitle: "Secure AI Integration & Compliance",
    serviceType: "secure AI integration",
    metaDescription:
      "Secure AI integration services with retention switched off and private LLM deployment. Your records stay on infrastructure you control. Book a review.",

    hero: {
      /*
       * The eyebrow carries the primary term, changed 22 August 2026.
       *
       * All three pages in this silo read "AI integration" here, which told a
       * reader who had just clicked down from the parent nothing about where
       * they had landed. It also left "secure AI integration" sitting in the
       * metaTitle and nowhere in the copy above the fold.
       */
      eyebrow: "Secure AI integration",
      /*
       * Rewritten 22 August 2026. It read "Add the AI. Keep the data."
       *
       * Two faults. The parent H1 is "Rebuild nothing. Add AI to the software
       * you already run", so both pages in one silo opened on the same verb
       * and the child read as a restatement of it. And "keep the data" is the
       * abstraction rather than the promise. This buyer is not weighing data
       * custody in general, they are weighing the one fear the first FAQ on
       * this page answers: does the provider hold on to what we send it.
       *
       * So the H1 answers that instead. "Does not keep it" is the claim the
       * retention badge and the diagram's "Nothing kept" already make, in the
       * wording the FAQ uses.
       *
       * Stays off the beats used below it. The fork between private and
       * hosted belongs to the diagram, and "before a model reads a record" to
       * the lede.
       */
      title: "The model reads the record. It does not keep it.",
      /*
       * The old lede named a question and never said what it was. This names
       * it. Seventeen words then ten, so the pair alternates.
       */
      lede: "Every AI project stalls on the same worry, which is where your data actually ends up. We answer that in writing before a model reads anything.",
      badges: ["Retention off by default", "Private deployment available"],
    },

    /*
     * The direct answer block the blueprint asks for, and the reason it sits
     * this high. An engine looking for a definition of secure AI architecture
     * takes the compressed version over the prose.
     *
     * It names Zero Data Retention and private hosting as things that get
     * configured, which is true, and stops short of naming a regulation, which
     * would not be.
     */
    summary: {
      heading: "What this service is",
      body: "Secure AI integration deploys a language model under privacy controls that are decided before the build. Retention is switched off at the endpoint, so your inputs never enter a training set. Where that is not enough, the model runs inside a network you own rather than ours. Every decision about where a record may sit is written down, which is the document a review asks for. Compliant AI app development is mostly that record.",
    },

    problem: {
      heading: "Nobody signed off on where the data went",
      body: "AI work stalls at the same question every time. Somebody asks where the data goes, and no one in the room has an answer written down. The project then waits for a review nobody scheduled.",
      points: [
        {
          title: "The records left without a decision",
          body: "Customer data ends up in a vendor's logs, because a default was never changed by anybody. Nobody chose it and nobody wrote it down.",
        },
        {
          title: "No record of what the model saw",
          body: "A model is shown a table and the fields it read are never listed anywhere. A year later the question comes up, and the only answer anybody has is a guess.",
        },
        {
          title: "The review arrives after the build",
          body: "Data handling gets examined once the feature is written, which is the most expensive moment to find a problem. Everything then waits on a rewrite nobody costed.",
        },
      ],
    },

    /*
     * The blueprint's three pillars, kept as three. Named for what gets
     * configured rather than for a standard, which is the difference between
     * a claim this company can back and one it cannot.
     */
    capabilities: {
      heading: "Three pillars of AI data safety",
      items: [
        {
          title: "Zero data retention bridges",
          body: "Calls run against endpoints with retention switched off, so an input is processed and not kept. Somebody has to turn that on for each provider, and we check it rather than assuming a default.",
        },
        {
          title: "Private LLM deployment",
          body: "An open weight model runs inside a network you own, on your own cloud account or your own hardware. No request leaves it, which is the only version some work can be signed off under.",
        },
        {
          title: "Data safety documentation",
          body: "Every field a model reads is written down, with where it goes and how long it stays. That document is what a store review or an auditor asks for, and it exists before the build starts.",
        },
      ],
    },

    scenarios: {
      heading: "Securing sensitive workflows",
      body: "Three systems in which the data decides the architecture rather than the other way round.",
      items: [
        {
          system: "Live consulting",
          title: "Transcripts that never reach a third party",
          body: "A video consultation produces a transcript worth summarising and far too sensitive to send out. It runs against an endpoint with retention off, or a model inside your own network, and the field list is documented either way.",
        },
        {
          system: "Closed communities",
          title: "Moderation that does not export the feed",
          body: "The posts are the thing members trusted you with. Moderation runs against your own rules, on infrastructure you control, and nothing about a closed testing group leaves it.",
        },
        {
          system: "Finance and legal",
          title: "Documents that stay on your own servers",
          body: "Contracts and filings are the clearest case for an open weight model hosted in house. The work costs more to run and the records never leave the building, which is usually the trade that gets signed.",
        },
      ],
    },

    process: {
      heading: "Three weeks, decision to deployment",
      steps: [
        {
          when: "Week one",
          title: "The data decisions",
          body: "We list every field a model would read and agree where each is allowed to sit. That list is the document everything after it is built against, and it is yours whether we build or not.",
        },
        {
          when: "Week two",
          title: "The secure build",
          body: "Retention goes off at the endpoint, or the whole model moves onto hardware you own. Access is scoped, and every call the model makes is written to a log a person can read.",
        },
        {
          when: "Week three",
          title: "Evidence and handover",
          body: "We run it against real traffic and check the logs say what the document says. You finish holding the deployment and the keys, with a record of every decision made.",
        },
      ],
    },

    comparison: {
      heading: "Public AI against private deployment",
      body: "Both answer the question. They differ in where your records go on the way, and in what you can show somebody who asks.",
      columns: ["Consumer AI tools", "Secure deployment"],
      rows: [
        {
          label: "Used for training",
          values: ["Often, by default", "Never, retention is off"],
        },
        {
          label: "Where it runs",
          values: ["Somebody else's shared tenancy", "Your own account, or your own hardware"],
        },
        {
          label: "Who can read the logs",
          values: ["Their staff, on their terms", "Yours, on yours"],
        },
        {
          label: "What you can show a reviewer",
          values: ["A vendor's policy page", "Your own field list and logs"],
        },
        {
          label: "If the answer is wrong",
          values: ["No record of the input", "The call is in your own log"],
        },
      ],
    },

    reach: {
      heading: "Where a record is allowed to sit",
      body: "Residency is a decision rather than a default, and it is made before anything is built. The same engineer stays with it, from that first decision right through to the handover.",
      points: [
        {
          label: "Hosted, retention off",
          body: "The fastest route, and enough for most work. Inputs are processed and nothing is kept.",
        },
        {
          label: "Private deployment",
          body: "An open weight model inside your own network, for the records that cannot leave it.",
        },
        {
          label: "Written down either way",
          body: "The field list exists as a document you keep.",
        },
      ],
    },

    stack: {
      heading: "The models and frameworks we use",
      body: "We fit the AI into the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "Models you can host",
          items: [
            { name: "Llama", category: "Runs on your own server", icon: "siMeta" },
            { name: "Mistral", category: "Small and cheap to run", icon: "siMistralai" },
            { name: "Qwen", category: "Open weights", icon: "siQwen" },
          ],
        },
        {
          label: "Hosted, retention off",
          items: [
            { name: "Claude", category: "Documents nobody wants to read", icon: "siClaude" },
            { name: "GPT", category: "General purpose work" },
            { name: "Gemini", category: "Long files and video", icon: "siGooglegemini" },
          ],
        },
        {
          label: "Your own data",
          items: [
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "pgvector", category: "Your documents, made searchable" },
            { name: "Embeddings", category: "Search across your own files" },
          ],
        },
        {
          label: "Where it runs",
          items: [
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
            { name: "AWS", category: "Hosting and storage" },
            { name: "Ollama", category: "Models on your own machine" },
          ],
        },
      ],
    },

    /*
     * A sequence again, and a different one from either sibling. The parent
     * draws a hierarchy, the API page draws a request, and this draws the
     * fork that decides everything: sensitive records go one way and ordinary
     * ones go the other, and both end in the same written record.
     */
    diagram: {
      caption:
        "A record is classified first. Sensitive data goes to a model inside your own network and everything else to a hosted endpoint with retention off. Both are written to a log you keep.",
      align: "sequence",
      rows: [
        [{ label: "A record", sub: "From your system", tone: "brand" }],
        [{ label: "Classified", sub: "Decided in week one", tone: "accent" }],
        [
          { label: "Private model", sub: "Inside your network", tone: "accent" },
          { label: "Hosted, retention off", sub: "Nothing kept", tone: "accent" },
        ],
        [{ label: "Your audit log", sub: "Every call, readable", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Will OpenAI or Anthropic use our company data to train their models?",
        answer:
          "No, on an enterprise endpoint with retention switched off. Inputs are processed and not kept, and they do not reach the pipeline that trains a public model. Somebody has to configure that for each provider, and we check it rather than trusting a default.",
      },
      {
        question: "Can you help us pass app store review with a new AI feature?",
        answer:
          "We produce the thing a review asks for. That is a written account of every field the model reads, where it goes and how long it stays. The submission and the decision stay with you, and no supplier can honestly promise the outcome of somebody else's review.",
      },
      {
        question: "What is the difference between an open weight model and an enterprise API?",
        answer:
          "An enterprise API is rented. You call their model and configure it to keep nothing. An open weight model is hosted by you, so it runs on hardware you control and no request leaves your network. It costs more to run and answers the question completely.",
      },
      {
        question: "Does a private deployment cost more to run?",
        answer:
          "Yes, and it is worth saying plainly. You pay for hardware or a reserved instance whether or not anybody uses it, where a hosted endpoint charges for what you send. The audit puts both numbers in front of you first.",
      },
      {
        question: "Do you hold any security certifications?",
        answer:
          "We do not claim one, and you should be careful with any supplier who does without naming the auditor and the report. What we can show is the process: the field list, the retention settings and a log of every call, all of which you keep.",
      },
      {
        question: "What happens to the documentation if we do not go ahead?",
        answer:
          "You keep it. Week one produces the field list and the residency decisions. They are useful to whoever builds this, whether that turns out to be us or somebody else.",
      },
    ],
  },

  /*
   * Silo 2's parent, built 22 August 2026 from a blueprint the client brought.
   * Fourth page on this template.
   *
   * Three things in that blueprint were not taken.
   *
   * !! THE SLUG STAYS /services/ai-workflow-automation !!
   *
   * The blueprint asked for /services/workflow-automation. Four child pages
   * already sit under the longer path, and it is what content/navigation.ts,
   * the breadcrumb trail and docs/hitasoft_ai_architecture_strategy.md all
   * carry. Dropping "ai-" would move five URLs to buy nothing.
   *
   * !! THIS PAGE DOES NOT TARGET "custom AI agent development" !!
   *
   * The blueprint listed it as a secondary here. It is the primary keyword of
   * /services/autonomous-ai-agents, which is a child of
   * this page. This is the same collision the integration silo already shipped
   * once and had to unpick, so it is being caught before the build rather than
   * after. The parent takes the category term its own URL carries. The
   * strategy doc's own secondary for this path, "autonomous workflow
   * automation for SMBs", goes in that slot instead. See rule one in
   * docs/seo-standards.md.
   *
   * The blueprint's second use case was smart inventory and retail, which
   * belongs to two other pages and would have bled a third page's keyword into
   * this one. Replaced with a multi-step agent scenario, so the four use cases
   * now map one to one onto the four children.
   */
  "/services/ai-workflow-automation": {
    path: "/services/ai-workflow-automation",
    /*
     * 40 characters, so 51 rendered. The blueprint proposed "AI Workflow &
     * Operational Automation Services | Hitasoft", which appends a second
     * brand name to the one app/layout.tsx already adds, and splits the
     * primary phrase in half with "& Operational" so it no longer matches.
     */
    metaTitle: "AI Workflow Automation Services for SMBs",
    serviceType: "AI workflow automation",
    metaDescription:
      "Your team retypes what a system already knows. We build AI workflow automation services that take the support queue and the invoices off them. Book a review.",

    hero: {
      /*
       * Carries the primary term, because the H1 below cannot without going
       * limp. Same solution as the compliance page in this silo's sibling.
       */
      eyebrow: "AI workflow automation",
      /*
       * The blueprint's headline read "We find the hours your team is losing.
       * Then we automate them." Kept, with the referent fixed. You do not
       * automate hours, you automate the work that eats them.
       */
      title: "We find the hours your team loses. Then we automate the work.",
      lede: "Your team was not hired to move numbers between screens. We automate that work inside the systems you already run, and nobody has to manage a technology project.",
      /*
       * Both are backed. The costed plan in week two is the engagement shape
       * in content/how-it-works.ts, and running inside current systems is the
       * whole positioning. No figures, per docs/positioning.md.
       */
      badges: ["Costed plan in week two", "Runs inside your current systems"],
    },

    /*
     * The GEO direct answer block, and the Service schema description. The
     * blueprint's version ran to three sentences over the length limit and
     * closed on "significantly reducing operational overhead", which asserts
     * a saving with no figure behind it. This says what the thing is.
     */
    summary: {
      heading: "What AI workflow automation is",
      body: "AI workflow automation puts software in charge of the repeat jobs a business currently does by hand. An agent reads the document and writes the result back. The work runs across the tools a company already owns, which is why support triage and invoice entry are the usual first candidates.",
    },

    problem: {
      heading: "The work nobody put on a roadmap",
      body: "Every growing company accumulates jobs that exist because two systems do not talk to each other. Somebody copies a number off one screen into another. It sits on your payroll every month and nobody has ever put a number against it.",
      points: [
        {
          title: "The queue that never empties",
          body: "The same questions arrive every week, and a person answers each one of them by hand. Volume grows and the only lever is hiring.",
        },
        {
          title: "Numbers retyped between systems",
          body: "One system holds the figure and another needs it. Somebody moves it by hand, and one typo becomes a reconciliation problem that surfaces weeks later.",
        },
        {
          title: "Jobs that stall when one person is away",
          body: "Multi-step work lives in somebody's head rather than in software. The whole process stops the week they take leave, and nobody else knows the running order.",
        },
      ],
    },

    /* The four children, in the order the silo lists them. */
    capabilities: {
      heading: "What our automation services cover",
      items: [
        {
          title: "Autonomous AI agents",
          body: "An agent runs the job end to end. It decides the next step from what it finds rather than following a fixed script.",
        },
        {
          title: "Intelligent customer support",
          body: "A model answers from your own ticket history and documentation. Anything it cannot settle is routed to a person, and the context travels with it.",
        },
        {
          title: "Document processing and OCR",
          body: "Invoices and receipts arrive as PDFs and photographs. A vision model reads them, then writes structured rows straight into the database you already use.",
        },
        {
          title: "Financial and data automation",
          body: "Transactions are categorised as they arrive and the ledger updates itself without anybody opening a spreadsheet. Month end reconciliation stops being a person's job.",
        },
      ],
    },

    /*
     * The blueprint headed this "Human Labor against AI Automation" and asked
     * for speed in hours against seconds, and cost as salary against micro
     * cents per API call. Both are figures the company has not measured, and
     * docs/positioning.md is explicit that the claim is the shape of the
     * saving rather than its size. Every cell here is a characterisation.
     *
     * The framing also changed. Comparing people to software invites the
     * reading that this is a redundancy exercise, which is not what the silo
     * sells. The columns compare two ways of doing one job.
     */
    comparison: {
      heading: "By hand against automated",
      body: "This compares two ways of doing the same work, and it is not a comparison of people against software. Your team keeps the work that needs judgement.",
      columns: ["By hand", "Automated"],
      rows: [
        {
          label: "When it happens",
          values: ["Work waits until somebody is free", "Runs the moment the task arrives"],
        },
        {
          label: "Consistency",
          values: ["Accuracy drops through a long shift", "The same rules applied every time"],
        },
        {
          label: "Scale",
          values: ["More volume means another hire", "Volume rises without a new seat"],
        },
        {
          label: "What it costs",
          values: ["A salary, paid whether the queue is full or empty", "Charged per job the software actually runs"],
        },
        {
          label: "Exceptions",
          values: ["Everything looks fine until somebody checks", "Anything unclear is flagged to a person"],
        },
      ],
    },

    scenarios: {
      heading: "What automation actually looks like",
      body: "Four jobs, in the systems they actually happen in. Each one has a page of its own, and the section above links to all four.",
      items: [
        {
          system: "Your ledger",
          title: "Transactions categorised as they land",
          body: "Raw transaction data arrives and is sorted into categories without a person opening a spreadsheet. Balances across several users recalculate themselves as the entries change.",
        },
        {
          system: "Your inbox",
          title: "Invoices read and filed",
          body: "A vendor sends a PDF and a vision model pulls the fields out of it. The finished row lands in your database, and not a single line item was retyped by hand.",
        },
        {
          system: "Your help desk",
          title: "Tier one answered from your own history",
          body: "An agent reads past tickets and your documentation, then answers the questions it has seen before. Everything else reaches a person with the thread already summarised.",
        },
        {
          system: "Across your tools",
          title: "A multi-step job that runs itself",
          body: "A new order has to touch your CRM and your billing before it is done. An agent walks that whole sequence and stops only when a number does not match.",
        },
      ],
    },

    /* Straight from content/how-it-works.ts, so the page and the process page
     * cannot drift apart. The blueprint's "2-day technical audit" was close:
     * the two days are real and sit inside week one, and the ranked plan lands
     * at the end of week two rather than after the two days. */
    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We watch the work",
          body: "We spend two days sitting with your team, following the jobs that still happen by hand. Every step gets a cost put against it.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names what to automate first, and what each of those saves every month. You decide whether any of it goes ahead.",
        },
        {
          when: "From week 3",
          title: "We build it and keep it running",
          body: "The first automation goes live in the software you already run, with nothing else moved. The same engineer stays with it through to handover.",
        },
      ],
    },

    reach: {
      heading: "Where the work runs",
      body: "The automation runs against the systems you already have. The same engineer stays with the work, from that first week right through to the handover.",
      points: [
        {
          label: "Runs where your data is",
          body: "Hosted or inside your own network. That is decided before a line is written.",
        },
        {
          label: "A person on the exceptions",
          body: "Anything the agent cannot settle is routed to a person.",
        },
        {
          label: "Written down either way",
          body: "The process map from week one is yours to keep.",
        },
      ],
    },

    stack: {
      heading: "What the automations are built from",
      body: "We fit the automation into the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "Models that read and decide",
          items: [
            { name: "Claude", category: "Reasoning over your own records", icon: "siClaude" },
            { name: "GPT", category: "Drafting and classification" },
            { name: "Vision models", category: "Reading scans and photographs" },
          ],
        },
        {
          label: "Where the steps are wired",
          items: [
            { name: "n8n", category: "The workflow runner", icon: "siN" },
            { name: "MCP", category: "How an agent reaches your tools", icon: "siModelcontextprotocol" },
            { name: "Python", category: "The steps that need real code", icon: "siPython" },
          ],
        },
        {
          label: "Where the results land",
          items: [
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "Redis", category: "Queues and rate limits", icon: "siRedis" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * !! DO NOT REACH FOR THE CHAIN AGAIN !!
     *
     * This was one node feeding one node feeding a fork, which is the exact
     * skeleton the API page and the compliance page already use. Three pages
     * running "something arrives, something processes it, it forks, your thing
     * updates" with nothing changed but the labels reads as a template rather
     * than as three architectures. Rebuilt 22 August 2026.
     *
     * The shape now argues something the chain could not. Workflow automation
     * is not a single entry pipeline. Work arrives from wherever it already
     * arrives, which is the point of automating it, so the diagram opens on a
     * pair instead of on one box. None of the other three do.
     *
     * That makes it fan in, then fan out, then join. The connectors compute
     * every gap from where the nodes actually sit, so this needed no component
     * change. The chain was a choice, not a constraint.
     *
     * Tones follow the rule on ArchitectureDiagram: brand is what the client
     * already owns and accent is what we add. The triggers and the systems are
     * theirs, and only the middle two rows are new work.
     */
    diagram: {
      caption:
        "Work arrives by email or by form. One agent picks it up, handles most of it straight through and sends anything unclear to a person. Your systems are updated either way.",
      align: "sequence",
      rows: [
        [
          { label: "An email arrives", sub: "Invoice or request", tone: "brand" },
          { label: "A form is filled", sub: "Or a webhook fires", tone: "brand" },
        ],
        [{ label: "The agent", sub: "Reads and decides", tone: "accent" }],
        [
          { label: "Handled", sub: "Straight through", tone: "accent" },
          { label: "Sent to a person", sub: "The exceptions", tone: "accent" },
        ],
        [{ label: "Your systems", sub: "Updated either way", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "How do you decide which processes to automate first?",
        answer:
          "Week one is two days sitting with your team, following the jobs that currently happen by hand and putting a cost against each step. At the end of week two you get a plan that ranks them, cheapest and fastest first. You decide what goes ahead.",
      },
      {
        question: "Does this mean replacing our current software stack?",
        answer:
          "No. The agents work across the tools your team already opens every morning, reading from one and writing into another. Nothing is migrated and nothing is retired.",
      },
      {
        question: "What happens when an agent cannot solve a task?",
        answer:
          "It stops and hands the task to a person, with everything it already worked out attached. That fallback is designed in from the start rather than added after the first bad week, and the routing rules are yours to set.",
      },
      {
        question: "Can this replace manual data entry with AI?",
        answer:
          "That is the most common first job. A vision model reads the invoice or the form, and the fields land as structured rows in your database. A person reviews anything the model flags as unclear.",
      },
      {
        question: "What is automated AI task execution?",
        answer:
          "It means software carries out a whole multi-step job without a person driving each step. The agent reads the input, decides the next step and writes the result back into your system. Autonomous workflow automation for SMBs usually starts with one job rather than the whole department.",
      },
      {
        question: "Do we need an IT team to run this?",
        answer:
          "No, and most of the businesses we build for do not have an IT team at all. We run it after handover, and the same engineer who built it stays with it.",
      },
    ],
  },

  /*
   * The first silo child built after its own parent, 22 August 2026, and the
   * sixth page on this template.
   *
   * The brief arrived cleaner than the last two. Its slug already matched the
   * flattened path, and its primary keyword is the one this page was always
   * assigned, which is the phrase the parent was deliberately kept off.
   *
   * Two things in it were changed.
   *
   * !! "autonomous workflow automation" IS THE PARENT'S, NOT THIS PAGE'S !!
   *
   * The brief listed it as a secondary here. The parent at
   * /services/ai-workflow-automation carries "autonomous workflow automation
   * for SMBs" and says it verbatim in its last FAQ. Bare and qualified are the
   * same phrase to a search engine, so this page takes "autonomous AI agents"
   * instead, which is what its own URL and its own definition block are about.
   *
   * !! CrewAI AND AutoGen ARE NOT ON THE VETTED LIST !!
   *
   * They are not in content/integrations.ts, which carries a confirm before
   * launch warning because that list is a claim about what has actually been
   * delivered. They are, however, already published in the short form entry
   * for this exact path in content/services.ts, so the claim predates this
   * page and is not being introduced here.
   *
   * The split: the prose keeps them, because deleting a capability claim the
   * company already makes about itself is not a call this page gets to make.
   * The stack block does not, because that renders from the vetted list. Both
   * need confirming before launch, alongside the integrations rows.
   */
  "/services/autonomous-ai-agents": {
    path: "/services/autonomous-ai-agents",
    /*
     * 49 characters, the whole budget. The brief proposed "Custom AI Agent
     * Development | Multi-Agent Automation" at 52, which renders at 63 and is
     * cut mid word. "Systems" for "Automation" buys the three characters and
     * moves the tail closer to the secondary term.
     */
    metaTitle: "Custom AI Agent Development | Multi-Agent Systems",
    serviceType: "custom AI agent development",
    metaDescription:
      "Stop prompting and start delegating. Custom AI agent development for multi-step work, with agents that call your own APIs and pause for approval. Book a review.",

    hero: {
      eyebrow: "Autonomous AI agents",
      /*
       * The brief's angle, kept whole: the shift from talking to AI to
       * delegating to it. Its own headline was "Replace Cross-App Manual Work
       * with Autonomous AI Agents", which is the keyword with a verb in front
       * and says nothing a chatbot vendor could not also say.
       *
       * This states the distinction the comparison table then proves, which is
       * the argument the whole page rests on.
       */
      title: "Stop talking to the AI. Start handing it the job.",
      lede: "A chatbot waits to be asked and then answers. An agent is given a goal, works out the steps and carries them out in the systems you already run.",
      /* Both are design decisions rather than measurements. */
      badges: ["Pauses before it spends money", "Runs on your own APIs"],
    },

    summary: {
      heading: "What autonomous AI agents are",
      body: "An autonomous AI agent is software that takes a goal rather than a prompt, then plans the steps and carries them out. It calls the tools it needs, checks what came back and decides what to do next. Several agents can split one job between them, which is what separates custom AI agent development from putting a chat window on a website.",
    },

    problem: {
      heading: "A chat window was never the point",
      body: "Most of the AI a business has tried so far answers a question and then stops there. Somebody still has to open the other four systems and then do the actual work by hand. The answer arrives faster and the job takes exactly as long as it did before.",
      points: [
        {
          title: "The answer is not the work",
          body: "A model tells your team what the refund policy says. Somebody still opens the billing system and issues it.",
        },
        {
          title: "One prompt, one step",
          body: "Anything that takes six steps takes six prompts, each typed by a person who has to know what the next one is.",
        },
        {
          title: "Nobody trusts it with anything that matters",
          body: "Without a place to stop and ask, an agent either gets nothing important to do or it gets something important and nobody sleeps.",
        },
      ],
    },

    /*
     * The brief headed this "The Frameworks Behind the Automation" and named
     * CrewAI and AutoGen in an H3. The heading is about capability now, with
     * the frameworks named in the body where they read as an example rather
     * than as the section's subject. See the note above this entry.
     */
    capabilities: {
      heading: "What makes an agent an agent",
      items: [
        {
          title: "Multi-agent orchestration",
          body: "One agent plans and others carry out the steps, using frameworks such as CrewAI and AutoGen. Each one is given a narrow remit, and that narrowness is what keeps the whole thing reviewable.",
        },
        {
          title: "API tool calling",
          body: "The agent reaches into your systems through the APIs they already expose to everything else. It reads what came back and decides the next step from that rather than from a script.",
        },
        {
          title: "Human in the loop",
          body: "High risk actions stop and wait for a person. You decide which actions go on that list, and moving money is on it by default.",
        },
      ],
    },

    /*
     * A different axis from the parent's, which compares by hand against
     * automated. This one separates two things a buyer has already been sold
     * and cannot tell apart, which is the job of a comparison on a child page.
     */
    comparison: {
      heading: "A chatbot against an agent",
      body: "Both are built on the same models. What separates them is whether the thing can act.",
      columns: ["A chatbot", "An agent"],
      rows: [
        {
          label: "What it does",
          values: ["Answers the question asked", "Carries out the job given"],
        },
        {
          label: "Reaching your systems",
          values: ["None, it only produces text", "Calls the APIs you already have"],
        },
        {
          label: "Multi-step work",
          values: ["One prompt gets one answer", "Plans the steps and works through them"],
        },
        {
          label: "What starts it",
          values: ["A person typing", "A schedule or an event in your system"],
        },
        {
          label: "When it is unsure",
          values: ["Answers anyway", "Stops and asks a named person"],
        },
      ],
    },

    scenarios: {
      heading: "Multi-agent workflows in action",
      body: "Three jobs where one agent would not be enough. In each of them the work is split, and the handover between agents is the part that makes it work.",
      items: [
        {
          system: "Your expense ledger",
          title: "Three agents on one receipt",
          body: "One agent reads the receipt and pulls the figures out. A second decides the category, a third works out who owes what, and the reconciliation lands in your database.",
        },
        {
          system: "Your stock system",
          title: "A purchase order drafted for approval",
          body: "An agent watches how fast things are selling and compares that against what is on the shelf. It drafts the order when a gap is coming and waits for a person to sign it off.",
        },
        {
          system: "Your content pipeline",
          title: "Research handed down a chain",
          body: "One agent gathers what people are searching for and a second groups it into topics. A third turns the topics into outlines.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We watch the work",
          body: "We spend two days sitting with your team, following the jobs that cross several systems. Every step gets a cost put against it.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names which job an agent should take first, and what that saves every month. You decide whether any of it goes ahead.",
        },
        {
          when: "From week 3",
          title: "We build it and keep it running",
          body: "The first agent goes live with a narrow remit and a person on the approvals. The remit widens once it has earned it.",
        },
      ],
    },

    reach: {
      heading: "What an agent is allowed to do",
      body: "An agent's remit is a decision you make. It is written down before anything is built, and it is widened later only on purpose.",
      points: [
        {
          label: "Which systems it can touch",
          body: "Named APIs, and nothing it was not given.",
        },
        {
          label: "Where it has to stop",
          body: "Any action on the approval list waits for a person.",
        },
        {
          label: "What it leaves behind",
          body: "Every step an agent took is readable afterwards.",
        },
      ],
    },

    stack: {
      heading: "What the agents are built from",
      body: "We fit the agents around the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "The models that plan",
          items: [
            { name: "Claude", category: "Reasoning across several steps", icon: "siClaude" },
            { name: "GPT", category: "Drafting and classification" },
            { name: "Llama", category: "Runs inside your own network", icon: "siMeta" },
          ],
        },
        {
          label: "How they reach your tools",
          items: [
            { name: "MCP", category: "One way into your systems", icon: "siModelcontextprotocol" },
            { name: "Python", category: "The steps that need real code", icon: "siPython" },
            { name: "n8n", category: "Triggers and scheduling", icon: "siN" },
          ],
        },
        {
          label: "What they run against",
          items: [
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "Stripe", category: "Payments, behind an approval", icon: "siStripe" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * A new shape, per the rule on ArchitectureDiagram in content/types.ts.
     * The four diagrams already shipped run 1-2-2, 1-1-2-1, 1-1-2-1 and
     * 2-1-2-1. This is 1-2-2-1 and none of them is.
     *
     * The middle pair is the thing this page argues. An agent reads and acts
     * in the same breath, which is exactly what the chatbot in the comparison
     * table cannot do, so the two run side by side rather than in sequence.
     *
     * The escalation node is brand rather than accent. The person it stops for
     * is the client's, and the colour break is where the work hands back.
     */
    diagram: {
      caption:
        "A goal arrives. The agent reads your data and calls your APIs, then either checks its own work or stops and asks a person. The result is written back into your system.",
      align: "sequence",
      rows: [
        [{ label: "A goal", sub: "Not a prompt", tone: "brand" }],
        [
          { label: "Reads the data", sub: "Yours, in place", tone: "accent" },
          { label: "Calls your APIs", sub: "Tool use", tone: "accent" },
        ],
        [
          { label: "Checks its own work", sub: "Then carries on", tone: "accent" },
          { label: "Asks a person", sub: "High risk actions", tone: "brand" },
        ],
        [{ label: "Written back", sub: "Into your system", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Can AI agents work with the software we already use?",
        answer:
          "If it has an API, an agent can reach it. That covers the obvious ones like Stripe and it covers the dashboard somebody built for you years ago. Where there is no API we look at what the system does expose before proposing anything.",
      },
      {
        question: "What happens if an autonomous agent makes a mistake?",
        answer:
          "The design assumes it will. High risk actions stop before they happen and wait for a named person to approve them, and moving money is on that list by default. Every step is logged, so a wrong decision is something you can find rather than something you infer from the result.",
      },
      {
        question: "How much does it cost to run multi-agent workflows?",
        answer:
          "It is charged per job rather than per seat. Cost is kept down two ways. The cheap steps get a smaller model, and open weight models can be hosted on your own hardware where the volume justifies it. We put real numbers against your jobs in week two.",
      },
      {
        question: "What are multi-agent AI solutions for business?",
        answer:
          "Several agents with narrow remits, splitting one job between them. One of them plans, another calls the tools, and a third checks what came back. Narrow remits are what make the work reviewable, and they are why a multi-agent system usually beats one agent asked to do everything.",
      },
      {
        question: "Do you do CrewAI agent development?",
        answer:
          "Yes, and AutoGen. The framework is picked from what the job needs rather than from what we used last time. The agents still reach your systems through the same APIs.",
      },
      {
        question: "How is this different from workflow automation?",
        answer:
          "Workflow automation runs a path somebody has already mapped out. An agent is given the goal and works the path out for itself, which is worth paying for when the steps change with the input.",
      },
    ],
  },

  /*
   * The second child of the workflow silo, 22 August 2026, seventh page on the
   * template.
   *
   * Four things in the brief were declined.
   *
   * !! THERE IS NO 70% !!
   *
   * The proposed meta description opened "Resolve 70% of customer inquiries
   * instantly". No resolution rate has been measured, and every number in
   * content/metrics.ts is still marked a draft. It is the same shape as the
   * "38 hours saved per week" and "Deployed in 50+ Countries" figures earlier
   * briefs asked for and did not get. The description leads on the symptom
   * instead, which needs no figure to land.
   *
   * !! ZENDESK AND INTERCOM ARE NOT NAMED !!
   *
   * The brief put them in an H3. Neither appears anywhere in this repo, so
   * unlike CrewAI on the agents page this would be a delivery claim being
   * introduced rather than one carried forward. content/integrations.ts is
   * explicit that the list has to match what has actually been delivered. The
   * capability is described instead, as the help desk your team already
   * answers in. Name them once somebody confirms a build.
   *
   * "Seamless Human Handoff" was an H3 too, and "seamless" is on the banned
   * list in docs/positioning.md.
   *
   * The comparison asked for setup time as months against days. Days
   * contradicts content/how-it-works.ts, which puts a costed plan at the end
   * of week two. That row compares what the two are built out of instead,
   * which makes the same point without inventing a duration.
   */
  "/services/customer-support-ai": {
    path: "/services/customer-support-ai",
    /*
     * 43 characters. The brief appended "| Hitasoft" to a title that
     * app/layout.tsx already suffixes, which renders the brand twice at 65 and
     * truncates.
     */
    metaTitle: "AI Customer Support Automation & RAG Agents",
    serviceType: "AI customer support automation",
    metaDescription:
      "Your team answers the same questions every week. AI customer support automation that reads your own docs and tickets, and escalates the rest. Book a review.",

    hero: {
      eyebrow: "AI customer support automation",
      /*
       * The brief's headline was "Resolve the Same 20 Questions. Without Human
       * Intervention." The twenty is arbitrary, and "without human
       * intervention" is the thing a support buyer is afraid of rather than
       * the thing they want. This keeps the repetition, which is the real
       * pain, and puts their team on the sympathetic side of it.
       */
      title: "Your team knows the answer. They have typed it nine times today.",
      lede: "Most support tickets are a question somebody already answered. An agent that can read your documentation and your closed tickets answers it again, in the words your team would use.",
      badges: ["Answers only from your own docs", "Escalates rather than guesses"],
    },

    summary: {
      heading: "What RAG powered support is",
      body: "AI customer support automation uses retrieval augmented generation, which means the model is given your own material to answer from rather than answering from memory. Your documentation and your closed tickets are indexed so they can be searched by meaning. The agent finds the passage that applies and answers from it, then hands over anything it cannot find.",
    },

    problem: {
      heading: "The same twenty questions, forever",
      body: "Support volume rises with customers, and most of that rise is the same handful of questions. The hard tickets are the ones worth a person, and they sit in a queue behind password resets. Your best support person spends the morning on questions your own documentation already answers in full.",
      points: [
        {
          title: "Tier one eats the day",
          body: "Billing questions arrive faster than anybody clears them. The interesting tickets wait behind them.",
        },
        {
          title: "The answer already exists",
          body: "It is in the documentation, or in a ticket. Nobody finds either one under time pressure.",
        },
        {
          title: "The old bot made it worse",
          body: "A decision tree that never had the answer taught your customers to hunt for the button that reaches a person.",
        },
      ],
    },

    capabilities: {
      heading: "How we build support agents that work",
      items: [
        {
          title: "Your knowledge, indexed",
          body: "Documentation and closed tickets are chunked, then embedded into a vector database your team controls. Search then runs on meaning rather than on the words a customer happened to type.",
        },
        {
          title: "Wherever your customers already are",
          body: "The agent sits in the help desk your team already answers in, reached through its API. Your customers never learn a new place to ask.",
        },
        {
          title: "A handover that carries context",
          body: "Anything outside the documentation goes to a person. What the customer asked and what the agent found travel with it, so nobody starts again.",
        },
      ],
    },

    comparison: {
      heading: "An old chatbot against a RAG agent",
      body: "Most buyers have been sold the first one already. What separates them is what the thing is allowed to answer from in the first place.",
      columns: ["A scripted bot", "A RAG agent"],
      rows: [
        {
          label: "How it finds an answer",
          values: ["A decision tree somebody drew", "Searches your documents by meaning"],
        },
        {
          label: "What it is built from",
          values: ["Conversation flows written by hand", "The documentation you already have"],
        },
        {
          label: "What it gives back",
          values: ["A link to a help article", "The passage that answers the question"],
        },
        {
          label: "When the docs change",
          values: ["Somebody rewrites the flow", "The index is rebuilt and it follows"],
        },
        {
          label: "When it does not know",
          values: ["Guesses, or loops", "Says so, and fetches a person"],
        },
      ],
    },

    /*
     * The first use case is the company's own customer base, the script buyers
     * in the fourth segment of docs/positioning.md, so it is the one example
     * here that is not hypothetical.
     *
     * The third says nothing about medical compliance. Walking somebody
     * through a microphone permission is support. Handling patient data is a
     * claim this page does not make, and positioning.md line 212 is why.
     */
    scenarios: {
      heading: "Support automation in practice",
      body: "Three places where the questions repeat. In each of them the agent is reading something the business had already written down.",
      items: [
        {
          system: "Your product documentation",
          title: "Buyers configuring a script they bought",
          body: "A buyer with no developer asks how to point the app at their own domain. The agent finds that step in the deployment guide and answers with it, rather than linking to the whole page.",
        },
        {
          system: "Your app's help panel",
          title: "Billing questions inside a ledger app",
          body: "Somebody asks why an expense split the way it did. The agent explains the rule from your own documentation, and the engineering team never sees the ticket at all.",
        },
        {
          system: "Your community platform",
          title: "Permissions and setup on a live video app",
          body: "A user cannot get their microphone working. The agent walks them through the permission their device is asking for, inside the app, while they wait.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We read what you already have",
          body: "Two days with your team, and a look at the tickets you closed last quarter. The repeat questions sort themselves into a list.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan says which questions an agent should take first, and what that clears off the queue. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It goes live on a narrow set",
          body: "The agent starts on the questions it answers best. The set widens as the answers hold up.",
        },
      ],
    },

    reach: {
      heading: "What the agent is allowed to say",
      body: "The boundary is the whole point of this architecture. An agent that can only answer from your own material is an agent that cannot invent a refund policy.",
      points: [
        {
          label: "Answers from your material only",
          body: "If it is not in your documentation or your tickets, it is not an answer.",
        },
        {
          label: "Escalates instead of guessing",
          body: "Not knowing is a routing decision rather than a failure.",
        },
        {
          label: "Every answer is traceable",
          body: "You can see which passage an answer came from.",
        },
      ],
    },

    stack: {
      heading: "What the support agent is built from",
      body: "We fit the agent around the help desk you run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "The models that answer",
          items: [
            { name: "Claude", category: "Answering from your own material", icon: "siClaude" },
            { name: "GPT", category: "Drafting and classification" },
            { name: "Embeddings", category: "Turning your docs into search" },
          ],
        },
        {
          label: "Where your knowledge sits",
          items: [
            { name: "pgvector", category: "Your documents, made searchable" },
            { name: "PostgreSQL", category: "Tickets and reporting", icon: "siPostgresql" },
            { name: "Redis", category: "Queues and rate limits", icon: "siRedis" },
          ],
        },
        {
          label: "How it reaches your desk",
          items: [
            { name: "MCP", category: "One way into your systems", icon: "siModelcontextprotocol" },
            { name: "Python", category: "Indexing and evaluation", icon: "siPython" },
            { name: "n8n", category: "Triggers and routing", icon: "siN" },
          ],
        },
      ],
    },

    /*
     * Sixth shape, and the rule on ArchitectureDiagram says it has to be one
     * the others do not use. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1
     * and 1-2-2-1. This is 1-2-1-2.
     *
     * The pair on the second row is the argument. Retrieval reads two sources
     * at once and both of them belong to the client, which is why they are
     * brand rather than accent, and why the one red box is the single step we
     * add to material they already had.
     *
     * It is also the first that ends on a pair instead of resolving into one
     * node. Support does not converge. Either the customer has an answer or a
     * person has the ticket.
     */
    diagram: {
      caption:
        "A question arrives. The agent searches your documentation and your closed tickets, then builds an answer from what it found. It replies, or it passes the ticket to a person.",
      align: "sequence",
      rows: [
        [{ label: "A question", sub: "From your customer", tone: "brand" }],
        [
          { label: "Your documentation", sub: "Searched by meaning", tone: "brand" },
          { label: "Closed tickets", sub: "How you answered before", tone: "brand" },
        ],
        [{ label: "The answer", sub: "Built from what it found", tone: "accent" }],
        [
          { label: "Replied", sub: "In your own words", tone: "accent" },
          { label: "Passed to a person", sub: "With the context", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Can the AI use our existing ticket history?",
        answer:
          "It is usually the most valuable thing you have. Closed tickets are cleaned, structured and indexed, which teaches the agent how your team actually phrases an answer and how the awkward cases were settled. Whatever help desk you run, the work is the same as long as it has an API to export from.",
      },
      {
        question: "Will the AI make things up or hallucinate?",
        answer:
          "It is confined to your own material. Retrieval augmented generation hands the model the passages that matched and tells it to answer from those. An answer that is not somewhere in your documentation is not one that it can give. Where nothing matches, it escalates rather than filling the gap.",
      },
      {
        question: "Does it handle customers writing in other languages?",
        answer:
          "Yes. The model reads a question in whatever language it arrives in and answers in that same language. Your documentation only had to be written once. Test it on your own material first.",
      },
      {
        question: "What is RAG chatbot integration?",
        answer:
          "It puts a retrieval step in front of the model. The customer's question searches your indexed documents first, and only the passages that come back are given to the model to answer from. That one retrieval step is the whole difference between a support agent and an ordinary chatbot.",
      },
      {
        question: "Do you do automated ticketing system setup as well?",
        answer:
          "Yes, and it is usually the same project. Routing rules, priorities and the question of what an agent may close all get decided in week two. An agent answering well into a queue nobody has organised does not help very much.",
      },
      {
        question: "How is this different from custom AI chatbot development?",
        answer:
          "A chatbot is judged on the conversation, and this one is judged on whether the ticket closed. Most of the build is not the chat window. It is getting your documentation and your ticket history into a shape the model can search.",
      },
    ],
  },

  /*
   * Third child of the workflow silo, 22 August 2026, eighth page on the
   * template.
   *
   * This brief broke three rules the repo had already written down, all of
   * them in one section.
   *
   * !! NO MODEL VERSION NUMBERS !!
   *
   * An H3 read "Vision-Capable LLM Extraction (GPT-4o, Claude 3.5)".
   * content/integrations.ts line 17 is explicit: model families, never version
   * numbers, because a version dates the page the week it is superseded. The
   * page says vision models and names the families.
   *
   * !! NOT "enterprise" !!
   *
   * The third FAQ asked to "reiterate Zero Data Retention enterprise
   * standards". docs/positioning.md line 64 rules the word out for this buyer
   * entirely, and the decision on 18 August 2026 overrides the earlier
   * framing. Retention off is a real thing we configure, so the answer keeps
   * the substance and drops the word.
   *
   * "Seamless output" was in the second FAQ. Banned list.
   *
   * The primary keyword is the brief's rather than the strategy doc's. That
   * file assigns "intelligent document processing" to this path, and the brief
   * moved it to a secondary in favour of "AI document processing automation".
   * Both are here verbatim, the second in the definition block, and neither
   * belongs to another page.
   *
   * The third use case was "Legal & Regulatory Document Auditing". Indexing
   * dates and parties out of an agreement is document extraction and this page
   * does that. Auditing a contract for regulatory compliance is a different
   * profession and not one anybody here has claimed. The scenario keeps the
   * extraction and drops the audit.
   */
  "/services/document-processing-ocr": {
    path: "/services/document-processing-ocr",
    /*
     * 39 characters. The brief's version appended "| Hitasoft" to a title
     * app/layout.tsx already suffixes, and it dropped "Automation", which is
     * the word that makes the primary keyword match rather than stem.
     */
    metaTitle: "AI Document Processing Automation & OCR",
    serviceType: "AI document processing automation",
    metaDescription:
      "Nobody should retype an invoice. AI document processing automation reads your PDFs and scans, then writes structured rows to your database. Book a review.",

    hero: {
      eyebrow: "AI document processing",
      /*
       * The brief's H1 was "Turn Unstructured Documents into Structured
       * Database Records. Automatically." Every word of that is a category
       * term. This says the same thing as one concrete object moving through
       * one transformation, which is what the reader actually has on their
       * desk.
       */
      title: "The invoice arrives as a photograph. It leaves as a database row.",
      lede: "Somebody in your office is reading a number off a PDF and typing it into a system. A vision model can read the same document and write the fields where they belong.",
      badges: ["Reads photographs, not just PDFs", "Flags what it is unsure of"],
    },

    summary: {
      heading: "What intelligent document processing is",
      body: "Intelligent document processing, often shortened to IDP, reads a document the way a person does and writes what it finds into a system. A vision model looks at the whole page rather than matching a stored template, so a supplier changing their invoice layout does not break anything. The output is structured rows or JSON, rather than the wall of recovered text older tools produced.",
    },

    problem: {
      heading: "The typing nobody costed",
      body: "Documents arrive in whatever shape the sender chose. Somebody opens each one, finds four or five numbers on it, and types them into your system. It is slow, it is where the errors come from, and it scales only by hiring.",
      points: [
        {
          title: "Every supplier has their own layout",
          body: "The total sits in a different place on each invoice. A person absorbs that instantly.",
        },
        {
          title: "The errors surface much later",
          body: "A digit typed wrong reads as a normal number. It becomes a reconciliation problem a month later, when nobody remembers which document it came off.",
        },
        {
          title: "The backlog only ever grows",
          body: "Paperwork arrives faster on a busy week, which is exactly the week nobody has an afternoon to sit and key it in.",
        },
      ],
    },

    capabilities: {
      heading: "Beyond template based OCR",
      items: [
        {
          title: "Whatever shape it arrives in",
          body: "A PDF, or a photograph somebody took on a phone. The same pipeline handles all of them, because the model is reading the page rather than matching a layout.",
        },
        {
          title: "Vision models, not character matching",
          body: "Claude and GPT read a document with its structure intact, so a total is understood as a total. Older OCR returned characters and left the meaning to you.",
        },
        {
          title: "Straight into your database",
          body: "Fields land as rows in PostgreSQL or MySQL, or go out as JSON to whatever system wants them. Nothing waits in a folder for somebody to process.",
        },
      ],
    },

    comparison: {
      heading: "Template OCR against AI document processing",
      body: "Most businesses tried OCR once and gave up on it. The tool was doing something narrower than the job.",
      columns: ["Template OCR", "AI document processing"],
      rows: [
        {
          label: "A layout it has not seen",
          values: ["Fails, or returns the wrong field", "Reads it from context like a person"],
        },
        {
          label: "A new supplier",
          values: ["Somebody maps a new template", "Nothing to configure"],
        },
        {
          label: "Photographs and poor scans",
          values: ["Garbled characters", "Recovers most of it from context"],
        },
        {
          label: "What comes out",
          values: ["A dump of plain text", "Named fields, ready for a database"],
        },
        {
          label: "When it is unsure",
          values: ["Returns it wrong, silently", "Flags the field and asks"],
        },
      ],
    },

    scenarios: {
      heading: "Document automation in practice",
      body: "Three places where paper turns into data. In each of them the document was already arriving and somebody was already typing it.",
      items: [
        {
          system: "Your expense ledger",
          title: "A receipt photographed on a phone",
          body: "Somebody photographs the receipt on the way out. The vision model reads the total and the tax, and the expense lands in the shared ledger already categorised.",
        },
        {
          system: "Your stock records",
          title: "Line items off a delivery note",
          body: "A supplier's delivery note arrives as a scan. Item codes and unit prices come off it as rows, and nobody checks them against the order by eye.",
        },
        {
          system: "Your contract archive",
          title: "Dates and parties out of an agreement",
          body: "Signed agreements arrive as PDFs and go straight into a folder that nobody can search. The dates and the party names are extracted and indexed, so a renewal is findable.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We look at your actual documents",
          body: "Two days with your team, and a stack of the paperwork you actually receive each week. The awkward ones matter more than the tidy ones.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan says which document types to take first, and what that saves every month. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It runs on one document type",
          body: "The first pipeline goes live on one document type. Others follow once the extraction holds up on real post.",
        },
      ],
    },

    reach: {
      heading: "Where your documents go",
      body: "A document is more sensitive than most data a business holds, because it carries everything at once. Where it is processed is decided before anything is built.",
      points: [
        {
          label: "Hosted, retention off",
          body: "The usual route. Documents are processed and nothing is kept.",
        },
        {
          label: "Or inside your own network",
          body: "An open weight vision model on your own hardware.",
        },
        {
          label: "Uncertainty is visible",
          body: "Low confidence fields are flagged rather than quietly filled in.",
        },
      ],
    },

    stack: {
      heading: "What the pipeline is built from",
      body: "We fit the extraction into the systems you already run. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "The models that read",
          items: [
            { name: "Vision models", category: "Reading scans and photographs" },
            { name: "Claude", category: "Understanding a page's structure", icon: "siClaude" },
            { name: "GPT", category: "Extraction and classification" },
          ],
        },
        {
          label: "Where the fields land",
          items: [
            { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
            { name: "MySQL", category: "If that is what you run", icon: "siMysql" },
            { name: "pgvector", category: "Finding a document again later" },
          ],
        },
        {
          label: "How it runs",
          items: [
            { name: "Python", category: "Extraction and checking", icon: "siPython" },
            { name: "n8n", category: "What happens when post arrives", icon: "siN" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Seventh shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1
     * and 1-2-1-2. This is 2-1-1-2, the first that opens and closes on a pair.
     *
     * Which is the argument. Documents arrive in more than one shape and leave
     * to more than one place, and the narrow part in the middle is the point:
     * one pipeline, whatever came in. Only the middle two rows are accent,
     * because the post and the database were both already yours.
     */
    diagram: {
      caption:
        "Documents arrive as PDFs and as photographs. One vision model reads whichever it is, the fields are checked for confidence, and they land in your database or go to a person.",
      align: "sequence",
      rows: [
        [
          { label: "A PDF", sub: "From a supplier", tone: "brand" },
          { label: "A photograph", sub: "Taken on a phone", tone: "brand" },
        ],
        [{ label: "Read by a vision model", sub: "The whole page", tone: "accent" }],
        [{ label: "Fields checked", sub: "How sure is it", tone: "accent" }],
        [
          { label: "Your database", sub: "Rows, not text", tone: "brand" },
          { label: "Flagged for a person", sub: "The unsure ones", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "How does it handle blurry scans or handwriting?",
        answer:
          "Better than older tools, because it reads the context rather than the letter shapes alone. A vision model that can see the whole page infers a smudged digit from the arithmetic around it, the way a person would. Anything it is unsure of gets flagged rather than guessed.",
      },
      {
        question: "What format does the extracted data come out in?",
        answer:
          "Whatever your systems take. Rows in PostgreSQL or MySQL, or JSON over an API. The shape is agreed in week two, because it is easier to match your schema than to make you match ours.",
      },
      {
        question: "Are our documents stored on somebody else's servers?",
        answer:
          "Not if you do not want them to be. The usual route is a hosted model with retention switched off, so documents are processed and nothing is kept. Where the paperwork cannot leave your network at all, an open weight vision model runs on your own hardware instead.",
      },
      {
        question: "What is intelligent document processing IDP?",
        answer:
          "It is reading a document with a model that understands layout, then writing what it found into a system. The IDP part is what separates it from plain OCR, which returns the text and then stops. One of them gives you characters, and the other gives you a field with a name on it.",
      },
      {
        question: "Do you do custom OCR AI development?",
        answer:
          "That is what this service is. The build is a pipeline around a vision model rather than a licence for somebody's OCR product. That is why it fits the documents you actually receive.",
      },
      {
        question: "Do you do automated invoice extraction AI?",
        answer:
          "It is the most common first job on this service. Invoices repeat, they carry numbers somebody is retyping, and every supplier formats them differently, which is exactly where a template based tool falls over.",
      },
      {
        question: "Do we need to change how documents reach us?",
        answer:
          "No. Post keeps arriving in the inbox it already arrives in, and the pipeline reads from there. Changing how your suppliers send things is a project of its own and not one worth running first.",
      },
    ],
  },

  /*
   * The fourth and last child of the workflow silo, 22 August 2026, ninth page
   * on the template. The silo is complete with this one.
   *
   * Three things in the brief were changed.
   *
   * !! NO 95% THRESHOLD !!
   *
   * The third FAQ asked to explain that "anything below a 95% confidence score
   * is pushed to a human dashboard". The routing is real and it is the right
   * architecture. The number is not ours to publish: nobody has set it, and
   * quoting one as though it were a house standard invites a buyer to hold us
   * to it. The answer describes the threshold as a dial you set, which is what
   * it actually is.
   *
   * !! NOTHING IS FLAWLESS !!
   *
   * The brief wanted "Zero Math Errors", "flawless deterministic execution"
   * and "flawless reconciliation". The underlying argument is sound and it is
   * the best thing on this page: a model extracts and categorises, and the
   * arithmetic is handed to ordinary code, which does not approximate. That
   * survives. The absolutes do not, because a pipeline is more than its
   * calculator and the first wrong total makes a liar of the word.
   *
   * QuickBooks and Xero are named, following the decision already taken on the
   * fintech industry page. They are not in content/integrations.ts, so they
   * are worded as where the client's books already live rather than as
   * integrations we have delivered. Both carry the same confirm before launch
   * flag as that page's ecosystem row.
   *
   * The primary keyword reads "financial data automation AI" in the brief,
   * which is not a phrase anybody writes in a sentence. The title uses the
   * natural order and the exact string sits in an FAQ question, where a search
   * phrasing reads as a search phrasing.
   */
  "/services/financial-data-automation": {
    path: "/services/financial-data-automation",
    /* 47 characters. The brief's version appended a second brand name. */
    metaTitle: "AI Financial Data Automation & Ledger Pipelines",
    serviceType: "financial data automation",
    metaDescription:
      "Your finance lead is not paid to retype rows. Financial data automation reads each receipt, sorts it, and leaves all of the maths to code. Book a review.",

    hero: {
      eyebrow: "Financial data automation",
      /*
       * The brief's H1 was "Stop Reconciling Manually. Automate the Financial
       * Pipeline." Two imperatives and no argument.
       *
       * This states the architecture instead, because on a page about money
       * the architecture is the reassurance. It also answers the first FAQ
       * before the reader reaches it, which is the one that decides whether
       * they keep reading at all.
       */
      title: "A model reads the receipt. Your code does the arithmetic.",
      lede: "The part of this that touches money is ordinary code, and code does not approximate. The model is there to read what arrived and decide what it is, which is the part people are slow at.",
      badges: ["Arithmetic never runs through a model", "Every entry traces to a document"],
    },

    summary: {
      heading: "What financial data automation is",
      body: "Financial data automation moves a transaction from wherever it arrives into your ledger without somebody retyping it. A model reads the receipt or the bank line and decides what the entry is. The arithmetic that follows runs in ordinary code, so totals and splits are calculated rather than predicted.",
    },

    problem: {
      heading: "The month end scramble",
      body: "Finance runs on data that arrives in the wrong shape. Somebody exports a CSV, matches rows against a statement, and fixes what does not line up. It absorbs the last week of every month and it gets worse as volume grows.",
      points: [
        {
          title: "Exports, then matching by eye",
          body: "A statement in one window, a spreadsheet in the other. Somebody reconciles them line by line.",
        },
        {
          title: "Categories decided twice",
          body: "The same supplier gets filed two ways by two people. The report that comes out is wrong in a way that nobody downstream can see.",
        },
        {
          title: "A formula nobody has checked",
          body: "The spreadsheet everything depends on was built by somebody who has since left the company. It works until a row goes in the wrong place.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of an automated ledger",
      items: [
        {
          title: "Data in, whatever the shape",
          body: "Bank feeds arrive as structured rows, and receipts arrive as photographs taken on a phone. A vision model handles the second.",
        },
        {
          title: "Categories decided by meaning",
          body: "A model reads the line and the supplier, then decides what kind of entry it is. It follows how your team categorised the same thing before.",
        },
        {
          title: "Arithmetic in ordinary code",
          body: "Totals and splits never pass through a model. They run in deterministic code, which is auditable and gives the same answer every time.",
        },
      ],
    },

    comparison: {
      heading: "A spreadsheet against a pipeline",
      body: "This compares two ways of getting the same numbers. One of them can be checked afterwards.",
      columns: ["Spreadsheet reconciliation", "An automated pipeline"],
      rows: [
        {
          label: "Getting data in",
          values: ["Exported and retyped", "Read from the feed or the receipt"],
        },
        {
          label: "Deciding a category",
          values: ["Whoever is doing it that day", "The same rule, applied every time"],
        },
        {
          label: "When it happens",
          values: ["A scramble at month end", "As each transaction lands"],
        },
        {
          label: "Doing the maths",
          values: ["A formula nobody has audited", "Code that is versioned and tested"],
        },
        {
          label: "An entry that looks odd",
          values: ["Found later, if at all", "Held back for somebody to confirm"],
        },
      ],
    },

    scenarios: {
      heading: "Financial automation in action",
      body: "Three jobs where the numbers already exist. Each one splits the same way, with a model doing the reading and code doing the calculating.",
      items: [
        {
          system: "Your shared ledger",
          title: "One receipt, split across a group",
          body: "A mixed receipt is photographed after a group meal. The model itemises it and a deterministic calculator works out what each person owes, so the balances settle themselves.",
        },
        {
          system: "Your billing records",
          title: "Recurring charges that drifted",
          body: "Subscription charges and reward balances are watched as they post. Anything that does not match what the plan says it should be gets held up before it reaches a customer.",
        },
        {
          system: "Your accounts system",
          title: "An invoice matched to a payment",
          body: "A vendor PDF arrives and is read into fields. Those are matched against the bank feed, and the verified transaction is pushed into whichever system your books already live in.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We follow the money by hand",
          body: "Two days with whoever does the reconciling now. Every manual step gets a cost against it.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names which part of the pipeline to automate first, and what it saves each month. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It runs beside your current process",
          body: "The pipeline goes live alongside what you do now, so the two can be compared. Nobody switches off the spreadsheet on trust.",
        },
      ],
    },

    reach: {
      heading: "Where the model is allowed to touch",
      body: "The split matters more here than anywhere else. A model is good at reading a document and a poor choice for calculating a balance.",
      points: [
        {
          label: "The model reads and sorts",
          body: "Extraction and categorisation, which is what it is good at.",
        },
        {
          label: "Code does every calculation",
          body: "Totals and balances run in tested code and nowhere else.",
        },
        {
          label: "You set where it stops",
          body: "Anything the model is unsure of waits for a person, at a threshold you choose.",
        },
      ],
    },

    /*
     * !! QuickBooks AND Xero ARE NOT ON THE VETTED LIST !!
     *
     * Same position as content/industry-landings.ts takes with its ecosystem
     * row, and the same wording: these are where a client's books already
     * live, not integrations being claimed. Confirm before launch, together
     * with that page's list and content/integrations.ts.
     */
    stack: {
      heading: "What the pipeline is built from",
      body: "We fit the pipeline around the books you already keep. Nothing on this list is a requirement, and the work goes ahead against whatever your software was built on.",
      groups: [
        {
          label: "Reading what arrives",
          items: [
            { name: "Vision models", category: "Receipts and invoices" },
            { name: "Claude", category: "Deciding what an entry is", icon: "siClaude" },
            { name: "Embeddings", category: "Matching a supplier to its history" },
          ],
        },
        {
          label: "Where the books live",
          items: [
            { name: "QuickBooks", category: "If that is what you run", icon: "siQuickbooks" },
            { name: "Xero", category: "Ledgers and invoicing", icon: "siXero" },
            { name: "PostgreSQL", category: "Or your own database", icon: "siPostgresql" },
          ],
        },
        {
          label: "Doing the arithmetic",
          items: [
            { name: "Python", category: "Calculations, tested", icon: "siPython" },
            { name: "Stripe", category: "Payments and billing feeds", icon: "siStripe" },
            { name: "n8n", category: "What runs when a row lands", icon: "siN" },
          ],
        },
      ],
    },

    /*
     * Eighth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1,
     * 1-2-1-2 and 2-1-1-2. This is 1-1-1-2.
     *
     * Three singles in a row is the only arrangement that puts the two
     * processing steps side by side vertically, which is the argument. The
     * model step and the arithmetic step are adjacent and separate, and their
     * sub labels say which is which. Any shape that forked earlier would have
     * buried the one distinction this page is selling.
     */
    diagram: {
      caption:
        "A transaction arrives from a feed or a receipt. A model decides what it is, ordinary code works out the amounts, and the entry reaches your ledger or waits for a person.",
      align: "sequence",
      rows: [
        [{ label: "A transaction", sub: "Feed or receipt", tone: "brand" }],
        [{ label: "The model sorts it", sub: "Reads and categorises", tone: "accent" }],
        [{ label: "Code does the maths", sub: "Deterministic", tone: "accent" }],
        [
          { label: "Your ledger", sub: "Updated as it lands", tone: "brand" },
          { label: "Held for review", sub: "Below your threshold", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Can we trust a model with our money?",
        answer:
          "It never gets the chance. The model reads documents and decides categories, and that is the whole of its job. Every total, split and balance is calculated by ordinary code that is versioned and tested, which does not approximate and gives the same answer twice.",
      },
      {
        question: "Do we have to replace our accounting software?",
        answer:
          "No. The pipeline sits between what you already run and where the data comes from, pushing verified entries into the system your books live in. Replacing an accounts package is a separate project and rarely the one worth doing first.",
      },
      {
        question: "What happens when it cannot categorise something?",
        answer:
          "It stops and asks. Anything the model is not confident about is held for a person to confirm rather than filed on a guess. You decide where that line sits. Most teams set it tight at first, then relax it.",
      },
      {
        question: "What is financial data automation AI?",
        answer:
          "It is using a model for the reading and the sorting, and code for everything that touches a number. The AI half handles receipts and bank lines arriving in whatever shape they arrive in. The calculating half stays deterministic on purpose.",
      },
      {
        question: "Do you do AI ledger automation for shared accounts?",
        answer:
          "Yes, and shared accounts are exactly where the deterministic half earns its keep every time. Who owes what across a group is arithmetic, and it needs an audit trail behind it. A model is the wrong tool for that and a calculator is the right one.",
      },
      {
        question: "Do you do fintech AI integration?",
        answer:
          "Fintech AI integration is exactly what this is. If you ship a financial product yourself, the same split applies, and your own code owns every figure a customer sees.",
      },
      {
        question: "How does automated expense reconciliation actually work?",
        answer:
          "Receipts and bank feeds come in through the same pipeline and are matched against each other. What matches is written through. What does not is held with both sides visible, so whoever looks at it can see why in seconds.",
      },
    ],
  },

  /*
   * Silo 3's parent, 22 August 2026, tenth page on the template. Built from
   * docs/service-pages.md, which carries all four pages in this silo.
   *
   * !! BUILT BEFORE ITS THREE CHILDREN, ON PURPOSE !!
   *
   * The four briefs in that file collide with each other in three places, and
   * the parent is where the terms get settled. Reading them together first is
   * what caught it.
   *
   *   - `build AI SaaS MVP` was a parent secondary. It is the assigned primary
   *     of /services/fintech-saas-ai-mvp. Dropped here.
   *   - `AI proof of concept development` was a parent secondary and
   *     /services/rapid-ai-prototyping carries the same words reordered as
   *     `proof of concept AI development`. A prototype and a proof of concept
   *     are the same pitch, so it belongs to that child. Dropped here.
   *   - `AI MVP development` was a secondary on the prototyping child. It is
   *     this page's own primary with a word removed, so it stays here and
   *     comes off the child.
   *
   * Every page in this silo has to be checked against this list before it
   * ships. Rule one in docs/seo-standards.md.
   *
   * Three things in the brief were declined.
   *
   * !! "6 to 12 months" HAS ALREADY BEEN REJECTED ONCE !!
   *
   * The hero focus asked for founders wasting six to twelve months. That is
   * the same figure the integration page brief asked for as a rebuild
   * duration, and it was cut then for being a number nobody here has
   * measured. Cut again. The argument survives without it.
   *
   * "Flawless closed testing" and "enterprise API connections" are both on the
   * banned list in docs/positioning.md. So is promising an app will "breeze
   * through" a store review, which is an outcome no agency controls.
   *
   * !! THE PLAY CONSOLE CLAIMS NEED CONFIRMING BEFORE LAUNCH !!
   *
   * The brief leans hard on Data safety forms, closed testing tracks and a
   * twelve tester beta. The work is described here as work the build accounts
   * for, never as a track record of approvals, because nobody has confirmed
   * that an app has shipped through review with an AI feature in it. That
   * confirmation is outstanding and predates this page.
   */
  "/services/custom-ai-mvp-development": {
    path: "/services/custom-ai-mvp-development",
    /* 39 characters. The brief appended a second brand name at 50. */
    metaTitle: "Custom AI MVP Development & Prototyping",
    serviceType: "custom AI MVP development",
    metaDescription:
      "Founders lose months building what nobody asked for. Custom AI MVP development builds the core and lets real use decide what comes next. Book a review.",

    hero: {
      eyebrow: "Custom AI MVP development",
      /*
       * The brief's H1 was "Validate Your AI Application. Before You Burn the
       * Budget." The shape is right and the second half is a threat rather
       * than an argument. This states the method instead, which is the thing
       * a founder is actually deciding between.
       */
      title: "Build the part that answers the question. Leave the rest.",
      lede: "Every feature is a guess until somebody uses it. We build the smallest version that can prove or kill the idea, and the people using it decide what gets built next.",
      badges: ["Built to hand over", "Runs on infrastructure you keep"],
    },

    summary: {
      heading: "What custom AI MVP development is",
      body: "Custom AI MVP development means building a working slice of a product rather than the whole of it. The idea can then be tested against real use. The slice carries the feature the product stands or falls on, wired to a model API and a backend that will still hold up later. What comes back from a closed group of users decides the rest of the roadmap.",
    },

    problem: {
      heading: "The expensive way to find out",
      body: "A founder with a clear idea builds all of it, then shows it to people. Most of what gets built is never used, and the part that matters arrives too late to change. The money went on the features nobody asked about.",
      points: [
        {
          title: "The roadmap was written before anybody looked",
          body: "Every item on it was reasonable when it was written. None of it was tested against a real person.",
        },
        {
          title: "The store review is a surprise",
          body: "Data handling gets designed last. Fixing it then means changing decisions made in month one.",
        },
        {
          title: "A prototype nobody can build on",
          body: "The quick version gets thrown together and works. Then it turns out to be the thing you have to rip out before you can grow.",
        },
      ],
    },

    capabilities: {
      heading: "The MVP engineering pipeline",
      items: [
        {
          title: "API first, so the model is swappable",
          body: "The product calls a model through your own layer rather than binding to one provider. Changing which model answers stays a configuration decision later.",
        },
        {
          title: "Infrastructure you do not outgrow",
          body: "The MVP runs on production hosting. It is smaller rather than different, which is why growing into it does not mean a rebuild.",
        },
        {
          title: "Ready for a closed beta",
          body: "Data handling and permissions get decided at the start. The first version is built for a closed testing track.",
        },
      ],
    },

    comparison: {
      heading: "A full build against a lean MVP",
      body: "Both end with a product. They differ in when you learn whether anybody wants it.",
      columns: ["Build all of it", "Build the slice"],
      rows: [
        {
          label: "When users see it",
          values: ["After everything is finished", "While it can still change"],
        },
        {
          label: "What decides the roadmap",
          values: ["A document written up front", "What the beta group actually did"],
        },
        {
          label: "Money at risk",
          values: ["Committed before any evidence", "Spent in a stage you can stop"],
        },
        {
          label: "If the idea is wrong",
          values: ["You find out having paid for all of it", "You find out having paid for one part"],
        },
        {
          label: "What you own after",
          values: ["A large system to maintain", "A running product and an answer"],
        },
      ],
    },

    scenarios: {
      heading: "The MVPs we engineer",
      body: "Three products where the thin slice is obvious. Each has a page of its own.",
      items: [
        {
          system: "A shared ledger product",
          title: "The maths is the product",
          body: "Everything depends on the split across a group being right. The MVP proves that calculator with a model reading receipts into it, and leaves everything else out.",
        },
        {
          system: "An inventory tool",
          title: "One warehouse, running beside the old system",
          body: "A manager tries stock forecasting on real numbers. The old system keeps running, so nobody has to commit before they have seen it work.",
        },
        {
          system: "A live video or community app",
          title: "Permissions before features",
          body: "Media access and data handling get settled first, because they decide whether the app is submittable at all. The feature set stays small until that part holds.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We find the thin slice",
          body: "Two days on what the product has to prove, not on the whole feature list. Most of what gets discussed will not be built first.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the slice and what it will cost. You decide whether that answer is worth buying.",
        },
        {
          when: "From week 3",
          title: "It gets built and put in front of people",
          body: "The slice goes to a closed group. What they do with it decides everything after.",
        },
      ],
    },

    reach: {
      heading: "What an MVP is and is not",
      body: "The word gets used for everything, from a clickable mockup right up to a running business. This is the running kind, built small on purpose rather than built badly to save time.",
      points: [
        {
          label: "It is real software",
          body: "Real users, real data, and hosting you keep afterwards.",
        },
        {
          label: "It is deliberately narrow",
          body: "One question, answered properly. The feature list waits.",
        },
        {
          label: "It is yours to continue",
          body: "The code and the infrastructure hand over.",
        },
      ],
    },

    stack: {
      heading: "What an MVP is built from",
      body: "Nothing exotic, because the point is that it survives. Everything here is what the full product would have used anyway, in a smaller configuration.",
      groups: [
        {
          label: "The model layer",
          items: [
            { name: "Claude", category: "The reasoning the product needs", icon: "siClaude" },
            { name: "GPT", category: "Drafting and classification" },
            { name: "Embeddings", category: "Search across your own content" },
          ],
        },
        {
          label: "The product itself",
          items: [
            { name: "React", category: "Web interfaces", icon: "siReact" },
            { name: "Flutter", category: "iOS and Android from one build", icon: "siFlutter" },
            { name: "Laravel", category: "The backend behind it", icon: "siLaravel" },
          ],
        },
        {
          label: "What it runs on",
          items: [
            { name: "PostgreSQL", category: "Your data, from day one", icon: "siPostgresql" },
            { name: "AWS", category: "Hosting that grows with it" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Ninth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1,
     * 1-2-1-2, 2-1-1-2 and 1-1-1-2. This is 2-2-1-1.
     *
     * It is the only one that narrows the whole way down, which is the
     * argument on this page. Everything you want and everything you can spend
     * come in at the top, the middle row is the cut, and one answer comes out
     * of the bottom. A diagram that stayed the same width would have drawn a
     * process rather than a decision.
     */
    diagram: {
      caption:
        "Your feature list and your budget both arrive whole. We decide what ships first and what waits, put that in front of a closed group, and their use answers the question.",
      align: "sequence",
      rows: [
        [
          { label: "The feature list", sub: "Everything you want", tone: "brand" },
          { label: "The budget", sub: "What you can spend", tone: "brand" },
        ],
        [
          { label: "What ships first", sub: "The thin slice", tone: "accent" },
          { label: "What waits", sub: "Written down, not built", tone: "accent" },
        ],
        [{ label: "A closed beta", sub: "Real people, real use", tone: "accent" }],
        [{ label: "Your answer", sub: "What to build next", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Will the MVP be ready for the app stores?",
        answer:
          "It is built for a closed testing track first, which is where a new product should be. Data handling and permissions are decided early rather than at submission, because that is what a review actually examines. Nobody can promise an approval.",
      },
      {
        question: "Can we scale the MVP or will we rebuild it?",
        answer:
          "It runs on the same kind of infrastructure the full product would, in a smaller configuration. What makes an MVP throwaway is usually shortcuts in the data model, so that is the part we do not rush. The features are lean and the foundation is not.",
      },
      {
        question: "How is user privacy handled at the MVP stage?",
        answer:
          "The same way it is handled later, because doing it afterwards is the expensive path. Model calls run with retention switched off, so what your first users type is processed and not kept. What you collect gets written down in week two.",
      },
      {
        question: "What does AI MVP development actually include?",
        answer:
          "One feature built properly, the backend under it, and enough interface for somebody to use it without being talked through it. It does not include the rest of the roadmap. That is the point of it rather than a limitation.",
      },
      {
        question: "Is rapid AI app development just building it badly?",
        answer:
          "It is the opposite, as long as the narrowing happens in scope and never in quality. One feature at production standard beats ten at demo standard. Only the first kind survives a user who comes back the following day to use it again.",
      },
      {
        question: "We are a small startup. Is affordable AI startup development realistic?",
        answer:
          "That is who this is for. The cost is bounded because the scope is. The plan you get at the end of week two prices the slice rather than the ambition. You decide before anybody builds.",
      },
    ],
  },

  /*
   * First child of the MVP silo, 22 August 2026, eleventh page on the
   * template. Built after its parent so the contested terms were already
   * settled.
   *
   * !! THIS PAGE DOES NOT TARGET "AI MVP development" !!
   *
   * The brief listed it as a secondary here. It is the parent's own primary
   * with one word removed, and the parent at /services/custom-ai-mvp-development
   * keeps it. Replaced with "low cost AI prototype development", which
   * docs/hitasoft_ai_architecture_strategy.md assigns to this path anyway.
   *
   * The proof of concept terms come the other way. They were a parent
   * secondary and they belong here, because a prototype and a proof of
   * concept are the same pitch and this is the page named for it.
   *
   * The title lost "MVP Development" for the same reason. It also lost the
   * second brand name the brief appended.
   *
   * !! NO TIMELINE FIGURES !!
   *
   * The comparison asked for two to four weeks against four to six months, the
   * description for "days, not months", and the H1 for "in Weeks. Not
   * Months." None of those durations has been measured for a prototype, and
   * the four to six month figure is the same unbacked shape as the six to
   * twelve months already cut from the parent. The comparison rows say what
   * each approach is for instead, which is the durable version of the claim.
   *
   * "Fractional fixed-price" went too. Nothing in the repo says the company
   * prices this way, and a pricing model is not a detail to invent on a
   * service page.
   *
   * The twelve tester beta figure is out, same as on the parent.
   *
   * The three use cases in the brief are a shared ledger, an inventory tool
   * and a community feed, which are the subjects of the two sibling children
   * and an industry page. Kept, because prototyping genuinely is horizontal,
   * but rewritten to lead on the question the prototype answers rather than
   * on the product being built. Otherwise this page reads as a summary of its
   * own siblings.
   */
  "/services/rapid-ai-prototyping": {
    path: "/services/rapid-ai-prototyping",
    metaTitle: "Rapid AI Prototyping Services | Proof of Concept",
    serviceType: "rapid AI prototyping",
    metaDescription:
      "Test the idea before you build the platform around it. Rapid AI prototyping services prove the core logic on your own data before the build. Book a review.",

    hero: {
      eyebrow: "Rapid AI prototyping",
      /*
       * The brief's H1 was "Validate Your AI Concept in Weeks. Not Months."
       * The promise is a duration nobody has measured. This makes the same
       * argument out of what gets built rather than out of how long it takes.
       */
      title: "Build the risky part first. The rest is just software.",
      lede: "There is usually one thing in an AI product that might not work, and it is rarely the interface. A prototype builds that part and nothing else, so you find out while the budget is still yours.",
      badges: ["Runs on your own data", "The wrapper survives the prototype"],
    },

    summary: {
      heading: "What rapid AI prototyping is",
      body: "Rapid AI prototyping means building the smallest working version of an AI feature to find out whether the approach holds. It is often called a proof of concept, and it exists to answer a technical question rather than to be launched. The model API, the prompt and enough interface to try it are real, and everything around them waits.",
    },

    problem: {
      heading: "Over engineering an idea nobody has tested",
      body: "The instinct with a new AI product is to build the platform first and add the intelligence at the end. That order checks the one uncertain part last. By then the answer changes what should have been built.",
      points: [
        {
          title: "The uncertain part is left until last",
          body: "Interfaces and accounts get built first, because that is known work and it feels like progress. The model that has to actually perform waits its turn.",
        },
        {
          title: "Sample data would have said so",
          body: "Most doubts are settled by a few hundred real records. That rarely happens before the architecture is fixed.",
        },
        {
          title: "The demo proved the wrong thing",
          body: "A polished mockup shows the idea is appealing. It does not show whether the model works.",
        },
      ],
    },

    capabilities: {
      heading: "The prototyping methodology",
      items: [
        {
          title: "API first, so nothing is wasted",
          body: "The wrapper around the model is written the way it would be written in production. It is the part that carries forward.",
        },
        {
          title: "The prompt and the retrieval",
          body: "Most of the work is making the model answer well on material it has never seen. That means prompt design and, where the answers live in your documents, a retrieval step.",
        },
        {
          title: "Enough interface to use it",
          body: "A plain screen somebody can put a real task through. It is deliberately unfinished.",
        },
      ],
    },

    comparison: {
      heading: "A prototype against the full build",
      body: "They answer different questions. The money goes on running the second before the first.",
      columns: ["A prototype", "The full build"],
      rows: [
        {
          label: "What it is for",
          values: ["Finding out whether the approach works", "Serving everybody who signs up"],
        },
        {
          label: "What gets built",
          values: ["The model layer and a plain screen", "Accounts, billing and the rest of it"],
        },
        {
          label: "What it runs on",
          values: ["A thin wrapper over a model API", "Infrastructure sized for real load"],
        },
        {
          label: "How it ends",
          values: ["With an answer, either way", "With a product to maintain"],
        },
        {
          label: "If the approach fails",
          values: ["You stop, having built one part", "You have already paid for all of it"],
        },
      ],
    },

    scenarios: {
      heading: "Prototypes we can build quickly",
      body: "Three questions worth settling first. In each case the prototype exists to settle one doubt.",
      items: [
        {
          system: "A shared ledger idea",
          title: "Can it read a receipt well enough?",
          body: "The doubt is whether a model reads real receipts reliably. A plain screen and a few hundred photographs settle that long before anybody builds a mobile app.",
        },
        {
          system: "An inventory idea",
          title: "Does the scanner work on real shelves?",
          body: "Vision models behave differently on a warehouse shelf. Staff try it on actual stock, and the answer decides whether the idea reaches the main system.",
        },
        {
          system: "A community feed idea",
          title: "Does moderation hold at the edges?",
          body: "The obvious cases are easy, and the borderline ones decide whether it is usable at all. The prototype runs your own rules over real posts to find where the judgement breaks.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We find the question",
          body: "Two days working out which part is actually uncertain. It is often not the part the founder expected.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the prototype and what it costs. You decide whether that answer is worth buying.",
        },
        {
          when: "From week 3",
          title: "It gets built and run on your data",
          body: "The prototype goes against real records rather than samples. What it does there is the finding.",
        },
      ],
    },

    reach: {
      heading: "What carries forward and what does not",
      body: "A prototype is allowed to be rough, but not everywhere. The parts that would be expensive to redo are written properly, right from the first day.",
      points: [
        {
          label: "The model layer carries forward",
          body: "The wrapper and the prompt go into the real build.",
        },
        {
          label: "The interface does not",
          body: "It exists to run the test.",
        },
        {
          label: "The finding is the deliverable",
          body: "You keep what was learned either way.",
        },
      ],
    },

    stack: {
      heading: "What a prototype is built from",
      body: "Small versions of what the real thing would use. Nothing here is a research tool that has to be swapped out when the product becomes real.",
      groups: [
        {
          label: "The models under test",
          items: [
            { name: "Claude", category: "Reasoning over your material", icon: "siClaude" },
            { name: "GPT", category: "Drafting and classification" },
            { name: "Vision models", category: "Where the input is an image" },
          ],
        },
        {
          label: "Making it answer well",
          items: [
            { name: "Embeddings", category: "Search across your own content" },
            { name: "pgvector", category: "Your documents, made searchable" },
            { name: "Python", category: "Evaluation against real records", icon: "siPython" },
          ],
        },
        {
          label: "Enough to try it",
          items: [
            { name: "React", category: "A plain screen to test with", icon: "siReact" },
            { name: "PostgreSQL", category: "Where the test data sits", icon: "siPostgresql" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Tenth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1,
     * 1-2-1-2, 2-1-1-2, 1-1-1-2 and 2-2-1-1. This is 1-2-1-1.
     *
     * One question in, one answer out, and the pair in between is what a
     * prototype actually consists of. The wrapper and the prompt are built
     * together rather than in sequence, which is why they sit level, and they
     * are the only accent nodes because the question and the answer are both
     * the client's.
     */
    diagram: {
      caption:
        "One uncertain thing goes in. A wrapper and a prompt are built around it, run against your own records, and what comes back is an answer you can act on.",
      align: "sequence",
      rows: [
        [{ label: "The risky part", sub: "What might not work", tone: "brand" }],
        [
          { label: "An API wrapper", sub: "Written to keep", tone: "accent" },
          { label: "A prompt that holds", sub: "Tuned on your data", tone: "accent" },
        ],
        [{ label: "Run on real records", sub: "Not samples", tone: "accent" }],
        [{ label: "An answer", sub: "Build it, or do not", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Is the prototype code thrown away?",
        answer:
          "The interface is discarded, and the model layer underneath it is the part you keep. Wrappers and prompt work are written to production standard, because they are the parts that are expensive to redo. They go straight into the full build. The screen around them was scaffolding.",
      },
      {
        question: "Can we put a prototype on the app stores?",
        answer:
          "Closed testing yes, public listing no. A prototype is built to answer a question, and a public listing needs the data handling and review work of a finished product. Going public is a separate piece of work and the prototype is what tells you whether it is worth doing.",
      },
      {
        question: "What do we need to have ready before starting?",
        answer:
          "A clear problem and some real data. The problem matters more, because most prototypes fail on a question that was never sharp enough. Sample records are usually enough to begin, and they do not have to be tidy.",
      },
      {
        question: "What is proof of concept AI development?",
        answer:
          "It is the smallest thing that settles a technical doubt. The proof of concept is not a small product, and judging it as one is the usual mistake. It is an experiment made of working software.",
      },
      {
        question: "Is low cost AI prototype development realistic?",
        answer:
          "The cost tracks the scope, and the scope here is a single question you need answered. A prototype is cheaper than a build because it leaves out everything that is not in doubt. On most products that is nearly all of it.",
      },
      {
        question: "How do we test AI application ideas cheaply?",
        answer:
          "Run the uncertain part on your own records. Almost every idea has one component carrying the risk. That alone, run on real data, tells you more than a design or a demo can.",
      },
    ],
  },

  /*
   * Second child of the MVP silo, 22 August 2026, twelfth page on the
   * template.
   *
   * !! THIS PAGE TAKES "build AI SaaS MVP", NOT "SaaS AI prototype" !!
   *
   * The brief listed the second as a secondary. Prototyping belongs to the
   * sibling at /services/rapid-ai-prototyping, which is named for it, and a
   * page that sells a shippable MVP should not be bidding on the word
   * prototype next door. "build AI SaaS MVP" was reserved for this page when
   * the parent was built and docs/hitasoft_ai_architecture_strategy.md gives
   * it to this path as well, so it fills the slot.
   *
   * "custom ledger software development" sits close to "AI ledger automation"
   * on /services/financial-data-automation. Kept, because the intents differ:
   * that page automates a ledger a business already runs, this one builds the
   * product. Watch it if either title ever moves toward the other.
   *
   * Four things in the brief were declined.
   *
   * !! "enterprise-grade security" !!
   *
   * The word is ruled out for this buyer at docs/positioning.md line 64. It
   * was in the meta description, which is exactly where it does most damage.
   *
   * !! "flawless" AND "zero errors" AND "100%" !!
   *
   * The deterministic argument underneath them is the best thing on this page
   * and it survives in full. The absolutes do not. Tested code is the right
   * architecture and it is still written by people, and the first wrong total
   * makes a liar of the word flawless.
   *
   * "Seamlessly" was in the second use case. Banned list.
   *
   * !! THE PLAY CONSOLE EXPERTISE CLAIM IS UNCONFIRMED !!
   *
   * The first FAQ asked to explain "deep familiarity with Google Play Store
   * policies". Nobody has confirmed an app shipped through review with an AI
   * feature in it, so the answer describes what the build accounts for rather
   * than a track record. Same position as the parent. The twelve tester beta
   * figure is out for the third time in this silo.
   */
  "/services/fintech-saas-ai-mvp": {
    path: "/services/fintech-saas-ai-mvp",
    /*
     * 43 characters. The brief's "Fintech & SaaS AI MVP Development" splits
     * the primary phrase with an ampersand so it no longer matches, and then
     * appends a second brand name.
     */
    metaTitle: "Fintech AI MVP Development & SaaS Platforms",
    serviceType: "fintech AI MVP development",
    metaDescription:
      "Financial software has to be right, not just finished. Fintech AI MVP development that keeps the arithmetic in code and the model on the reading. Book a review.",

    hero: {
      eyebrow: "Fintech AI MVP development",
      /*
       * The brief's H1 was "Build a Fintech MVP That Actually Scales." Scale
       * is not what a founder is frightened of on day one. Being wrong about
       * money is, and the brief's own agitation says so before the headline
       * forgets it.
       */
      title: "An app that crashes is annoying. A ledger that is wrong is fatal.",
      lede: "Financial software is held to a standard ordinary apps are not, and the first version is where that standard gets set. We build the calculating part properly and let the AI do the reading around it.",
      badges: ["Arithmetic never runs through a model", "Tenants separated from the first table"],
    },

    summary: {
      heading: "What a fintech AI MVP is",
      body: "A fintech AI MVP is a working financial product cut down to the part that has to be proven. That is usually the calculation somebody is trusting you with. The maths runs in deterministic code and the model handles the unstructured input around it, which is receipts, statements and whatever else arrives badly formatted. It is built to be shown to real users rather than to a demo audience.",
    },

    problem: {
      heading: "Where finance apps go wrong early",
      body: "Most of what sinks a financial product is decided early. The data model, where the calculating happens and how tenants are separated are all cheap to get right at the start and expensive afterwards. None of them are visible in a demo.",
      points: [
        {
          title: "The maths ended up in the wrong place",
          body: "Calculations written into the interface look fine until two clients compare their totals and find different ones. Moving them server side later touches everything.",
        },
        {
          title: "One database, everybody in it",
          body: "Tenant separation gets deferred because there is only one customer. The day there are two, it stops being a refactor.",
        },
        {
          title: "Compliance work discovered at submission",
          body: "What you collect and why has to be declared. Working that out afterwards means unpicking decisions taken in the first week of the build.",
        },
      ],
    },

    capabilities: {
      heading: "Core architecture for financial SaaS",
      items: [
        {
          title: "Deterministic maths, generative reading",
          body: "The model extracts and categorises. Every figure is calculated by tested code. That line is drawn once.",
        },
        {
          title: "Multi tenant from the first table",
          body: "Separation is designed into the schema. It costs almost nothing early and a rebuild late.",
        },
        {
          title: "Built to be submitted",
          body: "What you collect gets decided during the build. That is the part a store review actually examines.",
        },
      ],
    },

    comparison: {
      heading: "General app work against financial engineering",
      body: "Both produce something that runs. They differ on the decisions nobody sees until it matters.",
      columns: ["A general build", "Financial engineering"],
      rows: [
        {
          label: "Where the maths happens",
          values: ["In the interface, near the display", "Server side, in code with tests"],
        },
        {
          label: "How tenants are kept apart",
          values: ["One database, sorted by a column", "Separation designed into the schema"],
        },
        {
          label: "What the AI does",
          values: ["A chat box bolted on the side", "Reads the input the workflow needs"],
        },
        {
          label: "Data handling",
          values: ["A privacy policy written at the end", "Decided while the build is happening"],
        },
        {
          label: "When a total is disputed",
          values: ["Nobody can reconstruct it", "The calculation can be replayed"],
        },
      ],
    },

    scenarios: {
      heading: "SaaS and financial applications we build",
      body: "Three products where the hard part is the arithmetic. Each one starts from the calculation and works outward.",
      items: [
        {
          system: "A shared expense app",
          title: "Debt that redistributes itself",
          body: "Several people, uneven contributions and a split that has to hold when somebody leaves the group. The calculator is built and tested first.",
        },
        {
          system: "A loyalty product",
          title: "Points that have to balance",
          body: "Reward balances behave like money, and they go wrong in the same ways money does. Earning and spending run through the same audited path, so a balance can always be explained.",
        },
        {
          system: "A B2B dashboard",
          title: "Numbers a founder can defend",
          body: "Revenue and retention figures get shown to investors, which means every one of them needs a source. The dashboard reports from the ledger.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We work out what has to be right",
          body: "Two days on the calculation everything depends on. Everything else is scheduled around protecting that.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the slice and the data model. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "The calculator is built before the features",
          body: "The maths and the schema come first. Interface and AI arrive on top of a foundation that already holds up under them.",
        },
      ],
    },

    reach: {
      heading: "The line between the model and the money",
      body: "This is the decision the whole page rests on. A model is good at reading a document and the wrong tool for working out what somebody owes.",
      points: [
        {
          label: "The model reads",
          body: "Receipts and statements, and anything else code cannot parse.",
        },
        {
          label: "Code calculates",
          body: "Every total and every split, in tested code.",
        },
        {
          label: "The path is replayable",
          body: "A disputed figure traces back to what produced it.",
        },
      ],
    },

    stack: {
      heading: "What a fintech MVP is built from",
      body: "Ordinary, well understood components, chosen because a financial product is the wrong place to be the first person trying something. Nothing here is a requirement.",
      groups: [
        {
          label: "Reading what arrives",
          items: [
            { name: "Claude", category: "Statements and receipts", icon: "siClaude" },
            { name: "Vision models", category: "Photographs of paperwork" },
            { name: "Embeddings", category: "Matching a merchant to its history" },
          ],
        },
        {
          label: "The product itself",
          items: [
            { name: "Laravel", category: "The backend and the maths", icon: "siLaravel" },
            { name: "Flutter", category: "iOS and Android from one build", icon: "siFlutter" },
            { name: "React", category: "Dashboards and admin", icon: "siReact" },
          ],
        },
        {
          label: "Where the money is recorded",
          items: [
            { name: "PostgreSQL", category: "Ledgers, kept separate per tenant", icon: "siPostgresql" },
            { name: "Stripe", category: "Taking payments", icon: "siStripe" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Eleventh shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1,
     * 1-2-2-1, 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1 and 1-2-1-1. This is
     * 2-1-1-1.
     *
     * Messy input at the top and one figure at the bottom, which is what a
     * financial product is for. The two middle nodes are adjacent and separate
     * on purpose: reading and calculating are different steps done by
     * different things, and that separation is what this page sells. It ends
     * on a single node because a ledger has one right answer.
     */
    diagram: {
      caption:
        "A receipt and a bank line arrive in different shapes. The model reads both into fields, tested code works out the figures, and one ledger is updated for that tenant alone.",
      align: "sequence",
      rows: [
        [
          { label: "A receipt", sub: "Photographed", tone: "brand" },
          { label: "A bank line", sub: "From a feed", tone: "brand" },
        ],
        [{ label: "The model reads", sub: "Into named fields", tone: "accent" }],
        [{ label: "Code calculates", sub: "Tested, replayable", tone: "accent" }],
        [{ label: "One tenant's ledger", sub: "Separated by design", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Does the AI do the financial maths?",
        answer:
          "No, and that is deliberate. The model reads documents and decides categories, and every calculation runs in ordinary code with tests against it. A model that is asked for a total will produce something plausible, and plausible is not what a ledger needs.",
      },
      {
        question: "How do you handle app store review?",
        answer:
          "The data questions get answered during the build. A review looks at what you collect, why you collect it and where it goes, so those are design decisions rather than paperwork. Nobody can promise an approval, and a finance app is looked at more closely than most.",
      },
      {
        question: "Can we test with a small group before launching?",
        answer:
          "That is what the first version is for. A closed testing track puts it in front of a controlled group, which is where permissions and the awkward multi user cases actually get found. Public launch is a separate decision made after that.",
      },
      {
        question: "What does build AI SaaS MVP mean in practice?",
        answer:
          "One workflow, built properly, with real users on it. For a financial product that means the calculation and the data model are production standard from the start. The feature list stays short until the numbers are trusted.",
      },
      {
        question: "Do you do custom ledger software development?",
        answer:
          "Yes, and it is the part of this work we would rather build than inherit. A ledger written to fit the business it serves stays explainable to the person running it. One bent out of a generic package stops being explainable at the first unusual case.",
      },
      {
        question: "We want to build AI finance application features. Is that this page?",
        answer:
          "Probably not. This page is for building the product itself. Adding intelligence to finance software you already run is the sibling service, and the automation pages under workflow cover it properly.",
      },
    ],
  },

  /*
   * Third child of the MVP silo, 22 August 2026, thirteenth page on the
   * template. The silo is complete with this one.
   *
   * !! THIS BRIEF FIXED A COLLISION THE TRACKER HAD LOGGED !!
   *
   * docs/hitasoft_ai_architecture_strategy.md assigns this path the primary
   * "AI inventory management development", which /industries/retail-and-inventory
   * also carries as a secondary. docs/page-progress.md lists it as one of the
   * four phrases claimed twice. The brief proposes "smart inventory AI MVP"
   * instead, which nothing else touches, so taking the brief's word resolves
   * it rather than deferring it again.
   *
   * "AI stock prediction development" still sits near that industry page's
   * "predictive inventory AI". Different wording, same neighbourhood, and the
   * MVP framing is what keeps them apart. Worth watching if either title moves.
   *
   * Three things in the brief were declined.
   *
   * !! "6-12 months" HAS NOW BEEN PROPOSED THREE TIMES !!
   *
   * The comparison asked for six to twelve months of ERP rollout against three
   * to four weeks for an MVP. The first figure was cut from the integration
   * page and again from this silo's parent, and neither number has been
   * measured here. The rows compare what the two things are instead.
   *
   * !! SHOPIFY AND SQUARE ARE NOT NAMED !!
   *
   * The first FAQ asked to name them as POS systems the MVP pulls from.
   * Neither is in content/integrations.ts, whose warning says the list has to
   * match what has been delivered. Same position taken with Zendesk and
   * Intercom on the customer support page. The answer describes the API
   * requirement instead.
   *
   * The fourteen day stockout alert is out as well. The horizon is a setting
   * rather than a property of the software, and printing a number invites a
   * buyer to hold us to it.
   */
  "/services/smart-inventory-retail-mvp": {
    path: "/services/smart-inventory-retail-mvp",
    /*
     * 41 characters. The brief's "Smart Inventory & Retail AI MVP Development"
     * splits the primary phrase with "& Retail" so it stops matching, and then
     * appends a second brand name at 54.
     */
    metaTitle: "Smart Inventory AI MVP & Stock Prediction",
    serviceType: "smart inventory AI MVP",
    metaDescription:
      "Overstocked on one line, out of stock on another. A smart inventory AI MVP counts stock from a photograph and forecasts against real sales. Book a review.",

    hero: {
      eyebrow: "Smart inventory AI MVP",
      /*
       * The brief's H1 was "Stop Guessing Your Stock levels. Build a Smart
       * Inventory MVP." The second sentence is the service name rather than an
       * argument, and the first half of the page is stronger than that. This
       * uses the brief's own agitation, which names both failure modes and is
       * the more useful thing to lead on.
       */
      title: "Money sitting on a shelf. Money you could not sell.",
      lede: "Overstock and stockouts are the same mistake pointing in opposite directions, and both come from counting by hand and guessing at the rest. An MVP tests the forecasting on part of your catalogue.",
      badges: ["Runs on a phone camera", "Tested on one product line first"],
    },

    summary: {
      heading: "What a smart inventory AI MVP is",
      body: "A smart inventory AI MVP is a working stock tool built narrow enough to trial on part of a catalogue. A vision model reads what arrives, so a delivery is counted in from a photograph rather than typed. Forecasting then runs against your own sales history, which is what makes a restock alert worth acting on rather than another dashboard nobody opens.",
    },

    problem: {
      heading: "Counting by hand, buying on instinct",
      body: "Stock decisions get made from numbers that were accurate at the last count and have drifted since. Between counts the buying happens on memory. The cost lands twice, in capital tied up in dead lines and in sales lost on the ones that moved.",
      points: [
        {
          title: "The count is already out of date",
          body: "A cycle count is accurate on the day it happens. Every day after that, the system and the shelf move further apart from each other.",
        },
        {
          title: "Reordering runs on somebody's memory",
          body: "Whoever knows which lines move is going on experience. That knowledge leaves the building at five o'clock.",
        },
        {
          title: "Dead stock is invisible until it is counted",
          body: "Capital sitting in slow lines does not announce itself. It surfaces at valuation, long after the money went.",
        },
      ],
    },

    capabilities: {
      heading: "Core features of an intelligent stock engine",
      items: [
        {
          title: "Deliveries read by camera",
          body: "A vision model pulls codes and quantities off the packaging. Somebody photographs the delivery, and the count goes in from there without anybody keying it.",
        },
        {
          title: "Restocking that watches the rate",
          body: "Forecasting runs on how fast a line actually sells against how long a supplier takes. The alert arrives with enough time to act on it.",
        },
        {
          title: "Valuation as it moves",
          body: "Holding costs and falling value get tracked while stock sits. Capital stuck in slow lines stops being a surprise.",
        },
      ],
    },

    comparison: {
      heading: "A full ERP against an inventory MVP",
      body: "One replaces how the business runs. The other answers whether the forecasting is worth having.",
      columns: ["A full ERP", "An inventory MVP"],
      rows: [
        {
          label: "What it changes",
          values: ["How the whole business operates", "One product line, beside what you run"],
        },
        {
          label: "Getting stock in",
          values: ["Typed, or scanned with bought hardware", "Photographed on a phone"],
        },
        {
          label: "Deciding a reorder",
          values: ["A reorder point somebody set once", "A rate that is recalculated as it sells"],
        },
        {
          label: "What you commit",
          values: ["Licences and a rollout across the company", "One catalogue slice you can stop"],
        },
        {
          label: "If it does not suit you",
          values: ["You are already migrated onto it", "You switch it off and keep the finding"],
        },
      ],
    },

    scenarios: {
      heading: "Inventory automation in practice",
      body: "Three jobs a stockroom already does badly by hand. Each is narrow enough to trial on its own.",
      items: [
        {
          system: "Your goods in",
          title: "Serial numbers off a box",
          body: "Electronics arrive with long serials and codes that get mistyped. A phone camera reads them off the packaging, and the row lands in the database with nobody keying it.",
        },
        {
          system: "Your reordering",
          title: "A draft order before the gap",
          body: "The engine watches selling rate against supplier lead time. When those cross it drafts the order.",
        },
        {
          system: "Your valuation",
          title: "What the slow lines are costing",
          body: "Holding cost and falling value are tracked per line. The dashboard shows where capital is stuck while there is still time to move it.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We look at how stock moves now",
          body: "Two days in the stockroom rather than in a meeting. Counting, receiving and reordering all get watched as they happen.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the lines to trial and the cost. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It runs on one slice of the catalogue",
          body: "The MVP goes live beside your existing system. Nothing is switched off yet.",
        },
      ],
    },

    reach: {
      heading: "How far an MVP goes",
      body: "This is deliberately not a system replacement. It is the smallest thing that shows whether AI forecasting is worth having in your stockroom.",
      points: [
        {
          label: "It runs beside what you have",
          body: "Nothing is migrated and nothing is switched off.",
        },
        {
          label: "It starts on one slice",
          body: "One category or one supplier, chosen so the answer generalises.",
        },
        {
          label: "The backend carries forward",
          body: "The logic and the wrappers go into a full build.",
        },
      ],
    },

    stack: {
      heading: "What an inventory MVP is built from",
      body: "Ordinary components in a small configuration. Nothing here is a requirement, and the work goes ahead against whatever your stock system was built on.",
      groups: [
        {
          label: "Reading the shelf",
          items: [
            { name: "Vision models", category: "Codes and serials off a box" },
            { name: "Claude", category: "Matching a product to your catalogue", icon: "siClaude" },
            { name: "Flutter", category: "The phone app that does the scanning", icon: "siFlutter" },
          ],
        },
        {
          label: "Working out what to buy",
          items: [
            { name: "Python", category: "Forecasting against your sales", icon: "siPython" },
            { name: "PostgreSQL", category: "Stock levels and history", icon: "siPostgresql" },
            { name: "Redis", category: "Alerts and scheduling", icon: "siRedis" },
          ],
        },
        {
          label: "Where you look at it",
          items: [
            { name: "React", category: "The dashboard", icon: "siReact" },
            { name: "n8n", category: "What happens when a line runs low", icon: "siN" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Twelfth shape, and the last one this silo needs. Shipped so far: 1-2-2,
     * 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1, 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1,
     * 1-2-1-1 and 2-1-1-1. This is 2-1-2-2.
     *
     * The bottom two rows are why. This page's problem has two symmetric
     * halves, overstock and stockout, and they need different actions. A
     * diagram that resolved into one node would have drawn a single failure
     * where the copy argues there are two facing opposite ways.
     */
    diagram: {
      caption:
        "A delivery and your sales feed both come in. One picture of stock comes out of them, and it shows both the lines running out and the lines nothing is happening to.",
      align: "sequence",
      rows: [
        [
          { label: "A delivery", sub: "Photographed", tone: "brand" },
          { label: "Your sales", sub: "As they happen", tone: "brand" },
        ],
        [{ label: "One stock picture", sub: "Counted and current", tone: "accent" }],
        [
          { label: "Running out", sub: "Selling faster than lead time", tone: "accent" },
          { label: "Not moving", sub: "Capital sitting still", tone: "accent" },
        ],
        [
          { label: "A draft order", sub: "Waiting for a signature", tone: "brand" },
          { label: "A line to clear", sub: "Money you can free", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Can it connect to our point of sale system?",
        answer:
          "The MVP reads sales from your POS through its API. That covers the common hosted tills and it covers something built for you years ago. Where there is no API we look at what it can export before proposing anything.",
      },
      {
        question: "Do we need to buy scanning hardware?",
        answer:
          "Not for a trial. A phone camera and a vision model read codes off a box well enough to prove whether the approach works. Dedicated scanners are faster at volume, and that is a decision worth making after the MVP rather than before it.",
      },
      {
        question: "How do we get from MVP to full system?",
        answer:
          "The forecasting logic and the API wrappers are written to production standard from the outset. You widen the catalogue and add features. The dashboard is the part most likely to be rebuilt, and it is the cheapest part to redo.",
      },
      {
        question: "What is a retail inventory management prototype for?",
        answer:
          "It answers one question, which is whether forecasting on your own data beats the way you buy now. It is deliberately not a replacement system. It runs beside what you have. That is what makes the comparison honest.",
      },
      {
        question: "Does AI stock prediction development work on a small catalogue?",
        answer:
          "It works better on a slow catalogue than people expect, because lead times matter more than volume. What it needs is history rather than scale. A year of sales on a few hundred lines is usually enough to test the idea.",
      },
      {
        question: "Is a custom ERP MVP cheaper than buying a system?",
        answer:
          "For a trial, yes, because the scope is one slice rather than the whole company. That is the wrong comparison though. The MVP tells you whether the forecasting earns its keep, and then buying or building is a decision with evidence behind it.",
      },
    ],
  },

  /*
   * Silo 4's parent, 22 August 2026, fourteenth page on the template. Built
   * from the second version of docs/service-pages.md.
   *
   * That version is a better brief than the ones before it. No invented
   * percentages, no durations and no model version numbers, which were the
   * three things cut repeatedly from the earlier batch.
   *
   * Three things still changed.
   *
   * !! "enterprise security standards" !!
   *
   * The third FAQ asked to reiterate them. The word is ruled out for this
   * buyer at docs/positioning.md line 64, and the substance is better served
   * by saying what is actually configured, which is retention off on the model
   * endpoints. Same answer the secure page gives.
   *
   * !! NOTHING IS PREDICTED "exactly" !!
   *
   * The second use case asked to say the model predicts exactly when a
   * component will stock out. A forecast that claims exactness is a forecast
   * nobody should trust, and on this page of all pages the credibility comes
   * from admitting the error bar. The diagram ends on a confidence node for
   * the same reason.
   *
   * The title lost "| Hitasoft", which app/layout.tsx already appends, and
   * gained "Services" so the primary keyword matches rather than stems. Every
   * title in this file has the same two problems.
   *
   * !! WATCH THE BI CHILD WHEN IT IS BUILT !!
   *
   * /services/predictive-analytics-bi is briefed with the secondary
   * "predictive analytics integration", which shares its head term with this
   * page's primary. Not an exact collision and worth a look before that page
   * ships. Rule one in docs/seo-standards.md.
   */
  "/services/ai-data-predictive-analytics": {
    path: "/services/ai-data-predictive-analytics",
    metaTitle: "AI Predictive Analytics Services & Forecasting",
    serviceType: "AI predictive analytics",
    metaDescription:
      "Your dashboard says what already happened. AI predictive analytics services forecast what sells next and which accounts are about to leave. Book a review.",

    hero: {
      eyebrow: "AI predictive analytics",
      /*
       * The brief's H1 was "Stop Looking at Last Month. Predict Your Next
       * Quarter." The shape is good and the second half promises a quarter
       * nobody has committed to. This keeps the contrast and puts the promise
       * on what the data is doing rather than on a horizon.
       */
      title: "Your data already knows. Nobody has asked it yet.",
      lede: "Most businesses have years of history sitting in systems that only ever report it back to them. The same records can say what is likely to happen next, which is a different question and a more useful one.",
      badges: ["Runs on your own history", "Every forecast carries a confidence"],
    },

    summary: {
      heading: "What AI predictive analytics is",
      body: "AI predictive analytics reads a business's own history and estimates what happens next, rather than summarising what already did. A pattern that holds across thousands of past records becomes the basis for a forecast. Each comes with a measure of how certain it is. Reporting answers what happened. This answers what is likely to.",
    },

    problem: {
      heading: "Reports full of yesterday",
      body: "Most companies have more data than they can read and less direction than they need. The dashboards are accurate and they describe a month that has already been paid for. Nothing in them says which line to reorder or which customer is about to leave.",
      points: [
        {
          title: "The charts describe the past",
          body: "A dashboard tells you what happened and leaves the interpreting to whoever happens to be looking. Two people read the same chart differently.",
        },
        {
          title: "The signal is buried in the join",
          body: "What matters usually sits between systems rather than inside one. Sales history alone does not show it.",
        },
        {
          title: "Nobody trusts a number they cannot question",
          body: "A forecast with no confidence attached gets ignored. That is the correct response to it.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of forecasting",
      items: [
        {
          title: "Getting the data usable",
          body: "History arrives spread across systems, and half of it is inconsistent with the other half. Cleaning and joining it is most of the work, and skipping it is why forecasting projects fail.",
        },
        {
          title: "Patterns across the whole history",
          body: "The model looks for what tends to precede an outcome, across every record rather than a sample. Seasonality and slow trends both show up here.",
        },
        {
          title: "A number somebody can act on",
          body: "A forecast reaches whoever decides, with its confidence beside it. A prediction nobody sees changes nothing.",
        },
      ],
    },

    comparison: {
      heading: "Reporting against forecasting",
      body: "Both read the same records. They answer different questions.",
      columns: ["A BI dashboard", "Predictive analytics"],
      rows: [
        {
          label: "The question it answers",
          values: ["What happened", "What is likely to happen"],
        },
        {
          label: "What it looks at",
          values: ["The totals, by period", "Patterns across every record"],
        },
        {
          label: "What comes out",
          values: ["A chart to interpret", "An estimate with a confidence on it"],
        },
        {
          label: "Who does the thinking",
          values: ["Whoever is reading the chart", "The reading is done, the decision is not"],
        },
        {
          label: "When it is wrong",
          values: ["Nobody notices", "The confidence said it might be"],
        },
      ],
    },

    scenarios: {
      heading: "Predictive AI in the real world",
      body: "Three forecasts a business can act on the same week. Each is built from records the company already holds.",
      items: [
        {
          system: "Your subscription data",
          title: "Accounts that are about to leave",
          body: "Cancellation is rarely a surprise in the data. Onboarding behaviour and support history together flag accounts worth a call while there is still time.",
        },
        {
          system: "Your stock history",
          title: "The line that runs out next",
          body: "Sales rate and lead time decide when a gap appears. A forecast puts a date range on it, so buying happens before the shelf is empty.",
        },
        {
          system: "Your expense records",
          title: "What next month costs",
          body: "Recurring bills and seasonal spend are both predictable from history. A business sees the squeeze coming.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We look at the data you actually have",
          body: "Two days on where records live. This step usually decides whether forecasting is realistic.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the first forecast and what it costs. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It runs against history first",
          body: "A forecast is tested on records with known outcomes. That is how you find out before trusting it.",
        },
      ],
    },

    reach: {
      heading: "What a forecast is worth",
      body: "A prediction is only useful if somebody can tell how much of it to trust. That is a design decision.",
      points: [
        {
          label: "Tested against known outcomes",
          body: "Run on old records first, where the answer is known.",
        },
        {
          label: "Confidence travels with it",
          body: "Every estimate says how sure it is. Low confidence is a result.",
        },
        {
          label: "Your data stays yours",
          body: "Model endpoints run with retention off.",
        },
      ],
    },

    stack: {
      heading: "What the forecasting is built from",
      body: "Statistical modelling handles the numbers. Language models handle the mess around them. Nothing here is a requirement, and the work goes ahead against whatever your systems were built on.",
      groups: [
        {
          label: "Working the numbers",
          items: [
            { name: "Python", category: "Modelling and evaluation", icon: "siPython" },
            { name: "PostgreSQL", category: "History, joined up", icon: "siPostgresql" },
            { name: "Redis", category: "Scheduling the runs", icon: "siRedis" },
          ],
        },
        {
          label: "Reading the unstructured half",
          items: [
            { name: "Claude", category: "Notes, tickets and free text", icon: "siClaude" },
            { name: "GPT", category: "Classification and labelling" },
            { name: "Embeddings", category: "Grouping what belongs together" },
          ],
        },
        {
          label: "Where it comes out",
          items: [
            { name: "React", category: "Dashboards people act on", icon: "siReact" },
            { name: "n8n", category: "Alerts when something changes", icon: "siN" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Thirteenth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1,
     * 1-2-2-1, 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1, 1-2-1-1, 2-1-1-1 and
     * 2-1-2-2. This is 1-1-2-2.
     *
     * The bottom pair is the argument and it is why the brief's "predict
     * exactly" had to go. A forecast and its confidence arrive together, and
     * drawing them as one node would have said the opposite of what this page
     * is careful to say in words.
     */
    diagram: {
      caption:
        "Your own history is cleaned and joined. The model weighs what usually happens against what is different this time, and a forecast comes out with a confidence beside it.",
      align: "sequence",
      rows: [
        [{ label: "Your history", sub: "Years of it", tone: "brand" }],
        [{ label: "Cleaned and joined", sub: "Across your systems", tone: "accent" }],
        [
          { label: "What usually happens", sub: "The pattern", tone: "accent" },
          { label: "What is different now", sub: "The current signal", tone: "accent" },
        ],
        [
          { label: "A forecast", sub: "What is likely", tone: "brand" },
          { label: "How sure it is", sub: "Reported, not hidden", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Our data is messy and spread across several tools. Does that rule us out?",
        answer:
          "It is the normal starting position and it is the first part of the work. Records get pulled from whatever holds them, cleaned and joined into one history before any modelling happens. That step is where forecasting projects usually go wrong.",
      },
      {
        question: "Which models do you use for forecasting?",
        answer:
          "Numerical forecasting uses statistical methods. The unstructured material goes to a language model. Forecasting a quantity is a numerical problem, so a model that predicts text is the wrong tool for it. Claude and GPT read. Tested code does the arithmetic.",
      },
      {
        question: "Is our historical business data safe?",
        answer:
          "It is processed and not kept. Model endpoints run with retention switched off, so your records do not reach the pipeline that trains a public model. Where the history cannot leave your network at all, the modelling runs on your own hardware.",
      },
      {
        question: "How accurate will the forecast be?",
        answer:
          "Nobody can answer that before seeing the data, which is why the first thing built is a test against history you already have. Running it on records where the outcome is known tells you the accuracy on your own business rather than on somebody's case study.",
      },
      {
        /*
         * The brief spells this secondary "predictive ROI modeling". The site
         * is written in British English and uses "modelling" eight times to
         * one, so the question carries the British spelling. Search treats the
         * two as the same word, and breaking a spelling convention across a
         * site to chase an exact match trades something real for something
         * that is not.
         */
        question: "Do you do predictive ROI modelling?",
        answer:
          "Yes, where the history supports it. The return on a campaign or a product line forecasts the same way demand does, because both are patterns in your own records. What it needs is enough past examples to learn from.",
      },
      {
        question: "What is business data forecasting AI good at?",
        answer:
          "Anything that repeats with enough history behind it. Demand, churn and seasonal spend all qualify. One off events and things with no precedent in your records do not, and a forecast that claims otherwise is guessing with a chart attached.",
      },
      {
        question: "Can machine learning data analytics work on a small business?",
        answer:
          "Volume matters less than history. A few years of consistent records beats a few months of high volume, because a pattern needs time to repeat. Most businesses trading a while have more than they think.",
      },
    ],
  },

  /*
   * First child of the analytics silo, 22 August 2026, fifteenth page on the
   * template.
   *
   * !! TWO PRODUCT NAMES CAME OUT OF THE USE CASES !!
   *
   * The brief names "Zedger" and a "Gadgetly-style" retail product as example
   * builds. Neither appears anywhere in this repository: not in the case
   * studies, not in the testimonials, not in content/. docs/positioning.md
   * line 215 is unambiguous, no client names on companies that are not
   * confirmed clients, and it exists because the original template shipped
   * invented ones. If they are real clients they can be named once somebody
   * confirms it and the case study exists. Until then the use cases describe
   * the product type, which is what they needed to do anyway.
   *
   * Three other things changed.
   *
   * "enterprise data forecasting" was in the meta description. Banned for this
   * buyer at docs/positioning.md line 64.
   *
   * "Most companies pay thousands of dollars for BI software" opened the
   * agitation. It is a figure about somebody else's pricing and nobody here
   * has checked it. The point survives without a number.
   *
   * "Months of database mapping" was the setup time row in the comparison.
   * Same unbacked duration shape cut from four earlier briefs. The row
   * compares what each thing is built on instead.
   *
   * !! ON "predictive analytics integration" !!
   *
   * Flagged when the parent shipped, because the parent owns "AI predictive
   * analytics services" and the two share a head term. Kept here after
   * looking: the modifiers differ and so does the intent, since the parent
   * sells the practice and this page sells wiring it into a dashboard. The
   * parent's exact phrase is verified absent from this page's title and
   * description. If either title ever drifts toward the other, this is the
   * pair to re-examine.
   */
  "/services/predictive-analytics-bi": {
    path: "/services/predictive-analytics-bi",
    /*
     * 48 characters. The brief's "Predictive AI Business Intelligence"
     * reorders the primary phrase so it stops matching, then appends a second
     * brand name at 59.
     */
    metaTitle: "Predictive Business Intelligence AI & Dashboards",
    serviceType: "predictive business intelligence",
    metaDescription:
      "A dashboard that only reports is half a tool. Predictive business intelligence AI forecasts from your own records and says what moved and why. Book a review.",

    hero: {
      eyebrow: "Predictive business intelligence",
      /*
       * The brief's H1 was "Upgrade Your BI Dashboards from Reporting to
       * Predicting." Accurate, and it is the service description rather than
       * an argument. The rear view mirror line further down the brief is the
       * better idea, so it moves up here.
       */
      title: "A dashboard is a rear view mirror. Ask it what is ahead.",
      lede: "Reporting tools answer what happened and stop there, which leaves the interpreting to whoever is looking. The same data can answer what is likely next, and say which of last month's numbers actually moved the result.",
      badges: ["Sits on the database you already have", "Answers in plain English"],
    },

    summary: {
      heading: "What AI powered business intelligence is",
      body: "Predictive business intelligence AI puts forecasting and plain language querying into the dashboard people already open. Rather than clicking filters to assemble a view, somebody types the question they actually have and gets an answer built from the same records. The forecasting sits beside the reporting, so what happened and what is likely appear together.",
    },

    problem: {
      heading: "Charts nobody acts on",
      body: "Companies buy reporting software and open it once a month. The charts are correct and they describe a quarter that has already been paid for. A new question means asking somebody who knows the schema.",
      points: [
        {
          title: "Every new question is a ticket",
          body: "The dashboard answers what it was built to answer. Anything else waits for whoever writes the queries.",
        },
        {
          title: "Alerts that only say a number moved",
          body: "A threshold alarm tells you revenue fell. It does not say which segment, or whether this has ever happened before on this line.",
        },
        {
          title: "The trendline is a straight guess",
          body: "Most reporting tools forecast by drawing the last line onward. That is arithmetic with optimism attached.",
        },
      ],
    },

    capabilities: {
      heading: "The components of a smart BI dashboard",
      items: [
        {
          title: "Forecasts with more than one variable",
          body: "Charts show what is likely next rather than only what happened, weighing several factors at once. Each projection carries a confidence rather than a single line.",
        },
        {
          title: "Ask it in plain English",
          body: "Somebody types their question. The system turns it into a query. Nobody needs the schema or any SQL.",
        },
        {
          title: "Reports that explain themselves",
          body: "A scheduled summary says what changed and what seems to have caused it, in one place. An alert that names the cause gets acted on.",
        },
      ],
    },

    comparison: {
      heading: "A reporting tool against predictive BI",
      body: "Both read the same database. What separates them is what you can ask.",
      columns: ["A reporting tool", "Predictive BI"],
      rows: [
        {
          label: "Getting a new answer",
          values: ["Build a view, or raise a ticket", "Type the question"],
        },
        {
          label: "What the forecast is",
          values: ["The last trend, extended", "A model weighing several variables"],
        },
        {
          label: "What an alert says",
          values: ["A number crossed a threshold", "What changed, and what moved with it"],
        },
        {
          label: "Who can use it",
          values: ["Whoever understands the schema", "Whoever has the question"],
        },
        {
          label: "What it is built on",
          values: ["Its own copy of your data", "The database you already run"],
        },
      ],
    },

    /*
     * The brief's use cases named two products as examples. See the note above
     * this entry. These describe the same three product types without
     * attaching anybody's name to work that has not been confirmed.
     */
    scenarios: {
      heading: "Predictive BI in action",
      body: "Three dashboards built around a number nobody asked for. Each reads a database the business already runs.",
      items: [
        {
          system: "A subscription product",
          title: "Churn showing before it happens",
          body: "Product usage and support history flag accounts drifting toward cancellation. The dashboard lists them early enough to matter.",
        },
        {
          system: "A retail stock system",
          title: "Capital, shown where it is stuck",
          body: "Holding cost and falling value get plotted against sales rate. A founder sees which shelves are absorbing the money.",
        },
        {
          system: "A marketing function",
          title: "Which content actually returned",
          body: "Spend and pipeline are read together. The dashboard shows which topics produced business, which is a different list from the one that produced traffic.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We look at the questions nobody can answer",
          body: "Two days with the people who read the reports. The gap between what they get and what they need is the specification for this.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the first views and forecasts. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It goes on top of your database",
          body: "The layer reads what you already store. Your existing reporting keeps working throughout.",
        },
      ],
    },

    reach: {
      heading: "Where your data stays",
      body: "A BI layer sees everything a business has, which makes the handling question sharper here than on most pages. It is settled before anything is built.",
      points: [
        {
          label: "It reads, it does not move",
          body: "The layer queries your database in place.",
        },
        {
          label: "Questions leave, records do not",
          body: "The model sees the question and the schema.",
        },
        {
          label: "Retention stays off",
          body: "Anything reaching a model endpoint is processed and not kept.",
        },
      ],
    },

    stack: {
      heading: "What the BI layer is built from",
      body: "It sits on top of what you already store. Nothing here is a requirement, and the work goes ahead against whatever your data currently lives in.",
      groups: [
        {
          label: "Where your data already is",
          items: [
            { name: "PostgreSQL", category: "Read in place, not copied", icon: "siPostgresql" },
            { name: "MySQL", category: "If that is what you run", icon: "siMysql" },
            { name: "Redis", category: "Caching the heavy queries", icon: "siRedis" },
          ],
        },
        {
          label: "Turning questions into queries",
          items: [
            { name: "Claude", category: "Plain English to SQL", icon: "siClaude" },
            { name: "GPT", category: "Summaries and explanations" },
            { name: "Python", category: "The forecasting underneath", icon: "siPython" },
          ],
        },
        {
          label: "What people look at",
          items: [
            { name: "React", category: "The dashboard itself", icon: "siReact" },
            { name: "n8n", category: "Scheduled reports and alerts", icon: "siN" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Fourteenth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1,
     * 1-2-2-1, 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1, 1-2-1-1, 2-1-1-1, 2-1-2-2
     * and 1-1-2-2. This is 2-2-2-1.
     *
     * Two ways in at the top, because a dashboard is used both by somebody
     * asking and by something noticing. The third row is the argument: a
     * number on its own is what a reporting tool already gives you, and the
     * reason beside it is what this page is selling. They resolve into one
     * screen because that is where both end up.
     */
    diagram: {
      caption:
        "Somebody asks a question, or a number moves by itself. Either becomes a query against your database, and what comes back is the figure together with what moved it.",
      align: "sequence",
      rows: [
        [
          { label: "You ask in English", sub: "No schema needed", tone: "brand" },
          { label: "A number moves", sub: "Noticed, not alarmed", tone: "brand" },
        ],
        [
          { label: "Turned into a query", sub: "Against your own tables", tone: "accent" },
          { label: "Checked against history", sub: "Has this happened before", tone: "accent" },
        ],
        [
          { label: "The figure", sub: "What it is", tone: "accent" },
          { label: "The reason", sub: "What moved it", tone: "accent" },
        ],
        [{ label: "Your dashboard", sub: "Both, together", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Do we have to move off our current database?",
        answer:
          "No. The layer is built on top of what you already store, reading it in place. Migrating a database to get better reporting is a large project to solve a problem that does not require it.",
      },
      {
        question: "Can people who do not write SQL use it?",
        answer:
          "That is most of the point. Somebody types the question in plain English and the system turns it into a query against your schema. The answer arrives with the query it ran, so anybody who does know SQL can check what it did.",
      },
      {
        question: "How safe is our business data with a model involved?",
        answer:
          "The model sees the question and the shape of your database rather than the contents of it. Queries run against your own tables. Endpoints run with retention off.",
      },
      {
        question: "What are AI BI dashboards actually doing differently?",
        answer:
          "Two things. Anybody can ask a question without knowing how the data is arranged, and the forecasting weighs several variables rather than extending the last line. Everything else about a dashboard stays as it was.",
      },
      {
        question: "Is predictive analytics integration possible with our current reporting?",
        answer:
          "Often yes, and it is worth checking before replacing anything. Where there is an API, the forecasting feeds into your existing tool rather than replacing it. Otherwise the layer runs beside it.",
      },
      {
        question: "Do smart data visualization tools need clean data first?",
        answer:
          "Cleaner than most businesses expect, but not perfect. Inconsistent records are the normal starting point, and the first fortnight is where that gets assessed honestly rather than discovered later.",
      },
    ],
  },

  /*
   * Second child of the analytics silo, 22 August 2026, sixteenth page on the
   * template.
   *
   * !! NOTHING HERE IS "hallucination-free" !!
   *
   * The brief promises it twice, in the meta description and in the direct
   * answer block. Retrieval reduces hallucination and does not remove it, and
   * this site already says so in the right way: the customer support page
   * explains that an answer not in your documentation is not one the model can
   * give, and that where nothing matches it escalates. Publishing an absolute
   * here would contradict a page one click away and would be wrong on its own
   * terms. The claim is made the way that page makes it.
   *
   * !! PINECONE IS NOT NAMED !!
   *
   * The brief puts it in an H3 beside pgvector. pgvector is vetted in
   * content/integrations.ts and already ships on three pages. Pinecone is not
   * in that file at all, and its warning says the list has to match what has
   * actually been delivered. Same position as Zendesk, Intercom, Shopify and
   * Square. Name it once somebody confirms a build.
   *
   * "Enterprise" appeared twice, in a section heading and in the second FAQ.
   * Ruled out at docs/positioning.md line 64.
   *
   * !! THE THIRD USE CASE LOST ITS REGULATED PROFESSIONS !!
   *
   * It asked to describe medical and legal professionals searching past
   * consultations under "strict data safety compliance". Storing transcripts
   * for those professions carries obligations nobody here has confirmed we
   * meet, and docs/positioning.md line 213 rules out naming compliance we
   * cannot back. The scenario keeps the architecture, which is the part this
   * page can actually speak to, and drops the professions and the compliance.
   *
   * "Always synced" and "highly accurate" both went as well. A pipeline runs
   * on a schedule and is therefore current as of the last run, which is a more
   * useful thing to tell somebody than an absolute.
   */
  "/services/data-engineering-vector-databases": {
    path: "/services/data-engineering-vector-databases",
    /*
     * 42 characters. The brief's "Vector DB Development" abbreviates the
     * primary phrase out of existence and drops "Services", then appends a
     * second brand name.
     */
    metaTitle: "Vector Database Development Services & RAG",
    serviceType: "vector database development",
    metaDescription:
      "Good AI is mostly good data engineering. Vector database development services turn your PDFs and tickets into something a model can search. Book a review.",

    hero: {
      eyebrow: "Vector database development",
      /*
       * The brief's H1 was "Your AI is Only as Smart as Your Data. We Build
       * the Plumbing." The first half is a truism every vendor writes and the
       * second is the better half. This keeps the plumbing idea and puts the
       * specific failure in front of it.
       */
      title: "The model is not the hard part. Finding the right page is.",
      lede: "An assistant that answers well sits on documents somebody prepared. Pointing a model at a shared drive gets you confident answers drawn from whatever happened to match.",
      badges: ["Runs inside your own database", "Answers cite the passage they came from"],
    },

    summary: {
      heading: "What AI data engineering is",
      body: "AI data engineering turns the material a business already has into something a model can search by meaning rather than by keyword. Documents are split into passages, and each passage becomes a vector that can be compared against a question. The pipeline that keeps doing this as new documents arrive is most of the work. It decides whether answers stay good.",
    },

    problem: {
      heading: "The model was never the bottleneck",
      body: "Teams connect a model to their files and get answers that sound right and cite nothing. The problem is almost never the model. It is that nothing has decided which passage should have been retrieved before the question was asked.",
      points: [
        {
          title: "Keyword search misses the question",
          body: "Somebody asks about a refund window. The document says returns period. A keyword index finds neither for the other.",
        },
        {
          title: "The documents were never prepared",
          body: "A PDF split at page boundaries cuts sentences in half. What gets retrieved is a fragment that answers nothing.",
        },
        {
          title: "It goes stale the week after launch",
          body: "The index is built once and the documents keep changing. Answers drift away from the truth quietly.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of an AI ready backend",
      items: [
        {
          title: "Pipelines that keep running",
          body: "Material is pulled from wherever it lives, then cleaned and loaded on a schedule you set. New documents reach the index unprompted.",
        },
        {
          title: "Chunked where the meaning breaks",
          body: "Documents are split on their own structure. A passage that ends mid argument retrieves badly.",
        },
        {
          title: "Vectors in the database you run",
          body: "pgvector puts vector search inside your existing PostgreSQL. One database to back up.",
        },
      ],
    },

    comparison: {
      heading: "A SQL query against a vector search",
      body: "They are not rivals and they answer different questions. Most systems end up needing both.",
      columns: ["SQL search", "Vector search"],
      rows: [
        {
          label: "What it matches on",
          values: ["The characters you typed", "What the passage means"],
        },
        {
          label: "What it holds",
          values: ["Rows and columns", "Text, and what it is about"],
        },
        {
          label: "A question in other words",
          values: ["Finds nothing", "Finds the passage anyway"],
        },
        {
          label: "What it is good at",
          values: ["Totals, filters and exact lookups", "Retrieval for a model to answer from"],
        },
        {
          label: "Where it lives",
          values: ["Your database", "Also your database, with pgvector"],
        },
      ],
    },

    scenarios: {
      heading: "Vector search in real workflows",
      body: "Three sets of documents a business already has. Each becomes answerable rather than merely stored.",
      items: [
        {
          system: "Supplier documentation",
          title: "Specifications nobody can find",
          body: "Thousands of supplier PDFs sit in a folder, holding the voltages and compatibility notes nobody can find. Staff ask in their own words and get the paragraph, rather than a list of files to open.",
        },
        {
          system: "Financial records",
          title: "History a model can reason over",
          body: "Receipts and ledger entries are embedded beside the documents that explain them, in one store. A new transaction gets classified from similar ones.",
        },
        {
          system: "Recorded calls",
          title: "Transcripts that become searchable",
          body: "Audio is transcribed, chunked and embedded into a store that sits apart from everything else. Past conversations become searchable by subject.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We look at what you actually hold",
          body: "Two days on where the material lives. Document quality decides more here than model choice does.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the first sources and the cost. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "One source, measured before the next",
          body: "The first corpus goes in. Retrieval is tested against questions you supply. More sources before that is how these go wrong.",
        },
      ],
    },

    reach: {
      heading: "Where your material sits",
      body: "This work touches everything a company has written down, so where it ends up matters more than usual. It is decided before the first pipeline runs.",
      points: [
        {
          label: "In your own database",
          body: "pgvector keeps the vectors beside the records they came from.",
        },
        {
          label: "Retrieval is auditable",
          body: "You can see which passages were returned for any question.",
        },
        {
          label: "Nothing is kept by a model",
          body: "Embedding endpoints run with retention off.",
        },
      ],
    },

    stack: {
      heading: "What the pipeline is built from",
      body: "Standard components, chosen so nothing needs replacing later. Nothing is a requirement, and the work goes ahead against whatever your systems were built on.",
      groups: [
        {
          label: "Where the vectors live",
          items: [
            { name: "pgvector", category: "Vector search inside PostgreSQL" },
            { name: "PostgreSQL", category: "The database you already run", icon: "siPostgresql" },
            { name: "Redis", category: "Caching the frequent lookups", icon: "siRedis" },
          ],
        },
        {
          label: "Turning documents into vectors",
          items: [
            { name: "Embeddings", category: "The representation itself" },
            { name: "Claude", category: "Reading and structuring documents", icon: "siClaude" },
            { name: "Whisper", category: "Audio into text first" },
          ],
        },
        {
          label: "Keeping it current",
          items: [
            { name: "Python", category: "The pipeline and its tests", icon: "siPython" },
            { name: "n8n", category: "What runs when a document lands", icon: "siN" },
            { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
          ],
        },
      ],
    },

    /*
     * Fifteenth shape. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1,
     * 1-2-2-1, 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1, 1-2-1-1, 2-1-1-1, 2-1-2-2,
     * 1-1-2-2 and 2-2-2-1. This is 2-2-1-2.
     *
     * The pair at the bottom is the argument the third problem card makes.
     * A store on its own goes stale, so the thing that keeps it current sits
     * beside it rather than being assumed. Ending on a single node would have
     * drawn a project that finishes, which is exactly the misunderstanding
     * this page is trying to correct.
     */
    diagram: {
      caption:
        "Documents and transcripts come in from wherever they live. They are cleaned, split where the meaning breaks and embedded, and the result sits in your own database with a pipeline keeping it current.",
      align: "sequence",
      rows: [
        [
          { label: "Your documents", sub: "PDFs and manuals", tone: "brand" },
          { label: "Your transcripts", sub: "Tickets and calls", tone: "brand" },
        ],
        [
          { label: "Cleaned", sub: "Whatever shape it arrived in", tone: "accent" },
          { label: "Split by meaning", sub: "Not by page", tone: "accent" },
        ],
        [{ label: "Embedded", sub: "Comparable to a question", tone: "accent" }],
        [
          { label: "In your database", sub: "pgvector, beside the records", tone: "brand" },
          { label: "Kept current", sub: "The pipeline keeps running", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Can you add vector search to our existing database?",
        answer:
          "Usually, and it is the first thing worth trying. pgvector adds vector search to a PostgreSQL database you already run, so there is one system to back up and your material does not move. A separate vector store earns its keep at volumes most businesses will never reach in practice.",
      },
      {
        question: "Which embedding models do you use?",
        answer:
          "It depends on the material and where it may go. Hosted embedding endpoints are the usual choice. Where documents cannot leave your network, an open weight model produces the vectors on your own hardware instead.",
      },
      {
        question: "Will the AI still make things up?",
        answer:
          "Retrieval makes it much less likely. It does not make it impossible. Good data engineering buys you two things. The model answers from passages it was handed rather than from memory, and you can see which ones. Where nothing relevant comes back, saying so is correct.",
      },
      {
        question: "How do you handle documents that keep changing?",
        answer:
          "The pipeline runs on a schedule rather than once. New and changed material is picked up, re-chunked and re-embedded, so the index is current as of the last run. How often it runs is a decision about cost.",
      },
      {
        question: "What is RAG data architecture?",
        answer:
          "It is the half of a RAG system that is not the model itself, and it does most of the work. Storage, chunking and retrieval all sit here. They decide answer quality far more than the model does.",
      },
      {
        question: "Do you handle unstructured data vectorization for audio and images?",
        answer:
          "Yes. Audio is transcribed first and then treated as text. Images are handled by a vision model that describes them, so what gets embedded is a description somebody could also read.",
      },
    ],
  },

  /*
   * Third child of the analytics silo, 23 August 2026, seventeenth page on the
   * template. The analytics silo is complete with this page.
   *
   * !! THE MOST ABSOLUTE HEAVY BRIEF IN THE SET !!
   *
   * "Catch Every Defect" as the H1, "eliminate human error" in the
   * description, "absolute precision 24/7" and "Infinite 24/7 consistency" in
   * the agitation and the comparison, "flawless" compliance in a use case,
   * "drastically reducing return rates", "incredibly flexible" and "highly
   * accurate". None of them ship.
   *
   * This matters more here than on other pages. An inspection buyer knows no
   * system catches everything, and a page that claims it reads as written by
   * somebody who has not run one. The honest claim is better and it is the
   * one the brief already contains: a model applies the same threshold at
   * three in the afternoon as at three in the morning. Consistency is real,
   * provable and enough. Perfection is not on offer and saying so is what
   * makes the rest credible.
   *
   * !! NO CAMERA MODEL IS NAMED !!
   *
   * A use case asked for a "DJI Osmo Action 5 Pro". That is an unvetted
   * vendor and a version number in one phrase, and both are already ruled
   * out, the second by content/integrations.ts line 17. The page says
   * commercial hardware and leaves the choice where it belongs.
   *
   * "Milliseconds per frame" and "million-dollar robotics facility" are both
   * figures nobody here has measured or priced.
   *
   * !! EDGE DEPLOYMENT IS DESCRIBED, NOT CLAIMED AS DELIVERED !!
   *
   * "edge AI vision models" is a briefed secondary and running models on
   * device appears nowhere in this repository. It is written as an option the
   * architecture supports, which is true of the architecture, rather than as
   * work already shipped. Confirm before launch alongside the vendor list.
   */
  "/services/computer-vision-quality-control": {
    path: "/services/computer-vision-quality-control",
    /*
     * 40 characters. The brief's version splits the primary phrase with an
     * ampersand and then appends a second brand name at 56. This was also the
     * one page in docs/page-progress.md whose title was over 60 rendered, so
     * that row clears with this build.
     */
    metaTitle: "Computer Vision Quality Control Services",
    serviceType: "computer vision quality control",
    metaDescription:
      "Nobody inspects as carefully in the last hour. Computer vision quality control scores every item the same way and flags the doubtful ones. Book a review.",

    hero: {
      eyebrow: "Computer vision quality control",
      /*
       * The brief's H1 was "Automate Visual Inspections. Catch Every Defect."
       * The second sentence is a promise no inspection system keeps, and on
       * this page it costs more than it buys. Consistency is the real claim
       * and it is the one a QA manager will recognise as true.
       */
      title: "A camera does not get tired. The last item gets the first look.",
      lede: "Human inspection is good, and it varies across a shift and between two people doing it. A model applies the same judgement to the first item and to the ten thousandth one. It says when it is unsure.",
      badges: ["The same threshold every time", "Flags what it cannot judge"],
    },

    summary: {
      heading: "What computer vision quality control is",
      body: "Computer vision quality control uses a trained model and a camera to check items against examples of what good and bad look like. Each item gets a score rather than a verdict, and where that score sits decides whether it passes or goes to a person. The value is consistency rather than perfection, because a threshold does not drift over a shift.",
    },

    problem: {
      heading: "Inspection that varies by the hour",
      body: "Visual checking is done by people. People are good at it and also human. Attention drops across a shift, standards differ between inspectors, and what got through is invisible until a customer finds it. The cost arrives later as returns, and by then nobody can say which batch it was.",
      points: [
        {
          title: "The last hour is not the first",
          body: "Everybody inspects better at the start of a shift. The same item gets a different look at nine and at five o'clock in the afternoon.",
        },
        {
          title: "Two inspectors, two standards",
          body: "Where the line sits lives in somebody's judgement. It is rarely written down anywhere.",
        },
        {
          title: "Nothing is recorded",
          body: "A defect caught on a clipboard is a tick. There is no way to see a pattern forming.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of automated inspection",
      items: [
        {
          title: "Ordinary cameras, mostly",
          body: "Industrial rigs are supported and often unnecessary. A good commercial camera or a phone is enough for a great many inspection jobs.",
        },
        {
          title: "On the device or in the cloud",
          body: "Where the model runs is a decision about latency. On device keeps footage off the network. Hosted is simpler to operate.",
        },
        {
          title: "Results land in your system",
          body: "Every score is written to your database. That is what turns inspection into something you can query.",
        },
      ],
    },

    comparison: {
      heading: "Human inspection against a vision model",
      body: "Both catch defects and both miss some. What differs is when they miss.",
      columns: ["A person", "A vision model"],
      rows: [
        {
          label: "Across a shift",
          values: ["Attention declines and recovers", "The threshold does not move"],
        },
        {
          label: "Between inspectors",
          values: ["Each has their own line", "One line, written down"],
        },
        {
          label: "What gets recorded",
          values: ["A tick on a sheet, if that", "A score against every item"],
        },
        {
          label: "An uncertain case",
          values: ["Judged in the moment", "Flagged, with the image kept"],
        },
        {
          label: "Finding a pattern later",
          values: ["Ask whoever was on shift", "Query the scores"],
        },
      ],
    },

    scenarios: {
      heading: "Vision automation in the real world",
      body: "Three checks that happen by eye today. Each one becomes a score somebody can look up.",
      items: [
        {
          system: "Goods inwards",
          title: "Damage found before it is booked in",
          body: "Electronics arrive and get logged before anybody looks. A camera at the bench reads the serial and checks the case in the same pass.",
        },
        {
          system: "A mobile app",
          title: "Checks that run on the handset",
          body: "Some work cannot send video anywhere at all. A smaller model on the device does the checking. Only the result travels.",
        },
        {
          system: "Despatch",
          title: "The right label on the right box",
          body: "A label is checked against what the order actually says before the box is sealed. Mismatches are caught at the bench.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We watch the inspection happening",
          body: "Two days at the bench, watching what gets checked. Photographs of real defects start being collected here.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the first check and the cost. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It runs beside the person doing it now",
          body: "Both inspect the same items for a while. The disagreements get looked at. That is how the threshold gets set honestly.",
        },
      ],
    },

    reach: {
      heading: "What the model is and is not good at",
      body: "A vision model is excellent at applying one standard repeatedly and poor at judging something it has never seen. Knowing which is which is most of a successful deployment.",
      points: [
        {
          label: "Good at the repeated check",
          body: "The same defect, the same angle, thousands of times over.",
        },
        {
          label: "Poor at the novel case",
          body: "Something it has no examples of gets flagged.",
        },
        {
          label: "You set where the line sits",
          body: "Tighter catches more and flags more. That trade is yours to make.",
        },
      ],
    },

    stack: {
      heading: "What the inspection is built from",
      body: "Cameras you can buy. Models that run where you need them. Nothing here is a requirement, and the work goes ahead against whatever hardware you already have.",
      groups: [
        {
          label: "Seeing the item",
          items: [
            { name: "Vision models", category: "Scoring against your examples" },
            { name: "Claude", category: "Describing what was found", icon: "siClaude" },
            { name: "Flutter", category: "The app at the bench", icon: "siFlutter" },
          ],
        },
        {
          label: "Running the model",
          items: [
            { name: "Python", category: "Training and evaluation", icon: "siPython" },
            { name: "Docker", category: "Same on a bench or a server", icon: "siDocker" },
            { name: "AWS", category: "Where the hosted half runs" },
          ],
        },
        {
          label: "Keeping the record",
          items: [
            { name: "PostgreSQL", category: "A score against every item", icon: "siPostgresql" },
            { name: "Redis", category: "Queueing the frames", icon: "siRedis" },
            { name: "n8n", category: "What happens on a fail", icon: "siN" },
          ],
        },
      ],
    },

    /*
     * Sixteenth shape, and the last unused arrangement of ones and twos across
     * four rows. Shipped so far: 1-2-2, 1-1-2-1, 1-1-2-1, 2-1-2-1, 1-2-2-1,
     * 1-2-1-2, 2-1-1-2, 1-1-1-2, 2-2-1-1, 1-2-1-1, 2-1-1-1, 2-1-2-2, 1-1-2-2,
     * 2-2-2-1 and 2-2-1-2. This is 1-2-2-2.
     *
     * Three pairs stacked under one node, which is right for a page whose
     * every step is a choice. Where it runs, what the score says and what
     * happens next are all forks, and the item at the top is the only thing
     * that is not.
     *
     * The middle pair is the honest claim. A score above the line and a score
     * below it are both normal outputs, and drawing only the passing path
     * would have been the diagram equivalent of "catch every defect".
     */
    diagram: {
      caption:
        "An item is photographed at the bench. The model runs on the device or in the cloud and scores the image against your own examples. It logs a pass, or holds it.",
      align: "sequence",
      rows: [
        [{ label: "An item, on camera", sub: "At the bench", tone: "brand" }],
        [
          { label: "On the device", sub: "Nothing leaves", tone: "accent" },
          { label: "Or in the cloud", sub: "Simpler to run", tone: "accent" },
        ],
        [
          { label: "Above the line", sub: "Scored a pass", tone: "accent" },
          { label: "Below it", sub: "Or simply unsure", tone: "accent" },
        ],
        [
          { label: "Logged and passed", sub: "Score kept either way", tone: "brand" },
          { label: "Held for a person", sub: "With the image", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Do we need expensive industrial cameras?",
        answer:
          "Often not. A good commercial camera or a recent phone handles a surprising number of inspection jobs. Lighting matters more than the sensor for most of them. Industrial rigs earn their place on fast lines and fine tolerances, which is a smaller set of jobs than people expect.",
      },
      {
        question: "Does it need an internet connection?",
        answer:
          "Not if it runs on the device. A smaller model on the handset or a machine at the bench works offline and keeps footage off the network. Hosted models are easier to run and update, so the choice is about your constraints rather than about quality.",
      },
      {
        question: "How do you train it on our products?",
        answer:
          "With your own images of both good and defective items. Examples of what a defect looks like on your own line matter more than sheer volume. The borderline ones are the most valuable. Collection starts in the first week.",
      },
      {
        question: "Will it catch every defect?",
        answer:
          "No, and neither does a person. What it does is apply the same threshold every time, which means the misses are consistent and measurable rather than dependent on the hour. You choose where the line sits, and tighter catches more while flagging more for review.",
      },
      {
        question: "What does AI visual inspection services actually cover?",
        answer:
          "Checking a physical thing against a standard. That covers damage, presence and placement, and it stops short of judging something the model has no examples of.",
      },
      {
        question: "What are edge AI vision models?",
        answer:
          "Models small enough to run on the device holding the camera rather than in a data centre. Nothing leaves the handset. They trade some accuracy for that, and whether it is worth it depends on the check.",
      },
      {
        question: "How does automated defect detection handle a new fault?",
        answer:
          "It flags it rather than passing it, because it will not match anything it knows. That is the correct behaviour, and it is why the flagged pile is worth reviewing. New defects are how the next model gets its examples.",
      },
    ],
  },

  /*
   * Silo 5's parent, 23 August 2026, eighteenth page on the template.
   *
   * !! THIS PAGE COVERS BOTH HALVES OF ITS SILO, NOT ONLY VOICE !!
   *
   * The brief is written as a voice page throughout: primary keyword "custom
   * AI voice models", an H1 reading "Give Your Software a Voice", and three
   * H3s on speech to text, audio analysis and text to speech. Built that way
   * it would have broken the silo in two places at once.
   *
   * This silo has two children. /services/ai-voice-telephony-automation is
   * the voice one and owns "AI voice agent integration". A parent scoped to
   * voice competes with it directly. /services/private-llm-fine-tuning is not
   * about voice at all, and a voice parent leaves it with no page above it
   * covering its category.
   *
   * docs/hitasoft_ai_architecture_strategy.md gives this parent "custom AI
   * model development" and "private AI model deployment", and names the silo
   * "Custom Models & Voice" with the tagline "your own model, hosted where you
   * choose, answering in your own voice". That covers both children and it is
   * what this page is built to.
   *
   * Voice is a half of the page rather than the whole of it. "custom AI voice
   * models" stays as a secondary, since it is about the models rather than the
   * agent the child sells.
   *
   * "custom voice app development" was a briefed secondary and is not here.
   * It sits on top of the child's "custom voice AI for small business" and
   * belongs to that page.
   *
   * Declined from the brief:
   *
   *   - "your retention rates will skyrocket", an outcome claim with nothing
   *     behind it.
   *   - "perfectly transcribes", "high fidelity in real-time" and "complete
   *     privacy". Speech recognition is measurably imperfect and the page is
   *     more useful for saying where it struggles.
   *   - "enterprise-grade STT models", banned at docs/positioning.md line 64.
   *   - the claim that models "accurately transcribe heavy accents", which is
   *     the opposite of true. Accent and background noise are where word
   *     error rates go up, and a buyer testing it will find that out in ten
   *     minutes. The FAQ says so.
   *   - "medical consulting platforms" with "complete privacy" attached, for
   *     the same reason the vector database page dropped its regulated
   *     professions. See docs/positioning.md line 213.
   *   - the Google Play media permission compliance claim, unconfirmed like
   *     every other Play Console claim in these briefs.
   */
  "/services/custom-ai-models-voice": {
    path: "/services/custom-ai-models-voice",
    metaTitle: "Custom AI Model Development & Voice",
    serviceType: "custom AI model development",
    metaDescription:
      "A hosted model is somebody else's, on somebody else's terms. Custom AI model development, from a tuned private model to the voice it answers in. Book a review.",

    hero: {
      eyebrow: "Custom AI model development",
      /*
       * The brief's H1 was "Give Your Software a Voice. Build Frictionless
       * Audio AI." It scopes the page to voice, which is the structural
       * problem noted above. This is the silo's own tagline, which covers the
       * model half and the voice half in one line.
       */
      title: "Your own model, hosted where you choose.",
      lede: "Most businesses are fine on a hosted endpoint. It comes down to where the data has to stay, or what the model has to sound like. This is the work for the second kind.",
      badges: ["Runs on hardware you control", "Open weights, no licence to renew"],
    },

    summary: {
      heading: "What custom AI model development is",
      body: "Custom AI model development covers two things a hosted endpoint cannot offer you at all. The first is a model that runs on infrastructure you own, so records never leave your network. The second is a model tuned to your own material, whether that means the language of your industry or the voice your software answers in.",
    },

    problem: {
      heading: "When a hosted endpoint is not enough",
      body: "A general model behind somebody else's API is the right answer most of the time, and it is worth saying so. It stops being the right answer when the data cannot leave, or when the cost per call outgrows a server.",
      points: [
        {
          title: "The records are not allowed to leave",
          body: "Some material cannot be sent to a third party. That rules out a hosted endpoint.",
        },
        {
          title: "The bill grows with the traffic",
          body: "Per call pricing is cheap until volume arrives. At a certain point your own hardware is simply cheaper.",
        },
        {
          title: "The general model does not speak your language",
          body: "Industry terms get mangled by a model trained on everything. Tuning on your own material fixes what prompting cannot.",
        },
      ],
    },

    capabilities: {
      heading: "What we build here",
      items: [
        {
          title: "Private model deployment",
          body: "An open weight model running on your own hardware, or in your own cloud account. No data leaves, and no per call meter runs.",
        },
        {
          title: "Tuned on your own material",
          body: "Fine tuning teaches a model the vocabulary your work uses. It is the fix when prompting stops being enough.",
        },
        {
          title: "Speech in and speech out",
          body: "Transcription for what people say to your software, and generated speech for what it says back. Both can run privately.",
        },
      ],
    },

    comparison: {
      heading: "A hosted endpoint against your own model",
      body: "Most projects should start hosted. This compares them for the cases where that stops working.",
      columns: ["A hosted endpoint", "Your own model"],
      rows: [
        {
          label: "Where the data goes",
          values: ["To a third party, retention off", "Nowhere, it stays on your hardware"],
        },
        {
          label: "What it costs",
          values: ["Per call, growing with traffic", "The hardware, flat once it is running"],
        },
        {
          label: "Your vocabulary",
          values: ["Handled by prompting, mostly", "Learned, if you tune it"],
        },
        {
          label: "Keeping it current",
          values: ["The provider upgrades it for you", "You decide when to move"],
        },
        {
          label: "Getting started",
          values: ["An API key and an afternoon", "A decision worth costing first"],
        },
      ],
    },

    scenarios: {
      heading: "Where a custom model earns its place",
      body: "Three situations where a hosted model is the wrong tool. Each has a page of its own below.",
      items: [
        {
          system: "Your own infrastructure",
          title: "Material that cannot leave the building",
          body: "An open weight model runs inside your network and the records never reach anybody else. What you give up is some capability, and what you get is a boundary you can point at.",
        },
        {
          system: "Your product's interface",
          title: "Speaking instead of tapping",
          body: "Somebody says what they want instead of tapping through four screens of form fields to get there. The words are transcribed and turned into the action intended.",
        },
        {
          system: "Your recorded audio",
          title: "Conversations that become records",
          body: "Calls and sessions are transcribed, then structured into searchable notes. Where the audio is sensitive, transcription runs on your hardware.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We check whether you need this",
          body: "Two days on the constraint that made you ask. Sometimes a hosted endpoint configured properly is the honest answer.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan prices the hardware and the work. You decide whether the move is worth it.",
        },
        {
          when: "From week 3",
          title: "It runs beside what you have",
          body: "The private model goes up alongside the hosted one, and both answer the same questions. Comparing them on your own material is the test.",
        },
      ],
    },

    reach: {
      heading: "What you give up and what you get",
      body: "Your own model is a trade rather than an upgrade. It is worth making deliberately, and it is worth being told when it is not.",
      points: [
        {
          label: "You get a hard boundary",
          body: "Data on your hardware does not reach anybody, by architecture.",
        },
        {
          label: "You give up some capability",
          body: "The largest hosted models are still ahead on hard reasoning.",
        },
        {
          label: "You take on the upkeep",
          body: "Somebody has to run it. Usually us, and it is a real cost either way.",
        },
      ],
    },

    stack: {
      heading: "What a private deployment is built from",
      body: "Open weight models and ordinary infrastructure. Nothing here is a requirement, and the work goes ahead against whatever hardware you already have.",
      groups: [
        {
          label: "Models you can host",
          items: [
            { name: "Llama", category: "The usual open weight starting point", icon: "siMeta" },
            { name: "Mistral", category: "Smaller, and often enough", icon: "siMistralai" },
            { name: "Qwen", category: "Strong on multilingual work", icon: "siQwen" },
          ],
        },
        {
          label: "Speech, both directions",
          items: [
            { name: "Whisper", category: "Transcription that can run privately" },
            { name: "Twilio", category: "Where the calls come in", icon: "siTwilio" },
            { name: "Claude", category: "Understanding what was said", icon: "siClaude" },
          ],
        },
        {
          label: "Where it runs",
          items: [
            { name: "Docker", category: "Same on your hardware or ours", icon: "siDocker" },
            { name: "AWS", category: "Your own cloud account" },
            { name: "PostgreSQL", category: "Transcripts and records", icon: "siPostgresql" },
          ],
        },
      ],
    },

    /*
     * Seventeenth shape, and the first three row sequence. Every arrangement
     * of ones and twos across four rows is now used except 1-1-1-1 and
     * 2-2-2-2, and neither suits a page about choices. The integration parent
     * proves three rows renders at this height, so this is 2-2-2.
     *
     * Every row is a pair because every row is a decision, which is what this
     * page is: what you bring, how the model is made yours, and where it ends
     * up running. It opens and closes on the client's own things, and only
     * the middle row is work we add.
     */
    diagram: {
      caption:
        "You bring the material and the voice it answers in. The model is either tuned on that or prompted against it, and it runs on your hardware or on an endpoint.",
      align: "sequence",
      rows: [
        [
          { label: "Your own material", sub: "Records and terms", tone: "brand" },
          { label: "Your own voice", sub: "How it should sound", tone: "brand" },
        ],
        [
          { label: "Tuned on it", sub: "When prompting stops working", tone: "accent" },
          { label: "Or prompted well", sub: "Cheaper, and often enough", tone: "accent" },
        ],
        [
          { label: "On your hardware", sub: "Nothing leaves", tone: "brand" },
          { label: "Or on an endpoint", sub: "Retention off", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Do custom AI voice models handle accents and other languages?",
        answer:
          "Languages yes, accents less well than the marketing suggests. Word error rates climb with an unfamiliar accent or background noise, which is measurable and worth measuring on your own recordings before committing. Tuning on your own audio is the fix, and it is a large part of why this service exists.",
      },
      {
        question: "How do microphone permissions and consent work?",
        answer:
          "Consent gets asked for in the interface before anything records, and what happens to the audio afterwards is decided in the same conversation. Store reviews look closely at anything touching a microphone, so those decisions belong in the build rather than at submission.",
      },
      {
        question: "Should processing run on the device or in the cloud?",
        answer:
          "On the device when the audio cannot travel or the connection is unreliable, and in the cloud when the reasoning matters more. Smaller local models are noticeably weaker, so the honest version is that this is a trade rather than a free choice.",
      },
      {
        question: "When is private AI model deployment actually worth it?",
        answer:
          "When data residency requires it, or when the volume makes per call pricing more expensive than a server. Below those thresholds a hosted endpoint with retention switched off is usually the better answer, and we will say so in week two.",
      },
      {
        question: "What does speech-to-text AI integration involve?",
        answer:
          "Getting audio into your system, transcribed, and turned into something the software can act on. The transcription is the easy half. Deciding what a sentence means and what to do about it is where the work is.",
      },
      {
        question: "How is this different from the pages below it?",
        answer:
          "This page is the decision and they are the builds. Fine tuning a private model and adding voice to telephony are the two specific jobs. Each has a page of its own.",
      },
    ],
  },

  /*
   * First child of the models and voice silo, 23 August 2026, nineteenth page
   * on the template.
   *
   * !! ON THE PARENT'S "private AI model deployment" !!
   *
   * That phrase is a strategy doc secondary for both this page and its parent,
   * which is the kind of overlap that has needed settling in every other silo.
   * It does not need settling here. The brief for this page chose
   * "on-premise LLM deployment" and "secure AI model hosting" instead, so the
   * two pages describe the same intent in different words. The parent keeps
   * its assignment, used once in an FAQ that asks whether you need this at
   * all, and this page takes the brief's three. Nothing was moved.
   *
   * !! NO VERSION NUMBER ON LLAMA !!
   *
   * An H3 read "Open-Weight Model Fine-Tuning (Llama 3, Mistral)".
   * content/integrations.ts line 17 allows families and not versions, because
   * a version dates the page the week it is superseded. Both families are
   * vetted and both already ship on the parent.
   *
   * !! THE GUARANTEES ARE GONE, THE ARCHITECTURE IS NOT !!
   *
   * The brief asked for "total data isolation", "Total physical isolation",
   * "Guaranteed zero third-party data sharing", "perfect, proprietary JSON",
   * "ensuring zero user data leaks", and an assurance that a platform "easily
   * passes rigorous Google Play Data safety forms without fear of rejection".
   *
   * The argument underneath all of them is the strongest on the page and it
   * survives whole: a model on hardware you own means records do not leave
   * because there is nowhere for them to go, which is a property of the
   * architecture rather than of somebody's policy. That is worth more than
   * the word guaranteed, and it is the version a security reviewer will
   * believe. Nobody controls a store review, here or anywhere else.
   *
   * "Enterprise" was in the agitation, "incredibly" twice, and "industry
   * leading" once. All out.
   *
   * The first use case dropped its medical platforms, exactly as the vector
   * database page did, and for the reason at docs/positioning.md line 213.
   *
   * "A few weeks" for the training was cut. Nobody has timed it, and this
   * silo has already refused four duration figures.
   */
  "/services/private-llm-fine-tuning": {
    path: "/services/private-llm-fine-tuning",
    /* 40 characters. The brief's version appended a second brand name at 52. */
    metaTitle: "Private LLM Fine-Tuning & Secure Hosting",
    serviceType: "private LLM fine-tuning",
    metaDescription:
      "Some records are not allowed to leave the building. Private LLM fine-tuning runs an open weight model trained on your own material, in house. Book a review.",

    hero: {
      eyebrow: "Private LLM fine-tuning",
      /*
       * The brief's H1 was "Own Your AI Intelligence. Train Private LLMs."
       * The first half is a slogan and the second is the service name. The
       * buyer arriving here has been told no by somebody, usually security or
       * legal, so the headline answers that instead.
       */
      title: "The data cannot leave. The model can come to it.",
      lede: "Plenty of AI projects stop at a policy that forbids sending records to a third party. An open weight model running on your own hardware removes the question rather than arguing with it.",
      badges: ["Open weights, hosted by you", "No per token meter running"],
    },

    summary: {
      heading: "What private LLM fine-tuning is",
      body: "Private LLM fine-tuning adjusts the weights of an open weight model using your own material, then runs the result on infrastructure you control. Because the model sits inside your network or your own cloud account, records reach it without leaving your boundary. The tuning is what makes it fluent in your vocabulary, and the hosting is what makes it private.",
    },

    problem: {
      heading: "The project that stopped at the policy",
      body: "A hosted endpoint is the right answer for most work and it is genuinely hard to beat. It stops being available the moment somebody decides the records cannot go to a third party. That decision is usually correct and it ends the conversation, unless the model can come to the data instead.",
      points: [
        {
          title: "Legal said no and legal was right",
          body: "Some material is not ours to send anywhere. Retention settings do not change that. The objection is to the transfer itself.",
        },
        {
          title: "The general model mangles your vocabulary",
          body: "Industry terms and internal shorthand come back wrong. Prompting patches it up, then stops helping.",
        },
        {
          title: "The bill scales with success",
          body: "Per token pricing is cheap while volume is low. It keeps growing, and a server that costs the same every month starts looking sensible.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of a private deployment",
      items: [
        {
          title: "Preparing the material",
          body: "Most of the work is turning your material into examples. Quality decides the outcome far more than size.",
        },
        {
          title: "Tuning an open weight model",
          body: "Llama and Mistral are the usual families. Weights adjust to your material, rather than a prompt sitting in front of it describing it.",
        },
        {
          title: "Hosted inside your boundary",
          body: "The result runs in your own cloud account. Nothing calls out, because there is nothing to call.",
        },
      ],
    },

    comparison: {
      heading: "Renting an endpoint against owning a model",
      body: "Most work should rent. This is the comparison for the work that cannot.",
      columns: ["A hosted endpoint", "Your own model"],
      rows: [
        {
          label: "Where records go",
          values: ["To a third party, retention off", "Nowhere. There is no outbound call"],
        },
        {
          label: "What it costs",
          values: ["Per token, rising with use", "The hardware, flat once running"],
        },
        {
          label: "Your vocabulary",
          values: ["Described in a long prompt", "Learned by the weights"],
        },
        {
          label: "Output you can rely on",
          values: ["Prompted, and checked", "Trained toward, and still checked"],
        },
        {
          label: "Who keeps it running",
          values: ["The provider does", "Somebody has to, and that is a cost"],
        },
      ],
    },

    scenarios: {
      heading: "Where a private model is the only option",
      body: "Three situations where a hosted endpoint is not available. Each ends with the model inside the boundary.",
      items: [
        {
          system: "A consulting platform",
          title: "Transcripts that never leave",
          body: "Session recordings are transcribed and summarised by a model on the same infrastructure that stores them. No third party ever receives the audio or the text.",
        },
        {
          system: "A financial product",
          title: "Structured output, trained rather than prompted",
          body: "A tuned model returns the shape your ledger expects without a long prompt describing it each time. Output still gets validated in code, because trained toward is not the same as guaranteed.",
        },
        {
          system: "A closed community",
          title: "Moderation that runs in house",
          body: "Posts are checked against your own rules, by a model running on your own servers. What members write never leaves the platform.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We check whether tuning is the answer",
          body: "Two days on the constraint and the material. Often a hosted endpoint is the honest recommendation.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan prices the hardware, the tuning and the upkeep against what you spend now. You decide whether the move pays.",
        },
        {
          when: "From week 3",
          title: "Prepared, tuned and compared",
          body: "The dataset gets built first. It decides everything after it. The tuned model is measured against the hosted one.",
        },
      ],
    },

    reach: {
      heading: "What owning the model actually means",
      body: "Private deployment is a trade. Both sides are worth stating. It buys a boundary. It costs capability and upkeep.",
      points: [
        {
          label: "The boundary is architectural",
          body: "No outbound call exists. There is no policy to trust.",
        },
        {
          label: "The capability is lower",
          body: "The largest hosted models still reason better.",
        },
        {
          label: "Somebody runs it",
          body: "Updates, hardware and monitoring are ongoing work. Usually ours.",
        },
      ],
    },

    stack: {
      heading: "What a private deployment is built from",
      body: "Open weight models, and infrastructure you already know. Nothing here is a requirement, and the work goes ahead against whatever hardware you have.",
      groups: [
        {
          label: "Models worth tuning",
          items: [
            { name: "Llama", category: "The usual starting point", icon: "siMeta" },
            { name: "Mistral", category: "Smaller, and often enough", icon: "siMistralai" },
            { name: "Qwen", category: "Where the work is multilingual", icon: "siQwen" },
          ],
        },
        {
          label: "Preparing and tuning",
          items: [
            { name: "Python", category: "Dataset preparation and evaluation", icon: "siPython" },
            { name: "PostgreSQL", category: "Where your material already sits", icon: "siPostgresql" },
            { name: "pgvector", category: "Retrieval, where tuning is not needed" },
          ],
        },
        {
          label: "Running it",
          items: [
            { name: "Docker", category: "Same on your hardware or ours", icon: "siDocker" },
            { name: "AWS", category: "Your own cloud account" },
            { name: "Sentry", category: "Knowing when it stops", icon: "siSentry" },
          ],
        },
      ],
    },

    /*
     * Eighteenth shape, and the one arrangement deliberately avoided until a
     * page earned it: 1-1-1-1, four single nodes and no fork anywhere.
     *
     * Every other diagram on this site forks, because every other page
     * describes a decision. This one does not. Fine tuning is a pipeline in
     * the plainest sense, material to dataset to weights to deployment, and
     * each stage feeds exactly one next stage. Drawing a branch here would
     * have invented a choice that the work does not contain.
     *
     * Only the two middle nodes are accent. The material at the top and the
     * hardware at the bottom are both the client's, which is the whole claim
     * of the page rendered as colour.
     */
    diagram: {
      caption:
        "Your own material becomes a training set, the weights of an open model are adjusted to it, and the result runs on hardware you control. Nothing leaves at any stage.",
      align: "sequence",
      rows: [
        [{ label: "Your own material", sub: "Records and terms", tone: "brand" }],
        [{ label: "Prepared into examples", sub: "Where the work is", tone: "accent" }],
        [{ label: "Weights adjusted", sub: "An open model, tuned", tone: "accent" }],
        [{ label: "Running on your hardware", sub: "No outbound call", tone: "brand" }],
      ],
    },

    faqs: [
      {
        question: "Do we need expensive hardware for this?",
        answer:
          "Less than people expect. A quantised model gives up some quality for a large drop in what it needs to run. A great many jobs are served well by that trade. The sizing gets costed in week two.",
      },
      {
        question: "Which open weight models do you fine-tune?",
        answer:
          "Usually the Llama or Mistral families, picked for what the job needs rather than for what is newest. Model families are named here deliberately and versions are not, because whichever is current when you read this will not be current for long.",
      },
      {
        question: "How long does fine-tuning take?",
        answer:
          "The training itself is the short part. Preparing a dataset worth training on is where the time goes, and it depends entirely on what state your material is in. Week one exists to answer that first.",
      },
      {
        question: "Is custom AI model training better than a long prompt?",
        answer:
          "Not always, and trying the prompt first is cheaper. Tuning earns its place when prompting has plateaued, or when the prompt has grown long enough to cost real money on every call.",
      },
      {
        question: "What does on-premise LLM deployment involve day to day?",
        answer:
          "Somebody keeps it running. Hardware, updates and monitoring do not vanish just because the model now belongs to you. That upkeep is a real cost. We do it after handover unless you would rather not.",
      },
      {
        question: "Is secure AI model hosting just retention being off?",
        answer:
          "No, and the difference is the point. Retention off means a promise not to keep it. Hosting it yourself means nothing is sent, so there is no promise to rely on and nothing to audit.",
      },
    ],
  },

  /*
   * Second child of the models and voice silo, 23 August 2026, twentieth page
   * on the template. This completes every service page on the site.
   *
   * !! VOICE CLONING IS NOT OFFERED HERE !!
   *
   * The third FAQ asked to confirm "fully customizable voice cloning". That is
   * the one item in any of these briefs that is a problem beyond accuracy.
   * Cloning a particular person's voice is an impersonation capability, it
   * needs that person's consent to be lawful in several of the markets in
   * docs/positioning.md, and nothing in this repository says the company does
   * it. The page offers voice selection instead, which is what a brand
   * actually needs, and the FAQ says plainly that cloning a real person is a
   * consent question rather than a feature toggle.
   *
   * !! "Gadgetly" AGAIN !!
   *
   * A use case names it as a retail platform, exactly as the predictive BI
   * brief did. It appears nowhere in this repository except the comment on
   * that page explaining why it was cut. docs/positioning.md line 215. Same
   * decision: the scenario keeps the situation and drops the name.
   *
   * !! NO CAPACITY OR LATENCY FIGURES !!
   *
   * The comparison asked for "Handles 10,000 concurrent calls" and the first
   * FAQ for "sub-second conversational latency". Neither has been measured,
   * and the second is the same shape as the "sub 50ms" hosting claim that
   * docs/positioning.md already records as removed from the template. Latency
   * is the real risk on this page, so the FAQ describes what causes a pause
   * and what is done about it rather than quoting a number nobody can hold to.
   *
   * Vonage is not named. Twilio is, because Twilio is genuinely vetted in
   * content/integrations.ts and already ships on the parent. Vonage is not in
   * that file at all.
   *
   * "Enterprise integrations", "ultra-low latency", "ultra-fast" and "without
   * human intervention" are all out. The last one matters: this page sells a
   * warm transfer, so promising no human involvement contradicts its own best
   * feature two sections later.
   */
  "/services/ai-voice-telephony-automation": {
    path: "/services/ai-voice-telephony-automation",
    /* 44 characters. The brief split the primary phrase with an ampersand and
     * then appended a second brand name at 56. */
    metaTitle: "AI Voice Telephony Automation & Phone Agents",
    serviceType: "AI voice telephony automation",
    metaDescription:
      "Nobody has ever enjoyed pressing one for accounts. AI voice telephony automation answers in plain words and hands over when it cannot help. Book a review.",

    hero: {
      eyebrow: "AI voice telephony automation",
      /*
       * The brief's H1 was "Kill the Press 1 Menu. Deploy Intelligent Voice
       * Agents." The first half is the good half. The second is the product
       * name with an adjective on it, so it goes.
       */
      title: "Press one for accounts. Nobody has ever wanted this.",
      lede: "A phone menu is a filing system the caller has to operate on your behalf. An agent that listens instead can take the actual question, look the account up, and answer it or fetch somebody who can.",
      badges: ["Hands over with the transcript", "Answers from your own records"],
    },

    summary: {
      heading: "What AI voice telephony automation is",
      body: "AI voice telephony automation connects a conversational model to the phone line through a programmable voice API. The caller speaks normally instead of choosing from a menu, and the agent can look up their account before answering. What it cannot settle it passes to a person, along with everything the caller has already said.",
    },

    problem: {
      heading: "The menu was never for the caller",
      body: "A phone tree exists to route work, and it does that by making the caller guess which of five options describes their problem. Most of them guess wrong at least once. By the time a person picks up, the caller has spent their patience and explained nothing.",
      points: [
        {
          title: "The options never fit the question",
          body: "A menu offers the categories your business uses internally. Callers arrive with a problem, not a department.",
        },
        {
          title: "Explaining it twice",
          body: "Whatever the caller said to the machine is gone. They start again from the beginning.",
        },
        {
          title: "Simple questions still need a person",
          body: "Balance queries and delivery dates get routed to staff because the menu cannot answer them. They are most of the queue.",
        },
      ],
    },

    capabilities: {
      heading: "The architecture of a phone agent",
      items: [
        {
          title: "On the line, through Twilio",
          body: "Calls come in and go out over a programmable voice API, on the number you already publish. The number and the carrier arrangement you already have can usually stay as they are.",
        },
        {
          title: "It can look things up mid call",
          body: "The agent queries your systems while the caller is talking. That is the difference between answering and pointing.",
        },
        {
          title: "A handover that carries context",
          body: "Anything it cannot settle goes to a person with a summary of the call attached. Nobody asks the caller to start again.",
        },
      ],
    },

    comparison: {
      heading: "A phone menu against a voice agent",
      body: "Both answer the phone. They differ on who does the understanding.",
      columns: ["A phone menu", "A voice agent"],
      rows: [
        {
          label: "How the caller starts",
          values: ["Picks from options you wrote", "Says what they want"],
        },
        {
          label: "Reaching your systems",
          values: ["None, it only routes", "Queries the account mid call"],
        },
        {
          label: "A question outside the tree",
          values: ["Routed to a person, or looped", "Answered, if the answer exists"],
        },
        {
          label: "When a person takes over",
          values: ["The caller explains it again", "The transcript goes with the call"],
        },
        {
          label: "Changing what it handles",
          values: ["Somebody rebuilds the tree", "The documents behind it change"],
        },
      ],
    },

    scenarios: {
      heading: "Telephony workflows in action",
      body: "Three calls that happen every day. Each one ends in an answer or a warm handover.",
      items: [
        {
          system: "Your support line",
          title: "A billing question, answered on the call",
          body: "Somebody rings about a charge they do not recognise. The agent verifies them, reads the account and explains the charge, without a ticket ever being opened.",
        },
        {
          system: "Your supplier calls",
          title: "Outbound, when the stock says so",
          body: "A forecast shows a line running short and the agent calls the supplier to confirm a lead time. What was agreed is transcribed into the record afterwards.",
        },
        {
          system: "Your booking line",
          title: "Appointments taken over the phone",
          body: "The agent finds a slot, books it and confirms the details back to the caller. The appointment reaches your system directly.",
        },
      ],
    },

    process: {
      heading: "How the first three weeks run",
      steps: [
        {
          when: "Week 1",
          title: "We listen to the calls you get",
          body: "Two days on what people actually ring about. The repeat questions sort themselves into a short list quickly.",
        },
        {
          when: "End of week 2",
          title: "You get a costed plan",
          body: "The plan names the first calls and the cost. You decide whether it goes ahead.",
        },
        {
          when: "From week 3",
          title: "It takes one kind of call",
          body: "The agent starts narrow and transfers the rest. What it handles widens as the recordings hold up.",
        },
      ],
    },

    reach: {
      heading: "What a voice agent should and should not do",
      body: "Voice is less forgiving than chat. A caller cannot scroll back, and a wrong answer said confidently out loud is worse than a slow one.",
      points: [
        {
          label: "It answers from your records",
          body: "Account data and your own documentation, not general knowledge.",
        },
        {
          label: "It says when it is unsure",
          body: "Then transfers, rather than guessing at something spoken aloud.",
        },
        {
          label: "The caller is told what it is",
          body: "People are informed they are speaking to an automated agent.",
        },
      ],
    },

    stack: {
      heading: "What the phone agent is built from",
      body: "The telephony you already have, with a model behind it. Nothing here is a requirement, and the work goes ahead against whatever carrier arrangement you run.",
      groups: [
        {
          label: "Getting on the line",
          items: [
            { name: "Twilio", category: "Programmable voice, in and out", icon: "siTwilio" },
            { name: "Whisper", category: "Turning speech into text" },
            { name: "Flutter", category: "Where an app is involved too", icon: "siFlutter" },
          ],
        },
        {
          label: "Deciding what to say",
          items: [
            { name: "Claude", category: "Holding the conversation", icon: "siClaude" },
            { name: "pgvector", category: "Your documentation, searchable" },
            { name: "Embeddings", category: "Finding the passage that answers" },
          ],
        },
        {
          label: "What it reaches",
          items: [
            { name: "PostgreSQL", category: "Accounts and appointments", icon: "siPostgresql" },
            { name: "Redis", category: "Call state while it runs", icon: "siRedis" },
            { name: "n8n", category: "What happens after the call", icon: "siN" },
          ],
        },
      ],
    },

    /*
     * Nineteenth shape and the last one this site needs, since every service
     * page is now built. Three rows, 2-1-2, which nothing else uses.
     *
     * Both ends are pairs and the middle is not, because that is the shape of
     * the work. Calls arrive in two directions, one agent handles both, and
     * every call ends one of two ways. The brief treats outbound as an
     * afterthought in a single use case, and putting it level with inbound at
     * the top says what the copy would otherwise have to argue.
     */
    diagram: {
      caption:
        "Calls come in and go out through the same agent. It answers from your own records, and every call ends either resolved or handed to a person with the transcript.",
      align: "sequence",
      rows: [
        [
          { label: "An inbound call", sub: "Somebody rings you", tone: "brand" },
          { label: "An outbound call", sub: "Something triggered it", tone: "brand" },
        ],
        [{ label: "The agent", sub: "Reading your records", tone: "accent" }],
        [
          { label: "Answered", sub: "On the call itself", tone: "brand" },
          { label: "Passed to a person", sub: "Transcript attached", tone: "brand" },
        ],
      ],
    },

    faqs: [
      {
        question: "Will there be an awkward pause before it answers?",
        answer:
          "There is a pause, and the work is in keeping it short enough to feel like conversation. It comes from three steps running in sequence, which are hearing the end of a sentence, deciding what to say and speaking it. We measure it on your setup rather than quoting a number, because the carrier route affects it as much as the models do.",
      },
      {
        question: "What happens when it cannot solve the problem?",
        answer:
          "It transfers, and the person picking up gets a summary of what has already been said. The caller does not start again, which is the part that makes people hate automated lines. Which calls transfer immediately gets decided in the first fortnight.",
      },
      {
        question: "Can the agent use a particular voice?",
        answer:
          "You can choose from a range of synthetic voices and set the pacing and the accent to suit the brand. Cloning a specific real person's voice is a different question. It needs that person's documented consent, and it is not something we set up on request.",
      },
      {
        question: "What can AI phone agents actually do on a call?",
        answer:
          "Verify a caller, then answer from your own documentation. What they should not do is anything irreversible without a person, which on most systems means refunds and cancellations.",
      },
      {
        question: "Is this automated call center AI, or something smaller?",
        answer:
          "It scales either way, and most projects start smaller. One line and one kind of call is a better first step than replacing a contact centre. It tells you what callers ask.",
      },
      {
        question: "Do you do Twilio AI voice integration specifically?",
        answer:
          "Yes, and it is the usual route because the programmable voice side is well documented and reliable. If you already run a number somewhere else, that is worth checking before anybody moves it.",
      },
    ],
  },
};
