import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, the fifth industry page.
 *
 * !! MODERATION IS SCOPED TO A COHORT HERE, ON PURPOSE !!
 *
 * docs/hitasoft_ai_architecture_strategy.md settles the split: EdTech owns
 * moderation of course cohorts, and /industries/media-and-communities owns it
 * for open and closed social platforms. The brief asked for a full "Community
 * Feed Moderation" section, which is the media page's whole first act. So the
 * use case here is a course forum, it says out loud that it is moderation
 * inside a course rather than across a public feed, and the page leads on
 * recitation and marking instead.
 *
 * That is also why the media page got only one line about recitation. The two
 * pages trade their second subject to each other rather than both claiming it.
 *
 * !! THE STORE REVIEW AND EDGE AI CLAIMS ARE DECLINED AGAIN !!
 *
 * Third brief running to ask for "bulletproof app store approval", passing
 * "the most rigorous" Google Play reviews, and a "12-tester" beta track. No
 * supplier controls a reviewer's decision, and Play's twelve testers over
 * fourteen days is a rule for personal developer accounts rather than the
 * organisation accounts these clients hold. The store answer lives in the
 * security section, scoped to what a build actually controls.
 *
 * "An edge or cloud-based model instantly transcribes" is the third appearance
 * of edge AI, which nothing here has shipped. The workflow step says hardware
 * you choose, which is true and is the part that matters to a school.
 *
 * !! NO ACCURACY FIGURE, AND THE FAQ SAYS WHY !!
 *
 * The brief has the model evaluating "pronunciation, pacing, and accuracy"
 * instantly. Speech recognition is measurably worse on children and on strong
 * accents, which is most of this audience, so the first FAQ leads on that gap
 * rather than burying it. A platform that grades on a number it has not
 * measured is the failure mode worth naming.
 *
 * Copy and metadata live in content/industry-landings.ts. The short form entry
 * in content/industries.ts stays, because the menu card and the breadcrumb
 * trail still read from it.
 */
const route = industryLandingRoute("/industries/edtech-and-learning");

export const metadata = route.metadata;
export default route.Page;
