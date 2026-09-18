import { partnershipCopy, partnershipModels } from "@/content/home";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * appkodes.com's "Our Partnership Models": Fixed Price, Hire Our Developer,
 * Onsite Development. Added to the home page on 18 September 2026. Copy in
 * content/home.ts.
 */
export function PartnershipModelsSection() {
  return (
    <Section id="partnership-models" className="border-t border-foreground/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <Eyebrow className="mb-6">{partnershipCopy.eyebrow}</Eyebrow>
          <SectionTitle className="mb-8">
            {partnershipCopy.title}
            <br />
            <span className="text-muted-foreground">{partnershipCopy.titleMuted}</span>
          </SectionTitle>
          <p className="text-xl text-muted-foreground leading-relaxed">{partnershipCopy.lede}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {partnershipModels.map((model, index) => (
            <article key={model.name} className="bg-background p-8 lg:p-10 flex flex-col">
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-2xl lg:text-3xl font-display tracking-tight">{model.name}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed flex-1">{model.description}</p>
              <p className="mt-8 pt-6 border-t border-foreground/10 text-sm">
                <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Best for
                </span>
                <span className="mt-1 block">{model.bestFor}</span>
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
