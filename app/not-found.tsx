import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
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
 * The interaction lives in components/sections/not-found-finder.tsx, which is
 * a client component because it needs the attempted path and a text input.
 * This shell stays on the server so the copy and the heading are in the HTML a
 * crawler sees.
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
      <Section className="min-h-[70vh] flex items-center">
        <Container>
          <Eyebrow className="mb-6">404</Eyebrow>
          <SectionTitle className="mb-6 max-w-3xl">
            This one we could
            <br />
            <span className="text-muted-foreground">not match.</span>
          </SectionTitle>

          <p className="mb-14 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The rest of this site argues that a model should settle what it can
            and hand back what it cannot. This is that, happening to you. The
            address you asked for did not match a page, so it is held here for a
            person to sort.
          </p>

          <NotFoundFinder />
        </Container>
      </Section>
    </main>
  );
}
