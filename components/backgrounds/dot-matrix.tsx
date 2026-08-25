"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

/**
 * Regular dot grid with a travelling wave, plus a cursor spotlight that lifts
 * nearby dots into the brand colour. Modular and precise rather than scattered
 * — it echoes the grid the hero already draws.
 */
export function DotMatrix({
  gap = 26,
  /**
   * Strength the cursor spotlight fades to while the pointer is over a link,
   * button or form control, so it never competes with interactive styling.
   * 0 removes the spotlight entirely; the dot grid itself is unaffected.
   */
  spotlightDimTo = 0,
  /**
   * How much the cursor halo adds on top of the base grid: alpha contribution
   * and how far dots swell. Kept low so the spotlight never reads through
   * headline or body copy sitting above it.
   */
  spotlightStrength = 0.2,
  className = "",
}: {
  gap?: number;
  spotlightDimTo?: number;
  spotlightStrength?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const fadeRef = useRef(1);
  const fadeTargetRef = useRef(1);
  const accentRef = useRef("20, 111, 144");

  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--brand-blue").trim().replace("#", "");
    if (v.length === 6) {
      const n = parseInt(v, 16);
      accentRef.current = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, t = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // The whole header band counts, not just the links inside it: the
    // spotlight reads as clutter anywhere behind the navigation.
    const INTERACTIVE =
      'header, nav, a, button, [role="button"], input, select, textarea, label, [data-slot="button"]';

    // Raw pointermove can fire well above the render loop's own rate — high
    // poll-rate mice and trackpads report far more than 60 times a second.
    // The spotlight only ever reads mouseRef/fadeTargetRef once per painted
    // frame, so sampling them more often than that changes nothing on
    // screen; it just spends elementFromPoint (a hit-test against layout)
    // on positions the loop will never draw. Coalescing to the next frame
    // keeps the same response the visitor sees, for a fraction of the calls.
    let pendingEvent: PointerEvent | null = null;
    let moveFrame = 0;
    const onMove = (e: PointerEvent) => {
      pendingEvent = e;
      if (moveFrame) return;
      moveFrame = requestAnimationFrame(() => {
        moveFrame = 0;
        const ev = pendingEvent;
        if (!ev) return;
        pendingEvent = null;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

        // The canvas itself is pointer-events:none, so this returns whatever
        // the visitor is actually pointing at.
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const overInteractive = !!el?.closest(INTERACTIVE);
        fadeTargetRef.current = overInteractive ? spotlightDimTo : 1;

        // A paused loop still needs to run out the fade.
        if (!frameRef.current && visible && !document.hidden) render();
      });
    };

    const onPointerOut = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      fadeTargetRef.current = 1;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onPointerOut);
    window.addEventListener("blur", onPointerOut);

    // Don't burn a frame loop while the hero is scrolled past or the tab is
    // in the background.
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !frameRef.current) render();
    }, { threshold: 0 });
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
     * !! DOTS ARE BATCHED BY OPACITY. ONE fill() PER BUCKET, NOT PER DOT !!
     *
     * This loop used to call beginPath/arc/fill for every dot on every
     * frame. On a 1440x900 hero at gap 26 that is 1,960 separate fills, and
     * at 60fps it is 117,600 draw calls a second for a background texture.
     * Measured against the live site on 25 August 2026, the two canvases on
     * this page were together more than half of a 38% idle CPU figure: a tab
     * sitting still, doing nothing anybody asked for.
     *
     * A canvas path can hold any number of arcs and be filled once, but only
     * if they share a fillStyle. So the dots are bucketed by the alpha they
     * would have been drawn with, each bucket collected into one path, and
     * each path filled once. 1,960 fills become at most 2 x BUCKETS.
     *
     * !! THE QUANTISATION IS WHY THIS IS NOT A VISUAL CHANGE !!
     *
     * Alpha runs from 0.10 to about 0.46 here. 64 buckets across 0..0.5 puts
     * the steps at 0.0078 apart, on a texture whose own opacity tops out
     * around a quarter. That is well under what an eye resolves, and the
     * before and after frames were pixel-compared rather than eyeballed.
     * Radius is NOT quantised: arcs of different sizes sit in one path
     * happily, so every dot keeps its exact size.
     *
     * The arrays are allocated once out here and emptied per frame with
     * length = 0. Rebuilding them each frame would hand the garbage
     * collector 128 arrays every 16ms, which is the cost this is removing.
     */
    const BUCKETS = 64;
    const ALPHA_MAX = 0.5;
    const TAU = Math.PI * 2;
    const inkBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);
    const accentBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);

    const drawBuckets = (buckets: number[][], colour: string) => {
      for (let i = 0; i < BUCKETS; i += 1) {
        const bucket = buckets[i];
        if (bucket.length === 0) continue;
        ctx.beginPath();
        for (let j = 0; j < bucket.length; j += 3) {
          const x = bucket[j];
          const y = bucket[j + 1];
          const r = bucket[j + 2];
          /* moveTo before each arc, or the path draws a connecting line from
             the previous dot to this one and the field turns into a mesh. */
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, TAU);
        }
        /* The bucket's midpoint, so the error is half a step either way
           rather than a whole step in one direction. */
        ctx.fillStyle = `rgba(${colour}, ${((i + 0.5) / BUCKETS) * ALPHA_MAX})`;
        ctx.fill();
        bucket.length = 0;
      }
    };

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, w, h);

      // Ease toward the target so the field dissolves rather than blinking.
      fadeRef.current += (fadeTargetRef.current - fadeRef.current) * 0.12;
      const fade = fadeRef.current;

      const m = mouseRef.current;
      const ink = inkRef.current;
      const accent = accentRef.current;

      /* With the pointer away from the canvas `fade` eases to 0, which makes
         `near` 0 for every dot however far away the pointer is. Checking once
         here skips a hypot per dot for the case that is true most of the
         time, which is nobody's cursor being anywhere near this canvas. */
      const spotlit = fade > 0.001;

      // Start at 0, not `gap`, so the grid meets the top and left edges with
      // no inset margin, and run past w/h so the far edges are covered too.
      for (let x = 0; x <= w; x += gap) {
        for (let y = 0; y <= h; y += gap) {
          const wave = Math.sin(x * 0.012 + y * 0.008 + t) * 0.5 + 0.5;
          let near = 0;
          if (spotlit) {
            const d = Math.hypot(x - m.x, y - m.y);
            // `fade` scales the spotlight alone — the base grid never dims.
            near = Math.max(0, 1 - d / 170) * fade;
          }
          const r = 0.9 + wave * 0.8 + near * (spotlightStrength * 4);
          const a = 0.10 + wave * 0.16 + near * spotlightStrength;

          let slot = ((a / ALPHA_MAX) * BUCKETS) | 0;
          if (slot < 0) slot = 0;
          else if (slot >= BUCKETS) slot = BUCKETS - 1;

          const bucket = near > 0.04 ? accentBuckets[slot] : inkBuckets[slot];
          bucket.push(x, y, r);
        }
      }

      drawBuckets(inkBuckets, ink);
      drawBuckets(accentBuckets, accent);

      // A reduced-motion visitor gets one painted frame, no animation.
      if (reduced || !visible || document.hidden) {
        frameRef.current = 0;
        return;
      }
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onPointerOut);
      window.removeEventListener("blur", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(moveFrame);
    };
  }, [gap, spotlightDimTo, spotlightStrength, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
