import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { SectionTitle } from "@/components/primitives/section-title";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { resourceCategories } from "@/content/resources";
import { actions, site } from "@/content/site";
import type { Block, Post } from "@/lib/posts";

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
 * Against the blueprint, in its order: breadcrumbs, h1, byline with both
 * dates and reading time, hero image, key takeaways box, sticky contents,
 * the body with a strict h2 and h3 hierarchy, an inline call to action, the
 * author box, and related reading. The schema is emitted by the route.
 */
export function PostPage({ post, related }: { post: Post; related: Post[] }) {
  const path = `${post.category}/${post.slug}`;

  const headings = (post.body ?? []).filter(
    (block): block is Extract<Block, { kind: "h2" | "h3" }> =>
      block.kind === "h2" || block.kind === "h3",
  );

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <Container>
          {/*
            A real breadcrumb trail, which the blueprint asks for and which the
            first version of this page replaced with a single back link. The
            trail is the thing that makes the silo legible to a reader who
            arrived from search three levels down, and it reads off the same
            navigation tree the header does.
          */}
          <Breadcrumbs
            path={post.category}
            leaf={{ name: post.title, href: path }}
          />

          <h1 className="mt-8 max-w-4xl font-display text-4xl lg:text-6xl tracking-tight leading-[1.03]">
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

          {/*
            Byline and dates.

            Both dates are shown when a piece has been revised, because the
            blueprint is right that "last updated" is the stronger signal. A
            reader deciding whether a technical article is still current wants
            it more than they want the original date, and Google reads
            dateModified for the same reason.
          */}
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-foreground/10 pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="text-foreground">{post.author}</span>
            <Dot />
            <time dateTime={post.published}>{formatDate(post.published)}</time>
            {post.updated && (
              <>
                <Dot />
                <span>
                  Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              </>
            )}
            <Dot />
            <span>{post.readingMinutes} min read</span>
          </div>
        </Container>
      </Section>

      {post.image && (
        <Section spacing="none" className="pb-12 lg:pb-16">
          <Container>
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              {/*
                alt is empty unless the artwork has something to describe. See
                the note on imageAlt in lib/posts.ts: the placeholders in
                public/sample illustrate nothing, and inventing a description
                for them would be worse than saying nothing.
              */}
              <Image
                src={post.image}
                alt={post.imageAlt ?? ""}
                fill
                priority
                sizes="(min-width: 1400px) 1320px, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        </Section>
      )}

      {/*
        Key takeaways.

        !! THIS IS THE BLOCK AN ANSWER ENGINE WILL TAKE !!

        docs/blog-structure.md puts it immediately under the hero for exactly
        that reason. Something looking for a quotable answer takes the
        compressed version over the prose almost every time, so the compressed
        version has to be the real claim rather than a teaser for it.

        Set on a tint rather than a border, so it reads as a different kind of
        thing from the article rather than as its first section.
      */}
      {post.takeaways.length > 0 && (
        <Section spacing="none" className="pb-16 lg:pb-20">
          <Container>
            <aside
              aria-labelledby="takeaways"
              className="max-w-3xl bg-foreground/[0.03] p-8 lg:p-10"
            >
              <h2
                id="takeaways"
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                Key takeaways
              </h2>
              <ul className="mt-6 space-y-4">
                {post.takeaways.map((line) => (
                  <li key={line} className="flex gap-4 text-lg leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </aside>
          </Container>
        </Section>
      )}

      <Section spacing="none" className="pb-20 lg:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-32 h-fit">
              {headings.length > 1 && <Contents headings={headings} />}
              <SiloLink href={post.sendsTo} className={headings.length > 1 ? "mt-10" : ""} />
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
                  The review is a fixed price, and you keep the costed plan and
                  the risks whether you go ahead or not.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 h-14 rounded-full bg-primary px-8 text-base text-primary-foreground has-[>svg]:px-8 hover:bg-primary/90 group/cta"
                >
                  <Link href={actions.book}>
                    Book an automation review
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
              {related.map((other) => (
                <li key={`${other.category}/${other.slug}`}>
                  <Link
                    href={`${other.category}/${other.slug}`}
                    className="group/rel block"
                  >
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
 * The contents panel.
 *
 * Built from the heading blocks rather than declared separately, so it cannot
 * describe a structure the article does not have. h3 entries indent under
 * their h2, which is the hierarchy Google reads to build sitelinks.
 *
 * !! COLLAPSED ON MOBILE, OPEN ON DESKTOP, AND NO JAVASCRIPT !!
 *
 * The blueprint asks for an accordion on mobile and a sticky panel on desktop.
 * A <details> gives the accordion for free, and CSS forces it open on large
 * screens by overriding the closed state's display and hiding the summary. A
 * client component to toggle one list would be a bundle for nothing.
 */
function Contents({
  headings,
}: {
  headings: Extract<Block, { kind: "h2" | "h3" }>[];
}) {
  return (
    <details
      open={false}
      className="group/toc lg:[&:not([open])>div]:block"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-4 border-y border-foreground/10 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground list-none lg:hidden [&::-webkit-details-marker]:hidden">
        On this page
        <span
          aria-hidden
          className="text-lg leading-none transition-transform group-open/toc:rotate-45"
        >
          +
        </span>
      </summary>

      <div>
        <h2 className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground lg:block">
          On this page
        </h2>
        <nav aria-label="On this page">
          <ul className="mt-4 space-y-3 border-l border-foreground/15">
            {headings.map((heading) => (
              <li key={heading.text}>
                <a
                  href={`#${slugify(heading.text)}`}
                  className={`-ml-px block border-l border-transparent text-sm leading-snug text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground ${
                    heading.kind === "h3" ? "pl-8" : "pl-4"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </details>
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
 * !! AN ORGANISATION, NOT A PERSON !!
 *
 * The blueprint suggests a bio establishing an individual's technical
 * authority. There are no real bylines here, and a named engineer with an
 * invented biography and a fabricated LinkedIn is the kind of trust signal
 * that inverts the moment somebody checks it. docs/positioning.md's claims
 * discipline covers people as much as it covers figures.
 *
 * The LinkedIn is real. It comes from the Organization schema hitasoft.com
 * publishes about itself, read on 21 August 2026. Note that
 * content/footer.ts still has an empty socialLinks array under a warning that
 * it stays empty until real accounts are supplied. They now exist and that
 * file could be filled from the same source.
 */
function AuthorBox({ author }: { author: string }) {
  return (
    <div className="mt-16 border-t border-foreground/10 pt-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="font-display text-xl tracking-tight">{author}</h2>
        <a
          href="https://www.linkedin.com/company/hitasoft"
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

/**
 * One block of the body.
 *
 * Headings carry an id derived from their own text, which is what the contents
 * panel links to. Deriving it rather than storing it means a heading cannot be
 * edited into disagreeing with its own anchor.
 *
 * `scroll-mt` on headings matters: the site header is fixed and 80 pixels
 * tall, so a bare anchor jump lands the heading underneath it.
 */
function BodyBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="mt-14 scroll-mt-28 font-display text-2xl lg:text-3xl tracking-tight first:mt-0"
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={slugify(block.text)}
          className="mt-10 scroll-mt-28 font-display text-xl tracking-tight"
        >
          {block.text}
        </h3>
      );

    case "p":
      return (
        <p className="mt-6 text-lg leading-[1.75] text-foreground/80 first:mt-0">
          <Linked text={block.text} links={block.links} />
        </p>
      );

    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-[1.75] text-foreground/80">
              <span
                aria-hidden
                className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        /* Scrolls inside its own box, so the page body never scrolls sideways. */
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-foreground/20">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="py-3 pr-6 font-mono text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-foreground/10">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={cell} scope="row" className="py-4 pr-6 align-top font-medium">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell} className="py-4 pr-6 align-top text-muted-foreground">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "figure":
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 1024px) 44rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {block.caption}
          </figcaption>
        </figure>
      );

    case "quote":
      return (
        <blockquote className="mt-10 border-l-2 border-foreground/25 pl-6 font-display text-xl lg:text-2xl tracking-tight leading-snug">
          {block.text}
        </blockquote>
      );

    case "callout":
      return (
        <p className="mt-10 bg-foreground/[0.03] p-6 text-lg leading-[1.6] font-medium">
          {block.text}
        </p>
      );
  }
}

/**
 * A paragraph with its links wrapped.
 *
 * Splits the text on each named phrase and wraps the phrase in a Link. Doing
 * it here rather than storing markup means the content file stays readable
 * prose, and nothing on the page is ever rendered from an HTML string.
 *
 * A phrase that no longer appears in the text is skipped rather than throwing,
 * because an editor fixing a typo should not take the page down. It does mean
 * a stale link goes quiet instead of loud, which is the right trade for
 * copy but is worth knowing.
 */
function Linked({
  text,
  links,
}: {
  text: string;
  links?: { phrase: string; href: string }[];
}) {
  if (!links || links.length === 0) return <>{text}</>;

  const parts: (string | { phrase: string; href: string })[] = [text];

  for (const link of links) {
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const at = part.indexOf(link.phrase);
      if (at === -1) continue;

      parts.splice(
        i,
        1,
        part.slice(0, at),
        link,
        part.slice(at + link.phrase.length),
      );
      break;
    }
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link
            key={i}
            href={part.href}
            className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {part.phrase}
          </Link>
        ),
      )}
    </>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-foreground/25">
      ·
    </span>
  );
}

/** "What it costs" becomes "what-it-costs". */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
