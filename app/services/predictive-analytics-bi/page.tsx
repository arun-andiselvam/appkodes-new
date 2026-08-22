import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, first child of the analytics silo.
 *
 * !! TWO PRODUCT NAMES WERE CUT FROM THE USE CASES !!
 *
 * The brief named "Zedger" and a "Gadgetly-style" product as example builds.
 * Neither appears anywhere in this repository, and docs/positioning.md line
 * 215 forbids attaching names to companies that are not confirmed clients.
 * They can go back in once somebody confirms the relationship.
 *
 * !! "predictive analytics integration" SITS NEAR THE PARENT'S PRIMARY !!
 *
 * Kept, and the parent's exact phrase is verified absent from this page's
 * metadata. See the note on this entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/predictive-analytics-bi");

export const metadata = route.metadata;
export default route.Page;
