import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, and the first silo child written after its own parent
 * rather than before it.
 *
 * !! THIS PAGE OWNS "custom AI agent development" !!
 *
 * The parent at /services/ai-workflow-automation was deliberately kept off it
 * when that page was built the same day, because a brief had proposed it as a
 * parent secondary. This is the page named for the phrase.
 *
 * !! CrewAI AND AutoGen ARE NAMED HERE AND ARE NOT ON THE VETTED LIST !!
 *
 * The claim predates this page, in content/services.ts. It needs confirming
 * before launch alongside content/integrations.ts. See the note on this entry
 * in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/autonomous-ai-agents");

export const metadata = route.metadata;
export default route.Page;
