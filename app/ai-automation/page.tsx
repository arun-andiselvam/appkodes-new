import { pageMetadata } from "@/lib/seo";
import { FeaturesSection } from "@/components/sections/features";
import { IntegrationsSection } from "@/components/sections/integrations";
import { SecuritySection } from "@/components/sections/security";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "AI Automation",
  description:
    "What we automate, the models and stack we build with, and how your data is handled.",
  path: "/ai-automation",
});

/**
 * What we do, in full.
 *
 * Capabilities, then what they are built from, then how the client's data is
 * handled. Security sits on this page rather than a page of its own because
 * the question it answers only arrives once somebody knows a model is
 * involved, and it arrives immediately after.
 */
export default function AiAutomationPage() {
  return (
    <main>
      <FeaturesSection />
      <IntegrationsSection />
      <SecuritySection />
      <CtaSection />
    </main>
  );
}
