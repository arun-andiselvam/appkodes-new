import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026. Fourth and last child of the workflow automation silo,
 * which is complete with this page.
 *
 * !! NO CONFIDENCE THRESHOLD FIGURE, AND NOTHING IS "flawless" !!
 *
 * The brief asked to publish a 95% confidence score as the routing threshold
 * and to describe the calculation step as flawless. The routing is real and
 * the deterministic argument is the best thing on the page, but the number is
 * not ours to quote and the absolute makes a liar of the first wrong total.
 *
 * !! QuickBooks AND Xero ARE NOT ON THE VETTED LIST !!
 *
 * Named here as where a client's books already live, which is the position
 * content/industry-landings.ts already took for the same two. Confirm before
 * launch. See the note on this entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/financial-data-automation");

export const metadata = route.metadata;
export default route.Page;
