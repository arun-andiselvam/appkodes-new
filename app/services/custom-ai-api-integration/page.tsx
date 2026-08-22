import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026 from an outline the client brought, and the second page
 * on the ServiceLandingPage template after its own parent.
 *
 * !! THIS PAGE OWNS "custom AI API integration", THE PARENT DOES NOT !!
 *
 * Both carried that phrase in their titles once and were set to compete. The
 * parent took the category term its URL carries and this kept the specific
 * one. See rule one in docs/seo-standards.md and the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute(
  "/services/custom-ai-api-integration",
);

export const metadata = route.metadata;
export default route.Page;
