"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

/**
 * Layered sine ribbons drifting across the canvas. Reads as motion and depth
 * without a single dot; the brand blue is carried by a couple of the strands.
 */
export function FlowLines({ lines = 22, className = "" }: { lines?: number; className?: string }) {
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
      t += 0.004;
      ctx.clearRect(0, 0, w, h);
      const ink = inkRef.current;
      const accent = accentRef.current;

      for (let i = 0; i < lines; i++) {
        const p = i / lines;
        const isAccent = i % 7 === 3;
        const amp = 40 + p * 90;
        const yBase = h * (0.12 + p * 0.8);
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.0035 + t * (1 + p) + i * 0.6) * amp +
            Math.sin(x * 0.011 - t * 1.7 + i) * (amp * 0.22);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isAccent
          ? `rgba(${accent}, ${0.16 + p * 0.14})`
          : `rgba(${ink}, ${0.05 + p * 0.07})`;
        ctx.lineWidth = isAccent ? 1.4 : 1;
        ctx.stroke();
      }
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [lines, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
