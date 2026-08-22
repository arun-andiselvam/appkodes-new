import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026. Third child of the MVP silo, which is complete with
 * this page.
 *
 * !! THIS PAGE RESOLVES A LOGGED COLLISION !!
 *
 * The strategy doc assigns this path "AI inventory management development",
 * which /industries/retail-and-inventory also carries. The brief proposed
 * "smart inventory AI MVP" instead, which nothing else touches, so the
 * collision listed in docs/page-progress.md is settled rather than deferred.
 *
 * !! SHOPIFY AND SQUARE ARE NOT NAMED !!
 *
 * Neither is in content/integrations.ts. Same position as Zendesk and
 * Intercom on the customer support page. The POS FAQ describes the API
 * requirement instead.
 *
 * !! NO "6-12 months" AND NO FOURTEEN DAY ALERT !!
 *
 * The first has now been proposed by three separate briefs and cut every
 * time. See the note on this entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/smart-inventory-retail-mvp");

export const metadata = route.metadata;
export default route.Page;
