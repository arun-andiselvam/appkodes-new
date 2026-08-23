"use client";

import { useId, useMemo, useState } from "react";

import { destinations, hub, type Destination } from "@/content/delivery-map";
import { landmasses, type Ring } from "@/content/world-outline";

/**
 * The delivery map: one hub, an arc to every country with a client behind it.
 *
 * !! THE LAND IS DOTS, WHICH IS A CHOICE AND NOT A COMPROMISE !!
 *
 * A vector coastline would need a real outline file, and a real outline is
 * about a megabyte of coordinates for a decoration nine hundred pixels wide.
 * A dot field is a few kilobytes of polygons rasterised at render, it reads
 * as a map at a glance, and it is already this site's texture: the same dot
 * grid sits behind every hero in components/backgrounds/hero-backdrop.tsx and
 * behind the record panels. A photoreal map would be the one foreign object
 * on the page.
 *
 * !! ALL OF THE LAND IS ONE PATH ELEMENT !!
 *
 * At two and a half degrees the grid is about eight thousand cells and
 * roughly a third are land, so drawing a circle each is a couple of thousand
 * nodes for a background. Instead every dot is a zero length segment,
 * "M x y L x y", in a single path with a round line cap, which paints a dot
 * per segment. One node, same picture.
 *
 * !! THE ARCS ARE QUADRATIC, BENT AWAY FROM THE HUB !!
 *
 * A straight line between two points on an equirectangular map is not what a
 * route looks like and reads as a diagram. The control point is pushed
 * perpendicular to the chord by a fraction of its length, so the further a
 * destination the more the arc bows, which is roughly what a great circle
 * does on this projection and is what the reference image shows.
 *
 * !! NOTHING MOVES UNTIL A POINTER ASKS IT TO !!
 *
 * There is no idle animation loop. Arcs sit still and dim, and hovering one
 * runs a pulse along it. An ambient animation here would be a permanent
 * repaint behind static text, which is the kind of thing that costs a page
 * its scroll performance for decoration nobody asked to move.
 */

/* The window drawn. Antarctica is out and the far north is trimmed, which is
   what makes the map wider than tall rather than a tall rectangle of ice. */
const LAT_TOP = 78;
const LAT_BOTTOM = -56;
const VIEW_W = 1000;
const VIEW_H = Math.round((VIEW_W * (LAT_TOP - LAT_BOTTOM)) / 360);

/**
 * Degrees per dot.
 *
 * !! DENSITY IS WHAT MAKES THIS READ AS LAND RATHER THAN CONFETTI !!
 *
 * At two degrees the dot pitch was about five and a half pixels with a two
 * pixel dot, so two thirds of every continent was gap and the map read as
 * dust. At one and a half the pitch is four and the dots nearly touch, which
 * is the point where the eye joins them into a shape.
 *
 * This is not free. It is roughly twenty thousand cells tested against forty
 * rings on mount. Measured in the browser it runs in well under a frame, and
 * it happens once because the outline never changes, but do not take it much
 * lower without measuring again.
 */
const STEP = 1.5;

const project = (lng: number, lat: number) => ({
  x: ((lng + 180) / 360) * VIEW_W,
  y: ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * VIEW_H,
});

/** Ray casting, the standard even odd test. */
function inRing(lng: number, lat: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * A bounding box per ring, computed once.
 *
 * !! WITHOUT THIS THE REAL OUTLINE IS TOO SLOW TO USE !!
 *
 * The hand drawn outline was forty rings of a dozen points. Natural Earth is a
 * hundred and four rings of four thousand nine hundred, and the grid is twenty
 * thousand cells, so testing every cell against every vertex is around a
 * hundred million operations on mount. Rejecting on the box first throws away
 * almost all of it: a cell in the Pacific fails a hundred and four number
 * comparisons instead of walking a hundred and four coastlines, and a cell in
 * France only ever walks Eurasia.
 */
const BOXES = landmasses.map((ring) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { ring, minX, maxX, minY, maxY };
});

export function DeliveryMap() {
  const uid = useId();
  const [active, setActive] = useState<Destination | null>(null);

  /* Rasterise once. The outline never changes, so this is a startup cost of a
     few milliseconds and then nothing. */
  const landPath = useMemo(() => {
    const parts: string[] = [];
    for (let lat = LAT_TOP; lat >= LAT_BOTTOM; lat -= STEP) {
      for (let lng = -180; lng <= 180; lng += STEP) {
        let land = false;
        for (const b of BOXES) {
          if (lng < b.minX || lng > b.maxX || lat < b.minY || lat > b.maxY) continue;
          if (inRing(lng, lat, b.ring)) {
            land = true;
            break;
          }
        }
        if (!land) continue;
        const { x, y } = project(lng, lat);
        parts.push(`M${x.toFixed(1)} ${y.toFixed(1)}l0 0`);
      }
    }
    return parts.join("");
  }, []);

  const hubPt = project(hub.lng, hub.lat);

  const arcs = useMemo(
    () =>
      destinations.map((d) => {
        const p = project(d.lng, d.lat);
        const dx = p.x - hubPt.x;
        const dy = p.y - hubPt.y;
        const len = Math.hypot(dx, dy);
        /* Perpendicular to the chord, scaled by its length, so a short hop
           barely bends and a transatlantic one arcs hard. The sign is fixed
           rather than chosen per arc: flipping it per destination made the
           bundle leaving the hub cross itself. */
        const bow = len * 0.22;
        const cx = hubPt.x + dx / 2 + (dy / len) * bow;
        const cy = hubPt.y + dy / 2 - (dx / len) * bow;
        return {
          d,
          p,
          path: `M${hubPt.x.toFixed(1)} ${hubPt.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
          len,
        };
      }),
    [hubPt.x, hubPt.y],
  );

  const activeArc = active ? arcs.find((a) => a.d.code === active.code) : null;

  return (
    <figure className="not-prose">
      {/*
        The text alternative. A map is a picture of a list, and the list is the
        part that has to survive for anyone who cannot see it.
      */}
      <figcaption className="sr-only">
        {`Clients in ${destinations.length} countries, each connected to the team in ${hub.name}: ${destinations
          .map((d) => d.name)
          .join(", ")}.`}
      </figcaption>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="presentation"
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          {/* The glow. One filter, reused, rather than a shadow per node. */}
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Land. See the note above: one path, a dot per segment. */}
        {/*
          Brand blue at 45 per cent, not the foreground token.

          The land was foreground/25 and read as almost nothing on either
          ground: a quarter of near white on a dark page, a quarter of near
          black on a light one. Both were dust. Blue also puts the map in the
          same family as the arcs crossing it, which is the relationship the
          reference image has, a slate landmass under bright routes, and
          brand.css already flips the token per theme so one value covers both.
        */}
        <path
          d={landPath}
          stroke="currentColor"
          className="text-brand-blue/55"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />

        {/*
          One arc, and only while a dot is being pointed at.

          !! FORTY EIGHT ARCS AT ONCE WAS THE PROBLEM, NOT THE POINT !!

          Every arc leaves the same hub, so drawn together they merge into a
          fan and the map stops being readable: the eye cannot follow any
          single route, and the landmass the arcs are meant to sit on top of
          disappears under them. Drawing the hovered one alone means the
          resting state is a map of where the work is and the pointer asks
          the question "and where does that one go".

          Nothing else is in the DOM. There is no dimmed set underneath, so
          this is also forty seven fewer paths on every frame.
        */}
        {activeArc && (
          <g fill="none" strokeLinecap="round">
            <path
              d={activeArc.path}
              className="text-brand-blue"
              stroke="currentColor"
              strokeWidth={1.6}
            />
            {/*
              The pulse. A short dash chased along the arc by animating the
              offset, which is one property and compositor friendly.
            */}
            <path
              d={activeArc.path}
              stroke="currentColor"
              className="text-brand-blue motion-reduce:hidden"
              strokeWidth={2.4}
              filter={`url(#${uid}-glow)`}
              style={{
                strokeDasharray: `26 ${Math.round(activeArc.len)}`,
                animation: "delivery-pulse 1100ms linear infinite",
                ["--arc-len" as string]: Math.round(activeArc.len + 26),
              }}
            />
          </g>
        )}

        {/* Destinations. The hit area is a fat invisible circle, because a
            four pixel dot is not something a pointer can reasonably find. */}
        {arcs.map(({ d, p }) => {
          const on = active?.code === d.code;
          return (
            <g
              key={d.code}
              onPointerEnter={() => setActive(d)}
              onFocus={() => setActive(d)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="img"
              aria-label={d.name}
              className="cursor-pointer outline-none"
            >
              <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 5 : 3}
                className="fill-brand-blue"
                filter={`url(#${uid}-glow)`}
                style={{ transition: "r 200ms" }}
              />
            </g>
          );
        })}

        {/* The hub, drawn last so it sits over every arc leaving it. */}
        <g>
          <circle cx={hubPt.x} cy={hubPt.y} r={16} className="fill-brand-blue/15" />
          <circle cx={hubPt.x} cy={hubPt.y} r={9} className="fill-brand-blue/30" />
          <circle
            cx={hubPt.x}
            cy={hubPt.y}
            r={4.5}
            className="fill-brand-blue"
            filter={`url(#${uid}-glow)`}
          />
        </g>

        {/* Labels last of all, over everything. The hub is always named; a
            destination names itself only while it is being pointed at. */}
        <Pill x={hubPt.x} y={hubPt.y + 26} text={hub.name} />
        {active && (
          <Pill
            x={project(active.lng, active.lat).x}
            y={project(active.lng, active.lat).y - 20}
            text={active.name}
          />
        )}
      </svg>
    </figure>
  );
}

/**
 * A name on a rounded plate, the way a tooltip reads.
 *
 * !! SVG HAS NO BACKGROUND ON TEXT, SO THE PLATE IS A REAL RECT !!
 *
 * There is no text-background in SVG and no box model to lean on, so the
 * plate has to be drawn and sized by hand, which means knowing how wide the
 * string will be before it renders. Measuring it properly would mean putting
 * it in the DOM, reading it back and drawing a second time.
 *
 * The font makes that unnecessary. These labels are set in JetBrains Mono,
 * where every glyph is exactly 0.6em wide, so the width is the character
 * count times the size times 0.6 and it is exact rather than approximate.
 * Change this to a proportional face and the plate will fit some names and
 * cut others.
 *
 * --secondary is the token: near white on a light ground, the surface tint on
 * a dark one, with --secondary-foreground as the ink either way. That pairing
 * is defined in app/brand.css and is contrast checked there, so the plate
 * cannot end up light on light when the theme flips.
 */
const CHAR_W = 0.6;

function Pill({ x, y, text, size = 12 }: { x: number; y: number; text: string; size?: number }) {
  const padX = 9;
  const w = text.length * size * CHAR_W + padX * 2;
  const h = size + 11;
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        className="fill-secondary"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-secondary-foreground font-mono"
        style={{ fontSize: size }}
      >
        {text}
      </text>
    </g>
  );
}
