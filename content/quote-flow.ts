/**
 * The quote assistant's script.
 *
 * Every word the modal says lives here, same as every other piece of copy on
 * this site. The components render this object; they hold no sentences of
 * their own.
 *
 * !! THE MODAL NEVER STATES A PRICE !!
 *
 * It asks what the budget is and it records the answer. It does not say what
 * anything costs, does not tell a visitor their budget is too small, and does
 * not price the work back to them. Every enquiry reaches the inbox whatever
 * band was picked, and who is worth a reply is decided by a person reading it.
 *
 * The flow is a graph, not a list. Each answer names the step it leads to, so
 * a branch is a piece of data rather than a condition buried in a component.
 * `stage` is what the progress rail reads, and several steps share a stage
 * because they are the same question asked of different people.
 *
 * Order matters and is not arbitrary. The brief comes before the budget on
 * purpose: somebody who has just described their problem in their own words
 * has invested something, and answers the money question. Asked cold at step
 * two, it reads as a filter and they close the tab.
 */

export type QuoteOption = {
  /**
   * What gets stored on the lead and printed in the notification. Keep these
   * stable even when the label is rewritten - an inbox full of old enquiries
   * should not stop making sense because the copy improved.
   */
  value: string;
  label: string;
  /** The step this answer leads to. */
  next: string;
};

type StepBase = {
  id: string;
  /** 1 to QUOTE_STAGES. Drives the progress rail, and is not the same as depth. */
  stage: number;
  /** The question, set as the heading. */
  ask: string;
  /** One line under it. */
  hint?: string;
};

export type QuoteStep =
  | (StepBase & {
      kind: "choice";
      /** Row label in the recap and in the notification email. */
      field: string;
      options: QuoteOption[];
    })
  | (StepBase & {
      kind: "brief";
      field: string;
      placeholder: string;
      next: string;
    })
  | (StepBase & { kind: "details" });

export const QUOTE_STAGES = 6;

export const firstStepId = "intent";

/**
 * The assistant, addressed as if it were a step.
 *
 * It is not one - there is no entry for it in `quoteSteps`, because it asks no
 * question of its own and occupies no stage on the rail. Naming it here lets
 * an answer point at it the same way it points at anything else, so the script
 * stays a plain graph and the modal is the only file that knows the assistant
 * is a different kind of thing.
 *
 * Where it returns to is decided when it is entered, not here. It is a detour
 * from wherever somebody happened to be standing.
 */
export const ASK_STEP_ID = "ask";

/** Offered on every scripted step, once the assistant is known to be reachable. */
export const askInvite = "Rather just ask a question?";

/**
 * What the call to action says, in one place.
 *
 * Two words rather than four. "Get a free quote" was the whole sentence, and a
 * button in a header has no room for a sentence - at the scrolled size it sets
 * at 12px and ran nearly the width of the menu beside it. The verb was doing
 * no work either, since pressing a button is already the verb.
 *
 * It lives here so the site wide rename is an edit to one line rather than to
 * nine components, and so this label and the modal's own title cannot drift
 * apart - a button that says one thing and opens something calling itself
 * another is a small betrayal of the click.
 */
export const quoteCtaLabel = "Free quote";

export const quoteSteps: Record<string, QuoteStep> = {
  /* ------------------------------- Stage 1 ------------------------------ */

  /*
   * No greeting. Somebody who has just clicked a button saying "quote" does
   * not need to be welcomed, and "Hi! How can I help?" is the opening of a
   * support widget, which this is not. The first thing on screen is the
   * question that qualifies.
   */
  intent: {
    kind: "choice",
    id: "intent",
    stage: 1,
    field: "Goal",
    ask: "What are you trying to do?",
    hint: "A few questions, then we write back with what we would build.",
    options: [
      {
        value: "integrate",
        label: "Add AI to software we already run",
        next: "context-integrate",
      },
      {
        value: "automate",
        label: "Automate work my team repeats",
        next: "context-automate",
      },
      {
        value: "build",
        label: "Build an AI product from scratch",
        next: "context-build",
      },
      /*
       * The escape hatch, and it is never removed.
       *
       * It opens the assistant, which is the one part of this modal that talks
       * to a model. With ANTHROPIC_API_KEY unset the modal resolves this to
       * the brief step instead - the same fallback-rather-than-wall pattern
       * the contact route uses for Turnstile and the webhook. Somebody whose
       * situation does not fit three buttons always has a way through, whether
       * or not the model is reachable.
       */
      {
        value: "other",
        label: "Something else - let me ask",
        next: ASK_STEP_ID,
      },
    ],
  },

  /* ------------------------------- Stage 2 ------------------------------ */
  /*
   * One question per branch, still a tap. This is what lets the first reply be
   * an actual answer rather than "tell us more", which is the whole reason
   * this exists instead of a mailto link.
   */

  "context-integrate": {
    kind: "choice",
    id: "context-integrate",
    stage: 2,
    field: "Runs on",
    ask: "What is it built on?",
    options: [
      { value: "web", label: "A web app or SaaS platform", next: "brief" },
      { value: "mobile", label: "A mobile app", next: "brief" },
      { value: "internal", label: "Internal tools and spreadsheets", next: "brief" },
      { value: "unsure", label: "Not sure - someone else built it", next: "brief" },
    ],
  },

  "context-automate": {
    kind: "choice",
    id: "context-automate",
    stage: 2,
    field: "The work",
    ask: "Which work eats the most time?",
    options: [
      { value: "support", label: "Answering customers", next: "brief" },
      { value: "documents", label: "Documents and invoices", next: "brief" },
      { value: "finance", label: "Finance and reporting", next: "brief" },
      { value: "other", label: "Something else", next: "brief" },
    ],
  },

  "context-build": {
    kind: "choice",
    id: "context-build",
    stage: 2,
    field: "Stage",
    ask: "How far along is it?",
    options: [
      { value: "idea", label: "Just an idea", next: "brief" },
      { value: "spec", label: "A spec is written", next: "brief" },
      { value: "prototype", label: "A prototype exists", next: "brief" },
    ],
  },

  /* ------------------------------- Stage 3 ------------------------------ */

  /*
   * The one step that asks for real effort, and the only one that can be
   * answered two ways: type a few lines, or attach the document that already
   * says it. Somebody who has written a spec should not have to summarise it
   * into a textarea to talk to us.
   *
   * Kept as a gate rather than a skip. Everything after it - the budget
   * especially - is worth more when there is a brief behind it, and a lead
   * with no description of the work is a lead somebody has to chase before
   * they can answer it. See BRIEF_MIN_CHARS in the component for the bar.
   */
  brief: {
    kind: "brief",
    id: "brief",
    stage: 3,
    field: "The brief",
    ask: "Tell us what you need.",
    hint: "A few lines is plenty. If you already have a document, attach it instead.",
    placeholder:
      "We lose about three days a month reconciling supplier invoices by hand, and the team has grown past the point where that is sustainable.",
    next: "budget",
  },

  /* ------------------------------- Stage 4 ------------------------------ */

  /*
   * Asked, never answered.
   *
   * The bands are wide on purpose. A narrow ladder makes somebody feel
   * measured; a wide one lets them place themselves without much thought,
   * which is all this needs to do. Nothing here tells the visitor what any of
   * it buys, because the moment the modal says that, it has published a price.
   */
  budget: {
    kind: "choice",
    id: "budget",
    stage: 4,
    field: "Budget",
    ask: "What budget do you have in mind?",
    hint: "In US dollars. A range is fine - it shapes what we propose.",
    options: [
      { value: "under-2k", label: "Under $2,000", next: "timing" },
      { value: "2k-10k", label: "$2,000 to $10,000", next: "timing" },
      { value: "10k-50k", label: "$10,000 to $50,000", next: "timing" },
      { value: "50k-250k", label: "$50,000 to $250,000", next: "timing" },
      { value: "250k-plus", label: "More than $250,000", next: "timing" },
      { value: "unsure", label: "I have no idea", next: "budget-nudge" },
    ],
  },

  /*
   * Where "I have no idea" goes, and it asks once more rather than letting it
   * drop. A lead with no band at all is the one the sales conversation has to
   * open on, which is the worst place to open it.
   *
   * It asks again without offering guidance, because guidance here would mean
   * telling somebody what their project should cost - which is the thing this
   * modal does not do. "Rather not say" is a real answer and is recorded as
   * one.
   */
  "budget-nudge": {
    kind: "choice",
    id: "budget-nudge",
    stage: 4,
    field: "Budget",
    ask: "A ceiling, then - even a rough one.",
    hint: "It changes what we propose, not whether we answer.",
    options: [
      { value: "under-2k", label: "Under $2,000", next: "timing" },
      { value: "2k-10k", label: "$2,000 to $10,000", next: "timing" },
      { value: "10k-50k", label: "$10,000 to $50,000", next: "timing" },
      { value: "50k-250k", label: "$50,000 to $250,000", next: "timing" },
      { value: "250k-plus", label: "More than $250,000", next: "timing" },
      { value: "withheld", label: "Rather not say", next: "timing" },
    ],
  },

  /* ------------------------------- Stage 5 ------------------------------ */

  timing: {
    kind: "choice",
    id: "timing",
    stage: 5,
    field: "Timing",
    ask: "When would you want it live?",
    options: [
      { value: "deadline", label: "There is a date it has to be done by", next: "details" },
      { value: "asap", label: "As soon as it can be", next: "details" },
      { value: "year", label: "Sometime this year", next: "details" },
      { value: "exploring", label: "Still exploring", next: "details" },
    ],
  },

  /* ------------------------------- Stage 6 ------------------------------ */

  details: {
    kind: "details",
    id: "details",
    stage: 6,
    ask: "Where should this go?",
    hint: "One reply, written by a person. Not a sequence, and not a calendar invite.",
  },
};

/** Copy the shell owns, rather than any one step. */
export const quoteChrome = {
  title: "Free quote",
  /** Read out when the dialog opens. */
  description:
    "A short set of questions about what you are trying to build, ending with somewhere to send the reply.",
  recapTitle: "Here is what we have",
  namePlaceholder: "Your name",
  emailPlaceholder: "Work email",
  submit: "Send this",
  submitting: "Sending",
  continue: "Continue",
  /* The attachment control on the brief step. */
  attach: "Attach a document",
  attachHint: "PDF, Word or plain text. Up to 8MB.",
  attachReplace: "Replace",
  attachRemove: "Remove",
  /* Shown once the enquiry is away. */
  sentTitle: "That is with us.",
  sentBody:
    "We read it against what you have told us and write back with what we would build, and what we would not.",
  sentClose: "Close",
} as const;

/**
 * What the attachment control will accept.
 *
 * !! 8MB, AND THE CEILING IS NOT OURS TO RAISE MUCH !!
 *
 * proxy.ts means every request to this origin has its body cloned and buffered
 * in memory so both the proxy and the route handler can read it. Next caps
 * that buffer at 10MB by default, and a body over the cap is silently
 * truncated with a warning in the server log rather than rejected - which
 * would look, from the browser, like an upload that worked and an attachment
 * that vanished. 8MB leaves room for the multipart overhead and the rest of
 * the form underneath it.
 */
export const ATTACHMENT = {
  maxBytes: 8 * 1024 * 1024,
  accept: ".pdf,.doc,.docx,.txt,.md,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/rtf",
  /** Checked server side too. The client list is a convenience, not a control. */
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/rtf",
  ],
} as const;
