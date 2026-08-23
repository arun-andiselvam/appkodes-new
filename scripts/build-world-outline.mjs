/*
 * Decode Natural Earth 110m land (TopoJSON) into plain [lng, lat] rings and
 * emit content/world-outline.ts.
 *
 * TopoJSON stores every coastline once as a shared "arc" of delta encoded
 * integers, plus a transform back to degrees. A polygon then references arcs
 * by index, and a negative index means "that arc, reversed", encoded as ~i.
 * Undoing all of that here means the site ships plain coordinates and needs no
 * topojson dependency at runtime.
 */
import { readFileSync, writeFileSync } from "node:fs";

const topo = JSON.parse(readFileSync("/tmp/land110.json", "utf8"));
const { scale, translate } = topo.transform;

/** Delta decode one arc and map it back to degrees. */
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

/** Stitch a ring from its arc indices, dropping the duplicated join points. */
function ringFor(indices) {
  const out = [];
  for (const idx of indices) {
    const forward = idx >= 0;
    const arc = arcs[forward ? idx : ~idx];
    const pts = forward ? arc : [...arc].reverse();
    for (const p of pts.slice(out.length ? 1 : 0)) out.push(p);
  }
  return out;
}

/**
 * Undo the antimeridian.
 *
 * !! A RING THAT CROSSES 180 IS A LINE ACROSS THE WHOLE MAP !!
 *
 * Natural Earth stores Fiji and Chukotka with longitudes on both sides of the
 * seam. Read as plain numbers, the step from 179.4 to -179.8 is a jump of 359
 * degrees, so the polygon appears to stretch right round the globe and the
 * even odd test then calls an entire latitude row land. It showed as a dotted
 * line straight across the Pacific at 16 south, which is Fiji.
 *
 * The fix is to walk the ring adding or subtracting 360 so it stays
 * continuous, then emit it once where it sits and once shifted a full turn.
 * Whichever copy falls inside the drawn window paints; the other is rejected
 * by its bounding box and costs nothing.
 */
function unwrap(ring) {
  const out = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    let [x, y] = ring[i];
    const prev = out[out.length - 1][0];
    while (x - prev > 180) x -= 360;
    while (x - prev < -180) x += 360;
    out.push([x, y]);
  }
  return out;
}

function place(ring) {
  const u = unwrap(ring);
  const xs = u.map((p) => p[0]);
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  /* Sits inside the window already: one copy is enough. */
  if (min >= -180 && max <= 180) return [u];
  /* Straddles the seam: both halves, and the bbox drops whichever is off map. */
  const shift = (d) => u.map(([x, y]) => [x + d, y]);
  return [u, shift(max > 180 ? -360 : 360)];
}

const rings = [];
for (const geom of topo.objects.land.geometries) {
  const polys = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;
  for (const poly of polys) {
    /* poly[0] is the outer ring. Holes are ignored: at a two degree grid the
       Caspian is a few cells and the Great Lakes are one, so subtracting them
       costs more code than it saves dots. */
    rings.push(...place(ringFor(poly[0])));
  }
}

/* One decimal is about eleven kilometres, which is well inside a grid cell,
   and it roughly halves the file. Consecutive duplicates after rounding get
   dropped, which is most of the saving on smooth coasts. */
const round = (n) => Math.round(n * 10) / 10;
const cleaned = rings
  .map((r) => {
    const out = [];
    for (const [lng, lat] of r) {
      const p = [round(lng), round(lat)];
      const last = out[out.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
    }
    return out;
  })
  /* A ring under four points cannot enclose a cell at this grid size. */
  .filter((r) => r.length >= 4)
  /* Drop anything smaller than roughly a two by two degree box: it can never
     light a dot, so it is pure file size. Keeps every real island. */
  .filter((r) => {
    const xs = r.map((p) => p[0]);
    const ys = r.map((p) => p[1]);
    return Math.max(...xs) - Math.min(...xs) > 1.5 || Math.max(...ys) - Math.min(...ys) > 1.5;
  })
  .sort((a, b) => b.length - a.length);

/* ------------------------------------------------------------------ */
/* Rasterise here, so nothing has to at runtime                        */
/* ------------------------------------------------------------------ */

/*
 * !! THE OUTLINE ITSELF NEVER REACHES THE BROWSER !!
 *
 * It used to. The component imported 82KB of coordinates, 26KB gzipped,
 * and turned them into a path on mount, which meant shipping the data, the
 * point in polygon test and the bounding boxes to every visitor so they could
 * all compute the same string. Worse, it ran twice: once server side for the
 * HTML and again on hydration.
 *
 * The result is deterministic, so it belongs here. The browser gets the
 * finished path and nothing else.
 *
 * The projection constants are emitted with it. They have to match the
 * component's viewBox exactly, and a path generated against one window and
 * drawn in another is a bug that looks like bad geography rather than like a
 * mismatch, so there is one source for both.
 */
const LAT_TOP = 78;
const LAT_BOTTOM = -56;
const VIEW_W = 1000;
const VIEW_H = Math.round((VIEW_W * (LAT_TOP - LAT_BOTTOM)) / 360);
const STEP = 1.5;

const project = (lng, lat) => ({
  x: ((lng + 180) / 360) * VIEW_W,
  y: ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * VIEW_H,
});

function inRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const boxes = cleaned.map((ring) => {
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  return { ring, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
});

const parts = [];
for (let lat = LAT_TOP; lat >= LAT_BOTTOM; lat -= STEP) {
  for (let lng = -180; lng <= 180; lng += STEP) {
    let land = false;
    for (const b of boxes) {
      if (lng < b.minX || lng > b.maxX || lat < b.minY || lat > b.maxY) continue;
      if (inRing(lng, lat, b.ring)) { land = true; break; }
    }
    if (!land) continue;
    const { x, y } = project(lng, lat);
    /* Integers. The dots are 2.4 wide and sit on a fixed grid, so a tenth of a
       pixel is invisible and costs a fifth of the file. */
    parts.push(`M${Math.round(x)} ${Math.round(y)}l0 0`);
  }
}
const landPath = parts.join("");

const out = `/**
 * The land, rasterised to a dot grid and ready to draw.
 *
 * !! GENERATED. DO NOT HAND EDIT !!
 *
 * Natural Earth 1:110m land, public domain, decoded from the world-atlas
 * TopoJSON build. Regenerate with scripts/build-world-outline.mjs.
 *
 * !! THIS IS A PATH, NOT AN OUTLINE, AND THAT IS THE POINT !!
 *
 * The coastline data stays in the build script. Shipping it meant 26KB
 * gzipped of coordinates plus a point in polygon test in every visitor's
 * bundle, all to compute one string that never changes, and computing it
 * twice, once server side and again on hydration.
 *
 * Every dot is a zero length segment, "M x y l0 0", drawn by one path with a
 * round line cap. ${parts.length} dots, one node.
 *
 * The projection constants below are what this path was generated against.
 * components/backgrounds/delivery-map.tsx imports them rather than declaring
 * its own, because a path built for one window and drawn in another looks
 * like bad geography rather than like a mismatch.
 */
export const LAT_TOP = ${LAT_TOP};
export const LAT_BOTTOM = ${LAT_BOTTOM};
export const VIEW_W = ${VIEW_W};
export const VIEW_H = ${VIEW_H};

export const landPath =
  "${landPath}";
`;

writeFileSync("content/world-map.ts", out);
const pts = cleaned.reduce((n, r) => n + r.length, 0);
console.log(`${cleaned.length} rings, ${pts} source points -> ${parts.length} dots, ${Math.round(out.length / 1024)}KB emitted`);
