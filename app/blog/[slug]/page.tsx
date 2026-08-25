import { postRoute } from "@/lib/post-route";

/*
 * One article, at /blog/<slug>.
 *
 * The only article route on the site since 25 August 2026. It replaced two
 * near identical files under /resources/<category>/[slug], which existed
 * only because the category used to be part of the URL. See the note on
 * postRoute in lib/post-route.tsx, and next.config.mjs for the redirects
 * that keep the old addresses working.
 */
const route = postRoute();

export const generateStaticParams = route.generateStaticParams;
export const dynamicParams = false;

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
