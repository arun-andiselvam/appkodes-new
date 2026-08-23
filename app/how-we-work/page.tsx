import { pageMetadata } from "@/lib/seo";
import { HowWeWorkPage, HowWeWorkFaqs } from "@/components/sections/how-we-work";
import { DeliveryReachSection } from "@/components/sections/delivery-reach";
import { CtaSection } from "@/components/sections/cta";
import { cta, faqs, meta } from "@/content/how-we-work";

export const metadata = pageMetadata({
  title: meta.metaTitle,
  description: meta.metaDescription,
  path: "/how-we-work",
});

/**
 * The engagement, written as a page of its own.
 *
 * It was five imported sections, four of which the home page also renders:
 * the three step process, the audience tabs, the security cards and the
 * closing panel. See the note at the top of content/how-we-work.ts for what
 * changed and why, and components/sections/how-we-work.tsx for how it draws.
 *
 * !! THE MAP SITS BETWEEN THE GUARANTEES AND THE QUESTIONS !!
 *
 * That is the one piece of the old page written for this one, and the client
 * asked for it to stay. The placement is the argument. The reader has just
 * been told what we commit to, and the map is the evidence those commitments
 * have travelled. It is also the only picture on a long page of prose, so it
 * breaks the scroll at about the right point.
 *
 * !! NO Service SCHEMA, AND NO HowTo EITHER !!
 *
 * docs/seo-standards.md types a page by what it is. This is not a service, so
 * `Service` would be a second entity competing with the twenty pages that
 * genuinely are one. `HowTo` was the other candidate and was declined on
 * meaning rather than on value: it marks up instructions a reader carries out
 * themselves, and these four phases are what we do. Google also retired the
 * HowTo rich result in 2023, so the trade would have been misleading markup
 * for nothing.
 *
 * `FAQPage` it is, built from the same array the section renders so the markup
 * and the schema cannot drift apart. There is no `BreadcrumbList`, because
 * this is a top level path and the standard asks for one below the top level.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        // Our own copy, and JSON.stringify escapes the quotes. The `<` guard
        // covers the one character that could still close the tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <HowWeWorkPage />
      <DeliveryReachSection />
      <HowWeWorkFaqs />
      <CtaSection copy={cta} />
    </main>
  );
}
