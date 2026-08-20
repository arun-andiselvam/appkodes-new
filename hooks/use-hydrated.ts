"use client";

import { useSyncExternalStore } from "react";

/** Nothing to subscribe to: the value changes once, when React hydrates. */
const subscribe = () => () => {};

/**
 * False while rendering on the server and during the first client render,
 * true afterwards.
 *
 * The `useState(false)` plus `useEffect(() => setMounted(true))` pair does the
 * same job, but sets state inside an effect, which costs a second render pass
 * and is what React now warns about. This is the same idea in the form React
 * asks for.
 *
 * Use it for anything the server cannot know: the resolved colour scheme, or
 * an entrance animation that has to start from its "before" state so the
 * markup matches on both sides.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
