"use client";

import { useInView } from "@/hooks/use-in-view";
import { securityFeatures, commitments, commitmentsLabel } from "@/content/security";

/**
 * Header, then proof, then what we will sign.
 *
 * This was a left and right split, which worked while the right column held
 * four cards. Going to six broke it. The left column ran out at the chip row
 * and the right kept going for another four hundred pixels, so the section
 * ended on a large empty rectangle.
 *
 * Making the left column sticky would have hidden that, and it would still
 * have left six items stacked in a narrow column with the section running past
 * a thousand pixels. Security content has to scan quickly. Three across in two
 * rows halves the height and the imbalance cannot come back, whatever the card
 * count does next.
 *
 * The commitments moved from beside the headline to a band under the cards,
 * which reads better than it did tucked in a corner. Statement, then proof,
 * then the part that goes in the contract.
 */
export function SecuritySection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <section
      id="security"
      ref={sectionRef}
      className="relative py-20 lg:py-24 bg-foreground/[0.02] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`max-w-3xl mb-14 lg:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Security
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
            You decide what
            <br />
            the model sees.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Most AI projects hand your data to somebody else. We start from what the
            work actually needs to see. Sometimes that is nothing at all, because the
            model runs on a machine you already own.
          </p>
        </div>

        {/*
          A hairline grid rather than six separately bordered boxes. The six
          read as one wall of commitments that way, and it matches how the
          results figures are set. Cards sit on the page background, which the
          section tint lifts them off.
        */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-background p-8 transition-all duration-500 group hover:bg-foreground/[0.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-10 h-10 mb-6 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/*
          This row used to read SOC 2, ISO 27001, HIPAA, GDPR, CCPA. None of it
          was ours to claim. The label is load bearing: short tags in a security
          section read as badges unless something says otherwise, and that
          misreading is the whole reason the old row had to go.
        */}
        <div
          className={`mt-14 lg:mt-16 pt-10 border-t border-foreground/10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <span className="shrink-0 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {commitmentsLabel}
          </span>
          <div className="flex flex-wrap gap-3">
            {commitments.map((commitment) => (
              <span
                key={commitment}
                className="px-4 py-2 border border-foreground/10 text-sm font-mono"
              >
                {commitment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
