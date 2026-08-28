/**
 * Where a quote conversation has got to, and where it is allowed to go next.
 *
 * Pure. No database, no model, no request - just the rules, so they can be
 * read in one sitting and reasoned about without a connection string. The
 * persistence lives in lib/db.ts and the prose lives in content/quote-chat.ts.
 *
 * !! THE MODEL PROPOSES A TRANSITION. THIS FILE DECIDES IF IT HAPPENS. !!
 *
 * The assistant is conversational, so it has to be able to move the
 * conversation along itself - a bot that needs a button pressed to notice
 * somebody answered its question is not a conversation. It does that the same
 * way it already tags replies in app/api/quote/ask/route.ts: a control line on
 * the front of the reply, stripped before anything reaches the browser.
 *
 * What is new is that the tag is now a request rather than a label. It is
 * checked against `TRANSITIONS` below and applied only if that edge exists.
 * A model that hallucinates a jump to the end of the flow moves nowhere, and
 * the visitor sees the reply without ever knowing a transition was refused.
 *
 * !! TWO PHASES CAN NEVER BE ENTERED BY THE MODEL, AT ALL. !!
 *
 * `discovery` is reached only by app/api/quote/verify, and only after a code
 * that was emailed actually came back. `queued` is reached only once an
 * estimate row exists. Both are in SERVER_ONLY, and the check is a separate
 * one from the edge check on purpose: a wrong edge in the table above would
 * still not let a model verify its own visitor.
 */

/* ------------------------------------------------------------------ phases */

/**
 * The flow, in the order somebody walks it.
 *
 * `greeting` is the state a conversation is created in, before anybody has
 * said anything. Two branches leave it, and which one is taken is the single
 * most important thing this assistant works out - see `visitor_kind` in
 * scripts/quote-schema.sql.
 */
export const PHASES = [
  /* Opened, welcomed, waiting to find out who is on the other end. */
  "greeting",

  /*
   * A student, an applicant or a college.
   *
   * !! TERMINAL, AND NOT A REJECTION !!
   *
   * They get Mahalakshmi's details from content/contact.ts and a straight
   * answer. Nothing further is asked of them: no email, no OTP, no budget.
   * Running a lead qualification flow at somebody looking for an internship is
   * how you waste their afternoon and HR's, and content/contact.ts already
   * says why this route exists at all.
   */
  "student",

  /* A buyer. Picking from the services, or saying it is something else. */
  "service",

  /* Talking about what they actually need, before anything is asked of them. */
  "requirement",

  /*
   * The email is on the table and a code has been sent. Waiting for it.
   *
   * The visitor can still talk in this phase - somebody who replies "why do
   * you need that?" must get an answer rather than a wall.
   */
  "verify",

  /* Verified. The real requirement questions. Server-only entry. */
  "discovery",

  /* Asking for the requirement documents. One or more. */
  "files",

  /* "Anything else you would like to add?" - the last chance before pricing. */
  "wrap",

  /* What they are willing to spend. */
  "budget",

  /* When they need it by. */
  "timeline",

  /* Everything is in, an estimate row exists, the job will run. Server-only. */
  "queued",

  /*
   * The off-topic shutdown that app/api/quote/ask/route.ts already implements.
   *
   * !! THIS CLOSES THE ASSISTANT, NOT THE COMPANY !!
   *
   * The route's own comment makes the point and it holds here: the cost of
   * wrongly shutting the door on a real buyer is far higher than the couple of
   * pence a time-waster spends. The contact page stays open either way.
   */
  "closed",
] as const;

export type Phase = (typeof PHASES)[number];

export function isPhase(value: unknown): value is Phase {
  return typeof value === "string" && (PHASES as readonly string[]).includes(value);
}

/**
 * Phases nothing conversational may enter, whatever it asks for.
 *
 * Checked separately from the edge table, and deliberately duplicating part of
 * its job. If somebody later adds a plausible-looking edge into `discovery` -
 * and it would look plausible, because every other phase has one - this is the
 * check that still refuses it. Two locks, one key each.
 */
const SERVER_ONLY: ReadonlySet<Phase> = new Set(["discovery", "queued"]);

/**
 * Phases where the conversation is over and no transition leaves.
 *
 * `student` is here because their question was answered, and `queued` because
 * the work has moved to a person. Neither is a failure state.
 */
const TERMINAL: ReadonlySet<Phase> = new Set(["student", "queued", "closed"]);

export function isTerminal(phase: Phase) {
  return TERMINAL.has(phase);
}

/* ------------------------------------------------------------- transitions */

/**
 * Which phase may follow which.
 *
 * Mostly a line, with the branch at the top and one loop. Read it as "from the
 * key, you may reach any of these".
 *
 * `closed` is reachable from everywhere the model is still talking, because
 * the off-topic counter can run out at any point. It is not listed on every
 * row - `canMove` special-cases it, so this table stays readable.
 */
const TRANSITIONS: Readonly<Record<Phase, readonly Phase[]>> = {
  /* The fork. Everything downstream depends on getting this one right. */
  greeting: ["student", "service"],

  student: [],

  /*
   * Straight to `requirement` whichever service was picked, including
   * "something else". The difference between the branches is what the
   * assistant opens with, not where it goes - see content/quote-chat.ts.
   */
  service: ["requirement"],

  /*
   * Back to `service` is allowed: somebody who starts describing a different
   * project halfway through should not be stuck under the wrong label.
   */
  requirement: ["verify", "service"],

  /*
   * !! NOTE WHAT IS ABSENT: verify DOES NOT LEAD TO discovery HERE. !!
   *
   * That edge does not exist anywhere in this file. The verify route is the
   * only thing that moves a conversation into `discovery`, because the only
   * evidence that matters is a code that came back from a real inbox. A model
   * cannot decide somebody is verified, and with no edge it cannot even ask.
   *
   * Backwards to `requirement` is allowed, for somebody who would rather keep
   * talking before handing an address over. Pushing at that is how you lose a
   * lead who was going to give it to you a minute later.
   */
  verify: ["requirement"],

  discovery: ["files"],

  /* Back to `discovery` for somebody who answers a question while uploading. */
  files: ["wrap", "discovery"],

  /* Back to `files` if the "anything else" turns out to be another document. */
  wrap: ["budget", "files"],

  budget: ["timeline"],

  /*
   * Nothing here reaches `queued` either. The route creates the estimate row
   * first and moves the phase itself, so a conversation is never sitting in a
   * phase that promises an estimate that was never actually queued.
   */
  timeline: [],

  queued: [],
  closed: [],
};

/**
 * The phases a conversation could legally move to on this turn.
 *
 * !! THIS EXISTS TO FIX A REAL BUG, NOT AS A CONVENIENCE. !!
 *
 * The prompt injects the objective for the phase a conversation is IN. But the
 * turn that moves to a new phase is written before the move happens, so it is
 * written under the OLD phase's instructions - and the new phase's opening
 * message is the one that matters most. Found on 27 August 2026: the assistant
 * moved to `verify` and asked for an email address without any of the three
 * things content/quote-chat.ts requires it to say, because at the moment it
 * wrote that sentence it was still following the `requirement` objective. The
 * proper ask then arrived a turn late, after the address had been requested.
 *
 * So the prompt carries the objectives of everywhere this turn could go, and
 * tells the model that asking for a move means writing to that objective now.
 *
 * SERVER_ONLY phases are excluded, because the model cannot move to them and
 * showing it their instructions would only invite it to try.
 */
export function reachableFrom(phase: Phase): Phase[] {
  if (TERMINAL.has(phase)) return [];
  return TRANSITIONS[phase].filter((to) => !SERVER_ONLY.has(to));
}

/** Can a conversation in `from` move to `to` at the model's request? */
export function canMove(from: Phase, to: Phase) {
  if (from === to) return true;
  if (SERVER_ONLY.has(to)) return false;
  if (TERMINAL.has(from)) return false;
  /* Any live conversation can be shut down for going off topic. */
  if (to === "closed") return true;
  return TRANSITIONS[from].includes(to);
}

/**
 * Applies a proposed move, or keeps the current phase.
 *
 * Never throws and never reports a refusal to the caller, because there is
 * nothing useful for a caller to do about one. A refused transition means the
 * model asked for something the flow does not allow; the reply it wrote is
 * still a perfectly good reply, and the visitor should read it rather than an
 * apology. The refusal is logged so it shows up as a prompt problem rather
 * than as a mystery.
 */
export function nextPhase(from: Phase, proposed: unknown): Phase {
  if (!isPhase(proposed)) return from;
  if (canMove(from, proposed)) return proposed;
  console.warn(`[quote-session] refused transition ${from} -> ${proposed}`);
  return from;
}

/* ------------------------------------------------------------ what is left */

/**
 * The facts a conversation has to have collected before an estimate is worth
 * asking a model to write.
 *
 * This is the gate on the estimate job, and it is checked against the stored
 * row rather than against anything the browser said. Missing any of these and
 * the estimate would be a model guessing, which is exactly the thing the
 * approval step downstream exists to catch - better not to generate it.
 */
export type SessionFacts = {
  phase: Phase;
  visitorKind: string | null;
  service: string | null;
  verifiedEmail: string | null;
  budget: string | null;
  timeline: string | null;
  fileCount: number;
};

/**
 * What is still missing, as field names. Empty means ready to estimate.
 *
 * Files are deliberately NOT required. The assistant asks for them and most
 * people will attach something, but a visitor who has described their project
 * clearly in the conversation and has no document to hand is still a lead
 * worth pricing. Refusing to estimate because nobody uploaded a PDF would turn
 * a nice-to-have into a wall.
 */
export function missingForEstimate(facts: SessionFacts): string[] {
  const missing: string[] = [];
  if (facts.visitorKind !== "lead") missing.push("visitor_kind");
  if (!facts.verifiedEmail) missing.push("verified_email");
  if (!facts.service) missing.push("service");
  if (!facts.budget) missing.push("budget");
  if (!facts.timeline) missing.push("timeline");
  return missing;
}

export function readyToEstimate(facts: SessionFacts) {
  return missingForEstimate(facts).length === 0;
}
