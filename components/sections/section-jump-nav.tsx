"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Container } from "@/components/primitives/container";

/**
 * The service page's sticky "on this page" bar, highlighting the section in
 * view. One IntersectionObserver watches every target, and the section
 * crossing a line a third of the way down the viewport is the active one.
 *
 * Two layouts, so the labels never wrap (client, 19 September 2026): a single
 * non-shrinking row from lg up, and below that a compact button naming the
 * current section that opens the full list. A thin line along the bottom
 * shows reading progress through the page.
 */
export function SectionJumpNav({ items }: { items: readonly (readonly [string, string])[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const targets = items
      .map(([id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band a third of the way down: whichever section covers it is current.
      { rootMargin: "-33% 0px -66% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    // Progress is written straight to the bar's transform, so scrolling
    // never re-renders React. Above the first section nothing is active.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      if (targets[0].getBoundingClientRect().top > window.innerHeight / 3) setActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  // Close the mobile list on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeLabel = items.find(([id]) => id === active)?.[1] ?? "Overview";

  return (
    <nav ref={navRef} aria-label="On this page" className="sticky top-0 z-30 border-y border-foreground/10 bg-background/85 backdrop-blur-md">
      <Container>
        {/* lg and up: one row that never wraps. */}
        <ul className="hidden lg:flex items-center gap-1 py-2.5 text-sm">
          {items.map(([id, label]) => {
            const current = id === active;
            return (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={current ? "location" : undefined}
                  className={`block whitespace-nowrap rounded-md px-3 py-1.5 transition-colors ${
                    current
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Below lg: the current section, opening the full list. */}
        <div className="lg:hidden relative">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="jump-list"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 py-3 text-sm"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground shrink-0">On this page</span>
              <span className="truncate font-medium text-primary">{activeLabel}</span>
            </span>
            <ChevronDown aria-hidden className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <ul
              id="jump-list"
              className="absolute left-0 right-0 top-full mb-2 rounded-xl border border-[color:var(--menu-border)] bg-[color:var(--menu-surface)] p-2 shadow-[var(--menu-shadow)] animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {items.map(([id, label]) => {
                const current = id === active;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "location" : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        current ? "bg-primary/10 text-primary font-medium" : "hover:bg-foreground/5"
                      }`}
                    >
                      {label}
                      {current && <Check aria-hidden className="w-4 h-4" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>

      {/* Reading progress. */}
      <span
        ref={barRef}
        aria-hidden
        className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </nav>
  );
}
