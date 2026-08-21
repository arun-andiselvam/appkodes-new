import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * This route is the first one built to docs/service-page-architecture.md, and
 * it is the template the other silo parents follow. Copy and metadata live in
 * content/service-landings.ts. See lib/service-landing-route.tsx.
 */
const route = serviceLandingRoute("/services/ai-software-integration");

export const metadata = route.metadata;
export default route.Page;
