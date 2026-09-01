import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { ctaCopy } from "@/content/site";
import { QuoteLauncher } from "@/components/quote/launcher";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { CtaPanel } from "@/components/sections/cta-panel";

/**
 * The closing panel, on every page.
 *
 * !! THIS FILE IS A SERVER COMPONENT AND MUST STAY ONE !!
 *
 * It was a client component until 22 August 2026, for a scroll fade and a
 * cursor gradient. Both are decorative, both now live in CtaPanel, and
 * everything below is static markup that used to ship as JavaScript on every
 * page of the site.
 *
 * Adding a hook or a handler here would pull all of it back. Put the
 * interactive bit in CtaPanel instead.
 *
 * !! THE OVERRIDES ARE ONE PAGE'S COPY, NOT A THEME !!
 *
 * Every field defaults to content/site.ts, so the eight routes rendering this
 * without props are untouched. /how-we-work passes its own, because a page
 * whose whole argument is "stop planning, start prototyping" should not close
 * on the site's general automation pitch. Added 24 August 2026.
 *
 * Anything passed here still has to pass docs/positioning.md. The copy in
 * content/site.ts was rewritten twice after the client read it back and could
 * not tell what it meant, and an override is an easy way to undo that work in
 * one line.
 */
/*
 * Widened off ctaCopy rather than `Partial<typeof ctaCopy>`. That object is
 * `as const`, so a Partial of it would only accept the exact strings already
 * in it, which makes the prop useless in the one way it exists to be used.
 */
type CtaCopy = { [K in keyof typeof ctaCopy]: string };

export function CtaSection({ copy }: { copy?: Partial<CtaCopy> } = {}) {
  const panel = { ...ctaCopy, ...copy };

  return (
    <Section id="contact" spacing="none" className="pt-12 lg:pt-16 pb-20 lg:pb-24 overflow-hidden">
      <Container>
        <CtaPanel>
            {/*
              Two columns, and only one of them holds anything to read. The
              buttons moved across to sit under the paragraph they belong to,
              which leaves the right hand side to the badge alone.

              items-center rather than items-end or items-stretch. With the
              badge as the only thing on the right, aligning it to either edge
              of a text block it has no relationship to just looks like it
              fell there. Centred against the whole block, it reads as the
              counterweight to it.
            */}
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 lg:items-center">
              <div className="max-w-2xl">
                <Eyebrow className="mb-5">
                  {panel.eyebrow}
                </Eyebrow>
                {/*
                  Was lg:text-7xl, the largest type on the page after the hero.
                  At 6xl it matches every other section heading and the panel
                  stops needing the height.
                */}
                <SectionTitle className="mb-6 leading-[0.95]">
                  {panel.headline}
                  <br />
                  <span className="text-muted-foreground">{panel.headlineAccent}</span>
                </SectionTitle>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {panel.description}
                </p>

                {/*
                  One line from sm up. They were stacked while they lived in a
                  narrow right hand column, and there is no reason for that now
                  they have the width of the paragraph to sit on. They still
                  stack on a phone, where two full width buttons side by side
                  would each be too narrow to read.

                  !! whitespace-normal OVERRIDES THE BUTTON'S OWN whitespace-nowrap,
                  AND THAT IS LOAD BEARING !!

                  components/ui/button.tsx sets `whitespace-nowrap` and
                  `shrink-0` on every button, and neither this row nor the
                  button itself ever gave it a width. A flex item's default
                  `min-width` is `auto`, which for nowrap text means "however
                  wide the unwrapped label needs" - the item refuses to
                  compress below that regardless of its container. cta-
                  panel.tsx's own note already has the number this collides
                  with: a 390px phone leaves 278px for this column once the
                  panel's padding comes off, and "Book a free automation
                  audit" plus a leading and trailing icon at the sizes below
                  needs well over that on one line. Nothing here was
                  preventing it, so it overflowed the panel and got cropped by
                  cta.tsx's own `overflow-hidden` rather than wrapping or
                  shrinking. Reported against a live phone on 31 August 2026.

                  text-sm and tighter padding below the sm breakpoint make a
                  single line the likely outcome on an ordinary phone; the
                  wrap is what guarantees it can never happen again on
                  whatever the narrowest phone turns out to be. Desktop is
                  unaffected - `sm:flex-row` already has the room this needed,
                  and text only wraps when the space to avoid it is missing.
                */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 has-[>svg]:px-6 sm:px-8 sm:has-[>svg]:px-8 h-auto min-h-14 py-3 text-sm sm:text-base whitespace-normal text-center leading-snug rounded-full group"
                  >
                    {/*
                      A client component inside this server component, which is
                      allowed and does not convert the parent - see the shouted
                      note at the top of this file. The rule it protects is
                      unchanged: no hook and no handler goes in here.
                    */}
                    <QuoteLauncher placement="closing_panel">
                      <Sparkles aria-hidden />
                      {panel.primaryCta}
                      <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </QuoteLauncher>
                  </Button>
                  {/* Points somewhere real, unlike the buttons it replaces. */}
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-auto min-h-14 py-3 px-6 sm:px-8 text-sm sm:text-base whitespace-normal text-center leading-snug rounded-full border-foreground/20 hover:bg-foreground/5"
                  >
                    <Link href={panel.secondaryHref}>{panel.secondaryCta}</Link>
                  </Button>
                </div>
              </div>

              {/*
                The badge, on its own.

                It belongs in the closing panel rather than anywhere else on the
                page: this is where a reader decides, and eighteen years is the
                reason to.

                It ran at 144 pixels tucked above the buttons, which made it
                read as a footnote to them, then at 360 which was too much of
                the panel. 288 with the buttons gone leaves it as the only thing
                on this side, so it carries the weight without needing the size.
                `lg:mr-6` walks it in off the border.

                The file is the download keyed off its white background. See the
                note on site.logo in content/site.ts: it arrived as a flattened
                PNG with no alpha at all, which renders as a white slab on any
                page that is not pure white, and as a bright one in dark mode.

                Artwork replaced 21 August 2026. The new download had the same
                problem, so it got the same treatment: paper keyed to alpha,
                soft edges un-matted so they carry no white fringe, then
                cropped tight. The source was 1024 square with wide margins,
                and leaving those in would have rendered the badge smaller at
                the same CSS width. The width classes below are unchanged; the
                new artwork is wider than tall where the old was taller than
                wide, so it sits shorter at the same width.
              */}
              {/*
                !! TWO FILES, BECAUSE ONE PIECE OF ARTWORK CANNOT DO BOTH !!

                The light file is dark navy line work drawn for white paper,
                and in dark mode the ribbon edges and the words YEARS OF
                EXCELLENCE sank into the background.

                The dark file is a separate piece of artwork supplied by the
                client on 22 August 2026, drawn for a dark ground. It is used
                exactly as delivered. The only change is that its transparent
                margin was cropped off, which moves no visible pixel and makes
                it render at the same size as the light file: its content box
                is 407 by 355, an aspect of 1.1465 against the light file's
                1.1457, so the two are the same framing.

                !! DO NOT TRY TO GENERATE ONE FROM THE OTHER !!

                That was tried first, lifting the light artwork's HSV value by
                a gamma curve, and it was rejected on sight. Worth recording
                why the measurements said it was fine: contrast ratios were
                computed against the page background for every pixel, which
                counts pixels sitting on top of other artwork, and then again
                for silhouette edge pixels only, which counts the dark outline
                this badge has around its laurel and ribbon by design. Both
                numbers were confident and both were wrong. A multi tone
                illustration is not text on a background, and it does not
                submit to a contrast ratio.

                Swapped by class rather than by a <picture> media query,
                because the theme is a manual toggle. app/layout.tsx sets
                attribute="class", so prefers-color-scheme would ignore
                somebody choosing light while their system is dark.

                Both files are in the markup and both are below the fold, so
                next/image lazy loads them.

                Both also carry the real alt text, and that is not a duplicate.
                `hidden` is display:none, which takes an element out of the
                accessibility tree, so exactly one of these is ever announced.
                The first version of this put alt="" and aria-hidden on the
                dark copy, which left the badge with no accessible name at all
                for anybody reading the site in dark mode.
              */}
              {/*
                !! `unoptimized`, BECAUSE THE OPTIMIZER TURNS THIS BLACK !!

                Rendered as a black square in production on 1 September 2026.
                This badge is one of the seventeen transparent assets named -
                and left unfixed - in 344aa12 ("Stop the image optimizer
                flattening transparent logos onto black"), which hit the
                Handyfeet client logo the same way five days earlier. See the
                same note in case-studies-index.tsx for the full mechanism:
                short version, /_next/image falls back to jpeg (no alpha) for
                any request whose Accept header does not name a configured
                format, and Cloudflare's cache rule for /_next/image ignores
                Vary and had let one such response stick at the edge for
                everybody after it.

                `unoptimized` serves each file exactly as it sits in public/ -
                both are already the right pixels at the right size, so
                nothing else changes - which takes the two files here out of
                that negotiation entirely, same fix as the client logos.

                !! THIS IS NOT THE WHOLE FIX. SEE THE NOTE IN next.config.js !!

                Nine transparent assets under public/ still go through the
                optimizer un-patched, the site wordmark among them. Each is
                one incident away from the same bug until the Cloudflare rule
                itself is fixed to stop caching a response that never asked
                for webp.
              */}
              <div className="shrink-0 flex justify-center lg:mr-6">
                <Image
                  src="/18-years-of-excellence.webp"
                  alt="Eighteen years of excellence"
                  width={692}
                  height={604}
                  unoptimized
                  className="w-48 sm:w-60 lg:w-72 h-auto dark:hidden"
                />
                <Image
                  src="/18-years-of-excellence-dark.png"
                  alt="Eighteen years of excellence"
                  width={407}
                  height={355}
                  unoptimized
                  className="hidden w-48 sm:w-60 lg:w-72 h-auto dark:block"
                />
              </div>
            </div>
        </CtaPanel>
      </Container>
    </Section>
  );
}
