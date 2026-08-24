"use client";

import * as React from "react";

/**
 * The site's colour scheme: follows the OS setting by default, with a
 * button to override it for the rest of the visit, and nothing kept
 * anywhere once the tab closes.
 *
 * !! REPLACED next-themes ON 25 AUGUST 2026. THAT IS DELIBERATE !!
 *
 * The header used to carry a three state control — system, light, dark —
 * with the choice kept in localStorage so it survived a reload. The client
 * asked for the system state gone from the button (a visitor should not
 * have to pick "match my OS" as an option; that is just what happens by
 * default), and for no cookie and no storage to be involved at all: the
 * page always opens on the system setting, an explicit pick lasts only as
 * long as the tab does, and a reload is what returns it to system.
 *
 * next-themes cannot do that. Its `setTheme` writes to localStorage
 * unconditionally on every call, with no prop to turn it off — reasonable
 * for a library whose whole premise is a rememberable choice, wrong for a
 * site that has decided not to remember one. So this reads only
 * `prefers-color-scheme` for the default and holds an explicit override, if
 * there is one, in memory alone.
 */

type ResolvedTheme = "light" | "dark";

const QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = React.createContext<{
  resolvedTheme: ResolvedTheme;
  /** null while following the system setting live. Set once the button has
   * been pressed; cleared again only by a reload, since nothing here
   * persists it on purpose. */
  override: ResolvedTheme | null;
  toggle: () => void;
}>({
  resolvedTheme: "light",
  override: null,
  toggle: () => {},
});

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  // The older addListener/removeListener pair is not needed here: every
  // browser this site supports (see package.json's browserslist) has had
  // addEventListener on MediaQueryList for years.
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): ResolvedTheme {
  return window.matchMedia(QUERY).matches ? "dark" : "light";
}

/** The server has no OS to ask. `light` here is only ever the value used for
 * the very first client render, to match what was sent down — see the
 * blocking script below for what a real visitor actually sees on first
 * paint, which does not wait for this. */
function getServerSnapshot(): ResolvedTheme {
  return "light";
}

export function ThemeProvider({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}) {
  const systemTheme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = React.useState<ResolvedTheme | null>(null);
  const resolvedTheme = override ?? systemTheme;
  // Set once, on the first render past the initial one, so the class flip
  // below can tell "the value the anti-flash script already applied" apart
  // from a later change. Not reset when an override is set — the toggle
  // press that sets it is a real, deliberate colour change and should
  // sweep like one.
  const isFirstRender = React.useRef(true);

  // Keeps the class in sync with resolvedTheme for as long as the tab stays
  // open: a live system change while unoverridden, or a press of the
  // button.
  React.useEffect(() => {
    const root = document.documentElement;

    // Every `transition-colors` on the page would otherwise animate at once
    // on a flip, which reads as the page glitching rather than recolouring.
    // Skipped on the first render: that pass is only catching up to what
    // the blocking script already painted before any transition could have
    // run, so there is nothing to suppress.
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
    setOverride((current) => (current === "dark" ? "light" : current === "light" ? "dark" : systemTheme === "dark" ? "light" : "dark"));
  }, [systemTheme]);

  const value = React.useMemo(
    () => ({ resolvedTheme, override, toggle }),
    [resolvedTheme, override, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>
      {/*
        The anti-flash script. `prefers-color-scheme` is unknowable on the
        server, so the initial HTML always renders as light, and without
        this a visitor whose system is dark would see a light flash before
        React's own effect above ever ran.

        Runs before hydration, reads only matchMedia, touches no storage —
        there is nothing stored to read even if it wanted to.
        suppressHydrationWarning is already on <html> in app/layout.tsx for
        exactly this: the class this sets will not match what the server
        rendered, and that mismatch is expected rather than a bug.
      */}
      <script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=window.matchMedia("${QUERY}").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(e){}})()`,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * `resolvedTheme` for anything that needs to know which way the page is
 * currently painted (the canvas backdrops' ink colour, for instance).
 * `toggle` flips between light and dark for the header button — see the
 * note above for why there is no third "system" state to cycle through and
 * no persistence once the tab closes.
 */
export function useTheme() {
  return React.useContext(ThemeContext);
}
