import type { Block } from "@/lib/posts";

/**
 * The privacy and cookie policy, in the same `Block[]` shape a blog post's
 * body uses.
 *
 * !! WRITTEN THIS WAY ON PURPOSE, NOT AS A ONE-OFF STRING OF JSX !!
 *
 * components/primitives/rich-text.tsx (`BodyBlock`) and
 * components/sections/post-contents.tsx (`Contents`) already render exactly
 * this: headings, paragraphs, lists and a table, plus a contents panel that
 * tracks scroll position, built once for articles and reused a second time
 * for a job description in components/sections/career-detail.tsx. A legal
 * page is the same job a third time - a single column of prose that needs a
 * contents panel - and a third bespoke renderer for it would be the thing
 * that file was extracted to avoid.
 *
 * !! EVERY FACT BELOW IS SOMETHING THE CODE ACTUALLY DOES, READ OFF IT !!
 *
 * Same claims discipline as docs/positioning.md applies to a privacy policy
 * with more force than to marketing copy, because a wrong sentence here is
 * not an exaggeration, it is a false statement about what happens to a
 * visitor's data. Every processor named below is a real dependency: Google
 * Analytics (components/analytics/google-analytics.tsx), Cloudflare
 * Turnstile (components/quote/turnstile.tsx, app/api/contact/route.ts),
 * Anthropic's API (lib/quote-estimate.ts) and youtube-nocookie.com
 * (components/sections/video-modal.tsx). Nothing here claims a certification
 * or a compliance status this company has not confirmed it holds - see the
 * note at the top of content/security.ts for why that line is not one to
 * cross for a paragraph's sake.
 *
 * !! NO COOKIE BANNER EXISTS. THIS PAGE DESCRIBES WHAT HAPPENS, NOT A CONTROL
 * THAT ISN'T THERE !!
 *
 * The rights and cookie sections point a visitor at their own browser
 * settings and at Google's opt-out add-on, because that is what is actually
 * available today. If a consent banner ships later, gating analytics behind
 * it, the cookies section here needs rewriting alongside it rather than
 * left describing a page that no longer works the way it says.
 *
 * Retention is stated as "no fixed schedule yet" rather than a specific
 * number of days, because no deletion job exists in the code. Writing a
 * number here would be inventing a policy instead of describing one.
 */
export const legalUpdated = "30 August 2026";

export const privacyBody: Block[] = [
  {
    kind: "p",
    text: "This page describes what hitasoft.com collects from a visitor, what it is used for, and who it is shared with. It covers this website. It does not cover a system we build or run for a client, which is governed by that client's own contract with us.",
  },
  {
    kind: "p",
    text: "Hitasoft is based in Madurai, India, and is the company responsible for this site and everything described below.",
  },
  { kind: "h2", text: "Information you give us directly" },
  {
    kind: "p",
    text: "The contact form asks for your name, email, company and phone number, plus whatever you write in the message field. We use it to reply to you, and for nothing else.",
  },
  {
    kind: "p",
    text: "The quote assistant works the same way. Anything you type into it, and any document you upload while using it, is read to answer your questions and to put together a project estimate.",
  },
  {
    kind: "p",
    text: "If you ask the assistant to connect you with someone directly, we send a one-time code to the email address or WhatsApp number you give us first. That confirms it is really yours before we hand over a direct contact.",
  },
  { kind: "h2", text: "Information collected automatically" },
  {
    kind: "p",
    text: "Once you scroll, click, tap or type on a page, this site loads Google Analytics. It records which pages you visit, roughly where from, and general details about your device, none of it tied to your name.",
  },
  {
    kind: "p",
    text: "Analytics only runs on the live site, and only in a browser that lets it.",
  },
  { kind: "h2", text: "Cookies and similar technology" },
  {
    kind: "p",
    text: "A cookie is a small file a site asks your browser to store. Here is what this one sets.",
  },
  {
    kind: "table",
    head: ["Name", "Set by", "Purpose", "Expiry"],
    rows: [
      ["_ga", "Google Analytics", "Tells a returning visit apart from a new one.", "2 years"],
      ["_ga_<container ID>", "Google Analytics", "Keeps track of one browsing session.", "2 years"],
      ["cf_clearance", "Cloudflare Turnstile", "Confirms a form is being sent by a person, not a script.", "30 minutes"],
    ],
  },
  {
    kind: "p",
    text: "Your light or dark theme choice is kept in your browser's local storage rather than a cookie. It stays on your device and is never sent anywhere.",
  },
  {
    kind: "p",
    text: "You can block or delete any of these through your browser's own settings. Doing so may make the theme toggle forget your choice, and may stop Cloudflare from being able to confirm a form submission is genuine.",
    links: [{ phrase: "browser's own settings", href: "https://www.google.com/chrome/answer/95647" }],
  },
  {
    kind: "p",
    text: "Google also publishes a browser add-on that opts you out of Analytics on every site that runs it, this one included.",
    links: [{ phrase: "a browser add-on", href: "https://tools.google.com/dlpage/gaoptout" }],
  },
  { kind: "h2", text: "Who we share information with" },
  {
    kind: "p",
    text: "We do not sell anything collected here. It reaches the following, each under its own privacy policy rather than ours.",
  },
  {
    kind: "list",
    items: [
      "Google, which runs the analytics described above.",
      "Cloudflare, which checks that a form submission is not automated.",
      "Anthropic, whose model answers the quote assistant and drafts project estimates from what you tell it.",
      "Our email provider, which delivers a contact form or enquiry to our team's inbox.",
      "YouTube, only if you press play on an embedded video. It loads from youtube-nocookie.com, which sets no tracking cookie until you do.",
    ],
  },
  { kind: "h2", text: "Where it goes" },
  {
    kind: "p",
    text: "Google, Cloudflare and Anthropic all run infrastructure outside India, mainly in the United States and the European Union. Whatever reaches them is processed there, under their own safeguards rather than ours.",
  },
  { kind: "h2", text: "How long we keep it" },
  {
    kind: "p",
    text: "We keep a contact form submission or a quote assistant conversation for as long as we need it to answer you and for our own records. There is no fixed deletion schedule yet. Write to us and ask, and we will delete what we hold on you.",
  },
  { kind: "h2", text: "Your rights" },
  {
    kind: "p",
    text: "Wherever you are, you can ask what we hold about you, ask us to correct it, or ask us to delete it. Write to info@hitasoft.com and we will act on it.",
    links: [{ phrase: "info@hitasoft.com", href: "mailto:info@hitasoft.com" }],
  },
  {
    kind: "p",
    text: "If a law where you live gives you further rights, such as the GDPR in the EU and UK or the CCPA in California, those rights apply here too. Contact us to exercise any of them.",
  },
  { kind: "h2", text: "Children" },
  {
    kind: "p",
    text: "This site is not directed at children, and we do not knowingly collect anything from anyone under 16. Tell us if you believe a child has given us information, and we will remove it.",
  },
  { kind: "h2", text: "Changes to this policy" },
  {
    kind: "p",
    text: "We update this page whenever what the site collects changes. The date at the top is the last time that happened.",
  },
  { kind: "h2", text: "Contact us" },
  {
    kind: "p",
    text: "Questions about this policy, or a request under any of the rights above, go to info@hitasoft.com or to our office at Door No 9/1, Karthick Center, Kamala First Street, Chinna Chockikulam, Madurai 625002, Tamil Nadu, India.",
    links: [{ phrase: "info@hitasoft.com", href: "mailto:info@hitasoft.com" }],
  },
];
