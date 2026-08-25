import { parseFragment } from "parse5";
import type { DefaultTreeAdapterTypes } from "parse5";

import type { Block, Inline } from "@/lib/posts";

type Node = DefaultTreeAdapterTypes.ChildNode;
type Element = DefaultTreeAdapterTypes.Element;

/**
 * CKEditor's HTML, turned into the blocks the article template already draws.
 *
 * !! THIS FILE IS WHY THE RENDERER DID NOT HAVE TO CHANGE !!
 *
 * The body was a dynamic zone of seven components until 24 August 2026, when
 * the client asked for a real rich text editor. CKEditor emits HTML, and the
 * obvious move at that point is to render the HTML directly. That would have
 * cost three things worth more than the shortcut saves.
 *
 *   The contents panel is built from the h2 and h3 blocks. Rendering raw HTML
 *   means finding headings again afterwards and injecting ids into a string.
 *
 *   The editorial checks in the CMS read structure. Heading hierarchy, alt
 *   text on every figure, descriptive anchors. All of that is easy against
 *   blocks and awkward against markup.
 *
 *   And rendering CMS HTML in React means dangerouslySetInnerHTML, which hands
 *   anybody with an admin login a script tag on every reader's page. It can be
 *   sanitised, and sanitising is a thing you have to keep being right about
 *   forever.
 *
 * So the HTML is parsed here, on the server, into the same union the ten
 * sample posts already use. components/sections/post.tsx did not change. No
 * HTML string reaches a browser, so there is nothing to sanitise and no
 * injection surface to maintain.
 *
 * !! ANYTHING THIS DOES NOT RECOGNISE IS DROPPED, AND THAT IS THE RISK !!
 *
 * A tag with no case below does not render. The mitigation is not in this
 * file: it is that the editor in cms/src/admin/app.tsx only offers buttons
 * that produce tags this understands. If somebody widens that toolbar without
 * widening this, content will go missing from published articles quietly.
 * The two files are a pair.
 */

const TEXT = "#text";

function isElement(node: Node): node is Element {
  return "tagName" in node;
}

function attr(el: Element, name: string): string | undefined {
  return el.attrs?.find((a) => a.name === name)?.value;
}

function childrenOf(node: Node): Node[] {
  return "childNodes" in node ? (node.childNodes as Node[]) : [];
}

/**
 * Collapse whitespace the way HTML does when it renders.
 *
 * CKEditor indents its output, so a paragraph arrives carrying newlines and
 * runs of spaces that mean nothing. Left in, they survive into the React tree
 * and show up as odd gaps mid sentence.
 */
function squash(text: string): string {
  return text.replace(/\s+/g, " ");
}

/**
 * The inline run inside a block, flattened.
 *
 * !! NESTING IS DELIBERATELY NOT MODELLED !!
 *
 * Bold inside a link inside italic is representable in HTML and is not
 * representable here, because the article template renders one mark per run.
 * The innermost mark wins and the rest of the formatting is dropped rather
 * than the text being dropped. Losing an italic is a blemish. Losing the
 * sentence is a bug.
 */
function inlineRuns(nodes: Node[], mark: Inline["mark"] = "none", href?: string): Inline[] {
  const runs: Inline[] = [];

  for (const node of nodes) {
    if (node.nodeName === TEXT) {
      const text = squash((node as unknown as { value: string }).value);
      if (text) runs.push(href ? { mark: "link", text, href } : { mark, text });
      continue;
    }

    if (!isElement(node)) continue;

    switch (node.tagName) {
      case "strong":
      case "b":
        runs.push(...inlineRuns(childrenOf(node), "strong", href));
        break;
      case "em":
      case "i":
        runs.push(...inlineRuns(childrenOf(node), "em", href));
        break;
      case "a": {
        const target = attr(node, "href");
        /* An anchor with no href is decoration. Keep the words, drop the link. */
        runs.push(...inlineRuns(childrenOf(node), mark, target || href));
        break;
      }
      case "br":
        runs.push({ mark: "none", text: " " });
        break;
      default:
        /* Any other inline wrapper contributes its text and nothing else. */
        runs.push(...inlineRuns(childrenOf(node), mark, href));
    }
  }

  return runs;
}

/** The plain text of a run set, for headings and cells that carry no marks. */
function plain(nodes: Node[]): string {
  return squash(
    inlineRuns(nodes)
      .map((run) => run.text)
      .join(""),
  ).trim();
}

/** Merge touching runs that share a mark, so the DOM is not a span per word. */
function tidy(runs: Inline[]): Inline[] {
  const out: Inline[] = [];

  for (const run of runs) {
    const last = out[out.length - 1];
    if (last && last.mark === run.mark && last.href === run.href) {
      last.text += run.text;
      continue;
    }
    out.push({ ...run });
  }

  /* Trim the ends of the run, which is where CKEditor's indentation lands. */
  if (out.length > 0) {
    out[0].text = out[0].text.replace(/^\s+/, "");
    out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, "");
  }

  return out.filter((run) => run.text.length > 0);
}

/**
 * A figure, which CKEditor wraps rather than emitting a bare img.
 *
 * The caption is the `figcaption` and the alt is the img's own attribute. Both
 * are required by the article template and by the editorial check in the CMS,
 * so a figure missing either is dropped here rather than rendered half made.
 */
function figureFrom(el: Element): Block | null {
  const stack: Node[] = [el];
  let src: string | undefined;
  let alt = "";
  let caption = "";

  while (stack.length > 0) {
    const node = stack.pop() as Node;
    if (isElement(node)) {
      if (node.tagName === "img") {
        src = src ?? attr(node, "src");
        alt = alt || attr(node, "alt") || "";
      }
      if (node.tagName === "figcaption") caption = caption || plain(childrenOf(node));
    }
    stack.push(...childrenOf(node));
  }

  if (!src) return null;
  return { kind: "figure", src, alt, caption };
}

function tableFrom(el: Element): Block | null {
  const rows: string[][] = [];
  const stack: Node[] = [el];
  const trs: Element[] = [];

  while (stack.length > 0) {
    const node = stack.pop() as Node;
    if (isElement(node) && node.tagName === "tr") trs.push(node);
    stack.push(...childrenOf(node));
  }

  /*
    The walk above is depth first from a stack, so rows come out reversed.
    parse5 gives no source order for free and getting one wrong here silently
    inverts every table on the site.
  */
  trs.reverse();

  for (const tr of trs) {
    const cells = childrenOf(tr)
      .filter(isElement)
      .filter((cell) => cell.tagName === "td" || cell.tagName === "th")
      .map((cell) => plain(childrenOf(cell)));
    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length === 0) return null;

  /*
    The first row is the header. CKEditor marks header cells as th when the
    writer turns the header row on, and emits all td when they do not. The
    article template needs a head either way, so the first row is promoted.
  */
  const [head, ...body] = rows;
  return { kind: "table", head, rows: body };
}

/** One top level element to zero or more blocks. */
function blockFrom(el: Element): Block[] {
  switch (el.tagName) {
    case "h1":
    case "h2":
      return [{ kind: "h2", text: plain(childrenOf(el)) }];

    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return [{ kind: "h3", text: plain(childrenOf(el)) }];

    case "p": {
      /*
       * !! AN IMAGE INSIDE A PARAGRAPH WAS BEING THROWN AWAY !!
       *
       * inlineRuns walks a paragraph for text, strong, em, a and br. An img
       * is none of those, so it returned nothing for it and the image
       * vanished with no error anywhere.
       *
       * That is exactly how an external content tool writes them. It sends
       * `<p><img src="..." alt="..."></p>` rather than the `<figure>` this
       * file already handled, and the first article published that way lost
       * all four of its in-body images: 46 paragraphs parsed, zero figures.
       * Nothing failed loudly, the pictures were simply not there.
       *
       * So images are lifted out first, as figure blocks, and whatever text
       * the paragraph also held still renders after them. A paragraph that
       * was only an image produces just the figure rather than an empty
       * paragraph alongside it.
       */
      const images = childrenOf(el)
        .filter(isElement)
        .filter((child) => child.tagName === "img")
        .flatMap(blockFrom);

      const rich = tidy(inlineRuns(childrenOf(el)));
      if (rich.length === 0) return images;
      return [
        ...images,
        { kind: "p", text: rich.map((r) => r.text).join(""), rich },
      ];
    }

    case "ul":
    case "ol": {
      const items = childrenOf(el)
        .filter(isElement)
        .filter((li) => li.tagName === "li")
        .map((li) => plain(childrenOf(li)))
        .filter(Boolean);
      return items.length > 0 ? [{ kind: "list", items }] : [];
    }

    case "blockquote": {
      const text = plain(childrenOf(el));
      return text ? [{ kind: "quote", text }] : [];
    }

    case "figure": {
      /* CKEditor wraps tables in a figure too, so the contents decide. */
      const hasTable = childrenOf(el).some((n) => isElement(n) && n.tagName === "table");
      const block = hasTable ? tableFrom(el) : figureFrom(el);
      return block ? [block] : [];
    }

    case "table": {
      const block = tableFrom(el);
      return block ? [block] : [];
    }

    case "img": {
      const src = attr(el, "src");
      return src ? [{ kind: "figure", src, alt: attr(el, "alt") ?? "", caption: "" }] : [];
    }

    /*
      A div carries no meaning of its own. Descend rather than dropping it,
      because pasted content arrives wrapped in them.
    */
    case "div":
    case "section":
      return childrenOf(el).filter(isElement).flatMap(blockFrom);

    default:
      return [];
  }
}

/** Parse a CKEditor body into the blocks the article template renders. */
export function htmlToBlocks(html: string): Block[] {
  if (!html?.trim()) return [];

  const fragment = parseFragment(html);
  const blocks = fragment.childNodes.filter(isElement).flatMap(blockFrom);
  if (blocks.length > 0) return blocks;

  /*
   * !! NOTHING PARSED, BUT THERE IS TEXT. SHOW IT RATHER THAN LOSE IT !!
   *
   * Added 26 August 2026. An external content tool published into `body`,
   * which is a CKEditor field and so an HTML string, and sent plain markdown
   * instead: no tags at all, paragraphs separated by blank lines. parse5
   * finds no elements in that, so every branch above returns nothing.
   *
   * The failure that caused was the worst kind. The post existed, was
   * published, appeared on /blog and on its category page, and its own page
   * returned 404, because postsWithBody in lib/posts.ts drops anything whose
   * body parses to zero blocks. An article you can see listed and cannot
   * open, with nothing anywhere saying why.
   *
   * So an unparseable body falls back to its own text, split on blank lines
   * into paragraphs. Any markdown syntax inside it stays visible exactly as
   * typed, which is deliberate rather than lazy: this is a repair, not a
   * markdown renderer. "## Heading" showing on the page is the honest signal
   * that the article still needs formatting in Strapi's editor, and the
   * client asked for the body shown as stored so they can do that. Silently
   * converting it would hide that the tool is sending the wrong format.
   *
   * If markdown ever needs to be a first class input, the answer is a real
   * parser at the seam in lib/strapi.ts, not this.
   */
  const text = fragment.childNodes
    .map((node) => ("value" in node ? String(node.value) : ""))
    .join("");

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({ kind: "p" as const, text: paragraph }));
}
