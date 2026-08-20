# Structure

Where things live, and what to do when you add a page. The site is Next.js 16
with the App Router. Read `AGENTS.md` before writing any code: this version of
Next differs from what most references describe, and the guides that ship in
`node_modules/next/dist/docs/` are the authority.

## The tree

```
app/                    routes, one folder per URL segment
  layout.tsx            html, fonts, theme, header, footer, base metadata
  page.tsx              /
  <segment>/page.tsx    one file per route
  not-found.tsx         404
  error.tsx             error boundary for every route
  sitemap.ts            built from navLinks, so the menu and the sitemap agree
  robots.ts
  icon.svg              favicon, by Next's file convention
  apple-icon.png
  globals.css           tokens, base layer, utilities, keyframes

components/
  layout/               site chrome, rendered once by app/layout.tsx
  sections/             page sections, composed by routes
  primitives/           Section, Container, Eyebrow, SectionTitle
  backgrounds/          decorative canvases
  ui/                   shadcn, only what is in use
  theme-provider.tsx
  theme-toggle.tsx

content/                all copy and data, typed, no JSX
hooks/                  shared client hooks
lib/                    utils.ts (cn), seo.ts (pageMetadata)
docs/                   this folder
public/                 images, served as-is
```

Two rules hold the shape together.

**Copy never lives in a component.** Every string a visitor reads comes from
`content/`, typed in `content/types.ts`. A section imports the slice it renders
and nothing else. This is what makes the copy reviewable without reading JSX,
and what will make a CMS or a second language possible later.

**Sections are page-agnostic.** Nothing under `components/sections/` knows which
route renders it. Four routes already share the same twelve sections in
different orders. A section that only ever appears on one page still belongs
there; a section that reads the route it is on does not.

## Adding a page

1. **Copy first.** `content/<page>.ts`, with its types in `content/types.ts`.
   Read `docs/positioning.md` before writing a line of it, and put every
   sentence through `docs/humanizer-skill.md`.
2. **Sections.** New ones go in `components/sections/<name>.tsx` exporting
   `<Name>Section`. Reuse before you write: half of a new page is usually
   sections that already exist.
3. **Route.** `app/<segment>/page.tsx`, a `<main>` holding sections in order,
   with metadata from `pageMetadata`:

   ```tsx
   import { pageMetadata } from "@/lib/seo";

   export const metadata = pageMetadata({
     title: "Page name",
     description: "One or two sentences. Cut around 155 characters.",
     path: "/segment",
   });
   ```

4. **Navigation.** Add it to `navLinks` in `content/site.ts` if it belongs in
   the menu. The sitemap follows automatically. If it ships without a menu
   entry, add the path to `extraRoutes` in `app/sitemap.ts` instead.

## Writing a section

Start from the primitives. They exist because sixteen sections each wrote the
same container by hand, and twelve wrote the same eyebrow.

```tsx
<Section id="thing">           {/* relative + py-24 lg:py-32 */}
  <Container>                  {/* max-w-[1400px], the site's gutters */}
    <Eyebrow className="mb-6">Label</Eyebrow>
    <SectionTitle className="mb-8">
      First line.
      <br />
      <span className="text-muted-foreground">Second line.</span>
    </SectionTitle>
  </Container>
</Section>
```

`Section` takes `spacing="block"` (the default) or `spacing="tight"`. Anything
else means `spacing="none"` and your own padding, which three sections do today
and none of them should. If a fourth needs it, the scale is wrong, not the
section.

Reveal-on-scroll goes through `useInView`, never a hand-rolled
IntersectionObserver. It already honours `prefers-reduced-motion`, as does
`useReducedMotion` for anything that moves by itself. For state the server
cannot know, use `useHydrated` rather than `useState` plus an effect.

## Things worth knowing

- **Everything renders per request.** `app/layout.tsx` sets
  `dynamic = 'force-dynamic'` so the per-request CSP nonce from `proxy.ts` can
  be stamped onto Next's inline scripts. `docs/security.md` covers the
  trade-off and the static alternative.
- **`components/ui/` holds what is in use and nothing else.** Adding one back is
  `pnpm dlx shadcn@latest add <name>`; `components.json` is already configured.
- **Before pushing:** `pnpm typecheck`, `pnpm lint`, `pnpm build`. All three are
  clean today and the build fails on type errors by design.
