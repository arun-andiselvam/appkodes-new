import { strapiPosts } from "@/lib/strapi";

/**
 * Where blog posts come from.
 *
 * !! THIS FILE WAS THE ONLY THING THAT CHANGED WHEN THE CMS WAS PICKED !!
 *
 * The claim above stood untested from 21 August 2026, when MDX in the repo was
 * started and abandoned the same day, until 24 August when Strapi was chosen.
 * It held. `source` below is the only new code, lib/strapi.ts does the fetching
 * and the mapping, and not one component knows that anything changed.
 *
 * Strapi 5, running from cms/ in this repository and deployed separately. See
 * cms/README.md for the setup and lib/strapi.ts for the mapping.
 *
 * Payload was the recommendation on 24 August, because it runs inside this
 * Next app and needs no second deployment. The client chose Strapi, having run
 * it before, which is a better reason than it looks: a CMS nobody on the team
 * can fix at six on a Friday costs more than an extra deployment does.
 *
 * A note for whoever revisits this. Astro is a site framework rather than a
 * CMS, and its content collections are local files, so choosing it would have
 * been closer to choosing MDX than to choosing Strapi. Sanity and Payload are
 * the like for like alternatives if this ever needs replacing.
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
/**
 * One run of text inside a paragraph, carrying at most one mark.
 *
 * !! ONE MARK PER RUN, NOT A TREE !!
 *
 * HTML nests: bold inside a link inside italic is legal and common. This is
 * flat, because the article template renders a run as one element and a tree
 * would mean a recursive renderer for a gain nobody has asked for. The parser
 * in lib/html-to-blocks.ts keeps the innermost mark and drops the rest of the
 * formatting rather than dropping the words.
 */
export type Inline = {
  mark: "none" | "strong" | "em" | "link";
  text: string;
  /** Set when `mark` is "link". A site path or a full URL. */
  href?: string;
};

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
  | {
      kind: "p";
      text: string;
      links?: { phrase: string; href: string }[];
      /**
       * The same paragraph with its inline formatting, when it came from the
       * CMS rather than from a content file.
       *
       * !! ADDITIVE ON PURPOSE. `text` STAYS REQUIRED !!
       *
       * CKEditor arrived on 24 August 2026 and brought bold, italic and real
       * anchors, none of which `text` plus `links` can express: that pair
       * names a phrase and asks the renderer to find it, which works for prose
       * written by hand and not for arbitrary marked up runs.
       *
       * Rather than convert the ten sample posts and every future content file
       * to a new shape, `rich` is optional and the renderer prefers it when it
       * is there. A block with `rich` renders the runs. A block without falls
       * back to `Linked`, exactly as before. Both paths stay live because both
       * sources stay live.
       *
       * `text` is still filled in when `rich` is present, holding the same
       * words with the marks stripped. Anything that needs the plain string,
       * the reading time estimate and the editorial checks among them, keeps
       * working without knowing which source a post came from.
       */
      rich?: Inline[];
    }
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
  /**
   * The silo page this post feeds. See the note on the type above.
   *
   * !! OPTIONAL SINCE 25 AUGUST 2026, AND THAT IS A REAL LOSS !!
   *
   * It was required, and the note above still explains why it should be: a
   * post that routes nowhere spends a reader's attention and returns none of
   * it. The client made it optional in Strapi so an external content tool
   * could publish without supplying one. Typing it as a guaranteed string
   * after that would be a lie the renderer pays for - it drew
   * `<Link href="">`, a dead link, on any post the tool wrote.
   *
   * components/sections/post.tsx now omits the silo link when this is absent
   * rather than drawing one that goes nowhere.
   */
  sendsTo?: string;
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
 * !! THE SAMPLES ARE GONE. THIS WAS THE FLAG THAT GATED THEM !!
 *
 * True served the ten invented posts in content/posts-sample.ts as a
 * fallback whenever Strapi was not configured or unreachable. Turned on 21
 * August 2026 for a design review, demoted to a fallback on 24 August when
 * Strapi was wired up, and turned off for good on 25 August once the site
 * was genuinely live: a real visitor was seeing them, on production, under
 * the company's own name, because a typo (`TRAPI_URL`) had left `STRAPI_URL`
 * unset in the deployed environment the whole time. That is exactly the
 * "CMS was unreachable" case this flag existed to survive gracefully for a
 * developer's laptop, and exactly the case its own comment said would not be
 * a defence anybody would accept in production. content/posts-sample.ts is
 * deleted with it.
 *
 * Set STRAPI_URL and STRAPI_API_TOKEN (or leave them unset on a machine with
 * no CMS to point at) and `source` below now has exactly two states: real
 * posts, or none.
 */

/** How many posts a category page shows before paging. */
export const POSTS_PER_PAGE = 4;

/**
 * Every post, from Strapi if it is configured and reachable, empty
 * otherwise.
 *
 * A Strapi failure returns null rather than throwing, so an outage falls
 * through to the same branch as a laptop with no CMS. That is deliberate on a
 * marketing site: a visitor gets a page, and the error is in the server log
 * where somebody can act on it. What used to sit in that branch was ten
 * invented articles; now it is the category's own honest empty state. See
 * the note above for why.
 */
async function source(): Promise<Post[]> {
  return (await strapiPosts()) ?? [];
}

/**
 * Posts in one category, newest first.
 *
 * Async on purpose since before there was anything to await. A CMS fetch is
 * async, and having the call sites already await meant adopting one touched
 * this file and nothing else. It did.
 */
export async function postsIn(category: string): Promise<Post[]> {
  return (await source())
    .filter((post) => post.category === category)
    .sort((a, b) => b.published.localeCompare(a.published));
}

/**
 * Every post, newest first, whatever category it is in.
 *
 * What /blog lists. The category pages exist because the silo needs them and
 * because a reader arriving on "AI integration guides" should land somewhere
 * about that; this is the other reader, the one who wants to see everything
 * that has been written in the order it was written. Added 25 August 2026 at
 * the client's request.
 */
export async function allPosts(): Promise<Post[]> {
  return (await source()).sort((a, b) => b.published.localeCompare(a.published));
}

/**
 * One page of the full list, same contract as pageOfPostsIn below.
 */
export async function pageOfAllPosts(
  pageNumber: number,
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  return paginate(await allPosts(), pageNumber);
}

/**
 * Shared by both pagers, so the two can never disagree about what page two
 * means or about what an out of range page returns.
 */
function paginate(all: Post[], pageNumber: number) {
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const start = (pageNumber - 1) * POSTS_PER_PAGE;

  return {
    posts:
      pageNumber >= 1 && pageNumber <= totalPages
        ? all.slice(start, start + POSTS_PER_PAGE)
        : [],
    total: all.length,
    totalPages,
  };
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
/**
 * Every post that has a body, across all categories. What the routes build.
 *
 * The body check matters more with a CMS behind it than it did with samples.
 * Strapi's draft and publish means a half written article exists as a record
 * long before it should have a URL, and the note on `body` above says the
 * honest response is not to publish one for it.
 */
export async function postsWithBody(): Promise<Post[]> {
  return (await source()).filter((post) => post.body && post.body.length > 0);
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
  return paginate(await postsIn(category), pageNumber);
}
