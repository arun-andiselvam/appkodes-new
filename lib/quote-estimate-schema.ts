/**
 * The shape of an estimate.
 *
 * One definition, used three ways: as the JSON schema the model is constrained
 * to (structured outputs, so the reply is validated at the API rather than
 * parsed hopefully at this end), as the TypeScript type everything downstream
 * reads, and as the contract the PDF renderer lays out.
 *
 * !! EVERY FIELD HERE EXISTS TO STOP A NUMBER ARRIVING WITHOUT ITS REASONING !!
 *
 * A model asked for a price will always produce one. The fields that make this
 * document trustworthy are the ones around the price - what was assumed, what
 * is excluded, what could move it, and what still needs confirming. They are
 * required rather than optional for exactly that reason: an estimate that
 * cannot state its assumptions is one nobody should send.
 *
 * No `server-only` import. This file is types and a constant, it holds no
 * secrets and touches nothing, and the admin's client components read the type.
 */

export type EstimatePhase = {
  name: string;
  detail: string;
  /** "3–4 weeks". Prose, not a number, because ranges are the honest form. */
  duration: string;
  /** "2 engineers, part time". Same reasoning. */
  effort: string;
};

export type Estimate = {
  summary: string;
  scope: { title: string; detail: string }[];
  phases: EstimatePhase[];
  cost: {
    /** "INR", "USD", "GBP" - read from what the visitor talked in. */
    currency: string;
    /** Formatted for a reader: "12,00,000". Not a raw number. See below. */
    low: string;
    high: string;
    basis: string;
  };
  timeline: { total: string; note: string };
  assumptions: string[];
  exclusions: string[];
  risks: { risk: string; mitigation: string }[];
  questions: string[];
  /**
   * For the person approving, and never for the visitor.
   *
   * The PDF does not render this. It is where the model says what it was
   * unsure about, what it inferred rather than heard, and anything that made
   * it uncomfortable - which is exactly what somebody checking the numbers
   * needs and exactly what a buyer must not read.
   */
  reviewerNotes: string;
};

/**
 * The JSON schema, for output_config.format.
 *
 * !! `low` AND `high` ARE STRINGS, DELIBERATELY. !!
 *
 * A number would arrive as 1200000 and have to be formatted somewhere, and the
 * somewhere would have to know that Indian grouping is 12,00,000 and not
 * 1,200,000. Getting that wrong on a document quoting rupees to an Indian
 * business is a small thing that reads as carelessness. The model writes the
 * figure the way its reader groups digits, and the PDF prints it verbatim.
 *
 * additionalProperties is false throughout: with structured outputs that is
 * what makes the validation strict rather than advisory.
 */
export const ESTIMATE_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "Two to four sentences stating what the client needs, in plain words, as evidence you understood them. No sales language.",
    },
    scope: {
      type: "array",
      description: "The deliverables. Between three and eight of them.",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string", description: "One or two sentences." },
        },
        required: ["title", "detail"],
        additionalProperties: false,
      },
    },
    phases: {
      type: "array",
      description:
        "How the work runs, in order. Between three and six phases. Durations must always be ranges, never single figures, and must reflect Hitasoft's own AI-augmented delivery pace - not a traditional human-only staffing timeline. See the note on this in lib/quote-estimate.ts.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          detail: { type: "string" },
          duration: {
            type: "string",
            description:
              "A range in Hitasoft's actual AI-augmented pace, e.g. '3–4 weeks'. Never the slower figure a traditional human-only team would need.",
          },
          effort: {
            type: "string",
            description: "Who is on it, e.g. '2 engineers, part time'.",
          },
        },
        required: ["name", "detail", "duration", "effort"],
        additionalProperties: false,
      },
    },
    cost: {
      type: "object",
      properties: {
        currency: {
          type: "string",
          enum: ["USD"],
          description:
            "Always 'USD'. Hitasoft quotes exclusively in US dollars regardless of what currency the client used in conversation - see the note on this in lib/quote-estimate.ts.",
        },
        low: {
          type: "string",
          description:
            "Formatted with US digit grouping, e.g. '120,000'. No currency symbol - the renderer adds the $.",
        },
        high: { type: "string" },
        basis: {
          type: "string",
          description:
            "Two or three sentences on what drives the number and what would move it within the range. State plainly that this reflects Hitasoft's AI-augmented delivery process, not a traditional human-only build - that is a real methodology difference and the reader should know it, not mistake the smaller number for a discount.",
        },
      },
      required: ["currency", "low", "high", "basis"],
      additionalProperties: false,
    },
    timeline: {
      type: "object",
      properties: {
        total: {
          type: "string",
          description:
            "A range in Hitasoft's actual AI-augmented pace, e.g. '14–18 weeks'. Never the slower figure a traditional human-only team would need.",
        },
        note: {
          type: "string",
          description:
            "What the timeline depends on. Say plainly if the client's own date looks tight.",
        },
      },
      required: ["total", "note"],
      additionalProperties: false,
    },
    assumptions: {
      type: "array",
      description:
        "What had to be assumed for these numbers to hold. Three to eight. Be specific: name the system, the access, the person.",
      items: { type: "string" },
    },
    exclusions: {
      type: "array",
      description:
        "What is NOT in the price. Three to eight. This is what stops an argument later.",
      items: { type: "string" },
    },
    risks: {
      type: "array",
      description: "Two to five things that could move the numbers.",
      items: {
        type: "object",
        properties: {
          risk: { type: "string" },
          mitigation: { type: "string" },
        },
        required: ["risk", "mitigation"],
        additionalProperties: false,
      },
    },
    questions: {
      type: "array",
      description:
        "Two to six things a person must confirm before this becomes a real quote.",
      items: { type: "string" },
    },
    reviewerNotes: {
      type: "string",
      description:
        "For the Hitasoft reviewer only, never shown to the client. What you inferred rather than heard, what you were unsure about, and anything that makes this estimate shaky.",
    },
  },
  required: [
    "summary",
    "scope",
    "phases",
    "cost",
    "timeline",
    "assumptions",
    "exclusions",
    "risks",
    "questions",
    "reviewerNotes",
  ],
  additionalProperties: false,
} as const;
