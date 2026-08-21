import { pageMetadata } from "@/lib/seo";
import { SiloHub } from "@/components/sections/silo-hub";
import { AudiencesSection } from "@/components/sections/audiences";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "Where we have put AI to work. Retail inventory, healthcare consultations, financial data, community platforms, e-learning and agency production, with the constraints each one brings.",
  path: "/industries",
});

/**
 * Silo 3.
 *
 * Six pages, not a claim to cover every sector. content/site.ts holds a
 * longer list for the home page section, and the gap between the two lists is
 * the honest state of it: those are industries we have delivered into, these
 * are the ones with something written about the work.
 *
 * The audiences tabs sit underneath because the question an industry page
 * provokes is about company size rather than sector. A twenty person retailer
 * and a three hundred person one read the same page and want different
 * answers.
 */
export default function IndustriesPage() {
  return (
    <main>
      <SiloHub
        path="/industries"
        eyebrow="Use cases"
        title="Where it has paid off."
        lede="The constraint changes by trade. Retail worries about cash tied up in stock, healthcare about who sees a record. The work follows the constraint."
      />
      <AudiencesSection />
      <CtaSection />
    </main>
  );
}
