"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroBackdrop } from "@/components/backgrounds/hero-backdrop";
import { actions, heroWords as words, heroStats, heroCopy, site } from "@/content/site";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";

export function HeroSection() {
  // The entrance animation has to start from its "before" state so the server
  // and the first client render agree. It runs the moment React takes over.
  const isVisible = useHydrated();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section spacing="none" className="min-h-screen flex flex-col justify-center overflow-hidden">
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
        
        {/* Main headline */}
        <div className="mb-12">
          <h1 
            className={`text-[clamp(2.5rem,9vw,7rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
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
              <Link href={actions.book}>
                {heroCopy.primaryCta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
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
          set is about 1370px wide and the keyframe moves it its own width, so
          at the end of a cycle the content spans (N-1) sets to the right of
          the origin. Two sets leave the last 68px of a 1440px viewport empty
          just before the loop resets - a gap that is exactly as visible as
          the jump this replaces. The rule is N >= viewport / set + 1; four
          covers displays up to about 4100px, which takes in 4K.

          Every set after the first is aria-hidden: it is the same four
          figures again, and a screen reader should hear them once.
        */}
        <div className="flex overflow-hidden">
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
