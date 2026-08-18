"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Soft aurora: a few large radial gradients in the brand palette, drifting on
 * lazy sine paths. No particles — this reads as atmosphere/light, not dots.
 */
export function AuroraMesh({ intensity = 1, className = "" }: { intensity?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const darkRef = useRef(false);
  darkRef.current = resolvedTheme === "dark";

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
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { hue: [0, 82, 204], dx: 0.22, dy: 0.16, sx: 0.35, sy: 0.28, r: 0.55 },
      { hue: [76, 141, 255], dx: 0.31, dy: 0.21, sx: 0.62, sy: 0.42, r: 0.45 },
      { hue: [255, 139, 0], dx: 0.17, dy: 0.27, sx: 0.78, sy: 0.68, r: 0.34 },
      { hue: [0, 61, 155], dx: 0.26, dy: 0.13, sx: 0.22, sy: 0.72, r: 0.40 },
    ];

    const render = () => {
      t += 0.0016;
      ctx.clearRect(0, 0, w, h);
      const dark = darkRef.current;
      const peak = (dark ? 0.30 : 0.22) * intensity;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const cx = (b.sx + Math.sin(t * (1 + i * 0.3) + i) * b.dx) * w;
        const cy = (b.sy + Math.cos(t * (0.8 + i * 0.25) + i * 2) * b.dy) * h;
        const rad = b.r * Math.min(w, h) * (1 + Math.sin(t * 1.4 + i) * 0.12);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const [r, gr, bl] = b.hue;
        g.addColorStop(0, `rgba(${r}, ${gr}, ${bl}, ${peak})`);
        g.addColorStop(0.55, `rgba(${r}, ${gr}, ${bl}, ${peak * 0.35})`);
        g.addColorStop(1, `rgba(${r}, ${gr}, ${bl}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} style={{ filter: "blur(28px)" }} />;
}
