"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
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

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(rect.width / 20);
      const rows = Math.floor(rect.height / 20);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (rect.width / cols);
          const py = (y + 0.5) * (rect.height / rows);

          // Multiple wave interference
          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);
          
          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;
          
          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = 0.15 + normalized * 0.5;

          ctx.fillStyle = `rgba(${inkRef.current}, ${alpha})`;
          ctx.fillText(chars[charIndex], px, py);
        }
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
