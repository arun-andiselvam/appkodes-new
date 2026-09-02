import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 2 September 2026, second child of silo 6.
 *
 * !! DO NOT ADD A LINK TO /services/private-llm-fine-tuning !!
 *
 * The client asked for that explicitly, on the grounds that the fine tuning
 * page is being left undiluted until it ranks. The tuning argument is made
 * here in plain words and the case study behind it is fair to reference, but
 * the service page is not linked and not named. Anybody adding a "see also"
 * later is undoing a decision rather than filling a gap.
 *
 * The cross-silo link goes to /services/ai-software-integration instead, in
 * the last FAQ, which is the boundary this whole silo exists to hold.
 *
 * "Generative AI web platform builders" was a briefed keyword and is not used.
 * "Builders" describes the supplier a searcher wants rather than anything a
 * page can be about, and docs/seo-standards.md only allows a secondary term
 * that some section genuinely answers. The third scenario carries "generative
 * AI web platform" instead.
 *
 * Copy and metadata live in content/service-landings.ts.
 */
const route = serviceLandingRoute("/services/ai-web-app-development");

export const metadata = route.metadata;
export default route.Page;
