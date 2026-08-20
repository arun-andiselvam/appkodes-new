import { pageMetadata } from "@/lib/seo";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { AudiencesSection } from "@/components/sections/audiences";
import { SecuritySection } from "@/components/sections/security";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "How we work",
  description:
    "The engagement in three steps, what it looks like at your size, and what we commit to in writing.",
  path: "/how-we-work",
});

/**
 * The engagement.
 *
 * Three steps first, then the same engagement told back at four company sizes,
 * since "two weeks to a costed plan" means something different to a two person
 * startup than to a three hundred person business. Security closes it because
 * the commitments row is part of what the engagement actually is.
 */
export default function HowWeWorkPage() {
  return (
    <main>
      <HowItWorksSection />
      <AudiencesSection />
      <SecuritySection />
      <CtaSection />
    </main>
  );
}
