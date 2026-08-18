"use client";

import { useEffect, useRef } from "react";
import { useCanvasInk } from "@/hooks/use-canvas-ink";

type Props = {
  density?: number;
  /** Max distance in px at which two nodes are linked. */
  linkDistance?: number;
  className?: string;
};

/**
 * The classic "constellation" look: nodes drift and draw links to nearby
 * neighbours, with the cursor pushing them apart. Canvas 2D, no dependencies.
 */
export function ParticlesNetwork({ density = 70, linkDistance = 140, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useCanvasInk();
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(density * (w * h) / (1440 * 900));
      nodes = Array.from({ length: Math.max(20, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const ink = inkRef.current;
      const m = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // cursor repulsion
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const d = Math.sqrt(d2) || 1;
          n.x += (dx / d) * 1.2;
          n.y += (dy / d) * 1.2;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            ctx.strokeStyle = `rgba(${ink}, ${0.18 * (1 - dist / linkDistance)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${ink}, 0.5)`;
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", seed);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [density, linkDistance, inkRef]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
