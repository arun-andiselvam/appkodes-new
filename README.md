# Appkodes landing site

Next.js 16 (App Router, Turbopack) + Tailwind v4 + shadcn/ui.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # type-checked production build
pnpm start    # serve the production build
```

## Layout

```
app/                 layout, page, global styles + design tokens
components/landing/  one component per page section
components/ui/       shadcn primitives (unmodified)
content/             all copy and data, typed — edit here, not in JSX
hooks/               shared behaviour (in-view, canvas ink, mobile, toast)
proxy.ts             per-request CSP nonce (see SECURITY.md)
```

## Editing content

No copy lives in components. To change what the page says, edit `content/`:

| File | Drives |
| --- | --- |
| `site.ts` | brand, logo, nav links, hero headline/words/stats |
| `features.ts` | the four feature cards |
| `how-it-works.ts` | numbered steps and their code snippets |
| `pricing.ts` | plans, prices, feature lists |
| `testimonials.ts` | quotes |
| `metrics.ts` | animated counters |
| `integrations.ts`, `infrastructure.ts`, `security.ts`, `developers.ts`, `footer.ts` | their sections |

Every export is typed against `content/types.ts`, so a missing or misspelled
field fails `pnpm build` instead of rendering blank. Adding a card is one object
in an array — no JSX change.

## Theming

`next-themes` with `attribute="class"` and `defaultTheme="system"`, so first
visit follows the OS and the toggle in the nav persists an override.

Colours are CSS custom properties in `app/globals.css`: `:root` for light,
`.dark` for dark, both on the same warm neutral axis. Components use semantic
utilities (`bg-background`, `text-muted-foreground`, `border-foreground/10`) and
never hardcode a colour, so both themes follow from the token blocks alone.

Two things are not plain CSS and need care if you add more:

- The `<canvas>` backdrops read their ink from `hooks/use-canvas-ink.ts`, which
  returns a ref so the colour can change without restarting the animation loop.
- The logo is dark-on-transparent, so it carries `dark:invert dark:hue-rotate-180`
  to flip the wordmark while preserving the brand blue. Replacing it with a
  purpose-made light variant would be cleaner if you have one.

## Reveal animations

`hooks/use-in-view.ts` is the single IntersectionObserver implementation:

```tsx
const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });
```

It honours `prefers-reduced-motion` by revealing content immediately.

## Security

Headers, CSP and the static-vs-dynamic trade-off are documented in
[SECURITY.md](./SECURITY.md).
