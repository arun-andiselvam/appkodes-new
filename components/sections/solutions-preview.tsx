import Link from "next/link";
import {
  ArrowRight, ArrowLeftRight, Video, Radio, Car, Truck, Stethoscope,
  ShoppingCart, Tv, Heart, Layers, Sparkles, type LucideIcon,
} from "lucide-react";
import { solutionsCopy, solutionsPreview } from "@/content/home";
import { Button } from "@/components/ui/button";
import { QuoteLauncher } from "@/components/quote/launcher";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

const ICONS: Record<string, LucideIcon> = {
  arrowLeftRight: ArrowLeftRight,
  video: Video,
  radio: Radio,
  car: Car,
  truck: Truck,
  stethoscope: Stethoscope,
  shoppingCart: ShoppingCart,
  tv: Tv,
  heart: Heart,
};

/**
 * "We have built this before": the kinds of apps Appkodes has built many
 * times, and why that experience lets the price and the date be fixed
 * (docs/positioning.md, sections 4.2 and 6). Added 19 September 2026 in the
 * slot Partnership Models held. Every app is built new: these are app types,
 * never ready-made bases. Copy and its rules are in content/home.ts.
 *
 * Cards are not links: there is nothing here to browse or buy. The only next
 * step is the costed plan.
 */
export function SolutionsPreviewSection() {
  return (
    <Section id="solutions" className="border-t border-foreground/10">
      <Container>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="mb-6">{solutionsCopy.eyebrow}</Eyebrow>
            <SectionTitle className="mb-8">
              {solutionsCopy.title}
              <br />
              <span className="text-muted-foreground">{solutionsCopy.titleMuted}</span>
            </SectionTitle>
            <p className="text-lg text-muted-foreground leading-relaxed">{solutionsCopy.lede}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-6 text-base rounded-lg bg-primary hover:bg-primary-hover hover:shadow-glow text-primary-foreground group"
              >
                <QuoteLauncher placement="solutions_preview">
                  <Sparkles aria-hidden />
                  {solutionsCopy.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </QuoteLauncher>
              </Button>
            </div>
          </div>

          <div>
            <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
              {solutionsPreview.map((item) => {
                const Icon = ICONS[item.icon] ?? Layers;
                return (
                  <li key={item.name} className="bg-background p-6">
                    <Icon aria-hidden strokeWidth={1.25} className="w-7 h-7 text-primary" />
                    <p className="mt-5 font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.line}</p>
                  </li>
                );
              })}
            </ul>

            {/* The brief's qualifier, so the promise is never broken by a heavier build. */}
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{solutionsCopy.qualifier}</p>
            <p className="mt-3 text-sm">
              {solutionsCopy.other}{" "}
              <Link
                href={solutionsCopy.otherLink.href}
                className="inline-flex items-center gap-1 text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
              >
                {solutionsCopy.otherLink.name}
                <ArrowRight aria-hidden className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
