/**
 * How long we tell people the work takes.
 *
 * !! THESE ARE THE ONLY DURATIONS THE ASSISTANT MAY EVER SAY !!
 *
 * The model does not estimate. It looks a band up in this table and reads it
 * back, and its system prompt forbids any duration that is not on this page.
 * That is the whole reason the table exists: a language model asked "how long
 * would this take" will produce a confident number every single time, and that
 * number would be a commitment nobody at this company had agreed to.
 *
 * !! THIS FILE CROSSES A LINE THE STRATEGY DOC DREW ON PURPOSE !!
 *
 * docs/hitasoft_ai_architecture_strategy.md, section 5, lists "6 - 12 Months"
 * among the figures rejected from the service pages, on the grounds that it is
 * a guess about somebody else's project. That reasoning still holds for a
 * page. It was overridden for the assistant on 27 August 2026 because a
 * visitor who asks how long something takes and is told "it depends" leaves,
 * and because these ranges are deliberately padded rather than optimistic.
 *
 * If these ever move onto a page, section 5 has to be updated in the same
 * change. A figure that is fine in a conversation and a figure that is fine in
 * published copy are not the same figure.
 *
 * !! PAD THESE. DO NOT SHARPEN THEM. !!
 *
 * The ranges below are the comfortable case, not the fast one. The upper bound
 * is what we would be happy to be held to on a week where things go wrong, and
 * the lower bound is still not a promise. Nobody has ever been unhappy that a
 * project landed early. Every review of this file should be asking whether the
 * top of each range is high enough, never whether it could come down.
 */

export type DeliveryEstimate = {
  /** Matches an `intent` option value in content/quote-flow.ts. */
  label: string;
  /** Written out, because "6-10" reads as a phone number in a chat bubble. */
  range: string;
};

export const deliveryEstimates: Record<string, DeliveryEstimate> = {
  integrate: {
    label: "Adding AI to software that already runs",
    range: "eight to fourteen weeks",
  },
  automate: {
    label: "Automating a workflow a team repeats",
    range: "ten to sixteen weeks",
  },
  build: {
    label: "An AI product built from scratch",
    range: "sixteen to twenty-six weeks",
  },
  /** The fallback, and the widest, because it covers everything unasked. */
  other: {
    label: "Most of what we take on",
    range: "ten to twenty weeks",
  },
};

/**
 * Said with every range, without exception.
 *
 * Not a disclaimer bolted on to cover us. It is the honest shape of the
 * answer: the number depends on what the scoping finds, and saying so is what
 * makes the number worth anything.
 */
export const estimateCaveat =
  "That is the range we would plan against before anyone has looked at your systems. The two week review is what turns it into a date.";

/**
 * What the assistant says when the question is one this table cannot answer -
 * a duration for something outside the four bands, or a date, or a "can you do
 * it by Friday".
 */
export const estimateRefusal =
  "I would be guessing, and a guess about a deadline is worth less than nothing. Send the brief through and you will get a real answer from the person who would run it.";
