import { MessageCircle } from "lucide-react";
import { QuoteLauncher } from "@/components/quote/launcher";

/**
 * The floating chat button, bottom right of every page.
 *
 * Asked for on 5 September 2026: a circular control that opens the quote
 * assistant and looks like it belongs to the rest of the site. It sat bottom
 * left for its first few hours, on the original brief, and moved to the right
 * the same day. The right is also where a visitor expects to find one, so
 * nothing about the change is a compromise.
 *
 * !! IT IS A QuoteLauncher, AND THAT IS THE WHOLE POINT !!
 *
 * Everything that makes the other calls to action safe lives in that component
 * and none of it is worth writing twice. It renders `<a href="/contact">` and
 * cancels its own navigation, so this button still goes somewhere with
 * JavaScript off, still opens in a new tab on command-click, and still keeps
 * the dialog's 34KB behind a dynamic import until somebody asks for it. A
 * hand-rolled `<button onClick>` here would have quietly lost all three.
 *
 * !! NO "use client", AND STILL IN THE FIRST PAINT !!
 *
 * This file needs no client boundary of its own: it holds no state and no
 * handlers. QuoteLauncher is the boundary, and Next renders client components
 * to HTML anyway, so the anchor is in the document from the first byte.
 *
 * That matters after 9b5854f. The hero was invisible until hydration and it
 * cost 2.5 seconds of LCP. Nothing added to the layout should repeat it, so
 * this button has no entrance animation and no opacity gate. It is just there.
 *
 * !! z-30 PUTS IT UNDER TWO THINGS, DELIBERATELY !!
 *
 * The header is z-50 and the full screen mobile menu is z-40. At z-30 the menu
 * covers this button while it is open, which is what should happen: a chat
 * bubble floating over an open navigation menu is a control nobody wants and
 * everybody taps by accident. The dialog it opens is z-50, so that sits above
 * everything including the button that opened it.
 *
 * On the home page it overlaps the hero's statistics marquee, which is
 * `absolute bottom-12`. That was accepted rather than missed. Lifting it clear
 * of the marquee would push it off the bottom of a short phone, which is a
 * worse problem than an overlap every site with a chat bubble already has.
 */
export function QuoteBubble() {
  return (
    <QuoteLauncher
      placement="floating"
      /*
       * The anchor carries no text, so it needs a name of its own. "Chat"
       * alone would promise something this does not deliver: what opens is a
       * short scripted assistant that takes a brief, not a live conversation
       * with a person. The label says what the visitor actually gets.
       */
      aria-label="Open the quote assistant"
      /*
        One line rather than a wrapped template string. A multi line class
        attribute keeps its newlines and its indentation all the way into the
        HTML, and this element is on every page of a `force-dynamic` site, so
        that whitespace ships on every request.
      */
      className="group/bubble fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-foreground/10 transition-[background-color,transform,box-shadow] duration-300 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5 lg:bottom-8 lg:right-8 lg:h-16 lg:w-16"
    >
      {/*
        aria-hidden because the anchor is already named above. Without it a
        screen reader announces the icon as well and the control is read twice.
      */}
      <MessageCircle
        aria-hidden
        className="h-6 w-6 transition-transform duration-300 motion-safe:group-hover/bubble:scale-110 lg:h-7 lg:w-7"
      />
    </QuoteLauncher>
  );
}
