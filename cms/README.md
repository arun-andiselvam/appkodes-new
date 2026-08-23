# The CMS

Strapi 5, holding the blog posts for the Hitasoft site. It lives in this
repository and deploys separately from the Next app in the parent directory.

This file replaced the one `create-strapi` generates, which was a copy of the
CLI documentation and said nothing about this project.

Chosen on 24 August 2026. Payload was recommended instead, because it runs
inside the Next app and needs no second deployment or database. The client
picked Strapi, having run it before, and that is a better reason than it looks:
a CMS nobody on the team can fix at six on a Friday costs more than an extra
deployment does. Recorded here so it is not relitigated every time somebody new
reads the stack.

Sanity and Payload are the like for like alternatives if this ever needs
replacing. Astro is not one. It is a site framework rather than a CMS, and its
content collections are local files, so choosing it would have been closer to
choosing MDX.

---

## What is and is not in here

**In:** blog posts, under `/resources/integration-guides` and
`/resources/cost-reduction-strategies`.

**Not in, deliberately:**

- **The service and industry landing pages.** Those are typed objects in
  `content/service-landings.ts` and `content/industry-landings.ts`, and nearly
  every field carries a comment recording what was rejected and why. The
  6 to 12 month figure, the app store promise, the banned vocabulary. None of
  that survives a move into a CMS, and the next person to edit the field would
  never know the rules existed.
- **Case studies.** Three real engagements live in `content/case-studies.ts`
  under the same discipline, and each carries a note separating what the client
  actually said from what was inferred. They move here only if somebody decides
  the editing convenience is worth losing that.

---

## Running it

```bash
cd cms
pnpm develop          # admin on http://localhost:1337/admin
```

The first run asks you to create an admin account. SQLite by default, in
`.tmp/data.db`, which is gitignored. Fine for local work and wrong for
production: see Deploying below.

`pnpm build` compiles the admin panel, `pnpm start` runs without the
autoreloader.

This is a separate application with its own `package.json` and its own
`pnpm-lock.yaml`. It is **not** a workspace member of the Next app, which is
deliberate. Sharing a lockfile means the two builds negotiate dependency
versions with each other, and a CMS upgrade should never be able to move the
website's React version.

The root `tsconfig.json` and `eslint.config.mjs` both exclude `cms/` for the
same reason.

---

## Connecting the site to it

Two variables, both read in `lib/strapi.ts`, both server side only.

```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<a read only token>
```

Generate the token in the admin under **Settings, API Tokens, Create new API
Token**. Token type **Read-only**. The site never writes, and a read only token
limits the damage if one ever reaches a log.

**Both unset is a supported state.** The site falls back to the ten sample
posts in `content/posts-sample.ts` and renders exactly as it did before, so a
developer cloning this repo without a CMS to point at gets a working site
rather than a stack trace. See `USE_SAMPLE_POSTS` in `lib/posts.ts`, which
still has to go to `false` before launch: production must not be able to serve
invented articles if Strapi is unreachable.

---

## The content model

`Post` in `lib/posts.ts` is the shape the site renders. The Strapi schema in
`src/api/post/content-types/post/schema.json` mirrors it, and `lib/strapi.ts`
maps one to the other. **Change one and you change all three.**

The body is a dynamic zone rather than a rich text field, and that is the
important decision in here.

A rich text field hands the site HTML, which means either shipping a parser or
calling `dangerouslySetInnerHTML` and giving whoever holds an admin login the
ability to inject script into every reader's page. The dynamic zone gives
structured blocks instead, which map onto the `Block` union the renderer
already takes.

| Strapi component | Renders as | Why it exists |
| --- | --- | --- |
| `content.paragraph` | `p` | Links are named phrases rather than pasted anchors, so copy stays readable while it is being written |
| `content.heading` | `h2` or `h3` | One component with a level field. Two would let somebody reach for a level 3 first, and the contents panel reads the hierarchy |
| `content.list` | `list` | A bulleted list |
| `content.quote` | `quote` | Somebody else's words, never our own copy set large |
| `content.callout` | `callout` | One line set apart. Once per article at most |
| `content.table` | `table` | A real table, because an answer engine parses one far more reliably than a paragraph describing it |
| `content.figure` | `figure` | Alt text and caption are both required, because a field that may be skipped will be |

`mapBlock` in `lib/strapi.ts` **throws** on a component it does not recognise.
That is deliberate. Returning null and filtering would turn "somebody added a
component in the admin that the site does not render" into an article with a
silent hole in it. Add a component here and you add it there in the same
change.

### Rules the schema enforces

- **Exactly three takeaways.** `min: 3, max: 3`. Three is the count in
  `docs/blog-structure.md`, and five is a summary of a summary that nobody
  reads. These are the highest value block on the page for answer engines, so
  each line has to stand alone when lifted with none of the article around it.
- **`sendsTo` is required.** A post that links nowhere spends a reader's
  attention and returns none of it. Every article passes the reader down into a
  service or industry silo.
- **`category` is an enumeration** rather than free text, because the site
  filters on the exact path and a typo would produce an article that exists and
  appears nowhere.
- **`body` is required.** Draft and publish means a half written article exists
  as a record long before it should have a URL.

### One tightening worth knowing

`slug` is a `uid` field, which Strapi makes unique across the whole collection.
The site only needs slugs unique **within** a category, so two categories are
in principle free to publish something called `getting-started`. Strapi will
refuse the second one. That is stricter than necessary and it is the safer
direction, so it stays unless somebody actually hits it.

---

## SEO and GEO: what is installed, and what actually enforces it

Two things, doing different jobs. The difference matters.

### The plugin, which gives advice

`@strapi-community/plugin-seo` is installed. It draws a search result preview
and a checklist beside the editor, so somebody writing gets feedback without
leaving the admin.

Note which package. `@strapi/plugin-seo` was the official one and it is
**deprecated**: the repository moved to the Strapi Community organisation. The
community package is the maintained successor and is what is in
`package.json`.

`strapi-plugin-sitemap` was considered and **declined**, twice over. It only
supports Strapi 4, and this site generates its own sitemap in `app/sitemap.ts`
from the navigation tree. A second sitemap generator would produce a competing
file listing pages the site does not have.

**The plugin's thresholds do not match ours, so do not trust its title check.**
It passes anything under about sixty characters. Our budget is forty nine,
because `app/layout.tsx` appends `" - Hitasoft"` and Google cuts at sixty. A
checker that teaches the wrong rule is worse than no checker, which is why the
next section exists.

### The lifecycle, which refuses the save

`src/utils/editorial.ts` holds the house rules as code, and
`src/api/post/content-types/post/lifecycles.ts` runs them on every create and
every update. A post that breaks one **cannot be saved**. The editor sees which
rule, the sentence that broke it, and what to do.

Every rule below is already written down somewhere in this repository. Nothing
was invented for the CMS.

| Rule | Blocks? | From |
| --- | --- | --- |
| Title at 49 characters or fewer | yes | `docs/seo-standards.md` |
| Excerpt between 150 and 160, since it is the meta description | yes | `docs/seo-standards.md` |
| Exactly three takeaways | yes | `docs/blog-structure.md` |
| No takeaway opens on a pronoun | yes | GEO: it is quoted with none of the article around it |
| At least one level 2 heading | yes | The contents panel and Google's sitelinks both read it |
| No level 3 heading before a level 2 | yes | `docs/blog-structure.md` |
| `sendsTo` points at a service or industry page | yes | The silo. A post that links nowhere spends attention and returns none |
| Descriptive anchor text, never "click here" | yes | `docs/blog-structure.md` |
| Every figure has alt text and a caption | yes | `docs/blog-structure.md` |
| No em dashes, no semicolons | yes | `docs/positioning.md` |
| No banned vocabulary | yes | `docs/positioning.md` |
| No sentence of 11 to 14 words, none over 25 | yes | `docs/positioning.md` |
| Hero image has alt text | warning | Sometimes an image genuinely is decorative |
| Two or three contextual links in the body | warning | A target rather than a threshold |

Warnings are written to the Strapi log rather than thrown. Both cases are
usually wrong and occasionally deliberate, and a gate that blocks a legitimate
case teaches people to work around the gate.

**On publish, the whole document is checked rather than the changed fields.**
Strapi sends only what changed on an update, which is right for editing and
wrong for publishing. Somebody who wrote a bad excerpt on Monday and fixes a
typo on Friday would otherwise publish Monday's excerpt.

### If the dead band proves too strict

`DEAD_BAND_SEVERITY` in `src/utils/editorial.ts` flips the 11 to 14 word rule
from an error to a warning. It is the only rule there that is house voice
rather than search or truth, so it is the only one that might reasonably be
softened. Read the document a rule came from before softening any other.

### Why there is no second metaTitle field

The plugin expects a `shared.seo` component carrying its own `metaTitle` and
`metaDescription`. It is not wired up, deliberately.

The site derives the title tag from `title` and the meta description from
`excerpt`, in `lib/post-route.tsx`. Adding a second pair would give every post
two places to say the same thing, and this repository has been bitten by that
shape before: two lists of routes disagree with each other inside a week. One
field, checked properly, beats two fields and a precedence rule.

If somebody wants a title tag that differs from the H1, that is a real need and
the answer is to add one optional override field with an explicit fallback, not
to adopt the plugin's whole component.

---

## Caching, and the webhook that is not built yet

`lib/strapi.ts` caches a fetched list for fifteen minutes, tagged `posts`.
Publishing in the admin does **not** appear on the site immediately, and
fifteen minutes is the worst case.

The proper fix is a Strapi webhook pointing at a revalidation route on the
site, which would make publishing appear within seconds and let the cache live
much longer. It is not built. Until it is, `REVALIDATE_SECONDS` is a
compromise between hitting Strapi on every request and editors waiting.

---

## Deploying

Not done yet, and two things have to be decided first.

- **The database.** SQLite in `.tmp` does not survive a container restart on
  most hosts. Postgres is the ordinary answer, and it is the one real bill in
  this plan.
- **Uploaded media.** The default provider writes to local disk, which has the
  same problem. Either an S3 compatible bucket or Cloudinary.

Neither is urgent while the posts are still samples. Both are blocking before
an editor puts a real article in.
