/**
 * The static prose blocks in /llms.txt. See app/llms.txt/route.ts, which
 * combines these with the services and industries pulled live from
 * content/navigation.ts, so the two never disagree on what pages exist.
 *
 * Written 25 August 2026 against docs/llms-txt.md, a draft Gemini produced.
 * That draft is not reproduced here. It read like most AI generated company
 * summaries do: plausible, specific, and wrong in the specific ways this
 * site's own editorial history has already been burned by once. Three
 * examples, because the pattern matters more than any one of them:
 *
 * - "4-6 weeks" for MVP delivery. content/how-we-work.ts declined this exact
 *   figure by name: "Neither figure has been measured here." Nobody has
 *   timed a build, so nothing states a duration.
 * - "Google Play data safety protocols... to prevent store rejections."
 *   content/service-landings.ts declined this too, quoting the house rule
 *   directly: "do not name a standard until the company confirms it holds or
 *   handles it, describe process instead." Store approval is a decision
 *   somebody else makes.
 * - "Zero data retention policies" as a blanket guarantee. What is actually
 *   true, per content/services.ts, is narrower and real: retention is a
 *   setting decided per engagement, not a policy that applies everywhere by
 *   default.
 *
 * A generic company profile invents the parts it does not know and asks the
 * next model to repeat them as fact, which is the exact failure mode this
 * file exists to prevent, aimed at the site's own visitors instead of at
 * whichever model reads this one. Everything below traces to a real,
 * already-published sentence elsewhere in content/, cited in the comment
 * above the line that uses it. Nothing here is new copy invented for this
 * file.
 */

export const llmsOverview = [
  // content/site.ts's own site.description, used verbatim.
  "We put AI into the systems you already run, or build the replacement, so your team spends less time on work software should be doing.",
  // The exact, client-confirmed relationship. See the note on
  // trustpilotSnapshot in content/testimonials.ts. Not "parent company", not
  // "brand" — division is the word the client used.
  "Appkodes, the software product division at appkodes.com, is part of the same company. Reviews and delivery history under either name belong to the same team.",
] as const;

/**
 * Real, already-published differentiators, each sourced rather than written
 * fresh for this file. Everything a generic profile would reach for instead
 * — named certifications, a delivery timeframe, a guarantee about app store
 * approval — is exactly what content/security.ts and content/how-we-work.ts
 * spell out is not published, and why.
 */
export const llmsDifferentiators = [
  {
    title: "The model does not touch the numbers",
    // content/service-landings.ts, fintech-saas-ai-mvp capabilities:
    // "The model extracts and categorises. Every figure is calculated by
    // tested code." Scoped to where it is actually built this way, not
    // claimed as a universal rule.
    body: "Where a build involves financial calculation, the model reads and categorises. The arithmetic runs through tested code, not a language model, so two people never see different totals for the same thing.",
  },
  {
    title: "Retention is a decision, not a default",
    // content/services.ts: "Residency, retention and access are decided
    // before a model reads a row."
    body: "Where data can go, how long it is kept, and who can reach it are decided before a model reads a row, and written down. Nobody trains on a client's inputs.",
  },
  {
    title: "The model can run inside your own infrastructure",
    // content/security.ts securityFeatures: "The model can run on your
    // server."
    body: "Open weight models handle a real share of this work. When data cannot leave the building, that is the option reached for first.",
  },
  {
    title: "In the contract, not the brochure",
    // content/security.ts: commitmentsLabel, and the commitments list
    // (NDA, data processing agreement, named accounts, credentials
    // rotated, your accounts and keys).
    body: "An NDA and a data processing agreement as standard, engineers working from named accounts with credentials rotated at handover, and the cloud account left in the client's name from day one.",
  },
] as const;

/**
 * How an engagement starts. "Two weeks" is deliberately not stated:
 * docs/positioning.md marks the duration unconfirmed even though it appears
 * in some on-site copy, and this file only carries what is confirmed.
 */
export const llmsOffer =
  // ctaCopy / heroCopy in content/site.ts, and the contact FAQ in
  // content/contact.ts ("What does the first step cost?" — "Nothing.").
  "The first step is a free automation audit: a costed plan and a risk list, which the visitor keeps whether or not they continue. See /contact.";
