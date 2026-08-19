import type { Metadata } from "next";
import { FeaturesSection } from "@/components/landing/features-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { SecuritySection } from "@/components/landing/security-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "AI Automation",
  description:
    "What we automate, the models and stack we build with, and how your data is handled.",
};

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
