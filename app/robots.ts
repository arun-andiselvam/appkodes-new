import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

/**
 * Crawl everything. There is nothing private on the site, and the sitemap is
 * named here so a crawler that arrives at the root finds the rest.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
