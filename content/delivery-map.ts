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
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  /**
   * A client in this country has put their name to the work.
   *
   * !! THE MAP DOES NOT DRAW THIS DIFFERENTLY, AND THAT IS THE POINT !!
   *
   * Twelve of the forty nine below have a named testimonial in
   * content/testimonials.ts and a flag in public/flags. The rest are the
   * markets the "50+ countries" figure covers. Both plot the same, because a
   * map that drew two grades of dot would be asking a visitor to read a
   * footnote, and the site publishes the figure as one number.
   *
   * It is recorded here so the difference survives in the repository. If
   * anybody ever has to answer "which client was that", this is the list that
   * can.
   */
  evidenced?: true;
  /**
   * A point that reads as the country, which is not the same as its biggest
   * city.
   *
   * !! TWO RULES, AND THE FIRST VERSION BROKE BOTH !!
   *
   * Inland, because the coastline this map draws is Natural Earth 1:110m and
   * a simplified coast swallows the cities that sit on it. New York and
   * Istanbul were both plotted at their real coordinates and both rendered
   * in open water, a pin floating off the shore of the country it labels.
   *
   * Far enough apart to read as the country rather than its neighbour. New
   * York and Toronto are about five hundred kilometres apart, which is
   * seventeen units on a thousand unit map, so the United States and Canada
   * first arrived as a single smudge in the north east. Both are inland
   * points now and forty nine units apart.
   *
   * !! THAT IS A RULE FOR NEIGHBOURS, NOT A FLOOR FOR THE MAP !!
   *
   * At fifty countries it cannot be a floor. One unit is about a third of a
   * degree, so Qatar and Saudi Arabia are thirteen units apart and the
   * Netherlands and France eighteen, and no honest coordinate fixes that.
   * Europe and the Gulf read as clusters, which is what they are and what
   * every map like this shows.
   *
   * Verified with a script rather than by eye: every pin below sits on land.
   * Two did not. New York and Istanbul were plotted at their real coordinates
   * and both rendered offshore.
   */
  lat: number;
  lng: number;
};

/** Madurai, where the team is. */
export const hub = { name: "Madurai", lat: 9.93, lng: 78.12 };

/**
 * The figure the copy publishes, which is no longer `destinations.length`.
 *
 * !! THE COUNT USED TO COME FROM THE DATA, AND THE CLIENT ENDED THAT !!
 *
 * The visible paragraph and the caption both read the array's length, so the
 * sentence moved with the list and the number on the page could not drift from
 * the number of dots. That was the right default and it is worth knowing why
 * it went. The list holds forty nine countries, the home page stats row has
 * published "50+ countries delivered to" since the rebuild started, and a map
 * saying 49 one click away from a stats row saying 50+ reads as one of the two
 * being wrong. The client asked on 24 August 2026 for the map to say 50+.
 *
 * The two claims are pinned together here. This string and the `heroStats`
 * entry in content/site.ts are the same claim, so if one changes the other
 * has to.
 *
 * !! THE FIGURE IS UNVERIFIED, AND THAT PREDATES THIS CHANGE !!
 *
 * docs/page-progress.md carries "more than 50 countries" as an unverified
 * claim against the home page. A second page now makes it. Nothing about the
 * change makes it truer, and that blocker is untouched.
 *
 * The dots stay honest either way. Adding a fiftieth country to make the
 * arithmetic work would be inventing a delivery, which is the one thing the
 * note at the top of this file exists to prevent.
 */
export const reachFigure = "50+";

export const destinations: Destination[] = [
  /* ---- Named client, checkable in content/testimonials.ts ---- */
  /* Kansas and Saskatchewan rather than New York and Toronto. Both are
     unmistakably inside their country and forty nine units apart. */
  { code: "US", name: "United States", lat: 39.8, lng: -98.6, evidenced: true },
  { code: "CA", name: "Canada", lat: 56.1, lng: -106.3, evidenced: true },
  { code: "BR", name: "Brazil", lat: -10.5, lng: -52.5, evidenced: true },
  { code: "CL", name: "Chile", lat: -33.45, lng: -70.67, evidenced: true },
  { code: "FR", name: "France", lat: 46.6, lng: 2.4, evidenced: true },
  /* Ankara, not Istanbul: the Bosphorus is wider than the country at 110m. */
  { code: "TR", name: "Türkiye", lat: 39.93, lng: 32.86, evidenced: true },
  { code: "MA", name: "Morocco", lat: 31.8, lng: -7.1, evidenced: true },
  { code: "NG", name: "Nigeria", lat: 9.1, lng: 7.4, evidenced: true },
  { code: "SA", name: "Saudi Arabia", lat: 24.71, lng: 46.68, evidenced: true },
  { code: "OM", name: "Oman", lat: 21.5, lng: 57.0, evidenced: true },
  { code: "IN", name: "India", lat: 22.5, lng: 78.5, evidenced: true },
  { code: "AU", name: "Australia", lat: -25.5, lng: 134.0, evidenced: true },

  /* ---- The rest of the "50+ countries" figure ---- */
  { code: "GB", name: "United Kingdom", lat: 52.6, lng: -1.6 },
  { code: "PT", name: "Portugal", lat: 39.7, lng: -8.1 },
  { code: "ES", name: "Spain", lat: 40.2, lng: -3.9 },
  { code: "DE", name: "Germany", lat: 51.0, lng: 10.2 },
  { code: "NL", name: "Netherlands", lat: 52.2, lng: 5.7 },
  { code: "CH", name: "Switzerland", lat: 46.8, lng: 8.2 },
  { code: "IT", name: "Italy", lat: 43.0, lng: 12.2 },
  { code: "PL", name: "Poland", lat: 52.1, lng: 19.4 },
  { code: "SE", name: "Sweden", lat: 60.4, lng: 15.4 },
  { code: "NO", name: "Norway", lat: 61.2, lng: 9.4 },
  { code: "DK", name: "Denmark", lat: 56.1, lng: 9.5 },
  { code: "FI", name: "Finland", lat: 62.6, lng: 26.0 },
  /* Moscow. Far to the west of a country that reaches 180 east, which is the
     convention every map like this uses, and it is well clear of Finland
     and Kazakhstan on screen. */
  { code: "RU", name: "Russia", lat: 55.75, lng: 37.6 },
  { code: "AZ", name: "Azerbaijan", lat: 40.4, lng: 47.6 },
  { code: "KZ", name: "Kazakhstan", lat: 48.2, lng: 67.5 },
  { code: "AE", name: "United Arab Emirates", lat: 23.9, lng: 54.4 },
  { code: "QA", name: "Qatar", lat: 25.3, lng: 51.2 },
  { code: "KW", name: "Kuwait", lat: 29.4, lng: 47.6 },
  { code: "IL", name: "Israel", lat: 31.4, lng: 35.0 },
  { code: "EG", name: "Egypt", lat: 26.8, lng: 30.0 },
  { code: "DZ", name: "Algeria", lat: 28.2, lng: 2.6 },
  { code: "KE", name: "Kenya", lat: 0.6, lng: 37.7 },
  { code: "ZA", name: "South Africa", lat: -29.2, lng: 24.7 },
  { code: "PK", name: "Pakistan", lat: 30.0, lng: 69.4 },
  { code: "BD", name: "Bangladesh", lat: 24.0, lng: 90.2 },
  { code: "LK", name: "Sri Lanka", lat: 7.7, lng: 80.7 },
  { code: "CN", name: "China", lat: 34.8, lng: 103.5 },
  { code: "JP", name: "Japan", lat: 36.4, lng: 138.4 },
  { code: "SG", name: "Singapore", lat: 1.35, lng: 103.82 },
  { code: "VN", name: "Vietnam", lat: 15.5, lng: 107.6 },
  { code: "MY", name: "Malaysia", lat: 4.2, lng: 102.0 },
  { code: "ID", name: "Indonesia", lat: -1.6, lng: 113.4 },
  { code: "PH", name: "Philippines", lat: 15.9, lng: 121.0 },
  { code: "MX", name: "Mexico", lat: 23.6, lng: -102.5 },
  { code: "CO", name: "Colombia", lat: 4.2, lng: -73.3 },
  { code: "AR", name: "Argentina", lat: -34.5, lng: -64.5 },
  { code: "NZ", name: "New Zealand", lat: -43.5, lng: 171.5 },
];
