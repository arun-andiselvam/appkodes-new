/**
 * Post service.
 *
 * The generated factory. Nothing about a post needs computing in Strapi: the
 * reading time is derived on the site side in lib/strapi.ts when an editor
 * leaves the field empty, so the CMS stores what somebody typed and nothing
 * else.
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::post.post");
