import type { MeetingPlace } from "./types";

/**
 * Clients and the team, photographed together.
 *
 * These come from appkodes.com, so they are the company's own pictures rather
 * than anything assembled here, and they are the only images on the site with
 * real people in them. Everything else is type, hairlines and logos. That is
 * exactly why the section earns a place before the closing call: a buyer who
 * has read this far has met no one.
 *
 * !! THESE ARE CLIENT LOCATIONS. THERE IS NO OFFICE IN ANY OF THEM !!
 *
 * This used to read "locations Appkodes already has people in", resting on a
 * delivery presence line in docs/positioning.md. The client corrected that on
 * 21 August 2026 and the doc is fixed at source. Clients are in these places
 * and the team has flown out to meet them, which is exactly what the
 * photographs show and the only claim any copy may make from them.
 *
 * positioning.md names five and four have a photograph, India being the one
 * without.
 *
 * The doc also warns that naming a covering office turns the reach claim into
 * an offshore delivery claim. Photographs avoid that trap on their own. Nobody
 * looking at a table of people reads it as a delivery centre.
 */
export const meetingPlaces: MeetingPlace[] = [
  { location: "Indonesia", image: "/meetings/indonesia.webp" },
  { location: "Dubai", image: "/meetings/dubai.webp" },
  { location: "Vietnam", image: "/meetings/vietnam.webp" },
  { location: "Sharjah", image: "/meetings/sharjah.webp" },
];
