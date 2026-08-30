import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { BlogIndex } from "@/components/sections/blog-index";
import { CtaSection } from "@/components/sections/cta";
import { pageOfAllPosts, BLOG_POSTS_PER_PAGE, allPosts } from "@/lib/posts";

/*
 * Page two and beyond of the full list.
 *
 * The folder is literally named `page`, which is allowed: only the `page.tsx`
 * file is a Next.js convention, a directory called page is just a URL
 * segment. So this renders /blog/page/2. Same shape as the category pagers in
 * app/resources/<category>/page/[n]/.
 */
export async function generateStaticParams() {
  const total = (await allPosts()).length;
  const totalPages = Math.max(1, Math.ceil(total / BLOG_POSTS_PER_PAGE));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

/* Anything not returned by generateStaticParams is a 404 rather than a render. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const pageNumber = pageNumberFrom(n);

  return {
    ...pageMetadata({
      title: `Blog - Page ${pageNumber}`,
      description:
        "Every guide we have written on putting AI into software you already run, and on what the repeat work in a growing company costs.",
      path: `/blog/page/${pageNumber}`,
    }),
    /*
     * noindex, follow, matching lib/resource-category-route.tsx. The archive
     * page itself is thin and carries no unique writing, so it does not belong
     * in the index. `follow` is the important half: every post on it still gets
     * crawled and still passes equity down the silo.
     */
    robots: { index: false, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const pageNumber = pageNumberFrom(n);

  /*
   * A page number past the end is a 404, not the last page. Serving the final
   * page under /page/99 would mint unlimited URLs all showing the same posts.
   */
  const { posts } = await pageOfAllPosts(pageNumber);
  if (posts.length === 0) notFound();

  return (
    <main>
      <BlogIndex pageNumber={pageNumber} />
      <CtaSection />
    </main>
  );
}

/**
 * "2" becomes 2. Anything else 404s.
 *
 * "1" is rejected on purpose: page one lives at /blog, and letting /page/1
 * render would serve the same content at two URLs, which is the one thing
 * pagination must not do.
 */
function pageNumberFrom(n: string) {
  const parsed = Number(n);
  if (!Number.isInteger(parsed) || parsed < 2) notFound();
  return parsed;
}
