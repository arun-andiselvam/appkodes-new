import { cn } from "@/lib/utils";

/**
 * The heading every section opens with.
 *
 * One size, deliberately. The hero is the only thing on the site allowed to be
 * larger, and a section that quietly picks its own scale is how a page stops
 * looking like it was laid out by one person.
 */
export function SectionTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-4xl lg:text-6xl font-display tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
