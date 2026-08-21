"use client";

import { useRef, useState } from "react";
// Was NonNullable<ServiceLanding["diagram"]>, which tied this component to one
// page type. The industry pages draw the same diagram, so the shape is its own
// type now. See ArchitectureDiagram in content/types.ts.
import type { ArchitectureDiagram } from "@/content/types";

type Diagram = ArchitectureDiagram;

/**
 * The architecture, drawn in CSS 3D rather than on a canvas.
 *
 * !! THE LABELS HAVE TO STAY REAL TEXT !!
 *
 * That is the whole reason this is transformed DOM and not a canvas. Every
 * node here carries a label, and a canvas would paint those as pixels: gone
 * from search, from screen readers, from translation, and from the answer
 * engines this page's schema was written for. Five labels buried in a bitmap
 * would work directly against the GEO pass. Transformed elements keep the text
 * selectable and crawlable and still tilt.
 *
 * The depth is deliberately simple. Connectors sit on the base plane and every
 * card is lifted off it by the same translateZ, so the cards parallax against
 * their own wiring as the assembly turns. Giving each card its own depth was
 * tried first and pulled the lines away from the boxes they join.
 *
 * Interaction is two CSS custom properties written on pointer move. No
 * animation loop and no state churn per frame, which matters because the hero
 * already runs the DotMatrix canvas on requestAnimationFrame beside this.
 */
export function IntegrationDiagram({ diagram }: { diagram: Diagram }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // -1 to 1 across the box, so the tilt follows the pointer rather than
    // the page. Capped low: past about ten degrees the text starts to smear.
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 14, ry: x * 18 });
  };

  return (
    <figure
      className="hidden lg:block select-none"
      style={{ perspective: "1400px" }}
    >
      {/*
        The caption is the text alternative. It is not visually hidden from
        crawlers, only from sighted readers, who have the diagram itself.
      */}
      <figcaption className="sr-only">{diagram.caption}</figcaption>

      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        className="relative motion-reduce:!transform-none"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${8 + tilt.rx}deg) rotateY(${tilt.ry}deg) rotateZ(-1deg)`,
          transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {diagram.rows.map((row, r) => (
          <div key={r} style={{ transformStyle: "preserve-3d" }}>
            {/*
              The wiring for this row, on the base plane. Drawn before the
              cards so the cards sit over it once they are lifted.
            */}
            {r > 0 && <Connectors single={diagram.rows[r - 1].length === 1} />}

            <div
              className={`relative grid gap-5 ${
                row.length === 1 ? "grid-cols-1 px-[20%]" : "grid-cols-2"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {row.map((node) => (
                <div
                  key={node.label}
                  /*
                   * White boxes at 75 percent, so the hero's dot field reads
                   * faintly through them. Literal white rather than
                   * bg-background, which would turn near-black in dark mode
                   * and stop being white at all.
                   *
                   * The slight blur stops the dots behind a box from competing
                   * with the label sitting on top of them.
                   *
                   * The border is dotted black on every box. The blue and red
                   * that separate what the client already owns from what the
                   * integration adds now live in the label alone.
                   */
                  className="rounded-xl border-2 border-dotted border-black bg-white/75 px-4 py-5 text-center backdrop-blur-[2px]"
                  style={{
                    // Every card off the wiring by the same distance, so the
                    // lines stay attached while the whole thing turns.
                    transform: "translateZ(34px)",
                    boxShadow: "0 22px 48px -22px rgb(0 0 0 / 0.35)",
                  }}
                >
                  <span
                    className={`block text-sm font-medium leading-tight ${
                      node.tone === "brand" ? "text-brand-blue" : "text-brand-red"
                    }`}
                  >
                    {node.label}
                  </span>
                  {node.sub && (
                    <span className="mt-1.5 block font-mono text-[11px] leading-tight text-neutral-500">
                      {node.sub}
                    </span>
                  )}
                </div>
              ))}

              {/* The across-the-pair link, between two cards on one row. */}
              {row.length === 2 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 h-px w-4 -translate-x-1/2 bg-foreground/25"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/**
 * The bracket between one row and the row above it.
 *
 * `single` is the row-one case, where one node fans out to a pair. Otherwise
 * the feed comes down from the right hand node of the pair above, which is
 * what the architecture actually does: the integration layer is what reaches
 * the model and the database, not the backend.
 */
function Connectors({ single }: { single: boolean }) {
  return (
    <div aria-hidden className="relative h-12">
      {/* Drop out of the row above. */}
      <span
        className={`absolute top-0 h-5 w-px bg-foreground/25 ${
          single ? "left-1/2" : "left-3/4"
        }`}
      />
      {/* The horizontal bus over the pair below. */}
      <span className="absolute top-5 left-1/4 right-1/4 h-px bg-foreground/25" />
      {/* Drops into each card of the pair below. */}
      <span className="absolute top-5 left-1/4 h-7 w-px bg-foreground/25" />
      <span className="absolute top-5 right-1/4 h-7 w-px bg-foreground/25" />
    </div>
  );
}
