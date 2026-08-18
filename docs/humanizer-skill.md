---
name: humanizer
description: Rewrites AI-generated Markdown so it reads as natural, human-written text — removes AI "tells" (em-dashes, gerund openers, banned corporate words, repeated descriptors, flat robotic endings, uniform sentence rhythm) through a 3-pass process. Use whenever the user asks to "humanize this," "make this sound less AI-written," "remove AI patterns," "make this pass an AI detector," or after drafting content that reads stiff, listy, or robotic and needs a natural editorial pass before publishing.
metadata:
  version: 1.0.0
  source: extracted from server/src/claude/humanize.ts (AI Content Writer project)
---

# Content Humanizer

Rewrite AI-generated Markdown so it reads like a person wrote it: varied rhythm, no corporate tics, no repeated words, no dead-flat endings. Run this as **three passes** in order — a full rewrite, a surgical fix-up, then deterministic (non-LLM) cleanup. Never skip straight to output after pass 1; the tells that survive a full rewrite are exactly what pass 2 and pass 3 exist to catch.

## When to use

- The user explicitly asks to humanize, de-AI-ify, or "make this sound natural" for a piece of Markdown content.
- Content was just AI-generated (by you or another tool) and is about to be published, and the user wants it edited for natural human tone before that happens.
- Do **not** use this on code, data, structured configs, or anything where the "AI-generated" framing doesn't apply to prose.

## Inputs

- A Markdown article (or section). Preserve its structure — this skill only changes *how the sentences are written*, never the facts, links, or information architecture.
- Optional: a list of target keywords that must be preserved verbatim and spread evenly rather than clustered.
- Optional: a list of project-specific protected phrases (fixed terms that must never be reworded — see Pass 3) and domain nouns exempt from the descriptor-repetition rule.

---

## Pass 1 — Full rewrite

Apply every rule below in one pass across the whole article, then self-check your own output before moving on (scan for dashes, semicolons, gerund starts, banned words, repeated descriptors, flat endings, 3+ item inline lists, gap-zone sentences — fix anything you find).

**Rewrite rules:**

1. **No dashes.** Remove every em dash (—) or en dash (–). Replace with a comma, a rephrase, or a full stop and a new sentence.
2. **Sentence-length rhythm.** Alternate length throughout: short sentences 8-10 words, long sentences 15-25 words, roughly 70% short / 30% long. Never write an 11-14 word sentence (the "gap zone"). Never go under 7 or over 25 words.
3. **Tone.** Conversational and personal. Never preachy or salesy.
4. **Keyword spread.** Spread any target keywords evenly across sections rather than clustering them.
5. **Curly quotes.** Use " " ' ' instead of straight quotes.
6. **Paragraph-count variation.** Vary paragraph counts across parallel/similar subsections so they aren't all the same length — rotate roughly 2, then 3, then 4 paragraphs across consecutive similar sections.
7. **Banned words** — never use these, rewrite the sentence instead: *remain, remains, remaining, especially, particularly, may, can, leverage, comprehensive, remarkably, furthermore, moreover, additionally, utilize, utilise.* (e.g. leverage → use; comprehensive → full/detailed; remarkably → unusually/notably; "can earn" → earn; "may help" → helps.)
8. **No gerund openers.** Never start a sentence with an -ing word (Setting, Buying, Understanding, Owning, Building, Creating...). Restructure instead — e.g. "Setting up a wallet..." → "Your first step is a wallet setup...".
9. **No unsupported buzzwords.** Remove unless backed by a specific stat: *cutting-edge, innovative, advanced technology, leverage, game-changer, harness, empower, seamlessly, revolutionise.*
10. **No clichés.** Remove: "In today's world", "Needless to say", "It's no secret that", and similar stock openers.
11. **No rhetorical questions.** Remove rhetorical questions and "not just...but also" connectors. Never open or close a section with a question.
12. **One idea per sentence.** No semicolons anywhere (split into two sentences). Never join two actions with "and" (split into two sentences). Never use a colon to introduce an inline list (restructure as separate sentences).
13. **Natural variation.** Add real variation in flow and rhythm, not mechanical repetition of a template.
14. **Preserve lists.** Keep every Markdown list (-, *, or numbered) exactly as a list. Reword item text if needed, but never flatten a list into prose and never drop items.
15. **Cut inline series to two.** Any inline comma-separated series of 3+ items in prose (not inside a markdown list) must be cut to exactly 2 items joined by "and"/"or" — drop the least important one(s). Same treatment for three consecutive sentences that each describe one option in a row.
16. **End sections forward-looking.** Every section/subsection must end with an action-oriented sentence (what to do or try next) — never end on a flat, static fact.
17. **No repeated descriptors.** No adjective or adverb may appear more than once in the entire article. Replace the 2nd/3rd occurrence with a fresh synonym (and don't reuse that synonym either). Exempt core domain/product nouns (define these per-project — see Pass 3 reference list) and fixed phrases (e.g. "strong password", "real money", "real-world", "mobile-first" — also project-specific, see Pass 3).
18. **No hedge-and-pivot constructions.** Remove "X is not just A, it's also B" and "From A to B, ..." patterns.

**Protective rules — never violate these no matter what a style rule above suggests:**

- Preserve **all** Markdown structure exactly: headings (#, ##, ###), lists, tables, links, images, blockquotes, bold/italic emphasis.
- Preserve **all** links exactly: same `[text](url)`, same URL.
- Preserve **all** target keyword placements — never remove or reword an exact target keyword phrase.

Output only the rewritten Markdown. No preamble, no explanation, no code fences.

---

## Pass 2 — Surgical revision

This is a light pass over the Pass 1 output. Do **not** rewrite freely — make only these five fixes and leave everything else untouched:

1. **Descriptor repeats.** If any adjective/adverb appears 2+ times, replace the extra occurrences with a fresh, not-yet-used synonym.
2. **Paragraph variation.** If consecutive similar sections all have the same paragraph count, merge or split paragraphs in some of them so the counts differ.
3. **Sentence length.** Fix any remaining 11-14 word sentences (cut to 8-10 or expand to 15-25). Merge sentences under 7 words with a neighbor. Split sentences over 25 words.
4. **Gerund openers.** Fix any sentence still starting with an -ing word.
5. **Flat endings.** If the last sentence of any section is a flat fact with no forward action, rewrite it to include one.

Do not change meaning, tone, Markdown structure, links, or keyword placements. Output only the revised Markdown, no preamble, no code fences.

---

## Pass 3 — Deterministic cleanup (mechanical, apply without an LLM rewrite)

Run these as literal text operations over the Pass 2 output, skipping the inside of fenced/inline code spans and link URLs — never touch text inside backticks or inside a `[...]( ... )` URL.

1. **Strip any remaining dashes.** Replace any em/en dash with `. ` (a full stop plus space), then collapse any resulting `. .` into `.`.
2. **Strip any remaining semicolons.** Replace `;` (plus trailing space) with `. `.
3. **Descriptor dedup.** For each synonym group below, walk the article in document order. The **first** occurrence of any word in a group is left as-is. Every occurrence after that is replaced with the next not-yet-used synonym from that same group (cycling through the group in order, never reusing a synonym already placed). Do this per group, one full pass over the article per group, so earlier substitutions in a group can't be re-matched and cascaded by a later pass. Skip any match that falls inside a protected phrase (see below) — check the ~20 characters of surrounding context for a protected phrase before substituting.

### Reference: default descriptor synonym groups

Each word belongs to exactly one group (a word must never appear in two groups — that lets a substitution from one group get re-matched and cascaded into the wrong group). Treat this list as a *starting template*: extend or trim it per project/domain.

```
multiple, several, numerous, many, a handful of
various, different, diverse, assorted, varied, mixed
distinct, separate, individual, discrete
accessible, approachable, beginner-friendly, welcoming
strategic, calculated, deliberate, planned
valuable, worthwhile, useful, beneficial
competitive, rivalrous, contested
powerful, formidable, potent, robust
hefty, sizeable, substantial, considerable
ideal, fitting, well-suited, suitable, apt
rare, uncommon, scarce
regular, frequent, recurring, routine
transparent, clear, straightforward
genuine, authentic, verifiable
immersive, engaging, absorbing
official, authorized, sanctioned
traditional, conventional, established
popular, well-known, favored, recognized
simple, uncomplicated, easy
dedicated, committed, devoted, loyal
one-of-a-kind, unique, singular, unmatched
limited, modest, restricted, capped
initial, starting, opening
basic, foundational, entry-level
```

Note: "first" as an adverb is treated as a protected fixed phrase, not part of a synonym group — never swap it out.

### Reference: default protected fixed phrases

Never reword text inside these phrases, even if a word inside them matches a descriptor group above:

```
strong password, real money, real estate, real-world, real value,
mobile-first, true ownership, open rewards, open world
```

Replace this list per project — it should reflect the fixed terms and brand phrases specific to whatever site/product the content is for.

### Reference: default exempt domain nouns (rule 17)

The no-repeat-descriptor rule (Pass 1, rule 17) exempts core domain/product nouns from being treated as "descriptors" at all, since a product name or category noun legitimately repeats. Default example set: `virtual, digital, mobile, free, in-game, blockchain, NFT`. Replace this with whatever nouns are core vocabulary for the current project's domain (e.g. for a SaaS product: the product name, "dashboard", "workspace"; for a finance site: "APR", "credit score").

---

## Self-check before returning final output

- No em/en dashes or semicolons anywhere.
- No sentence opens with a gerund.
- None of the banned words (rule 7) or unsupported buzzwords (rule 9) survive.
- No adjective/adverb (outside the exempt noun list) appears more than once.
- Every section ends on a forward-looking, action sentence — not a flat fact.
- No 11-14 word sentences remain; nothing under 7 or over 25 words.
- No inline comma series has 3+ items; no section opens or closes on a question.
- All Markdown structure, links, and target keyword placements are untouched from the original.

## Output

Return only the final rewritten Markdown — no preamble, no explanation, no meta-commentary about what was changed, no code fences wrapping the whole article.