import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { MetricsSection } from "@/components/sections/metrics";
import { IntegrationsSection } from "@/components/sections/integrations";
import { SecuritySection } from "@/components/sections/security";
import { AudiencesSection } from "@/components/sections/audiences";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { RecognitionSection } from "@/components/sections/recognition";
import { DeliveryReachSection } from "@/components/sections/delivery-reach";
import { MeetingsSection } from "@/components/sections/meetings";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  // The one page that leads with the company name. See lib/seo.ts.
  absoluteTitle: true,
  title: `${site.name} - AI Automation for Growing Businesses`,
  description:
    "We put AI into the systems you already run, or build the replacement, so your team spends less time on work software should be doing.",
  path: "/",
});

/**
 * !! THE MAP SITS DIRECTLY ABOVE THE PHOTOGRAPHS, ON PURPOSE !!
 *
 * DeliveryReachSection was written for /how-we-work and its own comment used
 * to explain why it belonged there rather than here. The client asked for it
 * on the home page as well on 24 August 2026, so both pages draw it.
 *
 * This slot is the reason it works twice. The hero stats row opens the page
 * with "50+ countries delivered to", which a reader discounts the way anybody
 * discounts a rounded figure. The map is that same claim with the countries
 * named, and the photographs under it are four of those places with the team
 * actually in the room. Claim, then plot, then people.
 *
 * It would have been wrong between Recognition and Testimonials, which are
 * both about what other people say, and wrong under Track record, which is
 * eighteen years rather than geography.
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SecuritySection />
      <AudiencesSection />
      <TestimonialsSection />
      <RecognitionSection />
      <DeliveryReachSection />
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
