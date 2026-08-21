import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { pageOfPostsIn, type Post } from "@/lib/posts";
import type { ResourceCategory } from "@/content/resources";

/**
 * A blog category page, where the list of posts is the page.
 *
 * !! THIS IS NOT A SERVICE PAGE AND MUST NOT BE BUILT LIKE ONE !!
 *
 * It was, briefly, on 21 August 2026. The argument for giving a category page
 * its own passage is sound, and it got over applied: the passage took the top
 * of the page in the narrow title and wide column split the service and
 * industry pages use, with the posts pushed underneath a second bordered grid.
 * A reader arriving from the menu to read something met an essay about the
 * category instead.
 *
 * So the order is a blog's order. Title, the other categories, then the posts.
 * The passage still exists, because a category with no prose of its own ranks
 * for nothing and gets outranked by its own children, but it sits below the
 * list where a note about a section belongs. See `pillar` in
 * content/resources.ts for the ranking reasoning.
 *
 * The list is an editorial index rather than a card grid: a date column, a
 * headline, one line of excerpt, hairlines between. The card grids on this
 * site belong to the service and industry pages, and a feed that looks like a
 * capability grid is the other half of why this page read wrong.
 *
 * Async because posts come from lib/posts.ts, the seam a CMS plugs into later.
 * Nothing here knows where a post came from.
 */
export async function ResourceCategoryPage({
  path,
  category,
  pageNumber = 1,
}: {
  path: string;
  category: ResourceCategory;
  /** 1 based, matching the URL. Page one is the category's own path. */
  pageNumber?: number;
}) {
  const { posts, total, totalPages } = await pageOfPostsIn(path, pageNumber);

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-10 lg:pb-14">
        <Container>
          <Breadcrumbs path={path} />
          <Eyebrow className="mb-6">{category.eyebrow}</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            {category.title}
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {category.lede}
          </p>
        </Container>
      </Section>

      {/*
        !! THERE WAS A CATEGORY TAB ROW HERE AND IT WAS REDUNDANT !!

        Added 21 August 2026 on the reasoning that every blog has one, removed
        the same day. The argument did not survive looking at the page.

        The Resources mega-menu already links all three categories from every
        page on the site, so the tabs gave a crawler nothing it did not
        already have, and the internal linking case for them was empty. What
        was left was a second orientation device sitting directly under the
        breadcrumb, which had already told the reader where they were.

        If lateral movement between categories is wanted back, the place for it
        is beside "Read next" at the foot of the page, not stacked on the
        breadcrumb.
      */}

      {/* The posts. The reason anybody opened this page. */}
      <Section spacing="none" className="pt-4 pb-20 lg:pb-28">
        <Container>
          {posts.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between gap-4 pb-2">
                {/*
                  "Latest" is only true on the first page. Page three of an
                  archive showing a heading that says Latest is a small lie the
                  reader can see through immediately.
                */}
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {pageNumber > 1 ? `Page ${pageNumber}` : "Latest"}
                </h2>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {total} {total === 1 ? "piece" : "pieces"}
                </span>
              </div>
              {/*
                Two across. POSTS_PER_PAGE is four, so a full page is exactly
                two rows of two and never leaves a widow on its own line.

                It was a full width row per post, which gave a two line
                headline and a one line excerpt the whole page to sit in and
                left most of it empty. There is not enough copy per post to
                earn that width.
              */}
              <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </ul>
              <Pagination base={path} current={pageNumber} totalPages={totalPages} />
            </>
          ) : (
            <EmptyState planned={category.planned} />
          )}
        </Container>
      </Section>

      {/*
        The category's own passage, below the list.

        Kept because a page that only lists links has nothing an answer engine
        can quote and no reason to rank for its own category term. Placed here
        rather than at the top because this is a blog index and the posts come
        first. Google reads the whole page.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{category.pillar.heading}</SectionTitle>
          <p className="mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
            {category.pillar.body}
          </p>
          <dl className="mt-12 grid gap-10 md:grid-cols-3">
            {category.pillar.points.map((point) => (
              <div key={point.title} className="border-t border-foreground/15 pt-5">
                <dt className="font-display text-xl tracking-tight">{point.title}</dt>
                <dd className="mt-3 text-muted-foreground leading-relaxed">{point.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <Eyebrow className="mb-6">Read next</Eyebrow>
          <SectionTitle className="max-w-2xl">
            The pages these point at.
          </SectionTitle>

          <div className="mt-12 grid gap-px bg-foreground/10 border border-foreground/10 md:grid-cols-3">
            {category.sends.map((send) => (
              <Link
                key={send.href}
                href={send.href}
                className="group/card bg-background p-8 lg:p-10"
              >
                <span className="text-2xl font-display tracking-tight inline-flex items-center gap-2">
                  {send.name}
                  <ArrowRight
                    aria-hidden
                    className="w-4 h-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0"
                  />
                </span>
                <span className="mt-3 block text-muted-foreground leading-relaxed">
                  {send.blurb}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * One post in the index.
 *
 * Unreachable today, because lib/posts.ts returns an empty list until a source
 * is picked. Written now so that adopting a CMS is one function body and no
 * component work.
 *
 * A row rather than a card, with the date in its own column. That is what a
 * publication index looks like, and it is deliberately not the bordered card
 * grid the service and industry pages use.
 *
 * The date is a <time> with a machine readable dateTime. Anything reading
 * freshness off this list needs the attribute, since "25 Aug 2026" is not a
 * date to anything but a person.
 */
function PostCard({ post }: { post: Post }) {
  return (
    <li>
      {/*
        Thumbnail left, copy right, two of these per row.

        The image went full bleed across the top of the card for one revision
        and it was too much picture for the amount of writing underneath it. A
        headline and one line of excerpt cannot hold up a 3:2 photograph at
        half the page width.

        Ten rem of thumbnail against the rest is close to the proportion the
        full width row had, so the card keeps that reading while fitting two to
        a line.
      */}
      <Link
        href={`${post.category}/${post.slug}`}
        className="group/post grid grid-cols-[minmax(0,10rem)_1fr] items-start gap-5"
      >
        {post.image ? (
          /*
            The featured image, with the date sitting on it.

            !! THE DATE STAYS REAL TEXT ON TOP OF THE PICTURE !!

            It is a <time> with a machine readable dateTime, positioned over
            the artwork rather than baked into it. Anything reading freshness
            off this index, a crawler included, needs the attribute, and a date
            rendered into a bitmap is invisible to all of it.

            The gradient runs from opaque black at the bottom to nothing at the
            midpoint, which is the whole reason it is here: a photograph can be
            any colour at the bottom edge, and white type on an unknown
            background is a coin toss. Black at 85 percent under white text
            clears 4.5:1 whatever the image does underneath.

            alt is empty on purpose. The card is a single link whose accessible
            name is already the headline, so describing the picture as well
            would have a screen reader announce the same item twice.
          */
          <span className="relative block aspect-[4/3] w-full overflow-hidden">
            <Image
              src={post.image}
              alt=""
              fill
              sizes="10rem"
              className="object-cover transition-transform duration-500 group-hover/post:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
            />
            {/* Stacked rather than on one line. At ten rem the two labels do
                not sit side by side without wrapping mid word. */}
            <span className="absolute inset-x-0 bottom-0 p-3 font-mono text-[10px] uppercase tracking-widest leading-tight text-white">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span className="mt-0.5 block text-white/75">
                {post.readingMinutes} min read
              </span>
            </span>
          </span>
        ) : (
          /* No artwork. A rule and plain type rather than an empty grey box
             the size of a picture. */
          <span className="block border-t border-foreground/15 pt-3 font-mono text-[10px] uppercase tracking-widest leading-tight text-muted-foreground">
            <time dateTime={post.published}>{formatDate(post.published)}</time>
            <span className="mt-0.5 block">{post.readingMinutes} min read</span>
          </span>
        )}

        <span>
          <span className="flex items-start gap-2 font-display text-xl tracking-tight leading-tight">
            {post.title}
            <ArrowRight
              aria-hidden
              className="mt-1 w-4 h-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/post:opacity-100 group-hover/post:translate-x-0"
            />
          </span>
          <span className="mt-2.5 block text-sm text-muted-foreground leading-relaxed">
            {post.excerpt}
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * What sits where the index goes until there is something to put in it.
 *
 * Same row shape as a real post, so the page does not change layout the week
 * the first one lands. The titles are marked as unwritten in one line and are
 * not links, because a link is a promise of somewhere to go.
 * content/resources.ts carries the full reasoning: placeholder cards tell a
 * visitor the site is unfinished and waste the click as well.
 */
function EmptyState({ planned }: { planned: string[] }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pb-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Being written
        </h2>
      </div>
      <p className="max-w-2xl pb-6 text-muted-foreground leading-relaxed">
        Nothing is published here yet. These are the pieces being written first,
        listed as titles rather than links because none of them exists.
      </p>
      {/* Two across on the same grid as the cards, so the page does not change
          shape the week the first real post lands. */}
      <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {planned.map((title, i) => (
          <li
            key={title}
            className="grid grid-cols-[minmax(0,10rem)_1fr] items-start gap-5"
          >
            <span className="block border-t border-foreground/15 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl tracking-tight leading-tight text-muted-foreground/70">
              {title}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * "25 Aug 2026".
 *
 * en-GB with an explicit UTC timezone, so a build machine in one place and a
 * reader in another never see the date land on different days.
 */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
