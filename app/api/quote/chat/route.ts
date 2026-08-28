import { randomUUID } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { after, NextResponse } from "next/server";

import { greeting } from "@/content/quote-chat";
import { databaseConfigured } from "@/lib/db";
import { chatPhasePrompt, chatSystemBase } from "@/lib/quote-chat-prompt";
import {
  isPhase,
  isTerminal,
  missingForEstimate,
  nextPhase,
  type Phase,
} from "@/lib/quote-session";
import {
  appendTurns,
  countFiles,
  openSession,
  patchSession,
  queueEstimate,
  type Session,
  type SessionPatch,
} from "@/lib/quote-store";
import { callerKey, overLimit } from "@/lib/rate-limit";

/**
 * One turn of the conversational quote assistant.
 *
 * The stateless route next door (app/api/quote/ask/route.ts) is still the one
 * behind the scripted flow's "Something else" branch, and it stays. This is
 * the chat-first assistant: it owns its state, it walks a visitor through a
 * phase at a time, and it ends by queueing an estimate.
 *
 * !! THIS IS A PUBLIC ENDPOINT THAT SPENDS MONEY !!
 *
 * The same warning the older route carries, and the same order of gates -
 * cheapest first, so an abusive request is refused before it costs anything:
 *
 *   1. A key and a database must be configured at all.
 *   2. The body must be shaped right, and short.        (free)
 *   3. The conversation must not be finished.             (db)
 *   4. The conversation must be within the turn cap.      (db)
 *   5. The caller must be inside the rate limit.      (memory)
 *   6. Only then does anything reach the model.        (costs)
 *
 * !! THE TURN COUNT COMES FROM THE DATABASE, NOT FROM THE CLIENT !!
 *
 * The older route takes it from the posted transcript and explains that a
 * counter the caller controls is not a cap. Here the transcript is not posted
 * at all - the browser sends one message and the server holds the history -
 * so the count is simply a column.
 */

/**
 * The model.
 *
 * Haiku, on the client's instruction of 27 August 2026, and the reasoning in
 * app/api/quote/ask/route.ts holds unchanged: the corpus dominates the bill,
 * the work here is grounded lookup and classification rather than reasoning,
 * and the estimate - the one part that genuinely needs to reason - runs
 * separately on a larger model. See lib/quote-estimate.ts.
 *
 * !! NO output_config.effort ON THIS MODEL !!
 *
 * Effort is rejected on Haiku 4.5 and would 400 every request. If QUOTE_MODEL
 * is ever pointed at Sonnet 5, add `output_config: { effort: "low" }` back to
 * the call below or it silently runs at the default and costs more than it
 * needs to.
 */
const MODEL = process.env.QUOTE_MODEL || "claude-haiku-4-5";

/** A few sentences in a narrow window, not an essay. */
const MAX_TOKENS = 700;

/**
 * Longest single message we will pay to read.
 *
 * Larger than the older route's 500, because this one asks people to describe
 * a project rather than to ask a question, and somebody pasting three
 * paragraphs of requirement is exactly the visitor this exists for.
 */
const MAX_INPUT_CHARS = 2_000;

/**
 * User turns before the assistant stops.
 *
 * Forty, against the older route's six, and the difference is the point: that
 * one is a detour off a form and is meant to end quickly, this one is the
 * whole conversation and has nine phases to get through. Forty is roughly
 * four times what the flow needs, so it is a runaway guard rather than a
 * budget - a real conversation never comes near it.
 */
const MAX_TURNS = 40;

/**
 * How many #OFF replies before the assistant stops answering.
 *
 * !! ENDING THE CHAT IS NOT LOCKING SOMEBODY OUT OF THE COMPANY !!
 *
 * The older route's note applies unchanged. Only the assistant stops; the
 * contact page, the phone numbers and the scripted form stay open, because
 * wrongly shutting the door on a real buyer costs far more than the couple of
 * pence a time-waster spends.
 */
const MAX_OFF_TOPIC = 2;

const CONVERSATION_ID = /^[a-f0-9-]{8,64}$/i;

type Flag = "WORK" | "HR" | "OFF";

/* ------------------------------------------------------- the control line */

type Control = {
  flag: Flag;
  phase?: Phase;
  kind?: "lead" | "student";
  service?: string;
  done: boolean;
};

/**
 * Reads the control line off the front of a reply.
 *
 * The format is specified in lib/quote-chat-prompt.ts: a tag, then optional
 * space-separated directives, all on line one.
 *
 * !! AN UNREADABLE CONTROL LINE FAILS OPEN, AND THAT IS DELIBERATE. !!
 *
 * A missing tag is read as #WORK and a missing directive as "no change". The
 * failure mode of the alternative is silently cutting off a real buyer because
 * the model forgot a prefix, which is far worse than a conversation that sits
 * in one phase a turn longer than it should. Everything the directives can ask
 * for is checked against the flow afterwards anyway.
 */
function parseControl(head: string): { control: Control; rest: string } {
  const match = /^\s*#(WORK|HR|OFF)\b([^\n]*)\n?/.exec(head);

  if (!match) {
    return { control: { flag: "WORK", done: false }, rest: head };
  }

  const [, tag, directives] = match;
  const control: Control = { flag: tag as Flag, done: false };

  for (const token of directives.trim().split(/\s+/)) {
    if (!token) continue;

    if (token === "DONE") {
      control.done = true;
      continue;
    }

    const [key, value] = token.split(":");
    if (!value) continue;

    if (key === "PHASE" && isPhase(value)) control.phase = value;
    else if (key === "KIND" && (value === "lead" || value === "student")) {
      control.kind = value;
    } else if (key === "SERVICE") control.service = value.slice(0, 40);
  }

  return { control, rest: head.slice(match[0].length) };
}

/**
 * The history, as the model should see it.
 *
 * The greeting is written by content/quote-chat.ts and shown by the browser
 * without ever calling this route, but it is stored so the archive holds the
 * whole conversation. That leaves the transcript starting with an assistant
 * turn, which the API rejects - the first message has to be from the user - so
 * leading assistant turns are dropped here. Nothing is lost: the greeting says
 * what the prompt already establishes.
 */
function modelMessages(session: Session, message: string): Anthropic.MessageParam[] {
  const history = [...session.transcript];
  while (history.length && history[0].role === "assistant") history.shift();

  return [
    ...history.map((turn) => ({
      role: turn.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: turn.content,
    })),
    { role: "user" as const, content: message },
  ];
}

/* ------------------------------------------------------------------- route */

/**
 * Is the assistant switched on?
 *
 * Asked once when the window opens, so it can offer the conversation or fall
 * back to the scripted flow rather than letting somebody walk into a branch
 * that then apologises. Both halves are needed: a key to think with and a
 * database to remember in. Neither answer is a secret - they are booleans, and
 * nothing about either value leaves here.
 */
export function GET() {
  return NextResponse.json(
    {
      available: Boolean(process.env.ANTHROPIC_API_KEY) && databaseConfigured(),
      greeting: greeting.message,
      choices: greeting.choices,
    },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || !databaseConfigured()) {
    return NextResponse.json(
      { error: "unconfigured", message: "The assistant is not switched on." },
      { status: 503 },
    );
  }

  let body: { conversationId?: unknown; message?: unknown; placement?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const conversationId =
    typeof body.conversationId === "string" && CONVERSATION_ID.test(body.conversationId)
      ? body.conversationId
      : null;

  if (!conversationId) {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const placement =
    typeof body.placement === "string" ? body.placement.slice(0, 40) : undefined;

  if (!message) {
    return NextResponse.json({ error: "Say something first." }, { status: 400 });
  }
  if (message.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      {
        error: `Keep it under ${MAX_INPUT_CHARS} characters and I will do better with it.`,
      },
      { status: 413 },
    );
  }

  if (overLimit("chat", callerKey(request), 30, 60_000)) {
    return NextResponse.json(
      { error: "Give me a moment - too many messages at once." },
      { status: 429 },
    );
  }

  let session: Session;
  let fileCount: number;

  try {
    /*
     * Creates the row on the first message and seeds the greeting into it, so
     * the archive holds the conversation the visitor actually saw. Done here
     * rather than in the browser because the browser is not allowed to write
     * to the transcript the phase is derived from.
     */
    session = await openSession(conversationId, placement);

    if (session.transcript.length === 0) {
      await appendTurns(conversationId, [
        { role: "assistant", content: greeting.message.join("\n\n") },
      ]);
      session = { ...session, transcript: [
        { role: "assistant", content: greeting.message.join("\n\n") },
      ] };
    }

    fileCount = await countFiles(conversationId);
  } catch (cause) {
    console.error("[quote/chat] could not open the session:", cause);
    return NextResponse.json(
      { error: "server", message: "That did not work. Try again in a moment." },
      { status: 500 },
    );
  }

  /*
   * Finished conversations stay finished.
   *
   * `student` is terminal and is NOT a refusal - they got what they came for.
   * The message says so rather than implying they did something wrong.
   */
  if (isTerminal(session.phase)) {
    return NextResponse.json(
      {
        error: "finished",
        message:
          session.phase === "student"
            ? `You have everything you need above. ${greeting.title} is only here for project enquiries, so anything else is best sent straight to the address above.`
            : "That is everything from me. Somebody at Hitasoft has it from here.",
        phase: session.phase,
      },
      { status: 409 },
    );
  }

  if (session.turns >= MAX_TURNS) {
    return NextResponse.json(
      {
        error: "turns_exhausted",
        message:
          "That is about as far as I can take it here. Somebody will pick this up with you directly.",
      },
      { status: 429 },
    );
  }

  if (session.offTopic >= MAX_OFF_TOPIC) {
    return NextResponse.json(
      {
        error: "closed",
        message:
          "I am going to leave it there. If you do have something you are building, the team is on the contact page and somebody will read what you send.",
      },
      { status: 403 },
    );
  }

  /* ----------------------------------------------------------- the model */

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      /* No effort parameter. See the note on MODEL above - Haiku rejects it. */
      system: [
        {
          type: "text",
          text: chatSystemBase,
          /*
           * The breakpoint. Everything before it is identical on every request
           * from every visitor and is read from cache at a tenth of the price;
           * everything after it changes per turn and is cheap because it is
           * small. See the shouted note in lib/quote-chat-prompt.ts.
           */
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: chatPhasePrompt(session, fileCount) },
      ],
      messages: modelMessages(session, message),
    });

    /*
     * !! THE FIRST EVENT IS PULLED BEFORE WE COMMIT TO A STREAMED RESPONSE !!
     *
     * messages.stream() does not throw on a bad request - it resolves, and the
     * failure surfaces on the first read. Returning the Response first would
     * therefore send a 200 and its headers before anything is known to have
     * worked, which turns a rejected API key into "something went wrong" typed
     * into the chat. The older route found that exact bug on 27 August 2026
     * with a deliberately invalid key.
     *
     * Waiting costs time-to-first-token and buys a real status code, and here
     * it buys something more: the control line is parsed before any header is
     * sent, so the new phase can travel as one.
     */
    const iterator = stream[Symbol.asyncIterator]();

    let head = "";
    let finished = false;

    /*
     * Read as far as the first newline. The 200 character ceiling guards
     * against a model that forgets it - without one, a reply with no line
     * break would be buffered to the end and streaming would quietly stop
     * being streaming. Larger than the older route's 80 because the control
     * line now carries directives as well as a tag.
     */
    while (!finished && !head.includes("\n") && head.length < 200) {
      const step = await iterator.next();
      if (step.done) {
        finished = true;
        break;
      }
      if (
        step.value.type === "content_block_delta" &&
        step.value.delta.type === "text_delta"
      ) {
        head += step.value.delta.text;
      }
    }

    const { control, rest } = parseControl(head);

    /* ------------------------------------------------- what the turn changed */

    /*
     * Applied through the flow rules, which refuse anything illegal from where
     * this conversation actually is.
     *
     * !! #OFF CLOSES ON THE SECOND STRIKE. NOT THE FIRST. !!
     *
     * MAX_OFF_TOPIC is 2 for a reason documented above: the first off-topic
     * reply is a warning the model delivers itself, and only the second ends
     * the conversation. An earlier version of this line closed on the very
     * first #OFF, which is not that policy - it is one strike, and it means
     * anyone the model classifies as off-topic even once, including a
     * perfectly recoverable "who am I talking to" or "can I get a phone
     * number", loses the composer outright. `session.offTopic` is the count
     * from BEFORE this turn, so on the first #OFF it is still 0 and the
     * conversation stays exactly where it was - the model's own warning is
     * the whole consequence. Only when a second #OFF lands on top of that
     * does the phase actually move to `closed`.
     */
    const secondOffTopicStrike =
      control.flag === "OFF" && session.offTopic >= MAX_OFF_TOPIC - 1;

    const phase = secondOffTopicStrike
      ? nextPhase(session.phase, "closed")
      : control.flag === "OFF"
        ? session.phase
        : nextPhase(session.phase, control.phase);

    const patch: SessionPatch = { phase };

    if (control.kind) patch.visitorKind = control.kind;

    /*
     * A backstop, not just a prompt instruction.
     *
     * !! SEEN ON 28 AUGUST 2026: A CONVERSATION STUCK AT `timeline` FOREVER !!
     *
     * A visitor picked "something else", the model moved PHASE:requirement
     * without ever tagging SERVICE, and `service` stayed null for the rest of
     * the conversation. missingForEstimate refused DONE on every later turn
     * because of it - silently, since a refusal here does not undo the
     * closing-sounding reply the model had already written. The visitor was
     * told an estimate was on its way and nothing was ever queued.
     *
     * The prompt now says this tag is required, but a model that occasionally
     * drops one instruction among many is exactly the failure this backstop
     * exists for: leaving `service` is the one legal exit from this phase, so
     * if the model did not name a value on the way out, "other" is always a
     * correct one - never a guess that could be wrong the way a budget or a
     * timeline figure could be.
     */
    if (control.service) {
      patch.service = control.service;
    } else if (session.phase === "service" && phase === "requirement") {
      patch.service = "other";
      console.warn("[quote/chat] SERVICE tag missing on service->requirement, defaulted to 'other'", {
        conversationId,
      });
    }

    /*
     * The budget and the timeline are taken from what the visitor typed, not
     * from anything the model reports.
     *
     * The model is asked for a transition, never for a value, and the reason
     * is that a value round-tripped through a model is a value that can be
     * quietly rewritten - "about 8 lakh" coming back as "800000" is a
     * different answer, and it is the number a person will price against. The
     * transition tells us which question this message answered; the message
     * itself is the answer, stored in their own words.
     */
    if (session.phase === "budget" && phase === "timeline") {
      patch.budget = message.slice(0, 500);
    }
    if (session.phase === "timeline" && control.done) {
      patch.timeline = message.slice(0, 500);
    }

    /*
     * Written before the reply is streamed, not after.
     *
     * If the visitor closes the window mid-answer, the phase still moved and
     * their budget was still recorded. The other order loses both to a closed
     * tab, and re-asks a question they already answered when they come back.
     */
    let updated = await patchSession(conversationId, patch);

    /* ------------------------------------------------------- the estimate */

    /*
     * DONE means the visitor has answered everything. The estimate row and the
     * move to `queued` happen together in one statement - see queueEstimate -
     * because the assistant has just promised somebody an estimate, and a
     * promise recorded without a job behind it is a lead who waits forever.
     */
    let queued = false;

    if (control.done && updated.phase === "timeline") {
      const missing = missingForEstimate({
        phase: updated.phase,
        visitorKind: updated.visitorKind,
        service: updated.service,
        verifiedEmail: updated.verifiedEmail,
        budget: updated.budget,
        timeline: updated.timeline,
        fileCount,
      });

      if (missing.length) {
        /*
         * The model said finished and the record says otherwise. The record
         * wins - an estimate written from half a conversation is worse than
         * one that is late. Logged loudly because it means a phase objective
         * is letting the model skip a question.
         */
        console.error("[quote/chat] DONE refused, still missing:", missing, {
          conversationId,
        });
      } else {
        queued = await queueEstimate({ id: randomUUID(), conversationId });
        if (queued) {
          updated = { ...updated, phase: "queued" };
          console.info("[quote/chat] estimate queued", { conversationId });

          /*
           * Start writing it as soon as this reply has been delivered.
           *
           * after() runs once the response is finished, so the visitor is not
           * left watching a spinner while a large model reasons for a minute.
           * It runs even if the response errored, which is what we want - the
           * row is already committed, and the work is owed either way.
           *
           * !! THIS IS A HEAD START, NOT THE ONLY TRIGGER. !!
           *
           * The process can be replaced mid-job, the model can rate-limit, the
           * droplet can be busy. Anything that does not finish goes back to
           * 'queued' and is picked up by /api/quote/estimate/run, which is
           * what the schedule calls. Nothing depends on this call succeeding -
           * it only makes the common case fast.
           */
          after(async () => {
            try {
              const { runNextEstimate } = await import("@/lib/quote-estimate");
              await runNextEstimate();
            } catch (cause) {
              console.error("[quote/chat] estimate kick-off failed:", cause);
            }
          });

          /*
           * The internal heads-up, on the client's instruction of 28 August
           * 2026 - see lib/quote-lead-summary.ts for what it sends and why it
           * is a separate concern from the estimate job kicked off above.
           * A second after() rather than folding into the one above: the
           * estimate job can genuinely take a while, and a notification email
           * has no reason to wait behind it.
           */
          after(async () => {
            const { sendLeadSummary } = await import("@/lib/quote-lead-summary");
            await sendLeadSummary(conversationId);
          });
        }
      }
    }

    const encoder = new TextEncoder();
    let tail = "";

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          if (rest) controller.enqueue(encoder.encode(rest));

          while (!finished) {
            const step = await iterator.next();
            if (step.done) break;
            if (
              step.value.type === "content_block_delta" &&
              step.value.delta.type === "text_delta"
            ) {
              tail += step.value.delta.text;
              controller.enqueue(encoder.encode(step.value.delta.text));
            }
          }

          const final = await stream.finalMessage();

          /*
           * A safety decline arrives as a normal 200 with this stop reason
           * rather than as a thrown error, so it has to be checked explicitly
           * or it reads to the visitor as the assistant going silent
           * mid-sentence.
           */
          if (final.stop_reason === "refusal") {
            controller.enqueue(
              encoder.encode(
                "I am not able to answer that one. Tell me about the project instead and we will carry on.",
              ),
            );
          }

          /*
           * What the turn cost.
           *
           * !! WATCH cacheRead VERSUS cacheWrite, NOT THE TOTAL !!
           *
           * The corpus dominates the bill and the cache is the only thing that
           * makes this affordable. A read is a tenth of the input price; a
           * write is one and a quarter times it. If cacheRead is regularly
           * zero, the answer is not to tune the cache - it is that something
           * per-turn has crept into the cached block, or the site is too quiet
           * for a five minute cache and the corpus wants trimming.
           */
          console.info("[quote/chat] usage:", {
            phase: updated.phase,
            flag: control.flag,
            cacheRead: final.usage.cache_read_input_tokens ?? 0,
            cacheWrite: final.usage.cache_creation_input_tokens ?? 0,
            uncachedIn: final.usage.input_tokens,
            out: final.usage.output_tokens,
          });
        } catch (cause) {
          console.error("[quote/chat] stream failed mid-flight:", cause);
          controller.enqueue(
            encoder.encode(
              "\n\nSomething went wrong on our side there. Try that again.",
            ),
          );
        } finally {
          /*
           * The transcript is written whatever happened, including when the
           * visitor closed the window - a half-finished answer is still what
           * they saw, and storing it is what stops the next turn reading as a
           * non-sequitur. recordTurns-style failures are swallowed here for
           * the same reason lib/db.ts swallows its own: losing an archive line
           * must never cost the conversation.
           */
          try {
            await appendTurns(conversationId, [
              { role: "user", content: message },
              {
                role: "assistant",
                content: rest + tail,
                flag: control.flag,
              },
            ]);
          } catch (cause) {
            console.error("[quote/chat] could not store the turn:", cause);
          }
          controller.close();
        }
      },
      cancel() {
        /* Window closed. Stop paying for an answer nobody will read. */
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        /* Stops a proxy holding the whole answer back and defeating streaming. */
        "x-accel-buffering": "no",
        /*
         * Where the conversation is now, so the window knows whether to show
         * the email box, the uploader, or nothing at all. Read from the stored
         * row rather than from what the model asked for, so the browser is
         * told what actually happened.
         */
        "x-quote-phase": updated.phase,
        "x-quote-flag": control.flag,
        "x-quote-queued": queued ? "1" : "0",
      },
    });
  } catch (cause) {
    if (cause instanceof Anthropic.AuthenticationError) {
      console.error("[quote/chat] ANTHROPIC_API_KEY is set but was rejected.");
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

    console.error("[quote/chat] request failed:", cause);
    return NextResponse.json(
      { error: "That did not work. Try again in a moment." },
      { status: 502 },
    );
  }
}
