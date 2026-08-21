import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * This route is the first one built to docs/industry-page-architecture.md, and
 * it is the template the other five industries follow. It was a siloRoute
 * until 21 August 2026.
 *
 * The brief asks for /industries/fintech-ai-automation. This page already
 * existed here, in the navigation and the sitemap, so the long form upgraded
 * the URL in place rather than opening a second fintech page to compete with
 * it. See the note at the top of content/industry-landings.ts.
 *
 * Copy and metadata live in content/industry-landings.ts. The short form entry
 * in content/industries.ts stays, because the menu card and the breadcrumb
 * trail still read from it.
 */
const route = industryLandingRoute("/industries/fintech-and-finance");

export const metadata = route.metadata;
export default route.Page;
