import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { teamCopy } from "@/content/home";
import { actions } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * appkodes.com's "The Architects of Innovation: Our Mastermind Dev-Squad".
 * Added to the home page on 18 September 2026. Copy in content/home.ts.
 */
export function TeamSection() {
  const { image } = teamCopy;
  return (
    <Section id="team" className="border-t border-foreground/10">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <Eyebrow className="mb-6">{teamCopy.eyebrow}</Eyebrow>
            <SectionTitle className="mb-8">
              {teamCopy.title}
              <br />
              <span className="text-muted-foreground">{teamCopy.titleMuted}</span>
            </SectionTitle>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">{teamCopy.lede}</p>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-lg border-foreground/20 hover:bg-foreground/5 group">
              <Link href={actions.book}>
                {teamCopy.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full h-auto border border-foreground/10"
          />
        </div>
      </Container>
    </Section>
  );
}
