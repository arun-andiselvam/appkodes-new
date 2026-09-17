import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { ScrollToTop } from "@/components/sections/scroll-to-top";

/**
 * What an article shows while it renders.
 *
 * !! WHY THIS EXISTS: A CLICK USED TO LOOK LIKE IT DID NOTHING !!
 *
 * Every page renders per request (force-dynamic in app/layout.tsx, for the CSP
 * nonce), so a link to an article has nothing to show until the server
 * answers. Without a loading boundary the old page just sat there for over a
 * second after the click, from /blog and from Read next alike. Reported 17
 * September 2026. Next prefetches this boundary with the link, so it paints
 * on the click and the article replaces it when it arrives.
 *
 * The shapes follow PostPage in post.tsx - trail, headline, standfirst, hero -
 * at the same paddings and hero heights, so the swap moves nothing on screen.
 * Keep them in step if the article's top changes.
 */
export function PostSkeleton() {
  return (
    <main aria-busy="true">
      {/* The skeleton is shorter than the page clicked from, so the window has
          to be moved before the browser clamps it to the new bottom. See
          scroll-to-top.tsx. */}
      <ScrollToTop />
      <span role="status" className="sr-only">
        Loading article
      </span>

      <Section spacing="none" className="pt-32 lg:pt-40 pb-10 lg:pb-14">
        <Container>
          <div aria-hidden className="animate-pulse">
            <div className="h-4 w-48 rounded bg-foreground/[0.06]" />
            <div className="mt-8 h-10 lg:h-16 w-full max-w-4xl rounded bg-foreground/[0.06]" />
            <div className="mt-3 h-10 lg:h-16 w-3/5 max-w-4xl rounded bg-foreground/[0.06]" />
            <div className="mt-8 h-6 lg:h-7 w-full max-w-3xl rounded bg-foreground/[0.06]" />
            <div className="mt-3 h-6 lg:h-7 w-4/5 max-w-3xl rounded bg-foreground/[0.06]" />
          </div>
        </Container>
      </Section>

      <Section spacing="none" className="pb-14 lg:pb-20">
        <Container>
          <div
            aria-hidden
            className="min-h-[26rem] sm:min-h-[28rem] lg:min-h-[34rem] w-full animate-pulse rounded-[12px] bg-foreground/[0.06]"
          />
        </Container>
      </Section>
    </main>
  );
}
