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
 * The site publishes "50+ countries" in its stats row and that figure is
 * flagged as unconfirmed where it appears. A map is a sharper claim than a
 * figure, because a dot names a place, so this section counts what is
 * actually plotted and says that number instead. Add a country to
 * content/delivery-map.ts and the heading moves with it.
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
            {`The team sits in ${hub.name}. These are the ${destinations.length} countries with a client who has put their name to the work, and every one of them ran on the same two week start. Hover a line to follow it.`}
          </p>
        </div>

        <div className="mt-14">
          <DeliveryMap />
        </div>
      </Container>
    </Section>
  );
}
