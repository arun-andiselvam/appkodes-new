import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, silo 4's parent, from the second version of
 * docs/service-pages.md. Built before its three children so the shared terms
 * get settled here first, which is what caught the collisions in the MVP silo.
 *
 * !! NOTHING ON THIS PAGE PREDICTS ANYTHING "exactly" !!
 *
 * The brief asked for it. A forecast claiming exactness is one nobody should
 * trust, and this page's credibility rests on the confidence being visible.
 *
 * !! "enterprise security standards" IS OUT !!
 *
 * Ruled out for this buyer at docs/positioning.md line 64. The FAQ says what
 * is actually configured instead. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/ai-data-predictive-analytics");

export const metadata = route.metadata;
export default route.Page;
