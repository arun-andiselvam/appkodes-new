import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { PostCard } from "@/components/sections/resource-category";
import { pageOfAllPosts } from "@/lib/posts";

/**
 * Every post, in one paginated list.
 *
 * Added 25 August 2026 at the client's request, as the destination for the
 * Resources menu's footer strip.
 *
 * !! THIS DOES NOT REPLACE THE CATEGORY PAGES, AND MUST NOT !!
 *
 * /resources/integration-guides and /resources/cost-reduction-strategies each
 * carry a `pillar` passage written to rank for that category's own term, and
 * the whole silo in docs/hitasoft_ai_architecture_strategy.md depends on them
 * existing as pages a reader can land on from search. This is the other
 * reader: the one who wants everything in the order it was written rather
 * than the one who arrived on a subject.
 *
 * So this page deliberately carries no pillar passage of its own. A third
 * block of prose about "AI guides in general" would compete with the two
 * category pages for the same terms, which is the exact self-competition the
 * silo exists to avoid. It is a list, it says so, and it sends the reader to
 * a category or a post.
 *
 * It reuses PostCard from resource-category.tsx rather than restating the
 * markup, so a change to how a post looks in a list happens once.
 */
export async function BlogIndex({ pageNumber = 1 }: { pageNumber?: number }) {
  const { posts, total, totalPages } = await pageOfAllPosts(pageNumber);

  return (
    <Section spacing="none" className="pt-24 lg:pt-28 pb-20 lg:pb-28">
      <Container>
        <Breadcrumbs path="/blog" />
        <Eyebrow className="mb-6">Writing</Eyebrow>
        <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
          Everything we have written.
        </h1>
        <p className="mt-8 max-w-2xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
          Guides on putting AI into software that already exists, and on what
          the repeat work in a growing company is costing before anybody
          automates it.
        </p>

        <div className="mt-16">
          {posts.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between gap-4 pb-2">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {pageNumber > 1 ? `Page ${pageNumber}` : "Latest"}
                </h2>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {total} {total === 1 ? "piece" : "pieces"}
                </span>
              </div>
              <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </ul>
              <Pagination base="/blog" current={pageNumber} totalPages={totalPages} />
            </>
          ) : (
            /* Same honest empty state the category pages use. See the note on
               EmptyState in components/sections/resource-category.tsx. */
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Nothing is published yet.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
