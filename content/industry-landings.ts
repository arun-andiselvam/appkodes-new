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
 * content/integrations.ts. Plaid, QuickBooks, Xero and Salesforce are not.
 * They came from the brief, and the section is worded as what finance teams
 * bring us rather than what we have delivered, which is the honest reading.
 * Anything that has genuinely never been connected should come out.
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
    metaTitle: "AI Automation for Fintech SMBs",
    metaDescription:
      "AI automation for fintech SMBs. Expense capture, ledger matching and document processing built into the finance systems you already run. Book an audit.",
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
          body: "Integrations run against enterprise endpoints with retention turned off, so your inputs never enter a training set. Somebody has to switch that on, and we check it.",
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
        { name: "QuickBooks", category: "Where the books live", icon: "siQuickbooks" },
        { name: "Xero", category: "Ledgers and invoicing", icon: "siXero" },
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
    ledger: {
      caption:
        "A ledger with four transactions. Three have been categorised automatically, and the fourth is held back for a person to review.",
      label: "Transactions",
      rows: [
        { date: "12 Mar", description: "Northgate Supplies", amount: "1,240.00", category: "Inventory" },
        { date: "12 Mar", description: "Cloud hosting", amount: "318.40", category: "Software" },
        { date: "13 Mar", description: "Ferry, client visit", amount: "62.00", category: "Travel" },
        {
          date: "13 Mar",
          description: "Unlabelled transfer",
          amount: "900.00",
          category: "Review",
          flagged: true,
        },
      ],
      footnote: "Categorised on arrival. One held for a person.",
    },

    faqs: [
      {
        question: "How can AI automate shared expenses and debt calculation?",
        answer:
          "The integration reads the transaction feed through your banking API and categorises each line with a model. Every member's balance in the shared ledger recalculates from there. Nobody types a number in.",
      },
      {
        question: "Is it safe to use LLMs like ChatGPT for financial data?",
        answer:
          "Consumer ChatGPT is not safe for financial records, and it is not what we build on. Enterprise endpoints with retention switched off process the data and keep nothing, and open weight models can run on hardware you own.",
      },
      {
        question: "How long does a fintech AI integration take?",
        answer:
          "Three weeks for a single workflow, audit to live. The audit comes first and it is where the reconciliation rules get written down, because a model cannot infer a policy nobody has stated.",
      },
      {
        question: "Will an AI agent give a customer the wrong balance?",
        answer:
          "Not from a model guessing, because the agent reads the balance from your database rather than generating it. Anything it cannot answer from your own records gets handed to a person on your team.",
      },
      {
        question: "Do we need to replace our accounting system?",
        answer:
          "No. The automation sits beside what you run and talks to it through the API it already exposes. Your team opens the same books on Monday.",
      },
      {
        question: "What does AI automation for fintech SMBs cost?",
        answer:
          "The audit puts a number on it before you commit, and there is no open ended discovery phase. You pay for the middleware and the API work rather than for a new platform.",
      },
    ],
  },
};
