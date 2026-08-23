import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, the third industry page and the only one in a
 * regulated field.
 *
 * !! HIPAA AND GDPR MAY BE NAMED. GRANTING THEM MAY NOT !!
 *
 * The client cleared naming the regimes on 23 August 2026 and
 * docs/positioning.md is updated. What the page still will not say is that
 * Appkodes is HIPAA compliant: compliance attaches to a covered entity rather
 * than to a supplier, there is no certificate to hold, and promising a client
 * stays compliant is an outcome no supplier controls.
 *
 * Whether Appkodes signs Business Associate Agreements is still open, and it
 * is the strongest sentence this page could carry.
 *
 * Three settled questions came back in the brief and none shipped: edge AI,
 * "hallucination-free" retrieval, and breezing through Play Store review.
 *
 * See the note on this entry in content/industry-landings.ts for the three
 * capability claims that were softened rather than cut.
 *
 * Copy and metadata live in content/industry-landings.ts. The short form entry
 * in content/industries.ts stays, because the menu card and the breadcrumb
 * trail still read from it.
 */
const route = industryLandingRoute("/industries/healthcare-and-consulting");

export const metadata = route.metadata;
export default route.Page;
