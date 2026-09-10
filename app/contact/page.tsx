import { headers } from "next/headers";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/sections/contact-form";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { MeetingsSection } from "@/components/sections/meetings";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { siTrustpilot } from "simple-icons";
import { clientLogos, testimonialSlides, trustpilotSnapshot } from "@/content/testimonials";
import type { TestimonialSlide } from "@/content/types";
import { awards } from "@/content/recognition";
import { VideoDialog } from "@/components/sections/video-dialog";
import { channels, contactCopy, contactFaqs, offices } from "@/content/contact";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start with a two week automation review. You get a costed plan and a short list of risks, yours to keep either way.",
  path: "/contact",
});

/**
 * The end of the menu, and the end of every call to action.
 *
 * `actions.book` in content/site.ts is "/contact", so this page is where the
 * whole site converts. It was copy and no way to respond to it. It now has a
 * form, built to the reference supplied on 21 August 2026: argument on the
 * left, form on the right, questions underneath.
 *
 * !! THERE IS STILL NO EMAIL ADDRESS OR PHONE NUMBER !!
 *
 * `channels` in content/contact.ts is empty because nobody has supplied one,
 * and the block renders only when it is filled. An invented address on the
 * page every CTA points at would be the worst placement available for one.
 *
 * !! NO CtaSection ON THIS PAGE !!
 *
 * It used to close with one, and every button in it points at actions.book,
 * which is this page. A call to action linking to the page you are already on
 * is a dead control. HowItWorks and the meeting photographs close it instead:
 * what happens after you write, and the people you would be writing to.
 */
export default async function ContactPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  // The office has its own card with a map further down, so it comes out of
  // the list here rather than showing twice. See `offices` in content/contact.
  const listed = channels.filter((channel) => channel.label !== "Office");
  // The Joysale clip: the one whose client speaks to the product and the
  // service both. Looked up by id so reordering the testimonials array cannot
  // swap a different clip onto this page.
  const video = testimonialSlides.find(
    (slide): slide is Extract<TestimonialSlide, { kind: "video" }> =>
      slide.kind === "video" && slide.id === "video-joysale",
  );

  return (
    <main>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          {/*
            No `visible`, so this emits the BreadcrumbList schema and draws
            nothing. The client asked for the trail off this page on 25 August
            2026, which makes it eight of the eight places this component is
            used and leaves the default (off) covering every one of them. See
            the note on `visible` in components/layout/breadcrumbs.tsx for why
            the schema still ships when the trail does not.
          */}
          <Breadcrumbs path="/contact" />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow className="mb-6">{contactCopy.eyebrow}</Eyebrow>
              <h1 className="text-5xl lg:text-6xl font-display tracking-tight leading-[0.98]">
                {contactCopy.title}
              </h1>
              <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {contactCopy.lede}
              </p>

              {/*
                Renders nothing at all while `channels` is empty, rather than
                showing labels with blanks beside them. See content/contact.ts.
              */}
              {listed.length > 0 && (
                <dl className="mt-12 space-y-6 border-t border-foreground/10 pt-8">
                  {listed.map((channel) => (
                    <div key={channel.label}>
                      <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {channel.label}
                      </dt>
                      <dd className="mt-1.5 text-lg">
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground"
                          >
                            {channel.value}
                          </a>
                        ) : (
                          channel.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {/*
                !! NOTHING ELSE GOES IN THIS SPACE !!

                Two blocks have been here and both came out on 21 August 2026.

                First "We meet clients in", listing the five places. That list
                already runs on the home page, the case studies page and every
                long form page's reach section, and a fourth appearance told a
                reader nothing.

                Then "We work in / English and Tamil" and "Delivering since /
                2008" as a replacement. Also cut. The tenure is on the hero
                badges of two other pages already, and neither line was
                something somebody wants at the moment they are deciding
                whether to write.

                The channels above answer where and how to reach us. The form
                is to the right. Anything added here competes with one of them.
              */}
            </div>

            <ContactForm nonce={nonce} />
          </div>
        </Container>
      </Section>

      {/*
        The client row, added 10 September 2026 as the first piece of a trust
        band under the form. The page asked a stranger to write in and showed
        nothing about who had already done so.

        Copied from the row in components/sections/case-studies-index.tsx
        rather than written again: same grid, same single tone, same
        `unoptimized` on the Image. That flag is load bearing, not a leftover.
        The optimizer serves jpeg to any Accept header that does not name webp,
        jpeg has no alpha, and Cloudflare caches the flattened copy for every
        browser after, which is how Handy Feet went out as a grey slab on 26
        August 2026. The note there has the whole story.

        A static row, not the home page's marquee. Movement beside a form pulls
        the eye off the thing the page exists for.
      */}
      {/*
        !! ONE RULE PER SECTION BOUNDARY, LIKE EVERY OTHER SECTION HERE !!

        The row first shipped with the case studies page's own `border-y` on
        the list, inside a section with no rule of its own. Under the offices
        section's full width `border-t` that drew three lines at two widths
        with uneven gaps. Here the section carries the page's standard rule
        and `tight` spacing, the same as "Where we are" and "Before you write",
        and the list carries none.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Businesses we have built for
          </h2>
          <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {clientLogos.map((client) => (
              <li key={client.name} className="flex items-center justify-center">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={140}
                  height={44}
                  unoptimized
                  className="h-8 w-auto object-contain opacity-55 grayscale transition-opacity hover:opacity-100 dark:invert"
                />
              </li>
            ))}
          </ul>

          {/*
            The award badges, added 10 September 2026 as the third piece of
            the trust band. Same data and same treatment as
            components/sections/recognition.tsx, cut down to a row.

            !! FULL COLOUR, UNLIKE THE LOGOS ABOVE, AND THAT IS THE RULE !!

            recognition.tsx settles it: client marks are texture and belong to
            somebody else's brand, so they are greyed back; these badges are
            the content and their colour is how they are recognised. The PNGs
            are transparent and stay that way in both themes. A white plate was
            tried there for dark mode and printed grey rectangles.

            !! THE LABEL SAYS "APP DEVELOPMENT" ON PURPOSE !!

            All four are directory awards for the app development side, not the
            automation work. content/recognition.ts asks for the copy to say so
            rather than let a reader find out, and on a contact page the label
            is the only copy there is. No year either: two badges print 2023 in
            their artwork, two print none, and none is inferred.
          */}
          {/*
            !! AWARDS AND THE RATING SHARE ONE ROW, TO FILL IT !!

            The rating first sat alone at the right of the heading, and the
            four badges below took about two fifths of the width and left the
            rest empty. Both are third party verdicts, so they sit together
            here: badges left, rating right, each under a label in the same
            style, and the row reads edge to edge. No new rule is drawn; the
            section's own boundary lines are the only separators.
          */}
          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Recognised for app development
              </h3>
              <ul className="mt-8 grid grid-cols-2 items-center gap-8 sm:flex sm:justify-between">
                {awards.map((award) => (
                  <li key={award.name}>
                    {/*
                      h-24 / lg:h-32, spread edge to edge with justify-between
                      so the row fills its column up to the rating rather than
                      stopping two fifths of the way and leaving a gap, and
                      sized up to carry the same weight as the rating block
                      beside it. They began at h-14 / lg:h-16, where the
                      lettering was too small to read, then h-20 / lg:h-24.
                      Two across on a phone, where four in a row would shrink.
                    */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={award.logo}
                      alt={`${award.name}: ${award.title}`}
                      loading="lazy"
                      className="h-24 w-auto lg:h-32"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/*
              The Trustpilot score. Same data and star treatment as the
              testimonials section.

              !! NO REVIEW COUNT, ON INSTRUCTION, AND THE NOTE IS NOT OPTIONAL !!

              The client asked for the count to be left off. The note stays:
              these reviews are for Appkodes, the product division, and a bare
              score beside Hitasoft's client row would read as Hitasoft's own.
              See trustpilotSnapshot in content/testimonials.ts.

              4.4 draws four filled stars and an outlined fifth, the same
              rounding the testimonials section uses.
            */}
            <div className="lg:text-right">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Rated on Trustpilot
              </h3>
              <a
                href={trustpilotSnapshot.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex flex-col lg:items-end"
              >
                <span
                  role="img"
                  className="flex gap-1"
                  aria-label={`${trustpilotSnapshot.label}, ${trustpilotSnapshot.score} out of ${trustpilotSnapshot.outOf} on Trustpilot`}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className="h-5 w-5 fill-current"
                      style={{
                        color: i < 4 ? `#${siTrustpilot.hex}` : "transparent",
                        stroke: `#${siTrustpilot.hex}`,
                      }}
                    />
                  ))}
                </span>
                <span className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-5xl tracking-tight tabular-nums">
                    {trustpilotSnapshot.score}
                  </span>
                  <span className="text-muted-foreground">out of {trustpilotSnapshot.outOf}</span>
                </span>
                <span className="mt-2 text-sm underline decoration-foreground/20 underline-offset-4 transition-colors group-hover:decoration-foreground">
                  Read the reviews
                </span>
              </a>
              <p className="mt-3 max-w-xs text-xs text-muted-foreground lg:ml-auto">
                {trustpilotSnapshot.note}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/*
        One client on camera, added 10 September 2026 as the last piece of the
        trust band. A client speaking outranks anything written about them.

        !! THE NOTE UNDER IT IS NOT OPTIONAL !!

        All four client videos are about catalogue products from Appkodes, the
        product division, and this one is Joysale. The caption and description
        are the ones content/testimonials.ts already publishes, traced to the
        channel. The speaker is unnamed because the channel does not name him.
        Same rule as the Trustpilot note in the band above: say whose work it
        was rather than let it pass as Hitasoft's automation practice.
      */}
      {video && (
        <Section spacing="tight" className="border-t border-foreground/10">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <VideoDialog slide={video} />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  A client, in his own words
                </p>
                <h2 className="mt-4 font-display text-3xl lg:text-4xl tracking-tight">
                  {video.title}
                </h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
                <p className="mt-6 text-xs text-muted-foreground">
                  Joysale is a product from Appkodes, our software product division.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/*
        The offices, as cards with a map. Added 10 September 2026.

        Below the form rather than in the column beside it, for two reasons.
        The maps are Google iframes, heavy enough to matter, and down here they
        are off screen on load, so `loading="lazy"` genuinely defers them and
        the LCP work in 9b5854f is not given back. And on a phone the left
        column stacks above the form, so maps there would push the form a
        screen further down on the page whose whole job is that form.

        No API key: google.com/maps?q=...&output=embed is the free keyless
        embed. frame-src in proxy.ts allows www.google.com for it.

        The maps are light by nature and glare on this site's dark theme, so
        dark mode inverts them and turns the hue back round. Roads and water
        keep roughly their colours and the ground goes dark.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>Where we are</SectionTitle>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {offices.map((office) => {
              // The place name, not the postal address: a place resolves to a
              // listing and gets a pin, an address only centres the map.
              const query = encodeURIComponent(office.mapQuery);
              return (
                <li key={office.city} className="overflow-hidden border border-foreground/15">
                  <div className="relative aspect-[16/9] bg-foreground/[0.03]">
                    <iframe
                      src={office.embedSrc ?? `https://www.google.com/maps?q=${query}&output=embed`}
                      title={`Map showing the ${office.city} office`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full border-0 dark:invert-[0.9] dark:hue-rotate-180"
                    />
                  </div>
                  <div className="p-6 lg:p-7">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {office.tag}
                    </p>
                    <h3 className="mt-2 font-display text-2xl tracking-tight">{office.city}</h3>
                    <p className="mt-3 max-w-md text-muted-foreground leading-relaxed">
                      {office.address}
                    </p>
                    <a
                      href={office.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/map mt-5 inline-flex items-center gap-1.5 text-sm underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      Open in Google Maps
                      <ArrowUpRight
                        aria-hidden
                        className="h-3.5 w-3.5 transition-transform group-hover/map:-translate-y-0.5 group-hover/map:translate-x-0.5"
                      />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/*
        The questions somebody has before they fill a form in. Two across, the
        same native <details> pattern the service and industry pages use, with
        rules drawn per item so nothing carries across the column gap.
      */}
      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          <SectionTitle>Before you write</SectionTitle>
          <div className="mt-12 grid md:grid-cols-2 gap-x-12 lg:gap-x-16">
            {contactFaqs.map((faq, i) => (
              <details
                key={faq.question}
                className={`group border-b border-foreground/10 ${
                  i === 0 ? "border-t" : i === 1 ? "md:border-t" : ""
                }`}
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-xl tracking-tight">{faq.question}</h3>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-2xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <HowItWorksSection />
      <MeetingsSection />
    </main>
  );
}
