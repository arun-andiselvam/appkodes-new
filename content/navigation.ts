import type { NavItem } from "./types";

/**
 * The main menu, and the site's silo structure.
 *
 * Built on 20 August 2026 from docs/hitasoft_ai_architecture_strategy.md, then
 * widened the same day when the strategy grew from two service silos to five.
 * Five parents own fourteen child pages between them. Industries owns six.
 * Resources owns three, and case studies is one of them rather than a menu
 * item of its own.
 *
 * !! THIS FILE IS THE SITE MAP !!
 *
 * The header, the mobile menu, the footer, the 404 and app/sitemap.ts all read
 * from here. A page added to the tree is in all five by the time it renders,
 * and a page that exists but is missing from the tree is invisible to every
 * one of them. One list is the only way the menu and the sitemap stay in
 * agreement past about two pages.
 *
 * !! EVERY href BELOW HAS A PAGE BEHIND IT !!
 *
 * The rule content/footer.ts sets out applies here with more force, because
 * the header renders on every route. Nothing goes in this tree before the
 * route exists. Adding the menu first and the pages later means shipping a
 * site whose own navigation returns 404s.
 *
 * Home is not listed. The wordmark on the left is the home link, and a second
 * one would spend a menu slot on a convention every visitor already knows.
 */
export const mainNav: NavItem[] = [
  {
    name: "Services",
    href: "/services",
    panel: {
      groups: [
        {
          name: "AI Integration",
          href: "/services/ai-software-integration",
          blurb:
            "Make the software you already run intelligent, without rebuilding it.",
          children: [
            {
              name: "Custom AI API & Software Integration",
              href: "/services/ai-software-integration/custom-ai-api-integration",
              blurb: "A model wired into the codebase your business runs on.",
            },
            {
              name: "Secure AI & Compliance Architecture",
              href: "/services/ai-software-integration/secure-ai-compliance-architecture",
              blurb: "Private deployment for data that cannot leave your control.",
            },
          ],
        },
        {
          name: "Workflow Automation",
          href: "/services/ai-workflow-automation",
          blurb:
            "Hand the repeat work to software so your team stops doing it by hand.",
          children: [
            {
              name: "Autonomous AI Agents",
              href: "/services/ai-workflow-automation/autonomous-ai-agents",
              blurb: "Multi-step jobs run across your tools without a person driving.",
            },
            {
              name: "Customer Support & Engagement",
              href: "/services/ai-workflow-automation/customer-support-ai",
              blurb: "Agents that answer from your own tickets and documentation.",
            },
            {
              name: "Document Processing & OCR",
              href: "/services/ai-workflow-automation/document-processing-ocr",
              blurb: "Invoices, contracts and receipts turned into database records.",
            },
            {
              name: "Financial & Data Automation",
              href: "/services/ai-workflow-automation/financial-data-automation",
              blurb: "Ledgers, expenses and reconciliation handled as they happen.",
            },
          ],
        },
        {
          name: "AI MVP Development",
          href: "/services/custom-ai-mvp-development",
          blurb:
            "For founders with a product to prove rather than a system to upgrade.",
          children: [
            {
              name: "Rapid AI Prototyping",
              href: "/services/custom-ai-mvp-development/rapid-ai-prototyping",
              blurb: "A working proof of concept before anybody funds the real build.",
            },
            {
              name: "Fintech & SaaS AI MVP",
              href: "/services/custom-ai-mvp-development/fintech-saas-ai-mvp",
              blurb: "An end-to-end product with AI in it from the first release.",
            },
            {
              name: "Smart Inventory & Retail MVP",
              href: "/services/custom-ai-mvp-development/smart-inventory-retail-mvp",
              blurb: "Stock tracking that forecasts instead of counting backwards.",
            },
          ],
        },
        {
          name: "Data & Predictive Analytics",
          href: "/services/ai-data-predictive-analytics",
          blurb:
            "Your own history, turned into a forecast the business acts on.",
          children: [
            {
              name: "Predictive Analytics & BI",
              href: "/services/ai-data-predictive-analytics/predictive-analytics-bi",
              blurb: "Sales, churn and pricing predicted from what already happened.",
            },
            {
              name: "Data Engineering & Vector Databases",
              href: "/services/ai-data-predictive-analytics/data-engineering-vector-databases",
              blurb: "Messy company data cleaned so AI queries it without inventing.",
            },
            {
              name: "Computer Vision & Quality Control",
              href: "/services/ai-data-predictive-analytics/computer-vision-quality-control",
              blurb: "Visual inspection and cataloguing done by a model, not an eye.",
            },
          ],
        },
        {
          name: "Custom Models & Voice",
          href: "/services/custom-ai-models-voice",
          blurb:
            "Your own model, hosted where you choose, answering in your own voice.",
          children: [
            {
              name: "Private LLM Fine-Tuning",
              href: "/services/custom-ai-models-voice/private-llm-fine-tuning",
              blurb: "Open models trained on your data and hosted off the meter.",
            },
            {
              name: "AI Voice & Telephony",
              href: "/services/custom-ai-models-voice/ai-voice-telephony-automation",
              blurb: "Calls answered, qualified and booked at any hour.",
            },
          ],
        },
      ],
      /*
       * How we work is not a service, so it is not a group. It answers the
       * question the panel provokes, which is what working with us would
       * actually be like, so it sits on the strip underneath rather than
       * taking a slot in the main menu it would have to win from a silo.
       */
      footer: { name: "How we work", href: "/how-we-work" },
    },
  },
  {
    /*
     * Industries came out of the menu on 19 August 2026 because it pointed at
     * an anchor about models and tooling and there was no industries content
     * to route to. There is now. The rule that removed it is the same rule
     * letting it back.
     *
     * These six own no child pages, so the panel draws them as cards rather
     * than as a rail, three to a row. See components/layout/navigation.tsx.
     */
    name: "Industries",
    href: "/industries",
    panel: {
      groups: [
        {
          name: "Fintech & Finance",
          href: "/industries/fintech-and-finance",
          blurb:
            "Ledgers, expenses and reconciliation without a person retyping them.",
        },
        {
          name: "Retail & Inventory",
          href: "/industries/retail-and-inventory",
          blurb:
            "Stock that forecasts itself, and ordering that does not wait on a guess.",
        },
        {
          name: "Healthcare & Consulting",
          href: "/industries/healthcare-and-consulting",
          blurb:
            "Consultations and records handled by AI that keeps patient data private.",
        },
        {
          name: "Media & Communities",
          href: "/industries/media-and-communities",
          blurb:
            "Feeds that rank themselves, and moderation that keeps pace with sign-ups.",
        },
        {
          name: "EdTech & Learning",
          href: "/industries/edtech-and-learning",
          blurb:
            "Practice set from a learner's own progress, and spoken work marked as it lands.",
        },
        {
          name: "Marketing & AdTech",
          href: "/industries/marketing-and-adtech",
          blurb:
            "Creative and campaign production at volume, without the headcount it used to take.",
        },
      ],
      footer: { name: "All industries", href: "/industries" },
    },
  },
  {
    /*
     * Case studies used to be a menu item of its own pointing at /results. It
     * is a resource, and the strategy files it as one, so it moved under here
     * on 20 August 2026 and the menu lost a slot. Both old URLs redirect; see
     * next.config.mjs.
     */
    name: "Resources",
    href: "/resources",
    panel: {
      groups: [
        {
          name: "Integration Guides",
          href: "/resources/integration-guides",
          blurb:
            "How a model gets into software that already exists, written for whoever approves it.",
        },
        {
          name: "Cost Reduction",
          href: "/resources/cost-reduction-strategies",
          blurb:
            "Where the repeat work sits in a growing company, and what to automate first.",
        },
        {
          name: "Case Studies",
          href: "/resources/case-studies",
          blurb:
            "What the work returned, and what clients say about it without us editing them.",
        },
      ],
      footer: { name: "All resources", href: "/resources" },
    },
  },
  { name: "Contact", href: "/contact" },
];

/**
 * Every route on the site, flattened, in menu order.
 *
 * app/sitemap.ts walks this. Home is prepended there rather than here, since
 * the menu does not list it. /how-we-work reaches this list through the
 * Services panel footer, which is the only place the header links it.
 */
export function allNavRoutes(): string[] {
  const routes: string[] = [];

  for (const item of mainNav) {
    routes.push(item.href);
    for (const group of item.panel?.groups ?? []) {
      if (group.href !== item.href) routes.push(group.href);
      for (const child of group.children ?? []) routes.push(child.href);
    }
    const footer = item.panel?.footer;
    if (footer) routes.push(footer.href);
  }

  return [...new Set(routes)];
}

/**
 * The trail from the home page down to `href`, inclusive.
 *
 * A silo only pays for itself if a visitor who lands three levels down from a
 * search result finds their way up. The breadcrumb is that route, and reading
 * it off the same tree the menu uses means it cannot describe a hierarchy the
 * menu disagrees with.
 *
 * Returns just Home for anything not in the tree, which is the honest answer
 * for a page with no parent rather than a guessed one.
 */
export function trailFor(href: string): { name: string; href: string }[] {
  const home = { name: "Home", href: "/" };

  for (const item of mainNav) {
    if (item.href === href) return [home, { name: item.name, href: item.href }];

    for (const group of item.panel?.groups ?? []) {
      const top = { name: item.name, href: item.href };
      if (group.href === href) return [home, top, { name: group.name, href: group.href }];

      for (const child of group.children ?? []) {
        if (child.href === href) {
          return [home, top, { name: group.name, href: group.href }, { name: child.name, href: child.href }];
        }
      }
    }
  }

  return [home];
}

/**
 * The child pages sitting under a silo parent, or an empty list.
 *
 * A silo only works if the parent links down to its children. The header does
 * it only for the silo the pointer is resting on, which is correct behaviour
 * for a menu and useless as the sole route in. This is what
 * components/sections/silo-page.tsx renders so every parent lists its own.
 */
export function childrenOf(href: string) {
  for (const item of mainNav) {
    for (const group of item.panel?.groups ?? []) {
      if (group.href === href) return group.children ?? [];
    }
  }
  return [];
}
