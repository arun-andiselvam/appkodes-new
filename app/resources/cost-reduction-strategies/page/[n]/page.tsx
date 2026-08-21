import { notFound } from "next/navigation";
import {
  resourceCategoryRoute,
  extraPageParams,
} from "@/lib/resource-category-route";

/*
 * Page two and beyond of this category. Sibling of the same file under
 * integration-guides, which carries the fuller explanation.
 */
const path = "/resources/cost-reduction-strategies";

export async function generateStaticParams() {
  return extraPageParams(path);
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  return resourceCategoryRoute(path, pageNumberFrom(n)).metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const route = resourceCategoryRoute(path, pageNumberFrom(n));
  return <route.Page />;
}

/** "2" becomes 2. Page one lives at the category path, so 1 and below 404. */
function pageNumberFrom(n: string) {
  const parsed = Number(n);
  if (!Number.isInteger(parsed) || parsed < 2) notFound();
  return parsed;
}
