"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroBackdrop } from "@/components/backgrounds/hero-backdrop";
import { actions, heroWords as words, heroStats, heroCopy, site } from "@/content/site";
import { QuoteLauncher } from "@/components/quote/launcher";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";

export function HeroSection() {
  // The entrance animation has to start from its "before" state so the server
  // and the first client render agree. It runs the moment React takes over.
  const isVisible = useHydrated();
  const [wordIndex, setWordIndex] = useState(0);

  // Same guard as every other rotating section on the page (see
  // AudiencesSection): stop cycling once this is scrolled out of view, and
  // never start for a visitor who has asked for reduced motion. This one used
  // to run forever regardless of either, the one inconsistency with the rest
  // of the site's rotators.
  const [heroRef, heroInView] = useInView<HTMLElement>({ once: false, threshold: 0 });
  const reducedMotion = useReducedMotion();
  const rotating = heroInView && !reducedMotion;

  useEffect(() => {
    if (!rotating) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [rotating]);

  return (
    <Section
      ref={heroRef}
      spacing="none"
      className="min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <HeroBackdrop />

      <Container className="relative z-10 pt-24 pb-40 lg:pt-28 lg:pb-56">
        {/* Eyebrow */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Eyebrow>
            {site.eyebrow}
          </Eyebrow>
        </div>
        
        {/*
          Main headline.

          !! THIS ONE DOES NOT WAIT ON isVisible, AND USED TO !!

          It carried the same opacity-0-until-hydrated treatment as the
          eyebrow, description and CTAs below, on the same reasoning: the
          server and the first client render have to agree, so the "before"
          state has to be in the SSR'd HTML.

          The cost of that agreement is what an invisible element cannot do:
          be a Largest Contentful Paint candidate. This is the single
          biggest thing on the page, in a font size up to 7rem, and Chrome
          simply cannot count text sitting at opacity: 0. Confirmed live on
          25 August 2026, after the Cloudflare RUM beacon (a separate issue)
          was disabled and stopped masking it: LCP had quietly become the
          header's small logo image instead, because that one paints at
          full opacity immediately and this one does not paint as anything
          for up to a second while its fade-in transition runs.

          So the headline renders at full opacity from the first frame,
          server side included, and everything under it still stages in on
          the same duration-700/duration-1000 cascade it always did. The
          arrival still reads as one, it just does not cost the metric that
          exists to measure how fast the reader actually sees something.
        */}
        <div className="mb-12">
          <h1 className="text-[clamp(2.5rem,9vw,7rem)] font-display leading-[0.9] tracking-tight">
            <span className="block">{heroCopy.headline}</span>
            <span className="block">
              <span className="relative inline-block">
                <span 
                  key={wordIndex}
                  className="inline-flex"
                >
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p 
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {heroCopy.description}
          </p>
          
          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-full group"
            >
              <QuoteLauncher>
                <Sparkles aria-hidden />
                {heroCopy.primaryCta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </QuoteLauncher>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
            >
              <Link href={actions.caseStudies}>{heroCopy.secondaryCta}</Link>
            </Button>
          </div>
        </div>
        
      </Container>
      
      {/* Stats marquee - full width outside container */}
      <div 
        className={`absolute bottom-12 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/*
          Identical sets, each carrying the animation and its own trailing gap
          as pr-16. The gap used to sit on a flex parent that was itself the
          animated element, which made the halves unequal and left flex sizing
          that parent to the viewport rather than to its content, so the row
          restarted from zero on every loop instead of running on. See the
          note above @keyframes marquee in globals.css.

          Four sets rather than two because of how far the row travels. Each
          set is about 1653px wide now that heroStats carries five figures
          rather than four (150+ team members, added 24 August 2026; it was
          about 1370px at four) and the keyframe moves it its own width, so
          at the end of a cycle the content spans (N-1) sets to the right of
          the origin. Two sets leave a gap of empty space just before the loop
          resets - as visible as the jump this replaces. The rule is
          N >= viewport / set + 1; four covers displays up to about 4950px,
          which still clears 4K (3840px) with room to spare even at the wider
          set width.

          Every set after the first is aria-hidden: it is the same five
          figures again, and a screen reader should hear them once.
        */}
        <div className="marquee-track flex overflow-hidden">
          {[0, 1, 2, 3].map((setIndex) => (
            <div
              key={setIndex}
              aria-hidden={setIndex > 0}
              className="flex gap-16 pr-16 shrink-0 marquee whitespace-nowrap"
            >
              {heroStats.map((stat) => (
                <div key={`${stat.value}-${setIndex}`} className="flex items-baseline gap-4">
                  <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      
    </Section>
  );
}
