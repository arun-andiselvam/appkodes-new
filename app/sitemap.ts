import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { allNavRoutes } from "@/content/navigation";

/**
 * Built from the same tree the menu is built from, so a route added to the
 * navigation is in the sitemap by the time the page renders. A hand-kept list
 * here drifts from the menu within about two pages.
 *
 * Anything that ships without a menu entry needs adding to `extraRoutes`.
 */
const extraRoutes: string[] = [];

/**
 * How a crawler should weigh each URL.
 *
 * The silo has four levels and a flat 0.8 across all of them tells a crawler
 * nothing about which page is the parent. Depth is counted from the path, so a
 * page added under a new parent is weighted correctly without anybody
 * revisiting this file.
 */
function priorityFor(path: string) {
  if (path === "/") return 1;
  const depth = path.split("/").filter(Boolean).length;
  if (depth === 1) return 0.8;
  if (depth === 2) return 0.7;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...allNavRoutes(), ...extraRoutes];

  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: priorityFor(path),
  }));
}
