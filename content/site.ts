import type { NavLink } from "./types";

/** Brand-level facts referenced across the whole site. */
export const site = {
  name: "Appkodes",
  logo: {
    src: "/appkodes-logo.webp",
    width: 256,
    height: 40,
    alt: "Appkodes",
  },
  eyebrow: "The platform for modern teams",
  description:
    "The creative platform for teams who ship. Build, deploy, and scale with unprecedented velocity.",
} as const;

export const navLinks: NavLink[] = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Developers", href: "#developers" },
  { name: "Pricing", href: "#pricing" },
];

/** Words cycled by the hero headline. */
export const heroWords: string[] = ["create", "build", "scale", "ship"];

export const heroCopy = {
  headline: "The platform",
  headlinePrefix: "to",
  description:
    "Your toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best experiences.",
  primaryCta: "Start free trial",
  secondaryCta: "Watch demo",
} as const;

/** Stats ticker under the hero. */
export const heroStats = [
  { value: "20 days", label: "saved on builds", company: "NETFLIX" },
  { value: "98%", label: "faster deployment", company: "STRIPE" },
  { value: "300%", label: "throughput increase", company: "LINEAR" },
  { value: "6x", label: "faster to ship", company: "NOTION" },
] as const;
