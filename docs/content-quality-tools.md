# Content quality tools: plagiarism check and humanizer

Written 19 September 2026. It is for the content generation phase, when the
service pages, solution pages and blog posts are written in bulk. Every page
goes through both tools before it ships.

Prices were read from the vendors' pricing pages on 19 September 2026, in US
dollars and before tax. Check them again before buying: both vendors change
their plans often.

## The two tools

| Tool | Job | URL |
|---|---|---|
| Copyleaks | Plagiarism check, plus an AI-content check | https://copyleaks.com/pricing |
| Undetectable AI | Humanizer: rewrites drafts so they read naturally, with an AI detector | https://undetectable.ai/pricing |

## Copyleaks

One unified credit covers up to 250 words, or one image.

| Plan | Monthly billing | Yearly billing | Credits | Words |
|---|---|---|---|---|
| Personal | $16.99 a month | $13.99 a month ($167.88 a year) | 100 a month (monthly) / 1,200 a year (yearly) | 25,000 a month / 300,000 a year |
| Pro | $99.99 a month | $74.99 a month ($899.88 a year) | 1,000 a month (monthly) / 12,000 a year (yearly) | 250,000 a month / 3,000,000 a year |
| Enterprise | Talk to sales | Talk to sales | Custom | Custom |

What each plan includes:

- **Personal:** AI and plagiarism in one report, plagiarism detection in 100+
  languages, AI detection in 30+, multi-file upload, browser extension,
  Google Docs add-on, saved scans.
- **Pro:** everything in Personal, plus 25 user seats, advanced detection
  filters, **whole-website scan from a sitemap**, cross-language plagiarism
  detection (yearly plan) and an analytics dashboard.
- **Enterprise:** API integration, organisation-wide policies, role-based
  access, private or regional hosting.
- **Extra credits:** can be bought at any time on the platform.
- **API:** listed only under Enterprise (and Education). No self-serve API
  price is published.

The page loaded with some content hidden. The yearly figures above are
printed on it; the monthly prices ($16.99 and $99.99) came from the page's
structured data. Confirm both on the checkout screen.

## Undetectable AI

| Plan | Monthly billing | Yearly billing | Words a month |
|---|---|---|---|
| Starter | $9.99 | $60.00 a year ($5.00 a month) | 10,000 |
| Professional | $19.00 | $114.00 a year ($9.50 a month) | 20,000 |
| Advanced | $31.00 | $189.00 a year ($15.75 a month) | 35,000 |
| Premium | $42.50 | Not published ("6 months free" offer shown) | 50,000 |
| Business | Custom | Custom | Custom, credits never expire |

- **Every plan includes:** the humanizer, unlimited AI detection, writing
  level matching, a watermark remover and API access.
- **Free trial:** 250 words.
- **API:** available on every plan, but no separate API price is published.

## How much we will need

One service page today (Food Delivery, with the shared sections) is about
2,800 words of copy.

| Content | Pages | Words, roughly |
|---|---|---|
| Service pages | about 20 | 56,000 |
| Solution pages | 18 | 50,000 |
| Home, company and other pages | about 10 | 10,000 |
| **Launch total** | | **about 116,000** |
| Blog, after launch | 4 to 8 posts a month at about 1,500 words | 6,000 to 12,000 a month |

Every rewrite needs checking again, so plan on about 1.5 times the word count
through each tool.

## Recommendation

| Phase | Copyleaks | Undetectable AI | Monthly cost |
|---|---|---|---|
| Launch build (1 to 2 months, about 175,000 words through each tool) | Pro, monthly: 250,000 words and the sitemap scan | Premium, monthly: 50,000 words, with extra words or a second month as needed | about $142.50 |
| After launch (blog only) | Personal, monthly: 25,000 words | Professional, monthly: 20,000 words | about $36 |

- **Why Copyleaks Pro for launch:** the whole-site sitemap scan checks every
  page at once before go-live, and 250,000 words covers the build with room
  for rechecks.
- **Why monthly billing:** buy monthly during the build and drop to the
  smaller plans afterwards. Yearly only pays off once the blog volume is
  steady.

## The workflow

1. **Draft** the page copy in `content/*.ts`, following
   `docs/positioning.md`.
2. **Humanize** the draft with Undetectable AI, at a professional or
   business writing level.
3. **Read it back against the positioning rules.** A humanizer rewrites
   freely, and it will:
   - bring back banned words: clone, script, ready-made, enterprise, IT
     services, and hype words;
   - soften the 30-day qualifier ("most first releases go live in about 30
     days"), which must stay word for word;
   - add claims we cannot back, such as numbers or guarantees.
   Fix anything it changed that it should not have.
4. **Check** with Copyleaks: plagiarism and AI in one report. Aim for no
   plagiarism matches beyond short common phrases, and fix every flagged
   passage.
5. **Before launch,** run a Copyleaks Pro sitemap scan of the whole site on
   the staging URL.
6. **Keep a record:** save the Copyleaks report for each page with the page's
   slug and the date.

## Rules that do not change

- **Nothing about AI** goes on the Appkodes site. The tools are for our
  writing process only and are never mentioned on the site.
- **No reuse claims.** Every app is built new (see `docs/positioning.md`).
- **Quotes, client names and figures** such as 1000+ businesses and 18 years
  are never run through the humanizer. They stay exactly as sourced.
