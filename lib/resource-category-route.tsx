import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ResourceCategoryPage } from "@/components/sections/resource-category";
import { CtaSection } from "@/components/sections/cta";
import { resourceCategories } from "@/content/resources";
import { pageOfPostsIn } from "@/lib/posts";

/**
 * One blog category page, at a given page number.
 *
 * The sibling of lib/silo-route.tsx and the two landing route files, and the
 * same bargain: name a path, get metadata and a component back, so a copied
 * route file cannot carry somebody else's canonical URL.
 *
 * Page one lives at the category's own path. Page two and beyond live at
 * `<path>/page/<n>`, which is why this takes a number.
 */
export function resourceCategoryRoute(path: string, pageNumber = 1) {
  const category = resourceCategories[path];

  if (!category) {
    throw new Error(`No category for ${path}. Add it to content/resources.ts.`);
  }

  /*
   * Metadata for a paged archive.
   *
   * Two things differ after page one, and both matter.
   *
   * The canonical points at the page's own URL rather than back at page one.
   * Pointing every page at page one is a common instinct and it is wrong: it
   * tells Google the deeper pages are duplicates, and the posts only reachable
   * from them stop being discovered.
   *
   * robots is noindex, follow. The archive page itself is thin, carries no
   * unique writing, and rarely earns a link, so it does not belong in the
   * index. `follow` is the important half: every post on it still gets
   * crawled, and the links down into the service silos still pass equity,
   * which is the entire reason silo 7 exists in
   * docs/hitasoft_ai_architecture_strategy.md.
   *
   * The title gains the page number so two archive pages are not two entries
   * with one name in a browser history or a site search.
   */
  const paged = pageNumber > 1;
  const routePath = paged ? `${path}/page/${pageNumber}` : path;

  const metadata = {
    ...pageMetadata({
      title: paged ? `${category.metaTitle} - Page ${pageNumber}` : category.metaTitle,
      description: category.metaDescription,
      path: routePath,
    }),
    ...(paged ? { robots: { index: false, follow: true } } : {}),
  };

  return {
    metadata,
    Page: async function ResourceCategoryRoutePage() {
      /*
       * A page number past the end is a 404, not the last page.
       *
       * Serving the final page under /page/99 would mint an unlimited number
       * of URLs all showing the same posts, and anything that links to one of
       * them gets it crawled. pageOfPostsIn returns an empty list rather than
       * clamping precisely so this check is possible.
       *
       * Page one is exempt: an empty category is a real state, and it renders
       * the honest empty message rather than disappearing.
       */
      if (paged) {
        const { posts } = await pageOfPostsIn(path, pageNumber);
        if (posts.length === 0) notFound();
      }

      return (
        <main>
          <ResourceCategoryPage
            path={path}
            category={category}
            pageNumber={pageNumber}
          />
          <CtaSection />
        </main>
      );
    },
  };
}

/**
 * The page numbers after the first, for generateStaticParams.
 *
 * Returns [] when there is one page, so no /page/n route is built at all.
 */
export async function extraPageParams(path: string) {
  const { totalPages } = await pageOfPostsIn(path, 1);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}
