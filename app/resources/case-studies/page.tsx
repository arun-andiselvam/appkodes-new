import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MetricsSection } from "@/components/sections/metrics";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { RecognitionSection } from "@/components/sections/recognition";
import { MeetingsSection } from "@/components/sections/meetings";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Case studies",
  description:
    "What the work returns, eighteen years of delivery behind it, and what clients say without us editing it.",
  path: "/resources/case-studies",
});

/**
 * The proof, in the order a sceptic asks for it.
 *
 * This was /results, then /case-studies for about an hour, and it settled here
 * on 20 August 2026. The strategy files case studies as a resource rather than
 * a menu item of its own, and a reader who wants proof is at the same stage as
 * one who wants a guide. Both old URLs redirect; see next.config.mjs.
 *
 * Numbers first, then the track record that makes them plausible, then people
 * who are not us saying so. Recognition and the meeting photographs close it,
 * because a badge and a face are the two things a table of figures cannot do.
 *
 * !! NOT YET WHAT THE NAME PROMISES !!
 *
 * A case studies page should carry named engagements. A problem, what was
 * built, what changed. There are none written up, so this is the proof the
 * site already had under a better URL. Write the first three and they go above
 * the metrics, not below them.
 */
export default function CaseStudiesPage() {
  return (
    <main>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-4">
        <Container>
          <Breadcrumbs path="/resources/case-studies" />
          <Eyebrow className="mb-6">Case studies</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            What the work returned.
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Eighteen years of delivery, the figures behind it, and clients
            saying so in their own words rather than ours.
          </p>
        </Container>
      </Section>

      <MetricsSection />
      <InfrastructureSection />
      <TestimonialsSection />
      <RecognitionSection />
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
