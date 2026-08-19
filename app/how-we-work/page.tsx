import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { AudiencesSection } from "@/components/landing/audiences-section";
import { SecuritySection } from "@/components/landing/security-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "The engagement in three steps, what it looks like at your size, and what we commit to in writing.",
};

/**
 * The engagement.
 *
 * Three steps first, then the same engagement told back at four company sizes,
 * since "two weeks to a costed plan" means something different to a two person
 * startup than to a three hundred person business. Security closes it because
 * the commitments row is part of what the engagement actually is.
 */
export default function HowWeWorkPage() {
  return (
    <main>
      <HowItWorksSection />
      <AudiencesSection />
      <SecuritySection />
      <CtaSection />
    </main>
  );
}
