import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, the last of the six industry pages.
 *
 * !! THE BRIEF ASKED FOR THE THING GOOGLE PENALISES !!
 *
 * "Dominate search engine visibility", expansive topic clusters and content
 * generated at volume. Scaled content abuse is a named ranking policy, and a
 * page selling it to marketers is selling them a demotion. So the page leads
 * on clustering and forecasting, which are analysis, and the content question
 * is answered head on in an FAQ rather than dodged: one draft per cluster,
 * finished by a person.
 *
 * That is also the honest position for this site. Twenty five pages here were
 * written by hand precisely because the generated version does not work.
 *
 * !! "ABSOLUTE PRECISION" ON A FORECAST IS THE OTHER DECLINE !!
 *
 * The brief promises forecasting "with absolute precision" and a "clear
 * picture of your long-term business valuation" from ad data. Neither is a
 * thing that exists. Every forecast on this page reports a range, the security
 * section says the model records how wrong it has been before, and the first
 * FAQ says plainly that anybody quoting precision on an ad forecast is selling
 * the part that does not exist.
 *
 * Also declined: "strictly adhere to global privacy standards", "highly
 * secure, authenticated API endpoints", "keeping your CRM pristine", "growth
 * hacking", "enterprise solutions" and "MacBook mockups". Softened: two uses
 * of "instantly".
 *
 * !! ASK ABOUT AD PLATFORM CONNECTORS BEFORE LAUNCH !!
 *
 * The brief names Google Ads four times and none of it reached the ecosystem
 * row. See the note on that row in content/industry-landings.ts: it is the
 * same position QuickBooks and Xero were in on the fintech page, and the same
 * question has not been put to the client.
 *
 * Copy and metadata live in content/industry-landings.ts. The short form entry
 * in content/industries.ts stays, because the menu card and the breadcrumb
 * trail still read from it.
 */
const route = industryLandingRoute("/industries/marketing-and-adtech");

export const metadata = route.metadata;
export default route.Page;
