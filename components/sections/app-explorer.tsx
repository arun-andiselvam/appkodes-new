"use client";

import { useState } from "react";
import {
  Smartphone, ChefHat, Bike, LayoutDashboard, Layers, Check, MapPin, Star, Monitor, Truck, Plus,
  type LucideIcon,
} from "lucide-react";
import type { AppServiceApp } from "@/content/app-services";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone, chefHat: ChefHat, bike: Bike, dashboard: LayoutDashboard,
  monitor: Monitor, fleet: Truck, plus: Plus,
};

/**
 * The "what you get" explorer on a service page: one tab per app, each with
 * its description, its features and a drawn mock-up of the app. The mock-ups
 * are plain divs in the brand tokens, not screenshots, so they suit every
 * client and both themes; they show the shape of each app, not a product.
 */
export function AppExplorer({ apps }: { apps: AppServiceApp[] }) {
  const [active, setActive] = useState(0);
  const app = apps[active];

  return (
    <div className="grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-6 lg:gap-10">
      <div role="tablist" aria-label="The apps" className="flex lg:flex-col gap-2 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-1 lg:self-center">
        {apps.map((a, i) => {
          const Icon = ICONS[a.icon] ?? Layers;
          const selected = i === active;
          return (
            <button
              key={a.name}
              type="button"
              role="tab"
              id={`app-tab-${i}`}
              aria-selected={selected}
              aria-controls={`app-panel-${i}`}
              onClick={() => setActive(i)}
              className={`group shrink-0 text-left flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${a.device === "custom" ? "border-dashed" : ""} ${
                selected
                  ? "border-primary/50 bg-primary/[0.07]"
                  : "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.03]"
              }`}
            >
              <span className={`grid place-items-center shrink-0 w-9 h-9 rounded-lg transition-colors ${selected ? "bg-primary text-primary-foreground" : "bg-foreground/[0.06] text-muted-foreground group-hover:text-foreground"}`}>
                <Icon aria-hidden strokeWidth={1.5} className="w-[18px] h-[18px]" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium whitespace-nowrap">{a.name}</span>
                <span className="block text-xs text-muted-foreground whitespace-nowrap">{a.tagline}</span>
              </span>
              <span aria-hidden className="shrink-0 w-5 text-right hidden lg:block font-mono text-[11px] text-muted-foreground/60">
                {a.device === "custom" ? "+" : String(i + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`app-panel-${active}`}
        aria-labelledby={`app-tab-${active}`}
        className="rounded-2xl border border-foreground/10 bg-card overflow-hidden grid xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
      >
        <div key={app.name} className="p-7 lg:p-10 animate-in fade-in duration-300">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            {app.device === "custom"
              ? "Open slot · built to order"
              : `App ${String(active + 1).padStart(2, "0")} of ${String(apps.filter((a) => a.device !== "custom").length).padStart(2, "0")}`}
          </p>
          <h3 className="mt-4 text-3xl lg:text-4xl font-display tracking-tight">{app.name}</h3>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">{app.description}</p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {app.features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="grid place-items-center w-5 h-5 mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary">
                  <Check aria-hidden className="w-3 h-3" strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block font-medium">{f.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="relative hidden md:grid place-items-center border-t xl:border-t-0 xl:border-l border-foreground/10 bg-muted/60 p-8 min-h-[30rem] overflow-hidden">
          <div className="absolute inset-0 signal-traces-grid opacity-60" />
          <div key={app.name} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            {app.device === "custom" ? <CustomMock /> : app.device === "desktop" ? <DesktopMock kind={app.icon} /> : <PhoneMock kind={app.icon} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Mock-ups ----------------------------------------------------------- */

const bar = "rounded-full bg-foreground/10";

function PhoneMock({ kind }: { kind: string }) {
  return (
    <div className="w-[15rem] rounded-[2.2rem] border-[6px] border-foreground/85 bg-background shadow-2xl overflow-hidden">
      <div className="flex justify-center pt-2 pb-1"><span className="w-16 h-4 rounded-full bg-foreground/85" /></div>
      <div className="px-4 pb-5 pt-2 h-[26rem] flex flex-col gap-3 text-[10px]">
        {kind === "chefHat" ? <RestaurantScreen /> : kind === "bike" ? <RiderScreen /> : <CustomerScreen />}
      </div>
    </div>
  );
}

function CustomerScreen() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-primary" /> Deliver to Home</span>
        <span className="w-6 h-6 rounded-full bg-foreground/10" />
      </div>
      <div className="h-8 rounded-lg bg-foreground/[0.06] flex items-center px-3"><span className={`${bar} h-1.5 w-24`} /></div>
      <div className="rounded-xl p-3 text-white" style={{ background: "var(--feature-card)" }}>
        <span className="block font-medium">20% off your first order</span>
        <span className="block mt-1 h-1.5 w-20 rounded-full bg-white/40" />
      </div>
      <div className="flex gap-1.5">
        {["Pizza", "Sushi", "Burgers", "Salads"].map((c) => (
          <span key={c} className="rounded-full border border-foreground/10 px-2 py-1">{c}</span>
        ))}
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-foreground/10 overflow-hidden">
          <div className="h-12 bg-primary/10" />
          <div className="p-2.5 flex items-center justify-between">
            <span className={`${bar} h-1.5 w-20`} />
            <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current text-primary" /> 4.{8 - i}</span>
          </div>
        </div>
      ))}
      <div className="mt-auto rounded-xl bg-primary text-primary-foreground px-3 py-2.5 flex justify-between font-medium">
        <span>View cart · 3 items</span><span>$24.50</span>
      </div>
    </>
  );
}

function RestaurantScreen() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-medium">Orders</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">● Open</span>
      </div>
      <div className="rounded-xl border-2 border-primary p-3 space-y-2">
        <div className="flex justify-between font-medium"><span>New order #2041</span><span className="text-primary">0:42</span></div>
        {["2 × Margherita", "1 × Garlic bread", "1 × Lemonade"].map((l) => <p key={l} className="text-muted-foreground">{l}</p>)}
        <div className="flex gap-1.5 pt-1">
          {["15", "20", "30"].map((m, i) => (
            <span key={m} className={`flex-1 text-center rounded-md py-1 ${i === 1 ? "bg-primary text-primary-foreground" : "bg-foreground/[0.06]"}`}>{m} min</span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <span className="flex-1 text-center rounded-md border border-foreground/15 py-1.5">Decline</span>
          <span className="flex-[2] text-center rounded-md bg-primary text-primary-foreground py-1.5 font-medium">Accept</span>
        </div>
      </div>
      <p className="font-mono uppercase tracking-wider text-muted-foreground">Preparing</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-foreground/10 p-2.5 flex items-center justify-between">
          <span className={`${bar} h-1.5 w-24`} />
          <span className="text-muted-foreground">{8 + i * 5} min</span>
        </div>
      ))}
      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-foreground/[0.05] p-2"><span className="block text-muted-foreground">Today</span><span className="font-medium">34 orders</span></div>
        <div className="rounded-lg bg-foreground/[0.05] p-2"><span className="block text-muted-foreground">Sales</span><span className="font-medium">$812</span></div>
      </div>
    </>
  );
}

function RiderScreen() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-medium">You are online</span>
        <span className="w-8 h-4 rounded-full bg-primary relative"><span className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-primary-foreground" /></span>
      </div>
      <div className="relative h-40 rounded-xl bg-foreground/[0.05] overflow-hidden">
        <svg viewBox="0 0 200 160" className="absolute inset-0 w-full h-full">
          <path d="M0 40h200M0 110h200M60 0v160M140 0v160" stroke="currentColor" strokeOpacity=".08" strokeWidth="10" />
          <path d="M30 130 L60 110 L60 40 L140 40 L170 20" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" />
          <circle cx="30" cy="130" r="6" fill="var(--primary)" />
          <circle cx="170" cy="20" r="6" fill="none" stroke="var(--primary)" strokeWidth="3" />
        </svg>
      </div>
      <div className="rounded-xl border border-foreground/10 p-3 space-y-2">
        <div className="flex justify-between font-medium"><span>New job · 2.4 km</span><span className="text-primary">$6.80</span></div>
        <p className="text-muted-foreground">Pickup: Luigi&apos;s Kitchen</p>
        <p className="text-muted-foreground">Drop: 14 Harbour Road</p>
        <span className="block text-center rounded-md bg-primary text-primary-foreground py-1.5 font-medium">Accept job</span>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 text-center">
        {[["Jobs", "11"], ["Hours", "5.2"], ["Earned", "$74"]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-foreground/[0.05] py-2"><span className="block text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
        ))}
      </div>
    </>
  );
}

const DESKTOP_NAV: Record<string, string[]> = {
  monitor: ["Menu", "Branches", "Sales", "Payouts", "Offers", "Staff"],
  fleet: ["Live map", "Dispatch", "Riders", "Shifts", "Zones", "Pay"],
  dashboard: ["Orders", "Restaurants", "Riders", "Zones", "Payouts", "Reports"],
};

function DesktopMock({ kind }: { kind: string }) {
  const nav = DESKTOP_NAV[kind] ?? DESKTOP_NAV.dashboard;
  return (
    <div className="w-[21rem] rounded-xl border border-foreground/15 bg-background shadow-2xl overflow-hidden text-[9px]">
      <div className="flex gap-1.5 px-3 py-2 border-b border-foreground/10">
        {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-foreground/15" />)}
      </div>
      <div className="grid grid-cols-[4.5rem_1fr]">
        <div className="border-r border-foreground/10 p-2 space-y-1.5">
          {nav.map((l, i) => (
            <span key={l} className={`block rounded px-1.5 py-1 ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>{l}</span>
          ))}
        </div>
        <div className="p-3 space-y-3">
          {kind === "monitor" ? <PortalScreen /> : kind === "fleet" ? <FleetScreen /> : <AdminScreen />}
        </div>
      </div>
    </div>
  );
}

function Tiles({ tiles }: { tiles: [string, string][] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map(([k, v]) => (
        <div key={k} className="rounded-md border border-foreground/10 p-2">
          <span className="block text-muted-foreground">{k}</span>
          <span className="block mt-0.5 text-[11px] font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

function AdminScreen() {
  const heights = [40, 55, 48, 70, 62, 85, 78];
  return (
    <>
      <Tiles tiles={[["Orders", "1,284"], ["Revenue", "$18.2k"], ["Riders live", "46"]]} />
      <div className="rounded-md border border-foreground/10 p-2 h-24 flex items-end gap-1.5">
        {heights.map((h, i) => (
          <span key={i} className={`flex-1 rounded-sm ${i === heights.length - 2 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="rounded-md border border-foreground/10 divide-y divide-foreground/10">
        {["Delivered", "On the way", "Preparing"].map((s, i) => (
          <div key={s} className="flex items-center justify-between px-2 py-1.5">
            <span className="text-muted-foreground">#20{41 - i}</span>
            <span className={`${bar} h-1 w-14`} />
            <span className="text-primary">{s}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function PortalScreen() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium">Menu · Pizzas</span>
        <span className="rounded bg-primary text-primary-foreground px-2 py-1">+ Add dish</span>
      </div>
      <div className="rounded-md border border-foreground/10 divide-y divide-foreground/10">
        {[["Margherita", "$11.00", true], ["Pepperoni", "$13.50", true], ["Truffle", "$16.00", false], ["Veggie", "$12.00", true]].map(([n, p, on]) => (
          <div key={n as string} className="flex items-center gap-2 px-2 py-1.5">
            <span className="w-5 h-5 rounded bg-primary/15" />
            <span className="flex-1">{n}</span>
            <span className="text-muted-foreground">{p}</span>
            <span className={`w-5 h-2.5 rounded-full relative ${on ? "bg-primary" : "bg-foreground/15"}`}>
              <span className={`absolute top-0.5 w-1.5 h-1.5 rounded-full bg-background ${on ? "right-0.5" : "left-0.5"}`} />
            </span>
          </div>
        ))}
      </div>
      <Tiles tiles={[["Today", "$812"], ["Orders", "34"], ["Payout", "Fri"]]} />
    </>
  );
}

function FleetScreen() {
  const riders: [number, number, boolean][] = [[30, 40, true], [80, 25, false], [120, 70, true], [160, 45, false], [60, 95, true], [175, 100, true]];
  return (
    <>
      <Tiles tiles={[["Online", "46"], ["On a job", "31"], ["Avg. time", "24m"]]} />
      <div className="relative h-28 rounded-md border border-foreground/10 bg-foreground/[0.04] overflow-hidden">
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full">
          <path d="M0 35h200M0 85h200M50 0v120M110 0v120M165 0v120" stroke="currentColor" strokeOpacity=".08" strokeWidth="7" />
          {riders.map(([x, y, busy], i) => (
            <circle key={i} cx={x} cy={y} r="4.5" fill={busy ? "var(--primary)" : "none"} stroke="var(--primary)" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="rounded-md border border-foreground/10 divide-y divide-foreground/10">
        {[["Rider 12", "Delivering"], ["Rider 07", "Picking up"], ["Rider 21", "Free"]].map(([r, st]) => (
          <div key={r} className="flex items-center justify-between px-2 py-1.5">
            <span>{r}</span>
            <span className={`${bar} h-1 w-12`} />
            <span className="text-primary">{st}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/** The open slot: a blank portal waiting for the client's idea. */
function CustomMock() {
  return (
    <div className="w-[21rem] rounded-xl border-2 border-dashed border-primary/40 bg-background/70 shadow-2xl overflow-hidden text-[9px]">
      <div className="flex gap-1.5 px-3 py-2 border-b border-dashed border-primary/30">
        {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-foreground/15" />)}
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-md border border-dashed border-foreground/20" />)}
        </div>
        <div className="h-24 rounded-md border border-dashed border-foreground/20 grid place-items-center text-center">
          <span className="flex flex-col items-center gap-1.5 text-primary">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-medium">Your idea here</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Corporate orders", "Franchise", "Kitchen screen", "Support desk"].map((l) => (
            <span key={l} className="rounded-full border border-dashed border-foreground/20 px-2 py-1 text-center text-muted-foreground">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
