import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, second child of the MVP silo.
 *
 * !! THIS PAGE OWNS "build AI SaaS MVP" !!
 *
 * Reserved for it when the parent was built, because the parent brief had
 * claimed it. The brief for this page proposed "SaaS AI prototype" instead,
 * which encroaches on the rapid prototyping sibling, so the reserved term
 * filled the slot.
 *
 * !! NO "enterprise", NO "flawless", NO "zero errors", NO "100%" !!
 *
 * All four were in the brief. The deterministic argument they were attached
 * to survives in full and is the strongest thing on this page. The absolutes
 * do not.
 *
 * !! THE PLAY CONSOLE EXPERTISE CLAIM IS UNCONFIRMED !!
 *
 * Described as work the build accounts for, never as a track record. Same
 * position as the parent. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/fintech-saas-ai-mvp");

export const metadata = route.metadata;
export default route.Page;
