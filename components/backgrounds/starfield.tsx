"use client";

import { useEffect, useRef } from "react";

/**
 * The home hero's backdrop, chosen by the client on 18 September 2026 in
 * place of DotMatrix. Home page only: the service, industry and how-we-work
 * heroes keep HeroBackdrop.
 *
 * Adapted from an open-source CodePen starfield the client supplied. Stars
 * drift outward from the centre and a mouse moving across the hero steers the
 * field. Changes from the original:
 *
 *   - sized to the hero rather than the window, with the canvas scaled by
 *     devicePixelRatio through the transform instead of in every coordinate
 *   - stars coloured and dimmed from app/brand.css (--starfield-star and
 *     --starfield-opacity), so they follow the theme. The original's purple
 *     and cyan background glows are dropped: the hero keeps the guideline's
 *     plain background, by client request
 *   - mouse only. The original steered on touch and called preventDefault,
 *     which stopped a phone scrolling past the hero
 *   - each star keeps its own brightness with a slight flicker, where the
 *     original re-rolled every star's alpha every frame and strobed
 *   - stops when the hero is off screen or the tab is hidden, and draws one
 *     still frame for a visitor who asks for reduced motion
 */
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW = 50;

type Star = { x: number; y: number; z: number; a: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef("#f8fafc");
  const opacityRef = useRef(0.45);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
    let w = 0, h = 0, stars: Star[] = [];
    let pointerX: number | null = null, pointerY: number | null = null;
    let frame = 0, visible = true;

    /*
      The star colour follows the theme class on <html>. Watched directly
      rather than through useTheme: resolvedTheme updates before the provider
      swaps the class, so reading the property then still got the old colour
      and left white stars on the light hero.
    */
    const readColor = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--starfield-star").trim();
      if (v) colorRef.current = v;
      const o = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--starfield-opacity"));
      if (!Number.isNaN(o)) opacityRef.current = o;
      if (reduced) render();
    };
    const themeWatch = new MutationObserver(readColor);

    const newZ = () => STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w + h) / 8);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: newZ(), a: 0.5 + 0.5 * Math.random(),
      }));
      if (reduced) render();
    };

    const recycle = (s: Star) => {
      let dir = "z";
      const vx = Math.abs(velocity.x), vy = Math.abs(velocity.y);
      if (vx > 1 || vy > 1) {
        const axis = vx > vy
          ? (Math.random() < vx / (vx + vy) ? "h" : "v")
          : (Math.random() < vy / (vx + vy) ? "v" : "h");
        dir = axis === "h" ? (velocity.x > 0 ? "l" : "r") : (velocity.y > 0 ? "t" : "b");
      }
      s.z = newZ();
      if (dir === "z") { s.z = 0.1; s.x = Math.random() * w; s.y = Math.random() * h; }
      else if (dir === "l") { s.x = -OVERFLOW; s.y = h * Math.random(); }
      else if (dir === "r") { s.x = w + OVERFLOW; s.y = h * Math.random(); }
      else if (dir === "t") { s.x = w * Math.random(); s.y = -OVERFLOW; }
      else { s.x = w * Math.random(); s.y = h + OVERFLOW; }
    };

    const update = () => {
      velocity.tx *= 0.96; velocity.ty *= 0.96;
      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;
      for (const s of stars) {
        s.x += velocity.x * s.z;
        s.y += velocity.y * s.z;
        s.x += (s.x - w / 2) * velocity.z * s.z;
        s.y += (s.y - h / 2) * velocity.z * s.z;
        s.z += velocity.z;
        if (s.x < -OVERFLOW || s.x > w + OVERFLOW || s.y < -OVERFLOW || s.y > h + OVERFLOW) recycle(s);
      }
    };

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.strokeStyle = colorRef.current;
      let tailX = velocity.x * 2, tailY = velocity.y * 2;
      // stroke() skips a zero-length line, so a still star needs a stub.
      if (Math.abs(tailX) < 0.1) tailX = 0.5;
      if (Math.abs(tailY) < 0.1) tailY = 0.5;
      for (const s of stars) {
        ctx.lineWidth = STAR_SIZE * s.z;
        ctx.globalAlpha = s.a * opacityRef.current * (0.85 + 0.15 * Math.random());
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + tailX, s.y + tailY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const step = () => {
      update();
      render();
      frame = requestAnimationFrame(step);
    };
    const start = () => {
      if (!frame && !reduced && visible && !document.hidden) frame = requestAnimationFrame(step);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };

    // The canvas sits under the hero copy with pointer-events off, so the
    // pointer is read from the window and only counts while it is over the
    // hero. Mouse only: a touch drag has to scroll the page.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) { pointerX = pointerY = null; return; }
      if (pointerX !== null && pointerY !== null) {
        velocity.tx -= (x - pointerX) / 8;
        velocity.ty -= (y - pointerY) / 8;
      }
      pointerX = x; pointerY = y;
    };
    const onLeave = () => { pointerX = pointerY = null; };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 });
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    readColor();
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(canvas);
    start();

    return () => {
      stop();
      io.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
