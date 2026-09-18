"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { steps } from "@/content/how-it-works";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { SectionTitle } from "@/components/primitives/section-title";

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sectionRef, isVisible] = useInView<HTMLDivElement>();

  // `sectionRef` above latches true on first sight, for the entrance
  // transition, so it can't also answer "is this on screen right now". This
  // second observer keeps reporting, which the rotation needs — the same
  // split AudiencesSection uses for its own panel.
  const [panelRef, panelInView] = useInView<HTMLDivElement>({ once: false, threshold: 0.1 });
  const reducedMotion = useReducedMotion();
  const rotating = panelInView && !reducedMotion;

  // The steps advance on their own, which is fine until someone is halfway
  // through reading one. Hovering or focusing anywhere in the section holds
  // the current step until they move away. Scrolling it out of view or
  // asking for reduced motion holds it too.
  useEffect(() => {
    if (!rotating || isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [rotating, isPaused]);

  return (
    <Section
      id="how-it-works"
      ref={sectionRef}
      className="bg-emphasis text-emphasis-foreground overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      <Container ref={panelRef} className="relative z-10">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-emphasis-foreground/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            Process
          </span>
          <SectionTitle
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Your idea on day one.
            <br />
            <span className="text-emphasis-foreground/50">Your app in the stores by day thirty.</span>
          </SectionTitle>
        </div>

        {/* Main content */}
        <div
          className="grid lg:grid-cols-2 gap-16 lg:gap-24"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`relative w-full text-left py-8 transition-all duration-500 group ${
                  activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-emphasis-foreground/30">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">
                      {step.title}
                    </h3>
                    <p className="text-emphasis-foreground/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/*
                  The separator doubles as the progress track, rather than a
                  plain border with a second, shorter bar inset under the
                  text above it — the same one-line-does-both-jobs technique
                  AudiencesSection's tab underline uses. Three states, never
                  two at once: rotating fills the full-width track over the
                  hold time, active-but-not-rotating (paused, scrolled out of
                  view, or reduced motion) gets a plain accent line instead of
                  a bar that fills and then does nothing, and every other row
                  keeps the plain hairline the border used to draw.
                */}
                {activeStep === index ? (
                  rotating ? (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-background/20 overflow-hidden">
                      <span
                        key={`${step.number}-${activeStep}`}
                        className="block h-full w-0 bg-emphasis-accent"
                        style={{
                          animation: "step-progress 5s linear forwards",
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                      />
                    </span>
                  ) : (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-emphasis-accent" />
                  )
                ) : (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-background/10" />
                )}
              </button>
            ))}
          </div>

          {/*
            Numbered rows rather than a fake terminal. Each line is one thing
            that happens in the step, so the panel reads as a checklist the
            client can hold us to.
          */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-background/10 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-background/10">
                <span className="text-xs font-mono text-emphasis-foreground/40">
                  {steps[activeStep].panelLabel}
                </span>
              </div>

              <div>
                {steps[activeStep].output.split('\n').map((line, lineIndex) => (
                  <div
                    key={`${activeStep}-${lineIndex}`}
                    className="flex items-center gap-6 px-6 py-6 border-b border-background/10 last:border-b-0 code-line-reveal"
                    style={{ animationDelay: `${lineIndex * 90}ms` }}
                  >
                    <span className="font-mono text-sm text-emphasis-accent shrink-0">
                      {String(lineIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg lg:text-xl text-emphasis-foreground/90">
                      {line}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-background/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emphasis-accent" />
                <span className="text-xs font-mono text-emphasis-foreground/40">
                  {steps[activeStep].duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

    </Section>
  );
}
