/**
 * Job routes.
 *
 * The generated factory. It exposes the full REST surface for the collection,
 * and which of those verbs anybody may actually call is decided by the API
 * token, not here. The site reads with a read only token. See cms/README.md.
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::job.job");
