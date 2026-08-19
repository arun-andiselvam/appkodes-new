import type { Assurance, AudienceSegment } from "./types";

/**
 * Who we work with, split by size.
 *
 * The section used to sell an SDK. It walked through npm install
 * @appkodes/sdk, an API key and a deploy call, under the headline "Built by
 * devs. For devs." None of that exists, and the buyer described in
 * docs/positioning.md often has no developers at all.
 *
 * The tabbed panel survives because the interaction is the best on the site.
 * What it holds changes completely. Instead of code the visitor will never
 * run, each tab answers the question they arrived with, which is whether we
 * have done this for somebody their size.
 *
 * Size is the cut, not industry. Industry changes the example. Size changes
 * the offer, because it decides who signs, how fast, and whether there is an
 * existing system to work on at all. Industry belongs in the Industries
 * section, which the nav already points at by mistake.
 *
 * Labels stay parallel across tabs on purpose. "You have" and "You do not
 * have" ask the same question of every segment, so switching tabs compares
 * answers rather than restarting. The emphasised row is the one exception and
 * it moves with the segment, because what sells is not the same fact twice.
 *
 * Time to live climbs across the tabs: four weeks, six, then eight. Read in
 * order it says the obvious true thing, that a bigger business takes longer,
 * and it keeps the six week average in the results section honest rather than
 * quietly contradicting it.
 *
 * The fourth tab is cut by relationship rather than size, which is why its
 * label does not name a headcount and why its time to live sits below every
 * other tab instead of above. That break is the point. Somebody scanning the
 * strip should notice the last one is a different kind of answer.
 */
export const audienceSegments: AudienceSegment[] = [
  {
    id: "startup",
    label: "Startup",
    headcount: "2 to 20 people",
    // The segment the positioning doc claims and never serves. A startup has
    // no manual process worth automating and no legacy system to move. What
    // it lacks is the product itself, which makes this the one segment where
    // the old catalogue of ready made bases is an advantage rather than an
    // embarrassment to keep in the footer.
    situation: "Two founders and a deadline",
    rows: [
      { label: "You have", value: "An idea and a runway" },
      { label: "You do not have", value: "Months to spend hiring" },
      { label: "We start from", value: "A working base, not a blank page" },
      // Four weeks revives the promise appkodes.com made for years, shipping a
      // product in a month. The positioning doc calls that promise closer to
      // this audience than the enterprise pitch ever was. It sits under the 6
      // week average in the results section rather than against it, because a
      // startup starts from a base and everyone else starts from a system.
      { label: "Live in", value: "4 weeks", emphasis: true },
      { label: "You pay", value: "A price named before we start" },
    ],
  },
  {
    id: "growing",
    label: "Growing business",
    headcount: "20 to 100 people",
    // The segment the positioning doc actually describes and the one the rest
    // of the site already speaks to. Unlike the startup, this buyer has
    // systems. What they do not have is anybody whose job those systems are,
    // which is why the work lands on one operations lead who never chose it.
    //
    // Fears two and three rule here, so the last two rows carry them. Being
    // left with something nobody in house understands, and a week of broken
    // systems, which at this size is existential rather than annoying.
    situation: "Everything runs through one person",
    rows: [
      { label: "You have", value: "Systems that mostly work" },
      { label: "You do not have", value: "Anyone whose job is the systems" },
      // Six weeks against the startup's four, and the gap is the point. A
      // startup starts from a base we already know. This buyer has a live
      // business we have to understand before touching, and the extra fortnight
      // is the two weeks of review in content/how-it-works.ts.
      { label: "Live in", value: "6 weeks", emphasis: true },
      { label: "While we build", value: "Nothing you run stops" },
      { label: "When we leave", value: "Your team knows how it works" },
    ],
  },
  {
    id: "established",
    label: "Established",
    headcount: "100 to 500 people",
    // What separates this segment is not size, it is memory. By this point
    // there is usually a dead pilot behind them, so fear four in
    // docs/positioning.md is not a worry to this reader but a scar. Naming it
    // in the situation line disarms faster than any reassurance would.
    //
    // Note what is absent. This buyer has budget and a technical evaluator,
    // which is exactly where enterprise language creeps back in. The
    // positioning doc bans procurement, governance and transformation
    // programme at every size, and none of it earns a place here either.
    situation: "The last AI project never shipped",
    rows: [
      { label: "You have", value: "A dev team and real systems" },
      { label: "You do not have", value: "A pilot that reached production" },
      // The emphasis leaves the clock for this one tab. Speed is not what this
      // buyer is short of. The echo against the row above is deliberate, since
      // the fear and the answer should use the same word.
      { label: "We ship to", value: "Production", emphasis: true },
      { label: "Live in", value: "8 weeks" },
      // Their engineers exist and will be in the room. Building alongside them
      // beats building around them, and it settles the fear of being left with
      // something nobody understands without having to promise anything.
      { label: "Your team", value: "Builds alongside ours" },
    ],
  },
  {
    id: "existing",
    label: "Already with us",
    headcount: "Already running our software",
    // The warm pipeline nobody had written down. Over a thousand clients bought
    // something from the catalogue, and docs/positioning.md mentions it only to
    // say the catalogue stays in the footer. That is right for the catalogue
    // and wrong for the customers, who are the one audience where Appkodes has
    // an advantage no competitor can answer.
    //
    // The advantage is not loyalty or a discount. It is that the discovery
    // everybody else has to charge for has already happened, because we wrote
    // the code. That is the whole tab.
    situation: "Your app works, it just does not think",
    rows: [
      { label: "You have", value: "An app we built for you" },
      { label: "You do not have", value: "A reason to start again" },
      { label: "We skip", value: "The part where we learn your code" },
      // Three weeks undercuts the startup's four and lands last in the strip,
      // so the tab that breaks the ascending pattern is also the payoff.
      { label: "Live in", value: "3 weeks", emphasis: true },
      { label: "You keep", value: "Everything that already works" },
    ],
  },
];

/**
 * What does not change with size, so it sits outside the tabs.
 *
 * The left column holds the constants and the right panel holds the
 * specifics. Each line answers one of the five fears in the positioning doc,
 * in the order that document ranks them.
 */
export const assurances: Assurance[] = [
  {
    title: "Fixed price",
    description: "Named before the work starts, not after it ends.",
  },
  {
    title: "Weeks, not quarters",
    description: "You see something working inside the first month.",
  },
  {
    title: "You own it",
    description: "The code and the accounts are in your name.",
  },
  {
    title: "One person to call",
    description: "Nobody sits between you and the people building.",
  },
];
