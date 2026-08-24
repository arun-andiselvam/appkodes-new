import { parseFragment } from "parse5";

/**
 * The house rules, as code.
 *
 * !! A PLUGIN CANNOT DO THIS JOB, WHICH IS WHY THIS FILE EXISTS !!
 *
 * @strapi-community/plugin-seo is installed and it is worth having. It draws a
 * search result preview and a checklist beside the editor, so somebody writing
 * gets feedback without leaving the admin.
 *
 * What it cannot do is know our rules. Its title check passes anything under
 * about sixty characters. Our budget is forty nine, because app/layout.tsx
 * appends " - Hitasoft" and Google cuts at sixty. So the plugin would sit next
 * to an editor telling them a fifty five character title is fine, while the
 * standard in docs/seo-standards.md says it will be truncated. A checker that
 * teaches the wrong rule is worse than no checker.
 *
 * Everything below is a rule already written down somewhere in the repository.
 * Nothing here is invented for the CMS.
 *
 *   docs/seo-standards.md   title budget, description window
 *   docs/blog-structure.md  three takeaways, heading hierarchy, links, figures
 *   docs/positioning.md     voice rules and banned vocabulary
 *
 * !! NO STRAPI IMPORTS IN THIS FILE, ON PURPOSE !!
 *
 * These are pure functions over plain objects, so they can be run against a
 * fixture without booting a CMS. The Strapi wiring is in
 * src/api/post/content-types/post/lifecycles.ts and does nothing but call
 * `checkPost` and turn the result into an error the admin panel shows.
 */

export type Issue = { severity: "error" | "warning"; field: string; message: string };

/**
 * The page's own title budget.
 *
 * 60 that Google shows, minus the 11 characters of " - Hitasoft" that
 * app/layout.tsx appends to every page except the home page.
 */
const TITLE_MAX = 49;

/** The meta description window. Under 150 wastes room, over 160 gets cut. */
const DESCRIPTION_MIN = 150;
const DESCRIPTION_MAX = 160;

/**
 * Sentence length rules from docs/positioning.md.
 *
 * Short runs 8 to 10 words and long runs 15 to 25. Nothing may land between,
 * which is the rule that gets broken most: a first pass on one page put 11 of
 * its 75 strings in the dead band, every one of them counted by hand.
 */
const DEAD_BAND = [11, 14] as const;
const SENTENCE_MAX = 25;

/**
 * !! FLIP THIS IF THE DEAD BAND PROVES TOO STRICT FOR EDITORS !!
 *
 * It is an error today, so a post carrying one cannot be saved. That is the
 * right default because the rule is real and the fix is usually one word.
 *
 * It is also the only rule here that is a matter of house voice rather than of
 * search or of truth, so it is the one that might reasonably be softened. Set
 * it to "warning" and the issue is logged rather than blocking. Do not soften
 * anything else without reading the document it came from.
 */
const DEAD_BAND_SEVERITY: Issue["severity"] = "error";

/** docs/positioning.md, voice rules. Lower case, matched on word boundaries. */
const BANNED_WORDS = [
  "leverage",
  "comprehensive",
  "seamless",
  "seamlessly",
  "cutting edge",
  "cutting-edge",
  "innovative",
  "empower",
  "harness",
  "game changer",
  "game-changer",
  "revolutionise",
  "revolutionize",
  "utilise",
  "utilize",
  "enterprise",
  "world-class",
  "best-in-class",
  "flawless",
];

/**
 * Anchor text that tells a reader nothing.
 *
 * docs/blog-structure.md asks for descriptive anchors, and the reason is not
 * only that a person needs to know where a link goes. An anchor is one of the
 * few signals about the page it points at, so "click here" spends a link and
 * passes no meaning down the silo.
 */
const WEAK_ANCHORS = ["click here", "here", "read more", "this", "link", "learn more"];

/**
 * Openers that cannot start a takeaway.
 *
 * A takeaway is lifted with none of the article around it, which is the whole
 * point of the block for answer engines. A line starting "It does this" has
 * lost its subject the moment it is quoted.
 */
const DANGLING_OPENERS = ["it ", "this ", "that ", "they ", "these ", "those ", "he ", "she "];

/** Split prose into sentences. Crude and adequate: we only need word counts. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Every voice rule that applies to one piece of prose.
 *
 * `field` is what the editor sees in the error, so it has to name something
 * they can find in the form rather than a property path.
 */
function checkProse(text: string, field: string): Issue[] {
  const issues: Issue[] = [];

  if (/[—–]/.test(text)) {
    issues.push({
      severity: "error",
      field,
      message: "Contains a dash. Use a comma, or split it into two sentences.",
    });
  }

  if (text.includes(";")) {
    issues.push({
      severity: "error",
      field,
      message: "Contains a semicolon. Split it into two sentences.",
    });
  }

  for (const word of BANNED_WORDS) {
    const pattern = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (pattern.test(text)) {
      issues.push({
        severity: "error",
        field,
        message: `Uses "${word}", which docs/positioning.md bans. Say the plain thing instead.`,
      });
    }
  }

  for (const sentence of sentences(text)) {
    const words = wordCount(sentence);

    if (words >= DEAD_BAND[0] && words <= DEAD_BAND[1]) {
      issues.push({
        severity: DEAD_BAND_SEVERITY,
        field,
        message: `${words} words: "${sentence}". Cut it to 10 or expand it past 14.`,
      });
    }

    if (words > SENTENCE_MAX) {
      issues.push({
        severity: "error",
        field,
        message: `${words} words: "${sentence.slice(0, 60)}...". Split it.`,
      });
    }
  }

  return issues;
}

/** The shape a post arrives in from Strapi. Loose on purpose: partial updates. */
export type PostInput = {
  title?: string;
  excerpt?: string;
  sendsTo?: string;
  takeaways?: { text?: string }[] | null;
  /**
   * The article, as CKEditor's HTML.
   *
   * This was an array of dynamic zone components until 24 August 2026. The
   * checks below therefore parse rather than switch on `__component`. What
   * they test has not changed: heading hierarchy, anchor text, alt and caption
   * on figures, and the voice rules over every piece of prose.
   */
  body?: string | null;
  image?: unknown;
  imageAlt?: string | null;
};

/**
 * Check whatever is present.
 *
 * !! ABSENT IS NOT INVALID, BECAUSE UPDATES ARE PARTIAL !!
 *
 * Strapi sends only the fields that changed on an update, so treating a
 * missing title as an empty one would make every edit to a paragraph fail on
 * the title. Required-ness is the schema's job, and it enforces it on publish.
 * This function's job is that what somebody did write holds up.
 */
export function checkPost(post: PostInput): Issue[] {
  const issues: Issue[] = [];

  if (typeof post.title === "string") {
    const title = post.title.trim();
    if (title.length > TITLE_MAX) {
      issues.push({
        severity: "error",
        field: "title",
        message: `${title.length} characters, and the budget is ${TITLE_MAX}. The site appends " - Hitasoft", so this renders at ${title.length + 11} and Google cuts at 60.`,
      });
    }
  }

  /*
   * The excerpt is the meta description. lib/post-route.tsx passes it straight
   * to pageMetadata, so the window in docs/seo-standards.md applies to it even
   * though nothing in the field name says so.
   */
  if (typeof post.excerpt === "string") {
    const excerpt = post.excerpt.trim();
    if (excerpt.length < DESCRIPTION_MIN || excerpt.length > DESCRIPTION_MAX) {
      issues.push({
        severity: "error",
        field: "excerpt",
        message: `${excerpt.length} characters. This is the meta description, so it has to land between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX} and close on something to do next.`,
      });
    }
    issues.push(...checkProse(excerpt, "excerpt"));
  }

  if (typeof post.sendsTo === "string") {
    const target = post.sendsTo.trim();
    if (!/^\/(services|industries)\//.test(target)) {
      issues.push({
        severity: "error",
        field: "sendsTo",
        message: `"${target}" is not a silo page. It has to start /services/ or /industries/, because that is how a post pays its way.`,
      });
    }
  }

  if (Array.isArray(post.takeaways)) {
    if (post.takeaways.length !== 3) {
      issues.push({
        severity: "error",
        field: "takeaways",
        message: `${post.takeaways.length} takeaways. Three is the count. Five is a summary of a summary and nobody reads it.`,
      });
    }

    post.takeaways.forEach((takeaway, i) => {
      const text = (takeaway?.text ?? "").trim();
      if (!text) return;

      const opener = text.toLowerCase();
      if (DANGLING_OPENERS.some((word) => opener.startsWith(word))) {
        issues.push({
          severity: "error",
          field: `takeaways[${i + 1}]`,
          message: `Opens with a pronoun, so it loses its subject the moment an answer engine quotes it on its own. Name the thing.`,
        });
      }

      issues.push(...checkProse(text, `takeaways[${i + 1}]`));
    });
  }

  if (typeof post.body === "string" && post.body.trim()) {
    issues.push(...checkBody(post.body));
  }

  if (post.image && !String(post.imageAlt ?? "").trim()) {
    issues.push({
      severity: "warning",
      field: "imageAlt",
      message:
        "There is a hero image and no alt text, so it renders as decorative. Describe it, or confirm it illustrates nothing.",
    });
  }

  return issues;
}

/**
 * The article body, now that it is HTML rather than components.
 *
 * !! THE RULES DID NOT CHANGE. ONLY THE THING BEING READ DID !!
 *
 * This switched on `__component` while the body was a dynamic zone. CKEditor
 * replaced that on 24 August 2026, so it parses instead. Heading hierarchy is
 * still the one worth being strict about: the contents panel is built from the
 * h2s and Google reads the same hierarchy for sitelinks, so an article opening
 * on an h3 costs both.
 *
 * parse5 rather than a regular expression. The editor produces nested markup
 * and pasted content arrives wrapped in whatever Word felt like emitting, and
 * a pattern that reads "the first h2" out of that will be wrong on the first
 * article somebody pastes.
 */
function checkBody(html: string): Issue[] {
  const issues: Issue[] = [];
  const root = parseFragment(html);

  let seenH2 = false;
  let linkCount = 0;

  /* Depth first, in source order, so "before the first h2" means what it says. */
  const walk = (nodes: unknown[]) => {
    for (const raw of nodes) {
      const node = raw as {
        tagName?: string;
        childNodes?: unknown[];
        attrs?: { name: string; value: string }[];
      };
      const tag = node.tagName;

      if (tag === "h2") seenH2 = true;

      if (tag === "h3" && !seenH2) {
        issues.push({
          severity: "error",
          field: "body",
          message:
            "A level 3 heading appears before any level 2. Never skip the hierarchy: the contents panel and Google's sitelinks both read it.",
        });
      }

      if (tag === "a") {
        linkCount += 1;
        const href = node.attrs?.find((a) => a.name === "href")?.value ?? "";
        const phrase = textOf(node).trim();

        if (WEAK_ANCHORS.includes(phrase.toLowerCase())) {
          issues.push({
            severity: "error",
            field: "body",
            message: `"${phrase}" tells a reader nothing and passes no meaning to the page it points at. Use words that describe the destination.`,
          });
        }

        if (href && !href.startsWith("/") && !href.startsWith("http") && !href.startsWith("#")) {
          issues.push({
            severity: "error",
            field: "body",
            message: `"${href}" is neither a site path nor a full URL.`,
          });
        }
      }

      if (tag === "img") {
        const alt = node.attrs?.find((a) => a.name === "alt")?.value ?? "";
        if (!alt.trim()) {
          issues.push({
            severity: "error",
            field: "body",
            message:
              "An image has no alt text. Select it in the editor and use the image toolbar to describe it.",
          });
        }
      }

      if (tag === "figure") {
        const hasImg = textOfTag(node, "img");
        const caption = textOf(findTag(node, "figcaption")).trim();
        if (hasImg && !caption) {
          issues.push({
            severity: "error",
            field: "body",
            message:
              "An image has no caption. Turn the caption on from the image toolbar, because the article template shows one on every figure.",
          });
        }
      }

      /* Prose gets the voice rules, one block at a time. */
      if (tag === "p" || tag === "h2" || tag === "h3" || tag === "blockquote" || tag === "li") {
        const text = textOf(node).replace(/\s+/g, " ").trim();
        if (text) issues.push(...checkProse(text, `body <${tag}>`));
      }

      if (node.childNodes) walk(node.childNodes);
    }
  };

  walk(root.childNodes as unknown[]);

  if (html.trim() && !seenH2) {
    issues.push({
      severity: "error",
      field: "body",
      message:
        "No level 2 headings, so the article gets no contents panel and no sitelinks. Give it sections.",
    });
  }

  /*
   * Two to three contextual links, per docs/blog-structure.md. A warning
   * rather than an error, because the count is a target and a genuinely short
   * post with one good link is not broken. The zero case is different and it
   * is caught by `sendsTo` being required, which guarantees at least one route
   * out of every article.
   */
  if (html.trim() && linkCount < 2) {
    issues.push({
      severity: "warning",
      field: "body",
      message: `${linkCount} contextual link${linkCount === 1 ? "" : "s"} in the body. Two or three into the service and industry silos is what a post is for.`,
    });
  }

  return issues;
}

/** All the text under a node, markup ignored. */
function textOf(node: unknown): string {
  if (!node) return "";
  const n = node as { nodeName?: string; value?: string; childNodes?: unknown[] };
  if (n.nodeName === "#text") return n.value ?? "";
  return (n.childNodes ?? []).map(textOf).join("");
}

/** The first descendant with this tag, or undefined. */
function findTag(node: unknown, tag: string): unknown {
  const n = node as { tagName?: string; childNodes?: unknown[] };
  if (n.tagName === tag) return n;
  for (const child of n.childNodes ?? []) {
    const hit = findTag(child, tag);
    if (hit) return hit;
  }
  return undefined;
}

/** Whether a descendant with this tag exists. */
function textOfTag(node: unknown, tag: string): boolean {
  return Boolean(findTag(node, tag));
}

/** The blocking issues, formatted for the admin panel. */
export function errorReport(issues: Issue[]): string | null {
  const errors = issues.filter((issue) => issue.severity === "error");
  if (errors.length === 0) return null;

  const lines = errors.map((issue) => `${issue.field}: ${issue.message}`);
  return `This post breaks ${errors.length} of the house standards.\n\n${lines.join("\n\n")}`;
}
