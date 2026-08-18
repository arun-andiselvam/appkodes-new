import React from "react"
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
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
  title: `${site.name} - AI Migration for Growing Businesses`,
  description: site.description,
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
        <ThemeProvider
          nonce={nonce}
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
