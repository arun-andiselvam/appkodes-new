import { pageMetadata } from "@/lib/seo";
import { SiloHub } from "@/components/sections/silo-hub";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { SecuritySection } from "@/components/sections/security";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Two ways we work. AI put into the software you already run, and the repeat work in your operations handed to software.",
  path: "/services",
});

/**
 * The top of the service silo.
 *
 * It exists to send people down rather than to sell on its own, so the two
 * silos and their six pages come first and the argument comes after. The
 * process and the commitments close it, because both are true of either silo
 * and repeating them on the hub saves the reader guessing which one they apply
 * to.
 */
export default function ServicesPage() {
  return (
    <main>
      <SiloHub
        path="/services"
        eyebrow="What we do"
        title="Two ways in."
        lede="Most companies do not need new software. They need the software they have to do more, and the work around it to stop being done by hand."
      />
      <HowItWorksSection />
      <SecuritySection />
      <CtaSection />
    </main>
  );
}
