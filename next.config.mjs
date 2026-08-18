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
