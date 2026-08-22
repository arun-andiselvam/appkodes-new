import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, silo 5's parent.
 *
 * !! THIS PAGE COVERS THE WHOLE SILO, NOT ONLY VOICE !!
 *
 * The brief was written as a voice page: primary keyword "custom AI voice
 * models", an H1 about giving software a voice, and three H3s on speech. Built
 * that way it would have competed with the telephony child and left the fine
 * tuning child with no parent covering its category. The primary is the
 * strategy doc's "custom AI model development", which covers both, and voice
 * is a half of the page rather than the whole of it.
 *
 * "custom voice app development" was a briefed secondary and is reserved for
 * the telephony child.
 *
 * See the note on this entry in content/service-landings.ts for the claims
 * that were declined, including the assertion that speech models transcribe
 * heavy accents accurately.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/custom-ai-models-voice");

export const metadata = route.metadata;
export default route.Page;
