import { pageMetadata } from "@/lib/seo";
import { SiloPage } from "@/components/sections/silo-page";
import { CtaSection } from "@/components/sections/cta";
import { servicePages } from "@/content/services";
import { industryPages } from "@/content/industries";

/**
 * One silo landing page, wired up from its path.
 *
 * Eleven routes render the same component around different copy. Written by
 * hand each of those is a metadata block, an import list and a default export,
 * and the metadata block is where a copied file keeps somebody else's
 * canonical URL. This takes the path and returns both.
 *
 * Throwing on an unknown path is deliberate. A route file naming a page that
 * is not in the content is a typo, and it should stop the build rather than
 * render an empty page nobody notices until it is indexed.
 */
export function siloRoute(path: string) {
  const page = servicePages[path] ?? industryPages[path];

  if (!page) {
    throw new Error(
      `No content for ${path}. Add it to content/services.ts or content/industries.ts.`,
    );
  }

  return {
    metadata: pageMetadata({
      title: page.metaTitle,
      description: page.metaDescription,
      path,
    }),
    Page: function SiloRoutePage() {
      return (
        <main>
          <SiloPage page={page} path={path} />
          <CtaSection />
        </main>
      );
    },
  };
}
