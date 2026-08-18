"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

/**
 * A grid plane running to a horizon, scrolling toward the viewer. Structural
 * and architectural — closest to DESIGN.md's "modular grid" language.
 */
export function PerspectiveGrid({ speed = 1, className = "" }: { speed?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);
  const accentRef = useRef("0, 82, 204");

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
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      t += 0.0035 * speed;
      ctx.clearRect(0, 0, w, h);
      const ink = inkRef.current;
      const horizon = h * 0.42;
      const rows = 26;
      const cols = 26;

      // receding horizontal lines
      for (let i = 0; i < rows; i++) {
        const p = ((i / rows) + t) % 1;
        const z = p * p * p;           // cubic easing -> denser near the horizon
        const y = horizon + z * (h - horizon);
        const a = (0.03 + z * 0.16) * (1 - Math.pow(1 - p, 3));
        ctx.strokeStyle = `rgba(${ink}, ${a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // vanishing verticals
      const vx = w / 2;
      for (let i = -cols; i <= cols; i++) {
        const spread = i / cols;
        const xBottom = vx + spread * w * 1.9;
        const accent = i === 0 || Math.abs(i) === 6;
        ctx.strokeStyle = accent
          ? `rgba(${accentRef.current}, 0.14)`
          : `rgba(${ink}, 0.07)`;
        ctx.lineWidth = accent ? 1.3 : 1;
        ctx.beginPath();
        ctx.moveTo(vx, horizon);
        ctx.lineTo(xBottom, h);
        ctx.stroke();
      }

      // horizon glow
      const g = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 40);
      g.addColorStop(0, `rgba(${accentRef.current}, 0)`);
      g.addColorStop(0.5, `rgba(${accentRef.current}, 0.10)`);
      g.addColorStop(1, `rgba(${accentRef.current}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, horizon - 60, w, 100);

      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [speed, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
