# Hitasoft Website Architecture & AI Services Strategy

## 1. Project Overview & Target Audience
*   **Domain Context:** Leveraging an established 18-year-old domain (Hitasoft.com) to fast-track SEO authority and indexing.
*   **Target Audience:** SMBs, startup founders, and mid-sized businesses.
*   **Audience Pain Points:** They understand the value of AI but lack the technical roadmap to integrate it into their *existing* software, operations, or tech stacks. They seek immediate cost reduction, workflow automation, and time savings—not theoretical enterprise digital transformation.
*   **Value Proposition:** "We don't just build from scratch; we make your existing software smart and your operations automated."

## 2. Primary Silo Architecture
A siloed SEO structure designed to guide users from informational queries to transactional service pages, passing the domain's established link equity efficiently.

**This section is the site map, and `content/navigation.ts` is its implementation.** The two are kept in step by hand. If they disagree, the code is what ships and this file is the one that is wrong.

### Header Navigation
**Services | Industries | Resources | Contact**

Home is not a menu item; the wordmark carries it. Case Studies moved under Resources on 20 August 2026 — it is a resource, not a silo, and it was spending a menu slot it could not justify. `/results` and `/case-studies` redirect; see `next.config.mjs`.

### Keyword conventions
Each page below lists the terms it is written to rank for. These are on-page targets taken from the page's own `metaTitle` and `metaDescription` in `content/`, not researched volume figures — none have been pulled. Treat them as the editorial brief for the page, and replace them with real data once a keyword tool is run.

---

### Silo 1: AI Integration — `/services/ai-software-integration`
*Make software that already exists intelligent, without a rebuild.*
`AI software integration`, `add AI to existing SaaS`, `integrate LLM into existing software`

> **The parent does not target `custom AI API integration`.** That phrase
> belongs to the child page below, which is named for it. The long form build
> of this page took its primary keyword straight from
> `docs/service-page-architecture.md`, which pairs this URL with
> `custom AI API integration`, and the two pages ended up with near-identical
> titles. Corrected 21 August 2026: the parent owns the category term its own
> URL carries, and the child keeps the specific one. Any page built from that
> brief needs the same check before it ships.

*   **Custom AI API & Software Integration** — `/services/ai-software-integration/custom-ai-api-integration`
    `custom AI API integration`, `AI wrapper development for startups`, `integrate LLM into existing software`
*   **Secure AI & Compliance Architecture** — `/services/ai-software-integration/secure-ai-compliance-architecture`
    `secure AI integration services`, `private LLM deployment for business`, `compliant AI app development`, `data safety AI consulting`

### Silo 2: Workflow Automation — `/services/ai-workflow-automation`
*Hand the repeat work to software.*
`AI workflow automation`, `autonomous workflow automation for SMBs`

*   **Autonomous AI Agents** — `/services/ai-workflow-automation/autonomous-ai-agents`
    `custom AI agent development`, `multi-agent systems for business`
*   **Customer Support & Engagement** — `/services/ai-workflow-automation/customer-support-ai`
    `AI customer support automation`, `custom AI chatbot development for SMBs`, `RAG chatbot integration`, `automated ticketing system setup`
*   **Document Processing & OCR** — `/services/ai-workflow-automation/document-processing-ocr`
    `intelligent document processing`, `custom OCR development`, `automated invoice data extraction`
*   **Financial & Data Automation** — `/services/ai-workflow-automation/financial-data-automation`
    `fintech AI automation services`, `automated expense tracking integration`, `AI ledger management development`, `financial data automation for SMBs`

### Silo 3: AI MVP Development — `/services/custom-ai-mvp-development`
*For founders with a product to prove rather than a system to upgrade.*
`custom AI MVP development`, `affordable AI startup development`

*   **Rapid AI Prototyping** — `/services/custom-ai-mvp-development/rapid-ai-prototyping`
    `low cost AI prototype development`, `AI proof of concept for startups`
*   **Fintech & SaaS AI MVP** — `/services/custom-ai-mvp-development/fintech-saas-ai-mvp`
    `build an AI SaaS MVP`, `custom AI fintech MVP development`
*   **Smart Inventory & Retail MVP** — `/services/custom-ai-mvp-development/smart-inventory-retail-mvp`
    `AI inventory management development`, `predictive inventory AI for SMBs`, `smart stock tracking integration`

### Silo 4: Data & Predictive Analytics — `/services/ai-data-predictive-analytics`
*Your own history, turned into a forecast the business acts on.*
`predictive analytics for SMBs`, `AI data analytics services`

*   **Predictive Analytics & BI** — `/services/ai-data-predictive-analytics/predictive-analytics-bi`
    `custom predictive modelling services`, `AI sales forecasting`, `churn prediction development`
*   **Data Engineering & Vector Databases** — `/services/ai-data-predictive-analytics/data-engineering-vector-databases`
    `vector database integration`, `RAG data pipeline setup`, `AI data engineering services`
*   **Computer Vision & Quality Control** — `/services/ai-data-predictive-analytics/computer-vision-quality-control`
    `custom image recognition development`, `AI visual quality control`, `defect detection AI`

### Silo 5: Custom Models & Voice — `/services/custom-ai-models-voice`
*Your own model, hosted where you choose, answering in your own voice.*
`custom AI model development`, `private AI model deployment`

*   **Private LLM Fine-Tuning** — `/services/custom-ai-models-voice/private-llm-fine-tuning`
    `LLM fine-tuning services`, `private AI model deployment`, `reduce cloud AI API costs`
*   **AI Voice & Telephony** — `/services/custom-ai-models-voice/ai-voice-telephony-automation`
    `AI voice agent integration`, `custom voice AI for small business`, `AI phone answering automation`

### Silo 6: Industries / Use Cases — `/industries`
Six pages, and deliberately not a claim to cover every sector. `content/site.ts` holds a longer list of industries for the home page; the gap between the two lists is the honest state of it. A page joins this silo once there is something specific to say about the work.

These six own no child pages, so the header draws them as cards rather than as a rail, three to a row.

*   **Fintech & Finance** — `/industries/fintech-and-finance`
    `fintech AI automation services`, `automated expense tracking`, `AI ledger management`
*   **Retail & Inventory** — `/industries/retail-and-inventory`
    `predictive inventory AI`, `AI inventory management development`, `retail automation IT services`
*   **Healthcare & Consulting** — `/industries/healthcare-and-consulting`
    `compliant AI development for healthcare`, `private LLM deployment for patient data`, `secure consultation platform development`
*   **Media, Communities & Secure Consulting** — `/industries/media-and-communities`
    `community platform AI integration`, `secure AI for telehealth consulting`, `compliant AI app development`

    Added 21 August 2026. The challenge: platforms handling user interactions need heavy moderation, while consulting apps face strict data privacy requirements. The work: strict data safety architectures for live video consulting, and intelligent social feeds and moderation tooling for closed community applications.

    **Overlap to resolve:** `compliant AI app development` is also targeted by Silo 1's Secure AI & Compliance Architecture page, and live-video consulting is claimed by the Healthcare & Consulting page's copy too. Three pages competing for one term is cannibalisation. Decide which page owns it before this ships.

*   **EdTech & Digital Learning Systems** — `/industries/edtech-and-learning`
    `AI integration for e-learning platforms`, `custom EdTech AI development`, `automated tutoring AI for startups`

    Added 21 August 2026. Online education is moving from static video courses toward interactive, community-driven platforms, and mid-sized educators and startup platforms need smart features to hold engagement. The challenge: keeping engagement high, giving personalised feedback, and moderating community interaction at scale without hiring a large support team. The work: AI-driven voice and recitation analysis, quiz generation keyed to a learner's progress, and automated moderation on closed community feeds.

    **Note:** the moderation angle overlaps Media & Communities above. EdTech should own moderation *of course cohorts*; Media & Communities owns it for open and closed social platforms.

*   **Digital Marketing & AdTech** — `/industries/marketing-and-adtech`
    `AI automation for marketing agencies`, `generative AI creative pipelines`, `programmatic SEO AI development`

    Added 21 August 2026. Boutique agencies and SaaS companies are under pressure to produce large volumes of content and run complex campaigns while holding costs down. The challenge: constant demand for high-resolution creative assets, fast app store localisation, and data-driven content marketing that proves ROI. The work: automated generative pipelines for branding and UI assets, programmatic SEO content generation, and intelligent ad-bidding integrations.

### Silo 7: Resources / Blog (Top-of-Funnel) — `/resources`
*   **Role:** Capture "how-to" searches and link down into the parent service pages.
*   **Integration Guides** — `/resources/integration-guides` — `AI integration guides`
*   **Cost Reduction** — `/resources/cost-reduction-strategies` — `AI cost reduction strategies`
*   **Case Studies** — `/resources/case-studies`

### Supporting pages
*   **How we work** — `/how-we-work`. Not a service, so not a silo. Reached from the strip under the Services panel.
*   **Contact** — `/contact`.

---

## 3. Core Services Deep-Dive

The strategy opened with five services. Four of them became the silo parents above, and the fifth (Intelligent Customer Support) became a child of Workflow Automation, since it is one kind of automation rather than a category beside it. The pitches below are the positioning for each; the keyword targets live with the pages in section 2.

### Service 1: AI API & Software Integration (The "Make it Smart" Service)
*   **Focus:** Injecting LLMs into existing codebases and building AI wrappers around current logic so founders don't have to rebuild their platforms.
*   **Pitch:** "Don't rebuild your software. We build the bridge that makes your current platform intelligent."

### Service 2: Financial & Data Workflow Automation
*   **Focus:** Automating backend data processing, shared ledger management, automated expense tracking, and real-time debt calculation.
*   **Pitch:** "Eliminate manual data entry. We automate your financial pipelines so your team can focus on growth, not spreadsheets."

### Service 3: Smart Inventory & Retail Systems
*   **Focus:** Upgrading standard retail tracking systems into predictive engines that forecast stock needs, categorize inventory, and trigger automated ordering.
*   **Pitch:** "Stop guessing your stock levels. We integrate predictive AI into your inventory systems to prevent stockouts and reduce holding costs."

### Service 4: Secure AI & Compliance Architecture
*   **Focus:** Deploying private AI models with strict data safety protocols for platforms handling sensitive interactions (e.g., live video consulting, closed communities).
*   **Pitch:** "Enterprise-grade AI security for mid-sized businesses. We integrate AI that keeps your proprietary and user data strictly confidential."

### Service 5: Intelligent Customer Support & Engagement
*   **Focus:** Deploying context-aware AI agents (RAG) trained on a company's internal knowledge base and past ticket history to resolve tier-1 issues instantly.
*   **Pitch:** "Resolve 70% of customer inquiries instantly. We build AI agents that actually understand your business and your customers."
    *Note: the 70% figure is a positioning claim and does not appear on any page. `content/services.ts` bans invented figures in published copy.*

---

## 4. Landing Page Conversion Blueprint
Every service page must follow this structural flow to maximize B2B conversions:
1.  **The Problem:** Highlight the operational friction and associated costs (e.g., "Manual tracking costs you 20 hours a week").
2.  **The Solution:** Explain the AI integration in plain, non-jargon English.
3.  **The Process:** 3-step visual implementation flow (Audit → Integrate → Launch).
4.  **The ROI:** Expected time/money saved and system performance metrics.
5.  **The Call to Action:** "Book a Free AI Integration Audit" or similar low-friction technical consultation.

---

## 5. GEO: what the pages owe an answer engine

Reviewed 21 August 2026 against a GEO blueprint. The structural advice was
sound and is now built into the service page template. The copy that came with
it was not publishable as written, and the gap between those two is the useful
part of this section.

### Adopted

*   **A quotable definition.** Each long form service page opens with one
    self-contained paragraph defining the service. An answer engine lifts a
    passage without the layout around it, so a headline fragment is no use as a
    definition. It is also the `description` on the Service schema, so prose
    and structured data cannot drift.
*   **Passage-level questions with direct answers.** The FAQ went from three
    questions to six. The three added are informational rather than
    objection-handling: what the service is, how long it takes, how the data is
    protected. Those are the queries an answer engine is resolving.
*   **A comparison table.** Rebuild against integration, as a real `<table>`
    with header cells. Answer engines synthesise tables readily, and a grid of
    divs gives them nothing to read.
*   **Typed entities.** `Service` with a `provider` Organization, plus
    `FAQPage` and `BreadcrumbList`. Three blocks per page, all generated from
    the same content the page renders.

### Rejected, and why

| The blueprint asked for | Why it is not on the page |
| :--- | :--- |
| `$50,000+` rebuild cost | No basis for the figure. Claims discipline. |
| `6 - 12 Months` rebuild duration | Same. It is a guess about somebody else's project. |
| "Seamless (Same UI/UX)" | `seamless` is on the banned list in this file. |
| `GPT-4o`, `Claude 3.5 Sonnet`, `Llama 3` | Families, never version numbers. A named release dates the page the week it is superseded. |
| "strict zero-data-retention agreements" | Overclaims a commercial arrangement. The page says retention is a setting somebody switches on and we check, which is what content/security.ts backs. |
| Node.js, GraphQL, GCP, private VPC | Not claimed anywhere else on the site. AWS is, so AWS stays. |

The pattern is worth keeping in mind for the next blueprint. A generated GEO
brief optimises for citation and will reach for concrete numbers, because
numbers get quoted. Concrete numbers are exactly what this company cannot
publish until the real ones exist.

### Still open

*   No `Organization` or `LocalBusiness` schema at the site level. The Service
    schema carries a nested provider, which covers the service pages, but the
    site itself is untyped. That is the larger gap if geographic reach matters.
*   `site.url` still points at `appkodes.com`, so every canonical and every
    absolute URL in the schema names the old domain.

---

## 6. Changelog
*   **19 Aug 2026** — Industries pulled from the menu; no content to route to.
*   **20 Aug 2026** — Services grew from 2 silos to 5, owning 14 child pages. Industries returned with 3 pages, renamed to shorter slugs (`ai-for-healthcare` → `healthcare-and-consulting` and siblings; never published, so nothing redirects). Case Studies moved under Resources.
*   **21 Aug 2026** — Added the Media, Communities & Secure Consulting industry. Sections 2 and 3 rewritten to match what is actually built: the doc still described 2 service silos and 3 industries under their old names.
*   **21 Aug 2026** — Added EdTech & Digital Learning Systems and Digital Marketing & AdTech, taking Industries to six. The header panel stays at three cards per row, so six fills two rows exactly.
*   **21 Aug 2026** — Built the first long form service page at `/services/ai-software-integration`, to `service-page-architecture.md`. Added `BreadcrumbList` schema site wide, then a GEO pass adding the summary, comparison table and three passage-level questions. See section 5.
