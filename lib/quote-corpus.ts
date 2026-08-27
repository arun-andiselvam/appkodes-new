import "server-only";

import { servicePages } from "@/content/services";
import { serviceLandings } from "@/content/service-landings";
import { industryLandings } from "@/content/industry-landings";
import { securityFeatures, commitments } from "@/content/security";
import { steps } from "@/content/how-it-works";
import { deliveryEstimates, estimateCaveat, estimateRefusal } from "@/content/delivery-estimates";
import { site } from "@/content/site";

/**
 * Everything the assistant is allowed to know, as one string.
 *
 * !! IT IS BUILT FROM THE PAGES, NOT WRITTEN ALONGSIDE THEM !!
 *
 * Every line below is read out of the same objects the site renders. Nobody
 * maintains a separate "chatbot knowledge base", because a separate one drifts
 * the first week somebody edits a service page and forgets it exists - and a
 * bot describing a service the way it was two months ago is worse than no bot.
 *
 * Change a service page and the assistant changes with it, in the same commit.
 *
 * !! server-only IS NOT DECORATION !!
 *
 * This module is large and it is assembled for a system prompt. The import at
 * the top makes the build fail rather than let anything pull it into a client
 * component, where it would be shipped to every browser as dead weight.
 *
 * Built once at module scope, so the string is identical on every request.
 * That is what makes it cacheable: the same bytes in the same order means the
 * prompt cache hits for every visitor after the first, and the corpus costs a
 * tenth of its size to read.
 */

function bullets(items: readonly string[]) {
  return items.map((item) => `  - ${item}`).join("\n");
}

/* ------------------------------------------------------------------ services */

/**
 * One entry per service, at the best detail available.
 *
 * !! THE TWO FILES DESCRIBE THE SAME NINETEEN PAGES !!
 *
 * `servicePages` is the short silo blueprint and `serviceLandings` is the long
 * form written to rank, and both are keyed by the same nineteen paths. Reading
 * them as separate blocks would put every service into the prompt twice, in
 * two voices, which costs tokens to say the same thing and gives the model two
 * slightly different accounts to choose between.
 *
 * So they are merged. The short form supplies what only it has - the solution
 * block and the outcomes - and the long form supplies everything it says
 * better: a definition written to be quoted, named capabilities, the work
 * described in real systems, the rebuild comparison, and the questions buyers
 * actually ask.
 *
 * `servicePages` drives the loop because it is the canonical list. Anything
 * that somehow exists only in the long form is picked up afterwards rather
 * than silently dropped.
 */
function serviceEntry(path: string, page: (typeof servicePages)[string]) {
  const long = serviceLandings[path];
  const lines: string[] = [`### ${page.title}  (${path})`];

  /*
   * The long form's summary is the paragraph written to survive being lifted
   * out of the page, which is exactly the job it has here. The lede is the
   * fallback for a page that has no long form yet.
   */
  lines.push(long ? long.summary.body : page.lede);
  lines.push(``);

  const problem = long?.problem ?? page.problem;
  lines.push(`Problem - ${problem.heading}`, problem.body);
  lines.push(
    bullets(
      /* Long form points are titled; short form points are bare strings. */
      problem.points.map((point) =>
        typeof point === "string" ? point : `${point.title}: ${point.body}`,
      ),
    ),
  );
  lines.push(``);

  lines.push(`What we build - ${page.solution.heading}`, page.solution.body);
  lines.push(bullets(page.solution.points));

  if (long) {
    lines.push(``, `Capabilities:`);
    lines.push(bullets(long.capabilities.items.map((item) => `${item.title}: ${item.body}`)));

    lines.push(``, `In practice:`);
    lines.push(
      bullets(
        long.scenarios.items.map(
          (item) => `${item.system} - ${item.title}: ${item.body}`,
        ),
      ),
    );

    lines.push(``, `${long.comparison.heading} (${long.comparison.columns.join(" vs ")}):`);
    lines.push(
      bullets(
        long.comparison.rows.map(
          (row) => `${row.label} - ${row.values[0]} / ${row.values[1]}`,
        ),
      ),
    );
  }

  lines.push(``, `What changes:`, bullets(page.outcomes));

  /*
   * The FAQs last, and they earn their place more than anything else here:
   * they are already question-and-answer pairs written by a person, which is
   * the exact shape of what this assistant is asked to produce.
   *
   * Checked on 27 August 2026: no answer in this file states a duration, so
   * pulling them in does not compete with the delivery table below.
   */
  if (long?.faqs?.length) {
    lines.push(``, `Questions people ask:`);
    for (const faq of long.faqs) {
      lines.push(`  Q: ${faq.question}`, `  A: ${faq.answer}`);
    }
  }

  return lines.join("\n");
}

const serviceBlock = [
  ...Object.entries(servicePages).map(([path, page]) => serviceEntry(path, page)),
  /* Anything long form that has no short form entry, so nothing is lost. */
  ...Object.entries(serviceLandings)
    .filter(([path]) => !servicePages[path])
    .map(([path, long]) =>
      [
        `### ${long.serviceType}  (${path})`,
        long.summary.body,
        ``,
        `Capabilities:`,
        bullets(long.capabilities.items.map((item) => `${item.title}: ${item.body}`)),
        ``,
        `Questions people ask:`,
        long.faqs.map((faq) => `  Q: ${faq.question}\n  A: ${faq.answer}`).join("\n"),
      ].join("\n"),
    ),
].join("\n\n");

/* ---------------------------------------------------------------- industries */

const industryBlock = Object.values(industryLandings)
  .map((page) =>
    [
      `### ${page.hero.title}  (${page.path})`,
      `Audience: ${page.audience}`,
      page.summary.body,
      ``,
      `Where it hurts - ${page.problem.heading}`,
      bullets(page.problem.points.map((point) => `${point.title}: ${point.body}`)),
      ``,
      `What we build - ${page.useCases.heading}`,
      bullets(
        page.useCases.items.map(
          (item) => `${item.title}: ${item.body} (${item.detail.join("; ")})`,
        ),
      ),
    ].join("\n"),
  )
  .join("\n\n");

/* ------------------------------------------------------------- how we work */

const engagementBlock = steps
  .map((step) =>
    [
      `${step.number}. ${step.title}  [${step.duration}]`,
      step.description,
      step.output
        .split("\n")
        .map((line) => `  - ${line}`)
        .join("\n"),
    ].join("\n"),
  )
  .join("\n\n");

/* ---------------------------------------------------------------- security */

const securityBlock = [
  bullets(securityFeatures.map((item) => `${item.title}: ${item.description}`)),
  ``,
  `In the contract:`,
  bullets(commitments),
].join("\n");

/* --------------------------------------------------------------- estimates */

/*
 * The only durations that may ever leave this system. See the header of
 * content/delivery-estimates.ts for why they are a table rather than
 * something the model works out.
 */
const estimateBlock = [
  bullets(
    Object.entries(deliveryEstimates).map(
      ([key, estimate]) => `${key} - ${estimate.label}: ${estimate.range}`,
    ),
  ),
  ``,
  `Say this with every range, without exception: "${estimateCaveat}"`,
  ``,
  `When the question is one this table cannot answer, say this instead: "${estimateRefusal}"`,
].join("\n");

export const quoteCorpus = [
  `# ${site.name} - what we do`,
  ``,
  `## Services`,
  serviceBlock,
  ``,
  `## Industries`,
  industryBlock,
  ``,
  `## How an engagement runs`,
  engagementBlock,
  ``,
  `## Data handling and security`,
  securityBlock,
  ``,
  `## Delivery ranges - THE ONLY DURATIONS YOU MAY EVER STATE`,
  estimateBlock,
].join("\n");

/**
 * The rules, kept apart from the facts.
 *
 * Everything above is what the assistant knows. Everything here is how it is
 * allowed to behave, and most of it exists because a language model asked
 * about price or duration will produce a confident number every single time.
 *
 * The order matters for caching: this and the corpus are both fixed, so they
 * sit together at the front of every request and the visitor's own words go
 * last, after the cache breakpoint.
 */
export const quoteSystemPrompt = [
  `You answer questions from visitors to the ${site.name} website who are part-way through asking for a quote. You are not a support agent and not a salesperson. You are the person who knows what this company does, answering honestly so somebody can decide whether to send an enquiry.`,
  ``,
  `## What you may say`,
  ``,
  `Everything you know is in the reference below. If an answer is not in it, say plainly that you do not know and that the team will answer it properly - then offer to carry on with the questions. Never fill a gap with something plausible.`,
  ``,
  `## What you may never say`,
  ``,
  `- Never state a price, a rate, a cost, or a discount. Not a range, not a "typically", not an "it depends but". If asked what something costs: say that a real number needs a look at their systems, and that the brief they are part-way through writing is what produces one.`,
  `- Never state a duration, a deadline, or a delivery date except by reading one straight out of the delivery ranges table below. Do not adjust the ranges. Do not average them. Do not narrow them because the project sounds small.`,
  `- Never name a model version number. Model families only.`,
  `- Never invent a statistic, a percentage, a client name, or a case study.`,
  `- Never promise a response time.`,
  ``,
  `## How you answer`,
  ``,
  `Short. Three or four sentences is usually right, and the answer box is narrow. Plain words - the audience is a founder or an operations lead, not an engineer. No bullet lists unless you are genuinely enumerating things. No headings. Never open with a greeting or "Great question".`,
  ``,
  `Match the site's voice: direct, unhurried, and comfortable saying what we do not do. Contractions are fine.`,
  ``,
  `## Always hand back`,
  ``,
  `End every answer by moving them forward - a short question that picks up where they left off, or an offer to carry on with the quote questions. You are a detour on the way to an enquiry, not a destination. Do not ask them to book a call; the form they are already in is the next step.`,
  ``,
  `## Reference`,
  ``,
  quoteCorpus,
].join("\n");
