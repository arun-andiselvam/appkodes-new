/**
 * Job controller.
 *
 * The generated factory, unmodified. Everything the site needs is a plain read
 * of published entries, and a hand written controller here would be a second
 * place for query logic to live. The populate rules are in lib/strapi.ts on
 * the site side, which is where somebody debugging a missing field will look.
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::job.job");
