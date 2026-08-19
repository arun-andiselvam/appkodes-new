"use client";

import { useInView } from "@/hooks/use-in-view";
import { meetingPlaces } from "@/content/meetings";

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

export function MeetingsSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <section
      id="meetings"
      ref={sectionRef}
      className="relative pt-20 lg:pt-24 pb-12 lg:pb-14 border-t border-foreground/10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`max-w-2xl mb-12 lg:mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            In person
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
            Not every meeting
            <br />
            <span className="text-muted-foreground">happens on a screen.</span>
          </h2>
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

        {/*
          items-start stops the short columns stretching to the tallest, which
          is what leaves a pocket of dead space under them once the offsets
          are applied.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
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
                  alt={`The Appkodes team meeting a client in ${place.location}`}
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
              */}
              <figcaption className="mt-3 flex items-center gap-3">
                <span className="w-4 h-px bg-foreground/30" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {place.location}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
