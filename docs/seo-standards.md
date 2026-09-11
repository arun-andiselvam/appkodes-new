# SEO standards

How every page on this site sets its keywords and its metadata. Written 22
August 2026, from the recommendations for `/services/ai-software-integration`,
which is the worked example throughout.

This lives in the repository rather than in anybody's private notes on purpose.
It has to be checkable by whoever writes the next page, it has to move with the
code when a rule changes, and a standard nobody else can read is not a standard.

Related: [positioning.md](./positioning.md) for voice and claims,
[hitasoft_ai_architecture_strategy.md](./hitasoft_ai_architecture_strategy.md)
for the silo each page belongs to.

---

## 1. One page owns one primary keyword

Every page declares a primary keyword and it belongs to that page alone.

**A parent never targets its child's phrase.** This has already gone wrong
once. `/services/ai-software-integration` and its child
`/services/custom-ai-api-integration` both carried
"Custom AI API Integration" in their titles, so the two competed and the parent
was set to outrank the page it exists to feed. Corrected 21 August 2026: the
parent owns the category term its own URL carries, and the child keeps the
specific one.

The test before publishing: search the repo for the phrase. If it appears as a
`metaTitle` on more than one page, one of them is wrong.

### Secondary keywords earn their place by matching a section

A secondary keyword is only worth listing if some part of the page already
answers it. On the worked example each one maps to a block that exists:

| Secondary term | The section that earns it |
| --- | --- |
| `add AI to existing software` | The H1 |
| `LLM API integration` | First capability card |
| `custom AI wrappers` | Second capability card |
| `legacy system AI upgrades` | Third capability card |

A term with no section behind it is a term the page will not rank for, and
adding one to the metadata to chase it produces a description that promises
something the page does not deliver.

---

## 2. The title budget is 49 characters, not 60

`app/layout.tsx` sets a title template of `%s - Hitasoft`, which appends **11
characters** to whatever a page declares. Google truncates around 60.

```
49 (the page's own title)  +  11 (" - Hitasoft")  =  60
```

So a page title over 49 characters gets cut, and the first thing lost is the
brand at the end.

This is the rule that is easiest to get wrong, because a title looks fine in
`content/` and only truncates in a search result nobody is looking at. The
recommendation this document came from proposed a 58 character title, which
would have rendered at 69 and been cut mid word.

**Shape:** `Primary keyword | short intent phrase`

| | |
| --- | --- |
| Good | `AI Software Integration \| Add AI to Existing Apps` (49) |
| Too long | `AI Software Integration Services \| Add AI to Existing Apps` (58) |
| Wasteful | `AI Software Integration Services` (32, half the budget unused) |

Use `absoluteTitle` in `lib/seo.ts` only for the home page. Every other page
keeps the brand suffix, and dropping it to buy characters trades recognition
for a phrase nobody searches.

**The one exception: blog posts, since 11 September 2026.** The client asked
for the suffix off every post, and `lib/post-route.tsx` passes
`absoluteTitle`. A post's title budget is therefore **60**, not 49. Ten titles
were flagged over budget that day, nine of them posts; with the suffix gone,
five of the nine fit as written and four still needed shortening. The argument
above still holds for every other page type.

---

## 3. The description is 150 to 160 characters and ends on the action

**Shape:** hook, then the primary keyword, then the secondary terms, then what
to do next.

The worked example, at 149:

> Rebuild nothing. AI software integration that adds LLM APIs and custom AI
> wrappers to the software and legacy systems you already run. Book a review.

- **Hook first.** Reuse the H1's argument. A description that opens with the
  company name spends its best characters on something the brand line already
  says.
- **Primary keyword verbatim**, early.
- **Secondary terms** as the middle, because that is where a description has
  room and where the page's own sections are being summarised anyway.
- **Close on the action.** The recommendation this came from dropped it; a
  description that stops describing is a description that stops converting.
- **No adjectives nobody would argue with.** "Powerful LLMs", "cutting edge",
  "comprehensive". In 160 characters an unarguable adjective is a wasted word,
  and `positioning.md` bans most of them outright.

Under 150 leaves room on the table. Over 160 gets cut.

---

## 4. What every page must emit

Set through `pageMetadata` in `lib/seo.ts`, which handles the canonical and the
Open Graph tags so no route writes them by hand.

- `title` and `description` to the budgets above
- `alternates.canonical` pointing at the page's own path, never a parent
- Open Graph title, description and URL agreeing with all three

Schema, by page type:

| Page type | Schema |
| --- | --- |
| Service landing | `Service` with `provider`, plus `FAQPage` |
| Industry landing | `Service` with `provider` and `audience`, plus `FAQPage` |
| Article | `BlogPosting`, plus `FAQPage` only where the piece really ends in a Q&A |
| Case study | `Article` with `about` naming the client |
| Any page below the top level | `BreadcrumbList`, from `components/layout/breadcrumbs.tsx` |

**One `BreadcrumbList` per page, from the component.** Google requires the name
in the markup to match what the reader sees, and the way that breaks is a hand
written block in a route drifting from the rendered trail after somebody
renames a menu item. A route that needs an extra crumb passes `leaf` to the
component rather than writing its own.

**No `aggregateRating`, no `Review`, no `speakable`.** None is earned by
testimonial copy on our own pages, and a rating attached to an article or a
service page is the fastest route to a manual action. Real reviews live on
Trustpilot.

---

## 5. Paginated archives

Page one lives at the category's own path. `/page/1` is a 404, because one page
of content at two URLs is the thing paging must not create.

- Page two onward: `robots: noindex, follow`. The archive itself is thin, but
  `follow` keeps the posts crawled and the silo links paying.
- Canonical points at each page's **own** URL. Pointing them all at page one
  tells Google the deeper pages are duplicates and strands the posts only
  reachable from them.
- Out of range is a 404 rather than a clamp, or an unlimited number of URLs
  serve the same posts.

---

## 6. The register

| Page | Primary keyword | Title (chars) |
| --- | --- | --- |
| `/services/ai-software-integration` | `AI software integration` | AI Software Integration \| Add AI to Existing Apps (49) |
| `/services/custom-ai-api-integration` | `custom AI API integration` | Custom AI API Integration & AI Wrappers (39) |
| `/services/secure-ai-compliance-architecture` | `secure AI integration services` | Secure AI Integration & Compliance (34) |
| `/services/ai-workflow-automation` | `AI workflow automation services` | AI Workflow Automation Services for SMBs (40) |
| `/services/autonomous-ai-agents` | `custom AI agent development` | Custom AI Agent Development \| Multi-Agent Systems (49) |
| `/services/customer-support-ai` | `AI customer support automation` | AI Customer Support Automation & RAG Agents (43) |
| `/services/document-processing-ocr` | `AI document processing automation` | AI Document Processing Automation & OCR (39) |
| `/services/financial-data-automation` | `financial data automation AI` | AI Financial Data Automation & Ledger Pipelines (47) |
| `/services/custom-ai-mvp-development` | `custom AI MVP development` | Custom AI MVP Development & Prototyping (39) |
| `/services/rapid-ai-prototyping` | `rapid AI prototyping services` | Rapid AI Prototyping Services \| Proof of Concept (48) |
| `/services/fintech-saas-ai-mvp` | `fintech AI MVP development` | Fintech AI MVP Development & SaaS Platforms (43) |
| `/services/smart-inventory-retail-mvp` | `smart inventory AI MVP` | Smart Inventory AI MVP & Stock Prediction (41) |
| `/services/ai-data-predictive-analytics` | `AI predictive analytics services` | AI Predictive Analytics Services & Forecasting (46) |
| `/services/predictive-analytics-bi` | `predictive business intelligence AI` | Predictive Business Intelligence AI & Dashboards (47) |
| `/services/data-engineering-vector-databases` | `vector database development services` | Vector Database Development Services & RAG (42) |
| `/services/computer-vision-quality-control` | `computer vision quality control` | Computer Vision Quality Control Services (40) |
| `/services/custom-ai-models-voice` | `custom AI model development` | Custom AI Model Development & Voice (35) |
| `/services/private-llm-fine-tuning` | `private LLM fine-tuning` | Private LLM Fine-Tuning & Secure Hosting (40) |
| `/services/ai-voice-telephony-automation` | `AI voice telephony automation` | AI Voice Telephony Automation & Phone Agents (44) |
| `/services/ai-app-development` | `AI app development` | AI App Development Company \| Mobile and Web (43) |
| `/services/ai-mobile-app-development` | `AI mobile app development` | AI Mobile App Development \| iOS and Android (43) |
| `/services/ai-web-app-development` | `AI web app development` | AI Web App Development \| Custom AI Platforms (44) |
| `/industries/fintech-and-finance` | `AI automation for fintech` | AI Automation for Fintech & Finance Teams (41) |
| `/industries/retail-and-inventory` | `retail AI inventory automation` | Retail AI Inventory Automation & Vision (39) |
| `/industries/healthcare-and-consulting` | `healthcare AI automation` | Healthcare AI Automation & Telehealth (37) |
| `/industries/media-and-communities` | `community app AI automation` | Community App AI Automation & Moderation (40) |
| `/industries/edtech-and-learning` | `edtech AI automation` | EdTech AI Automation & Learning Platforms (41) |
| `/industries/marketing-and-adtech` | `marketing AI automation` | Marketing AI Automation & Ad Forecasting (40) |
| `/how-we-work` | `AI MVP development process` | AI MVP Development Process \| Weeks, Not Quarters (48) |
| `/resources/integration-guides` | `AI integration guides` | AI Integration Guides (21) |
| `/resources/cost-reduction-strategies` | `AI cost reduction strategies` | AI Cost Reduction Strategies (28) |

Add a row when a page ships. The register is what makes rule 1 checkable: two
pages claiming one phrase is visible here before it is visible in a ranking
report.

The register covers shipped pages only. For every page in the master menu,
built or not, with its measured title and description lengths and the phrases
still assigned to two pages at once, see `docs/page-progress.md`.

### One overlap in the register is deliberate

`/how-we-work` took `AI MVP development process` on 24 August 2026, and the
words "AI MVP Development" now sit in two titles. The other is
`/services/custom-ai-mvp-development`, which owns `custom AI MVP development`.

That is a shared substring rather than a shared phrase, and the two pages
answer different searches. One is a buyer looking for somebody to build an MVP.
The other is a buyer who has already decided and wants to know how the weeks
run. Rule 1 exists so a parent does not outrank the child it feeds, and neither
of these is the other's parent.

The line not to cross is the service page's own phrase. `custom AI MVP
development` appears nowhere on `/how-we-work`, verified against the rendered
HTML, and it must stay that way.

### The app development silo, and the three phrases that share a stem

Added 2 September 2026. `AI app development` sits above `AI mobile app
development` and `AI web app development`, so the parent's phrase is a
substring of both children's. That is rule 1 working rather than breaking it.

The test rule 1 sets is whether one phrase appears as a `metaTitle` on more
than one page, and none of these three does. The parent's title is
"AI App Development Company | Mobile and Web", which carries neither child's
phrase. Both children carry their own and not the parent's. Measured against
the rendered HTML on 2 September 2026, and worth re-measuring if any of the
three titles is ever rewritten, because the overlap is one careless word away.

The larger risk in this silo is not internal. It is
`/services/ai-software-integration`, which owns everything that starts from
software the buyer already runs. Nothing in the app development silo may take
`integration` into a title or a primary keyword, and all three pages route that
visitor away in their own copy. See the note at the head of the silo in
`content/service-landings.ts`.

---

## 7. Before publishing a page

1. Its primary keyword appears in no other page's `metaTitle`.
2. Every secondary keyword has a section that answers it.
3. Title is 49 characters or fewer.
4. Description is 150 to 160 and ends on an action.
5. The canonical points at the page itself.
6. The right schema for the page type, and exactly one `BreadcrumbList`.
7. A row added to the register above.
