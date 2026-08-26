import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { SectionTitle } from "@/components/primitives/section-title";
import { actions } from "@/content/site";
import type { CaseStudy } from "@/lib/case-studies";

/**
 * One written up engagement.
 *
 * Structure from the reference supplied on 21 August 2026: back link, the
 * headline, a hero image with the summary and the figures beside it, then a
 * spec column against the narrative, a quote, and the other studies.
 *
 * !! EVERY FIGURE AND EVERY QUOTED WORD BELONGS TO SOMEBODY ELSE !!
 *
 * This component will render whatever it is given, which is exactly why the
 * warnings live in lib/case-studies.ts and content/case-studies.ts. A
 * percentage nobody measured looks identical to one that was, and the site has
 * already been cleaned once of a template crediting "98% faster deployment" to
 * Stripe.
 *
 * `results` and `quote` are both optional in effect. An empty results list
 * renders nothing rather than an empty rule, and a study with no quote simply
 * has no quote section. A study that has to run without numbers should look
 * deliberate, not broken, because some of them will.
 */
export function CaseStudyPage({
  study,
  related,
}: {
  study: CaseStudy;
  related: CaseStudy[];
}) {
  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <Container>
          {/*
            A back link rather than a breadcrumb trail, which is what the
            reference does and what suits a page a reader arrives at from the
            index. The trail still exists in the schema emitted by the route.
          */}
          <Link
            href="/resources/case-studies"
            className="group/back inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden
              className="w-3.5 h-3.5 transition-transform group-hover/back:-translate-x-1"
            />
            Back to case studies
          </Link>

          <h1 className="mt-8 text-4xl lg:text-6xl font-display tracking-tight leading-[1.02] max-w-4xl">
            {study.title}
          </h1>

          {/*
            Image left, summary and figures right. The figures are the reason
            the right column exists, so the summary stays short above them.
          */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
            {/*
              !! THE ALT COMES FROM THE STUDY NOW, AND IT HAD TO !!

              This was a hard coded alt="" and that was correct while every
              hero was a photograph of the client's city: a skyline next to a
              study that already names the country is decoration, and reading
              it out loud helps nobody.

              The clients supplied their own key art on 26 August 2026 and it
              is not decoration. Each carries a headline and three or four
              named capabilities set in type, and alt="" dropped every word of
              that for anybody using a screen reader, with nothing anywhere
              reporting a problem. See `imageAlt` in lib/case-studies.ts.

              `priority` is left as it is rather than being modernised to
              preload + fetchPriority. This is the LCP element on the page and
              Next 16 deprecated `priority`, so it wants the same treatment the
              article hero got in components/sections/post.tsx. That is a
              performance change on a page nobody has asked about and it does
              not belong in an accessibility fix.
            */}
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={study.image}
                alt={study.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 60rem, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">{study.summary}</p>

              {study.results.length > 0 && (
                <dl className="mt-10 space-y-8">
                  {study.results.map((result) => (
                    <div key={result.label} className="border-l-2 border-foreground/20 pl-5">
                      <dt className="font-display text-4xl lg:text-5xl tracking-tight tabular-nums">
                        {result.value}
                      </dt>
                      <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {result.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/*
        The spec column against the narrative. The reference puts the company
        facts in a hairline table on the left, which is the right call: they
        are the first thing a reader checks for whether this company looks
        anything like theirs.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
            {/*
              The spec column, with the call under it.

              !! THE STICKY BOX IS THE WRAPPER, NOT THE dl !!

              `lg:sticky` was on the <dl> itself, which was correct while the
              column held nothing but the facts. The call has to travel with
              them, so the position moved out to a wrapper and the dl kept only
              its rule. Putting sticky back on the dl would leave the link
              behind at the top of the section on a long study.
            */}
            <div className="h-fit lg:sticky lg:top-32">
              <dl className="border-t border-foreground/10">
                {[
                  { label: "Company", value: study.client },
                  { label: "Industry", value: study.industry },
                  { label: "Company size", value: study.companySize },
                  { label: "Location", value: study.location },
                ].map((row) => (
                  <div key={row.label} className="border-b border-foreground/10 py-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="mt-1.5">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/*
                The call, asked for on 24 August 2026.

                It sits here rather than at the end of the study on purpose.
                The facts above it are what a reader checks to see whether this
                company looks anything like theirs, and the moment they decide
                it does is the moment worth catching. At the end of the page
                the closing panel already has them.

                Text and an icon rather than a filled button. The primary
                action on this page is reading the study, and a solid button in
                a sticky column would compete with the one in the closing panel
                for a reader who has both on screen at once.

                !! THE LABEL IS A QUESTION, WHICH IS NORMALLY BARRED !!

                docs/positioning.md bars rhetorical questions in copy, and the
                rule is about prose that opens or closes a section rather than
                about a button. This wording is the client's own, asked for
                verbatim on 24 August 2026. It is doing what a question does
                well here, which is inviting a reply rather than announcing
                something.
              */}
              <Link
                href={actions.book}
                className="group/call mt-8 inline-flex items-center gap-3 text-sm leading-snug transition-colors hover:text-primary"
              >
                <Phone
                  aria-hidden
                  className="w-4 h-4 shrink-0 text-primary transition-transform group-hover/call:-rotate-12"
                />
                <span className="underline decoration-foreground/25 underline-offset-4 transition-colors group-hover/call:decoration-primary">
                  You want to know this story?
                </span>
              </Link>
            </div>

            {/*
              Three acts, each a paragraph and then the specifics.

              !! THE NUMBERS ARE THE ARGUMENT, NOT DECORATION !!

              Challenge 03 and answer 03 are the same subject, so a reader who
              recognises one of the problems can drop straight to what was done
              about it. That is the whole reason the lists are numbered rather
              than bulleted, and it is why the two are written in one order.
              The pairing is a writing discipline rather than something the
              markup enforces. See the note on StudyAct in lib/case-studies.ts.

              An <ol> because the order carries meaning. A study whose points
              could be shuffled without loss has not found its argument yet.
            */}
            <div className="space-y-16">
              {[
                { heading: "Challenge", act: study.challenge },
                { heading: "What we built", act: study.approach },
                { heading: "What changed", act: study.outcome },
              ].map((block) => (
                <section key={block.heading}>
                  <h2 className="font-display text-2xl lg:text-3xl tracking-tight">
                    {block.heading}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
                    {block.act.body}
                  </p>

                  {block.act.points.length > 0 && (
                    <ol className="mt-10 border-t border-foreground/10">
                      {block.act.points.map((point, i) => (
                        <li
                          key={point.title}
                          className="grid gap-2 border-b border-foreground/10 py-6 sm:grid-cols-[auto_1fr] sm:gap-6 lg:gap-8"
                        >
                          {/*
                            Numbered from the index rather than typed into the
                            content, so a point cannot be reordered into
                            carrying somebody else's number. Same padStart the
                            service pages use.
                          */}
                          <span
                            className="font-mono text-sm text-muted-foreground tabular-nums sm:pt-1"
                            aria-hidden
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="max-w-3xl">
                            <h3 className="font-display text-xl lg:text-2xl tracking-tight">
                              {point.title}
                            </h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed">
                              {point.body}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}

              {/*
                The link back up the silo. A case study that does not send the
                reader to the service it describes has spent their attention
                and returned none of it, which is the same rule the blog posts
                are held to in lib/posts.ts.

                !! THE LABEL FOLLOWS THE TARGET, AND IT HAS TO !!

                It read "The service behind this" whatever it was pointing at.
                Not every engagement has a service page behind it: a platform
                build has no entry in the services silo, and the honest
                destination is the industry page for the sector it was built
                for. A link promising a service and landing on an industry is
                the kind of small lie a reader notices and nothing else on the
                page recovers from.
              */}
              <Link
                href={study.sendsTo}
                className="group/next inline-flex items-center gap-2 border border-foreground/15 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground/40"
              >
                {study.sendsTo.startsWith("/industries/")
                  ? "The sector behind this"
                  : "The service behind this"}
                <ArrowRight
                  aria-hidden
                  className="w-3.5 h-3.5 transition-transform group-hover/next:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/*
        Their words. A blockquote with a real cite, not a styled paragraph, so
        the attribution is machine readable and a screen reader announces it as
        a quotation.
      */}
      {study.quote && (
        <Section
          spacing="tight"
          className="border-t border-foreground/10 bg-foreground/[0.02]"
        >
          <Container>
            <figure className="max-w-4xl">
              <blockquote className="font-display text-2xl lg:text-4xl tracking-tight leading-[1.3]">
                {study.quote.text}
              </blockquote>
              <figcaption className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {study.quote.name}
                <span aria-hidden className="px-2 text-foreground/25">
                  ·
                </span>
                {study.quote.role}
              </figcaption>
            </figure>
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <Section spacing="tight" className="border-t border-foreground/10">
          <Container>
            <SectionTitle>Similar case studies</SectionTitle>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-10">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/resources/case-studies/${other.slug}`}
                    className="group/rel block"
                  >
                    {/*
                      alt stays empty here while the hero above carries the
                      real description, and that is deliberate rather than a
                      spot that was missed.

                      This image sits inside a link whose text is already the
                      study's title. Giving it the study's `imageAlt` would
                      make a screen reader read a headline and three or four
                      capability descriptions before every card in the list,
                      for a picture that is doing decorative work in a grid.
                      The card's own text is the accessible content; the hero
                      on the page it leads to is where the picture is the
                      content.
                    */}
                    <span className="relative block aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={other.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33rem, 100vw"
                        className="object-cover transition-transform duration-500 group-hover/rel:scale-[1.03]"
                      />
                    </span>
                    <span className="mt-5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {other.industry}
                    </span>
                    <span className="mt-2 flex items-start gap-2 font-display text-xl tracking-tight leading-tight">
                      {other.title}
                      <ArrowRight
                        aria-hidden
                        className="mt-1 w-4 h-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/rel:opacity-100 group-hover/rel:translate-x-0"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
