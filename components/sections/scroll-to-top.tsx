"use client";

import { useLayoutEffect } from "react";

/**
 * Puts the window at the top when a loading boundary appears.
 *
 * !! WITHOUT THIS, A CLICK FROM HALFWAY DOWN A LIST LANDS ON THE FOOTER !!
 *
 * Reported 18 September 2026, the day after the article skeleton shipped, and
 * the skeleton is the cause. Next swaps the page for the loading boundary
 * immediately, and the boundary is a few screens shorter than the list you
 * clicked from. The document shrinks under a scroll offset that no longer
 * exists, so the browser clamps the offset to the new bottom: the visitor sees
 * the footer, then gets thrown to the top when the article replaces the
 * skeleton. Next's own scroll-to-top runs when the navigation completes, which
 * is exactly the moment too late.
 *
 * "instant" is deliberate: app/globals.css sets scroll-behavior: smooth on the
 * root, and letting that animate scrolls the footer past the reader on the way
 * up, which is the same distraction in slower form.
 *
 * !! useLayoutEffect, NOT useEffect !!
 *
 * useEffect runs after the browser has painted, so the first frame of the
 * skeleton was drawn at the old, clamped scroll position and then snapped to
 * the top: a one-frame jerk, reported 18 September 2026. A layout effect runs
 * after React commits and before paint, so the first frame is already at the
 * top.
 */
export function ScrollToTop() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
