/**
 * Where case studies come from.
 *
 * !! A CASE STUDY IS EVIDENCE, NOT COPY !!
 *
 * Everything else on this site is a claim about what Hitasoft does. A case
 * study is a claim about a named third party: their industry, their headcount,
 * their problem, and a number describing what changed. Getting one wrong is a
 * different order of mistake from a loose adjective, and docs/positioning.md
 * line 199 puts it plainly: do not attach client logos or numbers to companies
 * that are not clients.
 *
 * So nothing here may be published until somebody has the engagement written
 * up and the client has agreed to it. The six real client logos in
 * content/testimonials.ts are vetted and may be shown as a client row. They
 * may not be given an invented story.
 *
 * The seam works the same way as lib/posts.ts: replace the body of
 * `caseStudies` and nothing else changes.
 */

/** One written up engagement. */
export type CaseStudy = {
  /** Last segment of the URL. */
  slug: string;
  /** The headline, phrased as what the client did rather than what we sold. */
  title: string;
  /** Client name, as they want it written. */
  client: string;
  /** Path under /public, or absent where the client will not be named. */
  logo?: string;
  industry: string;
  /** Headcount band, e.g. "50 to 200". */
  companySize: string;
  location: string;
  /** The paragraph beside the hero image. Also the meta description source. */
  summary: string;
  /** Path under /public. */
  image: string;
  /**
   * The figures.
   *
   * !! EVERY ONE OF THESE HAS TO COME FROM THE CLIENT !!
   *
   * A percentage nobody measured is the exact failure this site was already
   * cleaned of once, where the template attributed "98% faster deployment" to
   * Stripe. If a number cannot be sourced, the study runs without one. An
   * empty list renders nothing rather than a gap.
   */
  results: { value: string; label: string }[];
  challenge: string;
  approach: string;
  outcome: string;
  /** Their words, unedited, with permission. Absent is fine. */
  quote?: { text: string; name: string; role: string };
  /** The service page this engagement belongs to. Feeds the silo. */
  sendsTo: string;
};

/**
 * !! FLIP THIS TO false BEFORE LAUNCH !!
 *
 * True serves four invented engagements from content/case-studies-sample.ts so
 * the index and the detail page can be judged with content in them. Turned on
 * 21 August 2026 for a design review.
 *
 * The sample companies are fictional and are deliberately not the six real
 * clients named in content/testimonials.ts. A placeholder story under an
 * invented name is a layout exercise. The same story under a real client's
 * name is a false statement about somebody else's business.
 */
const USE_SAMPLE_CASE_STUDIES = true;

/** Every case study, newest first. */
export async function caseStudies(): Promise<CaseStudy[]> {
  if (!USE_SAMPLE_CASE_STUDIES) return [];
  const { sampleCaseStudies } = await import("@/content/case-studies-sample");
  return sampleCaseStudies;
}

/** One by slug, or undefined. */
export async function caseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  return (await caseStudies()).find((study) => study.slug === slug);
}

/**
 * Others to read after this one.
 *
 * Same industry first, because "who else in my sector" is the question a
 * reader actually has, then anything else to fill the row. Never includes the
 * study being read.
 */
export async function relatedCaseStudies(slug: string, limit = 2): Promise<CaseStudy[]> {
  const all = await caseStudies();
  const current = all.find((study) => study.slug === slug);
  if (!current) return [];

  const others = all.filter((study) => study.slug !== slug);
  const sameIndustry = others.filter((study) => study.industry === current.industry);
  const rest = others.filter((study) => study.industry !== current.industry);

  return [...sameIndustry, ...rest].slice(0, limit);
}
