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
  /** When this happens, shown in the panel footer. */
  duration: string;
  /** Label in the panel header, where a filename used to sit. */
  panelLabel: string;
  /** Plain lines listing what happens or what the client receives. */
  output: string;
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
  /**
   * simple-icons export name, e.g. "siClaude".
   *
   * Optional on purpose. Some entries are capabilities rather than companies,
   * and a few brands have had their marks pulled from the icon set. Anything
   * without one falls back to a monogram, never to another brand's logo.
   */
  icon?: string;
};

export type DeliveryHub = {
  /** Region clients sit in. */
  region: string;
  /** Markets inside that region we have delivered into. */
  markets: string;
  /** Projects delivered into that region. */
  projects: number;
};

export type SecurityFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Metric = {
  value: number;
  /** Unit shown after the numeral, at a smaller size so the figure leads. */
  suffix?: string;
  prefix?: string;
  label: string;
  /** Optional qualifier under the label, for how the figure is counted. */
  detail?: string;
};

/**
 * One audience the site speaks to, shown as a tab.
 *
 * docs/positioning.md names a single buyer at "roughly 10 to 500 people", but
 * every concrete detail under it describes a 20 to 100 person company. A two
 * person startup has no manual process to automate and no board to convince,
 * and a three hundred person company has both. Splitting them is what this
 * type exists for.
 */
export type AudienceSegment = {
  id: string;
  /** Tab label. */
  label: string;
  /** Company size this segment covers, shown beside the tabs. */
  headcount: string;
  /** The situation, in the buyer's words rather than ours. */
  situation: string;
  /**
   * Worked specifics, rendered as a quote rather than a spec sheet.
   *
   * One row per segment should set `emphasis`. That value renders large in the
   * display face and becomes the card's focal point, so it belongs on the fact
   * that does the most selling.
   */
  rows: { label: string; value: string; emphasis?: boolean }[];
};

/** Something true for every segment, so it sits outside the tabs. */
export type Assurance = {
  title: string;
  description: string;
};

export type SocialLink = {
  name: string;
  href: string;
};
