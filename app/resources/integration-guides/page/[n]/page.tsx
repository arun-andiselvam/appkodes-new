import { notFound } from "next/navigation";
import {
  resourceCategoryRoute,
  extraPageParams,
} from "@/lib/resource-category-route";

/*
 * Page two and beyond of this category.
 *
 * The folder is literally named `page`, which is allowed: only the `page.tsx`
 * file is a Next.js convention, a directory called page is just a URL segment.
 * So this renders /resources/integration-guides/page/2.
 *
 * `params` is a Promise in Next 16 and has to be awaited.
 */
const path = "/resources/integration-guides";

export async function generateStaticParams() {
  return extraPageParams(path);
}

/* Anything not returned by generateStaticParams is a 404 rather than a render. */
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

/**
 * "2" becomes 2. Anything else 404s.
 *
 * The guard matters because the segment is a string from a URL. "1" is
 * rejected on purpose: page one lives at the category's own path, and letting
 * /page/1 render would serve the same content at two URLs, which is the one
 * thing pagination must not do.
 */
function pageNumberFrom(n: string) {
  const parsed = Number(n);
  if (!Number.isInteger(parsed) || parsed < 2) notFound();
  return parsed;
}
