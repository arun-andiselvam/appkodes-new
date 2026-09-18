import type { Integration } from "./types";

/**
 * Two rows, two different jobs.
 *
 * The template shipped one list of twelve SaaS logos and rendered it twice,
 * the second time reversed, under the claim of 200+ pre-built integrations.
 * That is a product claim from a company that sells connectors. Appkodes
 * sells the build, so the rows now say what we build with.
 *
 * The top row is the models. The bottom row is everything around them, which
 * is the half that decides whether an automation survives contact with a real
 * business. Naming both answers the lock in fear in docs/positioning.md
 * without arguing about it. A visitor who can read the second row can hire
 * somebody else to maintain the first.
 *
 * Model families, never version numbers. "Claude Opus 5" and "GPT-5" date the
 * page the week they are superseded, and a stale version number on a services
 * site reads worse than no number at all. Families move slowly.
 *
 * The category slot carries the job rather than a taxonomy. "Documents nobody
 * wants to read" tells a founder more than "LLM" does, and the buyer here has
 * no IT department to translate for them.
 *
 * !! CONFIRM BEFORE LAUNCH !!
 *
 * This is a claim about what Appkodes works with, so the lists have to match
 * what has actually been delivered. Cut anything that has not been. A shorter
 * honest row beats a long one that invites a question nobody can answer.
 */

/** Top marquee. Models, named by family. */
/*
 * Rewritten 18 September 2026 for Appkodes as an app development business.
 * No AI models or AI tooling: that is Hitasoft.com's pitch. The three rows
 * follow appkodes.com's "Full Stack, iOS, Android" section.
 *
 * !! CONFIRM EACH ENTRY AGAINST WORK ACTUALLY DELIVERED !!
 * Same rule as before: a logo here reads as "we have shipped with this".
 */
export const platforms: Integration[] = [
  { name: "Swift", category: "Native iPhone and iPad apps", icon: "siSwift" },
  { name: "Kotlin", category: "Native Android apps", icon: "siKotlin" },
  { name: "Flutter", category: "One codebase, both stores", icon: "siFlutter" },
  { name: "React Native", category: "Cross platform in JavaScript", icon: "siReact" },
  { name: "Next.js", category: "Web apps and dashboards", icon: "siNextdotjs" },
  { name: "PWA", category: "Installs from the browser", icon: "siPwa" },
  { name: "App Store", category: "Submission handled for you", icon: "siAppstore" },
  { name: "Google Play", category: "Listing and release handled", icon: "siGoogleplay" },
];

export const techStack: Integration[] = [
  { name: "Node.js", category: "APIs and real time", icon: "siNodedotjs" },
  { name: "Laravel", category: "Admin panels and back office", icon: "siLaravel" },
  { name: "TypeScript", category: "Web and APIs", icon: "siTypescript" },
  { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
  { name: "MySQL", category: "The database you may already run", icon: "siMysql" },
  { name: "MongoDB", category: "Flexible app data", icon: "siMongodb" },
  { name: "Firebase", category: "Sign in and push alerts", icon: "siFirebase" },
  { name: "Redis", category: "Queues and caching", icon: "siRedis" },
  { name: "Socket.IO", category: "Live chat and tracking", icon: "siSocketdotio" },
  { name: "WebRTC", category: "Video calls and live streams", icon: "siWebrtc" },
  { name: "Stripe", category: "Taking payments", icon: "siStripe" },
  { name: "Razorpay", category: "Payments in India", icon: "siRazorpay" },
  { name: "Google Cloud", category: "Hosting and storage", icon: "siGooglecloud" },
  { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
];

export const buildTools: Integration[] = [
  { name: "Figma", category: "Screens you approve first", icon: "siFigma" },
  { name: "GitHub", category: "Every line of code, yours", icon: "siGithub" },
  { name: "GitHub Actions", category: "Checks on every change", icon: "siGithubactions" },
  { name: "Jira", category: "Progress you can see", icon: "siJira" },
  { name: "Postman", category: "APIs tested before release", icon: "siPostman" },
  { name: "Sentry", category: "Crashes found before you call", icon: "siSentry" },
  { name: "Google Analytics", category: "What users actually do", icon: "siGoogleanalytics" },
];
