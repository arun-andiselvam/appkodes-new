"use client";

import { useRef, useState } from "react";
import type { ArchitectureDiagram } from "@/content/types";

type Diagram = ArchitectureDiagram;

/**
 * The architecture as isometric glass slabs, drawn in CSS 3D.
 *
 * !! THE LABELS HAVE TO STAY REAL TEXT !!
 *
 * That is the whole reason this is transformed DOM and not a canvas or a
 * rendered image. Every node carries a label, and a bitmap would paint those
 * as pixels: gone from search, from screen readers, from translation, and from
 * the answer engines this page's schema was written for. Five labels buried in
 * an image would work directly against the GEO pass.
 *
 * It was flat boxes with dotted borders until 22 August 2026, which read as a
 * wireframe rather than as a finished graphic. This is the same architecture
 * on an isometric plane, following a reference the client supplied.
 *
 * How the projection works. The scene is rotated `rotateX(54deg)
 * rotateZ(-40deg)`, which CSS applies right to left, so each slab is spun in
 * its own plane first and the whole assembly is then laid back. Slabs are
 * positioned in ordinary flat coordinates and the rotation does the rest,
 * which means the layout below is readable as a grid rather than as a pile of
 * pre-computed isometric offsets.
 *
 * Thickness is a stack of plates at descending translateZ under the top face.
 * Once the plane is laid back, the gap between them projects as a visible
 * edge, which is what makes a slab look like an object rather than a rectangle.
 *
 * !! THE SLAB COLOURS DO NOT FOLLOW THE THEME !!
 *
 * They are fixed blue and red rather than var(--brand-blue), on the same
 * principle app/brand.css states for the logo mark: artwork keeps its own
 * colours in both themes. The dark theme's brand red is a light salmon tuned
 * for text on a dark ground, and a slab filled with it would not hold white
 * type. These two do: white on #146f90 is 5.67:1 and on #df2c16 is 4.66:1,
 * both measured in brand.css.
 *
 * Interaction is two numbers written on pointer move, feeding one transform.
 * No animation loop and no state churn per frame, which matters because the
 * hero already runs the DotMatrix canvas beside this.
 */

/** Flat plane geometry, before any rotation. Everything else derives from it. */
const SLAB = { w: 208, h: 108, colGap: 32, rowGap: 44 };
const COL = SLAB.w + SLAB.colGap;
const ROW = SLAB.h + SLAB.rowGap;

/**
 * Blue is what the client already owns, red is what the integration adds.
 * That split is the story of the diagram, so the tones are not decoration.
 */
/*
 * !! NO STOP MAY BE LIGHTER THAN THE BASE BRAND COLOUR !!
 *
 * The first version ran these gradients up to #3b93b3 and #ef6a56 at the light
 * end, on the reasoning that the reference artwork has a sheen across it. The
 * labels then sat at 3.49:1 and 3.06:1 over that end of the slab, both under
 * AA, and the text was hard to read exactly where the slab was brightest.
 *
 * The contrast figures quoted in app/brand.css, 5.67:1 and 4.66:1 for white,
 * are for #146f90 and #df2c16 themselves. Any stop lighter than those throws
 * the guarantee away. So the lightest stop of each gradient is now the brand
 * colour, and every other stop is darker, which makes those numbers the floor
 * rather than a midpoint. Measured stops:
 *
 *   blue  #146f90 5.67  #10607d 7.02  #0b4257 10.87
 *   red   #df2c16 4.66  #c02513 5.97  #8e1b0d  9.08
 */
const TONES = {
  brand: {
    face: "linear-gradient(150deg, #146f90 0%, #10607d 55%, #0b4257 100%)",
    edge: "#0a3d51",
    glow: "rgb(20 111 144 / 0.34)",
  },
  accent: {
    face: "linear-gradient(150deg, #df2c16 0%, #c02513 55%, #8e1b0d 100%)",
    edge: "#7c170b",
    glow: "rgb(223 44 22 / 0.30)",
  },
} as const;

/** How far the top face floats above the base plate, in flat-plane pixels. */
const LIFT = 26;

export function IntegrationDiagram({ diagram }: { diagram: Diagram }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, z: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // -1 to 1 across the box. Capped low: past a few degrees off the
    // isometric the type starts to smear and the whole thing reads as broken
    // perspective rather than as a considered angle.
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * 6, z: -x * 7 });
  };

  /*
   * Rows carry one node or two. A single node sits in the right hand column,
   * which is what puts the interface above the layer it talks to and gives
   * the assembly the cascade the reference has.
   */
  const placed = diagram.rows.flatMap((row, r) =>
    row.map((node, i) => ({
      node,
      x: (row.length === 1 ? 1 : i) * COL,
      y: r * ROW,
      row: r,
      col: row.length === 1 ? 1 : i,
    })),
  );

  const planeW = COL + SLAB.w;
  const planeH = (diagram.rows.length - 1) * ROW + SLAB.h;

  return (
    <figure className="hidden lg:block select-none">
      {/*
        The caption is the text alternative. Hidden from sighted readers, who
        have the diagram, and from nothing else.
      */}
      <figcaption className="sr-only">{diagram.caption}</figcaption>

      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, z: 0 })}
        className="relative h-[460px] w-full"
        style={{ perspective: "1600px" }}
      >
        <div
          className="absolute left-1/2 top-1/2 motion-reduce:!transition-none"
          style={{
            width: planeW,
            height: planeH,
            transformStyle: "preserve-3d",
            /*
             * translate centres the plane on its own middle before the scene
             * rotation, so the assembly turns about its centre rather than
             * swinging away from its top left corner.
             *
             * On the scale. The flat plane is 448 by 412. Rotated by -40 in
             * its own plane it projects to about 608 by 604, and laying it
             * back by 54 degrees compresses the height by cos 54, leaving
             * roughly 608 by 355.
             *
             * At 0.92 that is 559 by 327. The hero's column is 520 at lg, so
             * the assembly runs about 20 pixels past each side of it. That is
             * deliberate and it is safe: the grid gap is 40, so the overflow
             * sits in the gutter and reaches no text. At xl the column is 580
             * and it fits inside entirely.
             *
             * Raised from 0.68 through 0.84 on 22 August 2026. Scaling rather
             * than growing SLAB is deliberate: the label sizes are fixed
             * pixels, so bigger slabs would have shrunk the type against them,
             * where scaling takes the text up with everything else.
             */
            transform: `translate(-50%, -50%) scale(0.92) rotateX(${54 + tilt.x}deg) rotateZ(${-40 + tilt.z}deg)`,
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Connectors rows={diagram.rows} />

          {placed.map(({ node, x, y }) => {
            const tone = TONES[node.tone];
            return (
              <div
                key={node.label}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  width: SLAB.w,
                  height: SLAB.h,
                  transformStyle: "preserve-3d",
                }}
              >
                {/*
                  The glow on the ground under the slab. Blurred and sitting
                  below everything, so a slab reads as hovering rather than as
                  a sticker on the plane.
                */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[18px]"
                  style={{
                    background: tone.glow,
                    filter: "blur(18px)",
                    transform: "translateZ(-2px) scale(1.04)",
                  }}
                />

                {/*
                  The body. Seven plates climbing towards the face, which
                  projects as a solid edge once the plane is laid back. One
                  plate at the bottom and one at the top leaves a hollow slab
                  with a visible gap in the middle.
                */}
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="absolute inset-0 rounded-[16px]"
                    style={{
                      background: tone.edge,
                      transform: `translateZ(${(i * LIFT) / 7}px)`,
                    }}
                  />
                ))}

                {/* The face, and the only part carrying text. */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[16px] px-4 text-center"
                  style={{
                    transform: `translateZ(${LIFT}px)`,
                    background: tone.face,
                    boxShadow:
                      "inset 0 1px 0 rgb(255 255 255 / 0.45), inset 0 0 0 1px rgb(255 255 255 / 0.18)",
                  }}
                >
                  {/*
                    Bold and shadowed, because isometric type is working
                    against itself. The shear thins every stroke that runs
                    with the projection, so a weight that reads fine flat
                    reads faint here, and the drop shadow puts an edge under
                    the letterforms where the slab beneath them is at its
                    lightest.
                  */}
                  <span
                    className="block text-[16px] font-bold leading-tight text-white"
                    style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                  >
                    {node.label}
                  </span>
                  {node.sub && (
                    // Was white/75, which measured under AA over the lightest
                    // stop even after the gradient was fixed.
                    <span
                      className="mt-1 block font-mono text-[12px] font-medium leading-tight text-white/90"
                      style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                    >
                      {node.sub}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}

/**
 * The wiring, on the plane the slabs float above.
 *
 * Drawn as bars in the same flat coordinates as the slabs, at a low
 * translateZ, so they pass underneath and the slabs read as sitting on top of
 * their own connections.
 *
 * The shape is fixed because the component draws one architecture: the single
 * node on row one feeds the pair below, the right hand node of that pair is
 * what reaches the row under it, and the pair is joined across. That is what
 * the architecture actually does, since the integration layer is what talks to
 * the model and the database rather than the backend.
 */
function Connectors({ rows }: { rows: Diagram["rows"] }) {
  const midCol0 = SLAB.w / 2;
  const midCol1 = COL + SLAB.w / 2;
  const T = 5;

  const bars: { left: number; top: number; width: number; height: number }[] = [];

  for (let r = 1; r < rows.length; r += 1) {
    const above = (r - 1) * ROW + SLAB.h;
    const below = r * ROW;
    const mid = above + (below - above) / 2;

    // Down out of the feeding node, which is always the right hand column.
    bars.push({ left: midCol1 - T / 2, top: above, width: T, height: mid - above + T });

    if (rows[r].length === 2) {
      // Across, then down into each of the pair.
      bars.push({ left: midCol0, top: mid, width: midCol1 - midCol0, height: T });
      bars.push({ left: midCol0 - T / 2, top: mid, width: T, height: below - mid });
      bars.push({ left: midCol1 - T / 2, top: mid, width: T, height: below - mid });
    } else {
      bars.push({ left: midCol1 - T / 2, top: mid, width: T, height: below - mid });
    }
  }

  // The across-the-pair link on the middle row, backend to integration layer.
  const pairRow = rows.findIndex((row) => row.length === 2);
  if (pairRow > -1) {
    const y = pairRow * ROW + SLAB.h / 2;
    bars.push({ left: SLAB.w, top: y - T / 2, width: SLAB.colGap, height: T });
  }

  return (
    <div aria-hidden className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {bars.map((bar, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: bar.left,
            top: bar.top,
            width: bar.width,
            height: bar.height,
            transform: "translateZ(6px)",
            background: "rgb(255 255 255 / 0.9)",
            boxShadow:
              "0 0 12px rgb(20 111 144 / 0.55), 0 0 3px rgb(255 255 255 / 0.9)",
          }}
        />
      ))}
    </div>
  );
}
