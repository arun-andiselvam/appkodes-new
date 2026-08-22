import type { Post } from "@/lib/posts";

/**
 * !! NOT REAL CONTENT. DO NOT LAUNCH WITH THIS FILE WIRED UP. !!
 *
 * Ten invented posts, added 21 August 2026 so the category layout and the
 * pagination can be judged at volume. None of them exists, none of them has
 * been written, and every one of them is a link to nowhere.
 *
 * The file lives on its own and is imported from exactly one place, behind the
 * USE_SAMPLE_POSTS switch in lib/posts.ts. Turning it off is one boolean, and
 * deleting this file plus that import is the whole cleanup.
 *
 * This is the thing content/resources.ts warns against in capitals: "a grid of
 * placeholder cards with invented titles ... a page that tells a visitor the
 * site is unfinished while also wasting the click". That warning still stands.
 * It is suspended for a design review, not withdrawn.
 *
 * The titles are the real planned ones from content/resources.ts where they
 * exist, extended with plausible siblings. Dates run backwards from 20 August
 * 2026. Every `sendsTo` points at a page that genuinely exists, so the silo
 * links are testable even though the posts are not real.
 *
 * !! THE IMAGES IN public/sample ARE PLACEHOLDERS AND GO WITH THE REST !!
 *
 * Pulled from picsum.photos on 21 August 2026, which serves photographs under
 * the Unsplash licence. They are stand ins to judge the layout with real
 * photography in it, and they have nothing to do with what any of these posts
 * would be about. Delete the folder alongside this file.
 *
 * Whoever writes the first real post needs real artwork for it. A photograph
 * of a landscape sitting above a piece on ledger reconciliation is fine for
 * five minutes of design review and embarrassing in production.
 */
export const samplePosts: Post[] = [
  {
    slug: "what-it-takes-to-add-ai-to-existing-software",
    category: "/resources/integration-guides",
    title: "What it actually takes to add AI to software you already run",
    excerpt:
      "The work is mostly endpoints, data handling and ownership. Very little of it is the model.",
    published: "2026-08-20",
    readingMinutes: 9,
    image: "/sample/what-it-takes-to-add-ai-to-existing-software.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "Most of the effort is middleware, not the model.",
      "Data residency decides the architecture first.",
      "If nobody says where the keys end up, you are buying a dependency rather than an integration.",
    ],
    body: [
      { kind: "p", text: "Most of an AI integration is not modelling. It is deciding which endpoint gets called, what happens to the data on the way there, and who holds the thing afterwards." },
      { kind: "h2", text: "The model is the easy part" },
      { kind: "p", text: "Choosing between hosted and open weight takes an afternoon. Working out whether your data is allowed to leave the building takes longer, and it decides the first answer rather than the other way round." },
      { kind: "p", text: "The middleware is where the time goes. It has to speak your system's API, handle the cases the model gets wrong, and keep a record somebody can read six months later." },
      { kind: "callout", text: "If nobody can say where the keys end up, you are buying a dependency rather than an integration." },
    ],
    sendsTo: "/services/ai-software-integration",
  },
  {
    slug: "api-integration-or-a-private-model",
    category: "/resources/integration-guides",
    title: "API integration or a private model, and how to tell which you need",
    excerpt:
      "Where the data is allowed to sit decides this, long before any benchmark does.",
    published: "2026-08-13",
    readingMinutes: 7,
    image: "/sample/api-integration-or-a-private-model.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "A hosted API ships faster and costs less.",
      "Open weight on your own hardware sends nothing out.",
      "Data residency picks the answer, not benchmark scores.",
    ],
    body: [
      { kind: "p", text: "Two ways exist to put a model behind your software. The choice is usually made for you by where your data is allowed to sit." },
      { kind: "h2", text: "Hosted, with retention off" },
      { kind: "p", text: "A hosted API ships faster and costs less to start. Enterprise endpoints with retention switched off keep your inputs out of training sets, and that is a configuration rather than a promise." },
      { kind: "h2", text: "Open weight, on your own hardware" },
      { kind: "p", text: "An open weight model on a server you control never sends a record out of the building. It costs more to run and more to maintain, and for regulated work it is often the only version that gets signed off." },
    ],
    sendsTo: "/services/ai-software-integration/custom-ai-api-integration",
  },
  {
    slug: "questions-to-settle-about-your-data",
    category: "/resources/integration-guides",
    title: "The questions to settle about your data before anybody builds",
    excerpt:
      "Retention, residency and who reads the logs. Retrofitting these means doing the integration twice.",
    published: "2026-08-06",
    readingMinutes: 6,
    image: "/sample/questions-to-settle-about-your-data.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "Four data questions decide the shape of any integration.",
      "All four are policy questions rather than technical ones.",
      "Any of them retrofitted later means building twice.",
    ],
    body: [
      { kind: "p", text: "Four questions decide the shape of an integration, and all four are cheaper to answer before anybody writes code." },
      {
        kind: "list",
        items: [
          "Where is the data allowed to physically sit",
          "Who is able to read the logs once a model has seen a record",
          "What happens to an output nobody checked",
          "Who owns the prompts and the middleware at the end",
        ],
      },
      { kind: "p", text: "None of these is a technical question. They are policy questions that a technical decision then has to obey, and retrofitting any of them means doing the integration a second time." },
    ],
    sendsTo: "/services/ai-software-integration/secure-ai-compliance-architecture",
  },
  {
    slug: "connecting-a-legacy-crm-to-a-model",
    category: "/resources/integration-guides",
    title: "Connecting a legacy CRM to a current model without touching its code",
    excerpt:
      "An encrypted bridge and a middleware layer, for systems whose original developer is long gone.",
    published: "2026-07-30",
    readingMinutes: 8,
    image: "/sample/connecting-a-legacy-crm-to-a-model.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "A legacy system needs database access, not a rewrite.",
      "Middleware sits beside the system and leaves the code alone.",
      "The oldest system usually holds the data most worth searching.",
    ],
    body: [
      { kind: "p", text: "An older system does not have to be rewritten in order to reach a current model. It has to expose its data, and almost all of them do, whether through an API or the database underneath." },
      { kind: "h2", text: "The bridge, not the rebuild" },
      { kind: "p", text: "A middleware layer sits beside the system and talks to both sides of it, without touching either. The core code stays where it is, which matters most when whoever wrote it left years ago." },
      { kind: "callout", text: "The oldest system in the building is usually the one holding the data worth searching." },
    ],
    sendsTo: "/services/ai-software-integration",
  },
  {
    slug: "what-a-vector-database-is-for",
    category: "/resources/integration-guides",
    title: "What a vector database is for, in plain terms",
    excerpt:
      "Why search that understands a question needs one, and when your existing database will do.",
    published: "2026-07-23",
    readingMinutes: 5,
    image: "/sample/what-a-vector-database-is-for.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "A vector database finds records by meaning, not exact match.",
      "Plain words find the right record.",
      "PostgreSQL does this with an extension.",
    ],
    body: [
      { kind: "p", text: "Your database can find any record, as long as you already know its reference number. It cannot find the record that answers a question, and that gap is what a vector database closes." },
      { kind: "h2", text: "Matching meaning instead of matching text" },
      { kind: "p", text: "Text gets turned into numbers, and anything that means something similar ends up sitting near it. A question asked in plain words lands near the records that answer it, even when they share none of the same words." },
      { kind: "p", text: "You may not need a separate one. PostgreSQL does this with an extension, and for most companies that is a smaller change than adding another system to run." },
    ],
    sendsTo: "/services/ai-data-predictive-analytics/data-engineering-vector-databases",
  },
  {
    slug: "who-owns-the-integration-afterwards",
    category: "/resources/integration-guides",
    title: "Who owns the integration after the agency leaves",
    excerpt:
      "The keys, the prompts and the middleware. If nobody says where they end up, that is the answer.",
    published: "2026-07-16",
    readingMinutes: 6,
    image: "/sample/who-owns-the-integration-afterwards.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "The keys and the middleware should end up with you.",
      "An integration only one supplier can change is a subscription.",
      "Ask where it all lands before the work starts.",
    ],
    body: [
      { kind: "p", text: "The question nobody asks in a first meeting is what happens when the agency leaves. It decides more about the next three years than the choice of model ever does." },
      { kind: "h2", text: "What should end up with you" },
      {
        kind: "list",
        items: [
          "The API keys, in your own account rather than ours",
          "The middleware, in a repository you control",
          "The prompts, written down rather than living in somebody's editor",
          "A record of the decisions and why each was made",
        ],
      },
      { kind: "p", text: "An integration only one supplier is able to change is not an integration at all. It is a subscription with extra steps, and the price of it is discovered at renewal." },
    ],
    sendsTo: "/how-we-work",
  },

  {
    slug: "find-the-manual-work-on-your-payroll",
    category: "/resources/cost-reduction-strategies",
    title: "How to find the manual work that is already on your payroll",
    excerpt:
      "A week of counting beats a quarter of guessing. Here is what to count and how.",
    published: "2026-08-18",
    readingMinutes: 7,
    image: "/sample/find-the-manual-work-on-your-payroll.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "Automation pays back against work somebody already does.",
      "A week of counting beats a quarter of estimating.",
      "The most expensive process is the one nobody timed.",
    ],
    body: [
      { kind: "p", text: "Automation pays back against work somebody is already doing, so the first job is not technical. It is finding out what that work actually costs, which almost nobody has written down." },
      { kind: "h2", text: "Count for a week" },
      { kind: "p", text: "Ask the two or three people closest to it to note what they repeat and roughly how long it takes. A week of that beats a quarter of estimating, and it produces a number a budget holder will accept." },
      { kind: "callout", text: "The most expensive process in a company is usually the one nobody has ever timed." },
    ],
    sendsTo: "/services/ai-workflow-automation",
  },
  {
    slug: "the-queue-or-the-paperwork",
    category: "/resources/cost-reduction-strategies",
    title: "Automate the queue or automate the paperwork, and which pays back sooner",
    excerpt:
      "Both are automatable and they do not return at the same speed. The rules decide it.",
    published: "2026-08-11",
    readingMinutes: 6,
    image: "/sample/the-queue-or-the-paperwork.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "Paperwork automates first because its rules are written down.",
      "A queue looks repetitive, but the answers rarely are.",
      "Start with the clearest rules, not the biggest pile.",
    ],
    body: [
      { kind: "p", text: "Most companies can only afford to automate one thing first. The two candidates are almost always the same pair: the queue of repetitive requests, and the pile of paperwork somebody types into a system." },
      { kind: "p", text: "They do not pay back at the same speed, and the difference is not about which is bigger. It is about how clearly the rules are written down." },
      { kind: "h2", text: "The paperwork usually goes first" },
      {
        kind: "p",
        text: "Paperwork has a shape. An invoice has a supplier and a set of line items, and every invoice has them somewhere. A model reading one is doing extraction, which is a solved problem with a measurable error rate.",
        links: [
          { phrase: "doing extraction", href: "/services/ai-workflow-automation/document-processing-ocr" },
        ],
      },
      {
        kind: "p",
        text: "That measurability is what makes it pay back fast. You can hold back the low confidence ones for a person, watch the error rate for a fortnight, and know exactly what you have bought.",
        links: [
          { phrase: "hold back the low confidence ones", href: "/industries/fintech-and-finance" },
        ],
      },
      {
        kind: "h3",
        text: "What a person still does",
      },
      { kind: "p", text: "Somebody reviews the extractions the model flagged as uncertain, which is a fraction of the pile rather than all of it. That review is the thing that makes the rest trustworthy." },
      { kind: "h2", text: "The queue is harder than it looks" },
      { kind: "p", text: "A support queue looks repetitive because the questions repeat. The answers do not. Two customers asking the same thing often need different replies. One is inside their contract and the other is not, and that rule usually lives in somebody's head." },
      { kind: "callout", text: "Automation does not fail because the model is weak. It fails because nobody wrote the rule down." },
      {
        kind: "table",
        head: ["", "Paperwork", "The queue"],
        rows: [
          ["Input shape", "Consistent enough to extract", "Whatever the customer typed"],
          ["Rules", "Usually already written down", "Usually in somebody's head"],
          ["Error visible", "Same day, against the source", "Weeks later, from a complaint"],
          ["Time to payback", "Short, and measurable", "Longer, and harder to prove"],
        ],
      },
      { kind: "h2", text: "How to tell which one you have" },
      {
        kind: "list",
        items: [
          "Can somebody write the rule down in an afternoon, or does it need three people in a room",
          "Is the input the same shape every time, or does it arrive however the sender chose to send it",
          "When the process goes wrong, does anybody find out that week",
        ],
      },
      { kind: "p", text: "The one with the clearest rules goes first. A pilot dies when the messy one goes first, because the model gets blamed for a policy nobody had agreed." },
      { kind: "quote", text: "The rules you cannot write down are the rules you are not ready to automate." },
      { kind: "p", text: "Both eventually get done. The only question is which one earns you the confidence to fund the second one." },
    ],
    faqs: [
      {
        question: "Can we automate both at once?",
        answer:
          "You can. On a first project it is usually a mistake. Two builds at once means two sets of rules being argued about at the same time. Neither result comes out clean enough to make the case for funding a second one.",
      },
      {
        question: "How long before we know whether it worked?",
        answer:
          "For document work, about a fortnight of real traffic. That is long enough to see the error rate settle and short enough that nobody has committed to a second phase on a guess.",
      },
    ],
    sendsTo: "/services/ai-workflow-automation/document-processing-ocr",
  },
  {
    slug: "keeping-model-spend-flat",
    category: "/resources/cost-reduction-strategies",
    title: "Keeping model spend flat while your usage grows",
    excerpt:
      "Smaller models and caching are the levers most companies never pull. Both are design decisions.",
    published: "2026-08-04",
    readingMinutes: 8,
    image: "/sample/keeping-model-spend-flat.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "Model spend grows with usage unless somebody designs against it.",
      "Routing, caching and self hosting are the three levers.",
      "None of them needs a rewrite.",
    ],
    body: [
      { kind: "p", text: "A model bill starts small and grows with usage, which is fine until usage grows faster than revenue. Most of that curve is a design decision rather than something you have to accept." },
      { kind: "h2", text: "The levers most companies never pull" },
      {
        kind: "list",
        items: [
          "Route the easy work to a smaller model and keep the large one for what needs it",
          "Cache the answers to questions that repeat, because most of them do",
          "Move a high volume job onto an open weight model you host yourself",
        ],
      },
      { kind: "p", text: "None of these needs a rewrite. They are routing decisions, and the time to make them is before the bill is large enough to notice." },
    ],
    sendsTo: "/services/custom-ai-models-voice/private-llm-fine-tuning",
  },
  {
    slug: "what-an-automation-audit-should-produce",
    category: "/resources/cost-reduction-strategies",
    title: "What an automation audit should hand you at the end",
    excerpt:
      "A costed plan and a short list of risks, yours to keep whether you go ahead or not.",
    published: "2026-07-28",
    readingMinutes: 5,
    image: "/sample/what-an-automation-audit-should-produce.webp",
    author: "Hitasoft engineering",
    takeaways: [
      "An audit ending in a proposal is a sales document.",
      "You leave holding a costed plan and the risks.",
      "You keep all of it either way, which is the test of whether it was work.",
    ],
    body: [
      { kind: "p", text: "An audit ending in a proposal is a sales document. One worth paying for ends in something you could hand to a different supplier tomorrow." },
      { kind: "h2", text: "What you should be holding at the end" },
      {
        kind: "list",
        items: [
          "A costed plan, priced per piece of work rather than as one number",
          "The risks, written plainly, including the ones that argue against going ahead",
          "A map of the systems and where the integration points are",
        ],
      },
      { kind: "p", text: "You keep all of it either way. That is the test of whether the audit was work or a pitch with an invoice attached." },
    ],
    sendsTo: "/how-we-work",
  },
];
