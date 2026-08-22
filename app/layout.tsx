import React from "react"
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { organizationSchema } from '@/lib/organization-schema'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { site } from '@/content/site'
import './globals.css'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

/**
 * The nonce-based CSP in proxy.ts is per-request, so the HTML must be rendered
 * per-request for Next to stamp the matching nonce onto its own inline scripts.
 * Without this the prerendered nonce-less scripts are blocked by the policy.
 */
export const dynamic = 'force-dynamic'

// Brand facts come from content/site.ts so the name is defined in one place.
export const metadata: Metadata = {
  // Canonical URLs and Open Graph tags have to be absolute. Setting the base
  // here lets every page write its own as a plain path. See lib/seo.ts.
  metadataBase: new URL(site.url),
  // A template so each route supplies its own name and the brand is appended
  // once, rather than every page repeating the company name by hand.
  title: {
    default: `${site.name} - AI Automation for Growing Businesses`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  // Defaults for anything a page does not override. Pages set their own title,
  // description and URL through pageMetadata; these carry the rest.
  openGraph: {
    siteName: site.name,
    locale: 'en_GB',
    type: 'website',
    // The default share card, for the home page and anything not going through
    // pageMetadata. That helper sets its own images for the reason explained
    // there: a page's openGraph replaces this object rather than merging.
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // next-themes injects an inline anti-flash script; hand it the same nonce the
  // proxy put in the CSP so it is not blocked.
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/*
          The Organization, once, on every page.

          !! DO NOT EMIT A SECOND ONE FROM A ROUTE !!

          Every service and industry page carries a `provider` naming Hitasoft
          inside its Service schema, and until 22 August 2026 nothing anywhere
          defined the company itself, so those references pointed at an entity
          that did not exist. This is that entity, and a second block differing
          in any detail would ask a search engine to reconcile two companies
          with the same name.

          It lives in the layout rather than in a route so a new page cannot
          forget it, and it is built in lib/organization-schema.ts from
          content/contact.ts and content/footer.ts, so what a visitor can read
          and what a crawler is told are the same values.
        */}
        <script
          type="application/ld+json"
          // Our own content, and JSON.stringify escapes the quotes. The `<`
          // guard covers the one case that would still break out of the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider
          nonce={nonce}
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*
            Navigation and the footer moved up here when the site became more
            than one page. Rendering them inside each route would remount both
            on every navigation, throwing away the header's scrolled state and
            flashing the menu on each click.
          */}
          <div className="relative min-h-screen overflow-x-hidden noise-overlay">
            <Navigation />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
