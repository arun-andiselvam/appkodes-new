import { errors } from "@strapi/utils";

import { checkPost, errorReport, type PostInput } from "../../../../utils/editorial";

/**
 * The gate. Nothing that breaks the house standards gets saved.
 *
 * !! ENFORCEMENT IS OFF. THE GATE LOGS AND LETS EVERYTHING THROUGH !!
 *
 * Turned off on 25 August 2026 at the client's request, so an external
 * content tool can publish AI written articles into this collection. Its
 * first attempt broke 71 rules at once, which is not the tool being unusual:
 * generated prose sits in the 11 to 14 word dead band constantly, and a
 * generated title is written for a human rather than for a 49 character
 * budget.
 *
 * !! WHAT THIS COSTS, SO THE NEXT PERSON DOES NOT HAVE TO REDISCOVER IT !!
 *
 * These rules were not style preferences. Each came from a document in this
 * repository and each catches a specific, checkable failure:
 *
 * - Title over 49 characters is truncated in Google, because app/layout.tsx
 *   appends " - Hitasoft" and the cut is at 60.
 * - Excerpt outside 150 to 160 is a meta description that either wastes the
 *   space or gets cut mid sentence. It is the text a searcher reads before
 *   deciding whether to click.
 * - Banned vocabulary, "enterprise" chief among it, is barred by
 *   docs/positioning.md because this site sells to a 40 person company.
 * - Sentences over 25 words, and the 11 to 14 dead band, are the house voice
 *   in docs/positioning.md.
 *
 * None of that is enforced now. A post can go out with a title Google cuts,
 * a meta description that reads as truncated, and vocabulary the positioning
 * document spent a page arguing against, and nothing will stop it.
 *
 * Every issue is still written to the Strapi log at warn level, so the record
 * of what went out over the standard survives even though the save does not
 * fail. Grep the CMS logs for "[editorial]".
 *
 * !! TO TURN IT BACK ON, SET THIS TO true. THAT IS THE WHOLE CHANGE !!
 *
 * The rules themselves are untouched in src/utils/editorial.ts, along with
 * the reasoning behind each one. Nothing was deleted. If the generated
 * content ever needs to meet the same bar as the hand written pages, this is
 * a one line change rather than a rewrite.
 *
 * A softer middle option exists and was offered: DEAD_BAND_SEVERITY in
 * editorial.ts flips the single noisiest rule to a warning while the title,
 * excerpt, banned word and 25 word checks keep blocking. That would have
 * cleared most of the 71 without giving up the checks that protect how the
 * site looks in a search result.
 */
const ENFORCE_EDITORIAL = false;

/**
 * All the rules live in src/utils/editorial.ts, which imports nothing from
 * Strapi so it can be run against a fixture. This file is only glue.
 *
 * !! WARNINGS ARE LOGGED, NOT THROWN !!
 *
 * Two checks are advisory: a hero image with no alt text, and fewer than two
 * contextual links. Both are usually wrong and occasionally deliberate, and a
 * gate that blocks a legitimate case teaches people to work around the gate.
 * Everything else is an error, when enforcement is on.
 */

type Event = {
  params: {
    data?: PostInput & { publishedAt?: string | null };
    where?: Record<string, unknown>;
  };
};

/**
 * On publish, check the whole document rather than the changed fields.
 *
 * Strapi sends only what changed on an update, which is right for editing and
 * wrong for publishing. Somebody who wrote a bad excerpt on Monday and fixes a
 * typo on Friday would otherwise publish the bad excerpt, because the excerpt
 * is not in Friday's payload.
 *
 * So when `publishedAt` is being set, the stored entry is loaded and merged
 * under the incoming data. That is the moment the guarantee has to hold.
 */
async function fullDocument(event: Event): Promise<PostInput> {
  const data = event.params.data ?? {};
  const where = event.params.where;

  const publishing = Boolean(data.publishedAt);
  if (!publishing || !where) return data;

  const existing = await strapi.db.query("api::post.post").findOne({
    where,
    populate: { takeaways: true, body: { populate: true }, image: true },
  });

  return existing ? { ...existing, ...data } : data;
}

async function guard(event: Event) {
  const post = await fullDocument(event);
  const issues = checkPost(post);

  /*
   * With enforcement off, an error is logged at warn level like everything
   * else rather than being dropped. A rule that fired and went unrecorded is
   * worse than no rule: the log is the only remaining trace that a post went
   * out over the standard.
   */
  for (const issue of issues) {
    if (!ENFORCE_EDITORIAL || issue.severity === "warning") {
      strapi.log.warn(`[editorial] ${issue.field}: ${issue.message}`);
    }
  }

  if (!ENFORCE_EDITORIAL) return;

  const report = errorReport(issues);
  if (report) {
    /*
     * ValidationError rather than ApplicationError, because the content
     * manager renders a validation error next to the form instead of as a
     * toast that disappears while somebody is reading it.
     */
    throw new errors.ValidationError(report);
  }
}

export default {
  beforeCreate: guard,
  beforeUpdate: guard,
};
