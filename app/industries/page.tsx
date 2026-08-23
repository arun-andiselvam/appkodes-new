import { pageMetadata } from "@/lib/seo";
import { SiloHub } from "@/components/sections/silo-hub";
import { AudiencesSection } from "@/components/sections/audiences";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Industries",
  /*
   * 160 characters, down from 182.
   *
   * The old one was over the budget in docs/seo-standards.md and was being cut
   * in results. It also listed six sectors inline, which the voice rules cut
   * to two, and the sixth of them was "agency production", written while the
   * marketing page still sold work at volume. That page argues the opposite
   * now, so the description was promising something no page behind it keeps.
   *
   * It leads on the argument the hub itself makes rather than reciting the
   * list underneath it, and closes on the action, which the old one never did.
   */
  description:
    "The constraint changes by trade. Retail worries about stock, healthcare about who sees a record, and the work follows the constraint. Book an automation review.",
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
