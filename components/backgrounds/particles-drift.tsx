"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

type Props = {
  /** Particle count at 1440px wide; scales with area. */
  density?: number;
  className?: string;
};

/**
 * Drifting dots with gentle mouse parallax.
 * Canvas 2D, no dependencies. Theme-aware via useCanvasInk.
 */
export function ParticlesDrift({ density = 90, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dots: { x: number; y: number; r: number; vx: number; vy: number; a: number; depth: number }[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(density * (w * h) / (1440 * 900));
      dots = Array.from({ length: Math.max(24, count) }, () => {
        const depth = 0.3 + Math.random() * 0.7;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.6 + Math.random() * 1.8) * depth,
          vx: (Math.random() - 0.5) * 0.18 * depth,
          vy: (Math.random() - 0.5) * 0.18 * depth,
          a: 0.15 + Math.random() * 0.45,
          depth,
        };
      });
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.tx = (e.clientX - rect.left - w / 2) / w;
      pointerRef.current.ty = (e.clientY - rect.top - h / 2) / h;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onPointer);

    const render = () => {
      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.05;
      p.y += (p.ty - p.y) * 0.05;

      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;

        const px = d.x + p.x * 60 * d.depth;
        const py = d.y + p.y * 60 * d.depth;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${inkRef.current}, ${d.a * d.depth})`;
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", seed);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [density, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
