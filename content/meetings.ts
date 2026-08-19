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
 * The four are locations Appkodes already has people in. docs/positioning.md
 * lists the delivery presence as India, Indonesia, Dubai, Vietnam and Sharjah,
 * so these are four of the five and India is the one without a photograph.
 * That matters for the copy. The claim is that clients sit down with the team
 * in their own region, not that somebody boards a plane for every meeting.
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
