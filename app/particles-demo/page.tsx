"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticlesDrift } from "@/components/backgrounds/particles-drift";
import { ParticlesNetwork } from "@/components/backgrounds/particles-network";
import { ParticlesField } from "@/components/backgrounds/particles-field";
import { AuroraMesh } from "@/components/backgrounds/aurora-mesh";
import { DotMatrix } from "@/components/backgrounds/dot-matrix";
import { FlowLines } from "@/components/backgrounds/flow-lines";
import { PerspectiveGrid } from "@/components/backgrounds/perspective-grid";
import { AnimatedSphere } from "@/components/landing/animated-sphere";

const options = [
  {
    id: "aurora",
    name: "Aurora",
    note: "Soft drifting light in the brand palette. No dots at all \u2014 reads as atmosphere.",
    render: () => <AuroraMesh />,
  },
  {
    id: "matrix",
    name: "Dot matrix",
    note: "Precise dot grid with a travelling wave; the cursor lifts nearby dots into brand blue.",
    render: () => <DotMatrix />,
  },
  {
    id: "flow",
    name: "Flow lines",
    note: "Layered sine ribbons drifting sideways. Motion without particles.",
    render: () => <FlowLines />,
  },
  {
    id: "grid3d",
    name: "Perspective grid",
    note: "Architectural grid plane running to a horizon \u2014 closest to the \"modular grid\" language.",
    render: () => <PerspectiveGrid />,
  },
  {
    id: "drift",
    name: "Drifting dots",
    note: "Floating particles with mouse parallax. Quietest of the three.",
    render: () => <ParticlesDrift density={110} />,
  },
  {
    id: "network",
    name: "Constellation network",
    note: "Nodes link to nearby neighbours; the cursor pushes them apart.",
    render: () => <ParticlesNetwork density={80} />,
  },
  {
    id: "field",
    name: "Depth field",
    note: "3D particles flying toward the viewer. A slice picks up the brand blue.",
    render: () => <ParticlesField count={520} />,
  },
  {
    id: "current",
    name: "Current (ASCII sphere)",
    note: "What the hero uses today, for comparison.",
    render: () => (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40">
        <AnimatedSphere />
      </div>
    ),
  },
];

export default function ParticlesDemo() {
  const [active, setActive] = useState(0);
  const option = options[active];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* background under test */}
      <div className="absolute inset-0 pointer-events-none">{option.render()}</div>

      {/* the hero's own grid, so the comparison is fair */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div key={`h-${i}`} className="absolute h-px bg-foreground/10" style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }} />
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`v-${i}`} className="absolute w-px bg-foreground/10" style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }} />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-6 lg:px-12 py-6">
          <span className="font-mono text-sm text-muted-foreground">particle background demo</span>
          <ThemeToggle />
        </header>

        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            The platform for modern teams
          </span>
          <h1 className="text-[clamp(2.5rem,9vw,7rem)] font-display leading-[0.9] tracking-tight mb-12">
            <span className="block">The platform</span>
            <span className="block">to scale</span>
          </h1>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-full group">
              Start free trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5">
              Watch demo
            </Button>
          </div>
        </div>

        {/* switcher */}
        <div className="px-6 lg:px-12 pb-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {options.map((o, i) => (
              <button
                key={o.id}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 text-sm rounded-full border transition-all ${
                  i === active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-foreground/20 text-foreground/70 hover:border-foreground hover:text-foreground"
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-mono">{option.note}</p>
        </div>
      </div>
    </main>
  );
}
