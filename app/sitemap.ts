import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";
import { allNavRoutes } from "@/content/navigation";

/**
 * Built from the same tree the menu is built from, so a route added to the
 * navigation is in the sitemap by the time the page renders. A hand-kept list
 * here drifts from the menu within about two pages.
 *
 * Anything that ships without a menu entry needs adding to `extraRoutes`.
 */
const extraRoutes: string[] = [
  /*
   * /how-we-work reached this list through the Services panel footer until
   * that strip was removed on 23 August 2026. Nobody noticed the sitemap lose
   * it with it, and docs/page-progress.md carried the gap until 24 August.
   *
   * !! IT IS BACK IN THE MENU TREE AND IT STAYS HERE ANYWAY !!
   *
   * The Industries and Resources footer strips both point at it as of 24
   * August, so `allNavRoutes` finds it again and this entry is redundant
   * today. Removing it would make the sitemap depend on a menu strip that has
   * already been repointed twice in two days, and the last time one moved this
   * page silently left the map. The de-duplication below makes carrying it
   * free, which is a better trade than being right until somebody edits a
   * menu.
   */
  "/how-we-work",
];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * De-duplicated across all three sources.
   *
   * `allNavRoutes` already de-duplicates within the menu tree, which was
   * enough while `extraRoutes` only held pages the menu did not carry. It
   * stopped being enough on 24 August 2026, when /how-we-work went back into
   * the tree while staying in `extraRoutes` on purpose. See the note there.
   *
   * One page at two URLs is the thing a sitemap must never create, and one
   * page listed twice at the same URL is only a little better.
   */
  const paths = [...new Set(["/", ...allNavRoutes(), ...extraRoutes])];
  const origin = await siteOrigin();

  return paths.map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: "monthly",
    priority: priorityFor(path),
  }));
}
