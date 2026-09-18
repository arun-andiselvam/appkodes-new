import { ArrowUpRight } from "lucide-react";
import { latestPosts, latestPostsCopy } from "@/content/home";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * appkodes.com's "Our Latest Content & Technical Insights". Added to the home
 * page on 18 September 2026.
 *
 * Static on purpose, linking to the posts on appkodes.com: the CMS feed holds
 * Hitasoft's AI writing. See the note on latestPosts in content/home.ts.
 */
export function LatestPostsSection() {
  return (
    <Section spacing="tight" id="latest-posts" className="border-t border-foreground/10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow className="mb-6">{latestPostsCopy.eyebrow}</Eyebrow>
            <SectionTitle>{latestPostsCopy.title}</SectionTitle>
          </div>
          <a
            href={latestPostsCopy.allHref}
            className="inline-flex items-center gap-1 text-sm underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground"
          >
            {latestPostsCopy.allLabel}
            <ArrowUpRight aria-hidden className="w-4 h-4" />
          </a>
        </div>

        <ol className="grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {latestPosts.map((post, index) => (
            <li key={post.href} className="bg-background">
              <a href={post.href} className="group flex h-full flex-col p-8 lg:p-10">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 flex-1 text-xl font-display tracking-tight leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </span>
                <span className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  Read the post
                  <ArrowUpRight aria-hidden className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
