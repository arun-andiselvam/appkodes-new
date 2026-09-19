/**
 * Appkodes service pages: the content model and every page's copy.
 *
 * Started 19 September 2026 from the positioning brief (docs/positioning.md,
 * sections 4.1, 11 and 12) and appkodes.com's own service pages, which were
 * scraped for their substance and rewritten. The rules that shape every entry:
 *
 *   - Lead with the outcome for the buyer, not the technology.
 *   - The fixed price and fixed date process, with the 30-day qualifier.
 *   - Every app is designed and built new for its client. There are NO
 *     ready-made solutions or reusable bases (corrected at root in
 *     docs/positioning.md, 19 September 2026). Speed comes from experience
 *     with each app type, a written scope and one in-house team.
 *   - No prices, no "buy", no "script" or "clone".
 *   - Brand references ("like Uber Eats") only in FAQs, never in the H1,
 *     titles or slugs.
 *   - Slugs are appkodes.com's existing URLs, so the pages keep their search
 *     rankings without redirects (brief section 12).
 *   - No AI as an offer: that is Hitasoft's.
 *
 * One page is written so far, Food Delivery, as the reference. The template
 * (components/sections/app-service-page.tsx) renders any entry added below.
 */

export type AppServiceFact = { label: string; value: string };
export type AppServiceApp = {
  name: string;
  tagline: string;
  icon: string;
  /** Drawn mock-up beside the app: a phone or a desktop dashboard. */
  device: "phone" | "desktop";
  description: string;
  features: { title: string; text: string }[];
};
export type AppServiceStep = { title: string; text: string; who: string };
export type AppServiceGroup = { label: string; items: { name: string; icon?: string }[] };
export type AppServiceRelease = { label: string; when: string; points: string[] };
export type AppServiceItem = { title: string; text: string; icon?: string };
export type AppServiceFaq = { question: string; answer: string };
export type AppServiceQuote = { quote: string; name: string; role: string };
export type AppServiceLink = { name: string; href: string };

export type AppService = {
  slug: string;
  /** The Services menu group it sits in, used in the breadcrumb and eyebrow. */
  group: string;
  /** The page's name, also the H1 and the meta title. */
  name: string;
  metaDescription: string;
  hero: {
    lede: string;
    facts: AppServiceFact[];
  };
  /**
   * The hero's radar: the hub label, and the services on the outer ring. The
   * inner ring is the apps and portals, taken from `apps.items`.
   */
  ecosystem: { hub: string; items: { name: string; icon: string }[] };
  /** A recent launch, told plainly. Optional: not every service has one. */
  story?: { label: string; client: string; place: string; text: string };
  /** Why own the app rather than list on a marketplace, with a comparison. */
  whyOwn: {
    title: string;
    lede: string;
    points: AppServiceItem[];
    comparison: { columns: [string, string]; rows: { label: string; values: [string, string] }[] };
  };
  apps: { title: string; lede: string; items: AppServiceApp[] };
  flow: { title: string; lede: string; steps: AppServiceStep[] };
  models: { title: string; lede: string; items: AppServiceItem[] };
  tech: { title: string; lede: string; groups: AppServiceGroup[] };
  releases: { title: string; lede: string; items: AppServiceRelease[] };
  pricing: { title: string; lede: string; factors: AppServiceItem[] };
  support: { title: string; lede: string; items: AppServiceItem[] };
  features: { title: string; lede: string; items: AppServiceItem[] };
  /** Each audience lists what we would shape for that kind of business. */
  audiences: { title: string; lede: string; items: (AppServiceItem & { builds: string[] })[] };
  /** Why the fixed date holds: experience with the app type, never reuse. */
  experience: { title: string; text: string };
  quotes: AppServiceQuote[];
  faqs: AppServiceFaq[];
  related: AppServiceLink[];
};

/**
 * The fixed price and fixed date process, the same on every service page
 * (brief section 11: "the fixed-price, fixed-date process in 3-4 steps").
 */
export const serviceProcess = {
  eyebrow: "How it works",
  title: "A price and a date you can plan around.",
  steps: [
    {
      title: "Free costed plan",
      text: "Tell us the idea. You get the scope, a fixed price and a launch date in writing, free, whether you go ahead or not.",
      when: "Before we start",
    },
    {
      title: "Design and prototype",
      text: "Your screens in your brand. You click through a working prototype before any code is written.",
      when: "Week 1",
    },
    {
      title: "Build and test",
      text: "Our team builds your app and tests every screen. A new build reaches your phone each week.",
      when: "Weeks 2 to 4",
    },
    {
      title: "Launch and support",
      text: "We publish to the App Store and Google Play, then keep the apps fixed, current and running.",
      when: "From about day 30",
    },
  ],
  qualifier:
    "Most first releases go live in about 30 days. Larger apps take longer, and your costed plan fixes the scope and the exact date.",
};

const APPKODES = "https://appkodes.com";

export const appServices: AppService[] = [
  {
    slug: "food-delivery-app-development-company",
    group: "Delivery",
    name: "Food Delivery App Development",
    metaDescription:
      "Your own food delivery app for customers, restaurants and riders, on a fixed price and a fixed date. Most first releases go live in about 30 days.",
    hero: {
      lede: "Your own ordering app for customers, restaurants and riders, designed and built new for your business, with the price and the launch date agreed before we start. We have built food delivery apps many times, so most first releases go live in about 30 days.",
      facts: [
        { label: "Price", value: "Fixed before we start" },
        { label: "Launch date", value: "Agreed in writing" },
        { label: "First release", value: "About 30 days" },
        { label: "You get", value: "Six apps and portals, built new for you" },
      ],
    },
    story: {
      label: "Just went live",
      client: "Weeze",
      place: "Brazil",
      text: "A food delivery business in Brazil came to us with an idea and a date. Weeze is now live on iOS and Android, taking orders from local restaurants.",
    },
    ecosystem: {
      hub: "Your platform",
      items: [
        { name: "Payments", icon: "card" },
        { name: "Live maps", icon: "mapPin" },
        { name: "Push alerts", icon: "bell" },
        { name: "In-app chat", icon: "chat" },
        { name: "Payouts", icon: "wallet" },
        { name: "Promotions", icon: "tag" },
        { name: "Ratings", icon: "star" },
        { name: "Reports", icon: "chart" },
      ],
    },
    whyOwn: {
      title: "Your own app, not a listing on someone else's.",
      lede: "Marketplace apps bring customers, but they keep the relationship and take a cut of every order. Your own app changes who holds both.",
      points: [
        { title: "Keep the margin", text: "No marketplace commission on every order. You set the fees, and they are yours.", icon: "gift" },
        { title: "Own the customer", text: "Names, orders and preferences stay with you, so you can bring people back.", icon: "heart" },
        { title: "Your brand on the screen", text: "Customers open your app, see your menu and remember your name.", icon: "store" },
        { title: "Your rules", text: "Delivery zones, fees, hours and promotions work the way you decide.", icon: "dashboard" },
      ],
      comparison: {
        columns: ["Listing on a marketplace", "Your own app"],
        rows: [
          { label: "Commission", values: ["Taken on every order", "None. You set your own fees"] },
          { label: "Customer data", values: ["Held by the marketplace", "Yours, in your own system"] },
          { label: "Brand", values: ["Their app, their name", "Your app, your name"] },
          { label: "Promotions", values: ["Paid placement against rivals", "Your own offers and loyalty"] },
          { label: "Delivery rules", values: ["Set by the marketplace", "Set by you"] },
        ],
      },
    },
    apps: {
      title: "Six apps and portals, built new for your business.",
      lede: "Everyone in the order gets an app or portal designed for their part of it, all connected to one system you own and control. Pick one to see what it does.",
      items: [
        {
          name: "Customer app",
          tagline: "Order, pay and track",
          icon: "smartphone",
          device: "phone",
          description: "The app your customers keep on their home screen. It has one job: make ordering quick and make the wait feel short.",
          features: [
            { title: "Home and discovery", text: "Nearby restaurants, cuisines, offers and reorders on the first screen." },
            { title: "Menus with add-ons", text: "Sizes, extras, notes and dietary tags, priced as they choose." },
            { title: "Simple checkout", text: "Card, wallet or cash on delivery, with saved addresses and tips." },
            { title: "Live tracking", text: "The rider on the map, with an arrival time that updates itself." },
            { title: "Reorder and favourites", text: "Last week's order is one tap away." },
            { title: "Ratings and help", text: "Rate the food and the rider, or chat to support in the app." },
          ],
        },
        {
          name: "Restaurant app",
          tagline: "Accept and prepare",
          icon: "chefHat",
          device: "phone",
          description: "Built for a busy kitchen: loud alerts, big buttons and nothing to learn on a Friday night.",
          features: [
            { title: "Order alerts", text: "A new order rings until someone answers it." },
            { title: "Accept and set prep time", text: "Confirm, decline or set how long the kitchen needs." },
            { title: "Menu and stock", text: "Switch dishes off when they run out, change prices any time." },
            { title: "Hours and busy mode", text: "Pause orders when the kitchen is full." },
            { title: "Sales and payouts", text: "Today's orders, earnings and what is due to them." },
            { title: "Their own offers", text: "Discounts and featured dishes, inside your rules." },
          ],
        },
        {
          name: "Restaurant portal",
          tagline: "Manage from the office",
          icon: "monitor",
          device: "desktop",
          description: "The web side of the restaurant app, for the owner or manager at a desk: the menu, the numbers and the money, on a big screen.",
          features: [
            { title: "Menu builder", text: "Categories, dishes, photos, add-ons and prices, edited in bulk." },
            { title: "Branches", text: "Each location with its own menu, hours and delivery area." },
            { title: "Sales reports", text: "Orders, best sellers and busy hours, by day, week or month." },
            { title: "Payouts and invoices", text: "What was earned, what was paid and when, ready to download." },
            { title: "Offers", text: "Discounts, combos and featured dishes, scheduled ahead." },
            { title: "Staff logins", text: "Separate access for managers and kitchen staff." },
          ],
        },
        {
          name: "Rider app",
          tagline: "Pick up and deliver",
          icon: "bike",
          device: "phone",
          description: "Everything a rider needs to take a job and finish it, one handed and on the move.",
          features: [
            { title: "Job alerts", text: "Nearby pickups with distance and earnings shown up front." },
            { title: "Accept or pass", text: "Riders choose jobs, or you assign them automatically." },
            { title: "Navigation", text: "Directions to the restaurant, then to the customer." },
            { title: "Proof of delivery", text: "Photo, signature or code at the door." },
            { title: "Earnings", text: "Per job, per day and per week, with tips." },
            { title: "Online and offline", text: "Riders set when they are working." },
          ],
        },
        {
          name: "Fleet portal",
          tagline: "Riders and dispatch",
          icon: "fleet",
          device: "desktop",
          description: "For whoever runs the riders: see every rider and every delivery live, and keep the fleet moving at the busiest hour.",
          features: [
            { title: "Live fleet map", text: "Every rider on one map, with status: free, picking up or delivering." },
            { title: "Dispatch", text: "Automatic assignment, with manual reassignment when needed." },
            { title: "Rider onboarding", text: "Documents, vehicle details and approval before a first job." },
            { title: "Shifts and zones", text: "Who works when and where, so busy areas stay covered." },
            { title: "Performance", text: "Delivery times, acceptance rates and ratings per rider." },
            { title: "Rider pay", text: "Per-job rates, peak bonuses, tips and weekly settlements." },
          ],
        },
        {
          name: "Admin dashboard",
          tagline: "Run the business",
          icon: "dashboard",
          device: "desktop",
          description: "One web dashboard for the whole operation, from onboarding a restaurant to paying a rider.",
          features: [
            { title: "Live orders", text: "Every order and its status, with alerts when one stalls." },
            { title: "Restaurants", text: "Onboarding, menus, commission rates and approvals." },
            { title: "Riders and zones", text: "Delivery areas, rider availability and assignment rules." },
            { title: "Fees and payouts", text: "Commissions, delivery fees and settlements to everyone." },
            { title: "Promotions", text: "Banners, coupons and featured restaurants." },
            { title: "Reports", text: "Sales, orders, ratings and growth by day, week and zone." },
          ],
        },
      ],
    },
    flow: {
      title: "How an order moves.",
      lede: "Seven steps from a hungry customer to a rating, and every one is visible to the people who need it.",
      steps: [
        { title: "Placed", text: "The customer orders and pays.", who: "Customer" },
        { title: "Accepted", text: "The restaurant confirms and sets a prep time.", who: "Restaurant" },
        { title: "Assigned", text: "The nearest available rider gets the job.", who: "System" },
        { title: "Prepared", text: "The kitchen marks the order ready.", who: "Restaurant" },
        { title: "Picked up", text: "The rider collects it and heads out.", who: "Rider" },
        { title: "Delivered", text: "Proof of delivery closes the order.", who: "Rider" },
        { title: "Rated", text: "The customer rates the food and the delivery.", who: "Customer" },
      ],
    },
    models: {
      title: "Earn the way your business works.",
      lede: "Use one of these or combine them. The admin dashboard handles the numbers.",
      items: [
        { title: "Commission per order", text: "A percentage from restaurants on each order they receive.", icon: "building" },
        { title: "Delivery fees", text: "Flat, distance-based or peak-time fees paid by the customer.", icon: "truck" },
        { title: "Subscriptions", text: "Members pay monthly for free delivery or lower prices.", icon: "repeat" },
        { title: "Featured listings", text: "Restaurants pay to appear first in search and on the home screen.", icon: "megaphone" },
        { title: "Service fees", text: "A small fee per order, shown clearly at checkout.", icon: "basket" },
        { title: "Your own fleet, theirs, or both", text: "Deliver with your riders, the restaurant's, or a mix.", icon: "bike" },
      ],
    },
    features: {
      title: "The features people expect from a food app.",
      lede: "Your costed plan lists which of these go into your first release, and which follow after it.",
      items: [
        { title: "Detailed menus", text: "Prices, portions, discounts and distance, shown before anyone orders.", icon: "utensils" },
        { title: "Fast search", text: "Categories and filters, so a customer finds a dish in seconds.", icon: "search" },
        { title: "Live tracking", text: "Status and arrival time from the kitchen to the door.", icon: "mapPin" },
        { title: "Smart cart", text: "Notes, changes and a clear total before checkout.", icon: "basket" },
        { title: "Subscriptions", text: "Monthly plans with free delivery or member prices.", icon: "repeat" },
        { title: "Ratings and reviews", text: "Customers rate the food and the delivery.", icon: "star" },
        { title: "Promotions", text: "Banners, featured dishes and limited-time offers.", icon: "megaphone" },
        { title: "Loyalty and coupons", text: "Points and codes that bring customers back.", icon: "gift" },
        { title: "Saved favourites", text: "Past orders and favourite places one tap away.", icon: "heart" },
        { title: "In-app chat", text: "Customers reach support or the rider without leaving the app.", icon: "chat" },
      ],
    },
    audiences: {
      title: "Built for your kind of food business.",
      lede: "No two food businesses run the same way, so no two of our apps do either. Tell us how you work today, and the app is designed around it: your menu, your delivery rules, your way of getting paid.",
      items: [
        {
          title: "Restaurants and chains", icon: "store",
          text: "Your own ordering app, with no marketplace commission on every order.",
          builds: ["One app for every branch, with menus and prices per location", "Loyalty points and offers that bring regulars back", "Pickup, dine-in or delivery, as you choose"],
        },
        {
          title: "Delivery marketplaces", icon: "building",
          text: "Many restaurants and riders in one app, with your fee on each order.",
          builds: ["Restaurant sign-up and approval, with your commission rates", "Rider onboarding, zones and automatic job assignment", "Weekly payouts to every restaurant and rider"],
        },
        {
          title: "Cloud kitchens", icon: "soup",
          text: "Several brands from one kitchen, each with its own menu.",
          builds: ["Separate brands and menus, one kitchen screen", "Orders from every brand in one queue, with prep timers", "Stock shared across brands, so nothing oversells"],
        },
        {
          title: "Food trucks", icon: "truck",
          text: "Customers see where you are today and order ahead.",
          builds: ["Today's location and hours on a live map", "Order ahead with a pickup time, no queue", "Alerts to followers when you park nearby"],
        },
        {
          title: "Corporate lunch", icon: "briefcase",
          text: "Bulk and scheduled orders, invoiced to the company.",
          builds: ["Company accounts with staff allowances", "Scheduled daily or weekly group orders", "Monthly invoices instead of card payments"],
        },
        {
          title: "Meal kits", icon: "package",
          text: "Subscriptions, weekly boxes and delivery slots.",
          builds: ["Weekly plans customers can pause or skip", "Menu picks by a cut-off day, then delivery slots", "Recurring billing and box-size choices"],
        },
        {
          title: "Catering and home delivery", icon: "calendar",
          text: "Large orders with dates, deposits and routes.",
          builds: ["Orders booked for a date, with a deposit up front", "Quotes for custom menus and guest counts", "Delivery routes planned for large drops"],
        },
        {
          title: "Farm to table", icon: "leaf",
          text: "Fresh produce from local growers, delivered the same day.",
          builds: ["Produce priced by weight, with what is in season", "Grower profiles and pickup from several farms", "Same-day delivery windows"],
        },
        {
          title: "Specialty and gourmet", icon: "crown",
          text: "Premium menus with the detail that sells them.",
          builds: ["Rich dish pages with photos, origin and pairings", "Gift orders with messages and scheduled delivery", "Members-only menus and early access"],
        },
      ],
    },
    experience: {
      title: "We have built food delivery apps many times.",
      text: "Your app is designed and built new for your business. What we bring is experience: we already know how ordering, payments, live tracking and payouts should work, and where these apps go wrong. None of it is learned on your time, so the scope, the price and the date can be fixed.",
    },
    tech: {
      title: "Payments, maps and the tech behind it.",
      lede: "Set up for the markets you launch in. Your costed plan lists exactly which of these your first release uses.",
      groups: [
        { label: "Payments", items: [{ name: "Stripe", icon: "siStripe" }, { name: "Razorpay", icon: "siRazorpay" }, { name: "PayPal" }, { name: "Cash on delivery" }] },
        { label: "Maps and location", items: [{ name: "Google Maps" }, { name: "Live GPS tracking" }, { name: "Delivery zones" }] },
        { label: "Messages", items: [{ name: "Push notifications", icon: "siFirebase" }, { name: "SMS" }, { name: "Email" }, { name: "In-app chat" }] },
        { label: "Built with", items: [{ name: "Flutter", icon: "siFlutter" }, { name: "Swift", icon: "siSwift" }, { name: "Kotlin", icon: "siKotlin" }, { name: "Node.js", icon: "siNodedotjs" }, { name: "Laravel", icon: "siLaravel" }, { name: "MySQL", icon: "siMysql" }] },
      ],
    },
    releases: {
      title: "What goes live first, and what follows.",
      lede: "Your costed plan splits the build into releases, each with its own fixed price and date. The first one is what your customers need on day one.",
      items: [
        { label: "First release", when: "About 30 days", points: ["Ordering and payments", "The apps your launch needs", "Live order tracking", "Admin basics: orders, restaurants, payouts"] },
        { label: "Second release", when: "After launch", points: ["Subscriptions and loyalty", "Promotions and featured listings", "Ratings and review moderation", "Richer reports"] },
        { label: "As you grow", when: "When you need it", points: ["More cities and zones", "More languages and currencies", "Point of sale or accounting links", "Performance tuning for volume"] },
      ],
    },
    pricing: {
      title: "What sets the price.",
      lede: "There is no price list, because no two businesses need the same app. Your fixed price comes from the scope in your costed plan, and these are the things that move it.",
      factors: [
        { title: "How many apps", text: "Customer, restaurant, rider and admin, or fewer to start.", icon: "smartphone" },
        { title: "First-release features", text: "What must be there on day one, and what can follow.", icon: "package" },
        { title: "Payments and integrations", text: "Each gateway, map service or outside system you connect.", icon: "repeat" },
        { title: "Languages and currencies", text: "One market, or several from launch.", icon: "chat" },
        { title: "Design depth", text: "A clean standard design, or a fully custom look.", icon: "star" },
        { title: "Launch markets", text: "Store listings, local payment rules and tax setup.", icon: "mapPin" },
      ],
    },
    support: {
      title: "After launch, we stay.",
      lede: "Launch day is not the finish line. Phones update, stores change their rules and your business grows.",
      items: [
        { title: "Store updates", text: "New iOS and Android versions handled before they break anything.", icon: "smartphone" },
        { title: "Fixes", text: "Bugs found and fixed, with a clear turnaround.", icon: "megaphone" },
        { title: "Monitoring", text: "We watch the servers and the orders, so problems reach us first.", icon: "dashboard" },
        { title: "New features", text: "Priced and dated the same way as the first release.", icon: "package" },
        { title: "Security", text: "Payments through certified gateways, encrypted data and regular reviews.", icon: "crown" },
        { title: "Handover", text: "Training and documentation, so your team can run it.", icon: "briefcase" },
      ],
    },
    quotes: [
      {
        quote: "Very professional. Our project was quite complex and they covered all the aspects. Appkodes did an amazing and professional job developing and creating our Apple and Android apps. I was positively impressed with the communication you can absolutely trust on what they say.",
        name: "Anu Joseph",
        role: "CEO & Founder",
      },
      {
        quote: "You have been supporting me very quickly in every matter, especially in the last 2 months, and this makes me very happy. These are the first apps that I have ever been involved with and having never done anything like this before I needed a lot of help and guidance every step of the way.",
        name: "Deniz Seçer",
        role: "Founder",
      },
    ],
    faqs: [
      {
        question: "How much does a food delivery app cost?",
        answer: "It depends on the scope: which apps, features, languages, payment gateways and integrations you need. You get a fixed price in a free costed plan before any work starts, and it does not move unless you change the scope.",
      },
      {
        question: "How long does it take to build?",
        answer: "Most first releases go live in about 30 days. A full system with every app and custom features takes longer, and your costed plan fixes the scope and the exact date.",
      },
      {
        question: "Which apps do I get?",
        answer: "A customer app, a restaurant app and a rider app for iOS and Android, plus three web portals: one for restaurants, one for your delivery fleet and an admin dashboard to run the business.",
      },
      {
        question: "Can it work like Uber Eats or DoorDash?",
        answer: "Yes. We build the same core flow: customers order from many restaurants, riders deliver, and you earn a commission or fee on each order. It is your own app, built new, with your brand and your business rules.",
      },
      {
        question: "Do you publish the apps to the App Store and Google Play?",
        answer: "Yes. We handle the submission, the store listings and the review for both stores.",
      },
      {
        question: "Can it support several languages and currencies?",
        answer: "Yes. Languages, currencies and local payment gateways are set up for the markets you launch in.",
      },
      {
        question: "Can I add subscriptions or a loyalty programme?",
        answer: "Yes. Membership plans, loyalty points and coupons can be in the first release or added later.",
      },
      {
        question: "What happens after launch?",
        answer: "We keep the apps running: bug fixes, store updates and new features when you need them, with a short monthly report.",
      },
      {
        question: "Will it handle growth?",
        answer: "Yes. It is built for thousands of restaurants, riders and orders, and we tune it as your volume grows.",
      },
    ],
    related: [
      { name: "Grocery Delivery App Development", href: `${APPKODES}/grocery-delivery-app-development-company/` },
      { name: "Pharmacy Delivery App Development", href: `${APPKODES}/pharmacy-delivery-app-development-company/` },
      { name: "Hyperlocal App Development", href: `${APPKODES}/hyperlocal-app-development/` },
      { name: "Taxi Booking App Development", href: `${APPKODES}/taxi-booking-app-development-company/` },
    ],
  },
];

export function appServiceBySlug(slug: string): AppService | undefined {
  return appServices.find((s) => s.slug === slug);
}
