import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BrandMark } from "@/components/ui/brand-mark";
// Lifted out of this file on 21 August 2026, so the industry pages draw the
// same row. See components/sections/card-row.tsx.
import { CardRow } from "@/components/sections/card-row";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { HeroBackdrop } from "@/components/backgrounds/hero-backdrop";
import { IntegrationDiagram } from "@/components/backgrounds/integration-diagram";
import { childrenOf } from "@/content/navigation";
import { actions, heroCopy } from "@/content/site";
import type { ServiceLanding } from "@/content/types";

/**
 * The long form service page, drawn from one component.
 *
 * SiloPage is the short blueprint eleven routes share. This is the shape
 * docs/service-page-architecture.md specifies for a page that has to rank on
 * its own: hero with proof, problem, capabilities, dated process, reach,
 * stack and an FAQ carrying its own schema.
 *
 * No "use client" and no animation, for the same reason SiloPage has neither.
 * These pages carry text and links, and a scroll-triggered fade would cost
 * every one of them a client bundle without helping anybody read.
 *
 * The silo children still get listed. The header only shows them while the
 * pointer rests on that menu, so a parent that did not link down would leave
 * the silo a level short of the internal linking it exists for.
 */
export function ServiceLandingPage({ page }: { page: ServiceLanding }) {
  const children = childrenOf(page.path);

  return (
    <>
      {/*
        The header is fixed and 80 pixels tall, so the page opens clear of it.
        The bottom padding is not optional: without it the proof badges sat
        directly on the next section's rule, which read as a stray line under
        the hero rather than as the start of a new section.

        The backdrop is the same component the home page hero uses, so the two
        openings cannot drift apart. See components/backgrounds/hero-backdrop.
        A CSS only version lived here first and was dropped: one treatment that
        stays in step everywhere beat a second one that had to be retuned by
        hand every time the first changed.
      */}
      <Section
        spacing="none"
        className="relative overflow-hidden pt-28 lg:pt-36 pb-20 lg:pb-28"
      >
        <HeroBackdrop />
        <Container className="relative z-10">
          <Breadcrumbs path={page.path} />

          {/*
            Two columns once there is room for them. The diagram needs about
            four hundred pixels to stay legible, so below lg it drops out
            entirely rather than shrinking into an unreadable thumbnail.
          */}
          {/*
            The diagram column went from 440 to 520 on 22 August 2026 so the
            isometric assembly could be drawn larger. At 1400 of container that
            still leaves about 760 for the headline, which "Add AI to the
            software you already run." sets on two lines exactly as before.
          */}
          <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_520px] xl:grid-cols-[minmax(0,1fr)_580px] gap-10 xl:gap-14 items-center">
            <div>
            <Eyebrow className="mb-6">{page.hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              {page.hero.title}
            </h1>
            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {page.hero.lede}
            </p>

            {/* Same pair SiloPage uses, so the silo's pages open identically. */}
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

            {/*
              Proof under the call to action, which is where the brief puts it.
              Both figures are the ones content/site.ts already publishes, and
              the eighteen years is delivery rather than AI. The regional
              project counts the brief also asked for are draft data and stay
              out. See the note in content/service-landings.ts.
            */}
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

            {page.diagram && <IntegrationDiagram diagram={page.diagram} />}
          </div>
        </Container>
      </Section>

      {/*
        The definition, set apart so an answer engine can lift it whole.
        Deliberately plain and self-contained: it has to survive being quoted
        with none of the page around it. It doubles as the Service schema's
        description, emitted by the route.

        It carries a heading like every other section. A paragraph at display
        size with nothing above it read as a caption that had lost its picture,
        and the two column split is the rhythm the problem and reach sections
        already use.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid lg:grid-cols-[minmax(0,20rem)_1fr] gap-10 lg:gap-20">
            <SectionTitle>{page.summary.heading}</SectionTitle>
            {/*
              Set as a statement rather than body copy, matching the same block
              on the industry pages. Kept in step with
              components/sections/industry-landing.tsx on 22 August 2026: two
              pages a visitor reaches from the same top nav should not set
              their definition paragraph two different ways.

              !! THE WORDS DID NOT GET CUT, AND SHOULD NOT BE !!

              The obvious response to a heavy looking block is to shorten it.
              This paragraph is the Service schema's description, emitted
              verbatim by lib/service-landing-route.tsx, and it is the passage
              an answer engine is most likely to lift. Trimming it for weight
              would buy a lighter page by making the one quotable block on it
              thinner. Typography was the cheaper fix.
            */}
            <p className="text-xl lg:text-2xl font-medium leading-snug text-foreground/90">
              {page.summary.body}
            </p>
          </div>
        </Container>
      </Section>

      {/*
        The problem. Argument across the top, symptoms in a row underneath.

        This was a two column split with the cards stacked down the right hand
        side. Three cards in a column is a long thin stack that pushes the
        section past a screen and a half, and the argument beside it had to be
        pinned in place to stay readable. In a row they are read as a set,
        which is what they are, and the section closes in one screen.

        It is now the same shape as the capabilities and stack sections below:
        heading, one measured paragraph, then a three across grid. Three blocks
        built the same way read as one page rather than three.

        The cards themselves are the home page's capability card, reused rather
        than reinvented: rounded, one hairline border, no shadow, and the
        border going primary on hover. See components/sections/features.tsx. A
        service page inventing its own card would put two card shapes in front
        of the same visitor on the same visit.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.problem.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.problem.body}
          </p>
          <CardRow items={page.problem.points} />
        </Container>
      </Section>

      {/*
        Capabilities, on the same row of cards the problem section uses.

        This was the attached grid, cells divided by hairlines with no radius.
        Two card treatments inside one page put the reader in front of two
        different systems, and the section directly above had already claimed
        the rounded one.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.capabilities.heading}</SectionTitle>
          <CardRow items={page.capabilities.items} />
        </Container>
      </Section>

      {/*
        Process, as a vertical timeline rather than a fourth row of three.

        !! THIS SECTION EXISTS TO BREAK THE RHYTHM AS MUCH AS TO CARRY THE STEPS !!

        Problem, capabilities, process and reach were all a heading over three
        equal columns. Four of those stacked and the eye stops reading them as
        separate arguments and starts skimming shapes. This one is now a title
        that holds on the left while the weeks run down the right, joined by a
        rule with a marker on each step, so the page changes gait in the middle
        rather than repeating.

        The week lives on the step, not in the heading.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 h-fit">
              <SectionTitle>{page.process.heading}</SectionTitle>
            </div>

            <ol className="relative">
              {/*
                The spine. Drawn behind the markers and stopped short at both
                ends, so it starts at the first step and finishes at the last
                rather than running off into the section padding.
              */}
              <span
                aria-hidden
                className="absolute left-[7px] top-3 bottom-3 w-px bg-foreground/15"
              />

              {page.process.steps.map((step, i) => (
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
        The comparison, as a real <table> rather than a grid of divs. Answer
        engines and screen readers both read a table's header cells to work out
        what a row means, and a div wearing table styling gives neither of them
        anything. It scrolls inside its own box on a narrow screen so the page
        body never scrolls sideways.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.comparison.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.comparison.body}
          </p>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-foreground/20">
                  <th scope="col" className="py-4 pr-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="sr-only">Measure</span>
                  </th>
                  <th scope="col" className="py-4 pr-6 font-display text-lg tracking-tight font-normal text-muted-foreground">
                    {page.comparison.columns[0]}
                  </th>
                  <th scope="col" className="py-4 font-display text-lg tracking-tight font-normal">
                    {page.comparison.columns[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.comparison.rows.map((row) => (
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
        What the work looks like in a real system.

        Placed after the comparison because that table is where somebody
        decides integration beats a rebuild, and this is the first thing they
        want once they have. Staggered rows rather than another grid: the
        system label and headline hold one side, the description the other,
        and the sides alternate down the page.

        No images. The alternative was three more placeholder photographs on a
        page that already carries a diagram, and a stock photo above a
        paragraph about invoices adds nothing the paragraph does not.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.scenarios.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.scenarios.body}
          </p>

          <div className="mt-14 border-t border-foreground/10">
            {page.scenarios.items.map((item, i) => (
              <article
                key={item.title}
                className="grid gap-4 border-b border-foreground/10 py-10 lg:grid-cols-2 lg:gap-20 lg:py-14"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {item.system}
                  </span>
                  <h3 className="mt-4 font-display text-2xl lg:text-3xl tracking-tight leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p
                  className={`text-lg text-muted-foreground leading-relaxed ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        Reach, rebuilt 21 August 2026.

        It was a two column split: the heading on the left at display size in a
        half width column, where "Built in five offices, deployed where you
        are" broke across three lines and left "are" stranded on the last one.
        Beside it sat three checkmarked lines, and under those most of a screen
        of nothing.

        Full width heading fixes the break. The place names come out of the
        paragraph and onto their own labelled row, which is also the only place
        on the page a search engine can read them as a set. The three points
        become a labelled grid, borrowing the bordered treatment the stack
        section below already uses rather than a third row of cards.

        !! THE ROW IS CLIENT LOCATIONS AND THE LABEL HAS TO SAY SO !!

        It read "Offices" and the heading claimed five of them. There are none.
        See the note on `reach` in content/service-landings.ts.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.reach.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.reach.body}
          </p>

          <dl className="mt-12 grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
            {page.reach.points.map((point) => (
              <div key={point.label} className="bg-background p-6 lg:p-8">
                <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {point.label}
                </dt>
                <dd className="mt-4 leading-relaxed">{point.body}</dd>
              </div>
            ))}
          </dl>

          {/*
            Where the clients are. A real list rather than chips, so a crawler
            reading this page for a location signal finds five list items
            instead of five unrelated spans.
          */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Clients met in person
            </h3>
            <ul className="flex flex-wrap gap-2">
              {page.reach.clientLocations.map((location) => (
                <li
                  key={location}
                  className="border border-foreground/15 px-3 py-1 text-sm"
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/*
        Stack, grouped rather than one undifferentiated logo wall.

        Rebuilt 21 August 2026 on the home page's treatment: mark, name, and a
        line saying what the entry is for. See components/ui/brand-mark.tsx,
        which both this and the marquee draw their icons from.

        It was bare chips in four groups of 4, 2, 2 and 2. Three quarters of
        the panel was empty, and a buyer with no IT department got "pgvector"
        with nothing to tell them what it does. The category line is the fix,
        and the group counts are levelled at five and four.

        Marks are decoration, so the name carries the meaning and BrandMark
        renders aria-hidden. An entry with no mark gets a monogram rather than
        somebody else's logo.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>{page.stack.heading}</SectionTitle>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {page.stack.body}
          </p>
          <dl className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
            {page.stack.groups.map((group) => (
              <div key={group.label} className="bg-background p-6 lg:p-8">
                <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {group.label}
                </dt>
                <dd className="mt-6 space-y-5">
                  {group.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <BrandMark
                        icon={item.icon}
                        name={item.name}
                        className="shrink-0 w-5 h-5 mt-0.5 text-muted-foreground"
                      />
                      <div className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground leading-snug">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/*
        The silo's children, so the parent links down to what it heads.

        !! THESE STAY, AND THEY STAY POINTING DOWN !!

        A review on 22 August 2026 read this as stranded and suggested swapping
        it for links across to the other service silos. That would invert the
        architecture. docs/hitasoft_ai_architecture_strategy.md builds each
        silo so a parent passes its equity to its own children, and sending it
        sideways to unrelated parents spends the one structural advantage the
        site has. The same review also assumed the reader was on the child
        page. They are on the parent, and these two are what sits under it.

        The naming critique was fair and was taken. "What this covers" said
        nothing about where the links went.
      */}
      {children.length > 0 && (
        <Section spacing="tight" className="border-t border-foreground/10">
          <Container>
            <SectionTitle>Go deeper on one part</SectionTitle>
            <div className="mt-12 grid md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="group bg-background p-8 lg:p-10 hover:bg-foreground/[0.02] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="font-display text-2xl tracking-tight">{child.name}</span>
                    <ArrowRight
                      aria-hidden
                      className="w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </span>
                  {child.blurb && (
                    <span className="mt-3 block text-muted-foreground leading-relaxed">
                      {child.blurb}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/*
        Proof, before the FAQ.

        The page was entirely theoretical up to here: everything it said was
        about what we can do rather than what anybody has seen us do. This is
        the home page's testimonials section, reused whole, which carries
        Trustpilot reviews written by clients and the vetted client marks.

        !! WHAT THIS SECTION IS NOT !!

        A review on 22 August 2026 asked for a case study highlight here, with
        a worked example reading "38 hours saved per week on manual ticket
        routing". That figure is not hypothetical: it is one of the drafts in
        content/metrics.ts, which carries a capitalised warning that all four
        of its numbers are drafts rather than measurements and must come from
        delivery records before publication. Putting it on a service page,
        attached to a client, would be the "98% faster deployment" mistake
        again with a different number.

        So the page gets real proof instead. The reviews are unedited and the
        marks are the ones appkodes.com publishes itself. Write a real case
        study up and it belongs here, above these.
      */}
      <TestimonialsSection />

      {/*
        FAQ. Native <details>, so it opens with no JavaScript and the keyboard
        and screen reader behaviour comes from the browser rather than from an
        ARIA pattern we would have to maintain. The schema for these questions
        is emitted by the route, not here, so one page renders one script tag.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>Frequently asked questions</SectionTitle>
          {/*
            Two across, filling the width the single column left empty. Six
            questions make three rows of two.

            Grid rather than CSS columns, which would have run the order down
            the left and back up the right. A grid reads left to right, so the
            visual order and the DOM order agree, and the DOM order is what a
            keyboard and the FAQPage schema both follow.

            Rules are drawn per item rather than on the wrapper. A border on
            the container would carry straight across the column gap, where
            there is nothing to underline. The first item of each column takes
            the top rule, and every item closes with its own bottom rule, so no
            two rows meet on a doubled line. Below md there is one column and
            only the very first item takes a top rule.

            Opening one answer lifts its whole row. That is the price of two
            columns and it is the right trade here, since these answers are
            three lines rather than three paragraphs.
          */}
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
