import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { SectionTitle } from "@/components/primitives/section-title";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BodyBlock } from "@/components/primitives/rich-text";
/*
 * The contents panel is the one client component on this page. It follows the
 * reader's position down the article, which cannot be done in CSS. Everything
 * else here, this file included, stays server rendered. See the note at the
 * top of that file for why the exception was worth making.
 */
import { Contents } from "@/components/sections/post-contents";
import { resourceCategories } from "@/content/resources";
import { actions, site } from "@/content/site";
import { postHref, type Block, type Post } from "@/lib/posts";

/**
 * One article, built to docs/blog-structure.md.
 *
 * The shape is the one a long read wants and the rest of this site does not:
 * a single column of prose at a readable measure, with a contents panel
 * holding beside it. Everything else here is section work, where the width is
 * the point. An article's width is a constraint.
 *
 * !! THE MEASURE IS THE MOST IMPORTANT NUMBER ON THIS PAGE !!
 *
 * The prose column is capped in ch rather than px, so it holds roughly 68
 * characters whatever the font does. Long lines are the single most common way
 * a well written article goes unread: the eye loses the line it is on when it
 * travels back to the left margin, and the reader assumes they are bored when
 * they are actually just lost.
 *
 * Against the blueprint, in its order: breadcrumbs, h1, standfirst, the hero
 * with the key takeaways laid over it, then a column holding the article
 * facts and the contents beside the body, an inline call to action, the
 * author box, and related reading. The schema is emitted by the route.
 */
export function PostPage({ post, related }: { post: Post; related: Post[] }) {
  const headings = (post.body ?? []).filter(
    (block): block is Extract<Block, { kind: "h2" | "h3" }> =>
      block.kind === "h2" || block.kind === "h3",
  );

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-10 lg:pb-14">
        <Container>
          {/*
            A real breadcrumb trail, which the blueprint asks for and which the
            first version of this page replaced with a single back link. The
            trail is the thing that makes the silo legible to a reader who
            arrived from search three levels down, and it reads off the same
            navigation tree the header does.

            !! `visible` IS PASSED HERE AND ALMOST NOWHERE ELSE !!

            The component draws nothing by default, because the client asked on
            24 August 2026 for the trail off the service, industry and resource
            pages. They asked for it back on an article on 26 August, and an
            article is the right exception: it is the page most likely to be
            somebody's first, landed on from a search result by a reader with
            no idea what the rest of the site holds.

            !! path IS "/blog", NOT post.category, AND THAT IS NOT COSMETIC !!

            It was the category until the category became optional. trailFor
            returns just Home for a path it cannot find in the menu, and the
            component draws nothing when the trail is shorter than two, so an
            uncategorised post had no trail and no BreadcrumbList schema at all.
            /blog is where every article actually lives now, it is in the menu
            tree, and it is the same for every post whatever it is tagged.
          */}
          <Breadcrumbs
            path="/blog"
            visible
            leaf={{ name: post.title, href: postHref(post) }}
          />

          <h1 className="max-w-4xl font-display text-4xl lg:text-6xl tracking-tight leading-[1.03]">
            {post.title}
          </h1>

          {/*
            The excerpt does double duty as the standfirst. It is already
            written to say what the piece is for, it is what the index card
            shows, and it is the meta description, so a separate intro line
            would be a third version of the same sentence.
          */}
          <p className="mt-8 max-w-3xl text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </Container>
      </Section>

      <Hero post={post} />

      <Section spacing="none" className="pb-20 lg:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20">
            {/*
              !! THE STICKY BOX IS THE INNER DIV, NOT THE WHOLE COLUMN !!

              The entire aside was sticky and `h-fit` until 26 August 2026, and
              on a real article that was worse than not sticky at all. This
              piece has fourteen headings, so the facts plus the contents plus
              the service card came to more than a screen. A sticky block
              taller than the viewport pins its top and parks its bottom off
              the end of the screen, where the only way to reach it is to
              scroll the article to its finish - by which point nobody needs a
              contents list.

              So the column no longer sticks as one piece. The article facts
              scroll away with the page, which is right: they are read once,
              at the start, to decide whether to read the rest. Only the
              contents and the service link travel, and they are capped to the
              viewport with the list scrolling inside itself.

              `h-fit` had to go with it. It made the aside only as tall as its
              own content, and a sticky child can only travel inside its
              parent's box, so the panel would have stuck for about eighty
              pixels. The grid stretches the column to the row height instead,
              which is as tall as the article.
            */}
            <aside>
              <Facts post={post} />

              {/*
                !! THIS BOX IS THE ONLY THING BOUND TO THE VIEWPORT !!

                It is a flex column capped at the screen height less the sticky
                offset above it and a little air below. Its children then divide
                that up between them: the contents list takes `flex-1` and
                whatever is left, the service card takes the height it needs.

                That replaced a fixed `calc(100vh - 24rem)` on the list itself,
                which was a guess at how much room the label and the card wanted
                and was wrong in both directions. An article with no `sendsTo`
                reserved space for a card that did not exist and stopped its
                list halfway up a screen with room for all of it.
              */}
              <div className="mt-10 lg:sticky lg:top-32 lg:flex lg:max-h-[calc(100vh-10rem)] lg:flex-col">
                {headings.length > 1 && <Contents headings={headings} />}
                {/* Omitted rather than drawn empty when a post has no silo
                    target. See the note on `sendsTo` in lib/posts.ts. */}
                {post.sendsTo && (
                  <SiloLink href={post.sendsTo} className="mt-10 lg:shrink-0" />
                )}
              </div>
            </aside>

            {/*
              The article. Capped in ch, and every block styled here rather
              than by a prose plugin, so the type scale is the same one the
              rest of the site uses.
            */}
            <article className="max-w-[68ch]">
              {(post.body ?? []).map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}

              {/*
                The inline call to action, at the foot of the article rather
                than floating mid text. The blueprint offers either, and
                interrupting a reader halfway through the thing they chose to
                read to sell them something is how a good article gets closed.

                It names the specific next step rather than "contact us", which
                is what the blueprint asks for and what docs/positioning.md
                says converts this buyer: a first step small enough to say yes
                to without a board.
              */}
              <div className="mt-16 border-t border-foreground/15 pt-10">
                <p className="font-display text-2xl tracking-tight leading-snug">
                  Wondering what this would take against your own systems?
                </p>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  The audit costs nothing, and you keep the costed plan and
                  the risks whether you go ahead or not.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 h-14 rounded-full bg-primary px-8 text-base text-primary-foreground has-[>svg]:px-8 hover:bg-primary/90 group/cta"
                >
                  <Link href={actions.book}>
                    Book a free automation audit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-display text-2xl lg:text-3xl tracking-tight">
                    Common questions
                  </h2>
                  <div className="mt-8 border-t border-foreground/10">
                    {post.faqs.map((faq) => (
                      <details
                        key={faq.question}
                        className="group border-b border-foreground/10"
                      >
                        <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 list-none [&::-webkit-details-marker]:hidden">
                          <h3 className="font-display text-lg tracking-tight">
                            {faq.question}
                          </h3>
                          <span
                            aria-hidden
                            className="mt-0.5 shrink-0 text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <p className="pb-5 pr-8 leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <AuthorBox author={post.author} />
            </article>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section spacing="tight" className="border-t border-foreground/10">
          <Container>
            <SectionTitle>Read next</SectionTitle>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {/*
                !! THESE LINKS WERE BUILT BY HAND AND WERE BROKEN !!

                The href was `${other.category}/${other.slug}`, from when the
                category was part of the address. It stopped being that on 25
                August 2026, and for an uncategorised post this produced
                "/some-slug": a link off the front of the site to a page that
                does not exist. postHref is the one place that knows where an
                article lives; nothing here should be composing that string.
              */}
              {related.map((other) => (
                <li key={other.slug}>
                  <Link href={postHref(other)} className="group/rel block">
                    {other.image && (
                      <span className="relative block aspect-[3/2] w-full overflow-hidden">
                        <Image
                          src={other.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover/rel:scale-[1.04]"
                        />
                      </span>
                    )}
                    <span className="mt-5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {resourceCategories[other.category]?.title ?? "Resources"}
                    </span>
                    <span className="mt-2 flex items-start gap-2 font-display text-xl tracking-tight leading-tight">
                      {other.title}
                      <ArrowRight
                        aria-hidden
                        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/rel:opacity-100 group-hover/rel:translate-x-0"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}

/**
 * The hero: the artwork, with the key takeaways laid over it.
 *
 * !! THIS IS THE BLOCK AN ANSWER ENGINE WILL TAKE !!
 *
 * docs/blog-structure.md puts the takeaways immediately under the hero for
 * exactly that reason. Something looking for a quotable answer takes the
 * compressed version over the prose almost every time, so the compressed
 * version has to be the real claim rather than a teaser for it. The client
 * asked on 26 August 2026 for it to sit on the picture instead of under it,
 * which costs nothing here: it is still the first prose on the page, still
 * an <h2> with a list under it, and still the first thing in the markup after
 * the standfirst. Only its background changed.
 *
 * !! THE SCRIM IS NOT DECORATION. WITHOUT IT THIS IS UNREADABLE !!
 *
 * The artwork is whatever the CMS holds, so it can be a bright photograph on
 * any given post and nothing here can predict it. A gradient alone leaves the
 * top of the list sitting on the raw image, so the overlay carries a flat
 * blur as well and the gradient only deepens it towards the text. That pairing
 * is what makes white type safe against artwork nobody has seen yet.
 *
 * !! THE HEIGHT IS A MINIMUM, NOT AN ASPECT RATIO, WHEN TEXT IS ON IT !!
 *
 * The plain hero is 21:9, which is 156px tall on a phone and fine for a
 * picture. Three takeaways do not fit in 156px, and a fixed ratio would clip
 * them or spill them out of the frame. A min-height lets the block grow to
 * whatever the takeaways need while the image covers it, and being a stated
 * number rather than content-derived it costs no layout shift.
 */
function Hero({ post }: { post: Post }) {
  const takeaways = post.takeaways;

  /* Nothing to draw. A post with neither artwork nor takeaways goes straight
     from the standfirst to the body. */
  if (!post.image && takeaways.length === 0) return null;

  /* No artwork, but there are takeaways: the tinted panel this used to be. */
  if (!post.image) {
    return (
      <Section spacing="none" className="pb-16 lg:pb-20">
        <Container>
          <aside
            aria-labelledby="takeaways"
            className="max-w-3xl bg-foreground/[0.03] p-8 lg:p-10"
          >
            <TakeawaysHeading />
            <ul className="mt-6 space-y-4">
              {takeaways.map((line) => (
                <li key={line} className="flex gap-4 text-lg leading-relaxed">
                  <Bullet className="bg-foreground/40" />
                  {line}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="none" className="pb-14 lg:pb-20">
      <Container>
        <div className="relative isolate w-full overflow-hidden">
          {/*
            alt is empty unless the artwork has something to describe. See
            the note on imageAlt in lib/posts.ts: the placeholders in
            public/sample illustrate nothing, and inventing a description
            for them would be worse than saying nothing.
          */}
          {/*
            !! `priority` IS DEPRECATED IN NEXT 16 AND IT WAS COSTING US LCP !!

            It was `priority`, which in every earlier Next did two jobs: put a
            <link rel="preload"> in the head, and mark the request high
            priority. Next 16 split them, deprecated `priority`, and the half
            it kept doing here was the preload. Nothing was setting
            fetchpriority, so the hero was preloaded and then queued at the
            browser's ordinary image priority.

            The waterfall from the live site on 26 August 2026 shows exactly
            what that cost. Three font files, which the browser does treat as
            High, opened at 515ms. The hero opened at 537ms, behind 85 KB of
            them, and PageSpeed's own LCP request discovery audit failed on
            "fetchpriority=high should be applied to the image preload
            request" while passing both of its other checks.

            preload puts the link back and fetchPriority puts the image in
            front of the fonts. The article's own picture outranks the face it
            is captioned in.
          */}
          <Image
            src={post.image}
            alt={post.imageAlt ?? ""}
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1400px) 1320px, 100vw"
            className="object-cover"
          />

          {takeaways.length === 0 ? (
            /* Spacer. `fill` needs the parent to have a height of its own,
               and with no text in the box there is nothing to give it one. */
            <div className="aspect-[21/9]" />
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/35 backdrop-blur-[2px]"
              />
              <aside
                aria-labelledby="takeaways"
                className="relative flex min-h-[26rem] sm:min-h-[28rem] lg:min-h-[34rem] flex-col justify-end p-6 sm:p-10 lg:p-14 text-white"
              >
                <TakeawaysHeading className="text-white/70" />
                <ul className="mt-5 max-w-4xl space-y-4">
                  {takeaways.map((line) => (
                    <li
                      key={line}
                      className="flex gap-4 text-base sm:text-lg leading-relaxed [text-shadow:0_1px_3px_rgb(0_0_0/0.55)]"
                    >
                      <Bullet className="bg-white/70" />
                      {line}
                    </li>
                  ))}
                </ul>
              </aside>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}

function TakeawaysHeading({ className = "text-muted-foreground" }) {
  return (
    <h2
      id="takeaways"
      className={`font-mono text-xs uppercase tracking-widest ${className}`}
    >
      Key takeaways
    </h2>
  );
}

function Bullet({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${className}`}
    />
  );
}

/**
 * Who wrote it, when, and how long it takes to read.
 *
 * !! THIS WAS A BYLINE UNDER THE TITLE UNTIL 26 AUGUST 2026 !!
 *
 * One mono line of "Author · date · 12 min read" sat between the standfirst
 * and the hero, which put three facts nobody reads in the way of the picture
 * everybody does. The client asked for it moved into the column beside the
 * article, in the same label-over-value rows the case study pages use for
 * company facts. That layout is doing the same job in both places: a short
 * list of specifics a reader scans to decide whether to spend the next twelve
 * minutes, kept out of the reading line rather than across it.
 *
 * Both dates are shown when a piece has been revised, because the blueprint is
 * right that "last updated" is the stronger signal. A reader deciding whether
 * a technical article is still current wants it more than they want the
 * original date, and Google reads dateModified for the same reason.
 *
 * <dl> rather than a stack of divs: these are literally name/value pairs, and
 * the markup may as well say so.
 */
function Facts({ post }: { post: Post }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Author", value: post.author },
    {
      label: "Published",
      value: <time dateTime={post.published}>{formatDate(post.published)}</time>,
    },
    ...(post.updated
      ? [
          {
            label: "Updated",
            value: <time dateTime={post.updated}>{formatDate(post.updated)}</time>,
          },
        ]
      : []),
    { label: "Read time", value: `${post.readingMinutes} min` },
  ];

  return (
    <dl className="border-t border-foreground/10">
      {rows.map((row) => (
        <div key={row.label} className="border-b border-foreground/10 py-4">
          <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {row.label}
          </dt>
          <dd className="mt-1.5">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}


/**
 * The link down into the silo.
 *
 * !! THIS IS WHY THE POST EXISTS !!
 *
 * docs/hitasoft_ai_architecture_strategy.md files resources as top of funnel:
 * catch a "how do I" search and pass the reader into a service silo. A post
 * that does not do that spends attention and returns none of it, which is why
 * `sendsTo` is required on the Post type rather than optional, and why this
 * sits in the sticky column instead of at the foot where it would be read by
 * whoever finished the article rather than by everybody.
 */
function SiloLink({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`group/silo block border border-foreground/15 p-5 transition-colors hover:border-foreground/40 ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        The service behind this
      </span>
      <span className="mt-3 flex items-start gap-2 font-display text-lg tracking-tight leading-snug">
        {serviceName(href)}
        <ArrowRight
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover/silo:translate-x-1"
        />
      </span>
    </Link>
  );
}

/**
 * The author box, which the blueprint asks for as an E-E-A-T signal.
 *
 * !! THE LINK IS PER AUTHOR. THE BIO IS STILL THE ORGANISATION'S !!
 *
 * This was entirely about the company: the name came from Strapi and read as a
 * person, while the link went to the company page and the paragraph described
 * the company. The client asked on 26 August 2026 for both halves to be about
 * the founder instead, and gave the profile URL, so the link is now his.
 *
 * The paragraph is not, yet, and that is deliberate rather than unfinished
 * work. LinkedIn answers HTTP 999 to anything that is not a signed-in browser,
 * so the About text could not be read, and writing a plausible one from the
 * company's positioning is the single worst thing this box could contain. A
 * named person with an invented biography beside a real, checkable profile is
 * a trust signal that inverts the moment somebody clicks it.
 * docs/positioning.md's claims discipline covers people as much as figures.
 *
 * So it still says what can be backed. Replace the paragraph with the real
 * intro when there is one; nothing else here needs to change.
 *
 * !! ONE PROFILE, AND STRAPI'S author FIELD IS FREE TEXT !!
 *
 * Every post is credited to the founder today, and the field is a plain string
 * an editor can type anything into. A second real byline needs this to become
 * a lookup rather than a constant, or the new author gets his profile. Not
 * built ahead of time, because there is no second author and a registry with
 * one row in it is a guess about the future.
 */
function AuthorBox({ author }: { author: string }) {
  return (
    <div className="mt-16 border-t border-foreground/10 pt-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="font-display text-xl tracking-tight">{author}</h2>
        <a
          href="https://www.linkedin.com/in/arun-andiselvam/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground"
        >
          LinkedIn
        </a>
      </div>
      <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        {site.name} has built software since 2008, for companies that mostly do
        not have an IT department. These pieces are written by the people who do
        the integrations rather than by anybody in marketing.
      </p>
    </div>
  );
}

/** "/services/ai-workflow-automation" becomes "AI workflow automation". */
function serviceName(href: string) {
  const last = href.split("/").filter(Boolean).pop() ?? "";
  const words = last.replace(/-/g, " ");
  return words.replace(/\bai\b/gi, "AI").replace(/^./, (c) => c.toUpperCase());
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
