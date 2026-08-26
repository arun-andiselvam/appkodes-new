"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/components/primitives/rich-text";
import type { Block } from "@/lib/posts";

/**
 * The article's contents panel, tracking where the reader actually is.
 *
 * Built from the heading blocks rather than declared separately, so it cannot
 * describe a structure the article does not have. h3 entries indent under
 * their h2, which is the hierarchy Google reads to build sitelinks.
 *
 * !! COLLAPSED ON MOBILE, OPEN ON DESKTOP !!
 *
 * The blueprint asks for an accordion on mobile and a panel on desktop. A
 * <details> gives the accordion for free and CSS forces it open on large
 * screens while hiding the summary.
 *
 * !! `data-contents` IS LOAD BEARING. THE RULE LIVES IN globals.css !!
 *
 * That forcing-open half was a Tailwind arbitrary variant,
 * `lg:[&:not([open])>div]:block`, and it stopped working in Chrome 131 without
 * anything failing: a closed details now hides its content through a
 * ::details-content pseudo-element, which no utility class can reach. The
 * panel was invisible and, with its summary hidden too, unopenable. The
 * replacement needs a pseudo-element selector, so it is real CSS keyed on this
 * attribute. Read the note there before touching either file - they are a
 * pair, and the failure mode is silent.
 *
 * !! THIS IS A CLIENT COMPONENT, AND IT IS THE ONLY ONE ON THE PAGE !!
 *
 * The panel was deliberately server rendered with no JavaScript at all, on the
 * argument that a bundle to toggle one list is a bundle for nothing. That
 * argument still holds for the toggling, which is still CSS.
 *
 * Following the reader cannot be done in CSS. The client asked on 26 August
 * 2026 for the list to say where they are, and they were right about why: a
 * fourteen entry contents panel that looks identical at every scroll position
 * makes the reader find their own place in it every time they glance over.
 * That is worth the two listeners below, and nothing else here needs them.
 */
export function Contents({
  headings,
  className = "",
}: {
  headings: Extract<Block, { kind: "h2" | "h3" }>[];
  className?: string;
}) {
  const ids = headings.map((heading) => slugify(heading.text));
  const [activeId, setActiveId] = useState<string | null>(null);
  const scroller = useRef<HTMLDetailsElement | null>(null);

  /*
   * Which section the reader is in.
   *
   * !! A SCROLL HANDLER, NOT AN IntersectionObserver, ON PURPOSE !!
   *
   * An observer answers "is this heading on screen", and that is not the
   * question. Sections here run well over a screen tall, so for most of the
   * time spent reading one, its heading is not on screen at all and no
   * observer fires. The usual patches for that - a thin band near the top of
   * the viewport, remembering the last entry seen - end up reimplementing the
   * loop below with worse edge cases at the first and last heading.
   *
   * The question is "which heading did I last pass", and that is answered by
   * reading positions. Fourteen getBoundingClientRect calls, batched into one
   * animation frame per scroll, with no writes in between, so nothing forces a
   * synchronous layout. The header already runs a scroll listener of its own.
   */
  useEffect(() => {
    if (ids.length === 0) return;

    /* Roughly where the sticky header ends, so a heading counts as reached
       when it passes under it rather than when it leaves the screen. */
    const READING_LINE = 140;
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = ids[0];

      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top > READING_LINE) break;
        current = id;
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  /*
   * Keep the marked entry inside the list's own scroll box.
   *
   * The list is capped to the viewport and scrolls internally, so on a long
   * article the current section can sit below the fold of the panel itself.
   * Marking an entry the reader cannot see is the same as not marking it.
   *
   * Only ever scrolls this element. `scrollIntoView` would have been one line
   * and would also scroll the page, which yanks the article out from under
   * somebody who was reading it.
   */
  useEffect(() => {
    const box = scroller.current;
    if (!box || !activeId) return;

    const link = box.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`);
    if (!link) return;

    const edge = 12;
    const linkBox = link.getBoundingClientRect();
    const boxBox = box.getBoundingClientRect();

    let delta = 0;
    if (linkBox.top < boxBox.top + edge) delta = linkBox.top - boxBox.top - edge;
    else if (linkBox.bottom > boxBox.bottom - edge) delta = linkBox.bottom - boxBox.bottom + edge;
    if (delta === 0) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: box.scrollTop + delta, behavior: still ? "auto" : "smooth" });
  }, [activeId]);

  /*
   * A fragment, not a wrapper, and that is what makes the height work.
   *
   * !! THE PANEL USED TO RESERVE A FIXED 24rem AND GIVE BACK WHAT WAS LEFT !!
   *
   * The list was capped at calc(100vh - 24rem): the viewport less a guess at
   * the sticky offset, this label, and the service card beneath. A guess is
   * wrong in both directions. Too small and the card is pushed off the bottom
   * of the screen; too large and the list stops halfway up a screen that has
   * room for all of it, which is what an article with no `sendsTo` did - it
   * reserved space for a card that was not there and left a third of the
   * column empty under a cut-off list.
   *
   * So nothing is reserved. The sticky box in post.tsx is the one thing bound
   * to the viewport, and these two are its flex children: the label and the
   * service card take the height they need, and the list takes whatever is
   * actually left. Nothing here has to know whether the card exists or how
   * tall it is.
   *
   * The scroll box is the <details> itself rather than the <nav> inside it.
   * The details is the flex item, so it is the element that receives the
   * computed height, and putting the overflow anywhere deeper means passing
   * that height down through ::details-content - the same pseudo-element that
   * already broke this panel once. It is a flex *item* here and never a flex
   * *container*, deliberately.
   */
  return (
    <>
      <h2 className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground lg:block">
        On this page
      </h2>

      <details
        ref={scroller}
        open={false}
        data-contents
        className={`group/toc lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain ${className}`}
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
          <nav aria-label="On this page">
            <ul className="mt-4 space-y-3 border-l border-foreground/15">
            {headings.map((heading, i) => {
              const id = ids[i];
              const active = id === activeId;

              return (
                <li key={`${id}-${i}`}>
                  <a
                    href={`#${id}`}
                    /* "location" rather than "true": this marks where the
                       reader is within a set of links, which is the token's
                       exact purpose, and it is what a screen reader announces
                       as the current item rather than as the current page. */
                    aria-current={active ? "location" : undefined}
                    className={`-ml-px block border-l text-sm leading-snug transition-colors ${
                      heading.kind === "h3" ? "pl-8" : "pl-4"
                    } ${
                      active
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
            </ul>
          </nav>
        </div>
      </details>
    </>
  );
}
