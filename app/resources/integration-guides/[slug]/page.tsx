import { postRoute } from "@/lib/post-route";

/*
 * One article in this category. Sibling of the same file under
 * cost-reduction-strategies, which carries the fuller note.
 */
const route = postRoute("/resources/integration-guides");

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
