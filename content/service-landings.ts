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
  "/services/ai-software-integration/custom-ai-api-integration": {
    path: "/services/ai-software-integration/custom-ai-api-integration",
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
      clientLocations: ["India", "Indonesia", "Dubai", "Vietnam", "Sharjah"],
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
     * !! align AND numbered ARE WHAT KEEP IT FROM BEING THE PARENT AGAIN !!
     *
     * This page opened with the parent's diagram carrying different words:
     * same 1-2-2 arrangement, same tone split, same component. Two pages a
     * visitor reaches from one menu read as one page served twice.
     *
     * The rows are now the order a request travels, 1-1-2-1, which no
     * hierarchy can be. `sequence` centres the lone steps so the pair can
     * rejoin into one, and `numbered` says out loud that these happen in
     * order.
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
      numbered: true,
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
};
