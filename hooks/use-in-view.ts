"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

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
  }, [threshold, rootMargin, once]);

  return [ref, inView] as const;
}
