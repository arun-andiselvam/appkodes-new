"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type UseInViewOptions = {
  /** Fraction of the element that must be visible before firing. */
  threshold?: number;
  rootMargin?: string;
  /** Stop observing after the first intersection. Default true. */
  once?: boolean;
};

/**
 * Reveal-on-scroll primitive.
 *
 * Replaces the IntersectionObserver block that was copy-pasted into nine
 * sections. Also honours `prefers-reduced-motion`: those visitors get the
 * content revealed immediately instead of waiting on a scroll animation.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    // Nothing to observe for a visitor who has asked for reduced motion: the
    // content is revealed below regardless of where the page is scrolled to.
    if (!element || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  return [ref, inView || prefersReducedMotion] as const;
}
