import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 2 September 2026, silo 6's parent, and the first page on this template
 * for a product that does not exist yet.
 *
 * !! THIS PAGE IS FOR NET NEW BUILDS AND MUST STAY THAT WAY !!
 *
 * The whole silo sits one wrong sentence away from competing with
 * /services/ai-software-integration, which owns everything that starts from
 * software the buyer already runs. The boundary is held in three places rather
 * than asserted once: the reach section links out to that page by name, the
 * last FAQ sends the visitor there, and no page in this silo carries
 * "integration" in a title or a primary keyword. Read the note at the head of
 * this silo in content/service-landings.ts before changing any of the three.
 *
 * Two things the brief asked for and did not get, both recorded there in full:
 * the word "enterprise", which docs/positioning.md bans outright because this
 * site sells to companies of ten to five hundred people, and
 * "AI software development agency", which is a self description nothing else
 * on the site uses.
 *
 * The hero button and the closing panel are overridden for this silo. The site
 * offers a free automation audit, and a visitor whose product has not been
 * written has nothing to audit. See hero.cta and cta on ServiceLanding in
 * content/types.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because lib/quote-corpus.ts merges its
 * solution block and outcomes into the assistant's corpus.
 */
const route = serviceLandingRoute("/services/ai-app-development");

export const metadata = route.metadata;
export default route.Page;
