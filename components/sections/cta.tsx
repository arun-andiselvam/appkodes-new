"use client";

import { useState } from "react";
import Image from "next/image";
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
            {/*
              Two columns, and only one of them holds anything to read. The
              buttons moved across to sit under the paragraph they belong to,
              which leaves the right hand side to the badge alone.

              items-center rather than items-end or items-stretch. With the
              badge as the only thing on the right, aligning it to either edge
              of a text block it has no relationship to just looks like it
              fell there. Centred against the whole block, it reads as the
              counterweight to it.
            */}
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 lg:items-center">
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

                {/*
                  One line from sm up. They were stacked while they lived in a
                  narrow right hand column, and there is no reason for that now
                  they have the width of the paragraph to sit on. They still
                  stack on a phone, where two full width buttons side by side
                  would each be too narrow to read.
                */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
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

              {/*
                The badge, on its own.

                It belongs in the closing panel rather than anywhere else on the
                page: this is where a reader decides, and eighteen years is the
                reason to.

                It ran at 144 pixels tucked above the buttons, which made it
                read as a footnote to them, then at 360 which was too much of
                the panel. 288 with the buttons gone leaves it as the only thing
                on this side, so it carries the weight without needing the size.
                `lg:mr-6` walks it in off the border.

                The file is the download keyed off its white background. See the
                note on site.logo in content/site.ts: it arrived as a flattened
                PNG with no alpha at all, which renders as a white slab on any
                page that is not pure white, and as a bright one in dark mode.

                Artwork replaced 21 August 2026. The new download had the same
                problem, so it got the same treatment: paper keyed to alpha,
                soft edges un-matted so they carry no white fringe, then
                cropped tight. The source was 1024 square with wide margins,
                and leaving those in would have rendered the badge smaller at
                the same CSS width. The width classes below are unchanged; the
                new artwork is wider than tall where the old was taller than
                wide, so it sits shorter at the same width.
              */}
              {/*
                !! TWO FILES, BECAUSE THE ARTWORK WAS DRAWN FOR WHITE PAPER !!

                The badge is dark navy line work on transparency. Measured
                against the two grounds it actually sits on:

                  on #ffffff  median 5.89:1, 12.5% of the art below 3:1
                  on #0e1f25  median 2.87:1, 53.3% of the art below 3:1

                So in dark mode over half of it, the ribbon edges and the words
                YEARS OF EXCELLENCE worst of all, sank into the background.

                The dark file is the same artwork with its HSV value lifted by
                a gamma of 2.4. Hue and saturation are untouched, so it is the
                same blue rather than a washed out one, and it measures median
                4.66:1 with 2.9% below 3:1. A CSS filter was the cheaper fix
                and was not used: brightness() scales linearly and clips the
                highlights that are already near white, where a gamma curve
                lifts the shadows and leaves them alone.

                Swapped by class rather than by a <picture> media query,
                because the theme is a manual toggle. app/layout.tsx sets
                attribute="class", so prefers-color-scheme would ignore
                somebody choosing light while their system is dark.

                Both files are in the markup and both are below the fold, so
                next/image lazy loads them.

                Both also carry the real alt text, and that is not a duplicate.
                `hidden` is display:none, which takes an element out of the
                accessibility tree, so exactly one of these is ever announced.
                The first version of this put alt="" and aria-hidden on the
                dark copy, which left the badge with no accessible name at all
                for anybody reading the site in dark mode.
              */}
              <div className="shrink-0 flex justify-center lg:mr-6">
                <Image
                  src="/18-years-of-excellence.webp"
                  alt="Eighteen years of excellence"
                  width={692}
                  height={604}
                  className="w-48 sm:w-60 lg:w-72 h-auto dark:hidden"
                />
                <Image
                  src="/18-years-of-excellence-dark.webp"
                  alt="Eighteen years of excellence"
                  width={692}
                  height={604}
                  className="hidden w-48 sm:w-60 lg:w-72 h-auto dark:block"
                />
              </div>
            </div>
          </div>

          {/*
            One corner rule, not two. The pair used to sit diagonally opposite
            each other, and the top right of them now lands underneath the
            badge. Two devices fighting for the same corner reads as a mistake,
            and the badge is the heavier of the two, so the rule gives way and
            the bottom left one carries the diagonal on its own.
          */}
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </Container>
    </Section>
  );
}
