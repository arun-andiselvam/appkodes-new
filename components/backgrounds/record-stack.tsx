"use client";

import { useRef, useState } from "react";
import type { IndustryLanding } from "@/content/types";

type Panel = IndustryLanding["record"];
type Row = Panel["rows"][number];

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

/** Lifts small text off a gradient without touching its alpha. See below. */
const SHADOW = { textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" } as const;

/**
 * The hero visual for an industry page: that trade's own work, seen at an angle.
 *
 * !! THIS EXISTS SO THE INDUSTRY HERO IS NOT THE SERVICE HERO !!
 *
 * The page opened with IntegrationDiagram, the CSS 3D architecture stack, with
 * its boxes relabelled. That component is the service page's signature, and
 * reusing it gave two pages meant to be distinct the same opening.
 *
 * The two now argue in different grammar. The service hero draws things
 * connecting to each other, a flow. This draws a quantity of work. Nothing
 * here connects to anything, which is the point.
 *
 * !! THERE ARE FIVE ARRANGEMENTS, AND THAT IS THE WHOLE POINT OF THIS FILE !!
 *
 * Until 23 August 2026 there was one, a three by six field. It was designed
 * for fintech, where a wall is the right argument, and the other four industry
 * pages inherited it because it was already there. The client saw all five and
 * said what was true: the same object cannot be the right picture of a ledger,
 * a stock room, a clinic day, a feed and a gradebook.
 *
 * So `record.layout` picks the shape, and each one says something the others
 * cannot:
 *
 *   field   a quantity with no order to it            fintech
 *   shelf   the gap where stock should be             retail
 *   day     empty space as unbooked time              healthcare
 *   stream  unsorted, and still arriving              media
 *   cohort  ordered on both axes                      edtech
 *
 * The tile never changes. Same two gradients, same square corners, same white
 * text at full strength. Only the arrangement moves, which is why adding a
 * sixth industry is a layout function rather than a new component.
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
 * That is what lets the records arrive one at a time. Every tile carries
 * `.record-in` and a delay, and the layouts below order those delays the way
 * each arrangement should be read: down a field, front bay to back on a shelf,
 * through the morning on a day, nearest first in a stream.
 *
 * !! A TILE SETS --tile-op, NEVER opacity !!
 *
 * The entrance animates to `var(--tile-op, 1)` rather than to 1, because the
 * texture in a field fades toward the back and the far posts in a stream sit
 * under full strength. An inline `opacity` would be overridden by the
 * animation's fill and every one of those would settle at the wrong value,
 * taking the depth with it. Set the variable and let the keyframe land on it.
 *
 * !! A TILE IS KEYED BY ITS POSITION, NEVER BY ITS CONTENT !!
 *
 * Every layout below keys on the cell, slot or index a tile occupies. That is
 * the identity that actually matters here: the tile at cell 7 is the tile at
 * cell 7, whatever ends up in it.
 *
 * These were keyed on `when` and `what` until 24 August 2026, which held only
 * because the first four industries happened to have unique rows. A ledger
 * does. A gradebook does not: two learners handing in the same exercise for
 * the same unit is the ordinary case, and the marketing grid has three tests
 * in one week. React duplicated or dropped tiles and warned about it.
 *
 * !! MEASURE OVERFLOW ON THE CHILDREN, NEVER ON THE FIGURE !!
 *
 * A layout box does not include what a 3D transform pushes past it. An earlier
 * field painted 74 pixels off the right of a 1440 viewport while the figure
 * itself still measured as fitting. The panel gets 460 pixels at 1440 and 1280
 * and 420 at 1024, so every arrangement below is checked against the union of
 * its tiles' painted rects rather than its own box.
 */
export function RecordStack({ record }: { record: Panel }) {
  const layouts = {
    field: Field,
    shelf: Shelf,
    day: Day,
    stream: Stream,
    cohort: Cohort,
  } as const;
  const Layout = layouts[record.layout];

  return (
    /* The fade lives here, outside the perspective. See the opacity note. */
    <figure className="hidden lg:block select-none diagram-in">
      {/*
        The caption is the text alternative. Hidden from sighted readers, who
        have the panel, and from nothing else.
      */}
      <figcaption className="sr-only">{record.caption}</figcaption>
      <Layout record={record} />
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Shared parts                                                        */
/* ------------------------------------------------------------------ */

/**
 * The perspective box and the pointer tilt, shared by all five.
 *
 * `base` is where the arrangement sits at rest and `swing` is how far the
 * pointer moves it. Both are per layout, because a tall column and a wide
 * field cannot take the same rotation before something leaves the panel.
 *
 * !! THE Y SWING IS CAPPED BY THE VIEWPORT, NOT BY TASTE !!
 *
 * A negative rotateY brings the right hand column toward the viewer, and
 * perspective then magnifies it outward. At minus fifteen degrees with a
 * twelve degree swing the far tiles painted seventy four pixels off a 1440
 * screen. Raise either number and re-measure the tiles, not the figure.
 */
function Scene({
  base,
  swing,
  className,
  style,
  children,
}: {
  base: { x: number; y: number };
  swing: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    /* Same conversion IntegrationDiagram uses, so the gesture belongs to the
       site rather than to any one page. */
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * swing.x, y: x * swing.y });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: "1500px" }}
    >
      <div
        className={`motion-reduce:!transition-none ${className ?? ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${base.x + tilt.x}deg) rotateY(${base.y + tilt.y}deg)`,
          transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A record. Solid face, four fields, no radius. */
function Tile({
  row,
  className,
  style,
  delay = 0,
}: {
  row: Row;
  className?: string;
  style?: React.CSSProperties;
  /** Milliseconds before this one arrives. See `.record-in` in globals.css. */
  delay?: number;
}) {
  return (
    <div
      className={`record-in flex flex-col justify-center gap-1 px-3 ${className ?? ""}`}
      style={{
        animationDelay: `${delay}ms`,
        background: row.flagged ? FACES.exception : FACES.settled,
        boxShadow: `0 18px 34px -18px ${
          row.flagged ? "rgb(223 44 22 / 0.4)" : "rgb(20 111 144 / 0.4)"
        }`,
        ...style,
      }}
    >
      <span className="font-mono text-[10px] leading-none text-white" style={SHADOW}>
        {row.when}
      </span>
      <span className="truncate text-[13px] font-medium leading-tight text-white" style={SHADOW}>
        {row.what}
      </span>
      <span className="flex items-baseline justify-between gap-2">
        {/*
          The status is the quiet half and the value the loud one, except on
          the flagged tile where the status is the whole reason it is there.
        */}
        <span className="font-mono text-[9px] uppercase tracking-wider text-white" style={SHADOW}>
          {row.status}
        </span>
        <span className="font-mono text-[11px] leading-none tabular-nums text-white" style={SHADOW}>
          {row.value}
        </span>
      </span>
    </div>
  );
}

/**
 * The rest of the work. Two bars where the words would be.
 *
 * The field around the records is brand blue at a low alpha rather than
 * neutral grey. Most tiles in most arrangements are texture, so a grey field
 * meant the brand appeared on a fifth of the object and the rest was somebody
 * else's wireframe. Tinting it costs no legibility, because nothing in it is
 * text.
 */
function Ghost({
  className,
  style,
  delay = 0,
}: {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`record-in flex flex-col justify-center gap-1.5 border border-brand-blue/20 bg-brand-blue/[0.03] px-3 ${
        className ?? ""
      }`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      <span className="h-[3px] w-2/5 rounded-full bg-brand-blue/35" />
      <span className="h-[3px] w-4/5 rounded-full bg-brand-blue/20" />
    </div>
  );
}

/** "09:40" to minutes. Returns null for anything that is not a clock time. */
function minutes(when: string) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(when.trim());
  return m ? +m[1] * 60 + +m[2] : null;
}

/* ------------------------------------------------------------------ */
/* 01  Field                                        fintech & finance  */
/* ------------------------------------------------------------------ */

/**
 * A quantity with no order to it.
 *
 * The original, and the only page it was designed for. A ledger is a flat
 * uniform pile where nothing connects to anything, which is what a backlog
 * actually looks like.
 *
 * Three columns, not four. Four tiles across 460 pixels left about 107 each,
 * which is under what a date, a description, a status and a sum need without
 * truncating, and truncated words in a hero are worse than fewer tiles.
 *
 * !! THE GRID MUST BE minmax(0, 1fr), NOT 1fr !!
 *
 * A bare 1fr resolves as minmax(auto, 1fr), so a track never shrinks below its
 * content's min-content width. With four fields per tile that floor was about
 * 140 pixels, four tracks summed to 568 inside a 460 box, and the field
 * painted off the right of the screen while every layout box still measured as
 * fitting.
 */
const FIELD_COLS = 3;
const FIELD_ROWS = 6;
/**
 * Which cells carry a real record, in order.
 *
 * Scattered rather than lined up, so no two sit adjacent and the eye crosses
 * the whole field to read them. The fourth entry is cell 7, near the middle,
 * because the fourth row in the data is the flagged one and that is where the
 * eye lands first.
 *
 * Eight of eighteen. Four was a fifth of the field and the panel read as mostly
 * empty. Extra rows beyond these cells are simply not drawn, which is the right
 * failure: this is a hero, not a table.
 */
const FIELD_LIT = [1, 3, 5, 7, 9, 11, 14, 16];

function Field({ record }: { record: Panel }) {
  const byCell = new Map<number, Row>();
  record.rows.forEach((row, i) => {
    const cell = FIELD_LIT[i];
    if (cell !== undefined) byCell.set(cell, row);
  });

  return (
    <Scene
      base={{ x: 13, y: -9 }}
      swing={{ x: 6, y: 5 }}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${FIELD_COLS}, minmax(0, 1fr))`,
        gridAutoRows: "74px",
        gap: 10,
      }}
    >
      {Array.from({ length: FIELD_COLS * FIELD_ROWS }, (_, i) => {
        const row = byCell.get(i);
        /*
          A gentle wave through the field, so it has real depth rather than
          being one plane on a slant. Records come forward on top of it, which
          is what separates them from the texture around them.
        */
        const z = Math.round(Math.sin(i * 0.7) * 18 + (row ? 28 : 0));
        /*
          The field dims toward the back rows. The records stay at full
          strength and the far corner is nearly gone, which is the argument:
          the work does not stop at the edge of what you can see.
        */
        const fade = Math.max(0.16, 0.62 - Math.floor(i / FIELD_COLS) * 0.1);
        const style = { transform: `translateZ(${z}px)` };
        /* Row by row down the field, with a little lag across each row. */
        const delay = Math.floor(i / FIELD_COLS) * 55 + (i % FIELD_COLS) * 22;

        return row ? (
          <Tile key={`cell-${i}`} row={row} style={style} delay={delay} />
        ) : (
          <Ghost
            key={`cell-${i}`}
            style={{ ...style, "--tile-op": fade } as React.CSSProperties}
            delay={delay}
          />
        );
      })}
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* 02  Shelf                                        retail & inventory */
/* ------------------------------------------------------------------ */

/**
 * The gap where stock should be.
 *
 * Stock does not arrive as a field. It sits in bays, and what a stock manager
 * walks past is the hole where something should be. So the empty slot is the
 * only piece of texture in this arrangement, and it is load bearing: three
 * bays of three with one slot short.
 *
 * Each bay carries a board under it, a plane rotated flat toward the viewer.
 * That is what makes the run read as a shelf rather than as three rows, and it
 * is the one arrangement here with a horizontal surface in it.
 *
 * Bays recede rather than sitting on one plane, which is the depth a stock
 * room has and a ledger does not.
 */
const SHELF_SLOTS = 3;

function Shelf({ record }: { record: Panel }) {
  /* Nine slots, eight records. The hole goes at index 5, the end of the middle
     bay, where it sits beside the flagged pallet rather than at an edge. */
  const HOLE = 5;
  const slots: (Row | null)[] = [];
  let taken = 0;
  for (let i = 0; i < SHELF_SLOTS * 3; i++) {
    slots.push(i === HOLE ? null : (record.rows[taken++] ?? null));
  }

  return (
    <Scene base={{ x: 16, y: -11 }} swing={{ x: 5, y: 5 }} className="flex flex-col gap-14">
      {[0, 1, 2].map((bay) => (
        /*
          !! THE DEPTH GOES ON THIS WRAPPER, NOT ON THE PARTS !!

          The board lies flat via rotateX(-90deg), and a translateZ written
          after a rotate travels along the rotated axis rather than the world
          one. Putting the bay's depth on each part meant two of the three
          boards were pushed along what had become the Y axis and left the
          scene entirely. One wrapper carries the z, and the board inside it
          only ever rotates.
        */
        <div
          key={bay}
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            /* Bays step back, so the run has the depth a stock room has and a
               ledger does not. */
            transform: `translateZ(${34 - bay * 40}px)`,
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${SHELF_SLOTS}, minmax(0, 1fr))`,
              gap: 10,
              transformStyle: "preserve-3d",
            }}
          >
            {slots.slice(bay * SHELF_SLOTS, bay * SHELF_SLOTS + SHELF_SLOTS).map((row, i) => {
              /* Front bay first, then back, the way a shelf gets loaded. */
              const delay = bay * 90 + i * 40;
              return row ? (
                <Tile
                  key={`slot-${bay}-${i}`}
                  row={row}
                  style={{ height: 80 }}
                  delay={delay}
                />
              ) : (
                <Ghost
                  key={`slot-${bay}-${i}`}
                  style={{ height: 80, "--tile-op": 0.5 } as React.CSSProperties}
                  delay={delay}
                />
              );
            })}
          </div>
          {/*
            The board the stock stands on. Rotated ninety degrees about its top
            edge so it lies flat and comes toward the viewer, which is what
            reads as the front lip of a shelf and is the only horizontal
            surface in any of the five arrangements.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bg-brand-blue/20"
            style={{
              top: "100%",
              height: 26,
              transformOrigin: "top",
              transform: "rotateX(-90deg)",
            }}
          />
        </div>
      ))}
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* 03  Day                                     healthcare & consulting */
/* ------------------------------------------------------------------ */

/**
 * Empty space as unbooked time.
 *
 * A clinic day is a column, not a field. Time runs down it and the gap between
 * two tiles grows with the real gap between two appointments, so the hour
 * nobody booked is visible as a hole rather than drawn as one.
 *
 * !! THE GAPS ARE PROPORTIONAL WITHIN A CLAMP, NOT TO SCALE !!
 *
 * A full clinic day at true scale is about nine hundred pixels, which is not a
 * hero. Each interval is scaled and then clamped, so a packed morning reads as
 * packed and the ninety minute break is visibly the biggest gap on the column.
 * Strict proportion would be more honest and completely unusable.
 *
 * !! THE MINIMUM STEP HAS TO CLEAR THE TILE, WITH ROOM !!
 *
 * A record needs about 46 pixels for its three lines. The first build set the
 * tile to exactly that and the step to 54, so text sat hard against both edges
 * and every appointment time was clipped by the shadow of the one above it. A
 * tile is 60 now and the step starts at 68.
 *
 * Anything whose `when` is not a clock time falls back to even spacing, so a
 * page that sets this layout with dates does not collapse.
 */
const DAY_TILE = 60;
const DAY_MIN_STEP = 68;
const DAY_MAX_STEP = 135;
/**
 * Pixels per minute.
 *
 * Above 1, so the difference between a half hour turnaround and the hour
 * nobody booked survives the clamp. At a flat pixel a minute the biggest gap
 * on the column was 1.3 times the smallest, which is not an argument. At 1.45
 * it is 1.9 times, and the hole is the first thing the eye finds.
 */
const DAY_SCALE = 1.45;

function Day({ record }: { record: Panel }) {
  const rows = record.rows.slice(0, 6);

  /* Walk the column once, turning each interval into a top offset. */
  const tops: number[] = [];
  let y = 0;
  rows.forEach((row, i) => {
    if (i > 0) {
      const a = minutes(rows[i - 1].when);
      const b = minutes(row.when);
      const step =
        a !== null && b !== null
          ? Math.min(DAY_MAX_STEP, Math.max(DAY_MIN_STEP, (b - a) * DAY_SCALE))
          : DAY_MIN_STEP;
      y += step;
    }
    tops.push(y);
  });

  return (
    <Scene
      base={{ x: 10, y: -10 }}
      swing={{ x: 5, y: 5 }}
      className="relative"
      style={{ height: y + DAY_TILE }}
    >
      {/*
        A faint spine behind the column, so the empty stretches read as time
        passing rather than as tiles that failed to load.
      */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 w-px bg-brand-blue/25"
        style={{ height: y + DAY_TILE, transform: "translateZ(-30px)" }}
      />
      {rows.map((row, i) => (
        <Tile
          key={`at-${i}`}
          row={row}
          className="absolute left-[6%] right-[6%]"
          /* Down the day in order, because that is what the column is. */
          delay={i * 70}
          style={{
            top: tops[i],
            height: DAY_TILE,
            /* The held one comes forward. It is the only appointment on the
               day that still needs somebody. */
            transform: `translateZ(${row.flagged ? 42 : 14}px)`,
          }}
        />
      ))}
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* 04  Stream                                       media & communities */
/* ------------------------------------------------------------------ */

/**
 * Unsorted, and still arriving.
 *
 * A feed has no grid. Posts land at whatever depth and angle they land at,
 * dense at the front and thinning into the dark, and the one held for a
 * moderator sits nearest because at 2am it is the only one that matters.
 *
 * !! HAND PLACED, NOT GENERATED !!
 *
 * A sine wave or a seeded random would be less code and would put two tiles on
 * top of each other about a third of the time.
 *
 * !! NO TWO OF THESE MAY OVERLAP, DEPTH OR NO DEPTH !!
 *
 * The first build allowed it, on the theory that a large gap in z would read
 * as one post in front of another. It does not. The front tile covered the top
 * left corner of the one behind, which is exactly where the time and the
 * description live, so the back post lost the only two fields that identify
 * it. A hero cannot contain a record nobody can read.
 *
 * So these are checked as rectangles. At the 460 pixel panel each tile is 211
 * wide and 70 tall, and no pair overlaps in both axes. Moving any one of them
 * means re-checking its neighbours, and z is not a substitute.
 *
 * left and width are percentages, because the panel is 460 pixels at 1440 and
 * 420 at 1024 and a fixed width would push off the narrow one.
 */
const STREAM_AT = [
  { left: 0, top: 8, z: 30, spin: -3 },
  { left: 52, top: 0, z: -30, spin: 2 },
  { left: 24, top: 100, z: 6, spin: 1 },
  { left: 4, top: 196, z: 84, spin: -2 },
  { left: 54, top: 178, z: -66, spin: 4 },
  { left: 52, top: 260, z: -14, spin: -1 },
  { left: 0, top: 322, z: -44, spin: 3 },
  { left: 48, top: 350, z: 44, spin: -2 },
] as const;

function Stream({ record }: { record: Panel }) {
  return (
    <Scene
      base={{ x: 8, y: -6 }}
      swing={{ x: 6, y: 6 }}
      className="relative"
      style={{ height: 440 }}
    >
      {record.rows.slice(0, STREAM_AT.length).map((row, i) => {
        const at = STREAM_AT[i];
        return (
          <Tile
            key={`post-${i}`}
            row={row}
            className="absolute"
            /* Nearest first, so the feed reads as arriving toward the viewer
               rather than being dealt from the back. */
            delay={Math.round((100 - at.z) * 1.6)}
            style={
              {
                left: `${at.left}%`,
                top: at.top,
                width: "46%",
                height: 70,
                transform: `translateZ(${at.z}px) rotate(${at.spin}deg)`,
                /* The far ones sit back rather than being drawn smaller by
                   hand. The held one never fades, wherever it is. */
                "--tile-op": row.flagged ? 1 : at.z < -40 ? 0.62 : at.z < 0 ? 0.82 : 1,
              } as React.CSSProperties
            }
          />
        );
      })}
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* 05  Cohort                                        edtech & learning */
/* ------------------------------------------------------------------ */

/**
 * Ordered on both axes, which is what a field is not.
 *
 * A gradebook. Learners run across and their submissions run down, so a filled
 * cell means that learner handed that unit in and an empty one means nobody
 * has got to it. The headers are what stop this reading as the fintech field
 * with different words in it: a field has no axes, and this one is nothing but
 * axes.
 *
 * Three columns rather than the four the study used. Four across 420 pixels
 * leaves 98 each, and "Recitation" plus a duration does not fit in 98 without
 * truncating. Three learners still read as a cohort.
 *
 * The names are illustrative in the same way "Pallet 4417" is. They are
 * written to look like nobody's real class.
 */
const COHORT_COLS = 3;
const COHORT_ROWS = 5;
/**
 * Which cells carry a submission, in the order the rows are written.
 *
 * !! THESE ARE NOT SCATTERED, AND THAT IS THE DIFFERENCE FROM `field` !!
 *
 * The first build reused the field's trick of dotting records around so the
 * eye crosses the whole panel. In a matrix that is wrong. A row here is a
 * unit, so cells 0 to 2 are everyone's unit 2 and cells 3 to 5 are everyone's
 * unit 3, and scattering them put one learner's unit 5 above another learner's
 * unit 2. It looked like a gradebook and read as noise.
 *
 * So the rows in content are written unit by unit and land in the cells that
 * match. The gaps are then meaningful: a hole is a learner who has not handed
 * that unit in.
 */
const COHORT_LIT = [0, 3, 5, 6, 7, 8, 10, 14];

function Cohort({ record }: { record: Panel }) {
  const byCell = new Map<number, Row>();
  record.rows.forEach((row, i) => {
    const cell = COHORT_LIT[i];
    if (cell !== undefined) byCell.set(cell, row);
  });

  return (
    <Scene
      base={{ x: 14, y: -9 }}
      swing={{ x: 6, y: 5 }}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${COHORT_COLS}, minmax(0, 1fr))`,
        gap: 10,
      }}
    >
      {(record.axis ?? []).slice(0, COHORT_COLS).map((name) => (
        <div
          key={name}
          className="pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          style={{ transform: "translateZ(48px)" }}
        >
          {name}
        </div>
      ))}
      {Array.from({ length: COHORT_COLS * COHORT_ROWS }, (_, i) => {
        const row = byCell.get(i);
        const style = { height: 74, transform: `translateZ(${row ? 26 : 0}px)` };
        /* Unit by unit down the grid, which is the order it is read in. */
        const delay = Math.floor(i / COHORT_COLS) * 55 + (i % COHORT_COLS) * 22;
        return row ? (
          <Tile key={`cell-${i}`} row={row} style={style} delay={delay} />
        ) : (
          <Ghost
            key={`cell-${i}`}
            style={{ ...style, "--tile-op": 0.34 } as React.CSSProperties}
            delay={delay}
          />
        );
      })}
    </Scene>
  );
}
