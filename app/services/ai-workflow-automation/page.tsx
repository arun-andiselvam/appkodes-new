import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, and the first silo parent after AI Integration to move
 * off siloRoute.
 *
 * !! THIS PAGE DOES NOT OWN "custom AI agent development" !!
 *
 * That belongs to the autonomous-ai-agents child. The blueprint this was built
 * from listed it as a secondary here, which would have set a parent competing
 * with its own child, exactly as the integration silo did once already. See
 * the note on this entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/ai-workflow-automation");

export const metadata = route.metadata;
export default route.Page;
