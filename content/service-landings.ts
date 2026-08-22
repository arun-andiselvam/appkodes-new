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
};
