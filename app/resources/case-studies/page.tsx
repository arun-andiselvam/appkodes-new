import { pageMetadata } from "@/lib/seo";
import { CaseStudiesIndex } from "@/components/sections/case-studies-index";
import { MetricsSection } from "@/components/sections/metrics";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { TestimonialsSection } from "@/components/sections/testimonials";
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
 * Rebuilt 21 August 2026 against a supplied reference. The written studies now
 * lead, under a row of real client marks, and what was already here follows:
 * the numbers, the track record that makes them plausible, then people who are
 * not us saying so. The meeting photographs close it, because a face is the
 * one thing a table of figures cannot do.
 *
 * !! THE SECTIONS BELOW THE INDEX ARE THE ONLY PART CURRENTLY BACKED !!
 *
 * The studies above them are invented placeholders behind a flag. See the
 * warnings in lib/case-studies.ts. Turn that flag off and the index says so in
 * one line, and these sections carry the page on their own, which is what they
 * did before and can do again.
 */
export default function CaseStudiesPage() {
  return (
    <main>
      <CaseStudiesIndex path="/resources/case-studies" />
      <MetricsSection />
      <InfrastructureSection />
      {/* The client marks already run in CaseStudiesIndex above, so the band
          this section normally closes with is turned off here. */}
      <TestimonialsSection showClients={false} />
      {/* RecognitionSection was here and came out on 21 August 2026. The
          awards are a claim about us, and this page is meant to be a claim
          about the work. It still runs on the home page, which is the right
          place for a badge. */}
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
