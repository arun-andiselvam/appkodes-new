import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { SectionTitle } from "@/components/primitives/section-title";
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
 * warnings live in lib/case-studies.ts and content/case-studies-sample.ts. A
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
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={study.image}
                alt=""
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
            <dl className="h-fit border-t border-foreground/10 lg:sticky lg:top-32">
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

            <div className="space-y-12">
              {[
                { heading: "Challenge", body: study.challenge },
                { heading: "What we built", body: study.approach },
                { heading: "What changed", body: study.outcome },
              ].map((block) => (
                <section key={block.heading}>
                  <h2 className="font-display text-2xl lg:text-3xl tracking-tight">
                    {block.heading}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
                    {block.body}
                  </p>
                </section>
              ))}

              {/*
                The link back up the silo. A case study that does not send the
                reader to the service it describes has spent their attention
                and returned none of it, which is the same rule the blog posts
                are held to in lib/posts.ts.
              */}
              <Link
                href={study.sendsTo}
                className="group/next inline-flex items-center gap-2 border border-foreground/15 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground/40"
              >
                The service behind this
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
