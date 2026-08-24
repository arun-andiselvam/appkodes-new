import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { CareerDetail } from "@/components/sections/career-detail";
import { careerListings, careerBySlug } from "@/lib/careers";
import { siteOrigin } from "@/lib/site-url";

/**
 * One open position.
 *
 * `params` is a Promise in Next 16 and has to be awaited. Anything not in
 * generateStaticParams is a 404 rather than a render, same as
 * app/resources/case-studies/[slug]/page.tsx: a link to a role that has
 * since been unpublished fails loudly instead of rendering an empty page.
 */
export async function generateStaticParams() {
  return (await careerListings()).map((job) => ({ slug: job.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await careerBySlug(slug);
  if (!job) return {};

  return pageMetadata({
    title: job.title,
    description: job.summary,
    path: `/careers/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await careerBySlug(slug);
  if (!job) notFound();

  const origin = await siteOrigin();

  /*
   * !! NO JobPosting SCHEMA HERE YET, DELIBERATELY !!
   *
   * The obvious next step is schema.org JobPosting, which is what earns a
   * listing a place in Google for Jobs. It is not added because the fields
   * that make it valid do not exist yet: `validThrough` (a real closing
   * date, which the Job type has no field for) and a structured
   * `jobLocation` (city, region and country as separate properties, rather
   * than the free text `location` string this collects, which was chosen
   * so an editor can write "Remote" or "Hybrid - Chennai" without three
   * boxes to fill for a location that has no fixed address). A JobPosting
   * block missing required properties is exactly the kind of thing that
   * shows up as an error in Search Console rather than a rich result, so
   * shipping an incomplete one is worse than shipping none. Add the fields
   * to the Job type and the Strapi schema first, then this.
   *
   * BreadcrumbList is safe regardless, since it describes navigation rather
   * than a job's employment terms, and every property it needs already
   * exists.
   */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", href: "/" },
      { name: "Careers", href: "/careers" },
      { name: job.title, href: `/careers/${slug}` },
    ].map((crumb, i, all) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      // No `item` on the final crumb, which is the page itself.
      ...(i === all.length - 1 ? {} : { item: `${origin}${crumb.href}` }),
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <CareerDetail job={job} />
    </main>
  );
}
