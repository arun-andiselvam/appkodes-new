"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  /** Compact variant used inside the collapsed navigation bar. */
  compact?: boolean;
};

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // The server cannot know the visitor's OS preference, so the icon is only
  // meaningful after hydration. Rendering a same-sized placeholder first keeps
  // the nav from shifting.
  const mounted = useHydrated();

  const size = compact ? "h-8 w-8" : "h-10 w-10";
  const base = `${size} inline-flex items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition-all duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`;

  if (!mounted) {
    return <div className={`${size} ${className}`} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${base} ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      ) : (
        <Moon className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      )}
    </button>
  );
}
