import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { NotFoundFinder } from "@/components/sections/not-found-finder";

/**
 * The 404.
 *
 * Next ships a bare white page in a system font. This one keeps the header and
 * the footer, so a wrong URL leaves you inside the site rather than outside
 * it.
 *
 * !! IT ARGUES THE SAME THING EVERY OTHER PAGE ARGUES !!
 *
 * It used to be a heading and the five top level menu links. Correct, and it
 * threw away the one chance this site has to demonstrate its own position
 * rather than describe it. Every service and industry hero draws a field of
 * work where a model settled what it could and held the one case it could not,
 * in red, for a person to look at. A 404 is that event, happening to the
 * visitor. So the address that failed is drawn as the held record and the
 * pages that did match sit around it.
 *
 * !! THE SECTION PADDING AND THE HEADING ARE THE OTHER PAGES', NOT THIS PAGE'S !!
 *
 * This had `min-h-[70vh] flex items-center` and an h2 sized heading, which is
 * a layout no other route uses, and it showed. The Section below carries the
 * same `spacing="none"` with `pt-28 lg:pt-36 pb-20 lg:pb-28` that every
 * service and industry hero carries, and the h1 is the same type ramp. A 404
 * that is laid out like the rest of the site reads as part of it.
 *
 * The interaction lives in components/sections/not-found-finder.tsx, which is
 * a client component because it needs the attempted path and a text input.
 * This shell stays on the server so the copy and the heading are in the HTML a
 * crawler sees, and the heading goes down as a prop so it sits inside the
 * grid's left column rather than above it.
 *
 * !! NO metadata EXPORT HERE, AND THAT IS DELIBERATE !!
 *
 * A not-found file cannot set a status code from metadata, and Next already
 * serves this with a 404, which is the only signal that matters to a crawler.
 * Adding a title here would also override the layout template for a page
 * nobody should be indexing in the first place.
 */
export default function NotFound() {
  return (
    <main>
      <Section spacing="none" className="relative overflow-hidden pt-28 lg:pt-36 pb-20 lg:pb-28">
        {/*
          The number, large and nearly not there.

          The eyebrow says 404 in mono at eleven pixels, which is the correct
          size for a label and is easy to scroll past. This is the same fact at
          a size nobody misses, so the page announces what it is before anybody
          reads a word of it.

          !! SEVEN PER CENT, AND THAT IS ABOUT THE CEILING !!

          It sits behind live text. Four per cent read as a smudge rather than
          a number, so this is seven, which is the point where the numerals are
          unmistakable and the paragraph crossing them still measures well
          clear of AA. Much past this and the copy starts fighting it, which is
          worse than having no watermark at all. The colour comes from the
          foreground token rather than a literal, so it inverts with the theme
          and stays equally faint on both.

          aria-hidden because it is decoration: the eyebrow already carries the
          text, and a screen reader reading "404" twice helps nobody. Rendered
          here in the server component, so the whole thing costs no JavaScript.
        */}
        <span
          aria-hidden="true"
          /*
            Left aligned, not centred.

            Centred put the last glyph behind the panel, whose tiles are
            opaque, so the watermark read as "40" with a smudge after it. The
            copy column is the only part of this layout with nothing solid in
            it, so all three numerals live there and the paragraph crosses them
            without either one suffering.
          */
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-start pl-[6%] font-display text-[clamp(12rem,24vw,24rem)] leading-none tracking-tighter text-foreground/[0.07]"
        >
          404
        </span>

        <Container className="relative z-10">
          <NotFoundFinder
            heading={
              <>
                <Eyebrow className="mb-6">404</Eyebrow>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                  This one we could
                  <br />
                  <span className="text-muted-foreground">not match.</span>
                </h1>
                <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  The rest of this site argues that a model should settle what it
                  can and hand back what it cannot. This is that, happening to
                  you. The address you asked for did not match a page, so it is
                  held here for a person to sort.
                </p>
              </>
            }
          />
        </Container>
      </Section>
    </main>
  );
}
