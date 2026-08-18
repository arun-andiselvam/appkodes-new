# Security

## Response headers

Set in `next.config.mjs` under `headers()`, applied to every route:

| Header | Value | Purpose |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Locks the domain to HTTPS for two years. |
| `X-Frame-Options` | `DENY` | Blocks framing (clickjacking). Backed by `frame-ancestors 'none'` in the CSP. |
| `X-Content-Type-Options` | `nosniff` | Stops MIME sniffing. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | No path/query leakage to third parties. |
| `Permissions-Policy` | camera/mic/geo/payment/usb disabled | Drops browser capabilities the site never uses. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context. |

`poweredByHeader: false` removes the `X-Powered-By: Next.js` version disclosure.

## Content-Security-Policy

`proxy.ts` issues a fresh nonce per request and Next stamps it onto every script
and stylesheet it emits, including the inline `next-themes` anti-flash script
(which receives the nonce via the `nonce` prop in `app/layout.tsx`).

`script-src` uses `'nonce-…' 'strict-dynamic'` with **no `unsafe-inline`**, so an
injected `<script>` without the current request's nonce will not execute.

`style-src` still allows `'unsafe-inline'`. Tailwind and Next inject `<style>`
tags at runtime with no nonce path available. Styles are not a script execution
vector, so this is the accepted residual.

### The trade-off you are buying

A per-request nonce means the HTML must be generated per request. `app/layout.tsx`
therefore sets `export const dynamic = 'force-dynamic'`, and the routes report as
`ƒ (Dynamic)` at build time rather than `○ (Static)`.

For this site — no user input, no authenticated state, no user-generated content —
the practical XSS surface is small, so the honest cost/benefit is:

- **Keep the nonce** if you plan to add forms, search, comments, a CMS, or any
  route that echoes user input. Then it earns its keep.
- **Switch to a static CSP** if the page stays purely static and edge caching
  matters more. Delete `proxy.ts`, remove the `force-dynamic` export and the
  `nonce` prop, and move a CSP with `script-src 'self' 'unsafe-inline'` into the
  `headers()` block in `next.config.mjs`. Pages return to `○ (Static)` and are
  fully CDN-cacheable.

Verify whichever you choose:

```bash
pnpm build && PORT=3100 pnpm start
curl -sI http://localhost:3100/ | grep -i content-security-policy
```

Then load the page with DevTools open — the console must show zero CSP violations.

## Dependencies

`pnpm audit` is clean as of the last check. `expo`, `expo-asset`, `expo-file-system`,
`expo-gl`, `react-native`, `three` and `@react-three/fiber` were removed: nothing
imported them, and they carried the only non-`next` advisories.

Re-check with:

```bash
pnpm audit --audit-level low
```

## Build gates

`typescript.ignoreBuildErrors` is `false`. Type errors fail the build; do not
re-enable the suppression to get a deploy out.
