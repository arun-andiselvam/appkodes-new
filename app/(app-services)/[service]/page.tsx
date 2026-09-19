import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { appServices, appServiceBySlug } from "@/content/app-services";
import { AppServicePage, appServiceSchema } from "@/components/sections/app-service-page";

/**
 * Appkodes service pages at the root, on appkodes.com's existing slugs
 * (e.g. /food-delivery-app-development-company), so each page keeps the
 * search ranking it already has (docs/positioning.md, section 12).
 *
 * Only slugs listed in content/app-services.ts exist; anything else at the
 * root falls through to the 404 rather than rendering an empty template.
 * Static routes such as /blog and /contact always win over this segment.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return appServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = appServiceBySlug(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: service.metaDescription,
    path: `/${service.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = appServiceBySlug(slug);
  if (!service) notFound();

  const schema = appServiceSchema(service, `${site.url}/${service.slug}`);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <AppServicePage service={service} />
    </>
  );
}
