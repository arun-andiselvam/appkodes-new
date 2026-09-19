import type { CSSProperties } from "react";
import {
  Smartphone, ChefHat, Bike, LayoutDashboard, Monitor, Truck, Layers, CreditCard, MapPin,
  Bell, MessageCircle, BarChart3, Tag, Star, Wallet, Utensils, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone, chefHat: ChefHat, bike: Bike, dashboard: LayoutDashboard,
  monitor: Monitor, fleet: Truck, card: CreditCard, mapPin: MapPin, bell: Bell,
  chat: MessageCircle, chart: BarChart3, tag: Tag, star: Star, wallet: Wallet,
};

type OrbitNode = { name: string; icon: string };

/**
 * The service page hero's radar, 19 September 2026: the system drawn as an
 * orbit. The hub is the client's own platform, the inner ring the apps and
 * portals, the outer ring what connects them. Inspired by ScrollX UI's
 * Radial Socials but written here in CSS alone (app/globals.css, "orbit"),
 * so it renders on the server, ships no script and carries no licence
 * question.
 *
 * Each chip sits on a zero-size positioner at the centre, rotated out to its
 * angle; the ring turns, and a counter-rotator keeps the chip upright. Radii
 * are in container units, so the whole figure scales with its column.
 */
export function ServiceOrbit({ hub, inner, outer }: { hub: string; inner: OrbitNode[]; outer: OrbitNode[] }) {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[34rem] [container-type:inline-size]">
      {/* Rings, glow and the radar sweep. */}
      <div className="absolute inset-[4%] rounded-full border border-dashed border-foreground/15" />
      <div className="absolute inset-[23%] rounded-full border border-foreground/10" />
      <div className="absolute inset-[38%] rounded-full border border-foreground/10" />
      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-blue-rgb)/0.10),transparent_60%)]" />
      <div className="absolute inset-[4%] rounded-full orbit-sweep" />

      <Ring nodes={outer} radius={46} duration={90} startDelay={900} variant="outer" />
      <Ring nodes={inner} radius={27} duration={60} startDelay={200} variant="inner" reverse />

      {/* The hub. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-[22%] aspect-square rounded-full bg-primary text-primary-foreground shadow-[0_0_60px_-10px_rgb(var(--brand-blue-rgb)/0.7)]">
        <span className="absolute -inset-[12%] rounded-full border border-primary/30 animate-ping [animation-duration:3s]" />
        <span className="flex flex-col items-center text-center px-2">
          <Utensils strokeWidth={1.5} className="w-6 h-6" />
          <span className="mt-1 text-[10px] lg:text-xs font-medium leading-tight">{hub}</span>
        </span>
      </div>
    </div>
  );
}

function Ring({
  nodes, radius, duration, startDelay, variant, reverse = false,
}: { nodes: OrbitNode[]; radius: number; duration: number; startDelay: number; variant: "inner" | "outer"; reverse?: boolean }) {
  const spin = (dir: "normal" | "reverse") =>
    ({ "--orbit-duration": `${duration}s`, animationDirection: dir }) as CSSProperties;

  return (
    <div className="absolute inset-0 orbit-ring" style={spin(reverse ? "reverse" : "normal")}>
      {nodes.map((node, i) => {
        const angle = (360 / nodes.length) * i - 90;
        const rad = (angle * Math.PI) / 180;
        // The fan-out starts back at the hub.
        const chip = {
          "--orbit-from-x": `${(-Math.cos(rad) * radius).toFixed(2)}cqw`,
          "--orbit-from-y": `${(-Math.sin(rad) * radius).toFixed(2)}cqw`,
          "--orbit-delay": `${startDelay + i * 110}ms`,
        } as CSSProperties;
        const Icon = ICONS[node.icon] ?? Layers;
        return (
          <div
            key={node.name}
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{ transform: `rotate(${angle}deg) translateX(${radius}cqw) rotate(${-angle}deg)` }}
          >
            <div className="orbit-counter absolute left-0 top-0 w-0 h-0" style={spin(reverse ? "normal" : "reverse")}>
              <div className="orbit-chip absolute left-0 top-0 w-0 h-0" style={chip}>
                {variant === "inner" ? (
                  <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[1.5rem] flex flex-col items-center gap-1.5">
                    <span className="grid place-items-center w-12 h-12 rounded-2xl border border-primary/30 bg-card text-primary shadow-lg">
                      <Icon strokeWidth={1.5} className="w-5 h-5" />
                    </span>
                    <span className="whitespace-nowrap rounded-full border border-foreground/10 bg-background/85 backdrop-blur px-2 py-0.5 text-[11px] font-medium">
                      {node.name}
                    </span>
                  </span>
                ) : (
                  <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-foreground/10 bg-background/90 backdrop-blur px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm">
                    <Icon strokeWidth={1.5} className="w-3.5 h-3.5 text-primary" />
                    {node.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
