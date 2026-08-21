import { pageMetadata } from "@/lib/seo";
import { SiloHub } from "@/components/sections/silo-hub";
import { CtaSection } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "Guides on putting AI into software you already run, what it costs to automate, and what the engagements returned.",
  path: "/resources",
});

/**
 * The top of the funnel.
 *
 * Three categories, one of which is the proof the site already had. The other
 * two hold nothing yet and say so on their own pages, so this hub does not
 * have to apologise for them here.
 */
export default function ResourcesPage() {
  return (
    <main>
      <SiloHub
        path="/resources"
        eyebrow="Reading"
        title="How it is done, and what it returned."
        lede="Guides for whoever has to approve the work, and the record of what the work has been worth to people who paid for it."
      />
      <CtaSection />
    </main>
  );
}
