import type { LucideIcon } from "lucide-react";

/**
 * Shared shapes for everything under content/.
 *
 * Content lives here rather than inside components so copy can be edited,
 * translated or sourced from a CMS without touching JSX. Each section imports
 * only the slice it renders.
 */

export type NavLink = {
  name: string;
  href: string;
};

export type Feature = {
  number: string;
  title: string;
  description: string;
  /** Key of the illustration rendered alongside the copy. */
  visual: string;
};

export type Step = {
  number: string;
  title: string;
  description: string;
  /** Snippet rendered in the step's terminal panel. */
  code: string;
};

export type Plan = {
  name: string;
  description: string;
  /** null renders as "Custom" — the enterprise tier has no list price. */
  price: { monthly: number | null; annual: number | null };
  features: string[];
  cta: string;
  popular: boolean;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
};

export type Integration = {
  name: string;
  category: string;
};

export type Location = {
  city: string;
  region: string;
  latency: string;
};

export type SecurityFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Metric = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export type CodeExample = {
  label: string;
  code: string;
};

export type DeveloperFeature = {
  title: string;
  description: string;
};

export type SocialLink = {
  name: string;
  href: string;
};
