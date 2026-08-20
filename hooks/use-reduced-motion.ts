"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked their system to reduce motion.
 *
 * Read through useSyncExternalStore rather than an effect that calls setState.
 * A media query is exactly the external store that API exists for, and reading
 * it this way means the value is correct on the first client render instead of
 * one render later. Two sections were each carrying their own copy of the
 * listener before this.
 *
 * The server cannot know the preference, so it assumes motion is fine. React
 * corrects it during hydration.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
