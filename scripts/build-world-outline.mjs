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

const body = cleaned
  .map((r) => `  [${r.map(([a, b]) => `[${a},${b}]`).join(",")}],`)
  .join("\n");

const header = `/**
 * The land, as real coastlines in [longitude, latitude].
 *
 * !! GENERATED. DO NOT HAND EDIT !!
 *
 * Natural Earth 1:110m land, decoded from the world-atlas TopoJSON build and
 * flattened to plain rings. Natural Earth is public domain, so this ships
 * without an attribution requirement, though it is worth keeping the credit.
 *
 * Regenerate with scratchpad/topo.mjs against
 * https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json
 *
 * !! THIS REPLACED A HAND DRAWN OUTLINE, AND THAT IS WHY IT EXISTS !!
 *
 * The first three versions of this file were coordinates written from
 * knowledge. Each pass fixed something real, a Mediterranean that had closed
 * up and fused Africa to Europe, a hole where West Siberia should be, a
 * missing Gulf of Mexico, and each pass still looked wrong, because a
 * coastline written from memory gets to "recognisable" and stops. Real data
 * is ${Math.round(body.length / 1024)}KB and settles it.
 *
 * Holes are dropped. At the grid size components/backgrounds/delivery-map.tsx
 * rasterises to, the Caspian is a handful of cells and the Great Lakes are
 * about one, so subtracting them costs more code than it saves dots.
 *
 * Coordinates are rounded to one decimal, roughly eleven kilometres, which is
 * well inside a single cell of that grid.
 */
export type Ring = [number, number][];

export const landmasses: Ring[] = [
`;

writeFileSync("content/world-outline.ts", header + body + "\n];\n");

const pts = cleaned.reduce((n, r) => n + r.length, 0);
console.log(`${cleaned.length} rings, ${pts} points, ${Math.round((header.length + body.length) / 1024)}KB`);
