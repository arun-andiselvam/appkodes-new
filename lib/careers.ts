import { strapiJobs } from "@/lib/strapi";
import type { Block } from "@/lib/posts";

/**
 * Where open positions come from.
 *
 * Same shape as lib/posts.ts: Strapi does the storing, lib/strapi.ts does the
 * fetching and the mapping, and nothing outside this file and that one knows
 * the CMS exists. See cms/README.md for the schema and cms/src/api/job/.
 *
 * !! NO SAMPLE FALLBACK, UNLIKE POSTS !!
 *
 * lib/posts.ts serves ten invented articles when Strapi is not configured,
 * which is fine for a blog: a placeholder article wastes a click. A
 * placeholder job listing is a different kind of wrong. It is a specific,
 * checkable claim ("Hitasoft is hiring a ...") published under the company's
 * real name, and a candidate who emails a made up role because a developer's
 * laptop had no CMS pointed at it is a worse failure than an empty page. So
 * this has exactly one source. Strapi configured and reachable means real
 * listings; anything else means none, and the page says so honestly rather
 * than inventing something to show.
 */

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  /**
   * !! THESE VALUES MIRROR THE STRAPI ENUM AND HAVE TO BE CHANGED TOGETHER !!
   *
   * The list lives twice: here, and as `employmentType.enum` in
   * cms/src/api/job/content-types/job/schema.json. Adding one in the Strapi
   * admin instead of in both files does not work and fails quietly in two
   * ways. The Content-Type Builder writes to the container's own filesystem,
   * so the next deploy rebuilds from this repository and drops it. And a
   * value the CMS accepts but this union does not know about is a listing
   * that typechecks nowhere and renders an unexpected string.
   *
   * "Freelance" added 25 August 2026, at the client's request, alongside the
   * schema.
   */
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Freelance";
  /** The teaser shown on the /careers list and used as the meta description
   * on the listing's own page. */
  summary: string;
  description: Block[];
  applyEmail: string;
  /** ISO date. When the role was posted, for display and for sort order. */
  postedDate: string;
};

/**
 * Every open position, from Strapi if it is configured, empty otherwise.
 *
 * Everything below reads from this rather than deciding for itself, same
 * discipline as `source()` in lib/posts.ts.
 */
async function source(): Promise<Job[]> {
  const fromStrapi = await strapiJobs();
  return fromStrapi ?? [];
}

/** Every open position, newest first. */
export async function careerListings(): Promise<Job[]> {
  return (await source()).sort((a, b) => b.postedDate.localeCompare(a.postedDate));
}

/** One listing by slug, or null if it does not exist or is not published. */
export async function careerBySlug(slug: string): Promise<Job | null> {
  const jobs = await source();
  return jobs.find((job) => job.slug === slug) ?? null;
}
