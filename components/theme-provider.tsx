"use client";

import * as React from "react";

/**
 * The site's colour scheme: dark by default, with a button in the header to
 * switch to light for the rest of the visit, and nothing kept anywhere once
 * the tab closes.
 *
 * !! DARK BY DEFAULT SINCE 11 SEPTEMBER 2026. THE OS IS NO LONGER ASKED !!
 *
 * This used to follow `prefers-color-scheme`, which meant the server could
 * not know the colour and a blocking script had to set it before first paint.
 * The client asked for the site to open dark for everybody. The default is
 * now known on the server: app/layout.tsx renders `<html class="dark">`, so
 * the first paint is dark before any script runs, and the anti-flash script
 * that used to live here is gone because there is nothing left for it to do.
 *
 * !! STILL NO STORAGE, BY THE DECISION OF 25 AUGUST 2026 !!
 *
 * next-themes was replaced that day because it writes the choice to
 * localStorage on every call, and the client wanted no cookie and no storage
 * involved at all. That stands. A press of the button lasts for the visit,
 * including navigation between pages since the root layout stays mounted, and
 * a reload returns the site to dark. If the choice should survive a reload,
 * that is a decision to store something, and it needs making on purpose.
 */

type ResolvedTheme = "light" | "dark";

/** Matches the `dark` class app/layout.tsx puts on <html>. Change both. */
const DEFAULT_THEME: ResolvedTheme = "dark";

const ThemeContext = React.createContext<{
  resolvedTheme: ResolvedTheme;
  toggle: () => void;
}>({
  resolvedTheme: DEFAULT_THEME,
  toggle: () => {},
});

export function ThemeProvider({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}) {
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(DEFAULT_THEME);
  // Set once, on the first render past the initial one, so the class flip
  // below can tell "the value the server already painted" apart from a
  // press of the button, which is a real colour change and should sweep
  // like one.
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    const root = document.documentElement;

    // Every `transition-colors` on the page would otherwise animate at once
    // on a flip, which reads as the page glitching rather than recolouring.
    // Skipped on the first render: that pass only confirms what the server
    // already painted, so there is nothing to suppress.
    let styleToRemove: HTMLStyleElement | null = null;
    if (!isFirstRender.current) {
      styleToRemove = document.createElement("style");
      styleToRemove.textContent = "*,*::before,*::after{transition:none!important}";
      if (nonce) styleToRemove.nonce = nonce;
      document.head.appendChild(styleToRemove);
    }
    isFirstRender.current = false;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;

    if (styleToRemove) {
      // Forces the browser to apply the class change above under the
      // transition-suppressing style before that style is removed again.
      void window.getComputedStyle(root).colorScheme;
      const style = styleToRemove;
      requestAnimationFrame(() => style.remove());
    }
  }, [resolvedTheme, nonce]);

  const toggle = React.useCallback(() => {
    setResolvedTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo(() => ({ resolvedTheme, toggle }), [resolvedTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * `resolvedTheme` for anything that needs to know which way the page is
 * currently painted, and `toggle` for the header button. See the note above
 * for why there is no "system" state and no persistence once the tab closes.
 */
export function useTheme() {
  return React.useContext(ThemeContext);
}
