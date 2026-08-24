import { cn } from "@/lib/utils";

/**
 * The small monospaced label above a section heading, with its rule.
 *
 * Twelve sections drew this by hand. One of them drew the rule on both sides,
 * which is what `rule` keeps possible without a second component.
 */
export function Eyebrow({
  rule = "leading",
  tone = "page",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  rule?: "leading" | "both";
  /**
   * Which ground this sits on.
   *
   * !! THE DEFAULT COLOURS ARE WRONG ON THE EMPHASIS PANEL !!
   *
   * `page` reads --muted-foreground for the label and --foreground for the
   * rule. Both are picked against the page background and both flip with the
   * theme. The emphasis panel does not flip. It is dark in light mode and dark
   * in dark mode, so those two tokens are correct in neither.
   *
   * `emphasis` reads --emphasis-foreground, which is light in both. Added
   * 24 August 2026, when the delivery map moved onto the panel.
   */
  tone?: "page" | "emphasis";
}) {
  const line = (
    <span
      className={cn(
        "w-8 h-px",
        tone === "emphasis" ? "bg-emphasis-foreground/30" : "bg-foreground/30",
      )}
    />
  );

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-sm font-mono",
        tone === "emphasis" ? "text-emphasis-foreground/50" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {line}
      {children}
      {rule === "both" && line}
    </span>
  );
}
