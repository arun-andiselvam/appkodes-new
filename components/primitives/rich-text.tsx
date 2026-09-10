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
export function BodyBlock({
  block,
  figureClassName = "",
}: {
  block: Block;
  /**
   * Extra classes for the box a `figure` block's picture is clipped to.
   *
   * !! THIS EXISTS SO THE 12px CORNERS STAY ON THE BLOG !!
   *
   * The client asked for 12px corners on the blog artwork on 27 August 2026
   * and was explicit that no other page should take it. This renderer is
   * shared: components/sections/career-detail.tsx draws a job description
   * through it, and a CKEditor field there can carry an image as easily as an
   * article can. Rounding the figure case below outright would round that too.
   *
   * So the caller decides. post.tsx passes the radius, career-detail passes
   * nothing, and the default leaves every other body square.
   */
  figureClassName?: string;
}) {
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

    case "figure": {
      const { width, height } = block;
      const fit = fitFor(width, height);

      /*
        !! "contain" USED TO MEAN "cropped to 16:9 anyway, just not by
        cover" !!

        Both branches shared one box, `aspect-[16/9]`, and only the `Image`
        inside it switched between `object-cover` and `object-contain`. That
        stopped the checklist infographic fitFor's own comment describes
        (979x641, a 1.53 ratio) from being cropped, but it did not show it
        whole either: `object-contain` inside a fixed 16:9 frame shrinks a
        squarer image to fit the frame's height and pillarboxes the sides,
        so the picture rendered 51px narrower than the column on each edge
        and the tint (`bg-foreground/[0.03]`) existed only to colour that
        gap in. Confirmed live on the checklist figure on 30 August 2026:
        a 725px wide column held a 622px wide image.
        `fit === "contain"` is exactly the signal that the box's own shape
        is wrong for this image, so the fix is to stop giving it one. The
        `width`/`height` block already carries the image's real ratio -
        that is what fitFor read to decide "contain" in the first place -
        so `Image` takes them directly instead of `fill`, and CSS scales the
        rendered box to the image's own shape at `w-full`. There is no
        letterboxing left to tint, so the background colour goes with it.

        The `cover` branch is untouched: a photo still crops to a steady
        16:9 band, which is the point of that path.
      */
      if (fit === "contain" && width && height) {
        return (
          <figure className="mt-10">
            <Image
              src={block.src}
              alt={block.alt}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 44rem, 100vw"
              className={`h-auto w-full object-contain ${figureClassName}`}
            />
            <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{block.caption}</figcaption>
          </figure>
        );
      }

      return (
        <figure className="mt-10">
          <div className={`relative aspect-[16/9] w-full overflow-hidden ${figureClassName}`}>
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 1024px) 44rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{block.caption}</figcaption>
        </figure>
      );
    }

    /*
      A pull quote, unless it is a summary wearing a pull quote's clothes.

      !! THE TL;DR WAS BEING DRAWN AS A 100 WORD PULL QUOTE !!

      The content tool writes the article summary as a <blockquote>, so it
      arrived here as a quote block and got the quote treatment: display face,
      text-2xl, no label. That styling is built for one arresting sentence
      lifted out of the prose. A hundred word summary set that way fills half a
      screen and reads as though the writer shouted the abstract.

      A summary is a different kind of thing from a quote and wants the
      opposite treatment: clearly labelled, set at reading size in the body
      face, in a panel that says "skip this if you are reading on". So it is
      detected and drawn as one. See summaryBody below for what counts.

      !! `lg:text-2xl` CAME OUT ON 30 AUGUST 2026 !!

      A genuine pull quote is one sentence, and text-xl growing to text-2xl
      at the desktop breakpoint is what a single arresting line wants. The
      content tool also writes multi-sentence editorial asides as a
      <blockquote> - a four-line "note for reviewers" is what flagged this -
      and those got the same escalation, so a whole paragraph of prose
      ballooned to 24px on a wide screen. Confirmed live: the client tried
      overriding just the `lg:text-2xl` rule to the CSS keyword `larger` in
      DevTools and it read right, which computes relative to the
      blockquote's own parent rather than to `text-xl`, landing at 19.2px -
      in effect, no growth at the desktop breakpoint at all. That is what
      dropping `lg:text-2xl` does directly, so the base `text-xl` now holds
      at every width instead of a keyword standing in for it. `text-xl` is
      still `text-xl`, so an actual one-line pull quote is barely smaller
      than before and still reads as one.
    */
    case "quote": {
      const summary = summaryBody(block.text);
      if (summary !== null) return <Summary text={summary} />;

      return (
        <blockquote className="mt-10 border-l-2 border-foreground/25 pl-6 font-display text-xl tracking-tight leading-snug">
          {block.text}
        </blockquote>
      );
    }

    case "callout":
      return <p className="mt-10 bg-foreground/[0.03] p-6 text-lg leading-[1.6] font-medium">{block.text}</p>;
  }
}

/**
 * How a figure's picture should fill its box: cropped to fit, or shown whole.
 *
 * !! A 12 POINT INFOGRAPHIC WAS BEING CROPPED TOP AND BOTTOM !!
 *
 * Every in-article figure sits in a fixed 16:9 box (aspect-[16/9] above) so
 * an article reads as a steady column rather than a different-height picture
 * every time. `object-cover` fills that box by cropping whatever doesn't fit,
 * which is the right call for a photo - a 4:3 or 3:2 shot loses a sliver off
 * two edges and nobody notices. It is the wrong call for a diagram: a
 * "Twelve Point Checklist" infographic force-cropped to 16:9 lost its top and
 * bottom rows of labels entirely, which is not a sliver, it is the content.
 *
 * `width`/`height` on the block (see the note on it in lib/posts.ts) are the
 * image's own measured size - see withImageDimensions in
 * lib/html-to-blocks.ts, which is where almost every figure actually gets
 * one. Its ratio decides the fit. No dimensions at all (the measurement
 * itself failed) keeps the old cover behaviour, since there is nothing here
 * to say otherwise.
 *
 * !! THE FIRST BAND WAS TOO WIDE. IT LET THE ACTUAL CHECKLIST THROUGH !!
 *
 * The band this replaced was [1.3, 2.4], reasoned from where ordinary
 * photography sits (4:3 up to a wide landscape crop) rather than from the
 * image that prompted this function. That checklist infographic measures
 * 979x641 - a 1.53 ratio, comfortably inside that band - and it is exactly
 * the image the band was supposed to catch. Every in-article image on this
 * site so far is a generated diagram or screenshot, not a photograph, and
 * that kind of image tends to place content at its very edges the way a
 * photo's own subject rarely does: a crop that looks like a normal trim on a
 * photo can still slice through a diagram's top and bottom row. So the band
 * is tight around 16:9 (≈1.78) rather than centred on what photography
 * happens to look like - narrow enough to catch this image and diagrams like
 * it, wide enough that an image already close to the box's own shape still
 * gets the plain cover treatment.
 */
function fitFor(width?: number, height?: number): "cover" | "contain" {
  if (!width || !height) return "cover";
  const ratio = width / height;
  return ratio >= 1.6 && ratio <= 2.0 ? "cover" : "contain";
}

/**
 * The summary's own text, with its label stripped, or null if this is not one.
 *
 * Writers and generators punctuate this half a dozen ways - "TL;DR:", "TL. DR:",
 * "TLDR -", "tl;dr —" - and every one of them means the same thing, so the
 * separator between the letters and after them is matched loosely rather than
 * spelled out. The label is removed from the text because the panel prints its
 * own; leaving it in renders "TL;DR" twice, which is exactly the sort of small
 * wrongness that reads as nobody having looked at the page.
 *
 * !! IT HAS TO STILL BE A SUMMARY AFTER THE LABEL COMES OFF !!
 *
 * A quote that opens with those letters and then says nothing is a quote. The
 * length floor keeps a stray "TL;DR" from turning an empty panel loose on the
 * page.
 */
const SUMMARY_LABEL = /^\s*tl\s*[.;:,-]?\s*dr\s*[:.–—-]*\s*/i;

function summaryBody(text: string): string | null {
  const match = text.match(SUMMARY_LABEL);
  if (!match) return null;

  const body = text.slice(match[0].length).trim();
  return body.length > 20 ? body : null;
}

/**
 * The summary's body, cut into one point per bullet.
 *
 * !! PREFER THE REAL BOUNDARIES. GUESS ONLY WHEN THERE ARE NONE !!
 *
 * docs/blog-structure.md calls for the TL;DR as 3 bullet points, and the
 * content tool writes each one as its own `<p>` inside the blockquote.
 * html-to-blocks.ts's blockquoteText() keeps those apart with a blank line,
 * so the first move here is to split on that and trust it - it is the actual
 * bullet boundary, not a guess.
 *
 * The sentence-boundary regex below is what this function used to rely on
 * for everything, splitting on a period or other sentence end followed by a
 * capital letter. Kept as a fallback for a summary that arrives as one
 * unbroken blockquote with no paragraph markers - hand-written content, or
 * older posts - where it is the only boundary available. Using it whenever a
 * bullet has more than one sentence in it is exactly what used to split a
 * single point in half: "Sequence it: reconciliation and alerting before
 * faster execution." and "You need to see the system clearly..." are one
 * bullet, not two, and the blank-line split now keeps them that way.
 *
 * A summary that doesn't split into at least two pieces - one sentence, or
 * prose with no clean sentence boundaries - renders as a paragraph rather
 * than a list of one, which would look like a formatting mistake rather than
 * a summary.
 */
function summaryPoints(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((point) => point.trim())
    .filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;

  return text
    .split(/(?<=[.!?])\s+(?=[A-Z(])/)
    .map((point) => point.trim())
    .filter(Boolean);
}

/**
 * A point's own lead-in phrase, bolded.
 *
 * Every point the content tool writes opens with a short capitalised phrase
 * naming the takeaway, then a colon, then the sentence that backs it up -
 * "Eliminate Month-End Reconciliation: Use AI middleware to...". That phrase
 * is the part worth reading first, so it is set in bold the way
 * docs/blog-structure.md's own example does. The mark does not survive from
 * the CMS: html-to-blocks.ts's plain() flattens the blockquote to a bare
 * string, so there is no `<strong>` left to find by the time this runs, and
 * the phrase is found by shape instead.
 *
 * The colon has to land in the first 60 characters. Past that it stops being
 * a lead-in phrase and starts being a colon the sentence happens to contain -
 * a ratio, a time, a quoted list - and bolding up to it would put half the
 * sentence in bold instead of the label it opens with.
 */
function LeadIn({ point }: { point: string }) {
  const at = point.indexOf(":");
  if (at === -1 || at > 60) return <>{point}</>;

  return (
    <>
      <strong className="font-semibold text-foreground">{point.slice(0, at + 1)}</strong>
      {point.slice(at + 1)}
    </>
  );
}

/**
 * The article summary, as a panel rather than as a quotation.
 *
 * !! THIS IS THE OTHER BLOCK AN ANSWER ENGINE WILL TAKE !!
 *
 * Same argument as the key takeaways in components/sections/post.tsx: a
 * machine looking for a quotable answer takes the compressed version over the
 * prose. Marked up as an <aside> with its own accessible name so it is
 * identifiable as a summary rather than as the article's first paragraph.
 *
 * Set in the body face at reading size, deliberately. It is the one block on
 * the page most likely to be read word for word by somebody deciding whether
 * to read the rest, and display type at 24px is for looking at rather than
 * reading. The brand rule and the tint do the work of separating it instead.
 */
function Summary({ text }: { text: string }) {
  const points = summaryPoints(text);

  return (
    <aside
      aria-label="Summary"
      className="mt-10 border-l-2 border-primary bg-foreground/[0.03] px-6 py-6 lg:px-8 lg:py-7"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        TL;DR
      </p>
      {points.length > 1 ? (
        <ul className="mt-4 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-lg leading-[1.7] text-foreground/85">
              <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <LeadIn point={point} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-lg leading-[1.7] text-foreground/85">{text}</p>
      )}
    </aside>
  );
}

/**
 * A paragraph that arrived from the CMS, as flat marked up runs.
 *
 * The link styling is the same declaration `Linked` below uses. Two link
 * treatments in one body, depending on where the content was written, would
 * be a tell that something is stitched together. If either changes, change
 * both.
 */
/*
 * Link underlines, here and in Linked below: 30% of the text colour in light
 * mode, 50% in dark. Links share the body's colour, so the underline is the
 * only thing marking them, and at 30% it all but vanished on the dark ground
 * while reading fine on the light one. Raised for dark only, 10 September 2026.
 */
export function Runs({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (run.mark === "link" && run.href) {
          return (
            <Link key={i} href={run.href} className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground dark:decoration-foreground/50">
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
          <Link key={i} href={part.href} className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground dark:decoration-foreground/50">
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
