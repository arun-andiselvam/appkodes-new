import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, first child of the models and voice silo.
 *
 * !! THE GUARANTEES DID NOT SHIP !!
 *
 * The brief asked for "total data isolation", "Guaranteed zero third-party
 * data sharing", "perfect JSON", "zero user data leaks" and an assurance that
 * a platform passes Google Play data safety review "without fear of
 * rejection". The architecture argument under them is the best thing on the
 * page and survives whole. A model on hardware you own means records do not
 * leave because there is nowhere for them to go. That is stronger than the
 * word guaranteed and it is what a security reviewer will believe.
 *
 * !! NO VERSION NUMBER ON LLAMA !!
 *
 * content/integrations.ts line 17. Families, never versions. One FAQ says so
 * out loud, since a buyer will wonder why no version is named.
 *
 * See the note on this entry in content/service-landings.ts for the rest,
 * including why nothing needed moving off the parent.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/private-llm-fine-tuning");

export const metadata = route.metadata;
export default route.Page;
