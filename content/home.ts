/**
 * Copy for the home page sections added on 18 September 2026, when the page
 * was rebuilt on appkodes.com's own section order (docs/appkodes-home-content.md).
 *
 * Appkodes is the app development business. Nothing here mentions AI: that
 * is Hitasoft.com's pitch, by the client's decision the same day.
 */

/* --- Partnership models ------------------------------------------------ */
/*
 * appkodes.com's three engagement models, listed as verified in
 * docs/positioning.md. Rewritten to the voice rules; the substance is theirs.
 */
export const partnershipCopy = {
  eyebrow: "How we work together",
  title: "Three ways to work with us.",
  titleMuted: "Pick the one that fits.",
  lede: "Every project starts with the same free costed plan. What changes is how you want to pay and where you want the team to sit.",
};

export const partnershipModels = [
  {
    name: "Fixed Price",
    description:
      "You know the full price before we start. We agree the scope together in writing, and the price only moves if you change that scope.",
    bestFor: "A clear first release",
  },
  {
    name: "Hire Our Developer",
    description:
      "Add our developers to your own team, by the month. They work your hours and report straight to you.",
    bestFor: "A product that keeps growing",
  },
  {
    name: "Onsite Development",
    description:
      "Our team comes to work from your own office. Face to face, we learn how your business actually runs in days rather than in months.",
    bestFor: "Work tied to your premises",
  },
];

/* --- Solutions preview ------------------------------------------------ */
/*
 * The kinds of apps Appkodes has built many times. Rewritten 19 September
 * 2026 when docs/positioning.md was corrected at root: there are NO ready-made
 * solutions or reusable bases, and every app is designed and built new for
 * its client. What carries over between projects is experience, and that,
 * with a written scope and one in-house team, is why the price and the date
 * can be fixed.
 *
 * Nothing here is for sale as it stands: no prices, no "buy", no demos. Each
 * app type is described by what it does; brand references stay in the menu.
 * The qualifier is the brief's own (section 6): first releases, about 30 days.
 */
export const solutionsCopy = {
  eyebrow: "Solutions",
  title: "We have built this before.",
  titleMuted: "Many times, for businesses like yours.",
  lede: "Every app we deliver is designed and built new for its client. What carries over is experience: we already know the screens, the edge cases and the store rules for these kinds of apps, so none of it is learned on your time or your budget. That is why the price and the date can be fixed.",
  qualifier: "Most first releases go live in about 30 days. Larger apps take longer, and your costed plan fixes the scope and the exact date.",
  cta: "Get a free costed plan",
  other: "Building something else? Tell us about it.",
  otherLink: { name: "Talk to us", href: "/contact" },
};

export const solutionsPreview = [
  { name: "Classifieds marketplace", line: "Buyers and sellers, listings and chat", icon: "arrowLeftRight" },
  { name: "Short video app", line: "Record, share and discover", icon: "video" },
  { name: "Live streaming", line: "Live video with gifting", icon: "radio" },
  { name: "Taxi booking", line: "Rider, driver and admin apps", icon: "car" },
  { name: "Delivery super app", line: "Food, grocery and parcels", icon: "truck" },
  { name: "Doctor appointments", line: "Booking and online consults", icon: "stethoscope" },
  { name: "Multi-vendor ecommerce", line: "Many sellers in one store", icon: "shoppingCart" },
  { name: "OTT streaming", line: "Movies and series on demand", icon: "tv" },
  { name: "Dating app", line: "Profiles, matching and chat", icon: "heart" },
];

/* --- Industries ------------------------------------------------------- */
/*
 * appkodes.com's twelve industry cards, minus its AI card, plus taxi booking
 * and classifieds from its services and products menus. No links yet: these
 * have no pages on this site, and a card that goes nowhere is worse than a
 * card that is not a link.
 */
export const industriesCopy = {
  eyebrow: "Industries",
  title: "We have built for your industry.",
  titleMuted: "Probably more than once.",
  lede: "We have shipped apps across all of these. We know the features their users expect, so none of your budget goes on learning them.",
};

export const industries = [
  { name: "SaaS products", line: "Subscription billing and the dashboards your customers log in to." },
  { name: "Social media", line: "Feeds and chat built to carry millions of active users." },
  { name: "Short video", line: "Recording and sharing, with feeds tuned to each viewer." },
  { name: "Live streaming", line: "Live video that adjusts its quality to each viewer's connection." },
  { name: "E-commerce", line: "Stores that sell through live video and short clips." },
  { name: "Classifieds", line: "Buy and sell listings with chat between buyer and seller." },
  { name: "Food delivery", line: "Restaurants and riders connected to hungry customers in one app." },
  { name: "Delivery and logistics", line: "Live tracking and better routes for every order you ship." },
  { name: "Taxi booking", line: "Ride booking with live driver tracking and fares shown upfront." },
  { name: "Real estate", line: "Listings and site visits booked straight from the phone." },
  { name: "Healthcare", line: "Appointment booking that patients can manage from their own phones." },
  { name: "Startups and MVPs", line: "The core feature built first, sized to your budget." },
];

/* --- Latest posts ----------------------------------------------------- */
/*
 * appkodes.com's three latest posts, linked where they live today.
 *
 * !! NOT THE CMS FEED, ON PURPOSE !!
 *
 * lib/posts.ts reads the Strapi CMS, which holds Hitasoft's AI writing. Fed
 * from there, this section would put AI articles on the Appkodes home page.
 * Swap to the CMS once the Appkodes posts are migrated into it.
 */
export const latestPostsCopy = {
  eyebrow: "Latest writing",
  title: "Notes from the build.",
  allHref: "https://appkodes.com/blog/",
  allLabel: "All posts",
};

export const latestPosts = [
  {
    title: "How to Scale a Classified Website to 100K Listings Without Rebuilding Everything",
    href: "https://appkodes.com/blog/how-to-scale-a-classified-website/",
  },
  {
    title: "How to Choose the Right Classified Website Development Company: 10 Things to Check Before You Hire",
    href: "https://appkodes.com/blog/how-to-choose-classified-website-development-company/",
  },
  {
    title: "How to Build a Dealer Management System (DMS) for Your Business within 30 Days",
    href: "https://appkodes.com/blog/how-to-build-a-dealer-management-system/",
  },
];

/* --- Team ------------------------------------------------------------- */
/*
 * appkodes.com's "Architects of Innovation: Our Mastermind Dev-Squad",
 * rewritten to the voice rules. 150+ is the team figure already published in
 * heroStats.
 */
export const teamCopy = {
  eyebrow: "The team",
  title: "One team, from plan to launch.",
  lede: "Meet the developers and testers behind every app we ship. Nobody hands your project to an outside agency or a freelancer halfway through the build.",
  /*
   * The specifics the section lacked (18 September 2026). 150+ and 18 years
   * are published in heroStats, one office in Madurai is verified in
   * docs/positioning.md, and "none outsourced" restates the lede's promise.
   */
  facts: [
    { value: "150+", label: "people in house" },
    { value: "18", label: "years shipping apps" },
    { value: "1", label: "office, in Madurai" },
    { value: "0", label: "work outsourced" },
  ],
  cta: "Talk to the team",
  image: { src: "/team.webp", width: 1024, height: 586, alt: "The Appkodes team together outdoors" },
};
