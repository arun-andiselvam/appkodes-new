import { postRoute } from "@/lib/post-route";

/*
 * One article in this category.
 *
 * `params` is a Promise in Next 16 and has to be awaited.
 *
 * This sits beside the static `page/[n]` folder. Next matches a literal
 * segment before a dynamic one, so /page/2 reaches the pager and everything
 * else reaches here.
 */
const route = postRoute("/resources/cost-reduction-strategies");

export const generateStaticParams = route.generateStaticParams;

/* Anything without a body has no slug in the list above, so it 404s. */
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
