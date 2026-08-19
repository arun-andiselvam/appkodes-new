import type { Metadata } from "next";
import { MetricsSection } from "@/components/landing/metrics-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { RecognitionSection } from "@/components/landing/recognition-section";
import { MeetingsSection } from "@/components/landing/meetings-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What the work returns, fifteen years of delivery behind it, and what clients say without us editing it.",
};

/**
 * The proof, in the order a sceptic asks for it.
 *
 * Numbers first, then the track record that makes them plausible, then people
 * who are not us saying so. Recognition and the meeting photographs close it,
 * because a badge and a face are the two things a table of figures cannot do.
 */
export default function ResultsPage() {
  return (
    <main>
      <MetricsSection />
      <InfrastructureSection />
      <TestimonialsSection />
      <RecognitionSection />
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
