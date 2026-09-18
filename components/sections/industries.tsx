import { industries, industriesCopy } from "@/content/home";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * appkodes.com's "Your Partner in Digital Innovation... Across All Sectors",
 * as a grid of the industries Appkodes builds for. Added to the home page on
 * 18 September 2026. Copy in content/home.ts.
 *
 * Plain cards, not links: none of these has a page on this site yet.
 */
export function IndustriesSection() {
  return (
    <Section id="industries" className="border-t border-foreground/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <Eyebrow className="mb-6">{industriesCopy.eyebrow}</Eyebrow>
          <SectionTitle className="mb-8">
            {industriesCopy.title}
            <br />
            <span className="text-muted-foreground">{industriesCopy.titleMuted}</span>
          </SectionTitle>
          <p className="text-xl text-muted-foreground leading-relaxed">{industriesCopy.lede}</p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {industries.map((industry) => (
            <li key={industry.name} className="bg-background p-6 lg:p-8">
              <h3 className="text-lg font-medium">{industry.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{industry.line}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
