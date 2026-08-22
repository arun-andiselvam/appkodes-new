# Page progress

Every page in the master menu, with what is built and what each one still owes.
Measured against the live server on 22 August 2026, by fetching all 30 routes
and reading the rendered HTML rather than the source files.

**Not in this table:** blog articles under `/resources/*` and case studies under
`/resources/case-studies/*`. Both are collections rather than fixed menu pages,
both still run on sample data, and both are tracked by the flags in
`lib/posts.ts` and `lib/case-studies.ts`. Their category and detail templates
are built and approved.

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
| Home | none set | bespoke | 47 | **133** | none | 11 | 3,008 | Live, SEO pass due |
| Contact | none set | bespoke | 18 | **115** | Breadcrumb only | 3 | 944 | Live, SEO pass due |
| How we work | none set | bespoke | 22 | **97** | none | 4 | 1,243 | Live, SEO pass due |
| Services hub | none set | bespoke | 19 | **118** | Breadcrumb only | 8 | 1,235 | Live, SEO pass due |
| Industries hub | none set | bespoke | 21 | **182** | Breadcrumb only | 8 | 980 | Live, SEO pass due |
| `/services/ai-software-integration` | `AI software integration` | long form | 60 | **149** | Service + FAQ | 12 | 2,727 | **Done** |
| `/services/custom-ai-api-integration` | `custom AI API integration` | long form | 50 | 154 | Service + FAQ | 11 | 2,677 | **Done** |
| `/services/secure-ai-compliance-architecture` | `secure AI integration services` | long form | 45 | 150 | Service + FAQ | 11 | 2,741 | **Done** |
| `/services/ai-workflow-automation` | `AI workflow automation services` | long form | 51 | 157 | Service + FAQ | 12 | 2,725 | **Done** |
| `/services/autonomous-ai-agents` | `custom AI agent development` | long form | 60 | 160 | Service + FAQ | 11 | 2,651 | **Done** |
| `/services/customer-support-ai` | `AI customer support automation` | long form | 54 | 156 | Service + FAQ | 11 | 2,660 | **Done** |
| `/services/document-processing-ocr` | `AI document processing automation` | long form | 50 | 154 | Service + FAQ | 11 | 2,673 | **Done** |
| `/services/financial-data-automation` | `financial data automation AI` | long form | 58 | 153 | Service + FAQ | 11 | 2,632 | **Done** |
| `/services/custom-ai-mvp-development` | `custom AI MVP development` | long form | 50 | 151 | Service + FAQ | 12 | 2,650 | **Done** |
| `/services/rapid-ai-prototyping` | `rapid AI prototyping services` | long form | 59 | 155 | Service + FAQ | 11 | 2,583 | **Done** |
| `/services/fintech-saas-ai-mvp` | `fintech AI MVP development` | long form | 54 | 160 | Service + FAQ | 11 | 2,581 | **Done** |
| `/services/smart-inventory-retail-mvp` | `smart inventory AI MVP` | long form | 52 | 154 | Service + FAQ | 11 | 2,601 | **Done** |
| `/services/ai-data-predictive-analytics` | `AI predictive analytics services` | long form | 57 | 154 | Service + FAQ | 12 | 2,625 | **Done** |
| `/services/predictive-analytics-bi` | `predictive business intelligence AI` | long form | 59 | 157 | Service + FAQ | 11 | 2,510 | **Done** |
| `/services/data-engineering-vector-databases` | `vector database development services` | long form | 53 | 154 | Service + FAQ | 11 | 2,525 | **Done** |
| `/services/computer-vision-quality-control` | `computer vision quality control` | long form | 51 | 153 | Service + FAQ | 11 | 2,616 | **Done** |
| `/services/custom-ai-models-voice` | `custom AI model development` | long form | 46 | 159 | Service + FAQ | 12 | 2,609 | **Done** |
| `/services/private-llm-fine-tuning` | `private LLM fine-tuning` | long form | 51 | 156 | Service + FAQ | 11 | 2,520 | **Done** |
| `/services/ai-voice-telephony-automation` | `AI voice telephony automation` | long form | 55 | 154 | Service + FAQ | 11 | 2,570 | **Done** |
| `/industries/fintech-and-finance` | `AI automation for fintech SMBs` | long form | 41 | 151 | Service + FAQ | 9 | 1,828 | **Done** |
| `/industries/retail-and-inventory` | `predictive inventory AI` | blueprint | 47 | **140** | Breadcrumb only | 5 | 855 | Blueprint |
| `/industries/healthcare-and-consulting` | `compliant AI development for healthcare` | blueprint | 51 | 153 | Breadcrumb only | 5 | 859 | Blueprint |
| `/industries/media-and-communities` | `community platform AI integration` | blueprint | 56 | 157 | Breadcrumb only | 5 | 909 | Blueprint |
| `/industries/edtech-and-learning` | `AI integration for e-learning platforms` | blueprint | 53 | 150 | Breadcrumb only | 5 | 889 | Blueprint |
| `/industries/marketing-and-adtech` | `AI automation for marketing agencies` | blueprint | 44 | **145** | Breadcrumb only | 5 | 882 | Blueprint |

**Totals.** 30 pages. 20 done, 5 live and awaiting an SEO pass, 5 on the
blueprint. No title is over 60 any more. Seven descriptions outside 150 to 160.

**Every service page is finished.** All five silos, their parents and all
fourteen children. The five pages still on the blueprint are all industry
pages, and the five awaiting an SEO pass are the home page, contact, how we
work and the two hubs.

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
| `/services/computer-vision-quality-control` | `AI visual inspection services`, `automated defect detection`, `edge AI vision models` |
| `/services/custom-ai-models-voice` | `private AI model deployment`, `custom AI voice models`, `speech-to-text AI integration` |
| `/services/private-llm-fine-tuning` | `custom AI model training`, `on-premise LLM deployment`, `secure AI model hosting` |
| `/services/ai-voice-telephony-automation` | `AI phone agents`, `automated call center AI`, `Twilio AI voice integration` |
| `/industries/fintech-and-finance` | `automated expense tracking`, `AI ledger management` |
| `/industries/retail-and-inventory` | `AI inventory management development`, `retail automation IT services` |
| `/industries/healthcare-and-consulting` | `private LLM deployment for patient data`, `secure consultation platform development` |
| `/industries/media-and-communities` | `secure AI for telehealth consulting`, `compliant AI app development` |
| `/industries/edtech-and-learning` | `custom EdTech AI development`, `automated tutoring AI for startups` |
| `/industries/marketing-and-adtech` | `generative AI creative pipelines`, `programmatic SEO AI development` |

---

## Two pages claiming one phrase

Rule 1 of the standard is that one page owns one primary keyword. These four
phrases are currently assigned twice. Each needs a decision before the second
page is built, not after.

| Phrase | Claimed by | Decide |
| --- | --- | --- |
| `compliant AI app development` | secondary on `secure-ai-compliance-architecture`, secondary on `media-and-communities` | The secure page is built and owns it. Drop it from `content/industries.ts:134` when Media & Communities is written. |
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
| **Domain** | `site.url` still defaults to `appkodes.com` | Every canonical, sitemap entry and schema URL on all 30 pages points at the old site. One env var, `NEXT_PUBLIC_SITE_URL`. This is the launch blocker. |
| **Sitemap** | `app/sitemap.ts` | Articles and case studies are absent, and no entry carries `lastModified`. Parked by decision, not by oversight. |
| **Sample content** | `USE_SAMPLE_POSTS`, `USE_SAMPLE_CASE_STUDIES` | Both true. `content/posts-sample.ts`, `content/case-studies-sample.ts` and `public/sample/` all ship until they are flipped. |
| **Contact form** | `CONTACT_WEBHOOK_URL` | Unset, so `/contact` returns a 503 with an honest message rather than delivering anything. |
| **Draft metrics** | `content/metrics.ts` | Four figures are drafts under a capitalised warning. They must not reach a page. |
| **Unverified claim** | Home page, "more than 50 countries" | Not in any verified facts list. |
| **Play Console claim** | Used in service copy | Confirm an app has genuinely shipped through review with an AI feature. |

---

## How to use this file

Rebuild the table by running the site and reading the rendered HTML, not the
source. Several of the numbers here differ from what the source files suggest,
because the metadata helpers compose values at request time.

One correction worth carrying forward: count title length on the **decoded**
title. An ampersand renders as `&amp;`, which reads as five characters in the
raw HTML and one on a search results page. Counting the raw string reported
three titles over budget when only one is.
