import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { CaseStudyPage } from "@/components/sections/case-study";
import { CtaSection } from "@/components/sections/cta";
import { caseStudies, caseStudyBySlug, relatedCaseStudies } from "@/lib/case-studies";
import { site } from "@/content/site";

/**
 * One case study.
 *
 * `params` is a Promise in Next 16 and has to be awaited. Anything not in
 * generateStaticParams is a 404 rather than a render, so a link to a study
 * that was pulled fails loudly instead of rendering an empty page.
 */
export async function generateStaticParams() {
  return (await caseStudies()).map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await caseStudyBySlug(slug);
  if (!study) return {};

  return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/resources/case-studies/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await caseStudyBySlug(slug);
  if (!study) notFound();

  const related = await relatedCaseStudies(slug);

  /*
   * Article rather than a made up type. schema.org has no CaseStudy, and
   * inventing one gets the block ignored.
   *
   * !! NO aggregateRating AND NO REVIEW SCHEMA HERE !!
   *
   * The obvious next step is marking the client quote up as a Review with a
   * rating, which would put stars in the search result. It is also the fastest
   * way to earn a manual action, because the quote is testimonial copy on our
   * own page rather than a reviewed product. Real reviews already exist on
   * Trustpilot where they belong.
   *
   * `about` names the client as an Organization, which is the honest way to
   * say who the work was for without claiming anything about them.
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    url: `${site.url}/resources/case-studies/${slug}`,
    image: `${site.url}${study.image}`,
    about: { "@type": "Organization", name: study.client },
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", href: "/" },
      { name: "Resources", href: "/resources" },
      { name: "Case studies", href: "/resources/case-studies" },
      { name: study.title, href: `/resources/case-studies/${slug}` },
    ].map((crumb, i, all) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      // No `item` on the final crumb, which is the page itself.
      ...(i === all.length - 1 ? {} : { item: `${site.url}${crumb.href}` }),
    })),
  };

  return (
    <main>
      {[schema, breadcrumbSchema].map((block) => (
        <script
          key={block["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <CaseStudyPage study={study} related={related} />
      <CtaSection />
    </main>
  );
}
