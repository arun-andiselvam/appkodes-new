"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { metrics } from "@/content/metrics";

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

  return (
    <div
      ref={ref}
      className="flex items-baseline gap-2 font-display tracking-tight tabular-nums text-5xl lg:text-6xl"
    >
      <span>
        {prefix}
        {count.toLocaleString()}
      </span>
      {suffix ? (
        <span className="text-xl lg:text-2xl text-muted-foreground">{suffix}</span>
      ) : null}
    </div>
  );
}

export function MetricsSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <section id="results" ref={sectionRef} className="relative py-20 lg:py-24 border-y border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              What you get back
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              What it saves,
              <br />
              in plain numbers.
            </h2>
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
      </div>
    </section>
  );
}
