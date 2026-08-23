import { ScrollText, Server, ShieldCheck } from "lucide-react";

import type { IndustryLanding } from "./types";

/**
 * The long form industry pages.
 *
 * Built on 21 August 2026 from docs/industry-page-architecture.md, which
 * specifies fintech. This is the template the other five industries follow
 * once their briefs land, the way content/service-landings.ts is for services.
 *
 * A page here keeps its content/industries.ts entry. The short form still
 * feeds the menu card and the breadcrumb trail.
 *
 * !! THE URL IS NOT THE ONE IN THE BRIEF, AND THAT IS DELIBERATE !!
 *
 * The brief asks for /industries/fintech-ai-automation. That page already
 * exists at /industries/fintech-and-finance, in the navigation, the breadcrumb
 * trail and the sitemap. Publishing the brief's URL would put two fintech
 * industry pages in competition with each other, which is the cannibalisation
 * the service page had to be corrected for a day earlier. A slug does not have
 * to contain a keyword for the page to rank on it.
 *
 * !! FOUR THINGS IN THE BRIEF WERE NOT SAFE TO PUBLISH !!
 *
 * "Deployed in 50+ Countries" as a trust badge. That figure is not in the
 * verified facts list in docs/positioning.md, and it is already flagged as
 * unconfirmed where the home page uses it.
 *
 * "Enterprise-Grade Security for Mid-Sized Budgets" as a heading. positioning
 * .md is explicit: any copy saying "enterprise" is wrong for this buyer and
 * should be rewritten. The section keeps the argument and loses the word.
 *
 * "Llama 3". Model families, never version numbers, for the reason set out in
 * content/integrations.ts.
 *
 * "thousands of manual hours". Nobody here has measured that.
 *
 * Softened rather than cut: "instantly", "eliminating", "without human
 * intervention" and "resolving tickets instantly" all appear in the brief and
 * none of them survive contact with a client whose model got something wrong.
 * Every use case here says where a person still sits.
 *
 * !! CONFIRM THE ECOSYSTEM LIST BEFORE LAUNCH !!
 *
 * Stripe, PostgreSQL, Laravel and React are already vetted in
 * content/integrations.ts.
 *
 * QuickBooks and Xero came out on 23 August 2026. The client confirmed neither
 * has been connected on a project, and content/integrations.ts is explicit
 * that this kind of list has to match what has actually been delivered. There
 * was no replacement to find: Hitasoft builds the ledger, so the honest answer
 * to where the books live is the client's own database, and PostgreSQL and
 * MySQL were already in the row saying exactly that.
 *
 * !! PLAID AND SALESFORCE ARE STILL UNCONFIRMED !!
 *
 * Same position the other two were in, and the same question has not been put
 * to the client yet. Ask before launch.
 *
 * Voice rules from docs/positioning.md apply to every string below. No em
 * dashes and no semicolons, sentences alternating short and long and never
 * landing between 11 and 14 words, and none of the banned vocabulary. The
 * brief's own hero copy carries an em dash and its section 6 carries a banned
 * word, so nothing is pasted through unedited.
 */
export const industryLandings: Record<string, IndustryLanding> = {
  "/industries/fintech-and-finance": {
    path: "/industries/fintech-and-finance",
    /*
     * Reworked 23 August 2026 from a recommendation the client brought.
     *
     * !! THE PRIMARY BROADENED FROM "for fintech SMBs" TO "for fintech" !!
     *
     * The narrower phrase is a subset of the wider one, so nothing is lost and
     * the page reaches the sector rather than only its small end. The copy
     * below still speaks to a twenty to a hundred person company, which is the
     * buyer docs/positioning.md names, and the register in
     * docs/seo-standards.md is updated to match.
     *
     * !! "automated ledger AI" WAS DECLINED !!
     *
     * It was recommended as a secondary here. It is the same phrase as
     * "AI ledger automation", which /services/financial-data-automation owns
     * and answers in an FAQ named for it. A sector page and the service page
     * that does the work are the two pages most likely to be confused for each
     * other, so the ledger terms stay with the build page and this page keeps
     * the sector terms. Rule one in docs/seo-standards.md.
     *
     * "financial AI integration" was kept but it sits next to that page's
     * "fintech AI integration". Different first word, same shape. Worth
     * watching if either title moves toward the other.
     *
     * The title lost "| Hitasoft", which app/layout.tsx already appends, and
     * the description lost an inline list of three and gained the closing
     * action it was missing.
     */
    metaTitle: "AI Automation for Fintech & Finance Teams",
    metaDescription:
      "Automate the finance work and keep the precision. AI automation for fintech that reads your documents and matches each one to the ledger. Book an audit.",
    audience: "Fintech and financial services companies",

    hero: {
      eyebrow: "Fintech & finance",
      title: "AI automation for fintech and finance teams.",
      lede: "We automate the reconciliation and the account questions that are slowing your finance operation down. Your compliance position does not move.",
      /*
       * The brief's badges were "Zero Data Retention" and "Deployed in 50+
       * Countries". The second is unverified, see the note above. Both of
       * these are things the company does by deciding to, which is the test
       * content/security.ts sets for anything in this position.
       */
      badges: ["Retention off by default", "Audit trail on every decision"],
      cta: "Book a financial AI audit",
    },

    // Written for an answer engine to lift whole, so it has to stand up with
    // none of the page around it. Also the Service schema's description.
    summary: {
      heading: "What this covers",
      body: "Hitasoft builds AI automation for fintech and financial services companies. Transactions get categorised and matched against the ledger as they arrive, and invoices and receipts become database rows without anybody retyping them. Models run with retention switched off, and open weight models can run on servers you control.",
    },

    /*
     * The brief's version of this described a company "hiring armies of
     * data-entry clerks", which is a four hundred person problem. The buyer in
     * docs/positioning.md runs twenty to a hundred people and has one
     * technical person, if that. The bottleneck is re-read from that seat.
     */
    problem: {
      heading: "Finance needs precision. People need time.",
      body: "Finance teams scale until the manual work becomes the job. The choice is another pair of hands, or asking your one technical person to build reconciliation logic instead of the product. Neither one is a good trade.",
      points: [
        {
          title: "Shared balances drift",
          body: "Multi-user expense splitting and debt calculation is fiddly logic, and it goes wrong very quietly. Two systems disagree by a small amount, and nobody notices until somebody closes the month.",
        },
        {
          title: "Paper still arrives",
          body: "Invoices and KYC documents turn up as PDFs and photographs. Somebody opens each one and types what it says into a system that could have read it itself.",
        },
        {
          title: "Support answers the same question",
          body: "Tier one account queries repeat all day and every one of them still needs a person. That person costs the same as the hard question waiting behind it in the queue.",
        },
      ],
    },

    /*
     * Full width rows rather than three cards, so each one has room for the
     * specifics under it. See the note on useCases in content/types.ts for why
     * this page stopped sharing the service page's card row.
     *
     * `detail` lines are fragments rather than sentences. They are a spec
     * list, and the sentence length rules are for prose.
     */
    useCases: {
      heading: "How we integrate AI into financial workflows",
      items: [
        {
          title: "Ledger and expense automation",
          /*
           * The multi-user split is named specifically, on feedback from 22
           * August 2026 that the copy was generic where the logic is hardest.
           *
           * It is also the pain docs/industry-page-architecture.md leads with:
           * "multi-user expense tracking and debt calculation logic is complex
           * and error-prone". Saying "shared balances recalculate themselves"
           * described the easy half. A shared household budget and a trip are
           * the two cases a fintech buyer will recognise as the ones that go
           * wrong, and naming them is what shows we have met the problem.
           */
          body: "Transactions get categorised as they arrive, and the ledger updates with no spreadsheet import at all. Where a balance is split between several people, a shared household budget or a trip, each share recalculates on every entry. Whatever does not reconcile goes to a person, and the reason is attached to it.",
          detail: [
            "Transaction feed read through your banking API",
            "Multi-user splits, with each person's running debt",
            "Exceptions queued with the reason attached",
          ],
        },
        {
          title: "Document processing",
          body: "Vision capable models read invoices and receipts and write them into your database as structured rows. A person reviews only what the model flagged as uncertain, which is a fraction of the pile.",
          detail: [
            "Invoices and receipts read as PDFs or photographs",
            "Written to your database as structured rows",
            "Low confidence extractions held back for review",
          ],
        },
        {
          title: "Account support agents",
          body: "An agent answers tier one account questions from your own knowledge base rather than from the internet. Anything outside what it has been given goes to your team, not to a guess.",
          detail: [
            "Answers drawn from your own knowledge base",
            "Balances read from the database, never generated",
            "Anything unknown handed to a person",
          ],
        },
      ],
    },

    /*
     * The catch-all, deliberately at the bottom.
     *
     * The page leads with ledgers, invoices and support because specific copy
     * converts. This is here so a lending or insurance buyer does not bounce
     * off three examples that are not theirs.
     *
     * !! IT NAMES CAPABILITIES, NOT SPECIALISMS !!
     *
     * The version suggested on 22 August 2026 read "Fraud detection and
     * anomaly monitoring" and "Automated claims processing", which assert
     * domain experience nobody here has established. Every line below instead
     * says how that corner of finance maps onto work already described further
     * up this page: documents becoming fields, records becoming searchable,
     * feeds being matched. That is true, and it is the answer a buyer in those
     * sectors actually wants, since what they are testing is whether we
     * understand the shape of their problem.
     *
     * Anything here that becomes a real specialism should get its own page
     * rather than a longer line in this grid.
     */
    breadth: {
      heading: "Where else this applies in finance",
      body: "The same work, pointed at other corners of the sector.",
      items: [
        {
          title: "WealthTech and robo-advisors",
          body: "Portfolio data is already structured, which makes it the easiest thing in finance to run predictions against. It is the reporting and the signals, not the advice.",
        },
        {
          title: "Lending and credit",
          body: "Loan files arrive as documents and have to become fields before anything can score them. Document processing does the first half of that, and a scoring model does the second.",
        },
        {
          title: "Payments",
          body: "Anomaly detection on a transaction feed is the same shape of work as reconciliation, read the other way round. It looks for what does not fit.",
        },
        {
          title: "InsurTech",
          body: "A claim is a document and a policy is a rule set, and matching them is the job. Routing and a first pass automate well, and the decision still stays with a person.",
        },
      ],
    },

    /*
     * The section the service page has no equivalent of, and the reason this
     * page reads differently from it.
     *
     * Step four is a person, and that is the argument. The brief asks for
     * "instantly resolving tickets without human intervention", and a buyer
     * who has already had an AI pilot die does not believe a pipeline with
     * nobody in it. Naming the checkpoint is what makes the other four steps
     * credible.
     *
     * Bodies stay under ten words. These are captions, and the forbidden 11 to
     * 14 word band is easy to wander into once a caption grows.
     */
    workflow: {
      heading: "Where an invoice actually goes",
      body: "Five steps. A person still sits at exactly one of them. That is the honest version of it, and it is the one worth building around.",
      steps: [
        { label: "Arrives", body: "A PDF or a photograph lands in the inbox." },
        { label: "Read", body: "A vision model lifts the supplier and the amounts." },
        { label: "Matched", body: "The entry is matched against your ledger." },
        {
          label: "Checked",
          body: "A person reviews only what came back uncertain.",
          human: true,
        },
        { label: "Posted", body: "The row is written, with the reasoning logged." },
      ],
    },

    /*
     * The brief asks for a full width dark slab here. The site has a light
     * palette and a dark mode, and a hard coded dark section inverts wrongly
     * in one of them. The home page already has an emphasis treatment for
     * exactly this, a faint tint of the foreground, and this section uses it.
     * See components/sections/security.tsx.
     *
     * Every line is something Appkodes can do by deciding to do it, with no
     * auditor involved. That rule comes from content/security.ts and it is why
     * no certification is named anywhere on this page.
     */
    security: {
      heading: "Security a finance team can sign off",
      body: "Financial records cannot leak, and a model that has seen them is a record of them. Every integration is built so that your records stay inside the systems you already control.",
      items: [
        {
          icon: ShieldCheck,
          title: "No training on your records",
          body: "Integrations run against business tier endpoints with retention turned off, so your inputs never enter a training set. Somebody has to switch that on, and we check it.",
        },
        {
          icon: Server,
          title: "Private hosting where it matters",
          body: "Open weight models can be deployed onto servers you already own, on AWS or on your own hardware. The records never leave the hardware you already control.",
        },
        {
          icon: ScrollText,
          title: "An audit trail you can read",
          body: "Every automated decision and every extracted figure is written to a log in plain language. An auditor who asks why a transaction was categorised that way gets a straight answer.",
        },
      ],
    },

    /*
     * Entity clustering, which is what the brief wants this section for. The
     * body deliberately says these are the systems finance teams bring us. It
     * is not a claim to have integrated every one, and see the confirm before
     * launch warning at the top of this file.
     *
     * Plaid and Salesforce have no mark in simple-icons and fall back to a
     * monogram, the same way OpenAI does on the service page.
     */
    ecosystem: {
      heading: "We connect AI to the stack you already run",
      body: "We build the middleware that makes your current tools intelligent. These are the systems finance teams bring us, and your own stack does not have to be on the list.",
      items: [
        { name: "Stripe", category: "Taking payments", icon: "siStripe" },
        { name: "Plaid", category: "Bank feeds and balances" },
        { name: "Salesforce", category: "Accounts and contacts" },
        { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
        { name: "MySQL", category: "Older ledgers and reports", icon: "siMysql" },
        { name: "Laravel", category: "PHP systems you already run", icon: "siLaravel" },
        { name: "React", category: "Screens your team uses", icon: "siReact" },
        { name: "Python", category: "Where the automation lives", icon: "siPython" },
        { name: "n8n", category: "Steps joined into a workflow", icon: "siN8n" },
      ],
    },

    /*
     * The hero visual. Not the architecture diagram, which is the service
     * page's and was the single biggest reason the two openings looked alike.
     *
     * These four rows are an illustration of a screen. They are not anybody's
     * books, and they are written so nobody could mistake them for a client's.
     * The flagged row is the point: three categorised on arrival, one held for
     * a person, which is the same argument the workflow section makes.
     */
    /*
     * Renamed from `ledger` on 23 August 2026, along with its field names. See
     * the `record` type in content/types.ts: a delivery note and a
     * consultation record are the same four columns, and the next five
     * industry pages should not be filling in a field called `amount`.
     *
     * No `columns` here. A date, a payee and a sum need no headings, and the
     * pages that follow will want them.
     */
    /*
     * Eight rows rather than four, from 23 August 2026. Four filled a fifth of
     * the field and left the panel reading as mostly empty texture, so the
     * argument the colour makes was too quiet to carry the hero.
     *
     * Still exactly one flagged. One exception in eight is a better story than
     * one in four, because the claim is that most of this settles itself.
     *
     * Invented names on purpose. See the note on `record` in content/types.ts:
     * these look like nobody's real books, and no supplier here is a company
     * anybody could go and check.
     */
    record: {
      layout: "field",
      caption:
        "A ledger with eight transactions. Seven have been categorised automatically, and the eighth is held back for a person to review.",
      rows: [
        { when: "12 Mar", what: "Northgate Supplies", value: "1,240.00", status: "Inventory" },
        { when: "12 Mar", what: "Cloud hosting", value: "318.40", status: "Software" },
        { when: "12 Mar", what: "Payout, card takings", value: "4,820.00", status: "Income" },
        {
          when: "13 Mar",
          what: "Unlabelled transfer",
          value: "900.00",
          status: "Review",
          flagged: true,
        },
        { when: "13 Mar", what: "Ferry, client visit", value: "62.00", status: "Travel" },
        { when: "13 Mar", what: "Office rent, March", value: "2,100.00", status: "Premises" },
        { when: "14 Mar", what: "Courier, 14 parcels", value: "96.20", status: "Logistics" },
        { when: "14 Mar", what: "Design subscription", value: "54.99", status: "Software" },
      ],
    },

    faqs: [
      {
        question: "How can AI automate shared expenses and debt calculation?",
        answer:
          "The integration reads the transaction feed through your banking API and categorises each line with a model. Every member's balance in the shared ledger recalculates from there. Nobody types a number in.",
      },
      {
        question: "Is it safe to use ChatGPT for financial data?",
        answer:
          "Consumer ChatGPT is not safe for financial records, and it is not what we build on. A business tier endpoint with retention switched off processes the data and then keeps nothing at all. Open weight models can run on hardware you own.",
      },
      {
        question: "How long does a financial AI integration take?",
        answer:
          "Three weeks for a single workflow, audit to live. The audit comes first and it is where the reconciliation rules get written down, because a model cannot infer a policy nobody has stated.",
      },
      {
        question: "Will an AI agent give a customer the wrong balance?",
        answer:
          "Not from a model guessing, because the agent reads the balance from your database rather than generating it. Anything it cannot answer from your own records gets handed to a person on your team.",
      },
      {
        /*
         * Added 23 August 2026 to carry "fintech AI development", which was a
         * recommended secondary with nothing on the page answering it.
         *
         * It also draws the line to /services/fintech-saas-ai-mvp, which owns
         * "fintech AI MVP development". The qualifier is what keeps the two
         * apart, so the answer says plainly which page is which.
         */
        question: "Do you do fintech AI development, or only automation?",
        answer:
          "Both, and they are different projects. This page is about automating what you already run. A financial product built from nothing is an MVP, and that has its own page under services.",
      },
      {
        question: "Do we need to replace our accounting system?",
        answer:
          "No. The automation sits beside what you run and talks to it through the API it already exposes. Your team opens the same books on Monday.",
      },
      {
        question: "What does AI automation for fintech cost?",
        answer:
          "The audit puts a number on it before you commit, and there is no open ended discovery phase. You pay for the middleware and the API work rather than for a new platform.",
      },
    ],
  },
  /*
   * The second industry page, 23 August 2026, from a recommendation the client
   * brought. It reached the right title budget on its own, which is the first
   * one to do so.
   *
   * !! FOUR THINGS IN IT ARE ALREADY SETTLED QUESTIONS !!
   *
   * Edge AI. The brief puts vision models running locally in two places, a
   * pipeline step and a security column. The client confirmed on 23 August
   * 2026 that no vision model has run on a device for a client, and that same
   * day it was cut from /services/computer-vision-quality-control along with
   * its keyword. It is not coming back on a sector page.
   *
   * "Gadgetly". Named as the dashboard stock levels update into. It appears
   * nowhere in this repository except two comments recording the last two
   * times it was cut, and docs/positioning.md line 215 forbids naming
   * companies that are not confirmed clients. Third time of asking.
   *
   * Shopify and Square. Not in content/integrations.ts, whose warning says the
   * list has to match what has actually been delivered. Already refused on
   * /services/smart-inventory-retail-mvp.
   *
   * "Talk to Sales" as a button. docs/positioning.md removed it from this site
   * for the same reason it removed "enterprise".
   *
   * Also cut: "logged flawlessly", "without human error", "Seamless Stack
   * Connections", and "Digitize your warehouse in weeks". The first two are
   * absolutes on a page whose whole workflow section exists to say a person
   * still checks the uncertain ones, the third is a banned word, and the
   * fourth is a duration nobody has measured.
   *
   * !! WATCH THE MVP CHILD !!
   *
   * /services/smart-inventory-retail-mvp owns "smart inventory AI MVP" and
   * "AI stock prediction development". This page's "smart inventory
   * management" and "automated stock forecasting" sit beside both. The
   * qualifier is what keeps them apart: that page sells a trial build and this
   * one sells the sector. Neither of its phrases appears here.
   */
  "/industries/retail-and-inventory": {
    path: "/industries/retail-and-inventory",
    /* 39 characters. The brief proposed 36 and was already inside the budget,
     * but its title did not contain the primary keyword in order. */
    metaTitle: "Retail AI Inventory Automation & Vision",
    metaDescription:
      "Stock decisions get made on numbers from last week. Retail AI inventory automation reads what arrives and warns you before a line runs out. Book an audit.",
    audience: "Retail and wholesale businesses holding physical stock",

    hero: {
      eyebrow: "Retail & inventory",
      title: "The count was right on Monday.",
      lede: "Stock records are accurate on the day somebody counts them, and they drift every day after that. Buying then happens on memory, and the cost lands twice: capital stuck in lines nobody wants, and sales lost on the ones that moved.",
      badges: ["Reads a delivery from a photograph", "Forecasts on your own sales history"],
      cta: "Book an inventory audit",
    },

    summary: {
      heading: "What retail AI inventory automation is",
      body: "Retail AI inventory automation means the stock record updates itself from what actually arrives and what actually sells. A vision model reads a delivery note or a box rather than somebody keying it in. Forecasting then runs against your own sales history, which is what turns a reorder point into a date somebody can act on.",
    },

    problem: {
      heading: "Counting by hand, buying on instinct",
      body: "Retail runs on a number that was true once. Between counts the system and the shelf move apart, and the ordering happens on whatever the buyer remembers. Both cost money. Only one is visible.",
      points: [
        {
          title: "The count ages from the moment it ends",
          body: "A cycle count is accurate on the day. Every day after, the record and the shelf drift apart.",
        },
        {
          title: "Reordering lives in somebody's head",
          body: "Whoever knows which lines move is going on experience. That knowledge walks out at five o'clock.",
        },
        {
          title: "Dead stock never announces itself",
          body: "Capital sitting in slow lines is invisible until a valuation. By then the money went months ago.",
        },
      ],
    },

    useCases: {
      heading: "How we put AI into a stockroom",
      items: [
        {
          title: "Intake read by camera",
          body: "A delivery arrives and somebody photographs it. Codes, quantities and serial strings come off it as rows.",
          detail: [
            "Ordinary phone and bench cameras, not scanning hardware",
            "Serial strings that get mistyped by hand",
            "Rows land against the purchase order they belong to",
          ],
        },
        {
          title: "Stockouts predicted, not reported",
          body: "Selling rate is watched against supplier lead time. When those cross, the gap is coming.",
          detail: [
            "Forecasts run on your own sales history",
            "Lead times per supplier, not one figure for all",
            "A draft order, held for somebody to sign",
          ],
        },
        {
          title: "Capital shown where it is stuck",
          body: "Holding cost and falling value are tracked per line. Slow lines stop being a year end surprise.",
          detail: [
            "Value against age, per line",
            "What is tied up, and in what",
            "Read from the records you already keep",
          ],
        },
      ],
    },

    breadth: {
      heading: "Where else this lands in retail",
      body: "The same reading and forecasting turns up in jobs that look unrelated until you notice they are all somebody retyping or somebody guessing.",
      items: [
        {
          title: "Routing new lines",
          body: "A new product is categorised from the text on its packaging rather than by hand.",
        },
        {
          title: "Balancing between shops",
          body: "Stock moves toward the branch that will sell it first.",
        },
        {
          title: "Checking returns",
          body: "A returned item is compared against what left, so damage is found at the bench.",
        },
        {
          title: "Chasing suppliers",
          body: "A shortfall triggers the call or the email, with the lead time written back afterwards.",
        },
      ],
    },

    workflow: {
      heading: "Where a packing slip actually goes",
      body: "Four steps. A person still sits at exactly one of them, and it is the step that decides whether the other three are worth having.",
      steps: [
        { label: "Photographed", body: "Somebody snaps the note or the box at goods inwards." },
        { label: "Read", body: "A vision model lifts the codes, counts and serials." },
        { label: "Matched", body: "Lines are checked against the order that is pending." },
        {
          label: "Confirmed",
          body: "A person looks at the shortfalls and nothing else.",
          human: true,
        },
      ],
    },

    security: {
      heading: "What a retail team will want asked",
      body: "Stock records carry your margins and your supplier pricing, which makes where they go a question worth settling before anything is built.",
      items: [
        {
          icon: ShieldCheck,
          title: "No training on your records",
          body: "Integrations run against business tier endpoints with retention turned off, so what you send never enters a training set. Somebody has to switch that on, and we check it.",
        },
        {
          icon: Server,
          title: "It reads what you already run",
          body: "The pipeline queries your stock system through its API. Nothing is migrated to make room.",
        },
        {
          icon: ScrollText,
          title: "Every count is traceable",
          body: "A line in the system points back to its photograph. A disputed figure gets looked at rather than argued about, which is a different conversation.",
        },
      ],
    },

    ecosystem: {
      heading: "We connect AI to the stack you already run",
      body: "These are the systems stockrooms bring us, and your own does not have to be on the list. Nothing here is a requirement.",
      items: [
        { name: "Vision models", category: "Notes, boxes and labels" },
        { name: "Claude", category: "Matching a line to your catalogue", icon: "siClaude" },
        { name: "PostgreSQL", category: "Stock levels and history", icon: "siPostgresql" },
        { name: "MySQL", category: "Older stock systems", icon: "siMysql" },
        { name: "Python", category: "The forecasting underneath", icon: "siPython" },
        { name: "Flutter", category: "The app at goods inwards", icon: "siFlutter" },
        { name: "React", category: "Dashboards your team opens", icon: "siReact" },
        { name: "n8n", category: "What runs when a line runs low", icon: "siN8n" },
        { name: "Redis", category: "Alerts and scheduling", icon: "siRedis" },
      ],
    },

    faqs: [
      {
        question: "Do we need scanning hardware?",
        answer:
          "Not to start. A phone camera and a vision model read codes off a box well enough to prove whether the approach works on your stock. Dedicated scanners are faster at volume, and that is a decision worth making once you have seen it run.",
      },
      {
        question: "Will it work with the stock system we already have?",
        answer:
          "If it has an API, the pipeline reads and writes straight through it without any export step. Where there is none, we look at what it exports. Replacing a stock system to get better forecasting is a large project solving the wrong problem.",
      },
      {
        question: "How far ahead can it predict a stockout?",
        answer:
          "As far ahead as your supplier lead time, which is the number that actually matters. A warning after the reorder window closes is not one. What it needs is sales history and a lead time per supplier rather than one figure for everything.",
      },
      {
        question: "Does smart inventory management work on a small catalogue?",
        answer:
          "Better than people expect. Lead time matters more than volume. What forecasting needs is history rather than scale, and a few years of consistent sales on a few hundred lines is usually enough.",
      },
      {
        question: "What does retail vision AI actually read?",
        answer:
          "Printed codes, quantities and serial strings, lifted off a delivery note or straight off the packaging. What it is poor at is anything it has no examples of, and that gets flagged for a person rather than guessed.",
      },
      {
        question: "Is automated stock forecasting different from a reorder point?",
        answer:
          "A reorder point is a number somebody set once and it stays where it was put. Forecasting recalculates as the selling rate changes, so a line that suddenly moves faster is caught before the shelf empties.",
      },
    ],

    record: {
      layout: "shelf",
      caption:
        "A goods inwards queue with eight deliveries. Seven have been booked in automatically, and the eighth is held back because the count did not match the order.",
      rows: [
        { when: "12 Mar", what: "Pallet 4417", value: "24 units", status: "Booked" },
        { when: "12 Mar", what: "Cable reels, box 8", value: "60 units", status: "Booked" },
        { when: "12 Mar", what: "Returns, bench", value: "3 units", status: "Checked" },
        {
          when: "13 Mar",
          what: "Pallet 4419, short",
          value: "18 / 24",
          status: "Hold",
          flagged: true,
        },
        { when: "13 Mar", what: "Display units, wall", value: "12 units", status: "Booked" },
        { when: "13 Mar", what: "Spares, drawer", value: "140 units", status: "Booked" },
        { when: "14 Mar", what: "Chargers, mixed", value: "96 units", status: "Booked" },
        { when: "14 Mar", what: "Packaging, flat", value: "200 units", status: "Booked" },
      ],
    },
  },
  /*
   * Third industry page, 23 August 2026. The most claim heavy brief in the
   * project, and the only one in a regulated field, so the refusals matter
   * more here than anywhere else.
   *
   * !! NAMING HIPAA AND GDPR IS CLEARED. CLAIMING TO GRANT THEM IS NOT !!
   *
   * docs/positioning.md line 213 barred naming these regimes until the client
   * confirmed. The client cleared it on 23 August 2026 and that rule is
   * updated to match, so this page names HIPAA and GDPR as the regimes the
   * architecture is built around.
   *
   * The distinction that survives, and it is not pedantry: HIPAA compliance
   * attaches to a covered entity rather than to a software supplier, and there
   * is no HIPAA certificate to hold, only attestation and a Business Associate
   * Agreement. So the page says the build is designed for those regimes and
   * that the practice's own position stays its own. That is defensible, and it
   * is what a reader who has signed a DPA expects to see.
   *
   * !! THE BAA QUESTION IS STILL OPEN !!
   *
   * If Appkodes signs Business Associate Agreements, that is the strongest
   * sentence this page could carry and it is not here yet, because signing one
   * is an operational commitment rather than a copy decision.
   *
   * The brief's other compliance lines did not survive. "HIPAA-compliant
   * OpenAI" states a vendor's posture as our own, "fully compliant with app
   * store and health data regulations" promises an outcome no supplier
   * controls, and "guarantee" sat beside both.
   *
   * !! THREE SETTLED QUESTIONS CAME BACK, AGAIN !!
   *
   * Edge AI in the pipeline, which the client confirmed has never run for a
   * client. "Hallucination-free" vector search, refused on
   * /services/data-engineering-vector-databases because retrieval reduces
   * hallucination and does not remove it. "Breeze through the Google Play Data
   * safety forms", which is an outcome no supplier controls. Also "Flawless
   * UX", "enterprise API endpoints", "guarantee", and a "Talk to Sales"
   * button that docs/positioning.md removed from this site.
   *
   * !! THREE CAPABILITY CLAIMS WERE SOFTENED, NOT CUT !!
   *
   * The brief has the AI verifying insurance, suggesting billing and
   * diagnostic codes, and monitoring patient recovery. The first needs payer
   * integrations nothing here claims. The second and third are close enough to
   * clinical judgement that stating them plainly would be describing a
   * regulated product. They survive as collecting intake details, drafting
   * codes for a coder to confirm, and sending scheduled follow up messages.
   *
   * !! TELEHEALTH MOVES HERE FROM MEDIA AND COMMUNITIES !!
   *
   * docs/hitasoft_ai_architecture_strategy.md gives "secure AI for telehealth
   * consulting" to /industries/media-and-communities, which is an odd home for
   * it. This page takes telehealth. That page must drop the phrase when it is
   * built, the same way it has to drop "compliant AI app development".
   */
  "/industries/healthcare-and-consulting": {
    path: "/industries/healthcare-and-consulting",
    /* 37 characters. The brief's own title was inside the budget at 41 but did
     * not carry the primary keyword in order. */
    metaTitle: "Healthcare AI Automation & Telehealth",
    metaDescription:
      "Practitioners spend the evening writing up the day. Healthcare AI automation drafts the note and leaves the clinician to check every word of it. Book a review.",
    audience: "Clinical practices, telehealth platforms and consulting teams",

    hero: {
      eyebrow: "Healthcare & consulting",
      title: "The notes take longer than the consultation.",
      lede: "Every practitioner knows the evening that follows a full day. The work that pays is the hour in the room, and the hour after it is spent writing down what happened.",
      badges: ["A clinician checks every note", "Runs on infrastructure you control"],
      cta: "Book a clinical AI review",
    },

    summary: {
      heading: "What healthcare AI automation is",
      body: "Healthcare AI automation means the writing up happens as the session does, rather than afterwards. Speech from a consultation is transcribed and drafted into the shape your notes already take, and a clinician reads it before anything is filed. The point is not fewer people in the loop. It is that they are checking rather than typing.",
    },

    problem: {
      heading: "The hour after the hour",
      body: "Clinical time gets spent twice. Once in the room, once writing it down. The second hour is unbilled, it happens when everybody is tired, and it is the first thing to slip when a day runs long. What slips is the record somebody relies on later.",
      points: [
        {
          title: "Charting happens after hours",
          body: "Notes get written at the end of the day rather than at the end of the session. Detail is lost between the two.",
        },
        {
          title: "Intake is asked twice",
          body: "A patient gives their history on a form, then gives it again out loud in the room. Neither copy is the one the clinician reads.",
        },
        {
          title: "Nothing is searchable afterwards",
          body: "Past consultations sit as files nobody can query. The knowledge is there and it is not reachable.",
        },
      ],
    },

    useCases: {
      heading: "How we put AI into a clinical workflow",
      items: [
        {
          title: "Sessions transcribed as they happen",
          body: "A consultation is transcribed and then summarised into the shape your own clinical notes already take. The clinician edits rather than composes.",
          detail: [
            "Audio can be transcribed on hardware you own",
            "Drafted into your own note structure",
            "Nothing is filed until a clinician signs it",
          ],
        },
        {
          title: "Intake collected before the appointment",
          body: "A voice or text agent gathers history and reason for visit ahead of the session, so the room starts further along.",
          detail: [
            "Answers land in the record before the appointment",
            "Routed to the right clinician's calendar",
            "Anything unclear is left for a person to ask",
          ],
        },
        {
          title: "Past consultations made searchable",
          body: "Transcripts and guidelines are indexed so staff can find the passage rather than the file. Answers cite what they came from.",
          detail: [
            "Retrieval over your own material only",
            "Every answer points at its source passage",
            "Where nothing matches, it says so",
          ],
        },
      ],
    },

    breadth: {
      heading: "Where else this lands in a practice",
      body: "The same transcription and retrieval turn up in jobs that look unrelated until you notice they are all somebody typing up what was already said.",
      items: [
        {
          title: "Coding, drafted for review",
          body: "Structured notes suggest candidate codes. A coder confirms them, because that decision is theirs.",
        },
        {
          title: "Follow up messages",
          body: "Scheduled check ins go out after a session, with replies routed to a person rather than answered.",
        },
        {
          title: "Coaching and therapy platforms",
          body: "The same transcription and progress notes, on platforms that are not clinical but keep records like it.",
        },
        {
          title: "Submission paperwork",
          body: "The written account of what data you collect, which a store review and a compliance officer both ask for.",
        },
      ],
    },

    workflow: {
      heading: "Where a consultation note actually goes",
      body: "Four steps. A clinician sits at the last one and nothing reaches the record without passing them.",
      steps: [
        { label: "Intake", body: "An agent collects history before the appointment." },
        { label: "Transcribed", body: "The session is turned into text as it runs." },
        { label: "Drafted", body: "A model shapes it into the note format you use." },
        {
          label: "Signed",
          body: "A clinician reads it, corrects it and files it.",
          human: true,
        },
      ],
    },

    security: {
      heading: "What a clinical team will want asked",
      body: "This is the section that decides whether the rest is worth reading, so it says what is architecture and what is not.",
      items: [
        {
          icon: Server,
          title: "The records can stay inside",
          body: "An open weight model runs on your own hardware or your own cloud account, and no request leaves it. Where a hosted endpoint is acceptable, retention is switched off. We check that rather than trusting a default.",
        },
        {
          icon: ScrollText,
          title: "Written down, field by field",
          body: "Every field a model reads is documented, with where it goes and how long it stays. That document is what a reviewer or a compliance officer asks for, and it exists before the build starts.",
        },
        {
          icon: ShieldCheck,
          title: "Built for HIPAA and GDPR workflows",
          body: "The architecture is designed around what those regimes ask for. Records stay where you put them, access is logged, and every field is written down. Compliance attaches to your practice rather than to a supplier, and this is the half a supplier can affect.",
        },
      ],
    },

    ecosystem: {
      heading: "We connect AI to the stack you already run",
      body: "These are the pieces a clinical build tends to need, and your own stack does not have to be on the list. Nothing here is a requirement.",
      items: [
        { name: "Whisper", category: "Transcription that can run privately" },
        { name: "Claude", category: "Drafting notes from a transcript", icon: "siClaude" },
        { name: "Llama", category: "Open weights, hosted by you", icon: "siMeta" },
        { name: "pgvector", category: "Past consultations, searchable" },
        { name: "PostgreSQL", category: "Where the records sit", icon: "siPostgresql" },
        { name: "Python", category: "The pipeline and its tests", icon: "siPython" },
        { name: "Flutter", category: "The app patients use", icon: "siFlutter" },
        { name: "Twilio", category: "Calls and messages", icon: "siTwilio" },
        { name: "Docker", category: "Same on your hardware or ours", icon: "siDocker" },
      ],
    },

    faqs: [
      {
        question: "Are you HIPAA compliant?",
        answer:
          "The build is designed for it. Patient records stay on infrastructure you control, every field a model touches is documented, and access is logged. HIPAA attaches to your practice rather than to a supplier, so the honest answer is that we make yours defensible rather than granting it.",
      },
      {
        question: "Does patient data reach a third party?",
        answer:
          "Only if you decide it can. An open weight model on your own hardware means no request leaves your network at all. Where a hosted endpoint is acceptable, retention is switched off so inputs are processed and not kept. Somebody has to configure that rather than assume it.",
      },
      {
        question: "How accurate is the transcription in a real consultation?",
        answer:
          "Good, and worse than the marketing suggests once accents and crosstalk are in the room. That is why a clinician signs every note. Tuning on your own recordings is the fix where the terminology is specialised, and it is worth measuring on your audio before anybody commits.",
      },
      {
        question: "Does telehealth AI integration work with our video platform?",
        answer:
          "If it exposes the audio stream or a recording, yes. The transcription sits beside the call rather than inside it, which means the platform you use stays the platform you use. Where the audio cannot be reached, week one establishes it.",
      },
      {
        question: "What makes secure medical AI apps different to build?",
        answer:
          "The data decisions come first rather than last. What is collected, where it sits and who can reach it get settled before a feature is written. Retrofitting that is the expensive path. It is also the part a review examines.",
      },
      {
        question: "Can automated patient intake replace the form?",
        answer:
          "It replaces the retyping rather than the form. A patient answers in their own words and the answers arrive structured in the record, so the clinician reads a history rather than a transcript. Anything ambiguous is left for a person to ask.",
      },
    ],

    record: {
      layout: "day",
      caption:
        "A morning of consultations. Five have been drafted into notes automatically and one is held back because the audio was unclear. The long gap before 13:20 is time nobody booked.",
      /*
       * Six, not eight, and the day stops at lunch.
       *
       * The `day` layout spaces these by the real interval between them, so
       * the row count and the span decide whether the panel is a hero or a
       * scroll. Eight appointments across six hours needed either nine hundred
       * pixels or a clamp so tight that the lunch hour looked the same as a
       * half hour turnaround, which loses the whole argument. Six across four
       * hours fits in about the height of the fintech field and keeps the hole
       * obvious. Adding a row here makes the panel taller. Check it.
       */
      rows: [
        { when: "09:10", what: "Follow up, 4412", value: "22 min", status: "Drafted" },
        { when: "09:40", what: "New patient, 4413", value: "40 min", status: "Drafted" },
        { when: "10:30", what: "Review, 4415", value: "18 min", status: "Drafted" },
        {
          when: "11:05",
          what: "Consult, 4416",
          value: "35 min",
          status: "Unclear",
          flagged: true,
        },
        { when: "11:50", what: "Follow up, 4418", value: "15 min", status: "Drafted" },
        { when: "13:20", what: "New patient, 4420", value: "45 min", status: "Drafted" },
      ],
    },
  },

  "/industries/media-and-communities": {
    path: "/industries/media-and-communities",
    /* 40 characters. The brief's own title was "AI Automation for Media &
     * Communities" at 37, inside the budget but carrying none of the primary
     * keyword in order. This carries `community app AI automation` whole. */
    metaTitle: "Community App AI Automation & Moderation",
    metaDescription:
      "Moderation queues grow faster than the teams reading them. Community app AI automation reads every post and sends the hard calls to a person. Book a review.",
    audience: "Community platforms, social apps and media businesses",

    hero: {
      eyebrow: "Media & communities",
      title: "The worst post of the day arrives at 2am.",
      lede: "A community keeps its own hours and never sleeps. Your moderators do sleep, which is why the post that does real damage is the one that landed overnight.",
      badges: ["A moderator decides the close calls", "Posts never become training data"],
      cta: "Book a moderation review",
    },

    summary: {
      heading: "What community app AI automation is",
      body: "Community app AI automation means every post is read the moment it lands rather than whenever a moderator gets to it. A model scores it against the guidelines you wrote. Everything doubtful queues for a person, because a wrong removal costs more trust than a slow one.",
    },

    problem: {
      heading: "Nobody can read it all",
      body: "A platform where people talk grows in two directions. More members means more posts, and more posts means more of the few that should never have gone up. The team reading them does not grow at that rate.",
      points: [
        {
          title: "The queue never empties",
          body: "Reports arrive faster than they are read, so the backlog is the normal state rather than a bad week.",
        },
        {
          title: "The feed shows the newest, not the best",
          body: "A feed ordered by recency buries the post worth reading under twelve that are not.",
        },
        {
          title: "Media carries rules the rest of the app never had",
          body: "A camera and a microphone bring consent and storage questions that a text feed never raised.",
        },
      ],
    },

    useCases: {
      heading: "How we put AI into a community workflow",
      items: [
        {
          title: "Every post read before it lands",
          body: "A model scores each post against your own community guidelines. The clear ones publish at once and the rest wait for a moderator to read them.",
          detail: [
            "Scored against guidelines you wrote",
            "Borderline posts queue for a person",
            "Images and audio on the same path",
          ],
        },
        {
          title: "A feed ordered by what holds people",
          body: "One model keeps the feed safe and orders it. Posts surface on how members actually respond rather than on the minute they were written.",
          detail: [
            "Ranked on what members did, not a guess",
            "Your own rules decide what gets lifted",
            "Measured against the feed you run now",
          ],
        },
        {
          title: "Audio and video handled as content",
          body: "Live rooms and uploaded clips get transcribed, so spoken content sits under the same rules as text. What a model cannot hear clearly goes to a person.",
          detail: [
            "Transcription can run on your own hardware",
            "Group events searchable once they end",
            "Unclear audio is queued rather than guessed",
          ],
        },
      ],
    },

    breadth: {
      heading: "Where else this lands on a platform",
      body: "The same reading and scoring turn up in jobs that look unrelated until you notice each one is somebody judging a post.",
      items: [
        {
          title: "Closed testing before release",
          body: "A private track and a real cohort, so social features get used before the public sees them.",
        },
        {
          title: "Learning and recitation communities",
          body: "Speech compared against a reference text, with the score shown to a teacher rather than a learner.",
        },
        {
          title: "Reports triaged before a person reads",
          body: "Member reports get grouped by what they are about, so a moderator reads one thread rather than forty.",
        },
        {
          title: "The data safety declaration",
          body: "The written account of what your app collects, which a store review asks for before it asks anything else.",
        },
      ],
    },

    workflow: {
      heading: "Where a member's post actually goes",
      body: "Four steps. A moderator sits at the last one, and the queue they read is short by design.",
      steps: [
        { label: "Posted", body: "A member posts something to the feed." },
        { label: "Read", body: "A model scores it against your guidelines." },
        { label: "Sorted", body: "Clear posts publish. The doubtful ones wait." },
        {
          label: "Judged",
          body: "A moderator reads the queue and decides.",
          human: true,
        },
      ],
    },

    security: {
      heading: "What a platform owner will want asked",
      body: "Three answers a platform owner needs before anything else. Each one is something we decide rather than something we ask you to take on trust.",
      items: [
        {
          icon: Server,
          title: "Member posts stay your material",
          body: "Content people put on your platform never trains a model. Where a hosted endpoint is used, retention gets switched off and the setting is checked on the account rather than assumed.",
        },
        {
          icon: ScrollText,
          title: "The data safety form matches the build",
          body: "Reviews reject a declaration that does not match the app. The form is written from the code rather than from memory, and every permission the build requests is listed before submission.",
        },
        {
          icon: ShieldCheck,
          title: "Consent asked before the microphone opens",
          body: "Camera and microphone permission is requested at the moment it is needed, with the reason on screen. That is what GDPR asks for and it is also what stops a member reporting your app.",
        },
      ],
    },

    ecosystem: {
      heading: "We connect AI to the stack you already run",
      body: "These are the pieces a community platform tends to need. Nothing here is a requirement. Your own stack is where the work starts.",
      items: [
        { name: "Vision models", category: "Images checked before they publish" },
        { name: "Whisper", category: "Rooms and clips into text" },
        { name: "Llama", category: "Moderation on your own server", icon: "siMeta" },
        { name: "Claude", category: "The calls that need context", icon: "siClaude" },
        { name: "Redis", category: "The queue behind the feed", icon: "siRedis" },
        { name: "PostgreSQL", category: "Posts, members and reports", icon: "siPostgresql" },
        { name: "pgvector", category: "Past threads, searchable" },
        { name: "Flutter", category: "The app members use", icon: "siFlutter" },
        { name: "AWS", category: "Media storage and delivery" },
        { name: "Docker", category: "One build, every environment", icon: "siDocker" },
      ],
    },

    faqs: [
      {
        question: "How accurate is social feed AI moderation?",
        answer:
          "Good on the obvious and unreliable on the rest, which is why the borderline calls queue rather than resolve. Sarcasm and in-jokes are where a general model fails. The fix is tuning on your own moderation history, and it is worth measuring on your posts before anybody commits.",
      },
      {
        question: "Can the model remove posts on its own?",
        answer:
          "It can, and on most platforms it should not. Automatic removal is right for the unambiguous cases and wrong everywhere else, because a wrong removal costs more trust than a slow one. Where that line sits is your decision rather than ours.",
      },
      {
        question: "Will automated community guidelines match the ones we wrote?",
        answer:
          "They are your guidelines rather than a general safety policy. Each rule you have written becomes something the model is scored against, and the ones it fails in testing get rewritten. A rule your moderators apply inconsistently will not work here.",
      },
      {
        question: "Does media platform AI integration mean replacing our app?",
        answer:
          "No. The moderation and ranking sit behind your existing app as services it calls, so the product members use stays the product they know. Where an app was never built to expose its feed logic, week one establishes what that costs.",
      },
      {
        question: "Will this get our app through store review?",
        answer:
          "It removes the reasons a build can cause, and it does nothing about the rest. A declaration that matches the build and permissions asked at the right moment are what most rejections are actually about. No supplier controls what a reviewer decides on the day.",
      },
      {
        question: "What does this cost to run once it is live?",
        answer:
          "Cost lands per post rather than per month. A small open weight model on your own hardware handles the volume cheaply, and the larger model gets called only on posts it cannot settle. That split is where the running cost is decided.",
      },
    ],

    record: {
      layout: "stream",
      caption:
        "An overnight moderation queue with eight posts. Seven were cleared in under four seconds, and the eighth is held for a moderator to read in the morning.",
      rows: [
        { when: "02:14", what: "Photo, #forsale", value: "1.2s", status: "Cleared" },
        { when: "02:31", what: "Reply, #support", value: "0.6s", status: "Cleared" },
        { when: "03:06", what: "Link, #general", value: "0.9s", status: "Cleared" },
        {
          when: "03:48",
          what: "Clip, #showcase",
          value: "2.4s",
          status: "Held",
          flagged: true,
        },
        { when: "04:12", what: "Photo, #trades", value: "1.0s", status: "Cleared" },
        { when: "04:55", what: "Post, #welcome", value: "0.7s", status: "Cleared" },
        { when: "05:20", what: "Audio, #voice", value: "3.1s", status: "Cleared" },
        { when: "06:02", what: "Reply, #general", value: "0.5s", status: "Cleared" },
      ],
    },
  },

  "/industries/edtech-and-learning": {
    path: "/industries/edtech-and-learning",
    /* 41 characters. The brief's title was "AI Automation for EdTech & Learning
     * Platforms" at 45, inside the budget but leading with the generic half.
     * This carries `edtech AI automation` whole and in order. */
    metaTitle: "EdTech AI Automation & Learning Platforms",
    metaDescription:
      "A cohort of recordings takes a teacher all evening. EdTech AI automation scores each one in seconds and leaves the teacher the borderline ones. Book a review.",
    audience: "Course platforms, tutoring businesses and school software teams",

    hero: {
      eyebrow: "EdTech & learning",
      title: "Feedback arrives a week after the mistake.",
      lede: "A student records a passage on Monday and hears what was wrong with it on Friday. By then they have practised the mistake four more times.",
      badges: ["A teacher sets what counts as right", "Recordings never become training data"],
      cta: "Book a learning AI review",
    },

    summary: {
      heading: "What edtech AI automation is",
      body: "EdTech AI automation means a submission gets a response while the student is still thinking about it. Audio is transcribed and compared against what the exercise asked for, and a score comes back in seconds. A teacher sets the standard and reads the borderline ones.",
    },

    problem: {
      heading: "Marking is the bottleneck",
      body: "A learning platform can enrol a thousand students this week. It cannot hire a hundred teachers in the same week, and marking is the one part that does not get cheaper as you grow. Feedback slows down exactly when more people are waiting.",
      points: [
        {
          title: "Feedback arrives too late to use",
          body: "A correction lands after the habit has set, which is the one moment it cannot do its job.",
        },
        {
          title: "Spoken work quietly stops being set",
          body: "Exercises that need marking by ear are the first ones a busy course stops assigning.",
        },
        {
          title: "Cohorts go unwatched",
          body: "A course forum is a small community with nobody paid to read it after the first month.",
        },
      ],
    },

    useCases: {
      heading: "How we put AI into a learning workflow",
      items: [
        {
          title: "Spoken work marked by ear, at scale",
          body: "A recording is transcribed and compared against the reference text, then scored on the things the exercise was set for. Your rubric decides, and a teacher can override any score.",
          detail: [
            "Transcription can run on your own hardware",
            "Scored against a rubric you wrote",
            "A teacher can override any result",
          ],
        },
        {
          title: "Feedback written while it still matters",
          body: "The score comes with a sentence about what to fix rather than a number on its own. Students get it in seconds, and the teacher sees the pattern across a cohort instead of one script at a time.",
          detail: [
            "Written in the words your course uses",
            "Cohort patterns, not one script at a time",
            "Held back where the model is unsure",
          ],
        },
        {
          title: "Course forums read as they fill",
          body: "A cohort forum gets read the way a moderator would read it, so an unanswered question or an unkind reply surfaces the same day. Moderation inside a course, not across a public feed.",
          detail: [
            "Unanswered questions surface the same day",
            "Tone judged against your course guidelines",
            "A tutor sees the queue, not every post",
          ],
        },
      ],
    },

    breadth: {
      heading: "Where else this lands on a learning platform",
      body: "Once a platform can hear a submission and score it, several other jobs turn out to be the same job wearing a different name.",
      items: [
        {
          title: "What to set next",
          body: "Past scores suggest the lesson a student should get next, and a tutor decides whether that is right.",
        },
        {
          title: "Pronunciation coaching",
          body: "The same audio pipeline, aimed at one sound.",
        },
        {
          title: "Educator dashboards",
          body: "Cohort progress on a screen a tutor actually opens, built from the scores rather than from a separate export.",
        },
        {
          title: "Course material, made searchable",
          body: "Past lessons and transcripts indexed, so a student finds the passage rather than the video.",
        },
      ],
    },

    workflow: {
      heading: "Where a student submission actually goes",
      body: "Four steps. A teacher sits at the last one, and the standard everything is judged against is theirs.",
      steps: [
        { label: "Submitted", body: "A student records a passage or writes an answer." },
        { label: "Transcribed", body: "Audio becomes text on hardware you choose." },
        { label: "Scored", body: "The model marks it against your rubric." },
        {
          label: "Signed off",
          body: "A teacher checks the borderline ones.",
          human: true,
        },
      ],
    },

    security: {
      heading: "What an education team will want asked",
      body: "Three answers an education team needs before anything else. Student work is somebody else's child's voice, which changes what a default setting is worth.",
      items: [
        {
          icon: Server,
          title: "Recordings stay your material",
          body: "Student audio and scores never train a model. An open weight model on hardware you own means the recordings never leave your network at all.",
        },
        {
          icon: ScrollText,
          title: "Written down, before a minor is recorded",
          body: "What gets collected from a student and how long it stays is documented before the build starts. That document is what a school asks for, and it is also what a store review asks for.",
        },
        {
          icon: ShieldCheck,
          title: "Consent that fits a classroom",
          body: "Microphone permission is requested at the moment it is needed, with the reason on screen. Where the learner is a minor, GDPR puts that consent with a parent, and the flow has to be built for it.",
        },
      ],
    },

    ecosystem: {
      heading: "We connect AI to the stack you already run",
      body: "These are the pieces a learning build tends to need. Your own LMS is the starting point, and nothing on this list is a requirement.",
      items: [
        { name: "Whisper", category: "Recordings into text" },
        { name: "Claude", category: "Feedback written in your words", icon: "siClaude" },
        { name: "Llama", category: "Scoring on your own server", icon: "siMeta" },
        { name: "Embeddings", category: "Lessons a student can search" },
        { name: "PostgreSQL", category: "Cohorts, scores and submissions", icon: "siPostgresql" },
        { name: "pgvector", category: "Course material, searchable" },
        { name: "Python", category: "The scoring pipeline and its tests", icon: "siPython" },
        { name: "Flutter", category: "The app students use", icon: "siFlutter" },
        { name: "Redis", category: "The marking queue", icon: "siRedis" },
        { name: "AWS", category: "Storage for a lot of audio" },
      ],
    },

    faqs: [
      {
        question: "How accurate is audio recitation AI on a young or accented voice?",
        answer:
          "Worse than on an adult reading a script, and that gap is the whole design problem. Children's speech and a strong accent are both under-represented in a general model, so a score that looks confident can be wrong. Recordings from your own learners are what close it, and the gap should be measured before anybody relies on a number.",
      },
      {
        question: "Does the model decide a student's grade?",
        answer:
          "No. It produces a score and a reason, and a teacher owns the grade that goes on a record. Anything near a pass mark is held for a person by default, because that is where a wrong call actually costs somebody something.",
      },
      {
        question: "Do AI learning platforms need to replace our LMS?",
        answer:
          "No. The scoring and transcription sit beside your LMS as services it calls, so the platform your students log into stays the one they know. An LMS that exposes no API costs more, and week one is where that gets established.",
      },
      {
        question: "What does educational app development with AI actually change?",
        answer:
          "The data questions move to the front. What a student records and who can reach it get settled before a screen is designed. A build that guesses gets taken apart later, and a store review and a school both examine it.",
      },
      {
        question: "Can students game the scoring?",
        answer:
          "Some will try, and the ones who do teach you where the rubric is loose. A model that scores a transcript can be fed a transcript, so anything carrying a grade needs the recording kept and spot checked. That is a policy decision more than a technical one.",
      },
      {
        question: "How much of our own marked work do you need to start?",
        answer:
          "More than most platforms expect, and the number matters less than whether it was marked consistently. A set of submissions your own teachers have already graded is what the model gets calibrated against. Where nothing has been graded yet, the first weeks build that set rather than tune against it.",
      },
    ],

    record: {
      layout: "cohort",
      /*
       * The across axis. Three learners, because four columns inside 420
       * pixels leaves 98 each, and an exercise name beside a duration does not
       * fit in 98 without truncating.
       *
       * Illustrative in the same way "Pallet 4417" is, and written to look
       * like nobody's real class.
       */
      axis: ["Amara", "Josef", "Priya"],
      caption:
        "A marking grid for three learners. Seven submissions were scored against the rubric within seconds of arriving, and one is held because the recording was too quiet. The empty cells are units nobody has handed in.",
      /*
       * `when` carries the unit rather than a clock time here, because the
       * down axis of a gradebook is the course rather than the morning. The
       * arrival time was the right label while this was a queue and is noise
       * in a matrix.
       *
       * !! THE ORDER OF THESE ROWS IS THE SHAPE OF THE GRID !!
       *
       * `cohort` drops them into fixed cells, three to a row, so these are
       * written unit by unit: unit 2 first, then unit 3, and so on down. Sort
       * them any other way and one learner's unit 5 ends up sitting above
       * another learner's unit 2, which looks like a gradebook and reads as
       * nothing. See COHORT_LIT in components/backgrounds/record-stack.tsx.
       */
      rows: [
        { when: "Unit 2", what: "Dictation", value: "0:52", status: "Scored" },
        { when: "Unit 3", what: "Recitation", value: "1:12", status: "Scored" },
        { when: "Unit 3", what: "Reading", value: "0:48", status: "Scored" },
        {
          when: "Unit 4",
          what: "Reading",
          value: "0:39",
          status: "Too quiet",
          flagged: true,
        },
        { when: "Unit 4", what: "Recitation", value: "1:30", status: "Scored" },
        { when: "Unit 4", what: "Recitation", value: "1:05", status: "Scored" },
        { when: "Unit 5", what: "Reading", value: "0:44", status: "Scored" },
        { when: "Unit 6", what: "Recitation", value: "1:18", status: "Scored" },
      ],
    },
  },

  "/industries/marketing-and-adtech": {
    path: "/industries/marketing-and-adtech",
    /* 40 characters. The brief's title was "AI Automation for Marketing &
     * AdTech Teams" at 42, inside the budget but not carrying the primary
     * keyword in order. "Teams" was doing nothing, so the space went to the
     * forecasting angle, which is what the page actually argues. */
    metaTitle: "Marketing AI Automation & Ad Forecasting",
    metaDescription:
      "Half the ad spend works and nobody knows which half. Marketing AI automation forecasts what a campaign will return, and says how confident it is. Book a review.",
    audience: "Marketing agencies, SaaS growth teams and adtech businesses",

    hero: {
      eyebrow: "Marketing & adtech",
      title: "You find out what worked after the budget is gone.",
      lede: "A quarter's spend gets committed on a plan, and the numbers that would have changed the plan arrive at the end of it. By then the money is already placed.",
      badges: ["Every forecast carries its margin", "Your keyword strategy stays yours"],
      cta: "Book a marketing AI review",
    },

    summary: {
      heading: "What marketing AI automation is",
      body: "Marketing AI automation means the numbers that decide a campaign arrive before the campaign does. Past performance is used to forecast what a new variant will do, and the forecast comes with a range rather than a single figure. A person still signs off the spend.",
    },

    problem: {
      heading: "The feedback loop is a quarter long",
      body: "Marketing decisions get made on last quarter's numbers because this quarter's are not in yet. The work that would tell you which half of the spend is working is the work nobody has time for. So the same guess gets repeated at a larger budget.",
      points: [
        {
          title: "Reporting costs what the campaign costs",
          body: "Numbers get pulled out of four platforms into one sheet, and somebody does it every Monday.",
        },
        {
          title: "Keyword work is done by hand",
          body: "A thousand search terms get sorted into groups by a person reading them one at a time.",
        },
        {
          title: "Creative gets made before anyone knows it is needed",
          body: "Assets are produced to a schedule rather than to a gap, so some of them never run at all.",
        },
      ],
    },

    useCases: {
      heading: "How we put AI into a marketing workflow",
      items: [
        {
          title: "Spend forecast before it is committed",
          body: "A model trained on your own campaign history estimates what a new variant will return, and it reports a range rather than a number. Where the history is thin it says so.",
          detail: [
            "Trained on your campaigns, not a benchmark",
            "Reports a range, not a single figure",
            "Says where it has too little to go on",
          ],
        },
        {
          title: "Search terms clustered by intent",
          body: "A few thousand keywords get grouped by what the searcher actually wants rather than by the words they share. The groups map onto pages, so the clustering produces a plan instead of a spreadsheet.",
          detail: [
            "Grouped on intent, not on shared words",
            "Each cluster maps to one page",
            "Runs again when the terms move",
          ],
        },
        {
          title: "Reporting that assembles itself",
          body: "Numbers come out of the ad platforms and the CMS on a schedule and land in one place. What changed and why is drafted for a person to check rather than written from scratch.",
          detail: [
            "Pulled on a schedule, not on a Monday",
            "The commentary is drafted, not final",
            "One place rather than four exports",
          ],
        },
      ],
    },

    breadth: {
      heading: "Where else this lands on a marketing team",
      body: "Once a stack can forecast a result and group a thousand terms, several other jobs turn out to be the same two jobs.",
      items: [
        {
          title: "Ad group structure",
          body: "Ad groups built straight from the clusters.",
        },
        {
          title: "Testing that stops early",
          body: "A variant that is clearly losing gets less traffic while the test runs, so less budget goes to the loser.",
        },
        {
          title: "Creative variants",
          body: "Copy and layout options drafted against a brief, with a person choosing which ones run.",
        },
        {
          title: "Lead routing",
          body: "Enquiries scored and sent to the right person, with the reasoning attached to the record.",
        },
      ],
    },

    workflow: {
      heading: "Where a campaign decision actually goes",
      body: "Four steps. A marketer sits at the last one. The budget is theirs to commit.",
      steps: [
        { label: "Pulled", body: "Spend and results come out of the platforms." },
        { label: "Clustered", body: "Terms and creatives get grouped by intent." },
        { label: "Forecast", body: "A model estimates what each group returns." },
        {
          label: "Committed",
          body: "A marketer reads the range and decides.",
          human: true,
        },
      ],
    },

    security: {
      heading: "What a marketing team will want asked",
      body: "Three answers a marketing team needs before anything else. A keyword strategy is the one asset an agency cannot get back once it leaks.",
      items: [
        {
          icon: Server,
          title: "Your strategy stays your strategy",
          body: "Keyword sets and spend figures never train a model. An open weight model on your own hardware means the numbers never leave your account at all.",
        },
        {
          icon: ScrollText,
          title: "The forecast shows its working",
          body: "Every estimate records what it was trained on and how far it has been wrong before. A number with no error attached is what loses money.",
        },
        {
          icon: ShieldCheck,
          title: "Lead capture built for GDPR",
          body: "Consent is recorded at the point it is given, with what was agreed to and when. That is what a regulator asks for and it is also what makes a list worth having.",
        },
      ],
    },

    ecosystem: {
      heading: "We connect AI to the stack you already run",
      /*
       * !! NO AD PLATFORMS ON THIS ROW, AND THAT IS DELIBERATE !!
       *
       * The brief names Google Ads four times and it is the obvious thing to
       * put here. It is also exactly the position QuickBooks and Xero were in
       * on the fintech page before the client confirmed neither had been
       * connected on a project, and content/integrations.ts is explicit that
       * this list has to match what has actually been delivered.
       *
       * Ask before launch. Google Ads, Meta and HubSpot connectors would each
       * strengthen this row and none of them is confirmed.
       */
      body: "These are the pieces a marketing build tends to need. Your own ad accounts are the starting point, and nothing on this list is a requirement.",
      items: [
        { name: "Embeddings", category: "Search terms grouped by intent" },
        { name: "Claude", category: "Drafting copy against a brief", icon: "siClaude" },
        { name: "Llama", category: "Scoring on your own server", icon: "siMeta" },
        { name: "Python", category: "The forecasting model and its tests", icon: "siPython" },
        { name: "PostgreSQL", category: "Spend, results and history", icon: "siPostgresql" },
        { name: "pgvector", category: "Clusters, stored and searchable" },
        { name: "n8n", category: "The Monday pull, on a schedule", icon: "siN8n" },
        { name: "MCP", category: "Models plugged into your tools", icon: "siModelcontextprotocol" },
        { name: "Redis", category: "Queues behind the reporting", icon: "siRedis" },
        { name: "TypeScript", category: "Dashboards your team opens", icon: "siTypescript" },
      ],
    },

    faqs: [
      {
        question: "How accurate is predictive marketing ROI in practice?",
        answer:
          "Good enough to rank options, not to promise a number. A model trained on your own history will separate a strong variant from a weak one long before it can tell you the exact return. Anybody quoting precision on an ad forecast is selling you the part that does not exist.",
      },
      {
        question: "Will AI content clustering replace our SEO agency?",
        answer:
          "No, and it changes what you pay them for. The sorting of ten thousand terms is machine work and the judgement about which clusters are worth a page is not. An agency that only did the sorting was already exposed.",
      },
      {
        question: "Can you generate the content as well as the plan?",
        answer:
          "Yes, and we will argue about how much you publish. Google has a name for pages generated at volume, and the name is scaled content abuse. The version that works is one draft per cluster, finished by a person who knows the subject.",
      },
      {
        question: "Does adtech AI integration mean changing ad platforms?",
        answer:
          "No. The models sit beside the platforms and read them through their APIs, so the accounts you run stay the accounts you run. What changes is where the decision gets made, which moves from the console to a forecast you can argue with.",
      },
      {
        question: "How much campaign history do you need?",
        answer:
          "Enough that the model has seen a bad quarter as well as a good one. A year of spend across a few channels is workable and six weeks of one campaign is not. A model fitted to a lucky run forecasts luck. Where it is short we say so early.",
      },
      {
        question: "Who owns the models you build for us?",
        answer:
          "It is a contract question rather than a technical one, and it should be settled before anything is trained. A forecasting model fitted to your spend history is worth more than the code around it, and a supplier who keeps it holds your strategy. Ask it of everybody you talk to, including us.",
      },
    ],

    record: {
      layout: "cohort",
      /*
       * The across axis. Three channels, which is what the `cohort` grid has
       * room for at 420 pixels.
       *
       * Illustrative in the same way "Pallet 4417" is. These are channels
       * rather than named platforms, for the same reason the ecosystem row
       * above carries no ad platforms.
       */
      axis: ["Search", "Social", "Email"],
      caption:
        "A quarter of tests across three channels. Seven variants have a measured result and one is held because the forecast and the live number disagree. The empty cells are tests nobody has run.",
      /*
       * !! THE ORDER OF THESE ROWS IS THE SHAPE OF THE GRID !!
       *
       * `cohort` drops them into fixed cells, three to a row, so these are
       * written week by week down the grid. Sort them any other way and a week
       * 13 test ends up above a week 9 one. See COHORT_LIT in
       * components/backgrounds/record-stack.tsx.
       */
      rows: [
        { when: "Week 9", what: "Brand headline", value: "2.1%", status: "Measured" },
        { when: "Week 10", what: "Ad copy, set B", value: "3.4%", status: "Measured" },
        { when: "Week 10", what: "Subject line A", value: "1.8%", status: "Measured" },
        {
          when: "Week 11",
          what: "Ad copy, set C",
          value: "0.4%",
          status: "Off model",
          flagged: true,
        },
        { when: "Week 11", what: "Carousel, 4 up", value: "2.7%", status: "Measured" },
        { when: "Week 11", what: "Re-engagement", value: "4.0%", status: "Measured" },
        { when: "Week 12", what: "Short video cut", value: "3.1%", status: "Measured" },
        { when: "Week 13", what: "Winback series", value: "2.9%", status: "Measured" },
      ],
    },
  },
};
