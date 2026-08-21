import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm } from "@/components/sections/contact-form";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { MeetingsSection } from "@/components/sections/meetings";
import { channels, contactCopy, contactFaqs } from "@/content/contact";

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
export default function ContactPage() {
  return (
    <main>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          <Breadcrumbs path="/contact" />

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
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
              {channels.length > 0 && (
                <dl className="mt-12 space-y-6 border-t border-foreground/10 pt-8">
                  {channels.map((channel) => (
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

            <ContactForm />
          </div>
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
