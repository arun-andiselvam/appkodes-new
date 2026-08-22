import { serviceLandingRoute } from "@/lib/service-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 22 August 2026, second child of the analytics silo.
 *
 * !! NOTHING ON THIS PAGE IS "hallucination-free" !!
 *
 * The brief promised it twice. Retrieval reduces hallucination and does not
 * remove it, and /services/customer-support-ai already says so correctly one
 * click away. An absolute here would contradict that page and be wrong on its
 * own terms.
 *
 * !! PINECONE IS NOT NAMED !!
 *
 * pgvector is vetted in content/integrations.ts and Pinecone is not. Same
 * position as Zendesk, Intercom, Shopify and Square.
 *
 * The third use case dropped its medical and legal professionals along with
 * the compliance claim attached to them. See the note on this entry in
 * content/service-landings.ts.
 *
 * Copy and metadata live in content/service-landings.ts. The short form entry
 * in content/services.ts stays, because the menu card and the breadcrumb trail
 * still read from it.
 */
const route = serviceLandingRoute("/services/data-engineering-vector-databases");

export const metadata = route.metadata;
export default route.Page;
