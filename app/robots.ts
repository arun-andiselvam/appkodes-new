import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Crawl everything. There is nothing private on the site, and the sitemap is
 * named here so a crawler that arrives at the root finds the rest.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
