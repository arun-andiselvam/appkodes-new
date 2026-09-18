import type { NavItem } from "./types";

/**
 * The main menu, and the site's silo structure.
 *
 * Built on 20 August 2026 from docs/hitasoft_ai_architecture_strategy.md, then
 * widened the same day when the strategy grew from two service silos to five.
 * Six parents own sixteen child pages between them, the sixth added on
 * 2 September 2026. Industries owns six.
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
          railNote: "Add AI without a rebuild",
          children: [
            {
              name: "Custom AI API & Software Integration",
              href: "/services/custom-ai-api-integration",
              blurb: "A model wired into the codebase your business runs on.",
            },
            {
              name: "Secure AI & Compliance Architecture",
              href: "/services/secure-ai-compliance-architecture",
              blurb: "Private deployment for data that cannot leave your control.",
            },
          ],
        },
        {
          name: "Workflow Automation",
          href: "/services/ai-workflow-automation",
          blurb:
            "Hand the repeat work to software so your team stops doing it by hand.",
          railNote: "Support, documents and ledgers",
          children: [
            {
              name: "Autonomous AI Agents",
              href: "/services/autonomous-ai-agents",
              blurb: "Multi-step jobs run across your tools without a person driving.",
            },
            {
              name: "Customer Support & Engagement",
              href: "/services/customer-support-ai",
              blurb: "Agents that answer from your own tickets and documentation.",
            },
            {
              name: "Document Processing & OCR",
              href: "/services/document-processing-ocr",
              blurb: "Invoices, contracts and receipts turned into database records.",
            },
            {
              name: "Financial & Data Automation",
              href: "/services/financial-data-automation",
              blurb: "Ledgers, expenses and reconciliation handled as they happen.",
            },
          ],
        },
        {
          name: "AI MVP Development",
          href: "/services/custom-ai-mvp-development",
          blurb:
            "For founders with a product to prove rather than a system to upgrade.",
          railNote: "Build the part that proves it",
          children: [
            {
              name: "Rapid AI Prototyping",
              href: "/services/rapid-ai-prototyping",
              blurb: "A working proof of concept before anybody funds the real build.",
            },
            {
              name: "Fintech & SaaS AI MVP",
              href: "/services/fintech-saas-ai-mvp",
              blurb: "An end-to-end product with AI in it from the first release.",
            },
            {
              name: "Smart Inventory & Retail MVP",
              href: "/services/smart-inventory-retail-mvp",
              blurb: "Stock tracking that forecasts instead of counting backwards.",
            },
          ],
        },
        {
          name: "Data & Predictive Analytics",
          href: "/services/ai-data-predictive-analytics",
          blurb:
            "Your own history, turned into a forecast the business acts on.",
          railNote: "Forecasting, BI and vision",
          children: [
            {
              name: "Predictive Analytics & BI",
              href: "/services/predictive-analytics-bi",
              blurb: "Sales, churn and pricing predicted from what already happened.",
            },
            {
              name: "Data Engineering & Vector Databases",
              href: "/services/data-engineering-vector-databases",
              blurb: "Messy company data cleaned so AI queries it without inventing.",
            },
            {
              name: "Computer Vision & Quality Control",
              href: "/services/computer-vision-quality-control",
              blurb: "Visual inspection and cataloguing done by a model, not an eye.",
            },
          ],
        },
        {
          name: "Custom Models & Voice",
          href: "/services/custom-ai-models-voice",
          blurb:
            "Your own model, hosted where you choose, answering in your own voice.",
          railNote: "Private models and phone agents",
          children: [
            {
              name: "Private LLM Fine-Tuning",
              href: "/services/private-llm-fine-tuning",
              blurb: "Open models trained on your data and hosted off the meter.",
            },
            {
              name: "AI Voice & Telephony",
              href: "/services/ai-voice-telephony-automation",
              blurb: "Calls answered, qualified and booked at any hour.",
            },
          ],
        },
        /*
         * Silo 6, added 2 September 2026. It is last on purpose.
         *
         * The five above it all start from something the visitor already runs,
         * which is the argument the whole site leads with. This one is the
         * exception, and a rail that opened on "we build new software" would
         * contradict the home page before anybody scrolled.
         *
         * !! THE ANCHOR TEXT HERE IS THE SILO'S DOWNWARD LINK !!
         *
         * The hub renders these two names and blurbs again in its own "Go
         * deeper on one part" section, which reads from childrenOf() below.
         * That is the hub to spoke link the strategy doc asks for, with the
         * child's exact phrase as the anchor, and it is why the names are the
         * keyword rather than something shorter and friendlier.
         *
         * The panel grows by one rail row. It was five rows against a pane
         * sized by the tallest silo, so the rail is now the taller side of the
         * two. Worth a look at 1440 before this ships.
         */
        {
          name: "AI App Development",
          href: "/services/ai-app-development",
          blurb:
            "The products that do not exist yet, built for phones and for the browser.",
          railNote: "New builds, mobile and web",
          children: [
            {
              name: "AI Mobile App Development",
              href: "/services/ai-mobile-app-development",
              blurb: "Apps that hold up on a real network and get through store review.",
            },
            {
              name: "AI Web App Development",
              href: "/services/ai-web-app-development",
              blurb: "Platforms with the model in the workflow and a person signing off.",
            },
          ],
        },
      ],
      /*
       * No footer strip on this panel, removed 23 August 2026 at the client's
       * request. It carried a "How we work" link and cost 57px of panel
       * height while leaving 38px empty under the last silo.
       *
       * The five silos took that height instead, as the railNote line above
       * plus wider spacing. Measured at 1440 wide, the panel was 329px before
       * and was meant to stay there.
       *
       * A sixth silo arrived on 2 September 2026 and the rail is now the
       * taller side of the panel rather than the pane. The height is worked
       * out from the content either way, so nothing snaps under the pointer,
       * but the number above is no longer the one on screen. Re-measure before
       * quoting it.
       *
       * How we work is still in the site footer and in the process section of
       * every service page, so it did not lose its only route in.
       *
       * Industries and Resources keep their footers. Theirs point at an index
       * of the panel's own contents, which is a different job.
       */
      /*
       * The dropdown, 18 September 2026: appkodes.com's six Services groups as
       * an editorial list, a next-steps strip, and a "live in 30 days" card.
       * The strip's "whatsapp" href is resolved to whatsappContact.href by the
       * navigation, so the number lives in one place.
       * Its "AI for your business" menu is left out: Appkodes carries no AI.
       *
       * !! THESE LINKS POINT AT appkodes.com FOR NOW !!
       *
       * None of these pages exists on this site yet, and every one of them is
       * live and ranking on appkodes.com. Absolute URLs keep the menu honest
       * until the pages are built here; then they become relative paths on the
       * same slugs so the old URLs keep working.
       */
      columns: [
        [
          {
            name: "Services",
            icon: "services",
            links: [
              { name: "SaaS", href: "https://appkodes.com/saas-development-company/" },
              { name: "Startup", href: "https://appkodes.com/startup-mobile-app-development/" },
              { name: "IoT", href: "https://appkodes.com/iot-app-development/" },
              { name: "MVP Software", href: "https://appkodes.com/mvp-software-development/" },
            ],
          },
          {
            name: "On Demand",
            icon: "onDemand",
            links: [
              { name: "Hyperlocal", href: "https://appkodes.com/hyperlocal-app-development/" },
              { name: "Taxi Booking", href: "https://appkodes.com/taxi-booking-app-development-company/" },
              { name: "Parking Finder", href: "https://appkodes.com/parking-finder-app-development/" },
            ],
          },
        ],
        [
          {
            name: "Entertainment",
            icon: "entertainment",
            links: [
              { name: "Social Media", href: "https://appkodes.com/social-media-app-development/" },
              { name: "Live Streaming", href: "https://appkodes.com/live-streaming-app-development/" },
              { name: "Short Video", href: "https://appkodes.com/short-video-app-development/" },
            ],
          },
          {
            name: "Delivery",
            icon: "delivery",
            links: [
              { name: "Food Delivery", href: "https://appkodes.com/food-delivery-app-development-company/" },
              { name: "Grocery Delivery", href: "https://appkodes.com/grocery-delivery-app-development-company/" },
              { name: "Pharmacy Delivery", href: "https://appkodes.com/pharmacy-delivery-app-development-company/" },
              { name: "Medicine Delivery", href: "https://appkodes.com/medicine-delivery-app-development-company/" },
            ],
          },
        ],
        [
          {
            name: "Buy and Sell",
            icon: "buySell",
            links: [
              { name: "Ecommerce", href: "https://appkodes.com/ecommerce-app-development-services/" },
              { name: "Real Estate", href: "https://appkodes.com/real-estate-app-development/" },
              { name: "Mobile App for Shopify Store", href: "https://appkodes.com/mobile-app-for-shopify-store/" },
            ],
          },
          {
            name: "Healthcare",
            icon: "healthcare",
            links: [
              { name: "Healthcare", href: "https://appkodes.com/healthcare-app-development-company/" },
              { name: "Mental Health", href: "https://appkodes.com/mental-health-app-development-company/" },
              { name: "ABDM Integrated Digital Solution", href: "https://appkodes.com/abdm-integrated-digital-solutions/" },
            ],
          },
        ],
      ],
      feature: {
        eyebrow: "Start here",
        title: "Your app, live in 30 days.",
        text: "A fixed price and a fixed launch date, agreed before we start.",
        stats: [
          { value: "1000+", label: "businesses served" },
          { value: "18 yrs", label: "shipping apps" },
        ],
        cta: "Get a free costed plan",
      },
      strip: [
        { name: "Get Free Quote", note: "Price and launch date first", href: "quote", icon: "quote" },
        { name: "WhatsApp us", note: "Talk to the team today", href: "whatsapp", icon: "whatsapp" },
        { name: "See case studies", note: "Apps we have shipped", href: "/resources/case-studies", icon: "cases" },
      ],
    },
  },
  {
    /*
     * Added 18 September 2026 in the Industries slot, at the client's request:
     * appkodes.com's Products menu, eighteen ready-made apps, presented as
     * solutions rather than as clone scripts. Each is named for what it is
     * ("Taxi Booking") with the product it resembles in the note ("like
     * Uber"), which is how a buyer searches for it.
     *
     * menuOnly: the links point at the live pages on appkodes.com until these
     * exist here, so nothing that builds the sitemap or the 404 finder reads
     * this item.
     */
    name: "Solutions",
    href: "https://appkodes.com/clone-scripts/",
    menuOnly: true,
    panel: {
      groups: [],
      solutions: [
        { name: "Classifieds Marketplace", note: "Buy and sell app, like OLX", icon: "arrowLeftRight", href: "https://appkodes.com/olx-clone/" },
        { name: "Short Video Classifieds", note: "Listings sold through short videos", icon: "clapperboard", href: "https://appkodes.com/short-video-classifieds/" },
        { name: "Short Video Sharing", note: "Short video app, like TikTok", icon: "video", href: "https://appkodes.com/tiktok-clone/" },
        { name: "Dating App", note: "Swipe and match, like Tinder", icon: "heart", href: "https://appkodes.com/tinder-clone/" },
        { name: "Photo and Video Sharing", note: "Social feed, like Instagram", icon: "camera", href: "https://appkodes.com/instagram-clone/" },
        { name: "Rental Marketplace", note: "Stays and rentals, like Airbnb", icon: "house", href: "https://appkodes.com/airbnb-clone/" },
        { name: "Live Streaming", note: "Live video and gifting, like Bigo Live", icon: "radio", href: "https://appkodes.com/bigo-live-clone/" },
        { name: "Doctor Appointments", note: "Booking and consults, like Practo", icon: "stethoscope", href: "https://appkodes.com/practo-clone/" },
        { name: "Taxi Booking", note: "Ride hailing, like Uber", icon: "car", href: "https://appkodes.com/uber-clone/" },
        { name: "Auction and Bidding", note: "Live auctions, like Tophatter", icon: "gavel", href: "https://appkodes.com/tophatter-clone/" },
        { name: "Coffee Shop Ordering", note: "Order ahead for cafés", icon: "coffee", href: "https://appkodes.com/coffee-shop-app-script/" },
        { name: "Multi-vendor Ecommerce", note: "Marketplace store, like Amazon", icon: "shoppingCart", href: "https://appkodes.com/amazon-clone/" },
        { name: "Random Video Chat", note: "Meet new people on video, like Chatroulette", icon: "users", href: "https://appkodes.com/chatroulette-clone/" },
        { name: "Table Booking", note: "Restaurant reservations, like OpenTable", icon: "calendarCheck", href: "https://appkodes.com/opentable-clone/" },
        { name: "OTT Streaming", note: "Movies and series, like Netflix", icon: "tv", href: "https://appkodes.com/netflix-clone/" },
        { name: "On-demand Services", note: "Home services, like Urban Company", icon: "wrench", href: "https://appkodes.com/urbanclap-clone/" },
        { name: "Chat Messenger", note: "Private messaging, like WhatsApp", icon: "messageSquare", href: "https://appkodes.com/whatsapp-clone-script/" },
        { name: "Delivery Super App", note: "Food, grocery and parcels in one app", icon: "truck", href: "https://appkodes.com/doordash-clone/" },
      ],
      callout: {
        eyebrow: "Something else?",
        title: "Not finding what you need?",
        text: "Most of the apps we build are custom. Tell us the idea, and a free costed plan comes back with a price and a date.",
        cta: { name: "Contact us", href: "/contact" },
      },
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
    // Out of the menu since 18 September 2026; Solutions took its slot.
    menuHidden: true,
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
          /*
           * Rewritten 24 August 2026, when the page behind it was built.
           *
           * It read "Creative and campaign production at volume, without the
           * headcount it used to take." The page argues the opposite: it
           * declines content generated at volume by name, because Google
           * demotes it as scaled content abuse, and leads on forecasting spend
           * and clustering search terms instead. This blurb renders in the
           * header on every route, on the industries hub and in the 404
           * finder, so the promise the whole site was making did not match the
           * page it linked to.
           */
          blurb: "Campaign returns forecast before the budget is placed.",
        },
      ],
      /*
       * !! NEITHER REMAINING FOOTER STRIP POINTS AT ITS OWN PANEL ANY MORE !!
       *
       * This one read "All industries" and went to /industries. Both it and
       * the Resources strip below were changed to How we work on 24 August
       * 2026 at the client's request, so whichever panel a visitor opens has
       * the same way through to the engagement.
       *
       * The background: How we work lost its only route in from the header on
       * 23 August, when the Services panel footer was removed to save panel
       * height. The page has since been rewritten to rank for
       * `AI MVP development process`, which made a header route worth having
       * again.
       *
       * !! /industries AND /resources ARE NOT ORPHANED BY THIS !!
       *
       * Each is the `href` of its own menu item, which is where
       * `allNavRoutes` picks it up for the sitemap, and content/footer.ts
       * lists both again in the site footer. Verify both before pointing
       * either strip anywhere else.
       */
      footer: {
        name: "How we work",
        href: "/how-we-work",
        blurb: "How an engagement actually runs, week by week.",
      },
    },
  },
  {
    /*
     * The Resources menu from 18 September 2026: nine blog categories for app
     * development, in the Solutions layout. A presentation placeholder at the
     * client's request: the categories are not in the CMS yet, so every one
     * links to /blog. Case studies came out of this menu; they are linked from
     * the hero, the Services menu and the closing panel.
     *
     * menuOnly, like Solutions. The original Resources item below stays for
     * the sitemap and the /resources hub, hidden from the menu.
     */
    name: "Resources",
    href: "/blog",
    menuOnly: true,
    panel: {
      groups: [],
      solutions: [
        { name: "App Development Guides", note: "Planning, building and launching an app", icon: "bookOpen", href: "/blog" },
        { name: "Cost and Pricing", note: "What apps cost, and where the money goes", icon: "wallet", href: "/blog" },
        { name: "MVPs and Startups", note: "A first version that proves demand", icon: "rocket", href: "/blog" },
        { name: "Design and UX", note: "Screens people understand on first open", icon: "palette", href: "/blog" },
        { name: "Marketplaces and Classifieds", note: "Building and scaling buy and sell platforms", icon: "store", href: "/blog" },
        { name: "On-demand and Delivery", note: "Taxi, food and delivery apps end to end", icon: "bike", href: "/blog" },
        { name: "Streaming and Social", note: "Live video, short video and feeds at scale", icon: "radio", href: "/blog" },
        { name: "App Store Launch", note: "Publishing, reviews and your first users", icon: "smartphone", href: "/blog" },
        { name: "Tech Stack Choices", note: "Native, cross platform or web, and why", icon: "layers", href: "/blog" },
      ],
      callout: {
        eyebrow: "From the blog",
        title: "Notes from the build.",
        text: "How we plan, price and ship apps, written up from real projects.",
        cta: { name: "Read the blog", href: "/blog" },
      },
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
    // Hidden from the menu since 18 September 2026; the menu-only item above
    // took its slot. Kept for the sitemap, breadcrumbs and the /resources hub.
    menuHidden: true,
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
      /*
       * This strip read "All resources" and went to /resources until 24
       * August 2026, then "How we work" until 25 August, when the client
       * asked for it to point at a single paginated list of every post.
       *
       * /blog is that list, and it is deliberately not /resources: that page
       * is the silo hub, whose job is to send a reader to the right category.
       * See the note at the top of components/sections/blog-index.tsx for why
       * the two coexist rather than one replacing the other.
       *
       * !! /how-we-work IS NOT ORPHANED BY THIS !!
       *
       * The Industries panel footer still points at it, which is where
       * `allNavRoutes` picks it up for the sitemap, and content/footer.ts
       * lists it again in the site footer. Check both before repointing that
       * strip too.
       */
      footer: {
        name: "Show all resources",
        href: "/blog",
        blurb: "Every guide, newest first.",
        /* The page behind this strip is titled Blog, and every article's
           breadcrumb passes through it. See `crumb` in content/types.ts. */
        crumb: "Blog",
      },
    },
  },
  /*
   * The first external item in this menu. internship.hitasoft.com is the
   * internship programme's own site rather than a page in this app, so it
   * carries no panel and `external: true` so the click opens a new tab
   * instead of routing away from the marketing site. Added 24 August 2026 at
   * the client's request.
   */
  /*
   * Was "Academy", linking to internship.hitasoft.com. Renamed "Store" on
   * 18 September 2026; the store has no URL yet, so it points at /contact.
   * menuOnly keeps a "Store" entry out of the 404 finder until it is real.
   */
  { name: "Store", href: "/contact", menuOnly: true },
  /*
   * Added 25 August 2026 at the client's request, alongside the page itself.
   * No panel: one page, not a silo, same as Contact below it. Placed after
   * Academy rather than inside Resources or Industries, because an open role
   * is neither reading material nor a sector this company sells into.
   */
  // Out of the menu since 18 September 2026 at the client's request; the
  // /careers page stays, and so does its sitemap entry.
  { name: "Careers", href: "/careers", menuHidden: true },
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
 * Every page on the site with the words a person would search for it by.
 *
 * The same walk as `allNavRoutes` above, carrying what that one throws away.
 * The 404 finder needs a name and a line of description per route, and both
 * already exist on the tree: a group and a child each have a `blurb` written
 * for a buyer scanning the menu, which is exactly the text somebody who
 * mistyped a URL would recognise.
 *
 * `section` is the top level item the page sits under, so a result can say
 * where it lives without the finder re-deriving the hierarchy.
 *
 * Home is included here and is not in `allNavRoutes`. The menu leaves it out
 * because the wordmark is the home link, and somebody who has just hit a 404
 * should still be offered it.
 */
export type NavPage = { name: string; href: string; section: string; blurb: string };

export function allNavPages(): NavPage[] {
  const pages: NavPage[] = [
    {
      name: "Home",
      href: "/",
      section: "Hitasoft",
      blurb: "AI automation for the systems a growing business already runs.",
    },
  ];

  for (const item of mainNav) {
    if (item.menuOnly) continue;
    pages.push({
      name: item.name,
      href: item.href,
      section: item.name,
      blurb: `Everything under ${item.name.toLowerCase()}.`,
    });

    for (const group of item.panel?.groups ?? []) {
      if (group.href !== item.href) {
        pages.push({
          name: group.name,
          href: group.href,
          section: item.name,
          blurb: group.blurb,
        });
      }
      for (const child of group.children ?? []) {
        pages.push({
          name: child.name,
          href: child.href,
          section: item.name,
          blurb: child.blurb,
        });
      }
    }

    /*
     * The blurb comes off the footer now rather than being written here.
     *
     * This line was a string literal reading "How an engagement actually runs,
     * week by week." It was correct while the Services panel footer was the
     * only one and it pointed at How we work. That strip went on 23 August
     * 2026 and the sentence stayed, so from then until 24 August the 404
     * finder offered "All industries" and "All resources" and described both
     * as an engagement.
     *
     * Both strips point at How we work again, so the old literal would happen
     * to be right today. It is still wrong to keep it here, because it is only
     * right by coincidence and the next person to repoint a strip inherits the
     * same bug.
     */
    const footer = item.panel?.footer;
    if (footer) {
      pages.push({
        name: footer.name,
        href: footer.href,
        section: item.name,
        blurb: footer.blurb,
      });
    }
  }

  /* Same de-duplication as above, keeping the first mention of a route. */
  const seen = new Set<string>();
  return pages.filter((p) => !seen.has(p.href) && seen.add(p.href));
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
 *
 * !! IT WALKED groups AND NOT footer, AND THAT WAS A BUG !!
 *
 * `allNavRoutes` above walks both. This walked only the groups, so any page
 * reachable through a panel's footer strip - /blog, and /how-we-work from the
 * Industries panel - got the "not in the tree" answer and no trail at all.
 * Nobody saw it, because components/layout/breadcrumbs.tsx draws nothing by
 * default and a trail shorter than two crumbs suppresses the BreadcrumbList
 * schema with it. So those pages had been shipping no breadcrumb markup at
 * all, silently, and the article template found it the moment it asked for a
 * visible trail on 26 August 2026.
 *
 * Two walks over the same tree that disagree about what is in it is the shape
 * of the problem. Anything added to the tree from here on has to appear in
 * both.
 */
export function trailFor(href: string): { name: string; href: string }[] {
  const home = { name: "Home", href: "/" };

  for (const item of mainNav) {
    if (item.href === href) return [home, { name: item.name, href: item.href }];

    const top = { name: item.name, href: item.href };

    for (const group of item.panel?.groups ?? []) {
      if (group.href === href) return [home, top, { name: group.name, href: group.href }];

      for (const child of group.children ?? []) {
        if (child.href === href) {
          return [home, top, { name: group.name, href: group.href }, { name: child.name, href: child.href }];
        }
      }
    }

    /* The footer strip, checked after the groups so a route listed in both
       keeps the more specific parent. See `crumb` in content/types.ts for
       why the label here is not always the strip's own. */
    const footer = item.panel?.footer;
    if (footer && footer.href === href) {
      return [home, top, { name: footer.crumb ?? footer.name, href: footer.href }];
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
