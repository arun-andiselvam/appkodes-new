"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  /** Compact variant used inside the collapsed navigation bar. */
  compact?: boolean;
};

/**
 * Three settings, not two: follow the system, force light, force dark.
 *
 * !! SYSTEM WAS UNREACHABLE ONCE A VISITOR HAD CLICKED ONCE !!
 *
 * app/layout.tsx has always set `defaultTheme="system"` with `enableSystem`,
 * so a first time visitor already got their OS preference. This button only
 * ever wrote "light" or "dark", and next-themes persists that to localStorage,
 * so the first click took them off system permanently. Somebody whose machine
 * switches at sunset lost that for good, and no control on the page could give
 * it back.
 *
 * !! THE ICON SHOWS THE CURRENT SETTING, NOT THE DESTINATION !!
 *
 * That is a reversal of what this button used to do, and it is forced. The two
 * state version showed where a click would take you: a sun while dark, a moon
 * while light. With a third state that reads as a lie, because the monitor
 * icon would be showing while the setting was something else. So the icon now
 * answers "what am I on", which is the question a visitor on system actually
 * has, and the label answers "what happens if I press this".
 */
const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

const DESCRIBE = {
  system: "follow your system",
  light: "light",
  dark: "dark",
} as const;

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  // The server cannot know the visitor's OS preference, so the icon is only
  // meaningful after hydration. Rendering a same-sized placeholder first keeps
  // the nav from shifting.
  const mounted = useHydrated();

  const size = compact ? "h-8 w-8" : "h-10 w-10";
  const base = `${size} inline-flex items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition-all duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none`;

  if (!mounted) {
    return <div className={`${size} ${className}`} aria-hidden="true" />;
  }

  /* next-themes leaves `theme` undefined until it has read storage. */
  const current = (theme ?? "system") as keyof typeof ICONS;
  const isDark = resolvedTheme === "dark";

  /*
    !! THE ORDER TURNS ON THE SYSTEM PREFERENCE, NOT ON WHAT IS ON SCREEN !!

    A fixed system, light, dark rotation reads tidier and has a hole in it. The
    stored default is system, so the first press a visitor makes leaves system
    for whichever end the order starts at. Half of them are already resolved to
    exactly that, and nothing on the page changes. A control that looks broken
    on its first press is worse than a slightly cleverer rule.

    So the cycle is system, then the opposite of what the machine prefers, then
    the machine's own setting held explicitly, then back to system. Every step
    but the last changes the colours, and the last swaps the icon to the
    monitor so the press is still acknowledged.

    !! DERIVE THIS FROM systemTheme, NOT FROM resolvedTheme !!

    The first version keyed the whole cycle off resolvedTheme, which equals the
    system preference only while the setting is system. Once the setting was
    explicit, resolvedTheme just echoed it, so every explicit dark handed back
    to system no matter which direction it had been reached from. On a machine
    preferring light that collapsed the control to two states, system and dark,
    and light could not be pinned at all. systemTheme is the same value in both
    cases, which is what makes the three settings all reachable.
  */
  const machine = systemTheme === "dark" ? "dark" : "light";
  const opposite = machine === "dark" ? "light" : "dark";
  const next: keyof typeof ICONS =
    current === "system" ? opposite : current === opposite ? machine : "system";

  const Icon = ICONS[current];
  /* The resolved colour is worth naming only while the setting is system,
     because that is the one case where the setting does not state it. */
  const state =
    current === "system" ? `follows your system, currently ${isDark ? "dark" : "light"}` : current;
  const label = `Theme: ${state}. Switch to ${DESCRIBE[next]}.`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={`${base} ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
    </button>
  );
}
