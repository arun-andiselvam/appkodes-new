"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Ink colour for the 2D canvas backdrops, as an `r, g, b` string ready to drop
 * into `rgba(...)`.
 *
 * Returned as a ref rather than state on purpose: the animation loops read it
 * every frame, so the colour can change on a theme flip without tearing down
 * and restarting the requestAnimationFrame loop (which would reset the
 * animation's internal clock and make the graphic visibly jump).
 */
export function useCanvasInk() {
  const { resolvedTheme } = useTheme();
  const inkRef = useRef<string>("0, 0, 0");

  useEffect(() => {
    // Matches --foreground in each palette: design-system navy #091E42 / #EDF0FF.
    inkRef.current = resolvedTheme === "dark" ? "237, 240, 255" : "9, 30, 66";
  }, [resolvedTheme]);

  return inkRef;
}
