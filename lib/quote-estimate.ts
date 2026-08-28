import "server-only";

import { randomUUID } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";

import { deliveryEstimates } from "@/content/delivery-estimates";
import { serviceOptions } from "@/content/quote-chat";
import { ESTIMATE_SCHEMA, type Estimate } from "@/lib/quote-estimate-schema";
import { renderEstimatePdf } from "@/lib/quote-pdf";
import {
  claimEstimate,
  claimEstimateById,
  failEstimate,
  finishEstimate,
  getSession,
  listFiles,
  type EstimateRow,
  type FileRow,
} from "@/lib/quote-store";
import { readStoredFile, storeFile } from "@/lib/quote-uploads";

/**
 * Writing the estimate.
 *
 * This is the part the whole conversation exists to reach: everything the
 * visitor said, plus everything they uploaded, turned into scope, phases,
 * costs and a timeline, rendered to a PDF and parked for a person to read.
 *
 * !! IT NEVER EMAILS ANYBODY. THAT IS A SEPARATE, HUMAN-TRIGGERED STEP. !!
 *
 * The job ends at status 'ready'. Sending happens in app/api/admin/estimates
 * after somebody has approved it. Decided with the client on 27 August 2026,
 * and scripts/quote-schema.sql carries the full reasoning - in short, every
 * piece of copy on this site refuses to state a price, and a model-written
 * figure emailed unread would abandon that discipline by accident.
 *
 * !! THE MODEL IS ALLOWED TO STATE PRICES HERE, AND ONLY HERE. !!
 *
 * The chat assistant is forbidden from it in the strongest terms. This is the
 * deliberate exception, and the guardrails move rather than disappear: the
 * figure must carry its basis, its assumptions, its exclusions and what could
 * move it, all of which the schema makes mandatory. A number on its own is
 * refused by the schema before it is refused by a person.
 *
 * !! ALWAYS USD, AND ALWAYS PRICED AT HITASOFT'S OWN AI-AUGMENTED PACE !!
 *
 * Two decisions from the client on 27 August 2026, both load-bearing on every
 * figure this file produces:
 *
 *   Currency  - USD, whatever currency the client talked in. See ESTIMATE_SCHEMA
 *               in lib/quote-estimate-schema.ts, which enforces this with an
 *               enum rather than trusting the prompt alone.
 *
 *   Pace      - priced and scheduled at roughly 40% of what a traditional,
 *               human-only staffed team would need for the same scope - a cut
 *               of about 60% in both cost and duration. This is not a discount
 *               bolted on afterwards; it is what AI-augmented delivery actually
 *               costs and actually takes, and SYSTEM below tells the model to
 *               write that number directly rather than show a "before" figure
 *               and knock it down. content/delivery-estimates.ts is quoted in
 *               the prompt for background only - see the section header
 *               above it in SYSTEM for why it must never be the anchor.
 */

/**
 * Sonnet, on the client's instruction of 27 August 2026.
 *
 * The chat runs on Haiku because it is doing grounded lookup and
 * classification. This is the one part of the flow that has to reason -
 * decomposing a described problem into phases and defending a number - and it
 * runs once per completed lead rather than once per turn, so the cost of a
 * larger model is a few cents against a lead worth lakhs.
 *
 * Effort is set high: this is the opposite of a latency-sensitive path. It
 * runs in the background, the visitor has been told it takes time, and the
 * output is read by somebody deciding whether to send it to a buyer.
 */
const MODEL = process.env.QUOTE_ESTIMATE_MODEL || "claude-sonnet-5";

/**
 * !! NOT AS GENEROUS AS THE OLD COMMENT HERE CLAIMED. SEEN FAILING ON 28 AUGUST 2026. !!
 *
 * This was 8_000, and a real regenerate job hit it exactly - `usage: { in:
 * 4860, out: 8000 }` in the log, followed by `Unterminated string in JSON at
 * position 11429` from writeEstimate's own JSON.parse. Adaptive thinking has
 * no fixed budget, so on a turn where the model reasons hard - working out a
 * traditional-team comparison, deciding how to word the cost basis - thinking
 * and the JSON answer are competing for the SAME ceiling, and the API cuts off wherever
 * that ceiling lands, mid-string if it has to. Tripled with real headroom for
 * thinking rather than assuming a long document alone was the constraint.
 */
const MAX_TOKENS = 24_000;

/**
 * Attempts before a job is marked failed for good.
 *
 * Three, because the realistic failures are transient - a rate limit, a
 * timeout, the droplet being busy - and a lead who was promised an estimate is
 * worth retrying for. Past three it stays visible as 'failed' in the admin
 * rather than retrying forever, because at that point somebody needs to look.
 */
const MAX_ATTEMPTS = 3;

/**
 * Documents attached to the model call.
 *
 * PDFs go to the model whole rather than being parsed here - the API reads
 * them natively, which is why there is no PDF parser in this project. Images
 * likewise: a screenshot of the screen that is slow is genuinely useful and
 * only a vision model can use it.
 *
 * The ceiling exists because the request has a 32MB limit and because a lead
 * who uploaded ten scanned PDFs would otherwise produce one enormous call. The
 * files are taken in upload order, and anything past the ceiling is named to
 * the model as present-but-unread rather than silently dropped - a model that
 * knows it has not seen something says so, and one that does not, guesses.
 */
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

const MODEL_READABLE = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

/* --------------------------------------------------------------- the prompt */

const deliveryTable = Object.entries(deliveryEstimates)
  .map(([key, estimate]) => `  ${key} — ${estimate.label}: ${estimate.range}`)
  .join("\n");

const SYSTEM = [
  `You are a delivery lead at Hitasoft, an AI engineering company in Madurai, India. You are writing the first written estimate for a prospective client, from a conversation they had with the website assistant and any documents they uploaded.`,
  ``,
  `Somebody at Hitasoft reads this before the client does. Write it for both of them.`,
  ``,
  `## What makes this estimate good`,
  ``,
  `Not the number. The reasoning around the number. A client reading it should think "they understood us" before they think about the price, and a colleague reading it should be able to see exactly which assumption to argue with.`,
  ``,
  `## Price and schedule this as Hitasoft actually delivers - not as a traditional human-only team would`,
  ``,
  `On the client's instruction of 27 August 2026: Hitasoft builds with AI-augmented engineering. AI coding agents, automated testing and AI-assisted QA cut real build time and real cost against a fully human-staffed team doing the same scope by hand. That is a genuine difference in how the work gets done, not a discount applied at the end, and the numbers in this estimate must reflect it directly.`,
  ``,
  `Work it out this way: think through what the scope would take a traditional, human-only staffed software team - the pace a client would get quoted anywhere else. Then price and schedule THIS estimate at roughly 40% of that figure, for both cost and duration - a cut of about 60% across the board. Do not show your working or mention the traditional figure anywhere in the output; write only the AI-augmented number, as the real number it is.`,
  ``,
  `Say what produced it, though. The cost basis must state plainly that the figure reflects Hitasoft's AI-augmented delivery process, materially faster and cheaper than a traditional human-only build - so the reader understands why the number is what it is, rather than wondering if it is a lowball.`,
  ``,
  `## Why this price, and not one person alone with an AI coding tool`,
  ``,
  `On the client's instruction of 28 August 2026: the obvious comparison for anybody reading this in 2026 is not a traditional agency, it is themselves - or a freelancer - building it solo with Claude Code, Cursor or the like. That comparison is fair and worth answering directly rather than ignoring, because a client who is quietly wondering "why not just do this myself" and never hears an answer will act on the question instead of asking it.`,
  ``,
  `Answer it in the basis, briefly, when the estimate is the kind of project somebody could plausibly attempt alone - most of them are. Do NOT invent or state a solo-developer market rate; that is a number this company cannot verify and stating one as fact is exactly the kind of invented statistic the rules below forbid. Instead say what the price is actually buying beyond the code itself: a second set of eyes on the work before it ships, accountability if something is wrong after it does, a team that does not disappear mid-project, and review of the parts - like an AI evaluation or scoring pipeline, where this project has one - where a plausible-looking answer and a correct one are not the same thing. Two or three sentences, factual and undefensive, never framed as a warning against going solo.`,
  ``,
  `## Rules`,
  ``,
  `- Ground everything in what they actually said. If something was not discussed, it goes in assumptions or in questions — never invent a requirement, a system, a team size or a constraint.`,
  `- Every duration must be a range, never a single figure, and every range must already be the AI-augmented one above.`,
  `- Price everything in USD, always. Regardless of what currency the client talked in during the conversation - rupees, lakh, anything else - convert your own understanding of their budget to USD and write the whole estimate in USD. If their stated budget was in another currency, say the conversion you used in the basis (e.g. "their stated budget of ₹15 lakh, at roughly ₹83 to the dollar, is about $18,000") so the comparison in the next rule is legible rather than a number that appears from nowhere.`,
  `- The client stated a budget. Do not simply echo it back as the price. Estimate the work honestly, then say in the basis how it sits against what they had in mind — including, plainly, if the work costs more than they expected. A client told the truth early forgives it; one told it after signing does not.`,
  `- Same for the timeline. If their date is tight for the scope, say so in the timeline note and say what would have to give.`,
  `- Never name a model version number. Model families only.`,
  `- Never invent a statistic, a client name or a case study.`,
  `- No markdown. The fields are rendered into a PDF as plain text.`,
  ``,
  `## Delivery ranges — background only, NOT the pace to price against`,
  ``,
  `This is what the website's own general assistant tells any visitor before a real conversation has happened, and content/delivery-estimates.ts documents why those ranges are deliberately padded: they have to hold for literally anyone, sight unseen, human-only staffing included. They are useful here only as an outside sanity check - if this estimate's timeline is not meaningfully faster than the band below for the same kind of work, the AI-augmented pricing above has not actually been applied.`,
  ``,
  deliveryTable,
  ``,
  `## The reviewer notes`,
  ``,
  `The last field is for your Hitasoft colleague and is never shown to the client. Use it properly: what you inferred rather than heard, which numbers you are least confident in, and anything that would make you want a conversation before this went out. Note here specifically what the equivalent traditional human-only estimate would have been, so a reviewer can see the AI-augmented pricing was actually applied and by roughly how much. An empty or bland reviewer note is a failure — it is the field that decides whether somebody can trust the rest.`,
].join("\n");

/* ------------------------------------------------------------------ the job */

/**
 * Runs one queued estimate, if there is one.
 *
 * Returns what happened, so a caller can loop until the queue is empty without
 * needing to know anything about the table.
 */
export async function runNextEstimate(): Promise<
  { ran: false } | { ran: true; id: string; ok: boolean }
> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ran: false };

  /*
   * Claiming is atomic - see claimEstimate, which uses FOR UPDATE SKIP LOCKED
   * so two workers cannot take the same row and send a visitor two estimates.
   */
  const job = await claimEstimate();
  if (!job) return { ran: false };

  const ok = await processEstimate(apiKey, job);
  return { ran: true, id: job.id, ok };
}

/** Drains the queue, with a ceiling so a poisoned row cannot spin forever. */
export async function runEstimateQueue(max = 5) {
  let ran = 0;
  for (let i = 0; i < max; i += 1) {
    const result = await runNextEstimate();
    if (!result.ran) break;
    ran += 1;
  }
  return ran;
}

/**
 * Rewrites one specific estimate, for the admin's "regenerate" button.
 *
 * !! THE ONLY DIFFERENCE FROM runNextEstimate IS WHICH ROW GETS CLAIMED !!
 *
 * Everything after that - reading the session, writing the estimate,
 * rendering the PDF, marking it ready or failed - is processEstimate below,
 * shared with the cron path so the two can never quietly drift apart. The
 * caller (app/api/admin/estimates/[id]/route.ts) is expected to have already
 * corrected the session's budget or timeline before calling this, since
 * writeEstimate reads them straight from the session it is handed.
 */
export async function regenerateEstimate(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, message: "No Anthropic API key is configured." };

  const job = await claimEstimateById(id);
  if (!job) {
    return {
      ok: false,
      message: "That estimate is not in a state that can be regenerated.",
    };
  }

  const ok = await processEstimate(apiKey, job);
  return ok
    ? { ok: true }
    : { ok: false, message: "The model call failed. Check the server log and try again." };
}

/**
 * The actual work behind a claimed row: write it, render it, store it.
 *
 * Split out of runNextEstimate on 28 August 2026 specifically so
 * regenerateEstimate above does not duplicate it - a second copy of this
 * try/catch is a second place the retry-then-fail logic can go out of step.
 */
async function processEstimate(apiKey: string, job: EstimateRow): Promise<boolean> {
  try {
    const session = await getSession(job.conversation_id);
    if (!session) throw new Error("The conversation is gone.");

    const files = await listFiles(job.conversation_id);
    const estimate = await writeEstimate(apiKey, session, files);

    /*
     * The PDF is rendered and stored before the row is marked ready, so a
     * 'ready' row always has a document behind it. The other order would put
     * an approve button in the admin for a file that does not exist.
     */
    const pdf = await renderEstimatePdf(estimate, {
      reference: job.id.slice(0, 8).toUpperCase(),
      /* A name reads as a document written for somebody; an email address reads as a mail merge. */
      preparedFor: session.name || session.verifiedEmail || "the client",
      date: new Date(job.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });

    const pdfPath = `${job.conversation_id}/estimate-${job.id}.pdf`;
    await storeFile(pdfPath, pdf);

    await finishEstimate({
      id: job.id,
      model: MODEL,
      content: estimate,
      pdfPath,
    });

    console.info("[quote/estimate] ready", {
      id: job.id,
      conversation: job.conversation_id,
      bytes: pdf.byteLength,
    });

    return true;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error("[quote/estimate] failed", { id: job.id, message });

    /*
     * Back to queued while retries remain, 'failed' once they are gone. Either
     * way the row stays visible in the admin: somebody was promised an
     * estimate, and the only thing worse than a late one is one nobody knows
     * never happened.
     */
    await failEstimate(job.id, message, MAX_ATTEMPTS);
    return false;
  }
}

/* ---------------------------------------------------------------- the model */

async function writeEstimate(
  apiKey: string,
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>,
  files: FileRow[],
): Promise<Estimate> {
  const client = new Anthropic({ apiKey });

  const service =
    serviceOptions.find((option) => option.value === session.service)?.silo ??
    session.service ??
    "not stated";

  /*
   * The conversation, verbatim.
   *
   * The greeting is dropped - it is the same fixed text for every visitor and
   * says nothing about this project - and so are the control flags, which were
   * never meant to leave the chat route.
   */
  const transcript = session.transcript
    .filter((turn, index) => !(index === 0 && turn.role === "assistant"))
    .map((turn) => `${turn.role === "user" ? "CLIENT" : "ASSISTANT"}: ${turn.content}`)
    .join("\n\n");

  const brief = [
    `## What we know`,
    ``,
    `Name: ${session.name ?? "not given"}`,
    `Service area: ${service}`,
    `Budget they stated: ${session.budget ?? "not stated"}`,
    `Timeline they stated: ${session.timeline ?? "not stated"}`,
    `WhatsApp given: ${session.whatsapp ? "yes" : "no"}`,
    `Documents uploaded: ${files.length}`,
    ``,
    `## The conversation`,
    ``,
    transcript,
  ].join("\n");

  /* ------------------------------------------------------------ the files */

  const content: Anthropic.ContentBlockParam[] = [];
  let budgetLeft = MAX_DOCUMENT_BYTES;
  const unread: string[] = [];

  for (const file of files) {
    /*
     * Text we already pulled out at upload time goes in as text - cheaper than
     * a document block and there is nothing a model gains from the original
     * bytes of a .txt file.
     */
    if (file.extracted_text) {
      content.push({
        type: "text",
        text: `--- Uploaded document: ${file.filename} ---\n${file.extracted_text}`,
      });
      continue;
    }

    if (!MODEL_READABLE.has(file.mime ?? "") || file.bytes > budgetLeft) {
      unread.push(file.filename);
      continue;
    }

    try {
      const bytes = await readStoredFile(file.stored_path);
      const data = bytes.toString("base64");
      budgetLeft -= file.bytes;

      if (file.mime === "application/pdf") {
        content.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data },
        });
      } else {
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: file.mime as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
            data,
          },
        });
      }
    } catch (cause) {
      /*
       * A file on the row but not on disk. The likely cause is a redeploy that
       * took the uploads with it - see the shouted note about volumes in
       * lib/quote-uploads.ts. Named to the model rather than dropped silently,
       * so the estimate says it has not seen it instead of guessing.
       */
      console.error("[quote/estimate] could not read", file.stored_path, cause);
      unread.push(file.filename);
    }
  }

  /*
   * !! THE DOCUMENTS GO BEFORE THE TEXT. !!
   *
   * The API expects document and image blocks ahead of the text block that
   * refers to them, and a model that reads the question before the attachment
   * answers from the question alone.
   */
  content.push({
    type: "text",
    text: unread.length
      ? `${brief}\n\n## Files you could not be shown\n\nThese were uploaded but are not readable here: ${unread.join(", ")}. Say in your assumptions that they have not been reviewed yet.`
      : brief,
  });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM,
    /*
     * Adaptive thinking, which is the only on-mode on Sonnet 5 - budget_tokens
     * was removed and would 400. This is reasoning work and it runs in the
     * background, so there is nothing to trade against latency.
     */
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      /*
       * Structured output, so the shape is validated at the API rather than
       * parsed hopefully at this end. A malformed estimate is caught before it
       * becomes a broken PDF in somebody's approval queue.
       */
      format: { type: "json_schema", schema: ESTIMATE_SCHEMA as unknown as Record<string, unknown> },
    },
    messages: [{ role: "user", content }],
  });

  if (message.stop_reason === "refusal") {
    throw new Error("The model declined to write this estimate.");
  }

  const text = message.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("The model returned no estimate.");
  }

  console.info("[quote/estimate] usage:", {
    in: message.usage.input_tokens,
    out: message.usage.output_tokens,
  });

  return JSON.parse(text.text) as Estimate;
}

/** A fresh id for a queued job. Kept here so callers do not import crypto. */
export function newEstimateId() {
  return randomUUID();
}
