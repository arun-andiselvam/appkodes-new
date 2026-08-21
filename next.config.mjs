/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ]
  },
}

export default nextConfig
