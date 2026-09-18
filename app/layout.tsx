import React from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { organizationSchema } from "@/lib/organization-schema";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { QuoteBubble } from "@/components/quote/bubble";
import { site } from "@/content/site";
import { siteOrigin } from "@/lib/site-url";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

/**
 * The nonce-based CSP in proxy.ts is per-request, so the HTML must be rendered
 * per-request for Next to stamp the matching nonce onto its own inline scripts.
 * Without this the prerendered nonce-less scripts are blocked by the policy.
 */
export const dynamic = "force-dynamic";

/*
  Brand facts come from content/site.ts so the name is defined in one place.

  This is a function rather than a constant because metadataBase now follows
  the origin actually serving the request. Everything else here is static; the
  base is the one value that cannot be, and Next has no way to make a single
  field per-request while the rest stays exported. See lib/site-url.ts.
*/
export async function generateMetadata(): Promise<Metadata> {
  return {
    // Canonical URLs and Open Graph tags have to be absolute. Setting the base
    // here lets every page write its own as a plain path, and it is what turns
    // `alternates.canonical: "/industries/..."` into a full URL. See lib/seo.ts.
    metadataBase: new URL(await siteOrigin()),
    // A template so each route supplies its own name and the brand is appended
    // once, rather than every page repeating the company name by hand.
    title: {
      /* Kept in step with app/page.tsx, which sets the same sentence as the
         home page's own title. This is only the fallback for a route that
         supplies none, but it is still the site's default statement of what
         Hitasoft sells and it should not be the one the positioning work of
         2 September 2026 removed everywhere else. */
      default: `${site.name} - AI Automation and AI Product Development`,
      template: `%s - ${site.name}`,
    },
    description: site.description,
    // Defaults for anything a page does not override. Pages set their own title,
    // description and URL through pageMetadata; these carry the rest.
    openGraph: {
      siteName: site.name,
      locale: "en_GB",
      type: "website",
      // The default share card, for the home page and anything not going through
      // pageMetadata. That helper sets its own images for the reason explained
      // there: a page's openGraph replaces this object rather than merging.
      images: [
        { url: "/og-default.png", width: 1200, height: 630, alt: site.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    /*
     * !! DO NOT ADD AN `icons` BLOCK HERE. IT REPLACES THE FILE CONVENTION. !!
     *
     * Tried on 6 September 2026 for the dark mode favicon, and measured
     * against the rendered <head> rather than trusted. The docs do not say
     * what happens when both mechanisms are used, and what happens is this:
     *
     *   before   favicon.ico 48x48, icon.png 256x256, apple-icon.png 180x180
     *   after    favicon.ico 48x48, the one icon listed in the block
     *
     * A single entry in `icons.icon` took out app/icon.png and app/apple-icon
     * .png with it, so the site lost its 256px icon and its iOS home screen
     * icon to gain a dark mode one. Declaring all four here would fix that and
     * cost the content hashes Next puts on convention URLs, which are what
     * make a replaced icon reach a browser that has already cached one.
     *
     * The dark icon is a plain <link> in the tree below instead. React hoists
     * it into <head> and the convention is left alone.
     */
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ThemeProvider injects an inline anti-flash script; hand it the same nonce
  // the proxy put in the CSP so it is not blocked.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    /*
      Dark by default, rendered on the server so the first paint is dark
      before any script runs. See the note in components/theme-provider.tsx,
      whose DEFAULT_THEME has to match this class. suppressHydrationWarning
      stays because the header button changes the class on the client.

      !! data-scroll-behavior="smooth" STOPS PAGE CHANGES SLIDING !!

      app/globals.css sets scroll-behavior: smooth on <html> so in-page links,
      the article contents panel among them, glide. Up to Next 15 the router
      switched that off while it moved a new page to the top. Next 16 stopped
      doing so unless this attribute is present (see "scroll-behavior" in
      node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md),
      so every navigation from partway down a page animated up to the top.
      Most visible on the blog, where readers click from deep in a list.
      Reported 18 September 2026. Anchor links still scroll smoothly.
    */
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      {/*
        The dark mode favicon, added 6 September 2026.

        !! A BARE <link>, BECAUSE THE METADATA API TAKES THE OTHERS DOWN !!

        React hoists this into <head>, so it lands beside the three links Next
        generates from app/favicon.ico, app/icon.png and app/apple-icon.png
        rather than in place of them. An `icons` block in generateMetadata does
        replace them, which was measured and is written up there.

        !! THE MEDIA QUERY IS NOT OPTIONAL. THE FILE IS WHITE ON WHITE. !!

        public/icon-white-32x32.png is the same mark recoloured, so on a light
        tab bar it is invisible. `media` is the only thing keeping it off one,
        and a browser that ignores the attribute falls back to the colour icon
        rather than to nothing, which is the right way round for this to fail.

        Chrome and Edge honour it. Safari does not, and keeps the colour icon
        in a dark tab bar, which is what it does today, so nothing is lost.
        Fixing Safari needs an SVG carrying its own query, and that needs the
        mark as vector art rather than the 256px raster this was cut from.

        The 32px file rather than the 256: a favicon is drawn at 16 or 32 CSS
        pixels, and it is 1.1KB against 21KB.
      */}
      <link
        rel="icon"
        href="/icon-white-32x32.png"
        media="(prefers-color-scheme: dark)"
        sizes="32x32"
        type="image/png"
      />
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
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
            __html: JSON.stringify(await organizationSchema()).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <ThemeProvider nonce={nonce}>
          {/*
            Navigation and the footer moved up here when the site became more
            than one page. Rendering them inside each route would remount both
            on every navigation, throwing away the header's scrolled state and
            flashing the menu on each click.
          */}
          {/*
            !! `clip`, NOT `hidden`. THIS ONE WORD DISABLED position:sticky
            ACROSS THE WHOLE SITE !!

            `overflow-x: hidden` does not only clip. It makes the element a
            scroll container, and the spec then forces the other axis from
            `visible` to `auto`, so this div computed to `overflow: hidden auto`
            and became a scrollport wrapping every page.

            position:sticky sticks relative to its nearest scrollport. This one
            never scrolls - it has no height limit, so the document scrolls
            instead - so every sticky descendant had a frame of reference that
            never moved, and simply scrolled away with the page. Nothing
            errored and the CSS looked correct in devtools.

            Five components ask for a sticky column: the article contents panel
            in components/sections/post.tsx, plus silo-page, how-we-work,
            case-study and industry-landing. None of them had ever worked.

            Measured in Chrome 151 on 26 August 2026, driving the real page
            over CDP. As shipped the article sidebar tracked the page exactly
            1:1 (top 1165 -> -285 -> -935 -> -1585). Changing only this word
            pinned it at the intended 128px for the length of its column.

            `overflow: clip` clips without creating a scroll container, so the
            nearest scrollport goes back to being the viewport. The horizontal
            clipping this was added for still happens.

            Safari 15 and older do not support `clip` and lose the horizontal
            clipping, which is a stray sideways scroll on a page with
            overflowing decoration rather than a broken layout. That is a
            better trade than sticky being dead everywhere.
          */}
          {/*
            !! THE FOOTER IS PINNED LAST, AND THE UNIT IS svh NOT vh !!

            This was `min-h-screen`, which is `min-height: 100vh` on a plain
            block. Two things went wrong with that on a phone and the client
            photographed the result on 3 September 2026: a tall band of empty
            page below the footer.

            First, `100vh` on iOS Safari is the *large* viewport, measured with
            the address bar and the bottom toolbar collapsed. While either is on
            screen, and one of them almost always is, 100vh is taller than the
            area the reader can actually see. So the div is guaranteed to be
            taller than the window by roughly the height of both bars. `svh` is
            the small viewport, measured with the bars showing, which is the
            unit that never overshoots. Chrome and Firefox treat all three the
            same, so nothing changes there.

            Second, and this is the half that made it visible: on a block
            container the minimum height is applied after the children are laid
            out, so any slack lands *below the last child*, and the last child
            is the footer. A flex column with the page body growing puts the
            slack above the footer instead, which is the ordinary sticky footer
            arrangement and the thing this layout never had.

            Measured before changing it, driving Chrome over CDP at 390x844
            across ten page types, scrolled to the bottom: every one reported
            exactly 0px below the footer. So this does not reproduce off iOS and
            it cannot be confirmed from here. It is still wrong on both counts
            above, and both fixes are safe on every other browser.

            Navigation is `fixed`, so it is out of flow and takes no row here.
            `[&>main]:grow` is what makes the page body take the slack. Every
            route renders a <main>, directly or through a route helper in lib/.
            A page that somehow does not just behaves as it did before.
          */}
          <div className="relative flex min-h-[100svh] flex-col overflow-x-clip noise-overlay [&>main]:grow">
            <Navigation />
            {children}
            <Footer />
            {/*
              Last in the tree, which is where a floating control belongs.

              It is `fixed`, so document order does not decide where it is
              drawn - z-30 does. What document order decides is the reading
              order for a screen reader and the tab order for a keyboard, and
              both are better with it here. Somebody tabbing through a page
              reaches the navigation, the page and the footer before they are
              offered a chat bubble, rather than meeting the bubble first.
            */}
            <QuoteBubble />
          </div>
        </ThemeProvider>
        {/*
          Both tags carry the same per-request nonce the rest of the page
          does. See the note in the component for why script-src needed no
          widening and connect-src/img-src did.
        */}
        <GoogleAnalytics nonce={nonce} />
      </body>
    </html>
  );
}
