/**
 * Job service.
 *
 * The generated factory. Nothing about a listing needs computing in Strapi:
 * the CMS stores what somebody typed and the site decides how to show it.
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::job.job");
