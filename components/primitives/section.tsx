import { cn } from "@/lib/utils";

/**
 * A page section, with the site's vertical rhythm already set.
 *
 * Two named cadences, because two is what the pages actually use. Naming them
 * is the point: a new section picks `block` or `tight` rather than inventing a
 * third padding pair, which is how a page starts looking like several people
 * laid it out.
 *
 * `ref` is a plain prop. React 19 forwards it without forwardRef, which is what
 * the sections need for their scroll-into-view animations.
 */
const spacings = {
  /** The standard block. */
  block: "py-24 lg:py-32",
  /** Banded rows and anything sitting between rules. */
  tight: "py-20 lg:py-24",
  /** The section sets its own padding through className. */
  none: "",
} as const;

export type SectionSpacing = keyof typeof spacings;

export function Section({
  spacing = "block",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { spacing?: SectionSpacing }) {
  return (
    <section className={cn("relative", spacings[spacing], className)} {...props}>
      {children}
    </section>
  );
}
