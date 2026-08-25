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

/*
 * Rewritten 25 August 2026, twice.
 *
 * !! DO NOT PASTE THE HOME PAGE'S STATS BLOCK IN HERE AGAIN !!
 *
 * The first attempt opened "Most AI projects never get past a demo" and
 * closed on eighteen years, a hundred and fifty people and fifty countries.
 * Every word of that is true and every word of it is already on the home
 * page, the contact page and half the service pages. The client's response
 * was that they were bored of reading the same content everywhere, and they
 * were right: a candidate weighing a job change was being handed the sales
 * deck.
 *
 * The rule that produced it was "only restate facts published elsewhere",
 * which is correct about claims and wrong about sentences. Not inventing a
 * benefit is honesty. Reusing the same four sentences on every page is
 * laziness wearing honesty's coat.
 *
 * So this speaks to one reader: an engineer in Tamil Nadu who assumes good
 * work means moving to Bangalore or Chennai. Madurai is the argument, not an
 * apology. The office being the workplace was confirmed by the client, and
 * "problems arrive from every continent" is the delivery reach in
 * content/delivery-map.ts said from the inside rather than as a figure.
 *
 * Still nothing invented: no salary, no benefits, no adjective about the
 * team. Supply those and they belong here. See the note at the top of this
 * file.
 */
export const careersCopy = {
  eyebrow: "Careers",
  headline: "The good work is not only in the metros.",
  description:
    "This is a Madurai company. The problems arrive from every continent. You will not have to leave home to build something thousands of people use.",
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
