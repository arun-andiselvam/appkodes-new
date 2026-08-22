"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";

/**
 * The interactive shell of the closing panel, and nothing else.
 *
 * !! THE POINT OF THIS FILE IS THE `children` PROP !!
 *
 * The CTA is on every page on the site. It was one client component, so its
 * whole contents shipped as JavaScript everywhere: the headline, the body
 * copy, both buttons, the badge markup and every comment's worth of structure
 * around them. All of that is static.
 *
 * Only two things here actually need a browser. A fade as the panel enters
 * view, and a gradient that follows the cursor. Both are decorative, and both
 * live on this wrapper now.
 *
 * Children passed from a server component into a client one are rendered on
 * the server and arrive as part of the RSC payload. They are not bundled into
 * the client chunk. So the panel keeps both effects and the content stops
 * being JavaScript.
 *
 * Keep it that way. Anything added in here is added to every page's bundle,
 * and almost nothing belongs in that category.
 */
export function CtaPanel({ children }: { children: React.ReactNode }) {
  const [ref, isVisible] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    /*
      The border was border-foreground at full strength, ten times the weight
      of every other panel on the page, all of which sit at /10. A fifth keeps
      this box reading as the closer without shouting at the sections above it.
    */
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`relative border border-foreground/20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, var(--spotlight), transparent 40%)`,
        }}
      />
      <div className="relative z-10 px-8 lg:px-12 py-12 lg:py-14">{children}</div>

      {/*
        One corner rule, not two. The pair used to sit diagonally opposite each
        other, and the top right of them landed underneath the badge. Two
        devices fighting for the same corner reads as a mistake, and the badge
        is the heavier of the two, so the rule gives way and the bottom left one
        carries the diagonal on its own.

        It lives here rather than in the content, because it positions against
        this panel. Inside the padded inner div it would inset by the padding
        and stop touching the corner it is drawing.
      */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-32 w-32 border-t border-r border-foreground/10"
      />
    </div>
  );
}
