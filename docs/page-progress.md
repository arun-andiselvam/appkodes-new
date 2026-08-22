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
| `/services/ai-software-integration/custom-ai-api-integration` | `custom AI API integration` | long form | 50 | 154 | Service + FAQ | 11 | 2,677 | **Done** |
| `/services/ai-software-integration/secure-ai-compliance-architecture` | `secure AI integration services` | long form | 45 | 150 | Service + FAQ | 11 | 2,741 | **Done** |
| `/services/ai-workflow-automation` | `AI workflow automation` | blueprint | 33 | **138** | Breadcrumb only | 6 | 918 | Blueprint |
| `/services/ai-workflow-automation/autonomous-ai-agents` | `custom AI agent development` | blueprint | 38 | **139** | Breadcrumb only | 5 | 867 | Blueprint |
| `/services/ai-workflow-automation/customer-support-ai` | `AI customer support automation` | blueprint | 41 | **139** | Breadcrumb only | 5 | 861 | Blueprint |
| `/services/ai-workflow-automation/document-processing-ocr` | `intelligent document processing` | blueprint | 58 | **143** | Breadcrumb only | 5 | 870 | Blueprint |
| `/services/ai-workflow-automation/financial-data-automation` | `fintech AI automation services` | blueprint | 45 | **148** | Breadcrumb only | 5 | 858 | Blueprint |
| `/services/custom-ai-mvp-development` | `custom AI MVP development` | blueprint | 36 | **147** | Breadcrumb only | 6 | 941 | Blueprint |
| `/services/custom-ai-mvp-development/rapid-ai-prototyping` | `low cost AI prototype development` | blueprint | 50 | **135** | Breadcrumb only | 5 | 874 | Blueprint |
| `/services/custom-ai-mvp-development/fintech-saas-ai-mvp` | `build an AI SaaS MVP` | blueprint | 51 | **133** | Breadcrumb only | 5 | 871 | Blueprint |
| `/services/custom-ai-mvp-development/smart-inventory-retail-mvp` | `AI inventory management development` | blueprint | 46 | **130** | Breadcrumb only | 5 | 863 | Blueprint |
| `/services/ai-data-predictive-analytics` | `predictive analytics for SMBs` | blueprint | 41 | **141** | Breadcrumb only | 6 | 914 | Blueprint |
| `/services/ai-data-predictive-analytics/predictive-analytics-bi` | `custom predictive modelling services` | blueprint | 40 | **136** | Breadcrumb only | 5 | 854 | Blueprint |
| `/services/ai-data-predictive-analytics/data-engineering-vector-databases` | `vector database integration` | blueprint | 60 | 150 | Breadcrumb only | 5 | 865 | Blueprint |
| `/services/ai-data-predictive-analytics/computer-vision-quality-control` | `custom image recognition development` | blueprint | **63** | **139** | Breadcrumb only | 5 | 869 | Blueprint |
| `/services/custom-ai-models-voice` | `custom AI model development` | blueprint | 46 | **141** | Breadcrumb only | 6 | 896 | Blueprint |
| `/services/custom-ai-models-voice/private-llm-fine-tuning` | `LLM fine-tuning services` | blueprint | 56 | **125** | Breadcrumb only | 5 | 866 | Blueprint |
| `/services/custom-ai-models-voice/ai-voice-telephony-automation` | `AI voice agent integration` | blueprint | 56 | **131** | Breadcrumb only | 5 | 868 | Blueprint |
| `/industries/fintech-and-finance` | `AI automation for fintech SMBs` | long form | 41 | 151 | Service + FAQ | 9 | 1,828 | **Done** |
| `/industries/retail-and-inventory` | `predictive inventory AI` | blueprint | 47 | **140** | Breadcrumb only | 5 | 855 | Blueprint |
| `/industries/healthcare-and-consulting` | `compliant AI development for healthcare` | blueprint | 51 | 153 | Breadcrumb only | 5 | 859 | Blueprint |
| `/industries/media-and-communities` | `community platform AI integration` | blueprint | 56 | 157 | Breadcrumb only | 5 | 909 | Blueprint |
| `/industries/edtech-and-learning` | `AI integration for e-learning platforms` | blueprint | 53 | 150 | Breadcrumb only | 5 | 889 | Blueprint |
| `/industries/marketing-and-adtech` | `AI automation for marketing agencies` | blueprint | 44 | **145** | Breadcrumb only | 5 | 882 | Blueprint |

**Totals.** 30 pages. 4 done, 5 live and awaiting an SEO pass, 21 on the
blueprint. One title over 60. Twenty-three descriptions outside 150 to 160.

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
| `/services/ai-software-integration/custom-ai-api-integration` | `AI wrapper development for startups`, `integrate LLM into existing software` |
| `/services/ai-software-integration/secure-ai-compliance-architecture` | `private LLM deployment for business`, `compliant AI app development`, `data safety AI consulting` |
| `/services/ai-workflow-automation` | `autonomous workflow automation for SMBs` |
| `/services/ai-workflow-automation/autonomous-ai-agents` | `multi-agent systems for business` |
| `/services/ai-workflow-automation/customer-support-ai` | `custom AI chatbot development for SMBs`, `RAG chatbot integration`, `automated ticketing system setup` |
| `/services/ai-workflow-automation/document-processing-ocr` | `custom OCR development`, `automated invoice data extraction` |
| `/services/ai-workflow-automation/financial-data-automation` | `automated expense tracking integration`, `AI ledger management development`, `financial data automation for SMBs` |
| `/services/custom-ai-mvp-development` | `affordable AI startup development` |
| `/services/custom-ai-mvp-development/rapid-ai-prototyping` | `AI proof of concept for startups` |
| `/services/custom-ai-mvp-development/fintech-saas-ai-mvp` | `custom AI fintech MVP development` |
| `/services/custom-ai-mvp-development/smart-inventory-retail-mvp` | `predictive inventory AI for SMBs`, `smart stock tracking integration` |
| `/services/ai-data-predictive-analytics` | `AI data analytics services` |
| `/services/ai-data-predictive-analytics/predictive-analytics-bi` | `AI sales forecasting`, `churn prediction development` |
| `/services/ai-data-predictive-analytics/data-engineering-vector-databases` | `RAG data pipeline setup`, `AI data engineering services` |
| `/services/ai-data-predictive-analytics/computer-vision-quality-control` | `AI visual quality control`, `defect detection AI` |
| `/services/custom-ai-models-voice` | `private AI model deployment` |
| `/services/custom-ai-models-voice/private-llm-fine-tuning` | `private AI model deployment`, `reduce cloud AI API costs` |
| `/services/custom-ai-models-voice/ai-voice-telephony-automation` | `custom voice AI for small business`, `AI phone answering automation` |
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
| `AI inventory management development` | primary on `smart-inventory-retail-mvp`, secondary on `retail-and-inventory` | The MVP page is named for it. The industry page should target the buyer, not the build. |
| `private AI model deployment` | secondary on `private-llm-fine-tuning`, secondary on the `custom-ai-models-voice` parent | Parent and child again. The parent should take the category term its URL carries. |
| `integrate LLM into existing software` | secondary on `custom-ai-api-integration`, secondary on the `ai-software-integration` parent | Both pages are built and both already carry it. Acceptable as a secondary on two pages in one silo, but do not let it reach either title. |

One collision is already resolved. `fintech AI automation services` was assigned
to both `/industries/fintech-and-finance` and
`/services/ai-workflow-automation/financial-data-automation`. The fintech
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
