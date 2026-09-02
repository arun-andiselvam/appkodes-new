import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 2 September 2026, first child of silo 6.
 *
 * !! THE STORE REVIEW ANSWER IS THE ONE THING HERE THAT GOES STALE !!
 *
 * The client's brief flags it and it is worth repeating at the route. Store
 * policy changes on somebody else's schedule, so the copy names no policy, no
 * console screen and no approval outcome. What it says instead is that the
 * data questions get answered during the build, and that nobody controls a
 * review. Re-read the third FAQ if either store changes its data safety form.
 *
 * !! NOTHING ON THIS PAGE CLAIMS AN ON-DEVICE RUNTIME !!
 *
 * The brief's own open item asks for the mobile stack to be confirmed with
 * delivery first. So the stack section lists only what content/integrations.ts
 * already vets, Flutter included and worded as that file words it, and the
 * copy says the on-device question is settled in week one rather than naming a
 * runtime nobody has confirmed.
 *
 * The upward link to the hub is the breadcrumb trail, which is how all
 * fourteen other child pages do it. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts.
 */
const route = serviceLandingRoute("/services/ai-mobile-app-development");

export const metadata = route.metadata;
export default route.Page;
