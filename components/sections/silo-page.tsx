import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { childrenOf } from "@/content/navigation";
import { implementationSteps } from "@/content/services";
import { actions, heroCopy } from "@/content/site";
import type { ServicePage } from "@/content/types";

/**
 * Every landing page in the silo, drawn from one component.
 *
 * Section 4 of docs/hitasoft_ai_architecture_strategy.md sets the order:
 * problem, solution, process, return, then one call to action. Eleven pages
 * follow it. Written out per route that is eleven chances for one of them to
 * quietly drift into a different shape, which is how a site stops looking like
 * one company built it.
 *
 * No animation in here, and no "use client". These pages carry text and
 * links, and the scroll-triggered fades the home page sections use would cost
 * every one of them a client bundle for no reading benefit. The closing panel
 * is still the animated CtaSection, appended by each route.
 */
export function SiloPage({ page, path }: { page: ServicePage; path: string }) {
  /*
   * Empty on a child page, populated on a silo parent. The header only shows a
   * silo's children while the pointer is resting on that silo, so without this
   * a parent page linked down to nothing at all and the silo had a level
   * missing from its internal linking.
   */
  const children = childrenOf(path);

  return (
    <>
      {/*
        The header is fixed and 80 pixels tall, so a page opening on a plain
        section would start underneath it. Every other route on the site opens
        with a component that happens to have enough top padding. These pages
        state it rather than relying on that.
      */}
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          <Breadcrumbs path={path} />

          <Eyebrow className="mb-6">{page.eyebrow}</Eyebrow>

          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            {page.title}
          </h1>

          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {page.lede}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-full group"
            >
              <Link href={actions.book}>
                {heroCopy.primaryCta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
            >
              <Link href="/how-we-work">See how we work</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Prose
        eyebrow="The problem"
        heading={page.problem.heading}
        body={page.problem.body}
        points={page.problem.points}
        marker="rule"
      />

      <Prose
        eyebrow="The solution"
        heading={page.solution.heading}
        body={page.solution.body}
        points={page.solution.points}
        marker="check"
      />

      {children.length > 0 && (
        <Section spacing="tight" className="border-t border-foreground/10">
          <Container>
            <Eyebrow className="mb-6">In this silo</Eyebrow>
            <SectionTitle className="max-w-2xl">
              {children.length} ways we do it.
            </SectionTitle>

            <div
              className={`mt-12 grid gap-px bg-foreground/10 border border-foreground/10 ${
                children.length > 3 ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="group/child bg-background p-8 lg:p-10"
                >
                  <span className="text-2xl font-display tracking-tight inline-flex items-baseline gap-2">
                    {child.name}
                    <ArrowRight
                      aria-hidden
                      className="w-4 h-4 shrink-0 self-center text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/child:opacity-100 group-hover/child:translate-x-0"
                    />
                  </span>
                  <span className="mt-3 block text-muted-foreground leading-relaxed">
                    {child.blurb}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* The process. Identical on every page, which is the point of it. */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <Eyebrow className="mb-6">The process</Eyebrow>
          <SectionTitle className="max-w-2xl">
            Audit, integrate, launch.
          </SectionTitle>

          <div className="mt-14 grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
            {implementationSteps.map((step) => (
              <div key={step.number} className="bg-background p-8 lg:p-10">
                <span className="font-mono text-sm text-muted-foreground">
                  {step.number}
                </span>
                <h3 className="mt-4 text-2xl font-display tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        The blueprint calls this the ROI block and wants figures in it. There
        are none to publish, so it says what changes instead. See the warning
        at the top of content/services.ts before adding a percentage here.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
            <div>
              <Eyebrow className="mb-6">What changes</Eyebrow>
              <SectionTitle>After it is live.</SectionTitle>
            </div>

            <ul className="flex flex-col">
              {page.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="py-6 border-b border-foreground/10 first:pt-0 text-lg lg:text-xl leading-relaxed"
                >
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * The problem block and the solution block have the same anatomy, so they
 * share a renderer. `marker` is the only difference between them: the problem
 * list is a set of complaints and gets a plain rule, the solution list is a
 * set of commitments and gets a tick. A tick beside "errors surface weeks
 * later" would read as though we were pleased about it.
 */
function Prose({
  eyebrow,
  heading,
  body,
  points,
  marker,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  points: string[];
  marker: "rule" | "check";
}) {
  return (
    <Section spacing="tight" className="border-t border-foreground/10">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          <div>
            <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
            <SectionTitle className="lg:sticky lg:top-32">{heading}</SectionTitle>
          </div>

          <div>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              {body}
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              {points.map((point) => (
                <li key={point} className="flex gap-4 items-baseline">
                  {marker === "check" ? (
                    <Check
                      aria-hidden
                      className="w-4 h-4 shrink-0 translate-y-0.5 text-primary"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="w-4 h-px shrink-0 translate-y-[-0.35rem] bg-foreground/30"
                    />
                  )}
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
