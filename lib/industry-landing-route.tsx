import { pageMetadata } from "@/lib/seo";
import { IndustryLandingPage } from "@/components/sections/industry-landing";
import { CtaSection } from "@/components/sections/cta";
import { industryLandings } from "@/content/industry-landings";
import { site } from "@/content/site";

/**
 * One long form industry page, wired up from its path.
 *
 * The sibling of lib/service-landing-route.tsx and lib/silo-route.tsx, and the
 * same bargain: the route file names a path and gets its metadata and its
 * component back, so a copied file cannot carry somebody else's canonical URL.
 *
 * Throwing on an unknown path is deliberate, exactly as it is there. A route
 * pointing at content that does not exist is a typo, and it should stop the
 * build rather than render an empty page nobody notices until it is indexed.
 */
export function industryLandingRoute(path: string) {
  const page = industryLandings[path];

  if (!page) {
    throw new Error(
      `No long form content for ${path}. Add it to content/industry-landings.ts.`,
    );
  }

  /*
   * FAQPage, built from the same array the section renders. Rendering it
   * inside the FAQ section would emit a script tag per section instead of per
   * page, and Google reads the first block it finds.
   */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  /*
   * Service, with the provider and the audience attached.
   *
   * `audience` is the one field this schema carries that the service page's
   * does not, and it is the whole point of an industry page. An answer engine
   * asked "who does AI automation for fintech companies" gets a typed answer
   * rather than having to infer the sector from the prose.
   *
   * `description` is page.summary.body verbatim, so the paragraph a reader
   * sees and the one a crawler reads cannot drift apart.
   *
   * areaServed lists the countries clients are already in. No offices are
   * claimed anywhere: see the corrected verified facts list in
   * docs/positioning.md. Four codes for five locations, because Dubai and
   * Sharjah are both in the UAE.
   */
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.metaTitle,
    description: page.summary.body,
    serviceType: "AI automation",
    url: `${site.url}${path}`,
    audience: {
      "@type": "Audience",
      audienceType: page.audience,
    },
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      foundingDate: "2008",
    },
    areaServed: ["IN", "ID", "AE", "VN"].map((code) => ({
      "@type": "Country",
      identifier: code,
    })),
  };

  return {
    metadata: pageMetadata({
      title: page.metaTitle,
      description: page.metaDescription,
      path,
    }),
    Page: function IndustryLandingRoutePage() {
      return (
        <main>
          {/*
            One script per schema type rather than one combined graph. Both are
            valid, and separate blocks are easier to read in a rich result test
            when one of them is rejected.
          */}
          {[serviceSchema, faqSchema].map((schema) => (
            <script
              key={schema["@type"]}
              type="application/ld+json"
              // The content is ours rather than a visitor's, and JSON.stringify
              // escapes the quotes. The `<` guard covers the one case that would
              // still break out of the tag if a string ever contained markup.
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
              }}
            />
          ))}
          <IndustryLandingPage page={page} />
          <CtaSection />
        </main>
      );
    },
  };
}
