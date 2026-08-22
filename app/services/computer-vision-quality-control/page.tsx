import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, third child of the analytics silo, which is complete
 * with this page.
 *
 * !! THIS PAGE DOES NOT PROMISE TO CATCH EVERY DEFECT !!
 *
 * The brief asked for it as the H1, along with "eliminate human error",
 * "absolute precision", "Infinite 24/7 consistency" and "flawless". An
 * inspection buyer knows no system catches everything, so the page claims
 * consistency instead, which is true and provable. One FAQ answers the
 * question directly with "No, and neither does a person."
 *
 * !! NO CAMERA MODEL IS NAMED !!
 *
 * A use case asked for a specific consumer camera by model number. Unvetted
 * vendor and a version number in one phrase. See the note on this entry in
 * content/service-landings.ts.
 *
 * Edge deployment is described as an option the architecture supports rather
 * than as work already delivered. Confirm before launch.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/computer-vision-quality-control");

export const metadata = route.metadata;
export default route.Page;
