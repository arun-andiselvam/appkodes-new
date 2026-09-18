"use client";

import { useEffect, useRef } from "react";

/**
 * The home hero's backdrop, on trial from 18 September 2026 in place of
 * Starfield (components/backgrounds/starfield.tsx, kept for switching back).
 * Home page only: the service, industry and how-we-work heroes keep
 * HeroBackdrop.
 *
 * Quarter-circle tiles cut to the curve of the "a" in the logo, each turned
 * one of two ways so neighbouring arcs join into long winding paths. A few
 * signals travel those paths, and the arcs nearest the cursor light up.
 *
 * Kept cheap on purpose:
 *   - the tile field is painted once per size or theme change, never per frame
 *   - the cursor glow is the same field in the signal colour on a second
 *     canvas, revealed by a CSS radial mask that follows --mx/--my. Moving the
 *     mouse redraws nothing
 *   - only the signals redraw each frame, and the loop stops when the hero is
 *     off screen or the tab is hidden
 *   - reduced motion gets one still frame with the signal trails in place
 *
 * Colours and strength come from app/brand.css (--arcfield-line,
 * --arcfield-signal) and follow the theme class on <html>. The hero keeps the
 * guideline's plain background; nothing here paints a fill.
 */

// Which edge each entry edge leads to, for the two tile orientations.
// Edges: 0 top, 1 right, 2 bottom, 3 left.
const LINKS = [[3, 2, 1, 0], [1, 0, 3, 2]];
const STEP = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const SPEED = 90; // px per second along the arcs
const TRAIL = 0.55; // seconds of trail behind each signal

type Signal = { c: number; r: number; e: number; t: number; trail: [number, number, number][] };

// Small seeded generator so the pattern is the same on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ArcField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const signalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const base = baseRef.current?.getContext("2d");
    const glow = glowRef.current?.getContext("2d");
    const sig = signalRef.current?.getContext("2d");
    if (!wrap || !base || !glow || !sig) return;
    const contexts = [base, glow, sig];

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, S = 56, cols = 0, rows = 0;
    let types: number[] = [], signals: Signal[] = [];
    let lineColor = "rgb(148 163 184 / 0.17)", signalColor = "#7aa3ff";
    let rand = seeded(11);
    let frame = 0, last = 0, visible = true;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      lineColor = cs.getPropertyValue("--arcfield-line").trim() || lineColor;
      signalColor = cs.getPropertyValue("--arcfield-signal").trim() || signalColor;
    };

    const tilePath = (ctx: CanvasRenderingContext2D) => {
      const r = S / 2;
      ctx.beginPath();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * S, y = row * S;
          if (types[row * cols + col] === 0) {
            ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI / 2);
            ctx.moveTo(x + S, y + r); ctx.arc(x + S, y + S, r, -Math.PI / 2, -Math.PI, true);
          } else {
            ctx.moveTo(x + r, y); ctx.arc(x + S, y, r, Math.PI, Math.PI / 2, true);
            ctx.moveTo(x + r, y + S); ctx.arc(x, y + S, r, 0, -Math.PI / 2, true);
          }
        }
      }
    };

    const paintField = () => {
      base.clearRect(0, 0, w, h);
      tilePath(base);
      base.strokeStyle = lineColor; base.lineWidth = 1; base.stroke();
      glow.clearRect(0, 0, w, h);
      tilePath(glow);
      glow.strokeStyle = signalColor; glow.lineWidth = 1.5; glow.stroke();
    };

    const spawn = (): Signal => ({
      c: Math.floor(rand() * cols), r: Math.floor(rand() * rows),
      e: Math.floor(rand() * 4), t: rand(), trail: [],
    });

    // Where a signal sits on the arc through its current tile.
    const point = (s: Signal): [number, number] => {
      const r = S / 2, x = s.c * S, y = s.r * S;
      const exit = LINKS[types[s.r * cols + s.c]][s.e];
      const has = (k: number) => s.e === k || exit === k;
      const cx = has(3) ? x : x + S, cy = has(0) ? y : y + S;
      const mid = (k: number): [number, number] => [
        x + (k === 1 ? S : k === 3 ? 0 : r),
        y + (k === 2 ? S : k === 0 ? 0 : r),
      ];
      const [ax, ay] = mid(s.e), [bx, by] = mid(exit);
      const a0 = Math.atan2(ay - cy, ax - cx);
      let d = Math.atan2(by - cy, bx - cx) - a0;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      const a = a0 + d * s.t;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };

    const advance = (s: Signal, dt: number, now: number) => {
      s.t += (SPEED * dt) / ((Math.PI / 2) * (S / 2));
      while (s.t >= 1) {
        s.t -= 1;
        const exit = LINKS[types[s.r * cols + s.c]][s.e];
        s.c += STEP[exit][0]; s.r += STEP[exit][1]; s.e = (exit + 2) % 4;
        if (s.c < 0 || s.r < 0 || s.c >= cols || s.r >= rows) {
          Object.assign(s, spawn(), { t: 0 });
          return;
        }
      }
      const [px, py] = point(s);
      s.trail.push([px, py, now]);
      while (s.trail.length && now - s.trail[0][2] > TRAIL) s.trail.shift();
    };

    const drawSignals = (now: number) => {
      sig.clearRect(0, 0, w, h);
      sig.strokeStyle = signalColor; sig.fillStyle = signalColor;
      sig.lineWidth = 2; sig.lineCap = "round";
      for (const s of signals) {
        const tr = s.trail;
        for (let i = 1; i < tr.length; i++) {
          sig.globalAlpha = Math.max(0, 1 - (now - tr[i][2]) / TRAIL) * 0.9;
          sig.beginPath(); sig.moveTo(tr[i - 1][0], tr[i - 1][1]); sig.lineTo(tr[i][0], tr[i][1]); sig.stroke();
        }
        const head = tr[tr.length - 1];
        if (head) {
          sig.globalAlpha = 0.18; sig.beginPath(); sig.arc(head[0], head[1], 7, 0, 2 * Math.PI); sig.fill();
          sig.globalAlpha = 1; sig.beginPath(); sig.arc(head[0], head[1], 2.4, 0, 2 * Math.PI); sig.fill();
        }
      }
      sig.globalAlpha = 1;
    };

    const stillFrame = () => {
      let now = 0;
      for (let i = 0; i < 40; i++) { now += 1 / 60; for (const s of signals) advance(s, 1 / 60, now); }
      drawSignals(now);
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      S = w < 640 ? 44 : 56;
      cols = Math.ceil(w / S); rows = Math.ceil(h / S);
      rand = seeded(11);
      types = Array.from({ length: cols * rows }, () => (rand() < 0.5 ? 0 : 1));
      for (const ctx of contexts) {
        ctx.canvas.width = Math.round(w * dpr); ctx.canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      paintField();
      signals = Array.from({ length: w < 640 ? 4 : 7 }, spawn);
      if (reduced) stillFrame();
    };

    const loop = (ts: number) => {
      const now = ts / 1000;
      const dt = Math.min(0.05, now - (last || now));
      last = now;
      for (const s of signals) advance(s, dt, now);
      drawSignals(now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && !reduced && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(loop); }
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };

    // The backdrop sits under the hero copy with pointer-events off, so the
    // cursor is read from the window and handed to the CSS mask.
    let moveFrame = 0, mx = -999, my = -999;
    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      mx = inside ? e.clientX - rect.left : -999;
      my = inside ? e.clientY - rect.top : -999;
      if (moveFrame) return;
      moveFrame = requestAnimationFrame(() => {
        moveFrame = 0;
        wrap.style.setProperty("--mx", `${mx}px`);
        wrap.style.setProperty("--my", `${my}px`);
      });
    };
    const onLeave = () => {
      wrap.style.setProperty("--mx", "-999px");
      wrap.style.setProperty("--my", "-999px");
    };

    const themeWatch = new MutationObserver(() => {
      readColors();
      paintField();
      if (reduced) stillFrame();
    });
    let resizeFrame = 0;
    const resizeWatch = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 });
    const onVisibility = () => (document.hidden ? stop() : start());

    readColors();
    build();
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    resizeWatch.observe(wrap);
    io.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      cancelAnimationFrame(moveFrame);
      cancelAnimationFrame(resizeFrame);
      themeWatch.disconnect();
      resizeWatch.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /*
    The whole field is quieter on the left, where the headline sits, and full
    strength on the open right side. The glow canvas carries its own mask, a
    circle at the cursor.
  */
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(100deg,rgb(0_0_0/0.4)_0%,rgb(0_0_0/0.55)_35%,#000_70%)]"
    >
      <canvas ref={baseRef} className="absolute inset-0 w-full h-full block" />
      <canvas
        ref={glowRef}
        className="absolute inset-0 w-full h-full block [mask-image:radial-gradient(220px_circle_at_var(--mx,-999px)_var(--my,-999px),#000_0%,transparent_72%)]"
      />
      <canvas ref={signalRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
