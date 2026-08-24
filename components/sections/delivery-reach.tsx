import dynamic from "next/dynamic";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { hub, reachFigure } from "@/content/delivery-map";

/**
 * Loaded through next/dynamic rather than a plain import, same idiom as
 * VideoModal in testimonials.tsx. ssr stays true (the default) on purpose,
 * unlike that one: DeliveryMap's figcaption is the whole text alternative
 * for the map (see the note in delivery-map.tsx), so it has to stay in the
 * HTML a crawler and a screen reader get without running any JS at all.
 *
 * What this buys, without touching a line of DeliveryMap itself: it is the
 * single largest client bundle on the home page (a six thousand seven
 * hundred dot land path, forty nine arcs), and it sits ninth of thirteen
 * sections down the page. A plain import makes React wait on that bundle
 * as part of the same hydration pass that hydrates the hero. Wrapped in
 * dynamic(), it hydrates behind its own Suspense boundary instead, so the
 * hero above the fold is not held up by a map nobody has scrolled to yet.
 */
const DeliveryMap = dynamic(
  () => import("@/components/backgrounds/delivery-map").then((m) => m.DeliveryMap),
  {
    /*
     * Same aspect ratio as the map's own viewBox (content/world-map.ts:
     * VIEW_W 1000, VIEW_H 372), so there is no layout shift between this
     * placeholder and the real SVG landing in its place.
     */
    loading: () => <div className="aspect-[1000/372] w-full" aria-hidden />,
  },
);

/**
 * Where the work has gone. On /how-we-work and on the home page.
 *
 * It was written for /how-we-work, where it answers a question about the
 * engagement: a buyer in Toronto reading "two weeks to a costed plan" wants to
 * know whether that has ever happened across nine time zones. It has, and this
 * is the evidence rather than an assurance.
 *
 * !! IT USED TO SAY IT DELIBERATELY WAS NOT ON THE HOME PAGE !!
 *
 * The client asked for it there on 24 August 2026 and it now renders on both.
 * The argument it makes is different in each place, which is why one section
 * serves both rather than being forked. On the home page it is the countries
 * behind the "50+ countries delivered to" figure in the hero stats row, and it
 * sits directly above the photographs so a named list runs into four rooms the
 * team was actually in. See the note in app/page.tsx.
 *
 * Nothing here is page aware. If the two pages ever need different copy, the
 * fix is a prop on this component and not a second copy of the file, because a
 * second copy is how the map and its caption start disagreeing.
 *
 * !! THE COUNT NO LONGER COMES FROM THE DATA !!
 *
 * It read `destinations.length`, so adding a country to
 * content/delivery-map.ts moved this paragraph with it and the number on the
 * page could not drift from the number of dots. The client asked on 24 August
 * 2026 for the copy to say 50+, which is the figure the home page stats row
 * already publishes, and forty nine of those are plotted. The string is
 * `reachFigure` in content/delivery-map.ts, next to the reasoning and next to
 * the note that the figure is still unverified.
 *
 * !! THE COPY SAYS "REACHED", NOT "PUT THEIR NAME TO THE WORK" !!
 *
 * It said the second thing while the map held twelve countries, each with a
 * named testimonial behind it, and that sentence was true. The client asked
 * on 24 August 2026 for the map to carry the full fifty, which is the figure
 * the stats row already publishes, so thirty eight of them have no named
 * client and the old sentence would have been a claim about all fifty that
 * only twelve could support. "Reached" is what the fifty actually supports.
 *
 * The twelve are still marked in the data, so the difference survives even
 * though the map draws them identically. See content/delivery-map.ts.
 *
 * The line about every one running on the same two week start went at the
 * same time. It was written to tie the map to this page and nobody has
 * checked whether it is true of all of them.
 *
 * DeliveryMap is a client component, for the hover. This section is not, so
 * the heading and the country list are in the HTML a crawler reads.
 */
export function DeliveryReachSection() {
  return (
    /*
      !! THE EMPHASIS PANEL, THE SAME ONE THE PROCESS SECTION USES !!

      This was a white section with a hairline above it. The client asked for
      the dark treatment on 24 August 2026, because the home page ran white
      from the hero to the closing panel with only the process section
      breaking it, and a map is the other block on the page that can carry a
      dark ground without being shouted at.

      The border-t went with the change. A rule belongs between two sections
      of the same colour, and a panel that changes colour draws its own edge.

      Everything inside it now reads from --emphasis-foreground rather than
      --foreground. That is not a detail: --emphasis is dark in BOTH themes,
      so the usual light and dark pairs are wrong here in one of the two. See
      the note on --emphasis-accent in app/brand.css, which exists because
      --primary manages only 2.06:1 on this ground.
    */
    <Section spacing="tight" className="bg-emphasis text-emphasis-foreground overflow-hidden">
      {/*
        The diagonal hatch from the process section, at the same 3% opacity so
        the two panels read as one treatment rather than two dark sections that
        happen to be near each other. It draws in currentColor, which is
        --emphasis-foreground here, so it needs no colour of its own.
      */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`,
          }}
        />
      </div>

      <Container className="relative z-10">
        {/*
          !! THE HEADING IS NOT INSIDE THE max-w-2xl COLUMN !!

          The eyebrow, the heading and the paragraph shared one 672 pixel
          column until 24 August 2026, which broke "One team, and a lot of time
          zones." across two lines with "zones." alone on the second. The
          client asked for one line.

          Only the paragraph is measured now. A column is what keeps prose
          readable and a display heading is not prose, so the heading takes the
          container and sets at about 980 pixels at lg:text-6xl.

          `xl:text-nowrap` from 1280 up, where the container leaves about 1184
          pixels and one line is certain. It is deliberately not on at `lg`:
          that breakpoint starts at 1024, which leaves 928 and would push the
          full stop off the right edge rather than wrapping it. Below xl the
          heading wraps as it always did.
        */}
        <Eyebrow tone="emphasis" className="mb-6">
          Reach
        </Eyebrow>
        <SectionTitle className="xl:text-nowrap">
          One team, and a lot of time zones.
        </SectionTitle>
        {/*
          text-emphasis-foreground/70 rather than text-muted-foreground. The
          muted token is a grey chosen against the page background, and on this
          panel it is close enough to the ground to be hard work.
        */}
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-emphasis-foreground/70">
          {`The team sits in ${hub.name}. The work has reached ${reachFigure} countries, and every one on this map is a place it landed. Hover a line to follow one.`}
        </p>

        <div className="mt-14">
          <DeliveryMap />
        </div>
      </Container>
    </Section>
  );
}
