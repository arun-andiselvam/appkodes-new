import { cn } from "@/lib/utils";

/**
 * The small monospaced label above a section heading, with its rule.
 *
 * Twelve sections drew this by hand. One of them drew the rule on both sides,
 * which is what `rule` keeps possible without a second component.
 */
export function Eyebrow({
  rule = "leading",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { rule?: "leading" | "both" }) {
  const line = <span className="w-8 h-px bg-foreground/30" />;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-sm font-mono text-muted-foreground",
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
