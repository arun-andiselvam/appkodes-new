import type { ServicePage } from "./types";

/**
 * The service silos, page by page.
 *
 * Five parents and fourteen children, laid out in
 * docs/hitasoft_ai_architecture_strategy.md. Every one is built to the
 * conversion blueprint in section 4 of that file: the problem first, then what
 * we build, then the three steps, then what changes, then one way to start.
 *
 * !! NO FIGURES ANYWHERE IN HERE !!
 *
 * The strategy's own pitches quote two. "Resolve 70% of customer inquiries"
 * and "cut your monthly API bills by up to 70%". Nobody has measured either
 * for this company, so both were dropped on the way in rather than published
 * and defended later. docs/positioning.md rules them out, and content/site.ts
 * already carries the same warning on the closing panel. The outcomes state
 * the shape of the saving instead. Put real numbers here the week somebody
 * measures them, and put the measurement in the doc at the same time.
 *
 * Keyed by full path so a route file looks its own page up by the URL it
 * lives at, rather than a slug it has to remember to keep in step.
 */
export const servicePages: Record<string, ServicePage> = {
  /* ----------------------------- Silo 1 ----------------------------- */

  "/services/ai-software-integration": {
    slug: "ai-software-integration",
    title: "AI software integration",
    eyebrow: "Silo 01",
    lede: "Do not rebuild your software. We build the bridge that makes the platform you already run intelligent.",
    metaTitle: "AI Software Integration",
    metaDescription:
      "We put AI into the software you already run, through custom API integration and private deployment where the data demands it. No rebuild required.",
    problem: {
      heading: "The rebuild everybody quotes you for",
      body: "You have a platform that works. Somebody has told you it needs AI, and the quote that came back was for a new system. That is a year of your life and a budget you do not have.",
      points: [
        "The software already holds your data, your rules and your customers.",
        "A rebuild throws away years of decisions nobody wrote down.",
        "Every month spent rebuilding is a month you ship nothing else.",
      ],
    },
    solution: {
      heading: "A layer, not a replacement",
      body: "We work on top of what runs today. A model gets connected to your data through an API, and your existing logic keeps doing its job underneath. Your team logs into the same system on Monday.",
      points: [
        "Custom AI API integration into your current codebase.",
        "Wrappers that add intelligence around logic you already trust.",
        "Private deployment wherever the data cannot leave your control.",
      ],
    },
    outcomes: [
      "Your platform gains AI features without a migration.",
      "Nothing your team uses daily changes underneath them.",
      "The work is reversible, so a model that underperforms comes back out.",
    ],
  },

  "/services/custom-ai-api-integration": {
    slug: "custom-ai-api-integration",
    title: "Custom AI API & software integration",
    eyebrow: "AI Integration",
    lede: "We connect a language model to the system your business already runs on, and we own the plumbing that keeps it up.",
    metaTitle: "Custom AI API Integration & AI Wrapper Development",
    metaDescription:
      "Integrate an LLM into existing software. Custom AI API integration and AI wrapper development that adds intelligence to your current platform.",
    problem: {
      heading: "The demo works, the integration does not",
      body: "Anyone can call an API once. Production is where it gets difficult. Keys leak, rate limits arrive at the worst moment, and a model that times out takes a page down with it.",
      points: [
        "Nobody in house owns the API keys or the monthly spend.",
        "A slow model becomes a slow product without careful handling.",
        "Costs climb quietly when every request goes to the largest model.",
        "Your pricing and approval rules carry real money, so a model must not guess at them.",
      ],
    },
    solution: {
      heading: "The model asks, your logic answers",
      body: "The wrapper sits in front of what you have built. It reads what a user wants in plain language, then calls the functions your system already exposes. Your rules stay in charge of every decision that matters.",
      points: [
        "Keys held server side, never shipped to a browser.",
        "Fallback behaviour for timeouts and provider outages.",
        "Caching and model routing so the bill stays predictable.",
        "Every action the model takes is logged and reversible.",
      ],
    },
    outcomes: [
      "Users describe what they want instead of learning your interface.",
      "The decisions stay auditable, because your code still makes them.",
      "One place to swap models when a better one ships.",
    ],
  },

  "/services/secure-ai-compliance-architecture": {
    slug: "secure-ai-compliance-architecture",
    title: "Secure AI & compliance architecture",
    eyebrow: "AI Integration",
    lede: "Private models for platforms handling sensitive work, built so you know where every copy of your data sits.",
    metaTitle: "Secure AI Integration & Private LLM Deployment",
    metaDescription:
      "Secure AI integration services for mid-sized businesses. Private LLM deployment, data residency and audit trails settled before a model reads a record.",
    problem: {
      heading: "Nobody signed off on where the data went",
      body: "AI work stalls at the same question every time. Somebody asks where the data goes, and no one in the room has an answer written down.",
      points: [
        "Customer records sitting in a vendor's logs with nobody's approval.",
        "No record of which fields a model was ever shown.",
        "A compliance review that arrives after the build rather than before.",
      ],
    },
    solution: {
      heading: "Settled in week one",
      body: "Residency, retention and access are decided before a model reads a row. We write it down, then build to it. Where the sensitivity demands it, the model runs inside infrastructure you control rather than somebody else's.",
      points: [
        "Private model deployment inside your own environment.",
        "Personal fields redacted or tokenised before anything is sent.",
        "Data residency fixed to a region you name.",
        "An audit trail showing what was sent and when.",
      ],
    },
    outcomes: [
      "The compliance question is answered before it is asked.",
      "Live video, medical and closed community work becomes possible.",
      "No dependence on one vendor's terms of service.",
    ],
  },

  /* ----------------------------- Silo 2 ----------------------------- */

  "/services/ai-workflow-automation": {
    slug: "ai-workflow-automation",
    title: "AI workflow automation",
    eyebrow: "Silo 02",
    lede: "Your team was not hired to retype what a system already knows. We hand that work to software.",
    metaTitle: "AI Workflow Automation",
    metaDescription:
      "Autonomous workflow automation for SMBs. Support handling, document processing and financial pipelines run by software instead of by hand.",
    problem: {
      heading: "The work nobody put on a roadmap",
      body: "Every growing company accumulates jobs that exist because two systems do not talk. Somebody copies a number from one screen into another. It is on your payroll and nobody has costed it.",
      points: [
        "The same questions answered by hand every week.",
        "Numbers retyped between a spreadsheet and a system of record.",
        "Multi-step jobs that stall whenever the person who runs them is away.",
      ],
    },
    solution: {
      heading: "Software doing what software should",
      body: "We map the repeat work first, then automate the parts that are safe to automate. A person stays in the loop wherever a wrong answer costs money.",
      points: [
        "Agents that carry a task across several tools on their own.",
        "Support answered from your own tickets and documentation.",
        "Invoices and contracts read, checked and filed without a keystroke.",
        "Financial pipelines reconciled as the money moves.",
      ],
    },
    outcomes: [
      "Hours come back to the people who were doing it by hand.",
      "The work carries on when the person who knew it is away.",
      "Every automated step leaves a record you review monthly.",
    ],
  },

  "/services/autonomous-ai-agents": {
    slug: "autonomous-ai-agents",
    title: "Autonomous AI agents",
    eyebrow: "Workflow Automation",
    lede: "Replace manual cross-app tasks with agents that plan the steps, do them, and report back.",
    metaTitle: "Custom AI Agent Development",
    metaDescription:
      "Custom AI agent development for business. Multi-agent systems that execute multi-step workflows across your tools and report what they did.",
    problem: {
      heading: "The job spans five tools and one person",
      body: "Real work rarely fits in one system. An order arrives in one place, gets checked in another, then somebody updates a third. One person holds the whole sequence in their head.",
      points: [
        "A single chatbot answers questions but finishes nothing.",
        "Rule based automation breaks the first time the input varies.",
        "The sequence lives with one person and stops when they take leave.",
      ],
    },
    solution: {
      heading: "Agents that finish the task",
      body: "We build multi-agent systems with frameworks such as AutoGen and CrewAI. One agent plans, others do the steps, and the work moves across your tools without somebody driving it. Anything outside its remit goes to a person.",
      points: [
        "Multi-step workflows executed across the tools you already pay for.",
        "Clear limits on what an agent is allowed to do unsupervised.",
        "A written trace of every step, so a wrong turn is findable.",
        "Handover to a named person when the agent is unsure.",
      ],
    },
    outcomes: [
      "Cross-app jobs run without anybody shepherding them.",
      "The sequence survives holidays and resignations.",
      "You read a report instead of chasing a status.",
    ],
  },

  "/services/customer-support-ai": {
    slug: "customer-support-ai",
    title: "Intelligent customer support",
    eyebrow: "Workflow Automation",
    lede: "Agents that answer from your own documentation and your own ticket history, not from the open internet.",
    metaTitle: "AI Customer Support Automation",
    metaDescription:
      "Custom AI chatbot development for SMBs. RAG agents trained on your documentation and past tickets, wired into the helpdesk you already use.",
    problem: {
      heading: "The same forty questions, forever",
      body: "Most of your support queue is not hard. It is repetitive. A small team burns its week on questions the documentation already answers, and the difficult tickets wait behind them.",
      points: [
        "Tier one questions consume the people who handle tier three.",
        "Response times slip at exactly the hours nobody is staffed.",
        "A generic chatbot answers confidently and wrongly.",
      ],
    },
    solution: {
      heading: "It reads your knowledge base, not the internet",
      body: "We build retrieval into the agent so answers come from sources you control. When it does not know, it says so and passes the ticket to a person with the whole conversation attached.",
      points: [
        "Answers grounded in your documentation and resolved tickets.",
        "A clean handover to a human, with context carried over.",
        "Wired into the helpdesk you already pay for.",
        "Ticket routing and tagging handled on the way in.",
      ],
    },
    outcomes: [
      "Repeat questions stop reaching your team.",
      "Out of hours queries get an answer rather than a queue position.",
      "Your best support people work on the tickets that need them.",
    ],
  },

  "/services/document-processing-ocr": {
    slug: "document-processing-ocr",
    title: "Document processing & OCR",
    eyebrow: "Workflow Automation",
    lede: "Turn messy paper and PDFs into structured database records, checked against what you already hold.",
    metaTitle: "AI Document Processing & Custom OCR Development",
    metaDescription:
      "Intelligent document processing and custom OCR. Invoices, contracts and receipts extracted into structured records and validated automatically.",
    problem: {
      heading: "A person is being paid to read PDFs",
      body: "Documents arrive in every format anybody feels like sending. Somebody opens each one and types what is in it into a system. It is slow, and a typo in it is expensive.",
      points: [
        "Month end depends on one person keeping pace with the pile.",
        "Errors surface weeks later, in a reconciliation.",
        "Scans, photographs and awkward layouts defeat plain OCR.",
        "Volume grows with the business, so the problem grows too.",
      ],
    },
    solution: {
      heading: "Read, checked, then posted",
      body: "The pipeline extracts what matters from invoices, contracts and receipts, then validates it against records you already hold. Anything that does not reconcile goes to a person instead of being written in quietly.",
      points: [
        "Extraction that copes with scans and inconsistent layouts.",
        "Validation against your ledger before anything is written.",
        "A review queue for the cases worth a human decision.",
        "Output shaped to the database you actually use.",
      ],
    },
    outcomes: [
      "Month end stops depending on one person's availability.",
      "Mistakes get caught at entry rather than at reconciliation.",
      "Volume grows without another hire to keep up with it.",
    ],
  },

  "/services/financial-data-automation": {
    slug: "financial-data-automation",
    title: "Financial & data workflow automation",
    eyebrow: "Workflow Automation",
    lede: "Eliminate manual data entry from your financial pipelines, so the team works on growth instead of spreadsheets.",
    metaTitle: "Financial Data Automation for SMBs",
    metaDescription:
      "Fintech AI automation services. Automated expense tracking, AI ledger management and real-time balance calculation built into your existing systems.",
    problem: {
      heading: "Finance is a month of manual work per month",
      body: "Money moves between systems that were never introduced to each other. Somebody reconciles them by hand. It works until volume doubles, then it quietly stops working.",
      points: [
        "Expenses categorised by hand, weeks after they happened.",
        "Balances that disagree across two systems and nobody knows why.",
        "Shared ledgers kept in a spreadsheet one person owns.",
        "Reporting that arrives too late to change a decision.",
      ],
    },
    solution: {
      heading: "Reconciled as it happens",
      body: "Transactions get categorised and matched against your ledger as they arrive. Debt and balance positions are calculated live rather than at month end. Anything that does not reconcile goes to a person with the reason attached.",
      points: [
        "Automated expense capture and categorisation.",
        "Ledger matching with a queue for genuine exceptions.",
        "Real-time balance and debt calculation.",
        "Backend pipelines that run without anybody starting them.",
      ],
    },
    outcomes: [
      "Month end becomes a review rather than a rebuild.",
      "Discrepancies surface the day they happen.",
      "Whoever holds the budget sees the position without asking.",
    ],
  },

  /* ----------------------------- Silo 3 ----------------------------- */

  "/services/custom-ai-mvp-development": {
    slug: "custom-ai-mvp-development",
    title: "Custom AI MVP development",
    eyebrow: "Silo 03",
    lede: "For founders with a product to prove rather than a system to upgrade. We build the first version that has to survive contact with users.",
    metaTitle: "Custom AI MVP Development",
    metaDescription:
      "Affordable AI startup development. Rapid prototypes, market-ready AI SaaS MVPs and predictive retail tools, built with cost-optimised architecture.",
    problem: {
      heading: "There is nothing yet to put AI into",
      body: "A startup has no legacy system to modernise and no manual process worth automating. What it has is an idea, a runway and a demo to give. The build has to be quick, and it has to be cheap enough to be wrong once.",
      points: [
        "Investors want something working, not a deck about it.",
        "A full engineering team is a commitment you cannot fund yet.",
        "Careless API architecture makes every user cost you money.",
      ],
    },
    solution: {
      heading: "Small, real, and cheap to change",
      body: "We start with the narrowest thing that proves the idea. Where it works, the same architecture carries into a product you sell. Cost per request is a design decision from the first week rather than a surprise in month four.",
      points: [
        "Proof of concept builds sized for a demo and a user test.",
        "End-to-end web and mobile SaaS with custom AI logic underneath.",
        "Specialised tools for tracking, valuation and stock prediction.",
        "Cost-optimised API calls designed in, not bolted on.",
      ],
    },
    outcomes: [
      "Something real to show a room, in weeks.",
      "An architecture that survives the first hundred users.",
      "A cost per user you knew before you launched.",
    ],
  },

  "/services/rapid-ai-prototyping": {
    slug: "rapid-ai-prototyping",
    title: "Rapid AI prototyping",
    eyebrow: "AI MVP Development",
    lede: "Validate the idea in weeks with a lean prototype built for investor demos and real user testing.",
    metaTitle: "Rapid AI Prototyping & Proof of Concept",
    metaDescription:
      "Low cost AI prototype development for startups. Fast proof-of-concept builds that validate an AI feature before full-scale engineering.",
    problem: {
      heading: "You are being asked to fund a guess",
      body: "The idea sounds right. Nobody knows whether the model is accurate enough for it, and finding out properly costs more than the answer is worth at this stage.",
      points: [
        "A full build commits money before the risk is understood.",
        "The interesting question is accuracy, not screens.",
        "A prototype that becomes the product by accident is a liability.",
      ],
    },
    solution: {
      heading: "Answer the risky question first",
      body: "We build the smallest thing that tests whether the AI part works on your data. It runs, people use it, and you learn what the accuracy actually is. Everything not needed to answer that gets left out on purpose.",
      points: [
        "One narrow build, aimed at the part most likely to fail.",
        "Tested against your own data rather than a public sample.",
        "Presentable enough for an investor demo.",
        "A written verdict on what to build next, or whether to.",
      ],
    },
    outcomes: [
      "You find out in weeks rather than after a funding round.",
      "The demo is real software rather than a video.",
      "A negative answer is worth having, and it costs little.",
    ],
  },

  "/services/fintech-saas-ai-mvp": {
    slug: "fintech-saas-ai-mvp",
    title: "Fintech & SaaS AI MVP",
    eyebrow: "AI MVP Development",
    lede: "Launch a market-ready AI SaaS product, built on architecture that scales and API calls that do not bankrupt you.",
    metaTitle: "Custom AI SaaS & Fintech MVP Development",
    metaDescription:
      "Build an AI SaaS MVP. End-to-end web and mobile platforms with custom AI logic, scalable architecture and cost-optimised model usage.",
    problem: {
      heading: "The second version is where startups die",
      body: "A first release built to be quick usually cannot be built on. Growth then arrives as a rewrite, at the exact moment attention should be on customers.",
      points: [
        "Prototype code that nobody wants to extend.",
        "Model spend that rises faster than revenue does.",
        "Financial features that were not designed for an audit.",
      ],
    },
    solution: {
      heading: "Built once, for the version that sells",
      body: "We build end-to-end, web and mobile, with the AI logic designed as part of the product rather than added over it. Fintech work gets its audit trail from the start, because retrofitting one is a rewrite.",
      points: [
        "Web and mobile from a single, maintained codebase.",
        "Custom AI logic in the product from the first release.",
        "Model routing and caching so unit costs hold as you grow.",
        "Audit trails and reconciliation designed in for financial features.",
      ],
    },
    outcomes: [
      "The launch version is the one you keep building on.",
      "Unit economics that survive a hundred times the users.",
      "A product an acquirer or auditor examines without alarm.",
    ],
  },

  "/services/smart-inventory-retail-mvp": {
    slug: "smart-inventory-retail-mvp",
    title: "Smart inventory & retail MVP",
    eyebrow: "AI MVP Development",
    lede: "Stop guessing your stock levels. We build predictive inventory engines that prevent stockouts and cut holding costs.",
    metaTitle: "AI Inventory Management Development",
    metaDescription:
      "Predictive inventory AI for SMBs. Smart stock tracking, digital product tracking and retail automation built as a working product.",
    problem: {
      heading: "Stock is either missing or sitting there",
      body: "Retail runs on a guess about next month. Guess low and you sell out of the thing everyone wanted. Guess high and your cash is sitting in a warehouse.",
      points: [
        "Reorder points set once and never revisited.",
        "Seasonal demand handled from memory rather than history.",
        "No usable measure of what a line is actually worth to you.",
      ],
    },
    solution: {
      heading: "Your own sales history, put to work",
      body: "The forecast is built from what you have already sold, not from an industry average. It watches each line and flags the ones about to run short while there is still time to order.",
      points: [
        "Demand forecasting per line, from your own sales record.",
        "Automated reorder triggers your buyer approves or overrides.",
        "Digital product tracking and valuation metrics in one place.",
        "Product categorisation and enrichment handled in bulk.",
      ],
    },
    outcomes: [
      "Fewer stockouts on the lines that actually sell.",
      "Less cash held in stock nobody is asking for.",
      "Your buyer reviews decisions instead of making all of them.",
    ],
  },

  /* ----------------------------- Silo 4 ----------------------------- */

  "/services/ai-data-predictive-analytics": {
    slug: "ai-data-predictive-analytics",
    title: "AI data & predictive analytics",
    eyebrow: "Silo 04",
    lede: "Turn the history you already have into an advantage. We build models that predict behaviour and structure the data they read.",
    metaTitle: "AI Data & Predictive Analytics",
    metaDescription:
      "Predictive analytics for SMBs. Sales forecasting, vector database setup for accurate RAG, and computer vision for inspection and cataloguing.",
    problem: {
      heading: "The data is there and nobody reads it",
      body: "Years of orders, tickets and documents sit in systems that were never meant to be queried together. The pattern in them is real. Nothing in your week gives anybody time to find it.",
      points: [
        "Reporting describes last month rather than predicting next one.",
        "Company knowledge is spread across drives, wikis and databases.",
        "AI tools invent answers when the data behind them is a mess.",
      ],
    },
    solution: {
      heading: "Structure first, then prediction",
      body: "We clean and organise what you hold, then build models on top of it. A vector database makes company knowledge searchable with accuracy. Forecasting models turn the history into a number somebody acts on.",
      points: [
        "Machine learning applied to your own historical data.",
        "Vector databases set up for high-accuracy retrieval.",
        "Computer vision for inspection and catalogue work.",
      ],
    },
    outcomes: [
      "Decisions made on a forecast rather than a feeling.",
      "AI answers you trust, because the data underneath is clean.",
      "Work that used to need an eye on every item runs by itself.",
    ],
  },

  "/services/predictive-analytics-bi": {
    slug: "predictive-analytics-bi",
    title: "Predictive analytics & business intelligence",
    eyebrow: "Data & Analytics",
    lede: "Turn your historical data into an advantage. We build models that predict customer behaviour and sharpen your pricing.",
    metaTitle: "Predictive Analytics for SMBs",
    metaDescription:
      "Custom predictive modelling services. AI sales forecasting, churn prediction and pricing optimisation built on your own historical data.",
    problem: {
      heading: "Reporting tells you what already happened",
      body: "Dashboards describe the past well. They say nothing about which customer is about to leave, or which price is leaving money on the table.",
      points: [
        "Churn is noticed at renewal, when it is too late to act.",
        "Forecasts are built by hand in a spreadsheet each quarter.",
        "Pricing is set once and defended rather than tested.",
      ],
    },
    solution: {
      heading: "Models trained on your own history",
      body: "We use your order history, usage and support record to predict what happens next. Each model outputs something a person acts on, such as a list of accounts at risk this month.",
      points: [
        "Sales and demand forecasting from your own record.",
        "Churn scoring, with the reasons attached to each account.",
        "Pricing optimisation tested against real outcomes.",
        "Output delivered into the tools your team already opens.",
      ],
    },
    outcomes: [
      "At-risk customers surface while there is time to keep them.",
      "The forecast stops being one person's spreadsheet.",
      "Pricing changes get judged on evidence.",
    ],
  },

  "/services/data-engineering-vector-databases": {
    slug: "data-engineering-vector-databases",
    title: "Data engineering & vector databases",
    eyebrow: "Data & Analytics",
    lede: "Structure your company data so AI tools query it accurately, instead of inventing an answer that sounds right.",
    metaTitle: "Vector Database Integration & AI Data Engineering",
    metaDescription:
      "RAG data pipeline setup and AI data engineering. We clean unstructured company data and configure Pinecone, Qdrant or PGVector for accurate retrieval.",
    problem: {
      heading: "The AI made something up",
      body: "A model with nothing to read falls back on what sounds plausible. That is what a hallucination is. The fix is almost never a better model. It is better data underneath it.",
      points: [
        "Company knowledge scattered across Notion, Drive and SQL.",
        "Documents that contradict each other and nobody has reconciled.",
        "Retrieval that returns the wrong passage confidently.",
      ],
    },
    solution: {
      heading: "Clean it, then index it properly",
      body: "We pull the sources together and put them into shape. A vector database is set up and tuned for your material, so retrieval returns the right passage rather than a nearby one.",
      points: [
        "Unstructured data collected from Notion, Drive and SQL.",
        "Pinecone, Qdrant or PGVector, chosen for your volume and budget.",
        "Chunking and embedding tuned against your own questions.",
        "A pipeline that keeps the index current as documents change.",
      ],
    },
    outcomes: [
      "Answers cite a real document you own.",
      "Every AI feature you build later starts from clean ground.",
      "New material is searchable the day it is written.",
    ],
  },

  "/services/computer-vision-quality-control": {
    slug: "computer-vision-quality-control",
    title: "Computer vision & quality control",
    eyebrow: "Data & Analytics",
    lede: "Automate visual inspection and cataloguing with models trained on your own products and your own defects.",
    metaTitle: "Computer Vision Development & Visual Quality Control",
    metaDescription:
      "Custom image recognition development. AI visual quality control, defect detection and smart catalogue tagging for manufacturing and retail.",
    problem: {
      heading: "Somebody is looking at every single one",
      body: "Visual checking does not scale and it does not stay consistent. Two inspectors disagree. The same inspector disagrees with themselves at the end of a shift.",
      points: [
        "Defects found by the customer rather than on the line.",
        "Catalogue images tagged by hand, slowly and unevenly.",
        "No record of what a rejected item actually looked like.",
      ],
    },
    solution: {
      heading: "Trained on your products, not a stock dataset",
      body: "We train on images of your own items, including the faults you care about. The model flags what it is unsure of rather than guessing, so a person spends their attention on the borderline cases.",
      points: [
        "Defect detection tuned to the faults that matter to you.",
        "Image classification and automatic catalogue tagging.",
        "Uncertain items routed to a person rather than passed.",
        "Every decision stored with the image behind it.",
      ],
    },
    outcomes: [
      "Consistent checking at the end of a shift and the start of one.",
      "Catalogue work that keeps up with new stock.",
      "A record of every rejection, with the evidence attached.",
    ],
  },

  /* ----------------------------- Silo 5 ----------------------------- */

  "/services/custom-ai-models-voice": {
    slug: "custom-ai-models-voice",
    title: "Custom AI models & voice",
    eyebrow: "Silo 05",
    lede: "Your own model, trained on your own data, hosted where you choose. And a voice on the end of the phone at any hour.",
    metaTitle: "Custom AI Models & Voice Automation",
    metaDescription:
      "Private AI model deployment and voice automation. Fine-tuned open-source models hosted on your terms, plus AI voice agents for inbound calls.",
    problem: {
      heading: "Renting a model has a ceiling",
      body: "A hosted API is the right way to start. It stops being the right way when volume climbs, when the bill grows faster than usage, or when the data cannot leave your walls.",
      points: [
        "Spend that scales with every customer you add.",
        "A general model that has never seen how your business writes.",
        "Phone leads missed because nobody was there to answer.",
      ],
    },
    solution: {
      heading: "Own the model, answer the phone",
      body: "Open models get fine-tuned on your material and hosted privately, which takes the meter out of the loop. On the telephony side, a voice agent handles the calls that used to go to voicemail.",
      points: [
        "Llama and Mistral fine-tuned on your proprietary data.",
        "Private hosting that removes the per-request bill.",
        "Voice agents for inbound calls and appointment booking.",
      ],
    },
    outcomes: [
      "Model spend becomes infrastructure rather than a variable cost.",
      "The model writes and reasons the way your business does.",
      "Every call gets answered, including the ones out of hours.",
    ],
  },

  "/services/private-llm-fine-tuning": {
    slug: "private-llm-fine-tuning",
    title: "Private LLM fine-tuning",
    eyebrow: "Custom Models & Voice",
    lede: "Cut your monthly API bills with a customised open-source model, hosted where you decide and trained on your own data.",
    metaTitle: "LLM Fine-Tuning & Private AI Model Deployment",
    metaDescription:
      "LLM fine-tuning services. Open-source models trained on your proprietary data and hosted privately to reduce cloud API spend.",
    problem: {
      heading: "The bill grows with the business",
      body: "Every request goes to somebody else's server and every request has a price. Usage that doubles doubles the invoice, and none of that spend builds anything you own.",
      points: [
        "A general model that has never read your documentation.",
        "Provider pricing and terms you do not control.",
        "Proprietary data leaving your walls on every call.",
      ],
    },
    solution: {
      heading: "A smaller model that knows your work",
      body: "Open models such as Llama and Mistral get fine-tuned on your material. A tuned smaller model usually beats a general larger one on a narrow job, and it runs on hardware you can afford to keep.",
      points: [
        "Fine-tuning on your proprietary documents and records.",
        "Hosted in your own cloud account or on your own hardware.",
        "Benchmarked against the hosted model before anything switches.",
        "A fallback to a hosted model for what the small one cannot do.",
      ],
    },
    outcomes: [
      "Model spend turns into infrastructure you control.",
      "Answers in the vocabulary your business actually uses.",
      "Nothing proprietary leaves the environment you chose.",
    ],
  },

  "/services/ai-voice-telephony-automation": {
    slug: "ai-voice-telephony-automation",
    title: "AI voice & telephony automation",
    eyebrow: "Custom Models & Voice",
    lede: "Never miss a phone lead again. Voice agents answer, qualify and book, at any hour you choose to be open.",
    metaTitle: "AI Voice Agent Integration & Phone Automation",
    metaDescription:
      "Custom voice AI for small business. Human-like agents for inbound call handling, appointment scheduling and outbound qualification.",
    problem: {
      heading: "The phone rings and nobody is there",
      body: "Plenty of businesses still get their best enquiries by telephone. Those calls arrive while the team is with a customer, or after six, and a voicemail is where most of them end.",
      points: [
        "Enquiries lost to a competitor who picked up first.",
        "Appointment booking that needs a person on both ends.",
        "Outbound qualification nobody has the hours for.",
      ],
    },
    solution: {
      heading: "A voice that books the appointment",
      body: "The agent answers, understands what the caller wants and acts on it. Booking goes straight into your calendar. Anything it should not handle alone gets transferred to a person with a summary already written.",
      points: [
        "Inbound calls answered around the clock.",
        "Appointments written directly into your existing calendar.",
        "Outbound qualification calls with the results logged.",
        "Transfer to a person, with a summary of the call so far.",
      ],
    },
    outcomes: [
      "Enquiries that used to reach voicemail reach a booking.",
      "Your calendar fills without anybody managing it.",
      "Every call has a transcript, so nothing is somebody's recollection.",
    ],
  },
};

/**
 * The three steps, shown on every service page.
 *
 * Section 4 of the strategy asks for a "3-step visual implementation flow
 * (Audit → Integrate → Launch)". These are that flow, worded to match the
 * engagement already described on /how-we-work rather than inventing a second
 * process the sales conversation would then contradict.
 */
export const implementationSteps = [
  {
    number: "01",
    title: "Audit",
    description:
      "Two weeks with your systems and the people who use them. You get a costed plan and a short list of risks, yours to keep whatever you decide next.",
  },
  {
    number: "02",
    title: "Integrate",
    description:
      "We build against what you run today. Your team carries on working while it happens, and nothing goes live until it has been tested on your own data.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "It goes into daily use, then we watch it. Models drift, so we retrain them and send a monthly report that takes five minutes to read.",
  },
] as const;
