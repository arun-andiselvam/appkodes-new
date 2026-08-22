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
  /**
   * The passage that makes this a hub rather than an archive.
   *
   * !! A CATEGORY PAGE THAT ONLY LISTS POSTS RANKS FOR NOTHING !!
   *
   * Added 21 August 2026. A list of links gives an answer engine nothing to
   * quote, and gives Google no reason to rank /resources/integration-guides
   * for "AI integration guides", because every post under it is a better
   * match for its own narrower query. The category gets outranked by its own
   * children.
   *
   * So the page answers its own question first, in a passage that stands up
   * with none of the page around it, and lists the posts underneath. Same
   * reasoning as the summary block on the service and industry pages.
   *
   * This copy is real and stays whether there are posts or not, which is what
   * makes the category a finished page today rather than a placeholder.
   */
  pillar: {
    heading: string;
    body: string;
    points: { title: string; body: string }[];
  };
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
    /*
     * !! ANSWER THE READER, DO NOT DESCRIBE THE CATEGORY !!
     *
     * This read "What an integration guide has to answer", and it closed with
     * "These guides work through those questions in the order they come up".
     * Both were writing about the guides rather than being useful to somebody
     * who came to learn about AI integration. A section explaining what a good
     * article contains is navel gazing, and a reader can tell.
     *
     * The substance underneath was fine and is kept. Only the framing changed,
     * from a specification for an article into the answers themselves.
     * Corrected 21 August 2026.
     */
    pillar: {
      heading: "What an AI integration actually turns on",
      body: "A model going into software that already exists is mostly not a modelling problem at all. The endpoint you call and the place your data is allowed to sit decide more than the model choice ever does.",
      points: [
        {
          title: "Which endpoint",
          body: "A hosted API is faster to ship and an open weight model on your own hardware keeps the data in the building. Where the data is allowed to sit decides it, and benchmark scores rarely come into it.",
        },
        {
          title: "What happens to the data",
          body: "Retention switched off on a hosted endpoint is what keeps your inputs out of training sets. Residency and who can read the logs get settled before anybody writes code, because retrofitting them means building twice.",
        },
        {
          title: "Who holds it afterwards",
          body: "The keys and the middleware should end up with you rather than with the agency. An integration nobody but the agency can change is a dependency wearing a different name.",
        },
      ],
    },
    planned: [
      "What it actually takes to add AI to software you already run",
      "API integration or a private model, and how to tell which you need",
      "The questions to settle about your data before anybody builds",
    ],
    sends: [
      {
        name: "Custom AI API & Software Integration",
        href: "/services/custom-ai-api-integration",
        blurb: "The service these guides describe.",
      },
      {
        name: "Secure AI & Compliance Architecture",
        href: "/services/secure-ai-compliance-architecture",
        blurb: "For work where the data cannot leave your control.",
      },
      {
        name: "Data Engineering & Vector Databases",
        href: "/services/data-engineering-vector-databases",
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
    pillar: {
      heading: "Where the money actually is",
      // Closed with "These pieces cover finding the first and containing the
      // second", which described the category instead of answering anything.
      // Same correction as the integration guides pillar above.
      body: "Most automation savings are already on the payroll, in work somebody does by hand every week. The second cost runs the other way. A model bill starts small and grows with usage in a way nobody plans for.",
      points: [
        {
          title: "Find the work first",
          body: "Automation pays back against a task somebody already does, so that task has to be measured first. A week of counting beats a quarter of guessing.",
        },
        {
          title: "Pick the one that pays soonest",
          body: "A queue and a pile of paperwork are both automatable, and they do not pay back at the same speed. The one with the clearest rules usually goes first.",
        },
        {
          title: "Keep the bill flat",
          body: "Model spend grows with usage unless somebody designs against it. Smaller models and caching are the usual levers, and most companies never pull either one.",
        },
      ],
    },
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
        href: "/services/private-llm-fine-tuning",
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
