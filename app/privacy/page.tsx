import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { BodyBlock } from "@/components/primitives/rich-text";
import { Contents } from "@/components/sections/post-contents";
import { legalUpdated, privacyBody } from "@/content/legal";
import type { Block } from "@/lib/posts";

export const metadata = pageMetadata({
  title: "Privacy & Cookie Policy",
  description:
    "What hitasoft.com collects, the cookies it sets, who it shares data with, and how to ask us to delete yours.",
  path: "/privacy",
});

/**
 * The privacy and cookie policy.
 *
 * !! THE LAYOUT IS components/sections/post.tsx's, MINUS THE HALF THAT IS
 * SPECIFIC TO AN ARTICLE !!
 *
 * No hero image, no key takeaways, no author box, no related reading and no
 * silo link: none of those describe a legal page. What is shared is the one
 * thing worth keeping, a single measured column of prose with a contents
 * panel beside it that follows the reader down eleven headings. Rebuilding
 * that scroll-tracking panel for one more page, rather than reusing
 * `Contents`, is exactly the duplication components/sections/post.tsx and
 * career-detail.tsx already avoided once.
 *
 * The copy itself lives in content/legal.ts as a `Block[]`, the same shape a
 * post's body is, so it renders through the same `BodyBlock` a CMS article
 * or a job description does. See that file for why every fact in it is
 * traceable to a line of code rather than asserted.
 */
export default function PrivacyPage() {
  const headings = privacyBody.filter(
    (block): block is Extract<Block, { kind: "h2" | "h3" }> =>
      block.kind === "h2" || block.kind === "h3",
  );

  return (
    <main>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-10 lg:pb-14">
        <Container>
          <Eyebrow className="mb-6">Legal</Eyebrow>
          <h1 className="max-w-4xl font-display text-4xl lg:text-6xl tracking-tight leading-[1.03]">
            Privacy &amp; cookie policy
          </h1>
          <p className="mt-8 max-w-3xl text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            What this site collects, the cookies it sets, and who any of it goes to.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated {legalUpdated}.
          </p>
        </Container>
      </Section>

      <Section spacing="none" className="pb-20 lg:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20">
            <aside>
              <div className="lg:sticky lg:top-32 lg:flex lg:max-h-[calc(100vh-10rem)] lg:flex-col">
                <Contents headings={headings} />
              </div>
            </aside>

            <article className="max-w-[68ch]">
              {privacyBody.map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </article>
          </div>
        </Container>
      </Section>
    </main>
  );
}
