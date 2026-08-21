import { pageMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/sections/service-landing";
import { CtaSection } from "@/components/sections/cta";
import { serviceLandings } from "@/content/service-landings";
import { site } from "@/content/site";

/**
 * One long form service page, wired up from its path.
 *
 * The sibling of lib/silo-route.tsx, and the same bargain: the route file
 * names a path and gets its metadata and its component back, so a copied file
 * cannot carry somebody else's canonical URL.
 *
 * Throwing on an unknown path is deliberate, exactly as it is there. A route
 * pointing at content that does not exist is a typo, and it should stop the
 * build rather than render an empty page nobody notices until it is indexed.
 */
export function serviceLandingRoute(path: string) {
  const page = serviceLandings[path];

  if (!page) {
    throw new Error(
      `No long form content for ${path}. Add it to content/service-landings.ts.`,
    );
  }

  /*
   * FAQPage schema, which is the one thing the brief asks for that no
   * component can own. Rendering it inside the FAQ section would emit a script
   * tag per section instead of per page, and Google reads the first block it
   * finds. Building it from the same array the section renders means the
   * markup and the schema cannot drift apart.
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
   * Service, with the provider attached. This is the machine readable half of
   * the entity definition the GEO blueprint asks for: an answer engine looking
   * for "who does AI software integration" gets a typed answer rather than
   * having to infer one from the prose.
   *
   * `description` is page.summary.body verbatim, so the paragraph a reader
   * sees and the one a crawler reads cannot drift apart.
   *
   * areaServed lists the countries clients are already in. It said "where
   * offices already sit", which was false: there is no office in any of them,
   * confirmed 21 August 2026. The list itself is unchanged and correct, since
   * areaServed means where a service is offered rather than where the provider
   * is registered. Four codes for five locations, because Dubai and Sharjah
   * are both in the UAE.
   *
   * No client counts and no regional project splits, for the reason set out in
   * content/service-landings.ts.
   */
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.metaTitle,
    description: page.summary.body,
    serviceType: "AI software integration",
    url: `${site.url}${path}`,
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
    Page: function ServiceLandingRoutePage() {
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
          <ServiceLandingPage page={page} />
          <CtaSection />
        </main>
      );
    },
  };
}
