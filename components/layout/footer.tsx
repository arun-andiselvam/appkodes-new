import Image from "next/image";
import { ArrowUpRight, Linkedin, Youtube, Instagram, Facebook, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { footerLinks, socialLinks } from "@/content/footer";
import { site } from "@/content/site";
import { Container } from "@/components/primitives/container";

/**
 * !! DO NOT PUT "use client" BACK AT THE TOP OF THIS FILE !!
 *
 * It was there until 22 August 2026, and nothing in here ever needed it. There
 * is no state, no effect and no event handler. The footer is links and type.
 *
 * It was presumably added because AnimatedWave (the footer's backdrop until
 * 18 September 2026) is a client component,
 * and that is not how the boundary works. A server component can render a
 * client one, and only the client one crosses. Marking the parent instead
 * dragged the whole footer into the JavaScript bundle of every page on the
 * site, for nothing.
 *
 * AnimatedWave kept its own directive, which was the right place for it.
 */
/* The social icons, keyed by the names in content/footer.ts. */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
};

export function Footer() {
  return (
    /*
      !! THE EMPHASIS PANEL, THE SAME DARK GROUND THE DELIVERY MAP SITS ON !!

      This was the plain page background, border-t and all. The client asked
      for the dark treatment on 24 August 2026, in the same session as the
      team photo above. The border-t went with it: --emphasis is dark in both
      themes, so whatever section precedes the footer now meets it as a
      colour change, and a colour change is its own edge. See the identical
      note on DeliveryReachSection.

      !! IT IS SCOPED TO THE MAIN BLOCK, NOT THE WHOLE FOOTER !!

      The bottom bar below stays on the plain page background on purpose,
      by the client's request: the panel is the columns and the photo above
      it, not the copyright line. Everything down to the bottom bar reads
      from --emphasis-foreground rather than --foreground for the reason
      above; the bottom bar's own div opts back out. See the note there.
    */
    <footer className="relative bg-emphasis text-emphasis-foreground overflow-hidden">
      {/*
        No photograph since 18 September 2026, at the client's request. The
        team group photo sat here at 35% in grayscale; the footer is now the
        emphasis panel's own solid colour (obsidian in light mode, raised
        slate in dark), with the faint wave below as its only texture. The
        team is shown properly in the home page's team section instead.
      */}

      {/*
        The dot field, scoped to this block rather than the whole footer: it
        sizes itself to the columns above and stops at the copyright bar's
        border, bleeding the full viewport width outside Container.

        Static since 18 September 2026, at the client's request. It was
        AnimatedWave's canvas, the same ring dots on a 20px grid with a wave of
        brightness drifting through them; the dots stay and the motion is gone.
        A CSS pattern now (.footer-dots in app/globals.css), so no script and
        no animation frame at all.
      */}
      <div className="relative">
        <div aria-hidden className="footer-dots absolute inset-0 pointer-events-none" />

        <Container className="relative z-10">
          {/* Main Footer */}
          <div className="py-16 lg:py-24">
            {/* Five tracks: the brand column takes two, each link column one. */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
              {/* Brand Column */}
              <div className="col-span-2">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                  {/*
                    unoptimized for the same reason the header's copy carries
                    it, and the long version of why is in the note there. The
                    short version: /_next/image falls back to jpeg for a
                    wildcard Accept, jpeg has no alpha, and Cloudflare ignores
                    Vary, so the keyed-out ground behind this mark flattens to
                    a black slab for every reader once one crawler asks. Named
                    as at risk in 344aa12 on 26 August 2026, fixed here on
                    3 September after it was photographed on a phone.

                    It shows worse here than in the header, because this copy
                    sits on the dark emphasis panel with the team photograph
                    behind it, where a black rectangle reads as a hole.
                  */}
                  <Image
                    src={site.logo.srcOnDark}
                    alt={site.logo.alt}
                    width={site.logo.width}
                    height={site.logo.height}
                    unoptimized
                    className="h-8 w-auto"
                  />
                </Link>

                <p className="text-emphasis-foreground/70 leading-relaxed mb-8 max-w-xs">
                  {site.description}
                </p>

                {/* Social Links. Empty until real accounts exist. */}
                {socialLinks.length > 0 && (
                /*
                  Icons rather than names since 18 September 2026. Round
                  outlined buttons in the panel's own ink, lifting on hover.
                  The name stays as the accessible label and the tooltip.
                */
                <div className="flex gap-3">
                  {socialLinks.map((link) => {
                    const Icon = SOCIAL_ICONS[link.name] ?? ArrowUpRight;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        title={link.name}
                        className="grid place-items-center w-10 h-10 rounded-full border border-emphasis-foreground/15 text-emphasis-foreground/70 transition-colors hover:text-emphasis-foreground hover:border-emphasis-foreground/40 hover:bg-emphasis-foreground/10"
                      >
                        <Icon aria-hidden strokeWidth={1.5} className="w-[18px] h-[18px]" />
                      </a>
                    );
                  })}
                </div>
                )}
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-emphasis-foreground/70 hover:text-emphasis-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
        </Container>
      </div>

      {/*
        Bottom Bar. Plain page background, not the dark panel above it.

        !! bg-background AND relative z-10 ARE BOTH LOAD BEARING !!

        (Written while a team photo filled the footer; it was removed on
        18 September 2026, so the opaque ground below is now belt and braces.)
        The photo and the panel colour both live on <footer> itself (fill,
        and bg-emphasis), so without an opaque ground here this strip would
        show the photo bleeding through under the copyright line rather than
        sitting on a clean band the way it did before either was added. And
        because the photo is position: absolute, it paints above ordinary
        flow content regardless of DOM order - z-10 is what actually puts
        this bar on top of it rather than the other way round.

        The Container goes inside this wrapper rather than around it, so the
        opaque background runs the full width the photo does; a Container
        alone stops at 1400px and would leave the photo showing at the edges
        on a wider screen.
      */}
      <div className="relative z-10 bg-background">
        <Container>
          {/*
            The copyright line, and now the privacy policy beside it.

            A green "All systems operational" badge sat opposite the
            copyright line until 21 August 2026, which promised a status page
            we do not run and reported health nothing was actually measuring.
            That is why this went back to flex rather than staying the single
            centred line it was in between: a legal link belongs in the
            bottom bar next to the copyright it is conventionally paired
            with, not buried in the Company column above with the rest of the
            site's navigation.

            !! /privacy IS DELIBERATELY NOT ALSO IN footerLinks.Company !!

            One link, one place. Repeating it up there would be the same
            route twice in one footer for no reader's benefit, and the two
            would drift the day only one of them gets relabelled.
          */}
          <div className="py-8 border-t border-foreground/10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            {/*
              suppressHydrationWarning covers the one edge case where the
              server and the visitor's clock straddle New Year across
              timezones.
            */}
            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy &amp; cookie policy
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
