import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

/**
 * Crawl everything. The sitemap is named here so a crawler that arrives at the
 * root finds the rest.
 *
 * !! /admin IS DELIBERATELY NOT NAMED HERE. DO NOT ADD IT BACK !!
 *
 * It was disallowed here from 27 August until 2 September 2026, on the
 * reasoning that a disallow costs nothing. It does cost something: robots.txt
 * is public, and harvesting `Disallow` paths is a standard first move for a
 * scanner. This file was the one place on the whole site that named the admin
 * area out loud. Removed on the client's instruction of 2 September 2026.
 *
 * Nothing is given up by dropping it, because a disallow never stopped
 * indexing in the first place - only crawling. What keeps these pages out of
 * the index is app/admin/layout.tsx, which sets `robots: { index: false }` for
 * the entire subtree. That is the stronger of the two mechanisms and it needs
 * the crawler to be allowed to fetch the page in order to read it, which this
 * line was quietly preventing.
 *
 * The gate is what defends the routes, not either of those: proxy.ts refuses
 * anything under /admin without a valid session, so a crawler or a scanner
 * that guesses the path gets the login form and never sees a byte of data.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
