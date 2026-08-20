import type { MetadataRoute } from "next";
import { site, navLinks } from "@/content/site";

/**
 * Built from the same array the menu is built from, so a route added to the
 * navigation is in the sitemap by the time the page renders. A hand-kept list
 * here drifts from the menu within about two pages.
 *
 * Anything that ships without a menu entry needs adding to `extraRoutes`.
 */
const extraRoutes: string[] = [];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...navLinks.map((link) => link.href), ...extraRoutes];

  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    // The home page is the one a crawler should weigh above the rest.
    priority: path === "/" ? 1 : 0.8,
  }));
}
