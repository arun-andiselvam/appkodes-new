import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { careersCopy, noOpenRolesCopy } from "@/content/careers";
import { careerListings, type Job } from "@/lib/careers";

/**
 * The careers index.
 *
 * Same shape as components/sections/case-studies-index.tsx: a title, then
 * the listings as full width rows. No image per row, unlike a case study —
 * a job posting has no photograph to run and a stock one would be exactly
 * the kind of invented content content/careers.ts argues against.
 *
 * !! THE EMPTY STATE IS THE SAME PRINCIPLE AS THE CASE STUDY INDEX'S !!
 *
 * `noOpenRolesCopy` renders in place of the list when careerListings()
 * returns nothing, whether that is Strapi not configured or genuinely no
 * open roles. Both cases get the same honest one line rather than an empty
 * page or, worse, an invented listing.
 */
export async function CareersIndex({ path }: { path: string }) {
  const jobs = await careerListings();

  return (
    <Section spacing="none" className="pt-24 lg:pt-28 pb-20 lg:pb-28">
      <Container>
        <Breadcrumbs path={path} />
        <Eyebrow className="mb-6">{careersCopy.eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-5xl lg:text-7xl font-display tracking-tight leading-[0.95]">
          {careersCopy.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
          {careersCopy.description}
        </p>

        <h2 className="mt-16 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Open roles
        </h2>

        {jobs.length > 0 ? (
          <ul className="mt-6 border-t border-foreground/10">
            {jobs.map((job) => (
              <JobRow key={job.slug} job={job} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-2xl border-t border-foreground/10 pt-8 text-lg text-muted-foreground leading-relaxed">
            {noOpenRolesCopy}
          </p>
        )}
      </Container>
    </Section>
  );
}

/** One listing on the index. A row rather than a card, matching StudyRow in
 * case-studies-index.tsx: it stacks better than a grid of cards once there
 * are more than a handful, and this list has no image competing for width. */
function JobRow({ job }: { job: Job }) {
  return (
    <li className="border-b border-foreground/10">
      <Link
        href={`/careers/${job.slug}`}
        className="group/job flex flex-col gap-3 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-10"
      >
        <span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {job.department}
            <Dot />
            {job.location}
            <Dot />
            {job.employmentType}
          </span>

          <span className="mt-3 flex items-start gap-3 font-display text-2xl lg:text-3xl tracking-tight leading-tight">
            {job.title}
          </span>

          <span className="mt-3 block max-w-2xl text-muted-foreground leading-relaxed">
            {job.summary}
          </span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          View role
          <ArrowRight
            aria-hidden
            className="w-3.5 h-3.5 transition-transform group-hover/job:translate-x-1"
          />
        </span>
      </Link>
    </li>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-foreground/25">
      ·
    </span>
  );
}
