/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Self-hosted from a Dokploy-managed droplet rather than Vercel, so this
   * has to produce something a plain Node process can run. `standalone`
   * traces the actual import graph and ships only those files plus a minimal
   * server.js, rather than the full node_modules tree `next start` needs.
   * Dokploy's default builder (Nixpacks) detects this setting and runs the
   * standalone server instead of `next start`, which matters on a 4GB
   * droplet already running Strapi and Postgres alongside it.
   */
  output: 'standalone',

  /*
   * The stylesheet arrives inside the HTML rather than as a second request.
   *
   * Lighthouse's critical path was exactly two hops: the document, then a
   * 15.4 KiB stylesheet that blocks render until it lands. Inlining collapses
   * that to one, which is the single cheapest FCP and Speed Index win
   * available here.
   *
   * Next's own docs list when this is the right call, and this project is
   * the case they describe: Tailwind, so the CSS is atomic and small and
   * does not grow with page count, and a marketing site whose visitors
   * mostly arrive cold from search rather than returning to a warm cache.
   *
   * The real trade-off, stated plainly: inlined CSS cannot be cached
   * separately, so it rides along with every HTML response instead of being
   * fetched once. At 15.4 KiB that is worth it. If the stylesheet ever grows
   * substantially - a component library, a second design system - re-run the
   * numbers, because this stops being free at some size.
   *
   * Still experimental in Next 16, and does nothing in dev. Verify against a
   * production build, not `next dev`.
   */
  experimental: {
    inlineCss: true,
  },

  /*
   * !! THIS DROPS SUPPORT FOR PRE-2020 BROWSERS. THAT IS THE POINT !!
   *
   * Lighthouse's "Legacy JavaScript" finding kept naming
   * Array.prototype.at/flat/flatMap, Object.hasOwn and String.prototype.
   * trimStart/trimEnd after the browserslist field below was added, because
   * that field does not control this: Next.js's own polyfill-module ships
   * these unconditionally, to every browser, with no feature detection, and
   * ignores browserslist entirely. Confirmed by inspecting the actual built
   * output on 24 August 2026 - the file carrying them loads as a plain
   * script for every visitor, not gated behind a `nomodule` fallback the
   * way Next's *other* legacy bundle correctly is.
   *
   * Aliasing it to lib/modern-polyfill.js (empty) is the documented
   * workaround, and it is a real trade-off rather than a free fix: every
   * browser this polyfill module exists for - genuinely old Safari, IE11 -
   * loses whichever of those methods this repo's own code happens to call.
   * It is the same trade-off browserslist below already made on purpose, so
   * this is consistent with that rather than a new risk on top of it.
   *
   * Both paths are aliased because Next resolves the module differently
   * depending on where the import sits in its own build graph; aliasing
   * only one left the other still shipping it. Uses internal Next.js paths
   * that are not a public API and could move in a future Next upgrade -
   * check this still resolves to the empty file after any Next.js bump.
   */
  turbopack: {
    resolveAlias: {
      '../build/polyfills/polyfill-module': './lib/modern-polyfill.js',
      'next/dist/build/polyfills/polyfill-module': './lib/modern-polyfill.js',
    },
  },

  // Type and lint errors must fail the build. The repo is clean under
  // `strict: true`, so there is nothing to suppress.
  typescript: {
    ignoreBuildErrors: false,
  },

  // Trim the response surface.
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    /*
     * Only images we host ourselves, which now includes the CMS.
     *
     * This was an empty list, written when every image on the site came out
     * of public/. Strapi holds the article artwork now, and next/image
     * refuses any host not named here: the optimizer answered 400 for the
     * first post published with a hero image, so the page rendered a broken
     * image box. The image itself was fine and served 200 from Strapi.
     *
     * !! THIS IS AN ALLOWLIST AND IT STAYS ONE !!
     *
     * The tempting fix is a wildcard, and it is the wrong one: it would let
     * anybody who can set an image URL in the CMS point this site's
     * optimizer at any host on the internet, and have it fetch and re-serve
     * the result under our own domain. One hostname, our own CMS, no
     * wildcards in it.
     *
     * pathname is scoped to /uploads/ because that is the only place Strapi
     * writes media. Nothing else on cms.hitasoft.com should be reachable
     * through the image optimizer.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.hitasoft.com',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Routes that moved when the site was siloed on 20 August 2026.
   *
   * All permanent, so 308 rather than 307. A temporary redirect on a page that
   * is never coming back leaves the old URL competing with the new one in the
   * index for months.
   *
   * /ai-automation goes to the services hub rather than into one of the five
   * silos. The page held capabilities, tooling and data handling, which is now
   * spread across all of them. Pointing it at any single silo would strand
   * everyone who arrived for one of the others.
   *
   * /case-studies is here for completeness rather than for traffic. It existed
   * for about an hour on a development branch before case studies moved under
   * Resources, so nothing has ever linked to it. The redirect costs one line
   * and removes the question.
   */
  async redirects() {
    return [
      { source: '/ai-automation', destination: '/services', permanent: true },
      { source: '/results', destination: '/resources/case-studies', permanent: true },
      { source: '/case-studies', destination: '/resources/case-studies', permanent: true },
      /*
       * Articles moved from /resources/<category>/<slug> to /blog/<slug> on
       * 25 August 2026, when the category stopped being part of the URL and
       * went back to being a tag. See postHref in lib/posts.ts.
       *
       * These two patterns cover every article URL that has ever existed,
       * since those were the only two categories. The category segment is
       * matched and discarded rather than captured, because the slug alone
       * identifies a post: `slug` is a uid in Strapi and unique across the
       * whole collection.
       *
       * !! THE CATEGORY LANDING PAGES ARE NOT REDIRECTED, ON PURPOSE !!
       *
       * /resources/integration-guides and /resources/cost-reduction-strategies
       * are still real pages with their own pillar copy, still in the menu and
       * still listing the posts tagged to them. Only the article URLs beneath
       * them moved.
       */
      {
        source: '/resources/integration-guides/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/resources/cost-reduction-strategies/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      /*
       * public/ served with no cache policy at all otherwise.
       *
       * next/image's own optimizer sets a long cache lifetime on the
       * resized, hashed variants it serves, but that only covers images
       * that actually go through <Image>. Several are deliberately raw
       * <img> (testimonials avatars, flags, award badges, meeting photos,
       * client logos, the footer's team photo) and every uploaded font,
       * favicon or logo file bypasses the optimizer entirely, so a returning
       * visitor was refetching every one of them on every visit. Lighthouse
       * flags this as "efficient cache lifetimes".
       *
       * A week, not a year: nothing here is content-hashed, so a file that
       * changes without being renamed (exactly what happened when
       * public/team.webp was replaced this session) would stay stale in a
       * visitor's cache for however long this number says. A week bounds
       * that risk to something that corrects itself on its own within days,
       * while still being long enough for Lighthouse's own threshold and for
       * the return-visit case that matters, rather than an immutable cache a
       * change like that would need a filename bump to ever bust.
       */
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig
