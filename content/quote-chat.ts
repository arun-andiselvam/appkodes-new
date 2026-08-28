/**
 * What QuoteBot shows a visitor.
 *
 * Same rule as content/quote-flow.ts, which this sits beside: the components
 * render this object and hold no sentences of their own.
 *
 * !! WHAT THE MODEL IS TOLD LIVES IN lib/quote-objectives.ts, NOT HERE. !!
 *
 * The two started in this file, because they are the same decision - what this
 * thing is doing and what it sounds like doing it. They were split when the
 * chat window began importing this module: the objectives are about nine
 * kilobytes of instruction, including everything the assistant is told never
 * to say, and bundling that into the browser would ship the playbook to every
 * visitor. The rule that fell out of it is worth keeping:
 *
 *   content/ holds sentences a visitor may read.
 *   lib/     holds sentences only the model may read.
 *
 * `verificationPoints` below is the one exception and it is deliberate - it is
 * imported by the objectives rather than rendered, and it lives here because
 * it is a promise made to a visitor, which is a content decision.
 *
 * !! THIS FILE REVERSES A DELIBERATE DECISION. THAT IS INTENTIONAL. !!
 *
 * content/quote-flow.ts opens with "No greeting. Somebody who has just clicked
 * a button saying quote does not need to be welcomed, and 'Hi! How can I
 * help?' is the opening of a support widget, which this is not." That was
 * right for a scripted form whose first screen was a qualifying question.
 *
 * The client asked on 27 August 2026 for a real assistant that opens by
 * introducing itself and saying what it can do. That is a different product,
 * and the old reasoning does not carry over: an empty chat box with a cursor
 * in it tells a visitor nothing about what they are allowed to ask. The
 * greeting below earns its place by doing a job the scripted first screen did
 * structurally - it says what this is for, and it asks the question that
 * decides which of the two branches somebody is on.
 *
 * !! QUOTEBOT NEVER STATES A PRICE, AND THAT HAS NOT CHANGED !!
 *
 * It collects a budget, it promises an estimate, and a person approves that
 * estimate before it is sent. Nothing in this conversation quotes a figure,
 * says a budget is too small, or prices work back to somebody in the chat
 * window. The prohibition in content/quote-flow.ts is older than this file and
 * outranks it.
 */

/* -------------------------------------------------------------- the opening */

export const botName = "QuoteBot";

/**
 * What the visitor sees the moment the window opens, before they type.
 *
 * Written to be read in about four seconds. It says what it is, what it can
 * do, and what it needs to know first - in that order, because a question
 * asked before the reader knows who is asking gets ignored.
 *
 * Deliberately two short paragraphs rather than one block. The first is the
 * introduction and the second is the question, so the thing being asked is
 * not buried in the middle of a sentence about capability.
 */
export const greeting = {
  /* Sits above the message, in the window's header. */
  title: "QuoteBot",
  subtitle: "Hitasoft's estimating assistant",

  /*
   * Sent as the assistant's first turn. It is written here rather than
   * generated, so it is the same every time, costs nothing, and appears
   * instantly instead of streaming in while somebody waits to find out what
   * they have opened.
   */
  message: [
    "Hello — I'm QuoteBot, Hitasoft's estimating assistant. I can answer questions about the work we do, take down what you're trying to build, and put together a written estimate with costs and timings that lands in your inbox as a PDF.",
    "First though — are you here about a project, or are you a student or job seeker? The two go to completely different places, and I'd rather send you to the right one.",
  ],

  /*
   * Offered as buttons under the greeting. Somebody who taps rather than types
   * gets through the fork in one action, and the model still handles anybody
   * who answers in prose instead.
   */
  choices: [
    { value: "lead", label: "I have a project" },
    { value: "student", label: "I'm a student or job seeker" },
  ],
} as const;

/* ------------------------------------------------------------- the services */

/**
 * What somebody picks from, once they have said they are a buyer.
 *
 * The five parent silos from content/services.ts, and nothing below them. The
 * nineteen child pages are the right depth for a navigation menu and the wrong
 * depth for a chat window - a visitor who has to choose between "Rapid AI
 * prototyping" and "Custom AI MVP development" before they have described
 * anything is being asked to do our classification for us.
 *
 * `value` is what gets stored and must stay stable even when the label is
 * rewritten, matching the rule on QuoteOption in content/quote-flow.ts.
 */
export const serviceOptions = [
  {
    value: "integration",
    label: "Add AI to software we already run",
    /* Kept so the assistant can talk about the silo without inventing one. */
    silo: "AI software integration",
  },
  {
    value: "automation",
    label: "Automate work my team repeats",
    silo: "AI workflow automation",
  },
  {
    value: "mvp",
    label: "Build a new AI product",
    silo: "Custom AI MVP development",
  },
  {
    value: "analytics",
    label: "Get predictions out of our data",
    silo: "AI data & predictive analytics",
  },
  {
    value: "models",
    label: "Our own model, or AI voice calls",
    silo: "Custom AI models & voice",
  },
  /*
   * The escape hatch, never removed, same as the scripted flow's.
   *
   * Picking it does not shorten the conversation - it lengthens it. The
   * assistant opens the requirement phase with a real question instead of
   * assuming the silo, which is the point: the interesting projects are the
   * ones that did not fit five buttons.
   */
  {
    value: "other",
    label: "Something else",
    silo: null,
  },
] as const;

/* --------------------------------------------------------------- the budget */

/**
 * What somebody picks from when asked about budget.
 *
 * "We had this before" - on the client's instruction of 28 August 2026, this
 * is deliberately the same five ranges and the same "I have no idea" as the
 * scripted flow's own budget step. See `budget` in content/quote-flow.ts,
 * which is the older, original copy of this list.
 *
 * !! A SECOND LITERAL ARRAY, NOT AN IMPORT - AND THAT IS DELIBERATE. !!
 *
 * quoteSteps.budget in content/quote-flow.ts is typed as part of that flow's
 * graph: its options carry a `next` step id, which means nothing here, and
 * `quoteSteps` is keyed as a plain Record, so TypeScript only knows any one
 * entry as the general QuoteStep union - reaching `.options` off it would
 * need a cast to narrow it back to the "choice" variant, for a saving of five
 * short strings. Retyping them is the smaller cost. If these ranges ever
 * change, change them in both files - one set of numbers, asked the same way
 * in two different flows.
 */
export const budgetOptions = [
  { value: "under-2k", label: "Under $2,000" },
  { value: "2k-10k", label: "$2,000 to $10,000" },
  { value: "10k-50k", label: "$10,000 to $50,000" },
  { value: "50k-250k", label: "$50,000 to $250,000" },
  { value: "250k-plus", label: "More than $250,000" },
  { value: "unsure", label: "I have no idea" },
] as const;

/* ------------------------------------------------------------ the verification */

/**
 * The three things the assistant must say when it asks for an email address.
 *
 * Not rendered - these go into the prompt for the `verify` phase, phrased
 * however the conversation needs them. They are written as separate items
 * because each does a different job and dropping any one of them changes the
 * answer somebody gives:
 *
 *   1. Where the estimate is going. Without this the request reads as data
 *      collection. With it, the address is the delivery address for something
 *      they want, which is a completely different question.
 *   2. Why a code is needed. Nobody objects to a lead qualification step once
 *      it is named as one; they object to being asked to jump through a hoop
 *      whose purpose is not explained.
 *   3. WhatsApp, and only as a speed-up.
 *
 * !! THE WHATSAPP NUMBER IS OPTIONAL AND MUST BE OFFERED AS OPTIONAL !!
 *
 * Added on the client's instruction of 27 August 2026. It is a genuine
 * accelerator - a question about an ambiguous requirement answered in an hour
 * beats one that waits a day for an email reply - and that is the reason to
 * give, rather than dressing a second contact field up as a requirement.
 * Nothing downstream may block on it; scripts/quote-schema.sql says the same
 * on the column itself.
 */
export const verificationPoints = [
  "The estimate is a PDF and it goes to this address, so it needs to be one that works.",
  "The code is how we know an estimate is worth writing. Working one up takes real time, and we only spend it on enquiries that are actually reachable.",
  "A WhatsApp number is optional and speeds things up — if something in the requirement is ambiguous, an answer in an hour beats one that waits a day for email.",
] as const;
