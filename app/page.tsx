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
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
