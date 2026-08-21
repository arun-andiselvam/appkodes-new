/**
 * Silo 4, the top of the funnel.
 *
 * Its job in docs/hitasoft_ai_architecture_strategy.md is to catch "how do I"
 * searches and pass the reader down into a service silo. Three categories are
 * named there. Case studies is one of them, which is why it stopped being a
 * menu item of its own on 20 August 2026.
 *
 * !! THERE ARE NO ARTICLES YET !!
 *
 * So the category pages say so. The alternative was a grid of placeholder
 * cards with invented titles, which is the exact failure content/footer.ts was
 * cleaned of: a page that tells a visitor the site is unfinished while also
 * wasting the click.
 *
 * Each category still sends the reader somewhere real, which is the silo an
 * article in it would have linked to anyway. `sends` is that list. Replace
 * `planned` with a post list the week the first three are written. The routes
 * and the menu entries are already here, so nothing else has to change.
 */
export type ResourceCategory = {
  title: string;
  eyebrow: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  /** Working titles of the pieces being written. Not links, because they do not exist. */
  planned: string[];
  /** Where to go in the meantime. Every one is a real page. */
  sends: { name: string; href: string; blurb: string }[];
};

export const resourceCategories: Record<string, ResourceCategory> = {
  "/resources/integration-guides": {
    title: "Integration guides",
    eyebrow: "Resources",
    lede: "How a model gets into software that already exists, written for the person who has to approve it rather than the one who writes the code.",
    metaTitle: "AI Integration Guides",
    metaDescription:
      "Guides on integrating an LLM into existing software, from API setup and wrappers through to private deployment and data handling.",
    planned: [
      "What it actually takes to add AI to software you already run",
      "API integration or a private model, and how to tell which you need",
      "The questions to settle about your data before anybody builds",
    ],
    sends: [
      {
        name: "Custom AI API & Software Integration",
        href: "/services/ai-software-integration/custom-ai-api-integration",
        blurb: "The service these guides describe.",
      },
      {
        name: "Secure AI & Compliance Architecture",
        href: "/services/ai-software-integration/secure-ai-compliance-architecture",
        blurb: "For work where the data cannot leave your control.",
      },
      {
        name: "Data Engineering & Vector Databases",
        href: "/services/ai-data-predictive-analytics/data-engineering-vector-databases",
        blurb: "What has to be true of your data first.",
      },
    ],
  },

  "/resources/cost-reduction-strategies": {
    title: "Cost reduction strategies",
    eyebrow: "Resources",
    lede: "Where the repeat work sits in a growing company, what it is costing you already, and which part of it is worth automating first.",
    metaTitle: "AI Cost Reduction Strategies",
    metaDescription:
      "How to find the repeat work in your operations, what automating it returns, and how to keep model spend from growing with your usage.",
    planned: [
      "How to find the manual work that is already on your payroll",
      "Automate the queue or automate the paperwork, and which pays back sooner",
      "Keeping model spend flat while your usage grows",
    ],
    sends: [
      {
        name: "AI Workflow Automation",
        href: "/services/ai-workflow-automation",
        blurb: "The repeat work, handed to software.",
      },
      {
        name: "Private LLM Fine-Tuning",
        href: "/services/custom-ai-models-voice/private-llm-fine-tuning",
        blurb: "Where the monthly API bill goes to die.",
      },
      {
        name: "How we work",
        href: "/how-we-work",
        blurb: "Two weeks to a costed plan, before you commit anything.",
      },
    ],
  },
};
