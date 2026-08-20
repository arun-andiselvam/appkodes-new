"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useInView } from "@/hooks/use-in-view";
import { assurances, audienceSegments } from "@/content/audiences";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * The reveal is the reason this section survived the rewrite, so it stays
 * exactly as it was. Lines slide in, characters resolve out of a blur.
 */
const panelAnimationStyles = `
  .aud-row {
    opacity: 0;
    transform: translateX(-8px);
    animation: audRowReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes audRowReveal {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .aud-char {
    opacity: 0;
    filter: blur(8px);
    animation: audCharReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes audCharReveal {
    to {
      opacity: 1;
      filter: blur(0);
    }
  }

  @keyframes audProgress {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

/** Character by character reveal, used on the lines that carry the meaning. */
function RevealText({
  text,
  delay,
  align = "start",
}: {
  text: string;
  delay: number;
  align?: "start" | "end";
}) {
  return (
    <span className={`inline-flex flex-wrap ${align === "end" ? "justify-end" : ""}`}>
      {text.split("").map((char, index) => (
        <span
          key={`${text}-${index}`}
          className="aud-char"
          style={{ animationDelay: `${delay + index * 15}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

/** How long each tab holds before the next one takes over. */
const ROTATION_MS = 6000;

export function AudiencesSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  // useInView latches on first sight by default, so the reveal flag cannot
  // also answer "is the panel on screen right now". This second observer keeps
  // reporting, which is what the rotation needs.
  const [panelRef, panelInView] = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.2,
  });

  const reducedMotion = useReducedMotion();

  const segment = audienceSegments[active];
  // Below two segments a tab strip is a control with nothing to choose. The
  // header falls back to naming the one audience on show, which lets segments
  // land one at a time without a half written tab reaching the page.
  const showTabs = audienceSegments.length > 1;


  /*
   * Whether the tabs advance at all. Off screen they should not, because
   * cycling tabs nobody is watching wastes the one the visitor arrives on.
   * Neither should they when the reader has asked for reduced motion, which is
   * exactly the setting content that moves by itself has to honour.
   *
   * Pause is deliberately separate. Hovering holds the current tab and the
   * progress bar freezes mid fill, so the reader can see it is being held for
   * them rather than wonder whether the thing broke.
   */
  const rotating = showTabs && panelInView && !reducedMotion;

  useEffect(() => {
    if (!rotating || paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % audienceSegments.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [rotating, paused]);

  return (
    <Section id="audiences" ref={sectionRef} className="overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: panelAnimationStyles }} />
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: what does not change with size */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Eyebrow className="mb-6">
              Who we work with
            </Eyebrow>
            <SectionTitle className="mb-8">
              Your size changes
              <br />
              <span className="text-muted-foreground">what we build first.</span>
            </SectionTitle>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              A two person startup and a two hundred person company want different work
              from us. One of them needs a product to exist at all. The other one simply
              wants their week back. Those are not the same job, so we do not sell them
              the same thing.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {assurances.map((assurance, index) => (
                <div
                  key={assurance.title}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  <h3 className="font-medium mb-1">{assurance.title}</h3>
                  <p className="text-sm text-muted-foreground">{assurance.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the specifics for this segment */}
          <div
            className={`lg:sticky lg:top-32 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/*
              Hover anywhere in the box holds the current tab. The pointer being
              here is the strongest signal that somebody is reading, and reading
              is when an automatic change is least welcome. Focus does the same
              for anyone arriving by keyboard, who cannot hover at all.
            */}
            <div
              ref={panelRef}
              className="border border-foreground/10"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              {/*
                The headcount used to sit at the right of this strip. Two tabs
                plus that label already overflowed a 1024px viewport, where each
                column is about 432px, and four tabs will not fit however it is
                arranged. So the strip carries tabs only and scrolls when it has
                to, and the headcount moved into the panel where it has room.
              */}
              <div className="overflow-x-auto border-b border-foreground/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {showTabs ? (
                  /*
                    The sliding line lives in this inner element rather than the
                    scroll container. Absolute offsets resolve against the
                    scrolled content that way, so the indicator stays under its
                    tab once the strip is scrolled sideways.
                  */
                  <div className="flex w-max">
                    {audienceSegments.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActive(index)}
                        className={`group shrink-0 px-5 py-4 text-sm font-mono whitespace-nowrap transition-colors relative ${
                          active === index
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.label}
                        {/*
                          Three states under a tab, never two at once.
                          The active tab while rotating fills a track over the
                          hold time, the same bar the process section uses, so
                          the next change is visible before it happens. Active
                          without rotation gets a plain line, because a bar that
                          fills and then does nothing is a lie. Everything else
                          gets the hover line, which wipes in from the left and
                          sits lighter so the two never compete.
                        */}
                        {active === index ? (
                          rotating ? (
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground/15 overflow-hidden">
                              <span
                                key={`${item.id}-${active}`}
                                className="block h-full w-0 bg-primary"
                                style={{
                                  animation: `audProgress ${ROTATION_MS}ms linear forwards`,
                                  animationPlayState: paused ? "paused" : "running",
                                }}
                              />
                            </span>
                          ) : (
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
                          )
                        ) : (
                          <span className="absolute bottom-0 left-5 right-5 h-px bg-foreground/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* The copy button went with the code. Nobody copies a case. */
                  <span className="block px-5 py-4 text-sm font-mono">{segment.label}</span>
                )}
              </div>

              {/*
                Three faces doing three jobs. The panel used to be JetBrains
                Mono at one size from top to bottom, which is right for code and
                wrong for a pitch: nothing led, and the strongest fact on the
                card sat at the same weight as the word "You".

                The situation takes the serif the rest of the site uses for
                headlines. Labels keep the mono, matching every other eyebrow on
                the page. Values move to the sans that carries body copy. Rows
                are separated by hairlines and values sit right, so the card
                reads as an estimate, which is the document a founder who fears
                open ended cost actually wants to see.
              */}
              <div className="px-8 py-10 bg-foreground/[0.01]">
                <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {segment.headcount}
                </span>
                <h3 className="aud-row font-display text-2xl lg:text-3xl tracking-tight mb-8">
                  <RevealText key={`${segment.id}-situation`} text={segment.situation} delay={0} />
                </h3>

                <dl>
                  {segment.rows.map((row, index) => (
                    <div
                      key={`${segment.id}-${row.label}`}
                      className="aud-row flex items-baseline justify-between gap-6 border-t border-foreground/10 py-4"
                      style={{ animationDelay: `${(index + 1) * 90}ms` }}
                    >
                      <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground shrink-0">
                        {row.label}
                      </dt>
                      <dd
                        className={`text-right ${
                          row.emphasis
                            ? "font-display text-3xl lg:text-4xl tracking-tight"
                            : "text-base text-foreground/80"
                        }`}
                      >
                        <RevealText
                          key={`${segment.id}-${row.label}-value`}
                          text={row.value}
                          delay={(index + 1) * 90}
                          align="end"
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
