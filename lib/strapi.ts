import type { Block, Post } from "@/lib/posts";

/**
 * The Strapi client, and the map from its shapes to ours.
 *
 * !! NOTHING OUTSIDE THIS FILE KNOWS STRAPI EXISTS !!
 *
 * lib/posts.ts said for three days that the CMS decision was the only thing
 * left and that adopting one was "a mapping function rather than a rewrite of
 * the renderer". This is that mapping function. Every component still receives
 * a `Post` with a `Block[]` body and has no idea where it came from, which is
 * what makes swapping Strapi out later cost one file.
 *
 * Chosen on 24 August 2026. Payload was the recommendation, because it runs
 * inside this Next app and needs no second deployment. The client picked
 * Strapi and the reason is a good one: they have run it before, and a CMS
 * nobody on the team can fix at six on a Friday is worse than one that is
 * architecturally tidy. Recorded so the decision does not get relitigated.
 *
 * Strapi lives in cms/ in this repository and deploys separately. See
 * cms/README.md.
 *
 * !! THIS IS STRAPI 5 AND THE RESPONSE SHAPE IS FLAT !!
 *
 * Strapi 4 nested every field under `data.attributes`. Strapi 5 flattened it,
 * so a title is `data.title` rather than `data.attributes.title`, and entries
 * carry a `documentId` alongside the numeric `id`. Verified against
 * docs.strapi.io on 24 August 2026. Any tutorial written before v5 will
 * disagree with this file, and the tutorial is the one that is wrong.
 */

/**
 * Where Strapi is, and the token to read it with.
 *
 * !! BOTH UNSET IS A SUPPORTED STATE, NOT A CRASH !!
 *
 * The same bargain `CONTACT_WEBHOOK_URL` makes in app/api/contact/route.ts. A
 * developer cloning this repo without a CMS to point at gets the sample posts
 * and a working site, rather than a stack trace on every route. The switch is
 * in lib/posts.ts.
 *
 * The token must be read only. It ships in no client bundle, since every call
 * here runs on the server, but a read only token limits the damage if one ever
 * leaks into a log.
 */
const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export function strapiConfigured(): boolean {
  return Boolean(STRAPI_URL && STRAPI_TOKEN);
}

/**
 * How long a fetched list stays cached.
 *
 * !! NOT `no-store`, AND NOT INFINITE !!
 *
 * `no-store` would hit Strapi on every request, which turns a CMS outage into
 * a site outage and makes every page render wait on a network call. Caching
 * forever means an editor publishes and nothing changes until the next deploy.
 *
 * Fifteen minutes is the compromise while there is no webhook. When somebody
 * wires Strapi's publish webhook to a revalidation route, this becomes a tag
 * based revalidate and the number stops mattering.
 */
const REVALIDATE_SECONDS = 900;

/** What Strapi returns for a collection query. Flat, per v5. */
type StrapiList<T> = { data: T[] };

/**
 * A media field as Strapi returns it.
 *
 * Nullable because a post may ship without artwork, which lib/posts.ts already
 * treats as legitimate rather than as an error.
 */
type StrapiMedia = {
  url: string;
  alternativeText: string | null;
} | null;

/**
 * One entry of the body dynamic zone.
 *
 * Strapi tags every component in a dynamic zone with `__component`, which is
 * the discriminant our `Block` union needs. The names below are the component
 * UIDs defined in cms/src/components/content, and the two lists have to be
 * kept in step by hand. `mapBlock` throws on an unknown one rather than
 * dropping it silently, because a block that vanishes from an article is the
 * kind of bug nobody notices until a client asks where their table went.
 */
type StrapiBlock = {
  __component: string;
  [key: string]: unknown;
};

type StrapiPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  published: string;
  updated: string | null;
  readingMinutes: number | null;
  author: string | null;
  takeaways: { text: string }[] | null;
  faqs: { question: string; answer: string }[] | null;
  image: StrapiMedia;
  imageAlt: string | null;
  sendsTo: string;
  body: StrapiBlock[] | null;
};

/**
 * One request to Strapi.
 *
 * Returns null on any failure rather than throwing. A CMS being unreachable is
 * an operational event, and the correct response on a marketing site is to
 * serve what we have and log it, not to hand a visitor a 500. The caller in
 * lib/posts.ts decides what "what we have" means.
 */
async function strapiFetch<T>(path: string): Promise<T | null> {
  if (!strapiConfigured()) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["posts"] },
    });

    if (!res.ok) {
      console.error(`Strapi ${res.status} for /api/${path}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("Strapi unreachable", error);
    return null;
  }
}

/**
 * Words per minute, for the reading estimate.
 *
 * `readingMinutes` is on the Post type as a number that was "calculated at
 * ingest rather than in the component". Strapi has a field for it so an editor
 * may override, and this computes it when they have not. 220 is the ordinary
 * figure for prose on a screen and the number matters less than it being the
 * same for every post.
 */
const WORDS_PER_MINUTE = 220;

function readingMinutesFor(blocks: Block[]): number {
  const words = blocks
    .map((block) => {
      switch (block.kind) {
        case "p":
        case "h2":
        case "h3":
        case "quote":
        case "callout":
          return block.text;
        case "list":
          return block.items.join(" ");
        case "table":
          return [...block.head, ...block.rows.flat()].join(" ");
        case "figure":
          return block.caption;
      }
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** A media URL, made absolute. Strapi returns relative ones on local uploads. */
function mediaUrl(media: StrapiMedia): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

/**
 * One dynamic zone entry to one Block.
 *
 * !! THROWS ON AN UNKNOWN COMPONENT, ON PURPOSE !!
 *
 * The tempting alternative is to return null and filter. That turns "somebody
 * added a component in the Strapi admin that this site does not render" into
 * an article with a hole in it that reads fine and is missing a paragraph.
 * Failing loudly puts the error in the build log where somebody sees it.
 */
function mapBlock(block: StrapiBlock): Block {
  switch (block.__component) {
    case "content.paragraph":
      return {
        kind: "p",
        text: String(block.text ?? ""),
        ...(Array.isArray(block.links) && block.links.length > 0
          ? {
              links: (block.links as { phrase: string; href: string }[]).map((l) => ({
                phrase: l.phrase,
                href: l.href,
              })),
            }
          : {}),
      };

    /*
     * One component for both heading levels, with the level as a field. Two
     * components would let an editor pick "Heading 3" first, and the contents
     * panel and Google both read the h2/h3 hierarchy. A field with two options
     * is no harder to author and keeps the pair visibly related.
     */
    case "content.heading":
      return { kind: block.level === "h3" ? "h3" : "h2", text: String(block.text ?? "") };

    case "content.list":
      return {
        kind: "list",
        items: ((block.items as { text: string }[] | null) ?? []).map((i) => i.text),
      };

    case "content.quote":
      return { kind: "quote", text: String(block.text ?? "") };

    case "content.callout":
      return { kind: "callout", text: String(block.text ?? "") };

    /*
     * Head and rows arrive as repeatable components of joined cells rather
     * than as a JSON field. A JSON field would let an editor save a table with
     * four headers and three cells in a row, and the renderer would draw a
     * broken grid. This is not airtight either, but a repeatable row of text
     * is something a non-technical editor can actually fill in.
     */
    case "content.table":
      return {
        kind: "table",
        head: ((block.head as { text: string }[] | null) ?? []).map((c) => c.text),
        rows: ((block.rows as { cells: { text: string }[] }[] | null) ?? []).map((r) =>
          (r.cells ?? []).map((c) => c.text),
        ),
      };

    /*
     * alt and caption are both required on the Block type, deliberately, and
     * they are required in the Strapi schema for the same reason. Strapi will
     * not let an editor publish a figure without them, so the empty string
     * fallbacks here should be unreachable.
     */
    case "content.figure":
      return {
        kind: "figure",
        src: mediaUrl(block.file as StrapiMedia) ?? "",
        alt: String(block.alt ?? ""),
        caption: String(block.caption ?? ""),
      };

    default:
      throw new Error(
        `Unknown Strapi component "${block.__component}". Add it to mapBlock in lib/strapi.ts, or remove it from the Strapi content model.`,
      );
  }
}

/** One Strapi entry to one Post. */
function mapPost(entry: StrapiPost): Post {
  const body = (entry.body ?? []).map(mapBlock);
  const image = mediaUrl(entry.image);

  return {
    slug: entry.slug,
    category: entry.category,
    title: entry.title,
    excerpt: entry.excerpt,
    published: entry.published,
    ...(entry.updated ? { updated: entry.updated } : {}),
    readingMinutes: entry.readingMinutes || readingMinutesFor(body),
    /*
     * The Post type's note on `author` says an organisation rather than a
     * person until there are real bylines, because a named author with an
     * invented biography is an E-E-A-T liability. Strapi has the field so a
     * real byline can be set, and this is the fallback when it is empty.
     */
    author: entry.author || "Hitasoft",
    takeaways: (entry.takeaways ?? []).map((t) => t.text),
    ...(entry.faqs && entry.faqs.length > 0 ? { faqs: entry.faqs } : {}),
    ...(image ? { image } : {}),
    ...(entry.imageAlt ? { imageAlt: entry.imageAlt } : {}),
    sendsTo: entry.sendsTo,
    ...(body.length > 0 ? { body } : {}),
  };
}

/**
 * Every published post, newest first.
 *
 * One request for all of them rather than one per category. The catalogue is
 * tens of articles rather than thousands, the whole set is needed for the
 * "read next" row anyway, and one cached response beats four.
 *
 * `populate` is explicit. Strapi 5 returns no relations or components unless
 * asked, and `populate=*` does not reach inside a dynamic zone, so the body
 * would come back as an array of empty objects. That failure is quiet: the
 * request succeeds, the article renders with no content, and nothing logs.
 */
export async function strapiPosts(): Promise<Post[] | null> {
  const query = [
    "sort=published:desc",
    "pagination[pageSize]=100",
    "populate[body][populate]=*",
    "populate[takeaways]=*",
    "populate[faqs]=*",
    "populate[image]=*",
  ].join("&");

  const json = await strapiFetch<StrapiList<StrapiPost>>(`posts?${query}`);
  if (!json) return null;

  return json.data.map(mapPost);
}
