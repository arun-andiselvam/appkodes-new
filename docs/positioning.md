# Positioning reference

Working reference for the Appkodes site rebuild. Copy decisions, audience and
voice rules live here so they survive between sessions. Last updated 18 August 2026.

Related files: [design-system.md](./design-system.md) for the visual system,
[humanizer-skill.md](./humanizer-skill.md) for the editing rules every piece of
published copy has to pass.

---

## The business

Appkodes is a software services company, not a software product. Nothing on the
site should imply self-serve signup, seats or subscriptions.

Verified facts from appkodes.com, safe to use as proof:

- 15 years of delivery
- 1000+ clients worldwide. appkodes.com also shows 280 under "happy clients
  globally", but 1000+ is the figure to publish, confirmed 18 August 2026.
- 2000+ projects delivered
- Delivery presence in India, Indonesia, Dubai, Vietnam and Sharjah
- Engagement models offered: Fixed Price, Hire Our Developer, Onsite Development

Existing catalogue of ready made products (Uber, Airbnb, TikTok style scripts)
still sells, but it stays in the footer. A buyer evaluating a migration partner
should not meet a clone script in the main navigation.

## Who we are selling to

**SMBs, startups and mid size companies. Not enterprises.**

Roughly 10 to 500 people. The person reading the site is a founder, a CTO, or
the one operations lead who owns "the systems". Often there is no internal IT
department at all.

This decision was made on 18 August 2026 and it overrides the earlier enterprise
framing. Any copy that says "enterprise", "CIO", "procurement" or
"transformation programme" is wrong and should be rewritten.

### What this buyer fears

1. Cost that is not predictable. There is no budget line for open ended discovery.
2. Being left with something nobody in house understands.
3. Downtime, because a week of broken systems is existential at this size.
4. Another AI project that dies at proof of concept.
5. Lock in to a vendor they cannot leave.

### What converts them

Speed, a fixed price, and a first step small enough to say yes to without a
board. Show the deliverable and name the duration. Vague scoping is what stalls
this buyer, not price.

### How this differs from the enterprise pitch

| Enterprise framing (wrong) | SMB framing (right) |
| --- | --- |
| Risk registers, governance, compliance programmes | Fixed price, clear timeline, working system |
| "Zero downtime cutover" | "Your business does not stop" |
| "Migration programme" | "We automate that for you" |
| Multi quarter roadmaps | Weeks, not quarters |
| Speaks to a committee | Speaks to one person who decides |

The old appkodes promise, shipping a product in a month, is closer to this
audience than the enterprise pitch ever was. Speed is an asset again.

## Industries named on the site

Healthcare, Financial Services, Retail and eCommerce, Logistics and Mobility,
Manufacturing and Supply Chain, Media and Entertainment, Real Estate and
Hospitality.

The hero headline rotates only four of these: healthcare, finance, retail,
logistics. The headline cycles every 2.5 seconds, so a longer list means the
best segments never appear on screen. The full seven belong in the Industries
menu.

## The offer

First step is a fixed scope assessment. The visitor leaves with a migration
blueprint and a costed risk register, theirs to keep whether or not they
continue.

**Unconfirmed and needs a decision:** whether the assessment is free or paid,
and whether two weeks is the real duration. Current copy says two weeks. If it
is free, say so loudly. If it is paid, name the price, because a named price
reads as confidence.

## Vocabulary

Decided 18 August 2026. "Migration" was the working word and it is wrong. It
means moving from one place to another, which describes only half the work.

The job is either putting AI into a system the client already runs, or building
the replacement. Either way the point is that software takes over work people
were doing by hand. The word for that is **automation**.

| Do not use | Use |
| --- | --- |
| AI migration | AI automation |
| migrate | automate |
| workload, cutover | process, system |
| migration blueprint | costed plan |
| legacy modernization | less manual work |

Plain speech wins with this audience. A founder says "we automate that". Nobody
in a 40 person company says "we are running a migration programme".

## Voice rules

Every published sentence passes [humanizer-skill.md](./humanizer-skill.md).
The rules that bite most often here:

- No em dashes and no semicolons anywhere.
- Alternate sentence length. Short runs 8 to 10 words, long runs 15 to 25.
  Never write 11 to 14 words.
- Any inline list of three or more items gets cut to two.
- No gerund openers, no rhetorical questions, no "not just A but also B".
- Banned: leverage, comprehensive, seamlessly, cutting edge, innovative,
  empower, harness, game changer, revolutionise.
- No adjective or adverb repeats across a section.

Microcopy exception: buttons, eyebrows and headline fragments are allowed under
seven words. Padding a button to hit a word count makes the copy worse.

## Claims discipline

Never publish a claim the company cannot back.

- Do not name HIPAA, SOC 2 or GDPR certification until Appkodes confirms it
  holds or handles them. Describe process instead.
- Do not attach client logos or numbers to companies that are not clients. The
  original template shipped fake claims like "98% faster deployment, STRIPE".
  Those are removed and must not return.
- Do not claim 15 years of AI work. The 15 years covers legacy to digital
  migration. AI is the current chapter of that practice.

## Decisions already made

- Brand colour is #0052CC, taken from design-system.md and matched against the logo.
- Fonts stay Instrument Sans and Instrument Serif. The Montserrat and Inter
  swap from design-system.md was tried and reverted on 18 August 2026.
- Products move out of the primary navigation into the footer.
- "Sign in" is removed. There is nothing to sign in to.
- Pricing tiers of $0 and $29 are wrong for a services business. That section
  becomes the three engagement models.

## Section decisions

### Track record (was "Infrastructure")

The template sold hosting: 17 data centres, a 99.99% uptime SLA and sub 50ms
latency. None of that is ours to claim, and an SLA is a contractual promise.

The section now carries proof of delivery. Left column runs 2000+ projects,
1000+ clients and 50+ countries. Right panel lists the regions clients sit in,
with a project count against each.

Two better versions of this panel exist once the numbers are available. Projects
by industry answers "have you done this in my sector", which beats "are you
real". Hours saved per automation type is stronger still, because it is
denominated in what the buyer actually wants. Both need real figures from
delivered work, so neither is written yet.

The panel lists client regions with the markets inside them and a project count
per region. An earlier version put the covering office in that column, so rows
read "Europe and UK, served from Madurai". That frames the whole business as
offshore delivery and works against the reach claim, so the offices are named
once in the paragraph instead.

**Blocking before launch.** Two things in this section are placeholders.

- The project split across regions is invented. It sums to the published 2,000
  total, but the distribution is a guess and must come from real records.
- The country lists inside each region are guesses too, apart from the markets
  where offices already sit.

Publishing either as fact repeats the mistake the template shipped with, where
"98% faster deployment" was attributed to Stripe. Replace both or remove the
column.

### Results (was "Live metrics")

The template counted a platform: API requests today, average response time and
uptime this quarter, under a pulsing green dot and a running clock. Appkodes
runs no API a client consumes, so all three described a different company. The
clock was the visitor's own browser time, which made "Live" the boldest false
claim on the page. One tile also said 184 countries served, a scroll below the
track record section saying 50+.

The section counts outcomes now, which is the version this document already
argued for. Four figures on four different axes: businesses automated, hours
handed back each week, weeks from first call to live, and the percentage cut
from what the process cost. Together they answer how many, how much, how long
and what it costs after.

The before figure sits in the detail line of the hours tile rather than in a
tile of its own. A saving and the thing it was saved from are one comparison,
and giving it two of four slots would have pushed the money off the row.

The client count here is the AI subset, so it is a smaller and later number
than the 1000+ on the rest of the site. That is the honest way round. Appkodes
has 15 years of delivery and rather less than that of AI work, and blurring
the two is already forbidden above.

Reusing 2000+, 1000+ and 50+ here was the obvious cheap fix and it is the wrong
one. The hero ticker spends all four verified figures and the track record
section spends three of them again. A third airing weakens them rather than
adding proof.

The nav link above this section read "Case Studies" and pointed at `#studio`.
It now reads "Results" and points at `#results`. Real case studies get their
own section once there is client work cleared to name.

**Blocking before launch.** All four figures are drafts.

- 40 businesses, 38 hours from 52, 6 weeks to live and 42% cut are invented.
  Every one needs a real figure out of delivery records.
- An earlier draft had one sourced number, two weeks to a costed plan, taken
  from the process in `content/how-it-works.ts`. Time to go live replaced it on
  19 August 2026 because it answers a better question. The trade is that the
  section now carries nothing sourced at all.

The drafts are arithmetically consistent and the real figures should stay that
way. 38 hours saved out of 52 is 73% of the labour, while the money saved reads
lower at 42% because tooling and our fee sit inside that number. Someone will
check.

The rule from the track record panel applies here without change. Publishing an
invented average repeats what the template did when it put "98% faster
deployment" next to Stripe.

### What we build with (was "Integrations")

The template listed twelve SaaS logos under "Works with everything you already
use" and "200+ pre-built integrations". Both are product claims from a company
that sells connectors. Appkodes sells the build, so the section says what the
work is made of instead.

One list used to be rendered twice, the second copy reversed, which meant the
two rows carried no extra information. They hold different lists now. The top
row is the models. The bottom row is the stack they get wired into, which is
the half that decides whether an automation survives contact with a real
business. Someone who can read the second row could hire another firm to keep
it running, and saying so out loud is how this section answers the lock in
fear without arguing about it.

**Model families, never version numbers.** A page naming "GPT-5" or "Claude
Opus 5" dates itself the week those are superseded, and a stale version number
on a services site reads worse than no number. Families move slowly enough to
publish. The category beside each name carries the job rather than a taxonomy,
because a founder with no IT department gets more from "documents nobody wants
to read" than from "LLM".

A third row names the build tooling, and it is a different question from the
other two. Everything in the stack row keeps running in the client's business
after we leave. Nothing in the build row does, so mixing them would blur the
one distinction the stack row exists to draw.

That row is half AI coding tools and half the checks around them, which is
deliberate. Coding assistants listed on their own invite the reader to ask what
they are paying for, since the same tools sit two clicks away from anybody with
a browser. Set beside the tests and the error tracking, the row says something
the visitor cannot do at home. We build at that speed and we catch what the
machine gets wrong. It also carries the 6 weeks claimed in the results section,
because a buyer who doubts the number can look at the row and see where the
time went.

Tools sold to people who would rather build than hire are left off on purpose.
Naming them argues the visitor should go away and do this themselves.

**Logos.** Marks come from the `simple-icons` package, bundled rather than
pulled from a CDN, so nothing on the page depends on somebody else's server
staying up. They render in the current text colour instead of brand colour.
Two dozen palettes across three rows would fight everything else on the page,
and one tone keeps the name doing the reading while the mark works as texture.
Dark mode then needs no second set of files.

Twenty four of the thirty two entries have a mark. The other eight fall back to
a lettered box at the same size. They never borrow another company's logo,
which matters most for GPT and Whisper, since both are OpenAI and a shared mark
would read as one product.

Worth knowing why four of those eight are missing. OpenAI, AWS, Twilio and
Playwright have had their icons pulled from the set, which happens when a brand
owner asks or the licence is unclear. Those companies restrict third party use
of their marks more actively than most.

**Trademark, needs a decision.** Showing vendor logos can read as a partnership
that does not exist. Naming tools you work with is ordinary practice and a
weaker claim than the client logos this document already bans, so the bar is
lower here. It is still a call somebody should make on purpose. Dropping to
names only costs nothing but the texture.

**Confirm before launch.** The three rows are a claim about what Appkodes has
worked with. Anything not actually delivered has to come off. A short honest
row beats a long one that invites a question nobody can answer.

**Known mismatch.** The Industries nav link still points at `#integrations`,
which is this section. It was already wrong when the section listed SaaS logos
and it is worse now that the section names models. Either the Industries
section gets built or that link needs somewhere else to go.

## Still to do

- Rewrite the process section. It still says "Three steps. Infinite
  possibilities." and shows a fake SDK code sample.
- Replace fictional testimonials with real clients.
- Supply the four real outcome figures for the Results section.
- Replace the pricing tiers with engagement models.
- Build the Industries section and the dropdown navigation once destination
  pages exist. The nav link points at the models section in the meantime.
- Confirm the model, stack and build tool lists against work actually delivered.
- Decide what fills the empty right side of the hero.
