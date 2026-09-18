import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { ScrollToTop } from "@/components/sections/scroll-to-top";

/**
 * What a listing shows while it renders.
 *
 * The article boundary in post-skeleton.tsx, for the pages that list articles
 * instead: /blog and its pages, /resources and the two category pages under
 * it. All of them read the whole catalogue from Strapi, so a click sat there
 * doing nothing for a moment, which the client reported on 18 September 2026
 * in the same breath as the article delay.
 *
 * Six cards, because both listings show ten and half a screen of placeholder
 * is enough to say "this is loading" without pretending to know how many
 * articles the category holds. The shapes follow BlogIndex and PostCard in
 * resource-category.tsx: headline, standfirst, then a two column grid of a
 * thumbnail beside two lines of text.
 */
export function ListSkeleton() {
  return (
    <main aria-busy="true">
      {/* Same reason as the article boundary: this is shorter than the page
          clicked from. See scroll-to-top.tsx. */}
      <ScrollToTop />
      <span role="status" className="sr-only">
        Loading
      </span>

      <Section spacing="none" className="pt-24 lg:pt-28 pb-20 lg:pb-28">
        <Container>
          <div aria-hidden className="animate-pulse">
            <div className="h-4 w-40 rounded bg-foreground/[0.06]" />
            <div className="mt-10 h-12 lg:h-16 w-full max-w-4xl rounded bg-foreground/[0.06]" />
            <div className="mt-4 h-12 lg:h-16 w-2/3 max-w-4xl rounded bg-foreground/[0.06]" />
            <div className="mt-8 h-6 w-full max-w-2xl rounded bg-foreground/[0.06]" />
            <div className="mt-3 h-6 w-4/5 max-w-2xl rounded bg-foreground/[0.06]" />

            <ul className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <li
                  key={i}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-5"
                >
                  <div className="aspect-[3/2] w-full rounded-[12px] bg-foreground/[0.06]" />
                  <div>
                    <div className="h-5 w-full rounded bg-foreground/[0.06]" />
                    <div className="mt-3 h-5 w-3/4 rounded bg-foreground/[0.06]" />
                    <div className="mt-5 h-4 w-1/3 rounded bg-foreground/[0.06]" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </main>
  );
}
