import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { quoteSystemPrompt } from "@/lib/quote-corpus";

/**
 * One turn of the quote assistant, streamed.
 *
 * !! THIS IS A PUBLIC ENDPOINT THAT SPENDS MONEY !!
 *
 * Nothing authenticates the caller, and every request costs a fraction of a
 * cent. That is fine at visitor volume and ruinous at script volume, so the
 * gates below are not optional extras - they are the reason this can be left
 * switched on. Cheapest check first, so an abusive request is rejected before
 * it reaches the expensive part:
 *
 *   1. A key must be configured at all.
 *   2. The body must be shaped right, and short.       (free)
 *   3. The conversation must be within the turn cap.   (free)
 *   4. The caller must be inside the rate limit.       (free)
 *   5. Only then does anything reach the model.        (costs)
 *
 * !! THE TURN COUNT IS TAKEN FROM THE POSTED HISTORY, NOT FROM THE CLIENT !!
 *
 * The browser sends the transcript, so the browser could send a counter too -
 * and a counter the caller controls is not a cap. The history itself is the
 * thing being paid for, so its length is what gets measured.
 */

/*
 * The model, and it is a deliberate pick rather than a default.
 *
 * Effort is low because this is short grounded lookup, not reasoning, and
 * effort is where the cost lever lives - dropping the model tier would be the
 * cruder version of the same saving. Thinking stays on: it is on by default on
 * this model, and disabling it on Opus is a known trap that can leak internal
 * tags into the visible reply.
 */
const MODEL = "claude-opus-5";

/** Deliberately short. A few sentences in a 512px box, not an essay. */
const MAX_TOKENS = 700;

/** Longest single question we will pay to answer. */
const MAX_INPUT_CHARS = 500;

/**
 * How many exchanges before the assistant hands over for good.
 *
 * Six is a real conversation and not an open-ended one. It caps the spend per
 * visitor, and it caps how long somebody can sit talking to software instead
 * of sending the enquiry this modal exists to collect.
 */
const MAX_TURNS = 6;

/*
 * The rate limit.
 *
 * In-process and in-memory, which means it resets on deploy and is per
 * instance rather than global. That is the honest limitation, and it is still
 * worth having: it stops a single script in a loop, which is the realistic
 * threat here. A shared counter would mean Redis, and this route does not
 * justify a new piece of infrastructure until the traffic says otherwise.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, { count: number; resetAt: number }>();

function overRateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });

    /*
     * Sweep on write. Without it this map is a slow memory leak keyed by every
     * address that ever asked a question.
     */
    if (hits.size > 5_000) {
      for (const [id, seen] of hits) if (now > seen.resetAt) hits.delete(id);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/**
 * Who is calling, as well as we can tell.
 *
 * Behind the droplet's proxy the socket address is the proxy, so the forwarded
 * header is what carries the visitor. It is spoofable, which is worth being
 * clear about: this identifies a caller well enough to slow down a naive
 * script, and not well enough to stop a determined one. The turn cap and the
 * token ceiling are what bound the damage if it is bypassed.
 */
function callerKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || "unknown";
}

type Turn = { role: "user" | "assistant"; content: string };

function parseTurns(value: unknown): Turn[] | null {
  if (!Array.isArray(value)) return null;

  const turns: Turn[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as Partial<Turn>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    turns.push({ role, content: content.slice(0, MAX_INPUT_CHARS * 4) });
  }
  return turns;
}

/**
 * Is the assistant switched on?
 *
 * The modal asks this once when it opens, so it can decide whether to offer
 * the assistant at all rather than letting somebody walk into a branch that
 * then apologises. Whether a key is configured is not a secret - the answer is
 * a boolean and nothing about the key itself leaves here.
 *
 * One source of truth, deliberately. A NEXT_PUBLIC mirror of "is the key set"
 * would be a second place to keep in step, and it would be wrong the first
 * time somebody changed one and not the other.
 */
export function GET() {
  return NextResponse.json(
    { available: Boolean(process.env.ANTHROPIC_API_KEY) },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  /*
   * No key, no assistant - and the modal is told so in a way it can act on,
   * rather than being handed an error to render. It hides the option and sends
   * people down the scripted path instead, which is a working route rather
   * than a degraded one. Same rule as every other integration on this site.
   */
  if (!apiKey) {
    return NextResponse.json(
      { error: "unconfigured", message: "The assistant is not switched on." },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = (await request.json()) as { messages?: unknown };
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const turns = parseTurns(body.messages);
  if (!turns || turns.length === 0) {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const last = turns[turns.length - 1];
  if (last.role !== "user") {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }
  if (last.content.trim().length === 0) {
    return NextResponse.json({ error: "Ask me something first." }, { status: 400 });
  }
  if (last.content.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_INPUT_CHARS} characters and I will do better with it.` },
      { status: 413 },
    );
  }

  const asked = turns.filter((turn) => turn.role === "user").length;
  if (asked > MAX_TURNS) {
    return NextResponse.json(
      {
        error: "turns_exhausted",
        message:
          "That is about as far as I can take it. Send the brief through and you will get a proper answer from the person who would run the work.",
      },
      { status: 429 },
    );
  }

  if (overRateLimit(callerKey(request))) {
    return NextResponse.json(
      { error: "Give me a moment - too many questions at once." },
      { status: 429 },
    );
  }

  /* ----------------------------------------------------------- the model */

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      /*
       * Effort low, thinking left at its default (on). See MODEL above.
       */
      output_config: { effort: "low" },
      /*
       * The system prompt is the same bytes on every request, so it caches.
       * Every visitor after the first reads the corpus at a tenth of the price,
       * which is what makes this affordable to leave running.
       */
      system: [
        {
          type: "text",
          text: quoteSystemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: turns,
    });

    const encoder = new TextEncoder();

    /*
     * !! THE FIRST EVENT IS PULLED BEFORE WE COMMIT TO A STREAMED RESPONSE !!
     *
     * messages.stream() does not throw when the request is bad - it resolves,
     * and the failure surfaces on the first read. Returning the Response
     * first and iterating inside the stream therefore sends 200 and its
     * headers before anything is known to have worked, which turned a
     * rejected API key into "something went wrong" typed into the chat and
     * made the AuthenticationError branch below unreachable. Found exactly
     * that way on 27 August 2026, testing with a deliberately invalid key.
     *
     * Waiting for the first event costs time-to-first-token and buys a real
     * status code: a bad key becomes the 503 the modal knows how to act on,
     * and the branch disappears instead of apologising.
     */
    const iterator = stream[Symbol.asyncIterator]();
    const first = await iterator.next();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for (let step = first; !step.done; step = await iterator.next()) {
            const event = step.value;
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          /*
           * A safety decline arrives as a normal 200 with this stop reason, not
           * as a thrown error, so it has to be checked explicitly or it reads
           * to the visitor as the assistant going silent mid-sentence.
           */
          const message = await stream.finalMessage();

          /*
           * What the turn actually cost, logged every time.
           *
           * !! WATCH cacheRead VERSUS cacheWrite, NOT THE TOTAL !!
           *
           * The corpus is around 36k tokens, so the prompt dominates the bill
           * and the only thing that makes it affordable is the cache. A read
           * is a tenth of the input price; a write is one and a quarter times
           * it. The ephemeral cache lives about five minutes, which means a
           * quiet site can miss on nearly every question and pay the write
           * price each time - and a run of writes with no reads costs more
           * than not caching at all.
           *
           * If cacheRead is regularly zero here, the answer is not to tune the
           * cache. It is that the corpus is too big for this traffic, and it
           * wants trimming or a cheaper model.
           */
          console.info("[quote/ask] usage:", {
            cacheRead: message.usage.cache_read_input_tokens ?? 0,
            cacheWrite: message.usage.cache_creation_input_tokens ?? 0,
            uncachedIn: message.usage.input_tokens,
            out: message.usage.output_tokens,
          });

          if (message.stop_reason === "refusal") {
            controller.enqueue(
              encoder.encode(
                "I am not able to answer that one. Ask me something about the work instead, or carry on with the questions.",
              ),
            );
          }
        } catch (cause) {
          console.error("[quote/ask] Stream failed mid-flight:", cause);
          controller.enqueue(
            encoder.encode(
              "\n\nSomething went wrong on our side there. Try again, or carry on with the questions.",
            ),
          );
        } finally {
          controller.close();
        }
      },
      cancel() {
        /*
         * The visitor closed the modal. Stop generating rather than paying for
         * an answer nobody will read.
         */
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        /* Stops a proxy holding the whole answer back and defeating streaming. */
        "x-accel-buffering": "no",
      },
    });
  } catch (cause) {
    if (cause instanceof Anthropic.AuthenticationError) {
      console.error("[quote/ask] ANTHROPIC_API_KEY is set but was rejected.");
      return NextResponse.json(
        { error: "unconfigured", message: "The assistant is not switched on." },
        { status: 503 },
      );
    }
    if (cause instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Busy right now. Try that again in a moment." },
        { status: 429 },
      );
    }

    console.error("[quote/ask] Request failed:", cause);
    return NextResponse.json(
      { error: "That did not work. Carry on with the questions and we will pick it up." },
      { status: 502 },
    );
  }
}
