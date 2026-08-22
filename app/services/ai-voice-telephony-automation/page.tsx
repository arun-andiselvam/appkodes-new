import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, second child of the models and voice silo. This was
 * the last service page on the site.
 *
 * !! VOICE CLONING IS NOT OFFERED HERE !!
 *
 * The brief asked to confirm "fully customizable voice cloning". Cloning a
 * particular person's voice is an impersonation capability, it needs that
 * person's consent to be lawful in several of the markets this company sells
 * into, and nothing in this repository says we do it. The page offers voice
 * selection and says so in the FAQ.
 *
 * !! NO CAPACITY OR LATENCY FIGURES !!
 *
 * "Handles 10,000 concurrent calls" and "sub-second conversational latency"
 * are both unmeasured. The second is the same shape as the "sub 50ms" claim
 * docs/positioning.md records as already removed from the template.
 *
 * Twilio is named because it is vetted in content/integrations.ts. Vonage is
 * not named because it is not. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/ai-voice-telephony-automation");

export const metadata = route.metadata;
export default route.Page;
