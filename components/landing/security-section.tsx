"use client";

import { useInView } from "@/hooks/use-in-view";
import { securityFeatures, commitments, commitmentsLabel } from "@/content/security";

export function SecuritySection() {
    const [sectionRef, isVisible] = useInView<HTMLElement>();
  return (
    <section id="security" ref={sectionRef} className="relative py-24 lg:py-32 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Security
            </span>
            {/*
              "Trust is non-negotiable" is a sentence any company could run
              above any content. This one names the control the buyer actually
              holds, and it stays true whether the model runs on our hardware
              or theirs.
            */}
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              You decide what
              <br />
              the model sees.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Most AI projects hand your data to somebody else. We start from what the
              work actually needs to see. Sometimes that is nothing at all, because the
              model runs on a machine you already own.
            </p>

            {/*
              This row used to read SOC 2, ISO 27001, HIPAA, GDPR, CCPA. None of
              it was ours to claim. The label is load bearing now: five short
              tags in a security section read as badges unless something says
              otherwise, and that misreading is the whole reason the old row had
              to go.
            */}
            <div>
              <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                {commitmentsLabel}
              </span>
              <div className="flex flex-wrap gap-3">
                {commitments.map((commitment, index) => (
                  <span
                    key={commitment}
                    className={`px-4 py-2 border border-foreground/10 text-sm font-mono transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 50 + 200}ms` }}
                  >
                    {commitment}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Features */}
          <div className="grid gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
