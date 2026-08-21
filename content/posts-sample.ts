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
    sendsTo: "/how-we-work",
  },
];
