import { industryLandingRoute } from "@/lib/industry-landing-route";

/*
 * The long form page, not the shared silo blueprint.
 *
 * Built 23 August 2026, the fourth industry page.
 *
 * !! TWO KEYWORDS THE STRATEGY DOC ASSIGNS HERE ARE DELIBERATELY ABSENT !!
 *
 * docs/hitasoft_ai_architecture_strategy.md lists `secure AI for telehealth
 * consulting` and `compliant AI app development` against this page, and flags
 * in the same paragraph that three pages are competing for them. Both are
 * resolved elsewhere now. Telehealth belongs to the healthcare page built the
 * day before this one, which carries `telehealth AI integration` in its own
 * copy. Compliant app development belongs to the Secure AI & Compliance
 * Architecture service page. This page owns moderation for open and closed
 * social platforms, which is what the same doc says it should own.
 *
 * !! NOTHING HERE PROMISES A STORE REVIEW OUTCOME !!
 *
 * The brief asked for "bulletproof app store approval", copy about passing
 * "the most rigorous" reviews, and preventing Play Store rejections. No
 * supplier controls what a reviewer decides. What a build does control is the
 * data safety declaration matching the code, and permissions being requested
 * at the point of use, which is what most rejections are actually about. The
 * page claims that and then says plainly where the claim stops.
 *
 * Auto removal was the other thing declined. The brief has the model
 * "flagging or removing inappropriate material before it reaches the broader
 * community", with nobody in the loop. See the workflow section: a moderator
 * sits at the last step, and the FAQ says why a wrong removal costs a
 * community more than a slow one.
 *
 * Copy and metadata live in content/industry-landings.ts, which carries the
 * rest of the notes. The short form entry in content/industries.ts stays,
 * because the menu card and the breadcrumb trail still read from it.
 */
const route = industryLandingRoute("/industries/media-and-communities");

export const metadata = route.metadata;
export default route.Page;
