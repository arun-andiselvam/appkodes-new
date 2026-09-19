import Link from "next/link";
import {
  ArrowRight, Check, ChevronDown, Quote, Sparkles, Layers, X, ShieldCheck, Clock,
  Smartphone, ChefHat, Bike, LayoutDashboard, Utensils, Search, MapPin,
  ShoppingBasket, Repeat, Star, Megaphone, Gift, Heart, MessageCircle,
  Store, Building2, Soup, Truck, Briefcase, Package, CalendarCheck, Leaf, Crown, Wrench, Activity,
  type LucideIcon,
} from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { serviceProcess, storeSubmission, type AppService, type AppServiceItem } from "@/content/app-services";
import { whatsappContact } from "@/content/site";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";
import { QuoteLauncher } from "@/components/quote/launcher";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { CtaSection } from "@/components/sections/cta";
import { AppExplorer } from "@/components/sections/app-explorer";
import { SectionJumpNav } from "@/components/sections/section-jump-nav";
import { ServiceOrbit } from "@/components/sections/service-orbit";

/*
 * Icons keyed from content/app-services.ts, so the content file stays free of
 * React imports.
 */
const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone, chefHat: ChefHat, bike: Bike, dashboard: LayoutDashboard,
  utensils: Utensils, search: Search, mapPin: MapPin, basket: ShoppingBasket,
  repeat: Repeat, star: Star, megaphone: Megaphone, gift: Gift, heart: Heart,
  chat: MessageCircle, store: Store, building: Building2, soup: Soup, truck: Truck,
  briefcase: Briefcase, package: Package, calendar: CalendarCheck, leaf: Leaf, crown: Crown,
  wrench: Wrench, activity: Activity, shield: ShieldCheck,
};
const icon = (key?: string) => (key && ICONS[key]) || Layers;

function WhatsappGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d={siWhatsapp.path} />
    </svg>
  );
}

/** The heading block most sections open with. */
function Intro({ eyebrow, title, lede, className = "mb-14" }: { eyebrow: string; title: string; lede?: string; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
      <SectionTitle className="mb-6">{title}</SectionTitle>
      {lede && <p className="text-lg text-muted-foreground leading-relaxed">{lede}</p>}
    </div>
  );
}

/** A grid of icon cards, shared by several sections. */
function ItemGrid({ items, columns = "lg:grid-cols-3" }: { items: AppServiceItem[]; columns?: string }) {
  return (
    <ul className={`grid sm:grid-cols-2 ${columns} gap-4`}>
      {items.map((item) => {
        const Icon = icon(item.icon);
        return (
          <li key={item.title} className="rounded-xl border border-foreground/10 bg-background p-6 transition-colors hover:border-primary/40">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <Icon aria-hidden strokeWidth={1.5} className="w-5 h-5" />
            </span>
            <p className="mt-5 font-medium">{item.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** The in-page jump bar, in page order. */
const JUMP = [
  ["why", "Why own it"],
  ["apps", "The apps"],
  ["flow", "How it works"],
  ["features", "Features"],
  ["earn", "Ways to earn"],
  ["process", "Price and date"],
  ["stores", "Store launch"],
  ["tech", "Tech"],
  ["support", "After launch"],
  ["faq", "Questions"],
] as const;

/**
 * The Appkodes service page, 19 September 2026. One template for every entry
 * in content/app-services.ts, laid out to the positioning brief (section 11):
 * outcome first, why own the app, what you get, how it runs, how you earn,
 * who it is for, the fixed price and date process with its qualifier, what
 * goes live first, the tech, what sets the price, why the date holds
 * (experience, never reuse), support, proof, FAQs and the close.
 *
 * No breadcrumb (client, 19 September 2026). Server rendered apart from the
 * app explorer's tabs; the FAQ is native details/summary.
 */
export function AppServicePage({ service }: { service: AppService }) {
  const {
    hero, story, ecosystem, whyOwn, apps, flow, features, models, audiences, releases,
    tech, pricing, experience, support, quotes, faqs, related,
  } = service;

  return (
    <main>
      {/* ---- Hero ------------------------------------------------------- */}
      {/* At least one full screen tall, so the sticky section bar starts below the fold. */}
      <Section spacing="none" className="relative overflow-hidden min-h-svh flex items-center pt-24 lg:pt-28 pb-16 lg:pb-20">
        <div aria-hidden className="signal-traces-grid absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <Container className="relative w-full">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-10 items-center">
            <div>
              <Eyebrow className="mb-6">{service.group}</Eyebrow>
              <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95] text-balance">
                {service.name}
              </h1>
              <p className="mt-8 max-w-2xl text-lg lg:text-xl text-muted-foreground leading-relaxed">{hero.lede}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-13 px-7 text-base rounded-lg bg-primary hover:bg-primary-hover hover:shadow-glow text-primary-foreground group"
                >
                  <QuoteLauncher placement="service_hero">
                    <Sparkles aria-hidden />
                    Get a free costed plan
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </QuoteLauncher>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-13 px-6 text-base rounded-lg border-foreground/20 hover:bg-foreground/5">
                  <a href={whatsappContact.href} target="_blank" rel="noopener noreferrer">
                    <WhatsappGlyph />
                    WhatsApp us
                  </a>
                </Button>
              </div>
              {/* What is fixed before we start. */}
              <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 max-w-2xl rounded-xl border border-foreground/10 bg-card/70 backdrop-blur-sm divide-foreground/10 [&>div]:border-foreground/10 [&>div:nth-child(odd)]:border-r sm:[&>div]:border-r sm:[&>div:last-child]:border-r-0 [&>div:nth-child(-n+2)]:border-b sm:[&>div:nth-child(-n+2)]:border-b-0">
                {hero.facts.map((fact) => (
                  <div key={fact.label} className="px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The system, as a radar. */}
            <ServiceOrbit
              hub={ecosystem.hub}
              inner={apps.items.filter((a) => a.device !== "custom").map((a) => ({ name: a.name, icon: a.icon }))}
              outer={ecosystem.items}
            />
          </div>

        </Container>
      </Section>

      {/* ---- On this page ----------------------------------------------- */}
      <SectionJumpNav items={JUMP} />

      {/* ---- Why own your app ------------------------------------------- */}
      <Section id="why" className="scroll-mt-16">
        <Container>
          <Eyebrow className="mb-6">Why own it</Eyebrow>
          {/* The comparison cards sit centred against the text column. */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-center">
            <div>
              <div className="max-w-3xl mb-10">
                <SectionTitle className="mb-6">{whyOwn.title}</SectionTitle>
                <p className="text-lg text-muted-foreground leading-relaxed">{whyOwn.lede}</p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                {whyOwn.points.map((p) => {
                  const Icon = icon(p.icon);
                  return (
                    <li key={p.title}>
                      <Icon aria-hidden strokeWidth={1.5} className="w-6 h-6 text-primary" />
                      <p className="mt-3 font-medium">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* The comparison as two cards: the usual route, and ours raised above it. */}
            <div className="relative grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl border border-foreground/10 bg-card/60 p-6 lg:p-7 sm:mt-10">
                <p className="text-sm font-medium text-muted-foreground">{whyOwn.comparison.columns[0]}</p>
                <dl className="mt-6 space-y-5">
                  {whyOwn.comparison.rows.map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">{row.label}</dt>
                      <dd className="mt-1 flex gap-2 text-sm text-muted-foreground">
                        <X aria-hidden className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                        {row.values[0]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <span aria-hidden className="hidden sm:grid absolute left-1/2 top-1/2 -translate-x-1/2 z-10 place-items-center w-10 h-10 rounded-full border border-foreground/10 bg-background font-mono text-[11px] text-muted-foreground">
                vs
              </span>

              <div className="rounded-2xl p-6 lg:p-7 text-white shadow-[0_24px_60px_-20px_rgb(0_64_204/0.55)] sm:mb-10" style={{ background: "var(--feature-card)" }}>
                <p className="text-sm font-medium">{whyOwn.comparison.columns[1]}</p>
                <dl className="mt-6 space-y-5">
                  {whyOwn.comparison.rows.map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/70">{row.label}</dt>
                      <dd className="mt-1 flex gap-2 text-sm font-medium">
                        <Check aria-hidden className="w-4 h-4 shrink-0 mt-0.5" />
                        {row.values[1]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* ---- The apps you get -------------------------------------------- */}
      <Section id="apps" className="scroll-mt-16 border-t border-foreground/10 bg-muted/40">
        <Container>
          <Intro eyebrow="What you get" title={apps.title} lede={apps.lede} />
          <AppExplorer apps={apps.items} />
        </Container>
      </Section>

      {/* ---- How an order moves ------------------------------------------ */}
      <Section id="flow" className="scroll-mt-16 border-t border-foreground/10">
        <Container>
          <Intro eyebrow="How it works" title={flow.title} lede={flow.lede} />
          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-7 gap-y-10 gap-x-4">
            <span aria-hidden className="hidden lg:block absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-primary/60 via-primary/30 to-primary/60" />
            {flow.steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="relative grid place-items-center w-10 h-10 rounded-full border border-primary/40 bg-background font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{step.who}</p>
                <p className="mt-1.5 text-lg font-display tracking-tight">{step.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---- Features ----------------------------------------------------- */}
      <Section id="features" className="scroll-mt-16 border-t border-foreground/10 bg-muted/40">
        <Container>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-16">
            <div className="lg:sticky lg:top-24 self-start">
              <Eyebrow className="mb-6">Features</Eyebrow>
              <SectionTitle className="mb-6">{features.title}</SectionTitle>
              <p className="text-muted-foreground leading-relaxed">{features.lede}</p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
              {features.items.map((item) => {
                const Icon = icon(item.icon);
                return (
                  <li key={item.title} className="bg-background p-6 flex gap-4">
                    <Icon aria-hidden strokeWidth={1.5} className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <span>
                      <span className="block font-medium">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---- Ways to earn ------------------------------------------------- */}
      <Section id="earn" className="scroll-mt-16 border-t border-foreground/10">
        <Container>
          <Eyebrow className="mb-6">Ways to earn</Eyebrow>
          {/* The receipt centres on the heading and list, not the eyebrow above them. */}
          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-center">
            <div>
              <div className="max-w-3xl mb-10">
                <SectionTitle className="mb-6">{models.title}</SectionTitle>
                <p className="text-lg text-muted-foreground leading-relaxed">{models.lede}</p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {models.items.map((item) => {
                  const Icon = icon(item.icon);
                  return (
                    <li key={item.title} className="flex gap-3">
                      <Icon aria-hidden strokeWidth={1.5} className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                      <span>
                        <span className="block font-medium">{item.title}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* One example order, showing where the platform earns. */}
            <figure className="relative mx-auto w-full max-w-md">
              <div className="rounded-2xl border border-foreground/10 bg-card shadow-[0_24px_60px_-24px_rgb(11_15_23/0.35)] overflow-hidden">
                <div className="px-7 pt-7 pb-5 border-b border-dashed border-foreground/15">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Example order #2041</p>
                  <p className="mt-2 text-lg font-display tracking-tight">2 × Margherita, 1 × Garlic bread</p>
                </div>
                <dl className="px-7 py-5 space-y-3 text-sm">
                  {[
                    ["Food total", "$24.00", false],
                    ["Delivery fee", "$2.99", true],
                    ["Service fee", "$0.99", true],
                    ["Commission from the restaurant, 15%", "$3.60", true],
                  ].map(([label, value, yours]) => (
                    <div key={label as string} className="flex items-center justify-between gap-4">
                      <dt className={yours ? "flex items-center gap-2" : "text-muted-foreground"}>
                        {yours && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        {label}
                      </dt>
                      <dd className={yours ? "font-medium text-primary" : "text-muted-foreground"}>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mx-4 mb-4 rounded-xl bg-primary/10 px-5 py-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Your platform earns</span>
                  <span className="text-2xl font-display tracking-tight text-primary">$7.58</span>
                </div>
                <p className="px-7 pb-6 text-xs text-muted-foreground leading-relaxed">
                  Plus subscriptions and featured listings, billed monthly. Figures are an example: you set every rate.
                </p>
              </div>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ---- Who it is for ------------------------------------------------ */}
      <Section className="border-t border-foreground/10 bg-muted/40">
        <Container>
          <Intro eyebrow="Who it is for" title={audiences.title} lede={audiences.lede} />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {audiences.items.map((item) => {
              const Icon = icon(item.icon);
              return (
                <li key={item.title} className="group flex flex-col rounded-xl border border-foreground/10 bg-background p-6 transition-colors hover:border-primary/40">
                  <Icon aria-hidden strokeWidth={1.25} className="w-7 h-7 text-muted-foreground transition-colors group-hover:text-primary" />
                  <p className="mt-4 font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  <p className="mt-5 pt-4 border-t border-foreground/10 font-mono text-[11px] uppercase tracking-[0.1em] text-primary">Built to fit</p>
                  <ul className="mt-3 space-y-2">
                    {item.builds.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm leading-snug">
                        <Check aria-hidden className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ---- Fixed price and date, then the release plan ------------------ */}
      <Section id="process" className="scroll-mt-16 bg-emphasis text-emphasis-foreground">
        <Container>
          <div className="max-w-3xl mb-14">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-emphasis-foreground/50 mb-6">
              <span className="w-8 h-px bg-emphasis-foreground/30" />
              {serviceProcess.eyebrow}
            </span>
            <SectionTitle>{serviceProcess.title}</SectionTitle>
          </div>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-emphasis-foreground/10 border border-emphasis-foreground/10 rounded-2xl overflow-hidden">
            {serviceProcess.steps.map((step, i) => (
              <li key={step.title} className="bg-emphasis p-7 flex flex-col">
                <span className="font-mono text-xs text-emphasis-accent">{String(i + 1).padStart(2, "0")} · {step.when}</span>
                <h3 className="mt-5 text-xl font-display tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm text-emphasis-foreground/70 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-emphasis-foreground/60 max-w-3xl">{serviceProcess.qualifier}</p>

          <div className="mt-20 pt-16 border-t border-emphasis-foreground/10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-16">
            <div>
              <h3 className="text-3xl lg:text-4xl font-display tracking-tight text-balance">{releases.title}</h3>
              <p className="mt-5 text-emphasis-foreground/70 leading-relaxed">{releases.lede}</p>
            </div>
            <ol className="grid md:grid-cols-3 gap-4">
              {releases.items.map((r, i) => (
                <li
                  key={r.label}
                  className={`rounded-2xl p-6 border ${i === 0 ? "border-emphasis-accent/60 bg-emphasis-accent/10" : "border-emphasis-foreground/10"}`}
                >
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-emphasis-accent">
                    <Clock aria-hidden className="w-3.5 h-3.5" />
                    {r.when}
                  </p>
                  <p className="mt-4 text-xl font-display tracking-tight">{r.label}</p>
                  <ul className="mt-5 space-y-2.5">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-emphasis-foreground/80 leading-snug">
                        <Check aria-hidden className="w-4 h-4 shrink-0 mt-0.5 text-emphasis-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ---- App store submission ----------------------------------------- */}
      <Section id="stores" className="scroll-mt-16">
        <Container>
          <Eyebrow className="mb-6">{storeSubmission.eyebrow}</Eyebrow>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
            <div>
              <div className="max-w-3xl mb-10">
                <SectionTitle className="mb-6">{storeSubmission.title}</SectionTitle>
                <p className="text-lg text-muted-foreground leading-relaxed">{storeSubmission.lede}</p>
              </div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-primary mb-5">
                <ShieldCheck aria-hidden className="w-4 h-4" strokeWidth={1.5} />
                Included in every build
              </p>
              <ul className="space-y-4">
                {storeSubmission.included.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <Check aria-hidden className="w-4 h-4 shrink-0 mt-1 text-primary" />
                    <span>
                      <span className="font-medium">{item.title}.</span>{" "}
                      <span className="text-muted-foreground">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-card p-7 lg:p-8">
              <p className="text-xl font-display tracking-tight">{storeSubmission.yours.title}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{storeSubmission.yours.text}</p>
              <ul className="mt-7 grid sm:grid-cols-2 gap-4">
                {storeSubmission.yours.fees.map((f) => (
                  <li key={f.store} className="rounded-xl border border-foreground/10 bg-background p-5">
                    <span className="flex items-center gap-2.5">
                      <BrandMark icon={f.icon} name={f.store} className="shrink-0 w-5 h-5 text-foreground" />
                      <span className="text-sm font-medium">{f.store}</span>
                    </span>
                    <span className="mt-4 block text-2xl font-display tracking-tight">{f.fee}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{f.note}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-primary/10 px-5 py-4 flex items-center justify-between gap-4">
                <span className="text-sm font-medium">Submission, listings and review</span>
                <span className="text-sm font-medium text-primary whitespace-nowrap">Included</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{storeSubmission.yours.footnote}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Tech and integrations ---------------------------------------- */}
      <Section id="tech" className="scroll-mt-16 border-t border-foreground/10">
        <Container>
          <Intro eyebrow="Tech" title={tech.title} lede={tech.lede} />
          <div className="grid md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
            {tech.groups.map((g) => (
              <div key={g.label} className="bg-background p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{g.label}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li key={it.name} className="group flex items-center gap-2 rounded-lg border border-foreground/10 px-3 py-2 text-sm">
                      <BrandMark icon={it.icon} name={it.name} className="shrink-0 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      {it.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- What sets the price ------------------------------------------ */}
      <Section className="border-t border-foreground/10 bg-muted/40">
        <Container>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-16">
            <div className="lg:sticky lg:top-24 self-start">
              <Eyebrow className="mb-6">Price</Eyebrow>
              <SectionTitle className="mb-6">{pricing.title}</SectionTitle>
              <p className="text-muted-foreground leading-relaxed">{pricing.lede}</p>
              <Button asChild size="lg" className="mt-8 h-12 px-6 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground group">
                <QuoteLauncher placement="service_hero">
                  Get your fixed price
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </QuoteLauncher>
              </Button>
            </div>
            <ItemGrid items={pricing.factors} columns="lg:grid-cols-2" />
          </div>
        </Container>
      </Section>

      {/* ---- Why the date holds: experience with the app type -------------- */}
      <Section spacing="tight">
        <Container>
          <div className="rounded-2xl p-8 lg:p-12 text-white grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-end" style={{ background: "var(--feature-card)" }}>
            <div className="max-w-3xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">Why the date holds</span>
              <p className="mt-4 text-3xl lg:text-4xl font-display tracking-tight leading-tight">{experience.title}</p>
              <p className="mt-4 text-white/90 leading-relaxed">{experience.text}</p>
            </div>
            <Button asChild size="lg" className="h-12 px-6 rounded-lg bg-white text-[color:var(--feature-card-ink)] hover:bg-white/90">
              <Link href="/#solutions">
                See the apps we build
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* ---- After launch ------------------------------------------------- */}
      <Section id="support" className="scroll-mt-16">
        <Container>
          <Intro eyebrow="After launch" title={support.title} lede={support.lede} />
          <ItemGrid items={support.items} />
        </Container>
      </Section>

      {/* ---- What clients say --------------------------------------------- */}
      {quotes.length > 0 && (
        <Section className="border-t border-foreground/10 bg-muted/40">
          <Container>
            <Intro eyebrow="Clients" title="What our clients say." className="mb-8" />
            {story && (
              <div className="mb-10 inline-flex flex-col md:flex-row md:items-center gap-2 md:gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5">
                <p className="flex items-center gap-2 shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {story.label} · {story.client}, {story.place}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{story.text}</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-5">
              {quotes.map((q) => (
                <figure key={q.name} className="rounded-2xl border border-foreground/10 bg-background p-8 flex flex-col">
                  <Quote aria-hidden className="w-7 h-7 text-primary/60" />
                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed">{q.quote}</blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-foreground/10 text-sm">
                    <span className="font-medium">{q.name}</span>
                    <span className="text-muted-foreground"> · {q.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ---- FAQ ----------------------------------------------------------- */}
      <Section id="faq" spacing="none" className="scroll-mt-16 border-t border-foreground/10 pt-24 lg:pt-32 pb-16 lg:pb-20">
        <Container>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 lg:gap-16">
            <div className="lg:sticky lg:top-24 self-start">
              <Eyebrow className="mb-6">Questions</Eyebrow>
              <SectionTitle className="mb-6">Asked before most builds.</SectionTitle>
              <p className="text-muted-foreground leading-relaxed">
                Not here? The costed plan answers the rest, for your app.
              </p>
              <div className="mt-8 rounded-xl border border-foreground/10 p-5 flex gap-3">
                <ShieldCheck aria-hidden className="w-5 h-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your idea stays yours. We can sign an NDA before you share the details, and you hear from us within 24 hours.
                </p>
              </div>
            </div>
            <div className="divide-y divide-foreground/10 border-y border-foreground/10">
              {/* One shared name makes the list exclusive: opening one closes the rest. */}
              {faqs.map((faq, i) => (
                <details key={faq.question} name="service-faq" open={i === 0} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown aria-hidden className="w-5 h-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 pr-10 text-muted-foreground leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Related services ---------------------------------------------- */}
      {related.length > 0 && (
        <Section spacing="none" className="border-t border-foreground/10 py-12 lg:py-14">
          <Container>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-5">Related services</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="group flex items-center justify-between gap-4 rounded-xl border border-foreground/10 px-5 py-4 transition-colors hover:border-primary/40">
                    <span className="text-sm font-medium">{r.name}</span>
                    <ArrowRight aria-hidden className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaSection />
    </main>
  );
}

/** FAQPage and Service structured data for the page. */
export function appServiceSchema(service: AppService, url: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.metaDescription,
      url,
      provider: { "@type": "Organization", name: "Appkodes" },
      serviceType: service.name,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];
}
