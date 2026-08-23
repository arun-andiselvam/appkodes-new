# Page progress

Every page in the master menu, with what is built and what each one still owes.
Measured against the live server, by fetching every route and reading the
rendered HTML rather than the source files. Last measured 24 August 2026.

**Not in this table:** blog articles under `/resources/*` and case studies under
`/resources/case-studies/*`. Both are collections rather than fixed menu pages,
both still run on sample data, and both are tracked by the flags in
`lib/posts.ts` and `lib/case-studies.ts`. Their category and detail templates
are built and approved.

**Four Resources pages are live and are in neither list.** `/resources`,
`/resources/case-studies`, `/resources/integration-guides` and
`/resources/cost-reduction-strategies` are hub pages rather than articles, and
two of them already hold a primary keyword in `docs/seo-standards.md`. All four
render real content, carry only a `BreadcrumbList`, and have descriptions
between 104 and 133. They belong with the five awaiting an SEO pass, which
makes that queue nine pages rather than five.

**`/how-we-work` is not in the sitemap.** It renders, it is linked from the
closing panel of every page, and `app/sitemap.ts` builds from the navigation
tree, which the path is not in. Add it to `extraRoutes` there. It is also the
one page with no `BreadcrumbList`, for the same reason.

The standard these columns test is `docs/seo-standards.md`. The voice and claims
rules are `docs/positioning.md`. The keyword assignments come from
`docs/hitasoft_ai_architecture_strategy.md`.

---

## Legend

| Column | Means |
| --- | --- |
| **Copy** | `long form` is the full template with problem, capabilities, comparison, diagram and FAQ. `bespoke` is a page written once for itself. `blueprint` is the short generated silo page, roughly 860 words, that every unbuilt page still renders from. |
| **Title** | Characters in the rendered `<title>`, suffix included. `app/layout.tsx` appends `" - Hitasoft"`, so the page's own title has 49 and the rendered one has 60. **Bold** is over budget. |
| **Desc** | Characters in the meta description. Target is 150 to 160. **Bold** is outside it. |
| **Schema** | The JSON-LD blocks on the page. `Service + FAQ` is what a built service or industry page carries. `Breadcrumb only` means the page-type schema is still missing. |
| **H2** | Section headings, a proxy for whether the page has real structure or just the blueprint's five blocks. |
| **Words** | Body word count. |

**Everything carries a canonical, an `og:image` and the site `Organization`
block.** Those three are set in `app/layout.tsx` and `lib/seo.ts`, so they are
not worth a column each. The only gap is `/how-we-work`, which renders no
`BreadcrumbList` because the path is not in the nav tree.

### Status

| Status | Means |
| --- | --- |
| **Done** | Long form, on standard, reviewed and approved. |
| Live, SEO pass due | Real content that was written for the page, but metadata not yet held to the standard. |
| Blueprint | Still rendering the generated silo page. Needs the long form build. |

---

## The pages

| Page | Primary keyword | Copy | Title | Desc | Schema | H2 | Words | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | none set | bespoke | 47 | **133** | none | 11 | 3,029 | Live, SEO pass due |
| Contact | none set | bespoke | 18 | **115** | Breadcrumb only | 3 | 965 | Live, SEO pass due |
| How we work | none set | bespoke | 22 | **97** | none | 4 | 1,264 | Live, SEO pass due |
| Services hub | none set | bespoke | 19 | **118** | Breadcrumb only | 8 | 1,256 | Live, SEO pass due |
| Industries hub | none set | bespoke | 21 | 160 | Breadcrumb only | 8 | 1,001 | Live, SEO pass due |
| `/services/ai-software-integration` | `AI software integration` | long form | 60 | **149** | Service + FAQ | 12 | 2,739 | **Done** |
| `/services/custom-ai-api-integration` | `custom AI API integration` | long form | 50 | 154 | Service + FAQ | 11 | 2,684 | **Done** |
| `/services/secure-ai-compliance-architecture` | `secure AI integration services` | long form | 45 | 150 | Service + FAQ | 11 | 2,756 | **Done** |
| `/services/ai-workflow-automation` | `AI workflow automation services` | long form | 51 | 157 | Service + FAQ | 12 | 2,740 | **Done** |
| `/services/autonomous-ai-agents` | `custom AI agent development` | long form | 60 | 160 | Service + FAQ | 11 | 2,657 | **Done** |
| `/services/customer-support-ai` | `AI customer support automation` | long form | 54 | 156 | Service + FAQ | 11 | 2,675 | **Done** |
| `/services/document-processing-ocr` | `AI document processing automation` | long form | 50 | 154 | Service + FAQ | 11 | 2,688 | **Done** |
| `/services/financial-data-automation` | `financial data automation AI` | long form | 58 | 153 | Service + FAQ | 11 | 2,653 | **Done** |
| `/services/custom-ai-mvp-development` | `custom AI MVP development` | long form | 50 | 151 | Service + FAQ | 12 | 2,671 | **Done** |
| `/services/rapid-ai-prototyping` | `rapid AI prototyping services` | long form | 59 | 155 | Service + FAQ | 11 | 2,604 | **Done** |
| `/services/fintech-saas-ai-mvp` | `fintech AI MVP development` | long form | 54 | 160 | Service + FAQ | 11 | 2,599 | **Done** |
| `/services/smart-inventory-retail-mvp` | `smart inventory AI MVP` | long form | 52 | 154 | Service + FAQ | 11 | 2,622 | **Done** |
| `/services/ai-data-predictive-analytics` | `AI predictive analytics services` | long form | 57 | 154 | Service + FAQ | 12 | 2,646 | **Done** |
| `/services/predictive-analytics-bi` | `predictive business intelligence AI` | long form | 59 | 157 | Service + FAQ | 11 | 2,531 | **Done** |
| `/services/data-engineering-vector-databases` | `vector database development services` | long form | 53 | 154 | Service + FAQ | 11 | 2,546 | **Done** |
| `/services/computer-vision-quality-control` | `computer vision quality control` | long form | 51 | 153 | Service + FAQ | 11 | 2,567 | **Done** |
| `/services/custom-ai-models-voice` | `custom AI model development` | long form | 46 | 159 | Service + FAQ | 12 | 2,630 | **Done** |
| `/services/private-llm-fine-tuning` | `private LLM fine-tuning` | long form | 51 | 156 | Service + FAQ | 11 | 2,541 | **Done** |
| `/services/ai-voice-telephony-automation` | `AI voice telephony automation` | long form | 55 | 154 | Service + FAQ | 11 | 2,591 | **Done** |
| `/industries/fintech-and-finance` | `AI automation for fintech SMBs` | long form | 52 | 152 | Service + FAQ | 9 | 1,897 | **Done** |
| `/industries/retail-and-inventory` | `retail AI inventory automation` | long form | 50 | 154 | Service + FAQ | 9 | 1,769 | **Done** |
| `/industries/healthcare-and-consulting` | `healthcare AI automation` | long form | 48 | 159 | Service + FAQ | 9 | 1,861 | **Done** |
| `/industries/media-and-communities` | `community app AI automation` | long form | 51 | 156 | Service + FAQ | 9 | 1,844 | **Done** |
| `/industries/edtech-and-learning` | `edtech AI automation` | long form | 52 | 158 | Service + FAQ | 9 | 1,885 | **Done** |
| `/industries/marketing-and-adtech` | `marketing AI automation` | long form | 51 | 160 | Service + FAQ | 9 | 1,888 | **Done** |

**Totals.** 30 pages. 25 done, 5 live and awaiting an SEO pass, none left on
the blueprint. No title is over 60. **Five descriptions outside 150 to 160**,
and four of the five are pages awaiting the pass. The industries hub was the
sixth and was fixed on 24 August 2026, at 182 and being cut in results.

That six read "two" until 24 August 2026 and had been wrong for a while. The
number was decremented by hand each time a page was marked Done, rather than
recounted, and marking an industry page Done never changed it: those pages
were inside the range on the blueprint and inside it afterwards. Recount this
line, do not adjust it.

The sixth is `/services/ai-software-integration` at 149, one character short,
which is the only finished page missing the standard.

**Every service and industry page is finished.** All five silos, their parents
and all fourteen children, and all six industries. Nothing renders the
generated silo page any more. The five awaiting an SEO pass are the home page,
contact, how we work and the two hubs, and they are the whole remaining list.

---

## Secondary keywords

Each of these needs a section on its page that genuinely answers it, and needs
to appear verbatim somewhere in the copy. Rule 2 of the standard.

| Page | Secondary keywords |
| --- | --- |
| Home | none set |
| Contact | none set |
| How we work | none set |
| Services hub | none set |
| Industries hub | none set |
| `/services/ai-software-integration` | `add AI to existing SaaS`, `integrate LLM into existing software` |
| `/services/custom-ai-api-integration` | `AI wrapper development for startups`, `integrate LLM into existing software` |
| `/services/secure-ai-compliance-architecture` | `private LLM deployment for business`, `compliant AI app development`, `data safety AI consulting` |
| `/services/ai-workflow-automation` | `autonomous workflow automation for SMBs`, `automated AI task execution`, `replace manual data entry with AI` |
| `/services/autonomous-ai-agents` | `multi-agent AI solutions for business`, `autonomous AI agents`, `CrewAI agent development` |
| `/services/customer-support-ai` | `custom AI chatbot development for SMBs`, `RAG chatbot integration`, `automated ticketing system setup` |
| `/services/document-processing-ocr` | `custom OCR AI development`, `automated invoice extraction AI`, `intelligent document processing` |
| `/services/financial-data-automation` | `AI ledger automation`, `automated expense reconciliation`, `fintech AI integration` |
| `/services/custom-ai-mvp-development` | `AI MVP development`, `rapid AI app development`, `affordable AI startup development` |
| `/services/rapid-ai-prototyping` | `proof of concept AI development`, `test AI application ideas`, `low cost AI prototype development` |
| `/services/fintech-saas-ai-mvp` | `build AI SaaS MVP`, `build AI finance application`, `custom ledger software development` |
| `/services/smart-inventory-retail-mvp` | `retail inventory management prototype`, `AI stock prediction development`, `custom ERP MVP` |
| `/services/ai-data-predictive-analytics` | `business data forecasting AI`, `machine learning data analytics`, `predictive ROI modelling` |
| `/services/predictive-analytics-bi` | `AI BI dashboards`, `predictive analytics integration`, `smart data visualization tools` |
| `/services/data-engineering-vector-databases` | `AI data engineering`, `RAG data architecture`, `unstructured data vectorization` |
| `/services/computer-vision-quality-control` | `AI visual inspection services`, `automated defect detection` |
| `/services/custom-ai-models-voice` | `private AI model deployment`, `custom AI voice models`, `speech-to-text AI integration` |
| `/services/private-llm-fine-tuning` | `custom AI model training`, `on-premise LLM deployment`, `secure AI model hosting` |
| `/services/ai-voice-telephony-automation` | `AI phone agents`, `automated call center AI`, `Twilio AI voice integration` |
| `/industries/fintech-and-finance` | `automated expense tracking`, `AI ledger management` |
| `/industries/retail-and-inventory` | `smart inventory management`, `retail vision AI`, `automated stock forecasting` |
| `/industries/healthcare-and-consulting` | `telehealth AI integration`, `secure medical AI apps`, `automated patient intake` |
| `/industries/media-and-communities` | `social feed AI moderation`, `media platform AI integration`, `automated community guidelines` |
| `/industries/edtech-and-learning` | `AI learning platforms`, `audio recitation AI`, `educational app development` |
| `/industries/marketing-and-adtech` | `adtech AI integration`, `predictive marketing ROI`, `AI content clustering` |

---

## Two pages claiming one phrase

Rule 1 of the standard is that one page owns one primary keyword. These four
phrases are currently assigned twice. Each needs a decision before the second
page is built, not after.

| Phrase | Claimed by | Decide |
| --- | --- | --- |
| ~~`compliant AI app development`~~ | was secondary on `secure-ai-compliance-architecture` and on `media-and-communities` | **Resolved 23 August 2026.** Media & Communities was written and took `social feed AI moderation` instead, and the phrase came out of `content/industries.ts`. The secure page keeps it. |
| ~~`AI inventory management development`~~ | was primary on `smart-inventory-retail-mvp`, secondary on `retail-and-inventory` | **Resolved 22 August 2026.** The MVP page took `smart inventory AI MVP` when it was built, so the industry page keeps this one. |
| `private AI model deployment` | secondary on `private-llm-fine-tuning`, secondary on the `custom-ai-models-voice` parent | Parent and child again. The parent should take the category term its URL carries. |
| `integrate LLM into existing software` | secondary on `custom-ai-api-integration`, secondary on the `ai-software-integration` parent | Both pages are built and both already carry it. Acceptable as a secondary on two pages in one silo, but do not let it reach either title. |

A fifth was proposed and declined. The blueprint for
`/services/ai-workflow-automation` listed `custom AI agent development` as a
secondary, which is the primary of its own child at `autonomous-ai-agents`.
It was left off the parent when that page was built on 22 August 2026.

One collision is already resolved. `fintech AI automation services` was assigned
to both `/industries/fintech-and-finance` and
`/services/financial-data-automation`. The fintech
industry page took `AI automation for fintech SMBs` when it was built, so the
service child keeps the original.

The five pages with no keyword set are the home page, the two hubs, contact and
how we work. Home and the hubs need one assigned. Contact and how we work are
navigational and do not need to rank.

---

## What "Done" means

A page moves to **Done** when all seven hold. This is the checklist from
`docs/seo-standards.md`, section 7.

1. One primary keyword, owned by no other page, in the title and the H1.
2. Every secondary keyword has a section that answers it, and appears verbatim.
3. Title at 49 characters or fewer before the suffix.
4. Description between 150 and 160, ending on an action.
5. `Service` (or the right page type) and `FAQPage` schema, plus the one
   `BreadcrumbList` the component emits.
6. No claim the company cannot back. Check every figure against
   `docs/positioning.md`.
7. A row added to the register in `docs/seo-standards.md`.

---

## Blockers that sit above any single page

These affect all 30 rows and none of them are fixed by page work.

| Blocker | Where | Impact |
| --- | --- | --- |
| ~~**Domain**~~ | `content/site.ts` | **Closed 23 August 2026.** Confirmed as `hitasoft.com` and set as the default. Canonicals, Open Graph and all 34 sitemap entries verified on the new origin. |
| **Sitemap** | `app/sitemap.ts` | Articles and case studies are absent, and no entry carries `lastModified`. Parked by decision, not by oversight. |
| **Sample content** | `USE_SAMPLE_POSTS`, `USE_SAMPLE_CASE_STUDIES` | Both true. `content/posts-sample.ts`, `content/case-studies-sample.ts` and `public/sample/` all ship until they are flipped. |
| **Contact form** | `CONTACT_WEBHOOK_URL` | Unset, so `/contact` returns a 503 with an honest message rather than delivering anything. |
| **Draft metrics** | `content/metrics.ts` | Four figures are drafts under a capitalised warning. They must not reach a page. |
| **Unverified claim** | Home page, "more than 50 countries" | Not in any verified facts list. |
| ~~**Voice cloning**~~ | `/services/ai-voice-telephony-automation` | **Closed 23 August 2026.** Not offered. The page already says cloning a real person's voice is a consent question rather than a feature, which is the correct resting state. |
| **App store copy** | Six service pages | The client says store review belongs to Appkodes rather than Hitasoft. Nothing published claims a track record, so there is no risk, but roughly seventeen strings across six pages are written around a subject that may not be this brand's. Decide whether that copy stays. |
| **Vendor list** | `content/integrations.ts` | QuickBooks and Xero removed 23 August 2026, confirmed never connected. Shopify, Square, Zendesk, Intercom, Pinecone and Vonage were never named. **Plaid and Salesforce are still on the fintech industry row and still unconfirmed.** |
| ~~**Edge deployment**~~ | `/services/computer-vision-quality-control` | **Closed 23 August 2026.** No vision model has run on a device for a client, so the capability, the scenario, two FAQs, a diagram row and the `edge AI vision models` keyword all came out. |

---

## How to use this file

Rebuild the table by running the site and reading the rendered HTML, not the
source. Several of the numbers here differ from what the source files suggest,
because the metadata helpers compose values at request time.

One correction worth carrying forward: count title length on the **decoded**
title. An ampersand renders as `&amp;`, which reads as five characters in the
raw HTML and one on a search results page. Counting the raw string reported
three titles over budget when only one is.
