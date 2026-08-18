"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

type Props = {
  count?: number;
  /** Fraction of particles painted in the brand colour. */
  accentRatio?: number;
  className?: string;
};

/**
 * Dense 3D particle field: points are projected with perspective and drift
 * toward the viewer, so the field reads as depth rather than flat noise.
 * A slice of particles picks up the brand blue.
 */
export function ParticlesField({ count = 420, accentRatio = 0.12, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);
  const accentRef = useRef("0, 82, 204");

  useEffect(() => {
    // Read the brand colour from the token so it tracks the theme.
    const probe = getComputedStyle(document.documentElement).getPropertyValue("--brand-blue").trim();
    const hex = probe.replace("#", "");
    if (hex.length === 6) {
      const n = parseInt(hex, 16);
      accentRef.current = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let pts: { x: number; y: number; z: number; accent: boolean }[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random(),
        accent: Math.random() < accentRatio,
      }));
    };

    seed();
    window.addEventListener("resize", seed);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h);

      for (const p of pts) {
        p.z -= 0.0016;
        if (p.z <= 0.02) {
          p.z = 1;
          p.x = (Math.random() - 0.5) * 2;
          p.y = (Math.random() - 0.5) * 2;
        }
        const k = 0.55 / p.z;
        const px = cx + p.x * k * scale;
        const py = cy + p.y * k * scale;
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) continue;

        const r = Math.max(0.4, (1 - p.z) * 2.4);
        const alpha = (1 - p.z) * 0.55;
        ctx.beginPath();
        ctx.fillStyle = p.accent
          ? `rgba(${accentRef.current}, ${alpha})`
          : `rgba(${inkRef.current}, ${alpha * 0.7})`;
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", seed);
      cancelAnimationFrame(frameRef.current);
    };
  }, [count, accentRatio, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
