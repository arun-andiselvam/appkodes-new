"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { deliveryHubs, projectsHeadline } from "@/content/infrastructure";

export function InfrastructureSection() {
  const [activeHub, setActiveHub] = useState(0);
  const [sectionRef, isVisible] = useInView<HTMLElement>();
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHub((prev) => (prev + 1) % deliveryHubs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Track record
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              AI is new.
              <br />
              Shipping software is not.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              This is not our first change of technology. Our software runs in
              more than 50 countries, built by five offices across Asia and the
              Middle East. The people who shipped that work will build yours.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">{projectsHeadline}</div>
                <div className="text-sm text-muted-foreground">Projects delivered</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Clients worldwide</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Countries delivered to</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Where our clients are</span>
                <span className="text-xs font-mono text-muted-foreground">50+ countries</span>
              </div>

              {/* Locations */}
              <div>
                {deliveryHubs.map((hub, index) => (
                  <div
                    key={hub.region}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between gap-4 transition-all duration-300 ${
                      activeHub === index ? "bg-foreground/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeHub === index ? "bg-primary" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{hub.region}</div>
                        <div className="text-sm text-muted-foreground">{hub.markets}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm">{hub.projects}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">projects</div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
