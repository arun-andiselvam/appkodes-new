import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PostPage } from "@/components/sections/post";
import { CtaSection } from "@/components/sections/cta";
import { postBySlug, postsWithBody, relatedPosts } from "@/lib/posts";
import { site } from "@/content/site";

/**
 * One article, wired up from its category and slug.
 *
 * Both category routes call this, so an article renders and reports itself the
 * same way whichever silo it sits in.
 */
export function postRoute(category: string) {
  return {
    /**
     * The slugs this category can render.
     *
     * Reads postsWithBody rather than every post, so a draft with no body
     * never gets a URL. Paired with dynamicParams false in the route file,
     * anything else is a 404 rather than an empty article.
     */
    async generateStaticParams() {
      const posts = await postsWithBody();
      return posts
        .filter((post) => post.category === category)
        .map((post) => ({ slug: post.slug }));
    },

    async generateMetadata(slug: string) {
      const post = await postBySlug(category, slug);
      if (!post) return {};

      return pageMetadata({
        title: post.title,
        description: post.excerpt,
        path: `${category}/${slug}`,
      });
    },

    async Page(slug: string) {
      const post = await postBySlug(category, slug);
      if (!post) notFound();

      const related = await relatedPosts(category, slug);

      /*
       * BlogPosting, not Article.
       *
       * Both are valid and BlogPosting is the narrower of the two, which is
       * what a piece in a dated category actually is. dateModified falls back
       * to dateePublished because omitting it entirely reads to a crawler as
       * "never revised", which is a different claim from "not revised since
       * publication".
       *
       * !! NO speakable AND NO aggregateRating !!
       *
       * Neither is earned here. speakable needs the page to be written for
       * voice reading, and a rating on an article is the fastest route to a
       * manual action.
       */
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `${site.url}${category}/${slug}`,
        ...(post.image ? { image: `${site.url}${post.image}` } : {}),
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        // Counts every block kind. Written as a switch rather than a "text" in
        // block check, because that silently returned zero for tables and
        // figures the moment those were added.
        wordCount: (post.body ?? []).reduce((total, block) => {
          switch (block.kind) {
            case "list":
              return total + block.items.join(" ").split(/\s+/).length;
            case "table":
              return (
                total +
                [...block.head, ...block.rows.flat()].join(" ").split(/\s+/).length
              );
            case "figure":
              return total + block.caption.split(/\s+/).length;
            default:
              return total + block.text.split(/\s+/).length;
          }
        }, 0),
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}${category}/${slug}`,
      };

      /*
       * !! NO BreadcrumbList HERE !!
       *
       * It was hand written in this file, which made it a second source of
       * truth. components/layout/breadcrumbs.tsx emits one built from the same
       * trail it renders, and that is what Google requires: the name in the
       * markup has to match what the reader sees. Two blocks meant the visible
       * trail and the schema could disagree the first time a category was
       * renamed, and one of them would have been quietly wrong.
       *
       * The article passes its category and its own title to that component
       * instead. See the `leaf` prop there.
       */

      /*
       * FAQPage, only when the article actually ends with questions.
       *
       * docs/blog-structure.md asks for it conditionally and that condition
       * matters. Emitting an empty or invented Q&A to earn the schema is the
       * kind of thing that reads as manipulation to a reviewer and gets the
       * markup ignored for the whole domain.
       */
      const faqSchema =
        post.faqs && post.faqs.length > 0
          ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }
          : null;

      return (
        <main>
          {[articleSchema, ...(faqSchema ? [faqSchema] : [])].map((schema) => (
            <script
              key={schema["@type"]}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
              }}
            />
          ))}
          <PostPage post={post} related={related} />
          <CtaSection />
        </main>
      );
    },
  };
}
