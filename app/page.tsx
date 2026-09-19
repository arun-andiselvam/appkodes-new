import dynamic from "next/dynamic";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { HeroSection } from "@/components/sections/hero";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { ClientLogosSection } from "@/components/sections/client-logos";
import { SolutionsPreviewSection } from "@/components/sections/solutions-preview";
import { FeaturesSection } from "@/components/sections/features";
import { DeliveryReachSection } from "@/components/sections/delivery-reach";
import { MeetingsSection } from "@/components/sections/meetings";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { IntegrationsSection } from "@/components/sections/integrations";
import { IndustriesSection } from "@/components/sections/industries";
import { RecognitionSection } from "@/components/sections/recognition";
import { LatestPostsSection } from "@/components/sections/latest-posts";
import { TeamSection } from "@/components/sections/team";
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
  /* 18 September 2026: app development, no AI. Appkodes is the legacy app
     business and Hitasoft.com carries the AI work. The previous title was
     "AI Automation and AI Product Development". */
  title: `${site.name} - Mobile App and Web App Development`,
  description:
    "We build mobile apps, web apps and MVPs on a fixed price and a fixed launch date. 18 years and 1000+ businesses served.",
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
      {/*
        Rebuilt 18 September 2026 on appkodes.com's own section order: hero,
        track record, clients, solutions (platforms we have shipped, which
        replaced partnership models on 19 September per docs/positioning.md),
        what you get, globally
        delivered, process, platforms, industries, then proof, writing, team
        and the close. Results, Security and Audiences came off the page with
        the AI messaging they carried.
      */}
      <HeroSection />
      <InfrastructureSection />
      <ClientLogosSection />
      <SolutionsPreviewSection />
      <FeaturesSection />
      <DeliveryReachSection />
      <MeetingsSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <IndustriesSection />
      <TestimonialsSection showClients={false} />
      <RecognitionSection />
      <LatestPostsSection />
      <TeamSection />
      <CtaSection />
    </main>
  );
}
