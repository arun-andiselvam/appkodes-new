import { pageMetadata } from "@/lib/seo";
import { MetricsSection } from "@/components/sections/metrics";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { RecognitionSection } from "@/components/sections/recognition";
import { MeetingsSection } from "@/components/sections/meetings";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Results",
  description:
    "What the work returns, fifteen years of delivery behind it, and what clients say without us editing it.",
  path: "/results",
});

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
