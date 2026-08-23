import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { DeliveryMap } from "@/components/backgrounds/delivery-map";
import { hub, reachFigure } from "@/content/delivery-map";

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
    <Section spacing="tight" className="border-t border-foreground/10">
      <Container>
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
        <Eyebrow className="mb-6">Reach</Eyebrow>
        <SectionTitle className="xl:text-nowrap">
          One team, and a lot of time zones.
        </SectionTitle>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          {`The team sits in ${hub.name}. The work has reached ${reachFigure} countries, and every one on this map is a place it landed. Hover a line to follow one.`}
        </p>

        <div className="mt-14">
          <DeliveryMap />
        </div>
      </Container>
    </Section>
  );
}
