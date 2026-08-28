"use client";

import { useCallback, useState, type ComponentProps, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import { actions } from "@/content/site";
import { track, type QuotePlacement } from "@/lib/analytics";

/**
 * The control every call to action on this site now uses.
 *
 * !! IT IS AN ANCHOR, NOT A BUTTON, AND THAT IS LOAD BEARING !!
 *
 * It renders `<a href="/contact">` and cancels its own navigation to open the
 * modal instead. Three things fall out of that, all of them wanted:
 *
 *   - With JavaScript broken, still loading, or switched off, the call to
 *     action does exactly what it does today and goes to the contact page.
 *     Nothing about this feature can produce a dead button.
 *   - A crawler still finds a real link to /contact on every page of the site.
 *     That page carries the FAQ schema and the rankings, and it would have
 *     quietly lost every internal link pointing at it.
 *   - Command-click, middle-click and "open in new tab" keep working, because
 *     the handler stands aside for a modified click rather than swallowing it.
 *
 * !! AND IT STAYS SMALL. THE DIALOG IS LOADED ON DEMAND. !!
 *
 * components/sections/video-modal.tsx carries the reason in capitals:
 * @radix-ui/react-dialog is the largest piece of application code on this site
 * after the framework, it was measured at 34KB of a 204KB page, and it was
 * being downloaded by everybody so that a few people could watch a clip. It
 * sits behind dynamic() for that reason.
 *
 * This control renders on every page of the site rather than on the few that
 * show a testimonial, so importing the modal statically here would put that
 * chunk into every initial bundle - a worse regression than the one that was
 * already fixed. Everything heavy lives in ./modal, and arrives when somebody
 * asks for it.
 */
const QuoteModal = dynamic(
  () => import("@/components/quote/modal").then((m) => m.QuoteModal),
  {
    /*
     * ssr false: a modal nobody has opened has nothing to render on the
     * server, and prerendering it would put the markup back into the HTML this
     * split exists to keep out of it.
     */
    ssr: false,
  },
);

export function QuoteLauncher({
  children,
  onClick,
  /*
   * Which button this is. It is the whole point of the click event - "somebody
   * opened the quote assistant" was already knowable, and "somebody opened it
   * from the closing panel of a service page" is what tells you which page is
   * doing the work.
   */
  placement = "header",
  ...rest
}: ComponentProps<"a"> & { placement?: QuotePlacement }) {
  const [open, setOpen] = useState(false);

  /*
   * Start fetching the chunk on hover or focus, so the dialog is usually
   * already in memory by the time the click lands. The bare import() names the
   * same module as the dynamic() call above, so webpack hands back the chunk
   * that is already in flight rather than adding a second one.
   */
  const warm = useCallback(() => {
    void import("@/components/quote/modal");
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    /*
     * Whatever was passed in goes first, and gets to run whether or not we
     * take over the click. The mobile menu uses this to close itself, and it
     * has to close whether the modal opens or the link navigates.
     */
    onClick?.(event);

    /*
     * Anything but a plain left click belongs to the browser. Command-click
     * opens /contact in a new tab, which is the correct and expected outcome.
     */
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    track("quote_cta_click", { placement });
    setOpen(true);
  }

  return (
    <>
      <a
        {...rest}
        href={actions.book}
        onClick={handleClick}
        onPointerEnter={warm}
        onFocus={warm}
      >
        {children}
      </a>
      {/*
        Mounted only while open, so closing the dialog disposes of its state
        along with it. Reopening starts a fresh conversation rather than
        resuming a half finished one somebody walked away from.
      */}
      {open && <QuoteModal placement={placement} onClose={() => setOpen(false)} />}
    </>
  );
}
