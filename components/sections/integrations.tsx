"use client";

import {
  siClaude, siGooglegemini, siMeta, siMistralai, siQwen, siDeepseek,
  siPython, siTypescript, siLaravel, siReact, siPostgresql, siRedis,
  siN8n, siModelcontextprotocol, siDocker, siFlutter, siStripe,
  siCursor, siGithubcopilot, siV0, siVercel, siGithubactions, siSentry,
} from "simple-icons";

import { useInView } from "@/hooks/use-in-view";
import type { Integration } from "@/content/types";
import { aiModels, techStack, buildTools } from "@/content/integrations";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * Only the marks actually used, imported by name.
 *
 * simple-icons ships over three thousand icons and sets sideEffects false, so
 * named imports drop the rest at build time. Reaching into the package by a
 * computed key would defeat that and pull the whole set into the client
 * bundle, which is why the lookup is this hand written map rather than an
 * index access on the module.
 */
const BRAND_PATHS: Record<string, string> = Object.fromEntries(
  [
    ["siClaude", siClaude], ["siGooglegemini", siGooglegemini], ["siMeta", siMeta],
    ["siMistralai", siMistralai], ["siQwen", siQwen], ["siDeepseek", siDeepseek],
    ["siPython", siPython], ["siTypescript", siTypescript], ["siLaravel", siLaravel],
    ["siReact", siReact], ["siPostgresql", siPostgresql], ["siRedis", siRedis],
    ["siN8n", siN8n], ["siModelcontextprotocol", siModelcontextprotocol],
    ["siDocker", siDocker], ["siFlutter", siFlutter], ["siStripe", siStripe],
    ["siCursor", siCursor], ["siGithubcopilot", siGithubcopilot], ["siV0", siV0],
    ["siVercel", siVercel], ["siGithubactions", siGithubactions], ["siSentry", siSentry],
  ].map(([key, icon]) => [key as string, (icon as { path: string }).path]),
);

/**
 * The logo, or a monogram when there is no logo to use.
 *
 * Marks render in currentColor rather than brand colour. Two dozen palettes
 * across three rows would fight the rest of the page, and a single tone keeps
 * the name doing the reading while the mark works as texture. It also means
 * dark mode needs no second set of assets.
 *
 * Eight entries have no mark. Some are capabilities rather than companies,
 * and some belong to brands that have had their icons pulled from the set.
 * They get a lettered box at the same size, never a stand in logo, because
 * borrowing another company's mark is the kind of small lie that this site
 * has already had to clean up once.
 */
function BrandMark({ icon, name }: { icon?: string; name: string }) {
  const path = icon ? BRAND_PATHS[icon] : undefined;
  const shared =
    "shrink-0 w-5 h-5 mt-1 text-muted-foreground group-hover:text-foreground transition-colors";

  if (!path) {
    return (
      <span
        aria-hidden="true"
        className={`${shared} border border-current/30 flex items-center justify-center text-[10px] font-mono leading-none`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${shared} fill-current`}>
      <path d={path} />
    </svg>
  );
}

/**
 * One scrolling row.
 *
 * The set is rendered twice because the keyframes translate by -50%. The
 * trailing gap sits inside each set as padding rather than on the outer flex.
 * With a gap on the outer element the halves are not equal, so -50% landed
 * half a gap short and the row jumped every time it looped.
 */
function MarqueeRow({
  label,
  items,
  reverse = false,
}: {
  label: string;
  items: Integration[];
  reverse?: boolean;
}) {
  return (
    <div className="w-full">
      <Container>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </Container>
      <div className="mt-4 flex">
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            className={`flex gap-6 pr-6 shrink-0 ${reverse ? "marquee-reverse" : "marquee"}`}
          >
            {items.map((item) => (
              <div
                key={`${item.name}-${setIndex}`}
                className="shrink-0 px-8 py-6 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <BrandMark icon={item.icon} name={item.name} />
                  <div>
                    <div className="text-lg font-medium group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {item.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntegrationsSection() {
  const [sectionRef, isVisible] = useInView<HTMLElement>();

  return (
    <Section id="integrations" ref={sectionRef} className="overflow-hidden">
      <Container>
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Eyebrow className="mb-6" rule="both">
            What we build with
          </Eyebrow>
          <SectionTitle className="mb-6">
            We pick the model
            <br />
            that fits the job.
          </SectionTitle>
          {/*
            The old line promised 200+ pre-built integrations and a stack
            connected in minutes. That is a product claim from a company that
            sells connectors, and it invited a count nobody could back. This
            one answers the lock in fear from docs/positioning.md instead.
          */}
          <p className="text-xl text-muted-foreground">
            Some jobs need the strongest model on the market. Most of them do not need it
            at all. Paying a top rate for work a small model handles is how an automation
            budget disappears. Whatever we build stays yours to take elsewhere.
          </p>
        </div>
      </Container>

      {/* Full-width marquees outside the container */}
      {/*
        Three rows, three questions. What thinks, what runs, and how it gets
        built. The middle and bottom rows look alike and are not: everything in
        the middle row keeps running in the client's business after we leave,
        and nothing in the bottom row does.

        Rows one and three share the 30s duration but hold different numbers of
        cards, so the wider row travels faster and the two never look locked
        together.
      */}
      <div className="space-y-10">
        <MarqueeRow label="Models we build on" items={aiModels} />
        <MarqueeRow label="The stack around them" items={techStack} reverse />
        <MarqueeRow label="How we build it" items={buildTools} />
      </div>
    </Section>
  );
}
