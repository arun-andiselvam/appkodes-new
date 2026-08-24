"use client";

import { useHydrated } from "@/hooks/use-hydrated";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  /** Compact variant used inside the collapsed navigation bar. */
  compact?: boolean;
};

/**
 * Two states, not three.
 *
 * !! NO MONITOR ICON, AND NO "SYSTEM" TO CYCLE BACK TO !!
 *
 * There used to be a third setting here, matching the OS preference
 * explicitly rather than just defaulting to it. The client asked for that
 * removed on 25 August 2026: the page already opens on the system setting
 * by itself (see components/theme-provider.tsx), so a button offering
 * "follow my system" as a choice was offering to do what it does anyway.
 * What is left is a plain light/dark switch for anyone who wants something
 * else for this visit.
 *
 * !! THE ICON SHOWS THE CURRENT COLOUR, NOT THE DESTINATION !!
 *
 * A sun while dark and a moon while light would show where a press leads
 * rather than what is on screen, and the label already says that ("Switch
 * to ..."). The icon answers "what am I looking at".
 */
export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme();
  // The server cannot know the visitor's OS preference, so the icon is only
  // meaningful after hydration. Rendering a same-sized placeholder first keeps
  // the nav from shifting.
  const mounted = useHydrated();

  const size = compact ? "h-8 w-8" : "h-10 w-10";
  const base = `${size} inline-flex items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition-all duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none`;

  if (!mounted) {
    return <div className={`${size} ${className}`} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = `Theme: ${isDark ? "dark" : "light"}. Switch to ${isDark ? "light" : "dark"}.`;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${base} ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
    </button>
  );
}
