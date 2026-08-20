"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { metrics } from "@/content/metrics";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * Counts up once the tile is on screen.
 *
 * Math.round rather than Math.floor because the figures here are small now.
 * With floor and a cubic ease, a target of 2 sat on "1" for most of the run
 * and read as a stuck component. Rounding reaches the target early enough to
 * look deliberate.
 */
function AnimatedCounter({
  end,
  suffix,
  prefix,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;

    const duration = 1400;
    const startTime = performance.now();
    let frame = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, inView]);

  // A percent sign sets tight against its numeral. A word like "hrs" needs
  // the space, so the gap belongs on the suffix rather than on the flex.
  const tightSuffix = suffix === "%";

  return (
    <div
      ref={ref}
      className="flex items-baseline font-display tracking-tight tabular-nums text-5xl lg:text-6xl"
    >
      <span>
        {prefix}
        {count.toLocaleString()}
      </span>
      {suffix ? (
        <span
          className={`text-xl lg:text-2xl text-muted-foreground ${tightSuffix ? "" : "ml-2"}`}
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function MetricsSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <Section id="results" ref={sectionRef} spacing="tight" className="border-y border-foreground/10">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <Eyebrow className="mb-4">
              What you get back
            </Eyebrow>
            <SectionTitle
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              What it saves,
              <br />
              in plain numbers.
            </SectionTitle>
          </div>
          {/*
            A pulsing green dot and a running clock used to sit here, selling
            the section as a live feed. Nothing was live and the clock was the
            visitor's own. The method note is true and it answers the fear that
            an AI project stops mattering the day it ships.
          */}
          <div className="font-mono text-sm text-muted-foreground lg:text-right">
            Measured after go live, not at launch
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-background p-6 lg:p-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter end={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              <div className="mt-3 text-base lg:text-lg leading-snug">{metric.label}</div>
              {metric.detail ? (
                <div className="mt-1.5 text-sm text-muted-foreground leading-snug">{metric.detail}</div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
