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
 * One block of a post body.
 *
 * !! NOT MARKDOWN, AND NOT HTML !!
 *
 * A discriminated union rather than a string, for two reasons. Rendering a
 * markdown string needs a parser, which is a dependency and a bundle, and
 * rendering an HTML string needs dangerouslySetInnerHTML, which hands whatever
 * CMS gets picked the ability to inject script into every reader's page.
 *
 * Every headless CMS exports structured rich text of roughly this shape, so
 * adopting one is a mapping function in lib/posts.ts rather than a rewrite of
 * the renderer. Keep this list short: a body format that grows a block per
 * article is a format nobody can map onto anything.
 *
 * `h2` is what the table of contents is built from, so a post with no h2 gets
 * no contents panel, which is correct for a short one.
 */
export type Block =
  /**
   * A paragraph, optionally carrying links.
   *
   * `links` names a phrase in `text` and where it points. The renderer finds
   * the phrase and wraps it, which keeps the copy readable as prose in the
   * content file instead of as markup with anchors buried in it.
   *
   * docs/blog-structure.md asks for two or three contextual links per article,
   * on descriptive anchor text, into the service and industry silos. This is
   * how a post pays its way: an article nobody follows out of is a page that
   * spends attention and returns none.
   */
  | { kind: "p"; text: string; links?: { phrase: string; href: string }[] }
  | { kind: "h2"; text: string }
  /**
   * A sub-heading.
   *
   * Never skip from h2 to a bolded paragraph pretending to be one, and never
   * open a section with an h3. The contents panel reads this hierarchy and
   * Google reads it to build sitelinks, so a broken one costs both.
   */
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  /** A single line set apart. For the one sentence somebody should leave with. */
  | { kind: "callout"; text: string }
  /**
   * A comparison table.
   *
   * Worth its own block kind rather than being written as prose. An answer
   * engine parses a real table far more reliably than it parses a paragraph
   * describing the same comparison, and a reader scanning for one row finds it
   * without reading the others.
   */
  | { kind: "table"; head: string[]; rows: string[][] }
  /**
   * An image inside the article.
   *
   * `alt` and `caption` are both required, deliberately. docs/blog-structure
   * .md asks for descriptive alt and a visible caption on every in-article
   * image, and a type that lets either be forgotten is a type that will see
   * both forgotten.
   */
  | { kind: "figure"; src: string; alt: string; caption: string };

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
   * Who wrote it.
   *
   * An organisation rather than a person, until there are real bylines. A
   * named author with an invented biography is the kind of E-E-A-T signal that
   * becomes a liability the moment somebody checks, and docs/positioning.md's
   * claims discipline covers people as much as figures.
   */
  author: string;
  /**
   * Three lines somebody could read instead of the article.
   *
   * !! THIS IS THE HIGHEST VALUE BLOCK ON THE PAGE FOR GEO !!
   *
   * docs/blog-structure.md asks for it and it is right to: an answer engine
   * looking for something quotable takes the summary box over the prose almost
   * every time, because it is already compressed and already the claim. Three
   * is the count. Five is a summary of a summary and nobody reads it.
   *
   * Each line has to stand alone, lifted with none of the article around it.
   */
  takeaways: string[];
  /**
   * Questions the article answers, if it ends with any.
   *
   * Optional, and only worth adding where the piece genuinely answers them.
   * Emits FAQPage schema when present. A Q&A bolted onto an article that did
   * not need one is padding a crawler can see through.
   */
  faqs?: { question: string; answer: string }[];
  /**
   * Featured image, path under /public.
   *
   * Optional, and the index handles its absence rather than reserving an empty
   * box. A post written in a hurry without artwork should still list cleanly,
   * and whatever CMS lands will let somebody publish without one.
   *
   * On the index it is decorative: the row is a single link whose accessible
   * name is already the post title, so it takes alt="" there and the date sits
   * over it as real text rather than being baked into a bitmap.
   *
   * On the article itself it is the hero, and `imageAlt` describes it.
   */
  image?: string;
  /**
   * What the hero image shows.
   *
   * Absent means decorative, and the article renders it with alt="". That is
   * the honest setting for the placeholder photographs currently in
   * public/sample, which are stock landscapes with no relationship to what any
   * of these posts is about. Describing one would be inventing a caption for a
   * picture that illustrates nothing.
   *
   * Real artwork should always set this.
   */
  imageAlt?: string;
  /** The silo page this post feeds. See the note on the type above. */
  sendsTo: string;
  /**
   * The article itself.
   *
   * Optional on the type and required in practice: a post with no body has no
   * page, and postsWithBody below is what the routes build from. That is
   * deliberate rather than lax. A CMS will happily hand over a draft with an
   * empty body, and the honest response is not to publish a URL for it.
   */
  body?: Block[];
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
/** Every post that has a body, across all categories. What the routes build. */
export async function postsWithBody(): Promise<Post[]> {
  if (!USE_SAMPLE_POSTS) return [];
  const { samplePosts } = await import("@/content/posts-sample");
  return samplePosts.filter((post) => post.body && post.body.length > 0);
}

/**
 * One post by its category and slug.
 *
 * Keyed on both, because slugs are only unique within a category. Two
 * categories are each free to publish something called "getting-started".
 */
export async function postBySlug(
  category: string,
  slug: string,
): Promise<Post | undefined> {
  return (await postsWithBody()).find(
    (post) => post.category === category && post.slug === slug,
  );
}

/**
 * What to read next.
 *
 * Same category first, since somebody reading about cost is more likely to
 * want the next cost piece than the next integration one. Falls back to the
 * other categories rather than showing nothing, and never returns the post
 * being read.
 */
export async function relatedPosts(
  category: string,
  slug: string,
  // Three, which is what docs/blog-structure.md asks for and what fills a
  // row without leaving a widow on its own line.
  limit = 3,
): Promise<Post[]> {
  const all = await postsWithBody();
  const others = all.filter((post) => !(post.category === category && post.slug === slug));

  return [
    ...others.filter((post) => post.category === category),
    ...others.filter((post) => post.category !== category),
  ].slice(0, limit);
}

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
