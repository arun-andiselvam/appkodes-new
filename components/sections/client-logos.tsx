import { clientLogos } from "@/content/testimonials";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";

/**
 * The client logo band, straight under the home hero.
 *
 * Moved here on 18 September 2026 from the foot of TestimonialsSection, to
 * follow appkodes.com's own order: hero, then "A global partner to over 1000+
 * businesses" over these same six marks. The home page passes
 * showClients={false} to TestimonialsSection so they do not appear twice.
 *
 * No client state and no script. The row scrolls on the shared .marquee CSS
 * animation, so this renders entirely on the server.
 */
export function ClientLogosSection() {
  return (
    <Section spacing="tight" aria-label="Clients" className="border-y border-foreground/10">
      <Container>
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase text-center">
          A global partner to over 1000+ businesses
        </p>
      </Container>

      {/*
        Two copies because the keyframe travels -50%, with the trailing gap
        inside each set rather than on the flex parent. A gap on the parent
        makes the halves unequal and the row jumps every loop.
      */}
      <div className="marquee-track mt-10 flex overflow-hidden">
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex items-center gap-16 pr-16 shrink-0 marquee">
            {clientLogos.map((client) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${client.name}-${setIndex}`}
                src={client.logo}
                alt={setIndex === 0 ? client.name : ""}
                loading="lazy"
                aria-hidden={setIndex === 1}
                className="h-8 lg:h-10 w-auto shrink-0 grayscale opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert"
              />
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
