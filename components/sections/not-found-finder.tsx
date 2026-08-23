"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { allNavPages, type NavPage } from "@/content/navigation";

/**
 * The 404, as the thing this site spends thirty pages arguing for.
 *
 * !! THE METAPHOR IS THE PRODUCT, NOT A DECORATION !!
 *
 * Every service and industry hero draws the same picture: a field of work
 * where a model settled most of it and held back the one case it could not
 * call, in red, for a person. A 404 is exactly that event. The address you
 * asked for is the record that would not match, so it is drawn as the flagged
 * tile, and the pages that did match sit around it in brand blue.
 *
 * That is why this is worth building rather than a lost astronaut. It is the
 * one page on the site where the argument happens to the visitor instead of
 * being described to them.
 *
 * !! IT HAS TO RECOVER THE VISITOR, NOT ONLY AMUSE THEM !!
 *
 * The interaction is a finder. Type, and the field re-sorts: matches come
 * forward and light up, the rest fall back to texture. Every lit tile is a
 * real link. Somebody who mistyped a URL gets to the page they wanted without
 * going back to the menu, which is the only job this page actually has.
 *
 * The tiles keep their cells rather than reflowing, so the object holds its
 * shape while you type instead of jumping on every keystroke.
 */

/** Lifted verbatim from components/backgrounds/record-stack.tsx. */
const FACES = {
  settled: "linear-gradient(150deg, #146f90 0%, #10607d 55%, #0b4257 100%)",
  exception: "linear-gradient(150deg, #df2c16 0%, #c02513 55%, #8e1b0d 100%)",
} as const;

const SHADOW = { textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" } as const;

/**
 * Two columns of four, not three of five.
 *
 * !! FEWER COLUMNS IS WHAT STOPS THE NAMES TRUNCATING !!
 *
 * Three columns across the full right hand track gave each tile 245 pixels,
 * and four of the fifteen still cut their name: "Custom AI API & Software
 * Integra...", "Secure AI & Compliance Architec...". Narrowing the field to
 * make it quieter would have made that worse, so the column count came down
 * instead. Two columns inside 34rem is about 268 pixels a tile, which fits
 * every page name on the site.
 *
 * The field is also simply smaller than the copy beside it now, which is the
 * right order. It illustrates the argument, it is not the argument.
 */
const COLS = 2;
const ROWS = 4;
const CELLS = COLS * ROWS;
/** Tile height. Four rows plus gaps has to stay under the copy's 540. */
const ROW_H = 78;

/**
 * Score a page against what has been typed.
 *
 * Substring rather than fuzzy. A fuzzy matcher on thirty odd entries returns
 * something for almost any input, which on a page whose whole point is "this
 * did not match" is the wrong behaviour: it would never be able to say no.
 *
 * The ranking is name first, then the URL, then the description, because
 * somebody who mistyped an address is most often after a page whose name they
 * half remember.
 */
function score(page: NavPage, q: string) {
  const name = page.name.toLowerCase();
  const href = page.href.toLowerCase();
  const blurb = page.blurb.toLowerCase();

  if (name.startsWith(q)) return 100;
  if (name.includes(q)) return 80;
  if (href.includes(q)) return 60;
  if (page.section.toLowerCase().includes(q)) return 40;
  if (blurb.includes(q)) return 20;
  return 0;
}

/**
 * Words worth comparing, out of a URL or a page name.
 *
 * The two segment names every path carries are dropped. "services" appears in
 * nineteen of them, so keeping it would score all nineteen equally against any
 * services URL and bury the one page that actually matched.
 */
const NOISE = new Set(["services", "industries", "resources", "the", "and", "for", "with"]);

function words(s: string) {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !NOISE.has(w));
}

/**
 * Edit distance, given up on once it passes `max`.
 *
 * !! PREFIX MATCHING ALONE MISSES THE COMMONEST TYPO THERE IS !!
 *
 * A dropped or transposed letter in the middle of a word destroys every
 * prefix longer than the position it happened at. Measured against the real
 * thing: "helthcare" and "healthcare" share four characters at the front, one
 * short of the floor, so the healthcare page did not appear for a URL that was
 * one keystroke away from it. Two characters of slack covers a drop, a double
 * and a swap, which is most of what a hand does wrong on a keyboard.
 *
 * The early exit matters more than the algorithm. This runs for every word of
 * the URL against every word of thirty odd pages on a page nobody wants to
 * wait for.
 */
function editDistance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      best = Math.min(best, row[j]);
    }
    /* Nothing later can beat the best cell in this row. */
    if (best > max) return max + 1;
    prev = row;
  }

  return prev[b.length];
}

/**
 * How close a page is to the address that failed.
 *
 * !! THIS IS THE POINT OF KNOWING THE BROKEN URL !!
 *
 * A 404 already holds the single best clue about where the visitor meant to
 * go, and throwing it away to list the first twelve pages in menu order wastes
 * it. This ranks every page against the path that failed, so somebody who
 * followed a stale link or fat fingered a slug arrives to find the right page
 * already on the board.
 *
 * Prefix overlap rather than exact words, because the failure mode being
 * recovered from is a misspelling. "integraton" never equals "integration" and
 * shares five letters at the front, which is the whole trick. Four characters
 * is the floor: three lets "api" pull in "application" and the suggestions go
 * vague.
 */
function similarity(page: NavPage, attempted: string) {
  const asked = words(attempted);
  if (!asked.length) return 0;

  const have = [...words(page.href), ...words(page.name)];
  let total = 0;

  for (const a of asked) {
    let best = 0;
    for (const h of have) {
      if (a === h) best = Math.max(best, 3);
      else if (a.length >= 4 && (h.startsWith(a) || a.startsWith(h))) best = Math.max(best, 2);
      else if (a.length >= 5 && h.length >= 5 && a.slice(0, 5) === h.slice(0, 5))
        best = Math.max(best, 1.5);
      /* Only worth the distance check on words long enough that two edits are
         not most of the word. "cat" is two edits from "car" and from "cut". */
      else if (a.length >= 5 && h.length >= 5) {
        const d = editDistance(a, h, 2);
        if (d === 1) best = Math.max(best, 2.5);
        else if (d === 2) best = Math.max(best, 1.5);
      }
    }
    total += best;
  }

  return total / asked.length;
}

export function NotFoundFinder({ heading }: { heading?: React.ReactNode }) {
  const pages = useMemo(() => allNavPages(), []);
  const attempted = usePathname();
  const [query, setQuery] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();

  /*
    Guesses at the address that failed, ranked. Empty when nothing is close
    enough, so the page can say it has no idea rather than pad the board with
    twelve unrelated links. 1.5 is one shared five letter prefix per word.
  */
  const guesses = useMemo(
    () =>
      pages
        .map((p) => ({ p, s: similarity(p, attempted) }))
        .filter((r) => r.s >= 1.5)
        .sort((a, b) => b.s - a.s || a.p.href.length - b.p.href.length)
        .slice(0, CELLS)
        .map((r) => r.p),
    [pages, attempted],
  );

  const results = useMemo(() => {
    /* Nothing typed yet: show what the broken URL was probably reaching for,
       and fall back to menu order only when it resembles nothing. */
    if (!q) return guesses.length ? guesses : pages.slice(0, CELLS);

    return pages
      .map((p) => ({ p, s: score(p, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.p.href.length - b.p.href.length)
      .slice(0, CELLS)
      .map((r) => r.p);
  }, [pages, q, guesses]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = fieldRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    /* The same conversion the record panels use, so the gesture belongs to the
       site rather than to this page. */
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * 5, y: x * 4 });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16 lg:items-start">
      <div>
        {/*
          The page's own heading lives in this column rather than above the
          grid.

          !! THE FIELD HAS TO START LEVEL WITH THE HEADLINE !!

          It did not. The heading and the paragraph sat above this grid, so the
          right column began at the search box and the top right of the screen
          was empty for four hundred pixels. Measured, the left column was 179
          pixels against the field's 366, and top aligning a short thing beside
          one twice its height is what made the whole block look like it had
          slid down the page. With the copy inside the column the two are 480
          against 366 and the object sits beside the argument it illustrates.
        */}
        {heading}

        {/*
          The address that failed, drawn as the record that would not match.
          Not inside the 3D field: it is the subject of the sentence above it,
          and it has to be readable on a phone where the field is hidden.
        */}
        <div
          className="mb-8 px-4 py-3 shadow-[0_18px_34px_-18px_rgb(223_44_22/0.4)]"
          style={{ background: FACES.exception }}
        >
          <span
            className="block font-mono text-[10px] uppercase tracking-wider text-white"
            style={SHADOW}
          >
            No match
          </span>
          <span
            className="mt-1 block truncate font-mono text-[13px] text-white"
            style={SHADOW}
            title={attempted}
          >
            {attempted}
          </span>
        </div>

        <label className="block">
          <span className="sr-only">Search the site</span>
          <span className="relative block">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type what you were looking for"
              autoComplete="off"
              className="w-full border border-foreground/20 bg-transparent py-3 pl-11 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
            />
          </span>
        </label>

        {/*
          The count is the honest half of the interaction. A finder that only
          ever lights tiles cannot tell you it found nothing, and this page
          exists because something was not found.
        */}
        <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
          {q === ""
            ? guesses.length
              ? `That address is close to ${guesses.length === 1 ? "this one" : "these"}.`
              : "Or take one of these."
            : results.length === 0
              ? "Nothing matched that either. Try fewer letters."
              : `${results.length} ${results.length === 1 ? "page" : "pages"} matched.`}
        </p>

        {/*
          The list every visitor gets, in the DOM, always. The field to the
          right is hidden below lg and is a 3D restatement of exactly this, so
          a phone, a keyboard and a screen reader all navigate from here.
        */}
        <ul className="mt-6 space-y-px lg:hidden">
          {results.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block border-b border-foreground/10 py-3 text-[15px] text-foreground/80 transition-colors hover:text-foreground"
              >
                {p.name}
                <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                  {p.href}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/*
        The field. Hidden below lg for the same reason every record panel is:
        it needs the width to hold four columns of text without truncating,
        and the list above already carries the content.
      */}
      <div
        className="hidden lg:block w-full lg:max-w-[34rem] lg:justify-self-end select-none diagram-in"
        ref={fieldRef}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: "1500px" }}
      >
        <div
          className="grid motion-reduce:!transition-none"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridAutoRows: `${ROW_H}px`,
            gap: 10,
            transformStyle: "preserve-3d",
            transform: `rotateX(${12 + tilt.x}deg) rotateY(${-8 + tilt.y}deg)`,
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {Array.from({ length: CELLS }, (_, i) => {
            const page = results[i];
            /*
              A wave through the field, so it has depth rather than being one
              plane on a slant. A matched page rides on top of it.
            */
            const z = Math.round(Math.sin(i * 0.7) * 14 + (page ? 26 : 0));
            /* Unmatched cells dim toward the back, the same falloff the
               record panels use. */
            const fade = Math.max(0.16, 0.6 - Math.floor(i / COLS) * 0.1);

            /*
              !! KEYED BY CELL, NOT BY href !!

              The cell is the identity, so a tile persists as the query changes
              and its transition runs instead of the element being torn down
              and rebuilt on every keystroke. Keying by page also collides the
              moment two cells are empty. See the same note in
              components/backgrounds/record-stack.tsx.
            */
            /*
              The depth is a variable rather than a literal so a hover or a
              keyboard focus can move it from a class. An inline transform wins
              over any class, so the class has to change what the transform
              reads rather than the transform itself.
            */
            const common = {
              "--z": `${z}px`,
              transform: "translateZ(var(--z))",
              /* Depth glides, opacity snaps. A transition on opacity here
                 would fight the figure's own fade on first paint. */
              transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            } as React.CSSProperties;

            if (!page) {
              return (
                <div
                  key={`cell-${i}`}
                  aria-hidden="true"
                  className="flex flex-col justify-center gap-1.5 border border-brand-blue/20 bg-brand-blue/[0.03] px-3"
                  style={{ ...common, opacity: fade }}
                >
                  <span className="h-[3px] w-2/5 rounded-full bg-brand-blue/35" />
                  <span className="h-[3px] w-4/5 rounded-full bg-brand-blue/20" />
                </div>
              );
            }

            return (
              /*
                !! THE TILE IS THE LINK, NOT A PICTURE OF ONE !!

                This field was decorative divs behind aria-hidden, with the
                real list carrying lg:hidden. On a desktop that left the page
                with nothing clickable on it at all: the only control was a
                search box that filtered an object you could not press. A 404
                exists to get somebody moving again, so the thing filling the
                screen has to be the thing that moves them.

                Exactly one set is interactive at any width. The field is
                hidden below lg and the list is hidden from lg up.
              */
              <Link
                key={`cell-${i}`}
                href={page.href}
                className="flex flex-col justify-center gap-1 px-3 shadow-[0_18px_34px_-18px_rgb(20_111_144/0.4)] outline-none transition-shadow hover:[--z:52px] focus-visible:[--z:52px] focus-visible:ring-2 focus-visible:ring-white/80"
                style={{ ...common, background: FACES.settled }}
              >
                {/* Full white on every face. Measured: white at 90 per cent
                    over the lightest stop of these gradients fails AA, and the
                    hierarchy is carried by size and weight instead. */}
                <span
                  className="font-mono text-[10px] uppercase tracking-wider text-white"
                  style={SHADOW}
                >
                  {page.section}
                </span>
                <span
                  className="truncate text-[13px] font-medium leading-tight text-white"
                  style={SHADOW}
                >
                  {page.name}
                </span>
                <span className="truncate font-mono text-[10px] text-white" style={SHADOW}>
                  {page.href}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
