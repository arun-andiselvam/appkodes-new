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

/**
 * !! true, AND IT HAS TO BE. false MEANT A REDEPLOY PER ARTICLE !!
 *
 * generateStaticParams runs at build time, so with dynamicParams false the
 * only articles this route would serve are the ones that existed when the
 * container was built. The first post published from the content tool after
 * a deploy returned 404 on 26 August 2026, and every post after it would
 * have done the same until somebody redeployed. On a CMS backed blog that is
 * the whole point defeated.
 *
 * The guard it was providing is redundant anyway. postRoute's Page calls
 * postBySlug and notFound() when nothing matches, so an unknown slug is a
 * 404 either way. All false added was a second, worse reason to 404: the
 * article exists and is published, but the build predates it.
 *
 * The slugs that did exist at build time are still prerendered by
 * generateStaticParams above. Anything newer renders on demand.
 */
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
