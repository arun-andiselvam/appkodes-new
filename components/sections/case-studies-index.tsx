import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { clientLogos } from "@/content/testimonials";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";

/**
 * The case study index.
 *
 * Structure taken from the reference supplied on 21 August 2026: a large
 * title, a row of client marks, then the stories as full width rows carrying a
 * mark, a headline and a link into the story.
 *
 * !! THE CLIENT ROW IS REAL AND THE STORIES MAY NOT BE !!
 *
 * The six marks come from content/testimonials.ts, taken from the carousel
 * appkodes.com already publishes, and they are the one piece of client
 * evidence on this page that is beyond question. They are shown as a set and
 * are never paired with a story, because docs/positioning.md line 199 forbids
 * attaching a claim to a named company that has not agreed to it.
 *
 * Everything under `caseStudies()` is invented until somebody writes a real
 * engagement up. See the warnings in lib/case-studies.ts.
 *
 * The real proof sections the page carried before this, the metrics, the
 * Trustpilot reviews, the awards and the meeting photographs, stay below. They
 * are the honest answer while there are no written studies, and they remain
 * worth reading once there are.
 */
export async function CaseStudiesIndex({ path }: { path: string }) {
  const studies = await caseStudies();

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <Container>
          <Breadcrumbs path={path} />
          <Eyebrow className="mb-6">Case studies</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            What the work returned.
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Eighteen years of delivery, the figures behind it, and clients
            saying so in their own words rather than ours.
          </p>
        </Container>
      </Section>

      {/*
        The client row. Marks only, no story attached to any of them.

        Rendered at a single tone rather than in their own colours, which is
        the same treatment the home page band uses: six palettes in a row fight
        each other and the point is the set, not any one of them.
      */}
      <Section spacing="none" className="pb-16 lg:pb-20">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Clients
          </h2>
          <ul className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-8 border-y border-foreground/10 py-8 sm:grid-cols-3 lg:grid-cols-6">
            {clientLogos.map((client) => (
              <li key={client.name} className="flex items-center justify-center">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={140}
                  height={44}
                  className="h-8 w-auto object-contain opacity-55 grayscale transition-opacity hover:opacity-100 dark:invert"
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The stories. */}
      <Section spacing="none" className="pb-20 lg:pb-28">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Client stories
          </h2>

          {studies.length > 0 ? (
            <ul className="mt-6 border-t border-foreground/10">
              {studies.map((study) => (
                <StudyRow key={study.slug} study={study} />
              ))}
            </ul>
          ) : (
            /*
              No written studies. This says so in one line rather than showing
              invented ones, and the reader carries straight on into the proof
              that is real. Same principle as the blog categories: a placeholder
              tells a visitor the site is unfinished and wastes the click.
            */
            <p className="mt-6 max-w-2xl border-t border-foreground/10 pt-8 text-lg text-muted-foreground leading-relaxed">
              None are written up yet. What follows is the proof that does not
              need one, including reviews clients left themselves and the
              places we have sat down with them.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}

/**
 * One story on the index.
 *
 * A wide row rather than a card, following the reference. The image sits on
 * the right at a letterbox crop, which lets four of these stack without the
 * page running to four screens.
 */
function StudyRow({ study }: { study: CaseStudy }) {
  return (
    <li className="border-b border-foreground/10">
      <Link
        href={`/resources/case-studies/${study.slug}`}
        className="group/study grid items-center gap-6 py-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-14 lg:py-10"
      >
        <span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {study.client}
            <span aria-hidden className="text-foreground/25">
              ·
            </span>
            {study.industry}
          </span>

          <span className="mt-3 flex items-start gap-3 font-display text-2xl lg:text-3xl tracking-tight leading-tight">
            {study.title}
          </span>

          <span className="mt-4 block max-w-2xl text-muted-foreground leading-relaxed">
            {study.summary}
          </span>

          <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Full story
            <ArrowRight
              aria-hidden
              className="w-3.5 h-3.5 transition-transform group-hover/study:translate-x-1"
            />
          </span>
        </span>

        {/* Decorative: the row is one link already named by the headline. */}
        <span className="relative block aspect-[16/9] w-full overflow-hidden lg:aspect-[3/2]">
          <Image
            src={study.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 22rem, 100vw"
            className="object-cover transition-transform duration-500 group-hover/study:scale-[1.03]"
          />
        </span>
      </Link>
    </li>
  );
}
