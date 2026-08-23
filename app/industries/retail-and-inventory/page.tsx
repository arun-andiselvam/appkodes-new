import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, the second industry page.
 *
 * !! FOUR SETTLED QUESTIONS CAME BACK IN THIS BRIEF !!
 *
 * Edge AI vision, which the client confirmed has never run for a client and
 * which was cut from /services/computer-vision-quality-control the same day.
 * "Gadgetly", a company that appears nowhere in this repository, for the third
 * time. Shopify and Square, already refused on the retail MVP page. And a
 * "Talk to Sales" button, which docs/positioning.md removed from this site.
 *
 * None of them ship. See the note on this entry in content/industry-landings.ts.
 *
 * Copy and metadata live in content/industry-landings.ts. The short form entry
 * in content/industries.ts stays, because the menu card and the breadcrumb
 * trail still read from it.
 */
const route = industryLandingRoute("/industries/retail-and-inventory");

export const metadata = route.metadata;
export default route.Page;
