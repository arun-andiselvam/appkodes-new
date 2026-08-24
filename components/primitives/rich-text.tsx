import Link from "next/link";
import Image from "next/image";
import type { Block, Inline } from "@/lib/posts";

/**
 * Renders a `Block[]` body, wherever one shows up.
 *
 * Extracted from components/sections/post.tsx on 25 August 2026, when the
 * careers page needed the same renderer for a job description (a CKEditor
 * field, same as a post's body, going through the same lib/html-to-blocks.ts
 * parser). Article and job description share a body format for the reason
 * lib/posts.ts gives for the format existing at all: every headless CMS
 * exports structured rich text of roughly this shape, and a discriminated
 * union is a mapping function away from either kind of content rather than a
 * renderer each.
 *
 * !! POST.TSX HAS ITS OWN LARGER HEADING TREATMENT !!
 *
 * This one is deliberately plainer: no scroll-margin anchor targets tuned to
 * a sticky contents panel, because a job listing has no contents panel. If
 * post.tsx's heading styling ever needs to change, check whether the change
 * belongs here too or is specific to the article layout it sits inside.
 */
export function BodyBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 id={slugify(block.text)} className="mt-14 scroll-mt-28 font-display text-2xl lg:text-3xl tracking-tight first:mt-0">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 id={slugify(block.text)} className="mt-10 scroll-mt-28 font-display text-xl tracking-tight">
          {block.text}
        </h3>
      );

    /*
      Two sources, one paragraph. `rich` is present when the content came
      from the CMS, where CKEditor produced real inline marks and
      lib/html-to-blocks.ts flattened them into runs. `text` plus `links` is
      what a content file writes by hand, where the copy stays readable as
      prose and the renderer finds the phrase. Neither source is going away.
    */
    case "p":
      return (
        <p className="mt-6 text-lg leading-[1.75] text-foreground/80 first:mt-0">
          {block.rich ? <Runs runs={block.rich} /> : <Linked text={block.text} links={block.links} />}
        </p>
      );

    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-[1.75] text-foreground/80">
              <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
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
                  <th key={cell} scope="col" className="py-3 pr-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
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
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 1024px) 44rem, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{block.caption}</figcaption>
        </figure>
      );

    case "quote":
      return (
        <blockquote className="mt-10 border-l-2 border-foreground/25 pl-6 font-display text-xl lg:text-2xl tracking-tight leading-snug">
          {block.text}
        </blockquote>
      );

    case "callout":
      return <p className="mt-10 bg-foreground/[0.03] p-6 text-lg leading-[1.6] font-medium">{block.text}</p>;
  }
}

/**
 * A paragraph that arrived from the CMS, as flat marked up runs.
 *
 * The link styling is the same declaration `Linked` below uses. Two link
 * treatments in one body, depending on where the content was written, would
 * be a tell that something is stitched together. If either changes, change
 * both.
 */
export function Runs({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (run.mark === "link" && run.href) {
          return (
            <Link key={i} href={run.href} className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground">
              {run.text}
            </Link>
          );
        }
        if (run.mark === "strong") return <strong key={i} className="font-semibold">{run.text}</strong>;
        if (run.mark === "em") return <em key={i}>{run.text}</em>;
        return <span key={i}>{run.text}</span>;
      })}
    </>
  );
}

/**
 * A paragraph with its links wrapped.
 *
 * Splits the text on each named phrase and wraps the phrase in a Link. Doing
 * it here rather than storing markup means the content file stays readable
 * prose, and nothing on the page is ever rendered from an HTML string.
 *
 * A phrase that no longer appears in the text is skipped rather than
 * throwing, because an editor fixing a typo should not take the page down.
 * It does mean a stale link goes quiet instead of loud, which is the right
 * trade for copy but is worth knowing.
 */
export function Linked({ text, links }: { text: string; links?: { phrase: string; href: string }[] }) {
  if (!links || links.length === 0) return <>{text}</>;

  const parts: (string | { phrase: string; href: string })[] = [text];

  for (const link of links) {
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const at = part.indexOf(link.phrase);
      if (at === -1) continue;

      parts.splice(i, 1, part.slice(0, at), link, part.slice(at + link.phrase.length));
      break;
    }
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link key={i} href={part.href} className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground">
            {part.phrase}
          </Link>
        ),
      )}
    </>
  );
}

/**
 * "What it costs" becomes "what-it-costs".
 *
 * Shared rather than reimplemented wherever a heading needs an anchor,
 * because two slugifiers that disagree on one heading is a contents link
 * that scrolls to the wrong place, or nowhere.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
