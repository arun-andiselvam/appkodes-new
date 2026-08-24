/**
 * The careers page.
 *
 * Built 25 August 2026, ahead of any real content for it. The listings
 * themselves come from Strapi (see lib/careers.ts) and there may be none
 * published yet, which the page has to handle honestly rather than with a
 * placeholder.
 *
 * !! NO BENEFITS LIST, NO CULTURE COPY, DELIBERATELY !!
 *
 * The obvious next section here is "why work with us": health cover, remote
 * policy, learning budget, the kind of thing every careers page has. None of
 * it is written, because none of it has been confirmed. content/contact.ts
 * set the rule this follows: "+91 98765 43210" and "your@email.com" were
 * placeholders on the live site and were not copied here even though they
 * would have been easy to invent convincingly. A perk this site claims and
 * a candidate cannot actually get is the same failure in a worse place, since
 * it is a promise made to someone about to change jobs over it.
 *
 * What is below is only what is already established elsewhere on the site:
 * heroStats in content/site.ts (18 years, 1000+ clients, 150+ team members,
 * 50+ countries), which are real figures rather than anything written new
 * for this page.
 */

export const careersCopy = {
  eyebrow: "Careers",
  headline: "Build the automation, not just sell it.",
  description:
    "Eighteen years in and a hundred and fifty people doing the work. The list below is every role open right now.",
} as const;

/**
 * Shown in place of the listing rows when careerListings() returns nothing.
 *
 * Same principle as the case study index's empty state and the blog
 * category pages': the page says so in one line instead of showing invented
 * openings.
 */
export const noOpenRolesCopy =
  "Nothing open right now. Write in through the contact page and say what you do, and it is read whether or not there is a live listing for it.";
