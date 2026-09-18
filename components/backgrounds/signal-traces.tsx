"use client";

import { useEffect, useRef } from "react";

/**
 * The home hero's backdrop, on trial from 18 September 2026. The earlier
 * trials, ArcField and Starfield, sit beside this file for switching back.
 * Home page only: the service, industry and how-we-work heroes keep
 * HeroBackdrop.
 *
 * Circuit-board tracks laid along a 48px grid with chamfered corners. A pulse
 * runs down each track and lights the pad where it lands, and the tracks
 * nearest the cursor light up.
 *
 * No CSS masks: they halved the scroll frame rate. See .signal-traces in
 * app/globals.css for the measurement and what replaced them.
 *
 * Script runs once per size change to lay the tracks out; after that every
 * moving part is a CSS animation (.signal-traces in app/globals.css), so
 * there is no per-frame script at all. Animations pause while the hero is off
 * screen, and reduced motion holds them mid-track.
 *
 * Colours come from app/brand.css (--traces-grid, --traces-line,
 * --traces-signal) and follow the theme without script. The hero keeps the
 * guideline's plain background; nothing here paints a fill.
 */

const G = 48; // grid step, px
const CHAMFER = 10; // corner cut, px
const NS = "http://www.w3.org/2000/svg";

// Small seeded generator so the layout is the same on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function el(name: string, attrs: Record<string, string | number>) {
  const n = document.createElementNS(NS, name);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  return n;
}

export function SignalTraces() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, baseSvg = baseRef.current, glowSvg = glowRef.current;
    if (!wrap || !baseSvg || !glowSvg) return;

    const build = () => {
      const { width: W, height: H } = wrap.getBoundingClientRect();
      const cols = Math.floor(W / G), rows = Math.floor(H / G);
      const rand = seeded(29);
      const count = W < 640 ? 6 : 12;
      baseSvg.replaceChildren();
      glowSvg.replaceChildren();
      for (const s of [baseSvg, glowSvg]) s.setAttribute("viewBox", `0 0 ${W} ${H}`);
      if (cols < 4 || rows < 3) return;

      for (let i = 0; i < count; i++) {
        // Start on the left or top edge and wander right and down in grid steps.
        const fromLeft = rand() < 0.6;
        let cx = fromLeft ? 0 : 2 + Math.floor(rand() * (cols - 3));
        let cy = fromLeft ? 1 + Math.floor(rand() * (rows - 2)) : 0;
        let dir: [number, number] = fromLeft ? [1, 0] : [0, 1];
        const pts: [number, number][] = [[cx, cy]];
        const segs = 5 + Math.floor(rand() * 4);
        for (let k = 0; k < segs; k++) {
          const len = 1 + Math.floor(rand() * 4);
          cx = Math.min(cols, Math.max(0, cx + dir[0] * len));
          cy = Math.min(rows - 1, Math.max(1, cy + dir[1] * len));
          const prev = pts[pts.length - 1];
          if (prev[0] !== cx || prev[1] !== cy) pts.push([cx, cy]);
          dir = dir[0] !== 0 ? [0, rand() < 0.65 ? 1 : -1] : [1, 0];
        }
        if (pts.length < 3) continue;

        const P = pts.map(([x, y]) => [x * G, y * G]);
        let d = `M${P[0][0]} ${P[0][1]}`;
        for (let j = 1; j < P.length - 1; j++) {
          const [px, py] = P[j - 1], [x, y] = P[j], [nx, ny] = P[j + 1];
          const ix = Math.sign(x - px), iy = Math.sign(y - py);
          const ox = Math.sign(nx - x), oy = Math.sign(ny - y);
          d += ` L${x - ix * CHAMFER} ${y - iy * CHAMFER} L${x + ox * CHAMFER} ${y + oy * CHAMFER}`;
        }
        const end = P[P.length - 1];
        d += ` L${end[0]} ${end[1]}`;

        // Negative delays so every pulse is already mid-track at first paint.
        const timing = {
          animationDuration: `${(3.8 + rand() * 3.4).toFixed(2)}s`,
          animationDelay: `${(-rand() * 6).toFixed(2)}s`,
        };
        baseSvg.append(el("path", { d, class: "trace" }));
        baseSvg.append(el("circle", { cx: P[0][0], cy: P[0][1], r: 2.5, class: "trace-start" }));
        const pulse = el("path", { d, class: "trace-pulse", pathLength: 1000 });
        Object.assign(pulse.style, timing);
        baseSvg.append(pulse);
        const pad = el("rect", { x: end[0] - 3.5, y: end[1] - 3.5, width: 7, height: 7, class: "trace-pad" });
        Object.assign(pad.style, timing);
        baseSvg.append(pad);
        glowSvg.append(el("path", { d, class: "trace-lit" }));
      }
    };

    // The backdrop sits under the hero copy with pointer-events off, so the
    // cursor is read from the window and handed to the glow's clip-path.
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

    let resizeFrame = 0;
    const resizeWatch = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });
    // Off screen, the whole backdrop's animations pause through one attribute.
    const io = new IntersectionObserver(([e]) => {
      wrap.dataset.paused = e.isIntersecting ? "false" : "true";
    }, { threshold: 0 });

    build();
    resizeWatch.observe(wrap);
    io.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(moveFrame);
      cancelAnimationFrame(resizeFrame);
      resizeWatch.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="signal-traces absolute inset-0 pointer-events-none">
      <div className="signal-traces-grid absolute inset-0" />
      <svg ref={baseRef} className="absolute inset-0 w-full h-full" />
      <svg ref={glowRef} className="signal-traces-glow absolute inset-0 w-full h-full" />
      <div className="signal-traces-veil absolute inset-0" />
    </div>
  );
}
