import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, first child of the MVP silo and built after its parent
 * so the contested keywords were settled first.
 *
 * !! THIS PAGE DOES NOT TARGET "AI MVP development" !!
 *
 * The brief listed it as a secondary here and it is the parent's own primary
 * with one word removed. The parent keeps it. This page took "low cost AI
 * prototype development" instead, which the strategy doc assigns to this path.
 *
 * !! THIS PAGE OWNS THE PROOF OF CONCEPT TERMS !!
 *
 * They were proposed as parent secondaries and belong here, because a
 * prototype and a proof of concept are the same pitch.
 *
 * !! NO TIMELINE FIGURES !!
 *
 * The brief asked for two to four weeks against four to six months, "days not
 * months", and an H1 promising weeks. None is measured. See the note on this
 * entry in content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/rapid-ai-prototyping");

export const metadata = route.metadata;
export default route.Page;
