"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

/**
 * Ink colour for the 2D canvas backdrops, as an `r, g, b` string ready to drop
 * into `rgba(...)`.
 *
 * Returned as a ref rather than state on purpose: the animation loops read it
 * every frame, so the colour can change on a theme flip without tearing down
 * and restarting the requestAnimationFrame loop (which would reset the
 * animation's internal clock and make the graphic visibly jump).
 *
 * !! "emphasis" READS A DIFFERENT PAIR, NOT THE OPPOSITE OF "page" !!
 *
 * `page` matches --foreground, which flips with the theme because the page
 * background does. The emphasis panel (app/brand.css) does not flip: it is
 * dark in both themes, so a canvas backdrop living on it needs light ink in
 * both themes too, not ink that flips and goes dark-on-dark in light mode.
 * Added 24 August 2026 when the footer's AnimatedWave moved onto the panel.
 * The two values below are --emphasis-foreground itself (light mode #fafcfd,
 * dark mode #e3f2f7), not a single colour reused for both.
 */
export function useCanvasInk(tone: "page" | "emphasis" = "page") {
  const { resolvedTheme } = useTheme();
  const inkRef = useRef<string>("0, 0, 0");

  useEffect(() => {
    if (tone === "emphasis") {
      // --emphasis-foreground: light mode var(--surface) #fafcfd, dark mode
      // var(--surface-ink) #e3f2f7.
      inkRef.current = resolvedTheme === "dark" ? "227, 242, 247" : "250, 252, 253";
      return;
    }
    // Matches --foreground in each palette: design-system navy #091E42 / #EDF0FF.
    inkRef.current = resolvedTheme === "dark" ? "237, 240, 255" : "9, 30, 66";
  }, [resolvedTheme, tone]);

  return inkRef;
}
