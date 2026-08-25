import { htmlToBlocks } from "@/lib/html-to-blocks";
import type { Block, Post } from "@/lib/posts";
import type { Job } from "@/lib/careers";

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

/*
 * The body was a dynamic zone of seven components until 24 August 2026, and
 * this file held a `mapBlock` that turned each `__component` into a `Block`.
 * The client asked for a real rich text editor, so it is a CKEditor field now
 * and arrives as one HTML string. The parsing moved to lib/html-to-blocks.ts,
 * which produces the same `Block[]` the renderer always took.
 */

type StrapiPost = {
  slug: string;
  /* Optional in the schema since 25 August 2026, and Strapi returns null for
     an unset enumeration. lib/posts.ts holds those posts back rather than
     listing them, because the category is what builds the URL. */
  category: string | null;
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
  /* Optional in the schema since 25 August 2026, and Strapi returns null for
     an unset string rather than omitting the key. See lib/posts.ts. */
  sendsTo: string | null;
  /** CKEditor output. One HTML string, parsed in lib/html-to-blocks.ts. */
  body: string | null;
};

/**
 * One request to Strapi.
 *
 * Returns null on any failure rather than throwing. A CMS being unreachable is
 * an operational event, and the correct response on a marketing site is to
 * serve what we have and log it, not to hand a visitor a 500. The caller in
 * lib/posts.ts decides what "what we have" means.
 *
 * `tag` names the content type for `next.tags`, so a future revalidation
 * webhook can invalidate posts and jobs independently rather than one
 * `revalidateTag` call clearing both caches, or worse, a job publish
 * revalidating a tag nothing actually reads by.
 */
async function strapiFetch<T>(path: string, tag: string): Promise<T | null> {
  if (!strapiConfigured()) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
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

/** One Strapi entry to one Post. */
function mapPost(entry: StrapiPost): Post {
  const body = htmlToBlocks(entry.body ?? "");
  const image = mediaUrl(entry.image);

  return {
    slug: entry.slug,
    /* Empty string for an unset category rather than null, so the one place
       that decides what to do about it is the filter in lib/posts.ts and
       every consumer downstream still sees a plain string. */
    category: entry.category ?? "",
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
    /* Spread rather than assigned, so an unset one stays absent instead of
       arriving as null and being rendered as an empty href. */
    ...(entry.sendsTo ? { sendsTo: entry.sendsTo } : {}),
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
    /*
      `body` is a plain field now rather than a dynamic zone, so it comes back
      without being asked for and needs no populate line of its own. It had
      `populate[body][populate]=*` while it was components.
    */
    "populate[takeaways]=*",
    "populate[faqs]=*",
    /*
      Not `=*`. A wildcard here asks Strapi to deep-populate the media
      entry's own relations, which walks into the upload plugin's `related`
      morph relation and 400s with "Invalid key related at image.related" on
      this Strapi version. `image` is a single media field with no relations
      of its own worth populating, so `true` (populate this field, one level)
      is both correct and the thing that does not 400. Confirmed against a
      running instance on 24 August 2026: `populate[image]=*` fails,
      `populate[image]=true` returns the same media object.
    */
    "populate[image]=true",
  ].join("&");

  const json = await strapiFetch<StrapiList<StrapiPost>>(`posts?${query}`, "posts");
  if (!json) return null;

  return json.data.map(mapPost);
}

/*
 * ---------------------------------------------------------------------------
 * Jobs. Same shapes and the same reasoning as the post mapping above; kept
 * separate rather than generalised into one shared mapper, because the two
 * content types already differ in exactly the fields you would need to
 * branch on (categories and takeaways here, department and an apply address
 * there), and a shared function would spend more code on the branching than
 * this duplication costs.
 * ---------------------------------------------------------------------------
 */

type StrapiJob = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: Job["employmentType"];
  summary: string;
  applyEmail: string;
  postedDate: string;
  /** CKEditor output. One HTML string, parsed in lib/html-to-blocks.ts. */
  description: string | null;
};

/** One Strapi entry to one Job. */
function mapJob(entry: StrapiJob): Job {
  return {
    slug: entry.slug,
    title: entry.title,
    department: entry.department,
    location: entry.location,
    employmentType: entry.employmentType,
    summary: entry.summary,
    description: htmlToBlocks(entry.description ?? ""),
    applyEmail: entry.applyEmail,
    postedDate: entry.postedDate,
  };
}

/**
 * Every published job listing.
 *
 * `description` is a plain field rather than a dynamic zone or a media
 * relation, so it needs no `populate` line of its own, same as `body` on
 * StrapiPost above.
 */
export async function strapiJobs(): Promise<Job[] | null> {
  const query = ["sort=postedDate:desc", "pagination[pageSize]=100"].join("&");

  const json = await strapiFetch<StrapiList<StrapiJob>>(`jobs?${query}`, "jobs");
  if (!json) return null;

  return json.data.map(mapJob);
}
