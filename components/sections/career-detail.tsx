import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { BodyBlock } from "@/components/primitives/rich-text";
import type { Job } from "@/lib/careers";

/**
 * One open position.
 *
 * Structure borrowed from components/sections/case-study.tsx: a back link
 * rather than a breadcrumb trail (a reader lands here from the index), a
 * spec column against the description, same as that page runs Company /
 * Industry / Company size / Location against the narrative.
 *
 * !! THE APPLY LINK APPEARS TWICE, AND BOTH TIMES ARE mailto: !!
 *
 * Once solid and prominent above the fold, once as text beside the spec
 * column further down, matching the "You want to know this story?" link in
 * case-study.tsx. A mailto: rather than a form: content/careers.ts already
 * explains why nothing invented sits on this page, and the same discipline
 * applies to the apply flow. A form implies the site does something with a
 * submission (store it, forward it, acknowledge it) and none of that exists
 * for an application the way it does for /contact. mailto: promises exactly
 * what it does: it opens a message to a real inbox, addressed by whoever
 * wrote the listing in Strapi.
 */
export function CareerDetail({ job }: { job: Job }) {
  const applyHref = `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <Container>
          <Link
            href="/careers"
            className="group/back inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="w-3.5 h-3.5 transition-transform group-hover/back:-translate-x-1" />
            Back to careers
          </Link>

          <h1 className="mt-8 max-w-4xl text-4xl lg:text-6xl font-display tracking-tight leading-[1.02]">
            {job.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {job.summary}
          </p>

          <a
            href={applyHref}
            className="group/apply mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Apply for this role
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover/apply:translate-x-1" />
          </a>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
            {/* Same sticky-wrapper-not-the-dl note as case-study.tsx: the
                apply link has to travel with the facts on a long listing. */}
            <div className="h-fit lg:sticky lg:top-32">
              <dl className="border-t border-foreground/10">
                {[
                  { label: "Department", value: job.department },
                  { label: "Location", value: job.location },
                  { label: "Type", value: job.employmentType },
                  { label: "Posted", value: formatDate(job.postedDate) },
                ].map((row) => (
                  <div key={row.label} className="border-b border-foreground/10 py-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="mt-1.5">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <a
                href={applyHref}
                className="group/call mt-8 inline-flex items-center gap-3 text-sm leading-snug transition-colors hover:text-primary"
              >
                <Mail aria-hidden className="w-4 h-4 shrink-0 text-primary" />
                <span className="underline decoration-foreground/25 underline-offset-4 transition-colors group-hover/call:decoration-primary">
                  Email your application
                </span>
              </a>
            </div>

            <div className="max-w-3xl">
              {job.description.map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/** Mirrors formatDate in components/sections/post.tsx. Small enough, and
 * specific enough to a date coming off a CMS field, that a shared module for
 * one six line function was not worth the indirection. */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
