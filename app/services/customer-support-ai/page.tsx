import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, second child of the workflow automation silo.
 *
 * !! NO RESOLUTION RATE APPEARS ON THIS PAGE !!
 *
 * The brief asked for "Resolve 70% of customer inquiries instantly" in the
 * meta description. Nothing has measured that. Every figure in
 * content/metrics.ts is still a draft.
 *
 * !! ZENDESK AND INTERCOM ARE DELIBERATELY NOT NAMED !!
 *
 * Neither is in content/integrations.ts, whose warning says the list has to
 * match what has actually been delivered. The page describes the capability
 * instead. Name them when somebody confirms a build. See the note on this
 * entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/customer-support-ai");

export const metadata = route.metadata;
export default route.Page;
