import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026 from a blueprint the client brought. It owns "secure AI
 * integration services", which is the term docs/hitasoft_ai_architecture_
 * strategy.md assigns it, and neither the parent nor its sibling touches it.
 *
 * The blueprint asks for /services/ai-software-integration/secure-ai-compliance.
 * This page already existed at the longer slug, in the navigation, the sitemap
 * and the strategy doc, so the long form upgraded the URL in place rather than
 * opening a second page to compete with the first.
 *
 * Copy and metadata live in content/service-landings.ts, which also records
 * the four things in the blueprint that were not written as asked. The short
 * form entry in content/services.ts stays, because the menu card and the
 * breadcrumb trail still read from it.
 */
const route = serviceLandingRoute(
  "/services/ai-software-integration/secure-ai-compliance-architecture",
);

export const metadata = route.metadata;
export default route.Page;
