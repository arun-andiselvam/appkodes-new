import type { ServicePage } from "./types";

/**
 * The industry pages.
 *
 * Six of them. Three are named in docs/hitasoft_ai_architecture_strategy.md as
 * originally written; media and communities, edtech and learning, and
 * marketing and adtech were added on 21 August 2026 and the doc was updated to
 * match. They use the same blueprint as the service pages, because an industry
 * page is doing the same job: name the friction somebody in that trade already
 * recognises, then say what we build for it.
 *
 * Renamed on 20 August 2026, from ai-for-healthcare and its two siblings to
 * the shorter slugs the strategy settled on. Those URLs were never published,
 * so nothing redirects.
 *
 * These are use cases rather than a claim to specialise. content/site.ts holds
 * a longer list of industries for the section on the home page, and that list
 * is not this one on purpose. A page goes here once there is something
 * specific to say about the work in that sector.
 *
 * The same no-figures rule as content/services.ts applies.
 */
export const industryPages: Record<string, ServicePage> = {
  "/industries/fintech-and-finance": {
    slug: "fintech-and-finance",
    title: "AI for fintech & finance",
    eyebrow: "Industries",
    lede: "Ledgers, expenses and reconciliation handled by software, so your finance team stops living in a spreadsheet.",
    metaTitle: "AI for Fintech & Financial Management",
    metaDescription:
      "Fintech AI automation services. Automated expense tracking, ledger management and reconciliation built into the systems you already run.",
    problem: {
      heading: "Finance is a month of manual work per month",
      body: "Money moves between systems that were never introduced to each other. Somebody reconciles them by hand. It works until volume doubles, then it quietly stops working.",
      points: [
        "Expenses categorised by hand, weeks after they happened.",
        "Balances that disagree across two systems and nobody knows why.",
        "Audit trails assembled after the fact, from memory and email.",
      ],
    },
    solution: {
      heading: "Reconciled as it happens",
      body: "Transactions get categorised and matched against your ledger as they arrive. Anything that does not reconcile goes to a person, with the reason attached rather than hidden inside a total.",
      points: [
        "Automated expense capture, categorisation and approval routing.",
        "Ledger matching with a queue for genuine exceptions.",
        "Real-time balance and debt positions rather than month-end ones.",
        "An audit trail written as the work happens.",
      ],
    },
    outcomes: [
      "Month end becomes a review rather than a rebuild.",
      "Discrepancies surface the day they happen.",
      "Whoever holds the budget sees the position without asking.",
    ],
  },

  "/industries/retail-and-inventory": {
    slug: "retail-and-inventory",
    title: "AI for retail & inventory",
    eyebrow: "Industries",
    lede: "Stop guessing your stock levels. We put forecasting into the inventory system you already run.",
    metaTitle: "AI for Retail & Inventory Management",
    metaDescription:
      "Predictive inventory AI for retailers and online stores. Forecast stock, categorise automatically and trigger reordering before you run out.",
    problem: {
      heading: "Stock is either missing or sitting there",
      body: "Retail runs on a guess about next month. Guess low and you sell out of the thing everyone wanted. Guess high and your cash is sitting in a warehouse.",
      points: [
        "Reorder points set once and never revisited.",
        "Seasonal demand handled from memory rather than history.",
        "Slow lines tying up money that faster lines needed.",
      ],
    },
    solution: {
      heading: "Your own sales history, put to work",
      body: "The forecast is built from what you have already sold, not from an industry average. It watches each line and flags the ones about to run short while there is still time to order.",
      points: [
        "Demand forecasting per line, from your own sales record.",
        "Automated reorder triggers your buyer approves or overrides.",
        "Product categorisation and enrichment handled in bulk.",
        "Visual defect checking on goods in, where it earns its place.",
      ],
    },
    outcomes: [
      "Fewer stockouts on the lines that actually sell.",
      "Less cash held in stock nobody is asking for.",
      "Your buyer reviews decisions instead of making all of them.",
    ],
  },

  "/industries/healthcare-and-consulting": {
    slug: "healthcare-and-consulting",
    title: "AI for healthcare & consulting",
    eyebrow: "Industries",
    lede: "Private models for platforms handling consultations and records, built so patient data never leaves where you put it.",
    metaTitle: "AI for Healthcare & Secure Consultations",
    metaDescription:
      "Compliant AI development for healthcare and consulting platforms. Private model deployment, secure live consultation tooling and evidenced data handling.",
    problem: {
      heading: "The data rules out most of the market",
      body: "Healthcare and consulting platforms want the same automation everybody else is getting. The obstacle is not the technology. It is that patient data cannot be posted to a third party and forgotten about.",
      points: [
        "Consultation notes and records carry real legal weight.",
        "Most vendors want your data on their servers to work at all.",
        "A breach here is not an incident report, it is a regulator.",
      ],
    },
    solution: {
      heading: "The model comes to the data",
      body: "We deploy privately where the sensitivity demands it, inside infrastructure you control. Where a hosted model is acceptable, records get stripped of identifying fields before anything is sent.",
      points: [
        "Private model deployment inside your own environment.",
        "Identifying fields removed before a model ever reads a record.",
        "Live video and closed community work handled without exposure.",
        "Access and retention documented for whoever asks.",
      ],
    },
    outcomes: [
      "Automation your compliance officer signs rather than blocks.",
      "Consultation and record handling that survives an audit.",
      "No dependence on one vendor's terms of service.",
    ],
  },

  "/industries/media-and-communities": {
    slug: "media-and-communities",
    title: "AI for media, communities & secure consulting",
    eyebrow: "Industries",
    lede: "A feed worth opening and moderation that keeps pace, on platforms where the conversation is the product.",
    metaTitle: "AI for Media, Communities & Secure Consulting",
    metaDescription:
      "Community platform AI integration. Intelligent feeds, automated moderation and compliant AI app development for closed communities and live video consulting.",
    problem: {
      heading: "The conversation is the product, and people do not scale",
      body: "A platform people talk on lives or dies on two things: whether the feed is worth opening, and whether the worst post of the day gets caught. Both are done by hand, and neither keeps pace with sign-ups.",
      points: [
        "Moderation queues growing faster than the team reading them.",
        "A feed ordered by recency, so the best thing posted goes unseen.",
        "Consulting and video features carrying privacy rules the rest of the product never had to meet.",
      ],
    },
    solution: {
      heading: "Read everything, escalate what needs a person",
      body: "Models rank the feed on what members actually engage with, and read every post on the way in, so the queue holds the genuinely borderline calls rather than all of them. Where the platform also carries consultations, that side sits behind its own data boundary.",
      points: [
        "Feed and recommendation ranking built on your own engagement data.",
        "Automated moderation with a queue for the calls a person should make.",
        "Data safety architecture for live video consulting and private rooms.",
        "Access and retention rules documented per feature rather than per platform.",
      ],
    },
    outcomes: [
      "Moderators spend their hours on the posts that need judgement.",
      "Members see the thing they would otherwise have scrolled past.",
      "The consulting side of the product holds up to a privacy review.",
    ],
  },

  "/industries/edtech-and-learning": {
    slug: "edtech-and-learning",
    title: "AI for EdTech & digital learning",
    eyebrow: "Industries",
    lede: "Courses that respond to the learner in front of them, rather than playing the same video at everybody.",
    metaTitle: "AI for EdTech & Digital Learning Platforms",
    metaDescription:
      "AI integration for e-learning platforms. Personalised quiz generation, voice and recitation analysis, and automated moderation for course communities.",
    problem: {
      heading: "A recorded course cannot tell who is lost",
      body: "Online learning has moved from a library of videos to something closer to a community, and expectations moved with it. A learner who stalls in week two gets the same playlist as one who is ahead, and nobody finds out until they stop logging in.",
      points: [
        "Engagement falling away quietly, visible only once it has gone.",
        "Feedback that scales by hiring tutors and no other way.",
        "Course discussion needing moderation around the clock.",
      ],
    },
    solution: {
      heading: "Feedback per learner, not per cohort",
      body: "Questions are generated against what each learner has covered and actually got wrong, so practice lands where it is needed. Spoken work is marked on the way in, and the community feed is read as it is posted.",
      points: [
        "Quiz and exercise generation keyed to a learner's own progress.",
        "Voice and recitation analysis for spoken and language work.",
        "Automated moderation on course feeds, escalating the borderline calls.",
        "Progress signals early enough for a tutor to do something about them.",
      ],
    },
    outcomes: [
      "Learners get an answer at the point they are stuck.",
      "Tutors spend their hours on the people who need them.",
      "Community discussion stays usable without a night shift.",
    ],
  },

  "/industries/marketing-and-adtech": {
    slug: "marketing-and-adtech",
    title: "AI for digital marketing & AdTech",
    eyebrow: "Industries",
    lede: "Creative and campaign work at the volume clients now expect, without the headcount that used to imply.",
    metaTitle: "AI for Digital Marketing & AdTech",
    metaDescription:
      "AI automation for marketing agencies. Generative creative pipelines, programmatic SEO content generation and intelligent ad-bidding integrations.",
    problem: {
      heading: "The volume went up and the budget did not",
      body: "A boutique agency is asked for more assets, more locales and more landing pages every quarter, then asked to show what each one returned. Most of that is production work, and production is where the margin goes.",
      points: [
        "Creative and UI assets wanted faster than a designer can cut them.",
        "Store listings and campaign copy relocalised by hand for every market.",
        "Bid and budget decisions made against last week's export.",
      ],
    },
    solution: {
      heading: "A pipeline, not a prompt",
      body: "Generation is wired into your brand rules and your existing asset library, so what comes out is on-brand and correctly sized rather than merely plausible. Everything still routes past a person before it goes live.",
      points: [
        "Generative pipelines for branding, UI and campaign assets.",
        "Programmatic SEO pages built from your own product and location data.",
        "Localisation across stores and markets without a rewrite each time.",
        "Ad bidding wired to live performance rather than a weekly report.",
      ],
    },
    outcomes: [
      "Asset production stops capping how many clients you can take on.",
      "Campaigns reach more markets without more staff.",
      "What a campaign returned is visible without assembling it by hand.",
    ],
  },
};
