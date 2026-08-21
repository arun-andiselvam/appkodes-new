import { DotMatrix } from "@/components/backgrounds/dot-matrix";

/**
 * The backdrop behind a page's opening panel.
 *
 * The dot field and the ruled grid, together, because they were only ever used
 * together. This started as markup inside the home page hero and was pulled
 * out on 21 August 2026 when the service pages needed the same opening. Copied
 * rather than shared, the two would have drifted the first time somebody
 * retuned the home page and forgot the rest.
 *
 * !! EDIT THIS ONCE AND EVERY HERO CHANGES !!
 *
 * That is the point of it. Anything tuned here shows up on the home page and
 * on every service page at the same time, which is what makes it worth a file.
 *
 * DotMatrix is a client component, so a page rendering this backdrop ships a
 * small client bundle and an animation loop. The service pages were otherwise
 * server only. That cost was accepted deliberately in exchange for one hero
 * treatment across the site rather than two that slowly diverge.
 *
 * The grid is proportional rather than fixed, so it divides whatever height
 * the panel happens to be. A full screen home hero and a shorter service hero
 * both get the same number of divisions instead of one of them being cropped.
 */
export function HeroBackdrop() {
  return (
    <>
      {/* Dot matrix background */}
      <div className="absolute inset-0 pointer-events-none">
        <DotMatrix />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
