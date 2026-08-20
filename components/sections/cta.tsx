"use client";

import { useState } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { actions, ctaCopy } from "@/content/site";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

export function CtaSection() {
  const [sectionRef, isVisible] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <Section id="contact" ref={sectionRef} spacing="none" className="pt-12 lg:pt-16 pb-20 lg:pb-24 overflow-hidden">
      <Container>
        {/*
          The border was border-foreground at full strength, ten times the
          weight of every other panel on the page, all of which sit at /10. A
          fifth keeps this box reading as the closer without shouting at the
          sections above it.
        */}
        <div
          className={`relative border border-foreground/20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, var(--spotlight), transparent 40%)`
            }}
          />
          
          {/*
            The 500 pixel tetrahedron that used to sit on the right is gone,
            and the box closed up rather than leaving a hole where it was. The
            buttons take that side instead, so the panel is wide and short
            instead of wide and half empty, and the whole close now fits on one
            screen with the photographs above it.
          */}
          <div className="relative z-10 px-8 lg:px-12 py-12 lg:py-14">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow className="mb-5">
                  {ctaCopy.eyebrow}
                </Eyebrow>
                {/*
                  Was lg:text-7xl, the largest type on the page after the hero.
                  At 6xl it matches every other section heading and the panel
                  stops needing the height.
                */}
                <SectionTitle className="mb-6 leading-[0.95]">
                  {ctaCopy.headline}
                  <br />
                  <span className="text-muted-foreground">{ctaCopy.headlineAccent}</span>
                </SectionTitle>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {ctaCopy.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-full group"
                >
                  <Link href={actions.book}>
                    {ctaCopy.primaryCta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {/* Points somewhere real, unlike the buttons it replaces. */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
                >
                  <Link href={ctaCopy.secondaryHref}>{ctaCopy.secondaryCta}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </Container>
    </Section>
  );
}
