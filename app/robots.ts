import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

/**
 * Crawl everything except the admin area. The sitemap is named here so a
 * crawler that arrives at the root finds the rest.
 *
 * !! /admin WAS ADDED WHEN THIS FILE STOPPED BEING TRUE !!
 *
 * This said "there is nothing private on the site" until 27 August 2026, when
 * the quote assistant's archive gave it somewhere holding other people's names
 * and email addresses. proxy.ts refuses those routes without a password and
 * the page carries its own noindex, so this line is the third of three rather
 * than the defence — but a disallow costs nothing, and a robots file that
 * quietly contradicts the site is how the next gap gets missed.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
