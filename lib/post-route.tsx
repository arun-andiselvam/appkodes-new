import { notFound } from "next/navigation";
import { siteOrigin } from "@/lib/site-url";
import { pageMetadata } from "@/lib/seo";
import { PostPage } from "@/components/sections/post";
import { CtaSection } from "@/components/sections/cta";
import { postBySlug, postHref, postsWithBody, relatedPosts, translationsOf } from "@/lib/posts";
import { site } from "@/content/site";
import { postLabels, type PostLocale } from "@/content/post-labels";

/**
 * One article, wired up from its slug.
 *
 * !! IT TOOK A CATEGORY UNTIL 25 AUGUST 2026, AND ONE ROUTE CALLS IT NOW !!
 *
 * There were two near identical route files, one per category, because the
 * URL was /resources/<category>/<slug>. That made the category structural:
 * it decided the address, so it could not be optional, and retagging an
 * article after publishing would have broken its link.
 *
 * Articles live at /blog/<slug> now and app/blog/[slug] is the only caller.
 * The category is a tag deciding which resource page lists a post, which is
 * all it was ever meant to be. See postHref in lib/posts.ts.
 */
export function postRoute(
  /*
   * Which language this route serves. app/blog/[slug] is English, and
   * app/es/blog/[slug] passes "es", added 14 September 2026. One helper for
   * both, so the two languages cannot drift apart in how an article is built.
   */
  locale: PostLocale = "en",
) {
  return {
    /**
     * Every slug that has a body.
     *
     * Reads postsWithBody rather than every post, so a draft with no body
     * never gets a URL. Paired with dynamicParams false in the route file,
     * anything else is a 404 rather than an empty article. No category
     * filter any more: one route serves them all, uncategorised included.
     */
    async generateStaticParams() {
      const posts = await postsWithBody(locale);
      return posts.map((post) => ({ slug: post.slug }));
    },

    async generateMetadata(slug: string) {
      const post = await postBySlug(slug, locale);
      if (!post) return {};

      /*
        hreflang, only when the post exists in more than one language, so a
        page never points at a translation that would 404. x-default is the
        English version, the site's default, when there is one.
      */
      const translations = await translationsOf(post);
      const languages =
        Object.keys(translations).length > 1
          ? { ...translations, ...(translations.en ? { "x-default": translations.en } : {}) }
          : undefined;

      /*
        !! absoluteTitle: BLOG POSTS CARRY NO " - Hitasoft" !!

        On the client's instruction, 11 September 2026, and against the
        general rule in docs/seo-standards.md, which records this as its one
        exception beside the home page. A post's title is its headline and
        the query it is written for, and the eleven characters of brand were
        costing it that room: a post now has the full 60 a result shows rather
        than 49. The Open Graph title follows it, through the same flag.
      */
      return pageMetadata({
        title: post.title,
        description: post.excerpt,
        path: postHref(post),
        absoluteTitle: true,
        languages,
        ogLocale: postLabels[locale].ogLocale,
      });
    },

    async Page(slug: string) {
      const post = await postBySlug(slug, locale);
      if (!post) notFound();

      const related = await relatedPosts(slug, 3, locale);
      /*
        Absolute URLs in the schema below, from the request rather than a
        constant. See lib/site-url.ts.

        !! DECLARE THIS. `origin` IS A GLOBAL IN THE DOM LIB !!

        Leaving it out does not fail typecheck. lib.dom declares `origin: string`
        at global scope, so a missing local silently resolves to it, and on the
        server that value is undefined. The schema then publishes
        "undefined/resources/..." with nothing anywhere reporting a problem.
      */
      const origin = await siteOrigin();

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
        url: `${origin}${postHref(post)}`,
        inLanguage: locale,
        ...(post.image ? { image: `${origin}${post.image}` } : {}),
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
        author: { "@type": "Organization", name: site.name, url: origin },
        publisher: { "@type": "Organization", name: site.name, url: origin },
        mainEntityOfPage: `${origin}${postHref(post)}`,
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
        /*
          lang on <main> for a translated article. <html> is lang="en" for the
          whole site in app/layout.tsx and stays that way, since the header and
          footer around a Spanish post are still English; this marks the part
          that is not, for screen readers and hyphenation.
        */
        <main lang={locale === "en" ? undefined : locale}>
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
