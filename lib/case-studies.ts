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

/**
 * One act of the narrative: a paragraph that frames it, then the specifics.
 *
 * `points` may be empty, which renders the paragraph alone. That is the right
 * shape for a short engagement and the wrong shape for most of them, since the
 * itemised half is what a reader scans for their own situation.
 */
export type StudyAct = {
  body: string;
  points: { title: string; body: string }[];
};

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
  /**
   * The three acts, each an opening paragraph and then itemised.
   *
   * !! THESE WERE THREE BARE PARAGRAPHS AND THAT WAS NOT ENOUGH !!
   *
   * The first real study shipped that way on 24 August 2026 and the client
   * read it back the same day: too thin to do the job a case study exists to
   * do. A visitor is not reading to admire the work. They are checking whether
   * their own mess appears anywhere in it, and one paragraph of prose gives
   * them nothing to scan for. Named, itemised problems do.
   *
   * `challenge.points` and `approach.points` are written to be read side by
   * side and in the same order. Point three of the answer answers point three
   * of the problem. Nothing in the markup enforces that, because a study may
   * genuinely have four problems and three answers, but a study where the two
   * lists have drifted out of order is a study that has stopped arguing.
   *
   * `outcome.points` is optional. Some studies end on a paragraph and should.
   */
  challenge: StudyAct;
  approach: StudyAct;
  outcome: StudyAct;
  /** Their words, unedited, with permission. Absent is fine. */
  quote?: { text: string; name: string; role: string };
  /** The service page this engagement belongs to. Feeds the silo. */
  sendsTo: string;
};

/**
 * Every case study, newest first.
 *
 * !! THE SAMPLE SEAM IS GONE, AND IT SHOULD STAY GONE !!
 *
 * A `USE_SAMPLE_CASE_STUDIES` flag stood here from 21 August 2026, serving
 * four invented engagements out of content/case-studies-sample.ts so the index
 * and the detail template could be reviewed with something in them. Switching
 * it off before launch was one of the two blockers docs/page-progress.md
 * tracked.
 *
 * Removed on 24 August 2026, along with the sample file and its four
 * placeholder photographs, when the first real study arrived. Do not
 * reintroduce it. The template has real content to be judged against now, and
 * a flag that serves fabricated stories under company names is one careless
 * deploy away from publishing them.
 *
 * Still async, because every caller awaits it and a real source, a CMS or a
 * database, will want to be.
 */
export async function caseStudies(): Promise<CaseStudy[]> {
  const { caseStudies: studies } = await import("@/content/case-studies");
  return studies;
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
