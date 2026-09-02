import dynamic from "next/dynamic";
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
import { RecognitionSection } from "@/components/sections/recognition";
import { DeliveryReachSection } from "@/components/sections/delivery-reach";
import { MeetingsSection } from "@/components/sections/meetings";
import { CtaSection } from "@/components/sections/cta";

/**
 * Loaded through next/dynamic, ssr left true, same reasoning as DeliveryMap
 * in delivery-reach.tsx: it is the second largest client bundle this page
 * ships (the carousel, the star ratings, the client logo strip), it is the
 * ninth section down, and a plain import makes React wait on all of that as
 * part of hydrating the hero above it. This page is the one PageSpeed was
 * actually run against, which is why the change is here and not also on
 * /resources/case-studies, the only other page that renders this section.
 */
const TestimonialsSection = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.TestimonialsSection),
);

export const metadata = pageMetadata({
  // The one page that leads with the company name. See lib/seo.ts.
  absoluteTitle: true,
  /* "AI Automation for Growing Businesses" until 2 September 2026. The title
     tag is the narrowest statement of what this company sells anywhere on the
     site and the first thing in a search result, and that one named only half
     of it. 51 characters, inside the ~60 a SERP shows. */
  title: `${site.name} - AI Automation and AI Product Development`,
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
