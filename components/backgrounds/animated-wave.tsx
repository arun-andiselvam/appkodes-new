"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /*
   * "emphasis", not the default "page" tone. This component has exactly one
   * caller, components/layout/footer.tsx, and the footer sits on the dark
   * emphasis panel now rather than the plain page background. The default
   * tone reads --foreground, which is dark in light mode - dark glyphs on
   * a panel that is already dark in light mode would be close to invisible.
   */
  const inkRef = useCanvasInk("emphasis");
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;

    /*
     * Cached from resize rather than read in render().
     *
     * !! getBoundingClientRect WAS A LAYOUT QUERY EVERY FRAME !!
     *
     * resize() and the ResizeObserver below already know whenever the size
     * changes, so re-measuring the element 60 times a second inside the
     * render loop was pure overhead — the answer is the same value every
     * time except the one frame after an actual resize. Caching it here
     * means the loop reads two numbers instead of querying layout.
     */
    let w = 0, h = 0, cols = 0, rows = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      cols = Math.floor(w / 20);
      rows = Math.floor(h / 20);

      // Context state survives a scale() call, but not a canvas resize —
      // setting canvas.width/height above clears it, so these have to be
      // reapplied here rather than only once at setup.
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    resize();
    window.addEventListener("resize", resize);
    // The footer grows with its own content, so a window resize isn't the only
    // thing that changes our size — watch the element itself.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /*
     * The footer sits at the bottom of every page, so without these guards
     * this loop repaints ~1500 glyphs a frame forever, including the entire
     * time the footer is scrolled out of view. fillText is main-thread work,
     * so that competes with scrolling for no visible benefit. DotMatrix has
     * carried the same three guards from the start; this one was missing them.
     */
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !frameRef.current && !document.hidden) render();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      } else if (visible && !frameRef.current) {
        render();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /*
     * !! CELLS ARE GROUPED BY OPACITY SO fillStyle IS SET ONCE PER GROUP !!
     *
     * This assigned ctx.fillStyle inside the inner loop, which meant building
     * an `rgba(...)` template string and having the canvas parse it back into
     * a colour for every cell on every frame. At roughly 950 cells and 60fps
     * that is 57,000 string allocations and colour parses a second, for a
     * decorative wave behind the footer.
     *
     * Sorting the cells into alpha buckets first drops that to one string and
     * one parse per bucket. The fillText calls themselves stay as they are:
     * unlike arcs, glyphs cannot be batched into a single path, and their
     * rasterisation is cached by the browser anyway.
     *
     * Same 64 buckets and the same reasoning as
     * components/backgrounds/dot-matrix.tsx, which was measured and
     * pixel-compared on 25 August 2026. Alpha here spans 0.15 to 0.65, so a
     * bucket is 0.0078 wide.
     */
    const BUCKETS = 64;
    const ALPHA_MAX = 1;
    /* [x, y, charIndex] triples per bucket, allocated once and emptied with
       length = 0 each frame rather than rebuilt. */
    const buckets: number[][] = Array.from({ length: BUCKETS }, () => []);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (w / cols);
          const py = (y + 0.5) * (h / rows);

          // Multiple wave interference
          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);

          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;

          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = 0.15 + normalized * 0.5;

          let slot = ((alpha / ALPHA_MAX) * BUCKETS) | 0;
          if (slot < 0) slot = 0;
          else if (slot >= BUCKETS) slot = BUCKETS - 1;
          buckets[slot].push(px, py, charIndex);
        }
      }

      const ink = inkRef.current;
      for (let i = 0; i < BUCKETS; i += 1) {
        const bucket = buckets[i];
        if (bucket.length === 0) continue;
        // Bucket midpoint, so the error is half a step either way.
        ctx.fillStyle = `rgba(${ink}, ${((i + 0.5) / BUCKETS) * ALPHA_MAX})`;
        for (let j = 0; j < bucket.length; j += 3) {
          ctx.fillText(chars[bucket[j + 2]], bucket[j], bucket[j + 1]);
        }
        bucket.length = 0;
      }

      time += 0.03;

      // One painted frame for a reduced-motion visitor, and none at all while
      // the footer is off-screen or the tab is in the background.
      if (reduced || !visible || document.hidden) {
        frameRef.current = 0;
        return;
      }
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
    // Refs are stable for the life of the component, and the render loop reads
    // inkRef.current on every frame rather than closing over a value, so the
    // effect must not restart when the ink colour changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
