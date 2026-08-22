import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026 from docs/service-pages.md, which carries all four
 * pages in this silo. Built before its three children on purpose: the briefs
 * collide with each other in three places and this page is where those terms
 * get settled.
 *
 * !! THIS PAGE OWNS "custom AI MVP development" AND "AI MVP development" !!
 *
 * The second was proposed as a secondary on the rapid prototyping child. It is
 * this page's own primary with one word removed, so it stays here.
 *
 * !! IT DOES NOT OWN "build AI SaaS MVP" OR THE PROOF OF CONCEPT TERMS !!
 *
 * Both were proposed as parent secondaries and both belong to children. See
 * the note on this entry in content/service-landings.ts.
 *
 * !! THE PLAY CONSOLE CLAIMS ARE UNCONFIRMED !!
 *
 * The brief leaned on Data safety forms and closed testing tracks. Described
 * here as work the build accounts for, never as a record of approvals.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/custom-ai-mvp-development");

export const metadata = route.metadata;
export default route.Page;
