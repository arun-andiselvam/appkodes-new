"use client";

import { MapPin, Plane } from "lucide-react";

import { useInView } from "@/hooks/use-in-view";
import { meetingPlaces } from "@/content/meetings";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * The last thing before the closing call.
 *
 * A visitor who has read this far has met nobody. Every other section is type,
 * hairlines and logos, which is right for the argument but leaves the company
 * feeling like a website rather than a group of people. Four photographs of
 * clients and the team at a table fix that in the one place it counts, just
 * before we ask for the meeting.
 *
 * The layout is driven by a hard constraint. appkodes.com publishes these at
 * 286 by 218 and nothing larger exists, checked rather than assumed. Any
 * collage built around one big hero image would blow a 286 pixel photograph up
 * past 600 and look it. So the images stay near their native size and the
 * variation comes from where they sit instead.
 *
 * A flat four across row was the first attempt and read as a contact sheet.
 * Staggering the column offsets gives the same four pictures a rhythm, and
 * the eye travels down the row rather than scanning straight across it.
 */

/**
 * Vertical offset per column, applied only from lg where the row is four wide.
 * The values rise and fall rather than climbing, so the band reads as a wave
 * instead of a staircase leaning off the bottom of the section.
 */
const OFFSETS = ["lg:mt-0", "lg:mt-10", "lg:mt-4", "lg:mt-14"];

/**
 * The dashed route drawn behind the photographs.
 *
 * The section already argues that somebody travels; the line is what that
 * argument looks like. It crests in the three gaps between the columns and
 * ducks behind each photograph in between, so the pictures are what
 * interrupts it. A line laid entirely on top would be a decoration sitting
 * over the faces, which is the opposite of what this section is for.
 *
 * Geometry, since the numbers look arbitrary otherwise. The viewBox is 1000
 * by 360 with preserveAspectRatio="none", so every coordinate is really a
 * fraction of the box and the route rescales with the grid rather than being
 * measured at runtime. At lg the four columns and their three 2rem gaps put
 * the gap centres at x = 244, 500 and 756, and the column centres between
 * them; the crests sit on the gaps and the dips on the columns, each with a
 * horizontal tangent, which is what keeps it a wave rather than a zigzag.
 *
 * The box starts 48px above the grid (-top-12) because the crests have to
 * clear the top edge of the tallest photograph or the whole line hides behind
 * the row. The first version crested at y = 78, below that edge, and only
 * showed in the 24 unit gaps; at y = 34 each hop is visible for most of its
 * span and only the dips are covered. The dips follow the column offsets in
 * OFFSETS above, which is why they are uneven: 110 under the column pushed
 * down 40px, 86 under the one pushed 16, 126 under the one pushed 56.
 */
const ROUTE =
  "M 0 96 C 90 96 150 34 244 34 C 308 34 308 110 372 110 " +
  "C 436 110 436 34 500 34 C 564 34 564 86 628 86 " +
  "C 692 86 692 34 756 34 C 812 34 812 126 866 126 " +
  "C 906 126 940 80 975 44";

/**
 * Where the route ends, as a fraction of the same box: x 975/1000 and
 * y 44/360. preserveAspectRatio="none" maps the viewBox to the box exactly
 * the way percentages do, so positioning the plane in CSS lands it on the end
 * of the path at any width without measuring anything.
 */
const PLANE_POSITION = { left: "97.5%", top: "12.2%" };

/**
 * Drawn with a left to right wipe rather than a stroke-dashoffset animation,
 * because the path is dashed and animating the offset would slide the dashes
 * along instead of extending the line. It is the same clip-path idiom as the
 * .line-reveal utility in globals.css, driven off isVisible instead of mount.
 */
function FlightRoute({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-12 inset-x-0 bottom-0 hidden lg:block"
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: "clip-path 1.6s cubic-bezier(0.77, 0, 0.175, 1) 260ms",
        }}
      >
        <svg
          viewBox="0 0 1000 360"
          preserveAspectRatio="none"
          className="w-full h-full text-foreground/30"
        >
          {/*
            non-scaling-stroke is doing real work here. Without it the
            preserveAspectRatio="none" scale stretches the dashes horizontally,
            so the near flat stretches would dash differently from the climbs.
          */}
          <path
            d={ROUTE}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="5 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      {/*
        The plane sits outside the wipe and fades in on its own delay, timed to
        land as the line reaches it. Inside the wipe it would spend a moment
        sliced in half. Lucide's plane already points up and to the right,
        which is the direction the last segment climbs, so it needs no
        rotation.
      */}
      <Plane
        strokeWidth={1.5}
        className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 text-foreground/50 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ ...PLANE_POSITION, transitionDelay: "1600ms" }}
      />
    </div>
  );
}

export function MeetingsSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <Section
      spacing="none"
      id="meetings"
      ref={sectionRef}
      className="pt-20 lg:pt-24 pb-12 lg:pb-14 border-t border-foreground/10 overflow-hidden"
    >
      <Container>
        <div
          className={`max-w-2xl mb-12 lg:mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Eyebrow className="mb-6">
            In person
          </Eyebrow>
          <SectionTitle className="mb-8">
            Not every meeting
            <br />
            <span className="text-muted-foreground">happens on a screen.</span>
          </SectionTitle>
          {/*
            An earlier version opened with "four are below", which made the
            reader count photographs, and closed by insisting the pictures were
            not stock, which is a defence nobody had asked for. Both spent the
            paragraph on the section instead of on the client.

            This one answers the fear underneath the section. A buyer at this
            size expects to be handed to an account manager and then to a queue
            somewhere they cannot reach. It is the same promise as the "One
            person to call" line in content/audiences.ts, so the two agree.

            Five countries is backed by the delivery presence in
            docs/positioning.md. "Usually" is doing honest work in the second
            sentence and should stay.
          */}
          <p className="text-xl text-muted-foreground leading-relaxed">
            Nobody here hands you to an account manager. We keep people in five
            countries, so the person across the table is usually the one who builds it.
            These photographs are some of those meetings.
          </p>
        </div>

        <div className="relative">
          <FlightRoute isVisible={isVisible} />

          {/*
            items-start stops the short columns stretching to the tallest, which
            is what leaves a pocket of dead space under them once the offsets
            are applied. relative keeps the photographs painting over the route
            behind them, which is the whole point of the route.
          */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            {meetingPlaces.map((place, index) => (
              <figure
                key={place.location}
                className={`group transition-all duration-700 ${OFFSETS[index % OFFSETS.length]} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={place.image}
                    alt={`The Hitasoft team meeting a client in ${place.location}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/*
                  The label sits under the photograph rather than over it. An
                  earlier version laid it on the image behind a gradient, which
                  is what you reach for when a caption has to survive whatever is
                  underneath. Below the frame it needs no wash, and a mono line
                  against the page matches every other label on the site.

                  The hairline that used to open the caption has become a pin.
                  It reads as a stop on the route above rather than as one more
                  rule on a page that already has plenty.
                */}
                <figcaption className="mt-3 flex items-center gap-2">
                  <MapPin
                    aria-hidden
                    strokeWidth={1.5}
                    className="w-3.5 h-3.5 shrink-0 text-foreground/45"
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {place.location}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
