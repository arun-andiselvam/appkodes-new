/**
 * Where the work has gone, drawn as a map.
 *
 * !! EVERY DOT ON THIS MAP IS A CLAIM, AND A SHARPER ONE THAN A NUMBER !!
 *
 * "50+ countries" in a stats row reads as a rounded boast and a reader
 * discounts it accordingly. A pin sitting on Peru does not. It says we
 * delivered in Peru, to somebody who may well ask which client. That is the
 * difference between a figure and a map, and it is why this file is a short
 * list rather than fifty invented ones.
 *
 * docs/positioning.md, claims discipline: nothing gets published that nobody
 * has measured. The 50 countries figure is already flagged as unconfirmed
 * where the home page uses it, and it was declined outright as a trust badge
 * on the fintech page for the same reason.
 *
 * !! THESE ARE THE ONES WITH EVIDENCE BEHIND THEM !!
 *
 * Every entry below is a country with a named client testimonial in
 * content/testimonials.ts and a flag in public/flags. That is a real record,
 * checkable in the repository, and it is the honest starting set.
 *
 * !! ADDING TO THIS LIST IS A BUSINESS DECISION, NOT A DESIGN ONE !!
 *
 * The map draws whatever is here and counts it, so the headline follows the
 * data rather than being typed. Hand over the real delivery list and it
 * plots, arcs and all, with no change to the component. Do not pad it to make
 * the picture busier.
 */
export type Destination = {
  /** ISO 3166-1 alpha-2, matching public/flags. */
  code: string;
  name: string;
  /** Roughly the largest city, not the centroid: a centroid puts Canada in
   *  tundra and the arc then lands somewhere nobody works. */
  lat: number;
  lng: number;
};

/** Madurai, where the team is. */
export const hub = { name: "Madurai", lat: 9.93, lng: 78.12 };

export const destinations: Destination[] = [
  { code: "US", name: "United States", lat: 40.71, lng: -74.01 },
  { code: "CA", name: "Canada", lat: 43.65, lng: -79.38 },
  { code: "BR", name: "Brazil", lat: -23.55, lng: -46.63 },
  { code: "CL", name: "Chile", lat: -33.45, lng: -70.67 },
  { code: "FR", name: "France", lat: 48.86, lng: 2.35 },
  { code: "TR", name: "Türkiye", lat: 41.01, lng: 28.98 },
  { code: "MA", name: "Morocco", lat: 33.57, lng: -7.59 },
  { code: "NG", name: "Nigeria", lat: 6.52, lng: 3.38 },
  { code: "SA", name: "Saudi Arabia", lat: 24.71, lng: 46.68 },
  { code: "OM", name: "Oman", lat: 23.59, lng: 58.41 },
  { code: "IN", name: "India", lat: 19.08, lng: 72.88 },
  { code: "AU", name: "Australia", lat: -33.87, lng: 151.21 },
];
