"use client";

import { useInView } from "@/hooks/use-in-view";
import { awards } from "@/content/recognition";

/**
 * Sits where the pricing tiers were.
 *
 * Badges are shown in full colour, unlike the client logos further up which
 * are greyed back. The difference is deliberate. Client marks are texture and
 * belong to somebody else's brand, while these four are the content of the
 * section and their colour is part of being recognisable.
 *
 * The artwork is dark on transparent, so it needs a light plate under it to
 * survive dark mode. A tinted card does that and doubles as the thing that
 * separates one badge from the next.
 */
export function RecognitionSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <section
      id="recognition"
      ref={sectionRef}
      className="relative py-20 lg:py-24 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: what these are */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Recognition
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Rated by people
              <br />
              <span className="text-muted-foreground">who do not work here.</span>
            </h2>
            {/*
              Which practice these cover is stated rather than left for the
              reader to notice. Somebody who works out for themselves that every
              badge is for a different service line trusts the rest of the page
              less than if we had just said it.

              No year is claimed here. Two of the four have one set into their
              artwork and the badge can speak for itself. See content/recognition.ts.
            */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              These four came from industry directories that assess development firms.
              They looked at delivered work rather than a pitch. All four cover the app
              development side of the business rather than the automation work.
            </p>
          </div>

          {/* Right: the badges */}
          <div className="grid grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
            {awards.map((award, index) => (
              <figure
                key={award.name}
                className={`bg-background p-6 lg:p-8 flex flex-col items-center text-center transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                {/*
                  The artwork is transparent, so nothing sits behind it in
                  light mode. Dark mode is the exception: these badges are dark
                  navy and red, and on a dark page they would read as smudges.
                  The plate only appears there, and the box keeps its size in
                  both so the grid does not shift between themes.
                */}
                <span className="w-full flex items-center justify-center rounded-sm py-4 px-3 dark:bg-white/90">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={award.logo}
                    alt={`${award.name}: ${award.title}`}
                    loading="lazy"
                    className="h-20 lg:h-24 w-auto"
                  />
                </span>
                <figcaption className="mt-4">
                  <span className="block text-sm font-medium">{award.name}</span>
                  <span className="block mt-1 text-xs text-muted-foreground leading-snug">
                    {award.title}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
