import { errors } from "@strapi/utils";

import { checkPost, errorReport, type PostInput } from "../../../../utils/editorial";

/**
 * The gate. Nothing that breaks the house standards gets saved.
 *
 * !! THIS IS THE PART THAT MAKES THE STANDARD REAL !!
 *
 * @strapi-community/plugin-seo shows an editor a checklist and a search result
 * preview, which is useful and is advice. Advice gets ignored on a Friday
 * afternoon. This refuses the save, names the rule, quotes the offending
 * sentence and says what to do about it.
 *
 * All the rules live in src/utils/editorial.ts, which imports nothing from
 * Strapi so it can be run against a fixture. This file is only glue.
 *
 * !! WARNINGS ARE LOGGED, NOT THROWN !!
 *
 * Two checks are advisory: a hero image with no alt text, and fewer than two
 * contextual links. Both are usually wrong and occasionally deliberate, and a
 * gate that blocks a legitimate case teaches people to work around the gate.
 * Everything else is an error.
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

  for (const issue of issues) {
    if (issue.severity === "warning") {
      strapi.log.warn(`[editorial] ${issue.field}: ${issue.message}`);
    }
  }

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
