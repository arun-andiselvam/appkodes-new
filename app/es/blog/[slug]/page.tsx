import { postRoute } from "@/lib/post-route";

/*
 * One Spanish article, at /es/blog/<slug>.
 *
 * Added 14 September 2026. The Spanish version of a post in Strapi, served
 * through the same postRoute as app/blog/[slug], so the two languages are
 * built identically. Only the blog is translated; there is no /es home page.
 *
 * dynamicParams is true for the reason given in app/blog/[slug]/page.tsx: a
 * translation published after a deploy must not 404 until the next one.
 */
const route = postRoute("es");

export const generateStaticParams = route.generateStaticParams;

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return route.generateMetadata(slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return route.Page(slug);
}
