import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";
import { allNavRoutes } from "@/content/navigation";
import { postsWithBody, postHref } from "@/lib/posts";
import { careerListings } from "@/lib/careers";
import { caseStudies } from "@/lib/case-studies";

/**
 * Built from the same tree the menu is built from, so a route added to the
 * navigation is in the sitemap by the time the page renders. A hand-kept list
 * here drifts from the menu within about two pages.
 *
 * Anything that ships without a menu entry needs adding to `extraRoutes`.
 *
 * !! THE MENU TREE IS NOT THE WHOLE SITE, AND THIS ONLY LEARNED THAT LATE !!
 *
 * Until 26 August 2026 that tree was the only source here, so the sitemap
 * listed /blog, /careers and /resources/case-studies and not one of the
 * things inside them. Every article, every job and every written up
 * engagement was missing: 37 URLs, none with a slug. The menu cannot carry
 * them, because content/navigation.ts is the site's structure and an
 * article is content. Listing each post there would turn the site map into
 * a publishing queue, which is the exact thing its own header warns against.
 *
 * So the three collections are read directly, from the same functions the
 * pages themselves use. A post published in Strapi is in the sitemap on the
 * next request, with no deploy and nothing to remember.
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
  /*
   * Footer-only, added 30 August 2026 alongside the page itself. It carries
   * no menu entry - components/layout/footer.tsx links it next to the
   * copyright line instead - so `allNavRoutes` never finds it.
   */
  "/privacy",
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

  const structural: MetadataRoute.Sitemap = paths.map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: "monthly",
    priority: priorityFor(path),
  }));

  /*
   * The three CMS and content backed collections.
   *
   * Fetched together rather than in sequence: they are independent, and a
   * sitemap request should not pay for three round trips to Strapi one after
   * another. Each of these already returns an empty list when Strapi is
   * unreachable, so an outage costs the entries rather than the whole file,
   * and the structural URLs above still ship.
   */
  const [posts, jobs, studies] = await Promise.all([
    postsWithBody(),
    careerListings(),
    caseStudies(),
  ]);

  /*
   * lastModified is the point of listing these separately.
   *
   * The structural pages get a flat monthly guess because nothing here knows
   * when a service page last changed. An article does know: it carries the
   * date it was published and the date it was revised, so the sitemap can
   * tell a crawler exactly when to bother re-reading it. Guessing would be
   * worse than saying nothing.
   *
   * priority sits at 0.7 rather than running through priorityFor. That
   * function reads depth from the path, and /blog/<slug> is one segment deep
   * where the same article used to be three, so it would now claim 0.8 and
   * outrank the silo parents it feeds. The URL got shorter; the article did
   * not become more important than a service page.
   */
  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(postHref(post), origin).toString(),
    lastModified: new Date(post.updated ?? post.published),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const roles: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: new URL(`/careers/${job.slug}`, origin).toString(),
    lastModified: new Date(job.postedDate),
    /* A job listing changes rarely and then disappears, which is a different
       shape from an article being revised. */
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const proof: MetadataRoute.Sitemap = studies.map((study) => ({
    url: new URL(`/resources/case-studies/${study.slug}`, origin).toString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  /* De-duplicated by URL, same rule as the structural paths above: one page
     listed twice is the one thing a sitemap must not do. */
  const all = [...structural, ...articles, ...roles, ...proof];
  const seen = new Set<string>();
  return all.filter((entry) => !seen.has(entry.url) && seen.add(entry.url));
}
