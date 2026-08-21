/**
 * Where blog posts come from.
 *
 * !! THIS FILE IS THE ONLY THING THAT CHANGES WHEN A CMS IS PICKED !!
 *
 * Nothing is chosen yet. MDX in the repo was started on 21 August 2026 and
 * stopped the same day, and the decision is now between a headless CMS and
 * something else. So this returns an empty list, the category pages render
 * their honest empty state, and no component anywhere knows or cares where a
 * post came from.
 *
 * To wire a source up, replace the body of `postsIn`. That is the whole job.
 * Every call site already awaits it, so a network fetch drops in without a
 * single component changing.
 *
 * A note for whoever does that. Astro is a static site framework rather than
 * a CMS, and its content collections are local files, so choosing it is closer
 * to choosing MDX than to choosing Strapi. Strapi, Sanity and Payload are the
 * like for like comparison if the point is that somebody can publish without
 * touching the repo.
 */

/**
 * One published piece.
 *
 * `sendsTo` is not optional, and that is deliberate. Silo 7 exists in
 * docs/hitasoft_ai_architecture_strategy.md to catch "how do I" searches and
 * pass the reader down into a service silo. A post that links nowhere is a
 * page that spends attention and returns none of it, so the link up the silo
 * is a field the type demands rather than something a writer has to remember.
 */
export type Post = {
  /** Last segment of the URL. Unique within its category, not across all of them. */
  slug: string;
  /** Path of the category page this belongs under, leading slash. */
  category: string;
  title: string;
  /** One or two sentences for the card. Not the first line of the body. */
  excerpt: string;
  /** ISO date. Becomes datePublished on the BlogPosting schema. */
  published: string;
  /** ISO date, when it has been meaningfully revised. */
  updated?: string;
  /** Rounded, for the card. Calculated at ingest rather than in the component. */
  readingMinutes: number;
  /**
   * Featured image, path under /public.
   *
   * Optional, and the index handles its absence rather than reserving an empty
   * box. A post written in a hurry without artwork should still list cleanly,
   * and whatever CMS lands will let somebody publish without one.
   *
   * Treated as decorative where it renders: the row is a single link whose
   * accessible name is already the post title, so the image takes alt="" and
   * the date sits over it as real text rather than being baked into a bitmap.
   */
  image?: string;
  /** The silo page this post feeds. See the note on the type above. */
  sendsTo: string;
};

/**
 * !! FLIP THIS TO false BEFORE LAUNCH !!
 *
 * True serves the ten invented posts in content/posts-sample.ts so the
 * category layout and the pagination can be judged at volume. Turned on 21
 * August 2026 for a design review.
 *
 * False returns nothing and the category pages fall back to their honest empty
 * state, which is the only correct behaviour on a live site until a real
 * source is wired up. Cleanup is this boolean, the import below, and deleting
 * content/posts-sample.ts.
 */
const USE_SAMPLE_POSTS = true;

/** How many posts a category page shows before paging. */
export const POSTS_PER_PAGE = 4;

/**
 * Posts in one category, newest first.
 *
 * Async on purpose even though the current implementation is synchronous. A
 * CMS fetch is async, and having the call sites already await means adopting
 * one touches this function and nothing else.
 */
export async function postsIn(category: string): Promise<Post[]> {
  if (!USE_SAMPLE_POSTS) return [];

  const { samplePosts } = await import("@/content/posts-sample");

  return samplePosts
    .filter((post) => post.category === category)
    .sort((a, b) => b.published.localeCompare(a.published));
}

/**
 * One page of a category, plus what the pager needs to draw itself.
 *
 * `pageNumber` is 1 based, matching the URL. Anything out of range comes back
 * with an empty list rather than clamped, so a route can 404 on
 * /page/99 instead of quietly serving the last page under a URL that will then
 * get indexed.
 *
 * A note on the SEO of this, since paging was added against my advice and the
 * reasoning should survive me. Page two and beyond carries no unique content,
 * rarely attracts a link, and is mostly not indexed. That is why
 * lib/resource-category-route.tsx marks every page after the first noindex,
 * follow: the posts on it still get crawled and still pass equity down the
 * silo, and the thin archive page itself stays out of the index.
 */
export async function pageOfPostsIn(
  category: string,
  pageNumber: number,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const all = await postsIn(category);
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const start = (pageNumber - 1) * POSTS_PER_PAGE;

  return {
    posts: pageNumber >= 1 && pageNumber <= totalPages
      ? all.slice(start, start + POSTS_PER_PAGE)
      : [],
    total: all.length,
    totalPages,
  };
}
