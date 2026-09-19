import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { teamCopy } from "@/content/home";
import { actions } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";

/**
 * appkodes.com's "The Architects of Innovation: Our Mastermind Dev-Squad".
 * Copy in content/home.ts.
 *
 * Re-presented on 18 September 2026: the photograph read as pasted in when it
 * sat in a bordered box beside an oversized three line heading. It now bleeds
 * off the right edge and dissolves into the page through a gradient on its
 * left, the heading is a single line of section size, and a row of four facts
 * carries the specifics. Same photograph, different presentation.
 */
export function TeamSection() {
  const { image } = teamCopy;
  return (
    <Section spacing="none" id="team" className="relative overflow-hidden border-t border-foreground/10">
      {/*
        The photograph: right 60% of the section on desktop, a band across the
        top on phones. The overlays fade it into the page colour on the side
        the copy sits, so the text never runs over the busy part of the frame.
      */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 hidden lg:block bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div aria-hidden className="absolute inset-0 lg:hidden bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <Container className="relative py-16 lg:py-32">
        <div className="max-w-xl">
          <Eyebrow className="mb-6">{teamCopy.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl lg:text-5xl tracking-tight leading-[1.05] text-balance">
            {teamCopy.title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{teamCopy.lede}</p>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 border-y border-foreground/10">
            {teamCopy.facts.map((fact) => (
              <div
                key={fact.label}
                className="py-5 pr-4 sm:border-r sm:border-foreground/10 sm:last:border-r-0 sm:pl-5 sm:first:pl-0"
              >
                <dt className="font-display text-3xl tracking-tight">{fact.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground leading-snug">{fact.label}</dd>
              </div>
            ))}
          </dl>

          <Button
            asChild
            size="lg"
            className="mt-10 h-12 px-6 text-base rounded-lg bg-primary hover:bg-primary-hover hover:shadow-glow text-primary-foreground group"
          >
            <Link href={actions.book}>
              {teamCopy.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
