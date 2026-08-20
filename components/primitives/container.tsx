import { cn } from "@/lib/utils";

/**
 * The site's horizontal frame.
 *
 * Every section used to write `max-w-[1400px] mx-auto px-6 lg:px-12` by hand,
 * sixteen copies of one decision. New pages get the gutters right by importing
 * this rather than by remembering the string.
 */
export function Container({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("max-w-[1400px] mx-auto px-6 lg:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}
