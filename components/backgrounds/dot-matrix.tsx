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

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // The canvas itself is pointer-events:none, so this returns whatever the
      // visitor is actually pointing at.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const overInteractive = !!el?.closest(INTERACTIVE);
      fadeTargetRef.current = overInteractive ? spotlightDimTo : 1;

      // A paused loop still needs to run out the fade.
      if (!frameRef.current && visible && !document.hidden) render();
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

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, w, h);

      // Ease toward the target so the field dissolves rather than blinking.
      fadeRef.current += (fadeTargetRef.current - fadeRef.current) * 0.12;
      const fade = fadeRef.current;

      const m = mouseRef.current;
      const ink = inkRef.current;
      const accent = accentRef.current;

      // Start at 0, not `gap`, so the grid meets the top and left edges with
      // no inset margin, and run past w/h so the far edges are covered too.
      for (let x = 0; x <= w; x += gap) {
        for (let y = 0; y <= h; y += gap) {
          const wave = Math.sin(x * 0.012 + y * 0.008 + t) * 0.5 + 0.5;
          const d = Math.hypot(x - m.x, y - m.y);
          // `fade` scales the spotlight alone — the base grid never dims.
          const near = Math.max(0, 1 - d / 170) * fade;
          const r = 0.9 + wave * 0.8 + near * (spotlightStrength * 4);
          const a = 0.10 + wave * 0.16 + near * spotlightStrength;

          ctx.beginPath();
          ctx.fillStyle = near > 0.04 ? `rgba(${accent}, ${a})` : `rgba(${ink}, ${a})`;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
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
    };
  }, [gap, spotlightDimTo, spotlightStrength, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
