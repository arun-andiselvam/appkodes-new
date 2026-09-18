import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { CardRow } from "@/components/sections/card-row";
import { HeroBackdrop } from "@/components/backgrounds/hero-backdrop";
import { commitments, commitmentsLabel } from "@/content/security";
import { actions } from "@/content/site";
import { QuoteLauncher } from "@/components/quote/launcher";
import {
  comparison,
  faqs,
  guarantees,
  hero,
  phases,
  principles,
  summary,
} from "@/content/how-we-work";

/**
 * /how-we-work, written for itself.
 *
 * !! THIS PAGE USED TO BE FIVE OTHER PAGES' SECTIONS !!
 *
 * It rendered HowItWorksSection, AudiencesSection, DeliveryReachSection,
 * SecuritySection and the closing panel. Four of those five are on the home
 * page too, so a visitor arriving here from a search result met the page they
 * had just left. The only block written for this page was the map, and that
 * one stays.
 *
 * No "use client" and no scroll animation, the same bargain the service and
 * industry landings make. The page is text and links, so a fade would cost a
 * client bundle and help nobody read.
 *
 * The vocabulary is deliberately the one those landings already use: the hero
 * backdrop, CardRow, the timeline with the spine down the left, the real
 * <table> for the comparison and native <details> for the FAQ. A visitor
 * moving between a service page and this one should not meet two design
 * systems, and every one of those pieces was argued out once already. See
 * components/sections/service-landing.tsx for the reasoning behind each.
 *
 * !! THE ONE SHAPE THAT IS NOT BORROWED IS THE SPLIT UNDER THE HERO !!
 *
 * Two principles at display size, side by side, with nothing else on the row.
 * It is the brief's "paradigm shift" block, and it earns its own treatment
 * because it is the only place on the page making an argument rather than
 * describing a step.
 */
export function HowWeWorkPage() {
  return (
    <>
      {/*
        The header is fixed at 80 pixels, so the page opens clear of it. Same
        padding pair the long form landings use.
      */}
      <Section
        spacing="none"
        className="relative overflow-hidden pt-24 lg:pt-28 pb-20 lg:pb-28"
      >
        <HeroBackdrop />
        <Container className="relative z-10">
          {/*
            No breadcrumb. /how-we-work is a top level path, and
            docs/seo-standards.md asks for a BreadcrumbList on pages below the
            top level. The component would return null here anyway, since
            trailFor() finds no trail for a route the menu does not carry.
          */}
          <div className="max-w-4xl">
            <Eyebrow className="mb-6">{hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              {hero.title}
            </h1>
            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {hero.lede}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary-hover hover:shadow-glow text-primary-foreground px-8 has-[>svg]:px-8 h-14 text-base rounded-lg group"
              >
                {/*
                  "Start a prototype", not the generic label. This page's whole
                  argument is stop planning and start building, and the button
                  is the last line of it.
                */}
                <QuoteLauncher placement="how_we_work">
                  <Sparkles aria-hidden />
                  Start a prototype
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </QuoteLauncher>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-lg border-foreground/20 hover:bg-foreground/5"
              >
                <Link href={actions.caseStudies}>See case studies</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {hero.badges.map((badge) => (
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
        </Container>
      </Section>

      {/*
        The split, which the brief calls the paradigm shift.

        !! IT IS NOT PART OF THE HERO, AND IT USED TO BE !!

        It shipped inside the hero Section on 24 August 2026, separated only by
        a top margin. HeroBackdrop is absolutely positioned against whatever
        section contains it, so the dot field stretched the whole way down and
        the header read as roughly nine hundred pixels tall. The client's own
        description of it: the header ends at "We build to answer a question".
        Moved out the same day.

        A section of its own with the same top rule every other block on this
        page carries, so the backdrop now stops where the hero does.

        Set at display size rather than as two cards, because the row above is
        a hero and a pair of cards directly under one reads as the page having
        started twice. The rule is drawn on the left edge of each column so it
        survives the stack: below lg the two sit one above the other and each
        keeps its own marker.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            {principles.map((principle) => (
              <div key={principle.title} className="border-l-2 border-primary pl-6 lg:pl-8">
                <h2 className="font-display text-2xl lg:text-3xl tracking-tight leading-tight">
                  {principle.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        The definition, set apart so an answer engine can lift it whole. Same
        job and same treatment as the summary block on every service page, and
        it doubles as the schema description emitted by the route.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid lg:grid-cols-[minmax(0,20rem)_1fr] gap-10 lg:gap-20">
            <SectionTitle>{summary.heading}</SectionTitle>
            <p className="text-xl lg:text-2xl font-medium leading-snug text-foreground/90">
              {summary.body}
            </p>
          </div>
        </Container>
      </Section>

      {/*
        The four phases, as the vertical timeline the service pages use.

        !! TWO OF THE FOUR CARRY NO WEEK, AND THAT IS ON PURPOSE !!

        `when` is whatever content/how-we-work.ts has measured. The brief
        wanted weeks on all four and two of those numbers have never been
        measured here. See the note at the top of that file.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 h-fit">
              <SectionTitle>{phases.heading}</SectionTitle>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {phases.body}
              </p>
            </div>

            <ol className="relative">
              {/* Stopped short at both ends, so it runs step to step rather
                  than off into the section padding. */}
              <span
                aria-hidden
                className="absolute left-[7px] top-3 bottom-3 w-px bg-foreground/15"
              />

              {phases.steps.map((step, i) => (
                <li key={step.title} className="relative pl-12 pb-12 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-foreground/25 bg-background"
                  />
                  <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    {step.when}
                  </span>
                  <h3 className="mt-3 font-display text-2xl tracking-tight">
                    <span className="mr-3 text-foreground/25 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/*
        A real <table>, not a grid of divs. Answer engines and screen readers
        both read header cells to work out what a row means. It scrolls inside
        its own box on a narrow screen so the page body never scrolls sideways.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{comparison.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {comparison.body}
          </p>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-foreground/20">
                  <th
                    scope="col"
                    className="py-4 pr-6 font-mono text-xs tracking-widest text-muted-foreground uppercase"
                  >
                    <span className="sr-only">Measure</span>
                  </th>
                  <th
                    scope="col"
                    className="py-4 pr-6 font-display text-lg tracking-tight font-normal text-muted-foreground"
                  >
                    {comparison.columns[0]}
                  </th>
                  <th scope="col" className="py-4 font-display text-lg tracking-tight font-normal">
                    {comparison.columns[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.label} className="border-b border-foreground/10">
                    <th scope="row" className="py-5 pr-6 align-top font-medium">
                      {row.label}
                    </th>
                    <td className="py-5 pr-6 align-top text-muted-foreground">{row.values[0]}</td>
                    <td className="py-5 align-top">{row.values[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/*
        The three guarantees, on the house card.

        !! THE COMMITMENTS STRIP IS WHY THIS PAGE DROPS THE SECURITY SECTION !!

        SecuritySection is six cards and this row is three, and both argue the
        same point in the same vocabulary. Running them one after another read
        as the page saying it twice. The strip below keeps the part of that
        section this page could not say without it, and it reads out of
        content/security.ts rather than being retyped, so a change to the
        contract moves both places at once.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{guarantees.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {guarantees.body}
          </p>
          <CardRow items={guarantees.items} />

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {commitmentsLabel}
            </span>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {commitments.map((commitment) => (
                <li key={commitment} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 shrink-0 text-primary" aria-hidden />
                  {commitment}
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
 * The FAQ, split out so the map can sit between the guarantees and the
 * questions.
 *
 * Native <details>, so it opens with no JavaScript and the keyboard and
 * screen reader behaviour comes from the browser. The FAQPage schema is
 * emitted by the route rather than here, so one page renders one script tag.
 */
export function HowWeWorkFaqs() {
  return (
    <Section spacing="tight" className="border-t border-foreground/10">
      <Container>
        <SectionTitle>Frequently asked questions</SectionTitle>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 lg:gap-x-16">
          {faqs.map((faq, i) => (
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
  );
}
