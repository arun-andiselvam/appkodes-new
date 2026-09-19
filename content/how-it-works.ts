import type { Step } from "./types";

/**
 * The engagement, not a product tour.
 *
 * The old version walked through connecting tools and shipping to production,
 * which describes software the visitor would operate themselves. We are hired
 * to do the work, so the three steps are review, build and run.
 */
/*
 * Rewritten 18 September 2026 for Appkodes. appkodes.com lists nine steps
 * (data gathering, UI/UX, prototype, development, QA, deployment, support,
 * GTM, bootstrapping). They are grouped into the three phases this panel is
 * built for, laid over the 30 days the hero promises.
 */
export const steps: Step[] = [
  {
    number: "I",
    title: "We plan it with you",
    description:
      "We start with your goals and your users. You see and click through the screens before a single line of code is written.",
    duration: "Week 1",
    panelLabel: "what you get",
    output: `Your goals and requirements written down
Screens designed for your users
A clickable prototype to try
A fixed price and a launch date`,
  },
  {
    number: "II",
    title: "We build and test it",
    description:
      "Our developers build the app while testers check every screen. A new build lands on your phone every week, so launch day holds no surprises for anyone.",
    duration: "Weeks 2 to 4",
    panelLabel: "what we do",
    output: `Native or cross platform, as agreed
A test build on your phone every week
Every screen tested before release
Bugs fixed before your users find them`,
  },
  {
    number: "III",
    title: "We launch it and stay with you",
    description:
      "We publish the app to both stores and help you find the first people who will pay for it. After launch we keep it running and current.",
    // "About": heavier builds such as OTT take longer (docs/positioning.md §6).
    duration: "From about day 30",
    panelLabel: "what happens next",
    output: `Published to the App Store and Google Play
A launch plan for your first users
Bug fixes and store updates
A monthly report in plain words`,
  },
];
