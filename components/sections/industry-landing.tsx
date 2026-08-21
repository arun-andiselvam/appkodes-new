import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BrandMark } from "@/components/ui/brand-mark";
import { HeroBackdrop } from "@/components/backgrounds/hero-backdrop";
import { LedgerPanel } from "@/components/backgrounds/ledger-panel";
import { actions } from "@/content/site";
import type { IndustryLanding } from "@/content/types";

/**
 * The long form industry page.
 *
 * !! THIS IS NOT THE SERVICE PAGE WITH DIFFERENT NOUNS !!
 *
 * It was, for about an hour on 21 August 2026. Six of its seven sections were
 * structurally identical to components/sections/service-landing.tsx: the same
 * hero split with the same architecture diagram, the same narrow title summary
 * block, two CardRows, the same bordered four column grid, the same FAQ. A
 * visitor arriving from search at one and then the other met one template with
 * the nouns swapped, which weakens both pages.
 *
 * What stays shared is the design language and the real components: the type
 * scale, the hairlines, HeroBackdrop, BrandMark, Breadcrumbs, the CTA. Those
 * are the brand, and forking them would put a visible seam in the top nav
 * between Services and Industries.
 *
 * What changed is the rhythm and the furniture, because the two pages argue
 * differently. A service page settles a decision, integrate or rebuild, so it
 * earns a process timeline and a comparison table. An industry page has to
 * prove we know a trade, so it gets that trade's document in the hero, its
 * pipeline as a section of its own, use cases with room to be specific, and
 * the software it already runs on a moving row.
 *
 * Section by section against the service page:
 *
 *   Hero            ledger panel, not the architecture diagram
 *   Summary         full width pull quote, not a narrow title split
 *   Bottleneck      two columns, not a card row
 *   Use cases       full width rows with specifics, not three cards
 *   Workflow        no equivalent on the service page
 *   Security        tinted panel, no equivalent
 *   Ecosystem       marquee, not a static grid
 *   FAQ             shared, and deliberately so
 *
 * No "use client". These pages carry text and links.
 */
export function IndustryLandingPage({ page }: { page: IndustryLanding }) {
  return (
    <>
      {/*
        The header is fixed and 80 pixels tall, so the page opens clear of it.
        The bottom padding is not optional: without it the proof badges sit on
        the next section's rule and read as a stray line under the hero.

        HeroBackdrop is shared with the home page and the service page on
        purpose. It is the site's opening treatment, and changing it in one
        place should change it everywhere.
      */}
      <Section
        spacing="none"
        className="relative overflow-hidden pt-28 lg:pt-36 pb-20 lg:pb-28"
      >
        <HeroBackdrop />
        <Container className="relative z-10">
          <Breadcrumbs path={page.path} />

          <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px] gap-10 xl:gap-14 items-center">
            <div>
              <Eyebrow className="mb-6">{page.hero.eyebrow}</Eyebrow>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                {page.hero.title}
              </h1>
              <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {page.hero.lede}
              </p>

              {/*
                The primary label comes from the content rather than heroCopy,
                because an industry page names its own audit. A fintech visitor
                is offered a financial AI audit, and the next industry names
                its own.
              */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-full group"
                >
                  <Link href={actions.book}>
                    {page.hero.cta}
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

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {page.hero.badges.map((badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-2 text-sm font-mono text-muted-foreground"
                  >
                    <Check className="w-4 h-4 shrink-0" aria-hidden />
                    {badge}
                  </li>
                ))}
              </ul>
            </div>

            <LedgerPanel ledger={page.ledger} />
          </div>
        </Container>
      </Section>

      {/*
        The definition, as a pull quote across the full width.

        The service page sets this as a narrow title beside a paragraph. Here
        it is the paragraph alone at display size with the heading reduced to
        an eyebrow, because on an industry page this block is the claim to
        know the trade and it should read as a statement rather than as a
        labelled field. It is also the Service schema's description, emitted by
        the route, so the prose and the structured data cannot drift.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <Eyebrow className="mb-8">{page.summary.heading}</Eyebrow>
          <p className="max-w-5xl font-display text-2xl lg:text-3xl leading-[1.4] tracking-tight text-foreground/90">
            {page.summary.body}
          </p>
        </Container>
      </Section>

      {/*
        The bottleneck, in two columns. The argument sticks on the left while
        the symptoms pass it.

        The service page's problem section is a heading, a paragraph and a row
        of three cards. This one is deliberately the older shape, because two
        pages both opening their argument with an identical card row was the
        clearest tell that they came off one template.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <SectionTitle>{page.problem.heading}</SectionTitle>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {page.problem.body}
              </p>
            </div>
            <ol className="border-t border-foreground/10">
              {page.problem.points.map((point, i) => (
                <li
                  key={point.title}
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-foreground/10 py-7"
                >
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight">{point.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{point.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/*
        Use cases as full width rows. Title on the left, the argument and the
        specifics on the right.

        Three cards gave each use case about thirty words in a third of the
        width, which undersells the part of an industry page that does the
        selling. A row has room for what the integration actually does, which
        is what `detail` carries.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.useCases.heading}</SectionTitle>
          <div className="mt-12 border-t border-foreground/10">
            {page.useCases.items.map((item, i) => (
              <article
                key={item.title}
                className="grid lg:grid-cols-[minmax(0,20rem)_1fr] gap-6 lg:gap-16 border-b border-foreground/10 py-10 lg:py-12"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm text-muted-foreground tabular-nums pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    {item.body}
                  </p>
                  {/*
                    Specifics as a chip row rather than bullets. Bullets under
                    a paragraph read as more of the same paragraph, and these
                    are a spec: short, scannable, and not sentences.
                  */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.detail.map((line) => (
                      <li
                        key={line}
                        className="border border-foreground/15 px-3 py-1.5 text-sm text-muted-foreground"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        The pipeline. No equivalent on the service page, and the section that
        makes this page specific to a trade rather than to a technology.

        Step four is a person and it is marked as one. The brief asks for
        "instantly resolving tickets without human intervention", and a buyer
        who has already had an AI pilot die does not believe a pipeline with
        nobody in it. Naming the checkpoint is what makes the other four steps
        credible.

        The rule runs behind the markers rather than between them, so the row
        reads as one line with stops on it. Below lg it stacks and the rule
        goes vertical down the left.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.workflow.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.workflow.body}
          </p>

          <ol className="mt-14 grid gap-y-8 lg:grid-cols-5 lg:gap-x-6">
            {page.workflow.steps.map((step, i) => (
              <li key={step.label} className="relative lg:pt-8">
                {/*
                  The connecting rule, drawn per step so it stops cleanly at
                  the ends instead of running past the first and last markers.
                */}
                <span
                  aria-hidden
                  className={`absolute hidden lg:block top-[3px] h-px bg-foreground/15 ${
                    i === 0
                      ? "left-1/2 right-0"
                      : i === page.workflow.steps.length - 1
                        ? "left-0 right-1/2"
                        : "left-0 right-0"
                  }`}
                />
                <span
                  aria-hidden
                  className={`absolute hidden lg:block top-0 left-1/2 -translate-x-1/2 h-[7px] w-[7px] rounded-full ${
                    step.human ? "bg-brand-red" : "bg-foreground/30"
                  }`}
                />

                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className={`mt-3 font-display text-xl tracking-tight ${
                    step.human ? "text-brand-red" : ""
                  }`}
                >
                  {step.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
                {/*
                  The human step says so in words, not only in colour. Colour
                  alone is not an accessible way to carry meaning, and this is
                  the one piece of meaning in the section.
                */}
                {step.human && (
                  <span className="mt-3 inline-block border border-brand-red/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-red">
                    Human checkpoint
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/*
        Security, on the tint the home page already uses for emphasis. The
        brief asks for a full width dark slab, which would invert wrongly in
        one of the two themes and would need a second set of tokens to fix.

        Icons are decoration and the title carries the meaning, so they are
        aria-hidden. Same treatment as components/sections/security.tsx.
      */}
      <Section
        spacing="tight"
        className="border-t border-foreground/10 bg-foreground/[0.02]"
      >
        <Container>
          <SectionTitle>{page.security.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.security.body}
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
            {page.security.items.map((item) => (
              <div key={item.title} className="bg-background p-6 lg:p-8">
                <span className="mb-6 flex h-10 w-10 items-center justify-center border border-foreground/10">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        The trade's software, on a moving row rather than in a static grid.

        This is what docs/industry-page-architecture.md actually asks for, and
        it is the home page's treatment: two copies of the set translating by
        -50%, with the trailing gap inside each set rather than on the outer
        flex so the halves stay equal and the loop does not jump. See
        components/sections/integrations.tsx, which explains that in full.

        It is markup here rather than a client component, because nothing needs
        state. The animation is CSS and app/globals.css stops it under
        prefers-reduced-motion.

        The marquee sits outside Container so it runs to both edges. The
        heading above it does not.
      */}
      <Section spacing="tight" className="border-t border-foreground/10 overflow-hidden">
        <Container>
          <SectionTitle>{page.ecosystem.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.ecosystem.body}
          </p>
        </Container>

        <div className="mt-12 flex">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex gap-6 pr-6 shrink-0 marquee">
              {page.ecosystem.items.map((item) => (
                <div
                  key={`${item.name}-${setIndex}`}
                  // aria-hidden on the duplicate, so a screen reader is not
                  // read the same eleven tools twice.
                  aria-hidden={setIndex === 1}
                  className="group shrink-0 border border-foreground/10 px-8 py-6 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/[0.02]"
                >
                  <div className="flex items-start gap-4">
                    <BrandMark icon={item.icon} name={item.name} />
                    <div>
                      <div className="text-lg font-medium transition-transform group-hover:translate-x-1">
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/*
        FAQ. Shared with the service page on purpose: an accordion is an
        accordion, and inventing a second one would be difference for its own
        sake. Native <details>, so it opens with no JavaScript. Two across,
        with rules drawn per item so nothing carries across the column gap. The
        schema is emitted by the route, not here.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>Common questions about AI in finance</SectionTitle>
          <div className="mt-12 grid md:grid-cols-2 gap-x-12 lg:gap-x-16">
            {page.faqs.map((faq, i) => (
              <details
                key={faq.question}
                className={`group border-b border-foreground/10 ${
                  i === 0 ? "border-t" : i === 1 ? "md:border-t" : ""
                }`}
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-xl tracking-tight">{faq.question}</h3>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-2xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-6 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
