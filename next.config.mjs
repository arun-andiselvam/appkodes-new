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

  // Type and lint errors must fail the build. The repo is clean under
  // `strict: true`, so there is nothing to suppress.
  typescript: {
    ignoreBuildErrors: false,
  },

  // Trim the response surface.
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // Only ever load images we host ourselves.
    remotePatterns: [],
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
