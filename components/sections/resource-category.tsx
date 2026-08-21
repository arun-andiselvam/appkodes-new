import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { ResourceCategory } from "@/content/resources";

/**
 * A blog category with nothing published in it yet.
 *
 * The honest version of a category page. It names what is being written,
 * plainly marked as unwritten, then spends the rest of the page sending the
 * reader to the service pages an article here would have linked to. Nobody
 * leaves empty handed, and nothing on the page pretends to be a post.
 *
 * Swap this component for a post list once there are posts. The route and the
 * menu entry stay as they are.
 */
export function ResourceCategoryPage({
  path,
  category,
}: {
  path: string;
  category: ResourceCategory;
}) {
  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          <Breadcrumbs path={path} />
          <Eyebrow className="mb-6">{category.eyebrow}</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            {category.title}
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {category.lede}
          </p>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
            <div>
              <Eyebrow className="mb-6">Being written</Eyebrow>
              <SectionTitle>Nothing published here yet.</SectionTitle>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                These are the three pieces in this category being written first.
                They are titles rather than links, because none of them exists.
              </p>
            </div>

            <ul className="flex flex-col">
              {category.planned.map((title) => (
                <li
                  key={title}
                  className="py-6 border-b border-foreground/10 first:pt-0 text-lg lg:text-xl leading-relaxed text-muted-foreground"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <Eyebrow className="mb-6">In the meantime</Eyebrow>
          <SectionTitle className="max-w-2xl">
            The pages these would have pointed at.
          </SectionTitle>

          <div className="mt-12 grid gap-px bg-foreground/10 border border-foreground/10 md:grid-cols-3">
            {category.sends.map((send) => (
              <Link
                key={send.href}
                href={send.href}
                className="group/card bg-background p-8 lg:p-10"
              >
                <span className="text-2xl font-display tracking-tight inline-flex items-center gap-2">
                  {send.name}
                  <ArrowRight
                    aria-hidden
                    className="w-4 h-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0"
                  />
                </span>
                <span className="mt-3 block text-muted-foreground leading-relaxed">
                  {send.blurb}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
