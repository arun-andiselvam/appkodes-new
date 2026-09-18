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
 * Both themes use --emphasis-foreground, #f8fafc, on the obsidian panel.
 */
export function useCanvasInk(tone: "page" | "emphasis" = "page") {
  const { resolvedTheme } = useTheme();
  const inkRef = useRef<string>("0, 0, 0");

  useEffect(() => {
    if (tone === "emphasis") {
      // --emphasis-foreground, #f8fafc in both themes.
      inkRef.current = "248, 250, 252";
      return;
    }
    // Matches --foreground in each palette: obsidian #0b0f17 / #f8fafc.
    inkRef.current = resolvedTheme === "dark" ? "248, 250, 252" : "11, 15, 23";
  }, [resolvedTheme, tone]);

  return inkRef;
}
