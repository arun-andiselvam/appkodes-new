import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { MeetingsSection } from "@/components/sections/meetings";
import { CtaSection } from "@/components/sections/cta";
import { meetingPlaces } from "@/content/meetings";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start with a two week automation review. You get a costed plan and a short list of risks, yours to keep either way.",
  path: "/contact",
});

/**
 * The end of the menu.
 *
 * !! THIS PAGE HAS NO CONTACT DETAILS !!
 *
 * There is no email address, phone number or form anywhere in this repository,
 * so there is none on this page. Inventing one would be worse than the gap.
 * What the page has instead is the thing a visitor actually wants at this
 * point, which is to know what happens if they get in touch, and where the
 * people are.
 *
 * A form needs a destination that survives the CSP in proxy.ts, where
 * `form-action` is 'self'. That means a route handler here rather than a third
 * party embed. Add the address and the form together; the route and the menu
 * entry are already in place.
 */
export default function ContactPage() {
  return (
    <main>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          <Breadcrumbs path="/contact" />
          <Eyebrow className="mb-6">Contact</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            One conversation, then a plan.
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            The first step is a review rather than a proposal. Two weeks with
            your systems, then a costed plan and the risks written down. You
            keep it whatever you decide.
          </p>

          {/*
            Where clients are, taken from the photographs further down. It
            answers the timezone question a buyer outside India asks before
            they book anything, and it says it with places we have pictures of.

            The label is the whole point and must not be loosened. "We meet
            clients in" is true. "Where we are" is not, because there is no
            office in any of them. This page had it right while four other
            places had it wrong. See docs/positioning.md, corrected at source
            on 21 August 2026.
          */}
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="text-sm font-mono text-muted-foreground">
                We meet clients in
              </dt>
              <dd className="mt-2 text-lg">
                {meetingPlaces.map((place) => place.location).join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-mono text-muted-foreground">
                Delivering since
              </dt>
              <dd className="mt-2 text-lg">2008</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <HowItWorksSection />
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
