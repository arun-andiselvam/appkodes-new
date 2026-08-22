import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, third child of the workflow automation silo.
 *
 * !! NO MODEL VERSION NUMBERS ON THIS PAGE !!
 *
 * The brief asked for an H3 reading "Vision-Capable LLM Extraction (GPT-4o,
 * Claude 3.5)". content/integrations.ts line 17 rules that out: families
 * never versions, because a version dates the page the week it is superseded.
 *
 * The word "enterprise" is out too, per docs/positioning.md line 64, and it
 * was in the third FAQ of the brief. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/document-processing-ocr");

export const metadata = route.metadata;
export default route.Page;
