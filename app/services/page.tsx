import { pageMetadata } from "@/lib/seo";
import { SiloHub } from "@/components/sections/silo-hub";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { SecuritySection } from "@/components/sections/security";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "AI put into the software you already run, the repeat work in your operations handed to software, and the products we build from nothing.",
  path: "/services",
});

/**
 * The top of the service silo.
 *
 * It exists to send people down rather than to sell on its own, so the silos
 * and their pages come first and the argument comes after. The process and the
 * commitments close it, because both are true of any of them and repeating
 * them on the hub saves the reader guessing which one they apply to.
 *
 * !! DO NOT PUT A COUNT BACK IN THE HEADING OR THE DESCRIPTION !!
 *
 * Both said "two" until 2 September 2026 while content/navigation.ts had five
 * top level groups under this path, so the page contradicted its own cards on
 * arrival. A number here has to be re-counted every time a silo is added and
 * it silently stops being true when nobody does. "Where to start." cannot go
 * stale, and the description now names what is on offer instead of tallying
 * it.
 */
export default function ServicesPage() {
  return (
    <main>
      <SiloHub
        path="/services"
        eyebrow="What we do"
        title="Where to start."
        lede="Most companies do not need new software, and we will tell you when that is you. When you do need something built, we build it properly."
      />
      <HowItWorksSection />
      <SecuritySection />
      <CtaSection />
    </main>
  );
}
