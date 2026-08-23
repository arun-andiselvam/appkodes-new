"use client";

import { useRef, useState } from "react";
import type { IndustryLanding } from "@/content/types";

type Record = IndustryLanding["record"];

/**
 * The two faces, lifted verbatim from components/backgrounds/integration-diagram.tsx.
 *
 * Not approximated. The service page's slabs use these exact gradients, and
 * two pages a visitor reaches from one menu should be mixing the same paint.
 * Every stop is at or below the base brand colour, which is what keeps white
 * legible on them: measured, blue runs 5.67 to 10.87 and red 4.66 to 9.08.
 */
const FACES = {
  settled: "linear-gradient(150deg, #146f90 0%, #10607d 55%, #0b4257 100%)",
  exception: "linear-gradient(150deg, #df2c16 0%, #c02513 55%, #8e1b0d 100%)",
} as const;

/**
 * Columns in the field.
 *
 * Three, not four. Four tiles across 460 pixels left about 107 each, which is
 * under what a date, a description, a status and a sum need without
 * truncating, and truncated words in a hero are worse than fewer tiles.
 */
const COLS = 3;
/** Rows in the field. Six keeps the count up now that the field is narrower. */
const FIELD_ROWS = 6;
/**
 * Which cells carry a real record, in order.
 *
 * Scattered rather than lined up, so no two sit adjacent and the eye crosses
 * the whole field to read them. The fourth entry is cell 7, near the middle,
 * because the fourth row in the data is the flagged one and that is where the
 * eye lands first.
 *
 * !! THE GRID MUST BE minmax(0, 1fr), NOT 1fr !!
 *
 * A bare 1fr resolves as minmax(auto, 1fr), so a track never shrinks below its
 * content's min-content width. With a date, a description, a status and a sum
 * in each tile that floor was about 140 pixels, four tracks summed to 568
 * inside a 460 box, and the field painted 74 pixels off the right of a 1440
 * viewport while every layout box still measured as fitting.
 *
 * Eight of twenty. Four was a fifth of the field and the panel read as mostly
 * empty. If a page supplies more rows than there are cells here, the extras
 * are simply not drawn, which is the right failure: this is a hero, not a
 * table.
 */
const LIT_CELLS = [1, 3, 5, 7, 9, 11, 14, 16];

/**
 * The hero visual for an industry page: a field of that trade's records, seen
 * at an angle.
 *
 * !! THIS EXISTS SO THE INDUSTRY HERO IS NOT THE SERVICE HERO !!
 *
 * The page opened with IntegrationDiagram, the CSS 3D architecture stack, with
 * its boxes relabelled. That component is the service page's signature, and
 * reusing it gave two pages meant to be distinct the same opening.
 *
 * The two now argue in different grammar. The service hero draws things
 * connecting to each other, a flow. This draws a quantity. Nothing here
 * connects to anything, which is the point: a field of work with no order to
 * it is what a backlog actually looks like.
 *
 * Two earlier versions are worth knowing about, because both failed in ways
 * that are easy to repeat. A tilted stack of three cards read as an object,
 * and an object is what a service page shows. A queue receding into the
 * distance read well but only ever showed one record at a time, so the volume
 * it was arguing for had to be taken on trust.
 *
 * !! THE TWO COLOURS ARE THE ARGUMENT !!
 *
 * Blue is what the model settled and red is what it would not. Three tiles
 * carry a category in brand blue, one carries REVIEW in accent red, and the
 * field around them is brand blue at a low alpha rather than neutral grey.
 *
 * That last part is what makes the panel read as ours. Sixteen of the twenty
 * tiles are texture, so a grey field meant the brand appeared on a fifth of
 * the object and the rest was somebody else's wireframe. Tinting the texture
 * costs no legibility, because nothing in it is text.
 *
 * The colour sits on the status rather than on the description because the
 * status is the part the model decided.
 *
 * !! EVERY WORD ON A FACE IS FULL WHITE, NOT AN ALPHA !!
 *
 * The obvious way to make the small text quieter is white at 70 or 75 per
 * cent, and it measures under AA on both faces. Worse, it cannot be fixed by
 * nudging the alpha: white on the red face's lightest stop is 4.66:1 at full
 * strength, so every reduction lands under 4.5. Measured over #df2c16, white
 * at 90 per cent is 4.01:1 and at 85 is 3.69.
 *
 * So hierarchy here is carried by size, weight and tracking rather than by
 * opacity. Ten pixel mono, thirteen pixel medium, nine pixel uppercase.
 *
 * Both tokens flip for dark grounds on their own. app/brand.css redefines
 * --brand-blue to #8bcce4 under .dark at 9.55:1, so neither needs a variant
 * here.
 *
 * !! SQUARE CORNERS AND HAIRLINES, DELIBERATELY !!
 *
 * A grid of rounded tiles is the most generic shape in software and it reads
 * as a dashboard, which is a product, and these pages are not selling a
 * product. Right angles and a single hairline are what stop it. Do not round
 * these.
 *
 * !! opacity ON A TILE IS SAFE, ON A 3D PARENT IT IS NOT !!
 *
 * Opacity below 1 forces transform-style: flat on whatever carries it, which
 * cost the service diagram its slab thickness once. See
 * components/backgrounds/integration-diagram.tsx. It is safe on a tile because
 * a tile is a leaf: its own transform still places it in the parent's 3D
 * space, and it has no 3D children whose composition flattening could break.
 * The fade on the figure sits outside the perspective entirely, as it must.
 *
 * !! NO LABEL AND NO FOOTNOTE !!
 *
 * A mono bar sat above the field reading "TRANSACTIONS" on the left and
 * "Categorised on arrival. One held for a person." on the right. Removed 23
 * August 2026 at the client's request: the field says both things without
 * being told to, and a caption over a picture that already speaks is the kind
 * of chrome that makes a hero look explained rather than confident.
 *
 * Nothing was lost to search or to a screen reader. `caption` below is still
 * in the DOM and still says the sentence the footnote said.
 *
 * !! IT GENERALISES, AND THAT IS THE POINT !!
 *
 * Nothing below knows what industry it is drawing. Deliveries to book in,
 * consultations to write up, work to mark, creatives to check and posts to
 * moderate are all a field of work with one exception in it. See the `record`
 * type in content/types.ts for why the field names are not financial.
 */
export function RecordStack({ record }: { record: Record }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    /*
      Same conversion IntegrationDiagram uses, so the gesture belongs to the
      site rather than to this page.

      !! THE Y SWING IS CAPPED BY THE VIEWPORT, NOT BY TASTE !!

      A negative rotateY brings the right hand column toward the viewer, and
      perspective then magnifies it outward. At minus fifteen degrees with a
      twelve degree swing the far tiles painted to 1514 on a 1440 viewport,
      seventy four pixels off the screen, while the figure's own layout box
      still measured as fitting. Layout boxes do not include what a 3D
      transform pushes past them, so this has to be measured on the union of
      the tiles rather than on the figure.
    */
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * 6, y: x * 5 });
  };

  /* Real records go into the lit cells, in order, flagged one last. */
  const byCell = new Map<number, Record["rows"][number]>();
  record.rows.forEach((row, i) => {
    const cell = LIT_CELLS[i];
    if (cell !== undefined) byCell.set(cell, row);
  });

  return (
    /* The fade lives here, outside the perspective. See the opacity note. */
    <figure className="hidden lg:block select-none diagram-in">
      {/*
        The caption is the text alternative. Hidden from sighted readers, who
        have the field, and from nothing else.
      */}
      <figcaption className="sr-only">{record.caption}</figcaption>

      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: "1500px" }}
      >
        <div
          className="grid motion-reduce:!transition-none"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridAutoRows: "74px",
            gap: 10,
            transformStyle: "preserve-3d",
            transform: `rotateX(${13 + tilt.x}deg) rotateY(${-9 + tilt.y}deg)`,
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {Array.from({ length: COLS * FIELD_ROWS }, (_, i) => {
            const row = byCell.get(i);
            /*
              A gentle wave through the field, so it has real depth rather than
              being one plane on a slant. Lit tiles come forward on top of it,
              which is what separates them from the texture around them.
            */
            const z = Math.round(Math.sin(i * 0.7) * 18 + (row ? 28 : 0));
            /*
              The field dims toward the back rows. The records stay at full
              strength and the far corner is nearly gone, which is the
              argument: the work does not stop at the edge of what you can see.
            */
            const depth = Math.floor(i / COLS);
            const fade = row ? 1 : Math.max(0.16, 0.62 - depth * 0.1);

            return (
              <div
                key={row ? `${row.when}-${row.what}` : `tile-${i}`}
                aria-hidden={row ? undefined : true}
                /*
                  No radius. See the note at the top of this file: rounded
                  tiles are what make a field like this read as a dashboard.
                */
                className={
                  row
                    ? "flex flex-col justify-center gap-1 px-3 shadow-[0_18px_34px_-18px_rgb(0_0_0/0.5)]"
                    : "flex flex-col justify-center gap-1.5 border border-brand-blue/20 bg-brand-blue/[0.03] px-3"
                }
                style={{
                  transform: `translateZ(${z}px)`,
                  opacity: fade,
                  /*
                    Solid face on a record, nothing on the texture. The service
                    page's slabs are solid too, and a field where the records
                    are outlines and the slabs next door are filled reads as
                    two design systems.
                  */
                  ...(row
                    ? {
                        background: row.flagged ? FACES.exception : FACES.settled,
                        boxShadow: `0 18px 34px -18px ${
                          row.flagged ? "rgb(223 44 22 / 0.4)" : "rgb(20 111 144 / 0.4)"
                        }`,
                      }
                    : null),
                }}
              >
                {row ? (
                  <>
                    <span
                      className="font-mono text-[10px] leading-none text-white"
                      style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                    >
                      {row.when}
                    </span>
                    <span
                      className="truncate text-[13px] font-medium leading-tight text-white"
                      style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                    >
                      {row.what}
                    </span>
                    <span className="flex items-baseline justify-between gap-2">
                      {/*
                        The status is the quiet half and the value the loud one,
                        except on the flagged tile where the status is the whole
                        reason the tile is there.
                      */}
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider text-white"
                        style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                      >
                        {row.status}
                      </span>
                      <span
                        className="font-mono text-[11px] leading-none tabular-nums text-white"
                        style={{ textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" }}
                      >
                        {row.value}
                      </span>
                    </span>
                  </>
                ) : (
                  /* Texture. Two bars where the words would be. */
                  <>
                    <span className="h-[3px] w-2/5 rounded-full bg-brand-blue/35" />
                    <span className="h-[3px] w-4/5 rounded-full bg-brand-blue/20" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
