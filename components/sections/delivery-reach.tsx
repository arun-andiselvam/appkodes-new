import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { DeliveryMap } from "@/components/backgrounds/delivery-map";
import { destinations, hub } from "@/content/delivery-map";

/**
 * Where the work has gone, on /how-we-work.
 *
 * It sits on this page rather than the home page because it answers a
 * question about the engagement: a buyer in Toronto reading "two weeks to a
 * costed plan" wants to know whether that has ever happened across nine time
 * zones. It has, and this is the evidence rather than an assurance.
 *
 * !! THE COUNT COMES FROM THE DATA, IT IS NOT TYPED HERE !!
 *
 * Add a country to content/delivery-map.ts and this paragraph moves with it,
 * so the number on the page can never drift from the number of dots.
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
        <div className="max-w-2xl">
          <Eyebrow className="mb-6">Reach</Eyebrow>
          <SectionTitle>One team, and a lot of time zones.</SectionTitle>
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground">
            {`The team sits in ${hub.name}. These are the ${destinations.length} countries the work has reached. Hover a line to follow one.`}
          </p>
        </div>

        <div className="mt-14">
          <DeliveryMap />
        </div>
      </Container>
    </Section>
  );
}
