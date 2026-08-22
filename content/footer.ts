import type { SocialLink } from "./types";

/**
 * Footer navigation.
 *
 * Rebuilt on 19 August 2026 when the site became more than one page. Every
 * entry used to be a same-document anchor, which stopped working the moment
 * the sections were split across routes.
 *
 * !! LINKS THAT GO NOWHERE ARE NOT LISTED !!
 *
 * The template shipped four columns, and eleven of its twenty links pointed at
 * `#`. Two more pointed at `#developers`, a section renamed to audiences long
 * before the split and gone since. A footer full of dead links is worse than a
 * short footer. It tells a visitor the site is unfinished, and it wastes the
 * one place people look when they want to reach somebody.
 *
 * So an entry appears here only once it has a destination, and the groups that
 * were pure fiction are gone.
 *
 * The Developers column went first and is not coming back. It listed
 * Documentation, API Reference, SDK and Status for a services company with no
 * SDK, which is the claim the old developers section was replaced for making.
 *
 * !! STILL TO ADD !!
 *
 * About, Careers, Privacy and Terms all belong in a footer and none of them
 * have a page yet. docs/positioning.md also wants the ready-made product
 * catalogue down here rather than in the main menu, which needs its own group
 * once somebody decides which products to list.
 *
 * Rebuilt again on 20 August 2026 for the silo. The two groups are not the
 * main menu repeated. Services lists all five silo parents flat, since
 * somebody who has read to the bottom of a page already knows which one they
 * want and should not have to open a menu to reach it. Company collects
 * everything that is not a service.
 *
 * How we work and Case studies both live one level down in the header, inside
 * the Services and Resources panels. This is the only place either is reachable
 * from every page without opening something.
 */
export const footerLinks = {
  Services: [
    { name: "AI Integration", href: "/services/ai-software-integration" },
    { name: "Workflow Automation", href: "/services/ai-workflow-automation" },
    { name: "AI MVP Development", href: "/services/custom-ai-mvp-development" },
    { name: "Data & Analytics", href: "/services/ai-data-predictive-analytics" },
    { name: "Custom Models & Voice", href: "/services/custom-ai-models-voice" },
  ],
  Company: [
    { name: "Industries", href: "/industries" },
    { name: "How we work", href: "/how-we-work" },
    { name: "Case studies", href: "/resources/case-studies" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ],
};

/**
 * The company's own profiles.
 *
 * The template listed Twitter, GitHub and LinkedIn all pointing at `#`, and
 * this array stayed empty until real accounts were supplied. They now are: all
 * four were read on 22 August 2026 from the `sameAs` array in the Organization
 * schema hitasoft.com publishes about itself, which is the company naming its
 * own profiles rather than anybody guessing at URLs.
 *
 * !! THIS LIST IS ALSO THE sameAs ON THE ORGANIZATION SCHEMA !!
 *
 * app/layout.tsx reads it. `sameAs` is how a search engine ties this site to
 * those profiles and resolves them into one entity, so a wrong URL here is
 * worse than a missing one: it claims a relationship to an account that is not
 * ours.
 *
 * No GitHub, and not because one does not exist. It is questionable for this
 * company either way, since the buyer in docs/positioning.md often has no
 * developers at all.
 */
export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/hitasoft" },
  { name: "YouTube", href: "https://www.youtube.com/@hitasoft" },
  { name: "Instagram", href: "https://www.instagram.com/hitasoft_technology_solutions/" },
  { name: "Facebook", href: "https://www.facebook.com/hitasoft/" },
];
