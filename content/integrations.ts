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
export const aiModels: Integration[] = [
  { name: "Claude", category: "Documents nobody wants to read", icon: "siClaude" },
  { name: "GPT", category: "General purpose work" },
  { name: "Gemini", category: "Long files and video", icon: "siGooglegemini" },
  { name: "Llama", category: "Runs on your own server", icon: "siMeta" },
  { name: "Mistral", category: "Small and cheap to run", icon: "siMistralai" },
  { name: "Qwen", category: "Open weights", icon: "siQwen" },
  { name: "DeepSeek", category: "Reasoning on a budget", icon: "siDeepseek" },
  { name: "Whisper", category: "Calls and meetings into text" },
  { name: "Embeddings", category: "Search across your own files" },
  { name: "Vision models", category: "Invoices and scanned forms" },
];

/**
 * Middle marquee. The stack the models get wired into.
 *
 * Everything in this row runs in the client's system after we leave. That is
 * the line between this row and the one below it, where nothing does.
 */
export const techStack: Integration[] = [
  { name: "Python", category: "Where the automation lives", icon: "siPython" },
  { name: "TypeScript", category: "Web and APIs", icon: "siTypescript" },
  { name: "Laravel", category: "PHP systems you already run", icon: "siLaravel" },
  { name: "React", category: "Screens your team uses", icon: "siReact" },
  { name: "PostgreSQL", category: "Records and reporting", icon: "siPostgresql" },
  { name: "pgvector", category: "Your documents, made searchable" },
  { name: "Redis", category: "Queues and caching", icon: "siRedis" },
  { name: "n8n", category: "Steps joined into a workflow", icon: "siN8n" },
  { name: "MCP", category: "Models plugged into your tools", icon: "siModelcontextprotocol" },
  { name: "Docker", category: "Same everywhere it runs", icon: "siDocker" },
  { name: "AWS", category: "Hosting and storage" },
  { name: "Flutter", category: "Phone apps", icon: "siFlutter" },
  { name: "Twilio", category: "SMS and voice" },
  { name: "Stripe", category: "Taking payments", icon: "siStripe" },
];

/**
 * Bottom marquee. How the work gets built, which is not the same question.
 *
 * Cursor never runs in a client's business. Postgres does. Mixing the two
 * would blur the one distinction the middle row exists to draw, so the build
 * tooling gets its own row and its own label.
 *
 * The row is half AI tooling and half the checks around it, and that split is
 * the entire point. A list of coding assistants on its own invites the reader
 * to wonder what they are paying for, since the same tools are two clicks
 * away from anybody with a browser. Paired with the tests and the error
 * tracking, the row says something they cannot do at home. We build at that
 * speed and we catch what the machine gets wrong.
 *
 * That framing also carries the 6 weeks in the results section. A buyer who
 * doubts the number can look at this row and see where the time went.
 *
 * Tools aimed at people building instead of buying are left off deliberately.
 * Naming them argues the visitor should go and do this themselves.
 */
export const buildTools: Integration[] = [
  { name: "Claude Code", category: "Agents that write and review", icon: "siClaude" },
  { name: "Cursor", category: "AI inside the editor", icon: "siCursor" },
  { name: "GitHub Copilot", category: "Suggestions as we type", icon: "siGithubcopilot" },
  { name: "v0", category: "Screens from a description", icon: "siV0" },
  { name: "Vercel", category: "Preview links you can click", icon: "siVercel" },
  { name: "Playwright", category: "Screens tested before you see them" },
  { name: "GitHub Actions", category: "Checks on every change", icon: "siGithubactions" },
  { name: "Sentry", category: "Errors found before you call", icon: "siSentry" },
];
