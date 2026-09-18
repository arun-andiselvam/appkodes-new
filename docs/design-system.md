---
name: Electric Precision
colors:
  mark-blue: '#0065FF'
  mark-navy: '#001923'
  primary: '#0052FF'
  primary-hover: '#0040CC'
  on-primary: '#FFFFFF'
  primary-dark-mode: '#7AA3FF'
  primary-hover-dark-mode: '#94B5FF'
  on-primary-dark-mode: '#0B0F17'
  cyan-accent: '#38BDF8'
  obsidian: '#0B0F17'
  error: '#BA1A1A'
  error-dark-mode: '#F87171'
  success: '#36B37E'
  light-canvas: '#FFFFFF'
  light-surface-1: '#F8FAFC'
  light-surface-2: '#F1F5F9'
  light-border-subtle: '#E2E8F0'
  light-border-strong: '#CBD5E1'
  light-text-primary: '#0B0F17'
  light-text-secondary: '#475569'
  light-text-muted: '#94A3B8'
  dark-canvas: '#0B0F17'
  dark-surface-1: '#111827'
  dark-surface-2: '#1E293B'
  dark-border-subtle: '#1E293B'
  dark-border-strong: '#334155'
  dark-text-primary: '#F8FAFC'
  dark-text-secondary: '#94A3B8'
  dark-text-muted: '#64748B'
typography:
  sans: Instrument Sans
  display: Instrument Serif
  mono: JetBrains Mono
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  container-max: 1440px
---

> Source of truth for colour is app/brand.css; this document describes it. Adopted 18 September 2026 from the "Electric Precision" guideline. Where the original guideline's figures disagreed with measurement, the measured figure is used here, and deviations are listed at the end.

## Brand & Style

### Brand Personality & Philosophy
This design system embodies high-velocity software engineering, digital craftsmanship, and technological authority. It is sharp, confident, and unapologetically engineered for enterprise scalability and high-performance product suites. The emotional response is immediate clarity, modern capability, and effortless momentum.

### Aesthetic Style
The visual language merges **Modern Technical Brutalism** with **Refined Corporate Minimalism**. It uses crisp micro-borders, deep obsidian dark surfaces paired with pure white light surfaces, high-contrast typography, and an unmistakable energetic electric blue accent. Visual clutter is stripped away in favor of strict grid alignments, intentional typographic weight shifts, and laser-precise spatial hierarchy.

### Logo Construction & Brandmark Geometry
- **Monogram Anatomy:** The mark couples a geometric lowercase 'a' in vivid electric blue with an interlocking abstract 'k' stem in obsidian charcoal. The relationship between the two glyphs relies on precise optical radii matching the letterforms.
- **Clearspace:** A minimum clearspace equal to 50% of the mark's height ($0.5H$) must surround the logo on all four sides. No typography, secondary iconography, or layout borders may infringe upon this clearance buffer.
- **Minimum Scale:** Digital display requires a minimum width of 120px for the full lockup and 24px for the standalone monogram. Print minimum is 28mm lockup width.
- **Background Adaptations:** On light backgrounds use public/appkodes-logo.webp: the "a"/"app" in #0065FF and the "k"/"kodes" in the artwork's navy #001923. On dark backgrounds use public/appkodes-logo-on-dark.webp, where the blue stays and the navy becomes white #FFFFFF.

## Colors

### Primary Palette & Roles
- **Electric Blue (`#0052FF`; the logo artwork is `#0065FF`):** The catalytic brand engine. Used strictly for critical interactive states, primary action anchors, active indicators, and high-priority brand moments. Never diluted for large non-interactive surface fills.
- **Deep Obsidian (`#0B0F17`):** Grounding neutral providing weight, contrast, and structure. In light mode, it anchors headers and high-contrast text. In dark mode, it constitutes the foundational canvas surface.
- **Cyan Accent (`#38BDF8`):** Serves as an auxiliary highlight token for data visualization, technical telemetry, and code syntactical highlights. It is 2.14:1 on white, so it is never text in light mode.
- **Error Red (`#BA1A1A` light / `#F87171` dark):** Errors, flagged records and the human step in a flow.

### Dual-Mode Architecture & Semantics

#### Light Mode Surfaces & Text
- **Canvas Base:** `#FFFFFF`
- **Surface Layer 1 (Cards, panels):** `#F8FAFC`
- **Surface Layer 2 (Inputs, active overlays):** `#F1F5F9`
- **Border Subtle:** `#E2E8F0`
- **Border Strong:** `#CBD5E1`
- **Text Primary:** `#0B0F17` (Contrast 19.18:1 against Canvas)
- **Text Secondary:** `#475569` (Contrast 7.58:1 against Canvas)
- **Text Muted:** `#94A3B8` (Contrast 2.56:1: decorative only, never text)

#### Dark Mode Surfaces & Text
- **Canvas Base:** `#0B0F17`
- **Surface Layer 1 (Cards, panels):** `#111827`
- **Surface Layer 2 (Elevated hover, modal popovers):** `#1E293B`
- **Border Subtle:** `#1E293B`
- **Border Strong:** `#334155`
- **Text Primary:** `#F8FAFC` (Contrast 18.33:1 against Base)
- **Text Secondary:** `#94A3B8` (Contrast 7.48:1 against Base)
- **Text Muted:** `#64748B` (4.03:1: large text and decoration only)
- **Electric blue in dark mode:** `#7AA3FF` (7.77:1), with obsidian text on blue fills. `#0052FF` is 3.33:1 on obsidian and fails as text.

### Accessibility & Contrast Standards
Primary and secondary text pairs meet WCAG AAA (7:1) in both modes. Primary buttons and blue text meet AA (4.5:1): `#0052FF` on white is 5.75:1, white on `#0052FF` is 5.75:1.

## Typography

Unchanged from the existing site by client decision (18 September 2026): **Instrument Sans** for body and interface, **Instrument Serif** for display headlines (`font-display`), **JetBrains Mono** for technical badges, metrics and code labels. The guideline's type scale and tracking rules still apply: tighten large headlines to `-0.02em`, neutral tracking for body, `+0.06em` on all-caps micro-labels.

## Layout & Spacing

### Layout Model
This design system operates on an uncompromising 8-point spatial matrix with an integrated 4-point micro-step for tight internal component padding. Layouts are architected around a 12-column fluid grid system on desktop, collapsing to 8 columns on tablet and 4 columns on mobile.

### Breakpoint Scaling
- **Desktop (1200px+):** 12-column grid, 24px (`1.5rem`) gutters, maximum layout width of 1440px (components/primitives/container.tsx).
- **Tablet (768px – 1199px):** 8-column grid, 16px (`1rem`) gutters, 32px (`2rem`) outer margin. Side-by-side data cards wrap to two-column arrangements.
- **Mobile (< 767px):** 4-column grid, 12px (`0.75rem`) gutters, 16px (`1rem`) outer margin. Grids collapse to single-column flows; sub-nav bars morph into horizontal scroll containers.

## Elevation & Depth

### Tonal Stratification & Razor Borders
This design system rejects heavy, muddy, diffuse drop shadows in favor of precise structural boundaries. Hierarchy is conveyed via sharp surface tiering accompanied by ultra-fine hairline outlines.

- **Level 0 (Flat Canvas):** `#FFFFFF` (Light) / `#0B0F17` (Dark).
- **Level 1 (Card Surfaces):** 1px solid border (`#E2E8F0` / `#1E293B`) overlaying Surface 1. No shadow.
- **Level 2 (Hover States & Dropdowns):** Ambient shadow tinted with the primary hue: `0 8px 24px -4px rgba(11, 15, 23, 0.08)` in light mode, and `0 8px 24px -4px rgba(0, 82, 255, 0.12)` in dark mode with a 1px border (`#CBD5E1` / `#334155`).
- **Level 3 (Modals & Command Palettes):** Elevated floating backdrop blur (`backdrop-filter: blur(12px)`) with crisp `0 20px 48px -12px rgba(11, 15, 23, 0.24)` deep obsidian occlusion.

## Shapes

### Corner Curvature Logic
The roundedness scale (`level 2`) utilizes exact `0.5rem` (8px) radii for baseline interface components, reflecting the balanced geometry of the monogram while avoiding childish or overly bulbous profiles.

- **Micro Components (Badges, Checkboxes, Tooltips):** 4px (`0.25rem`) corner radius.
- **Standard Controls (Buttons, Inputs, Selectors):** 8px (`0.5rem`) corner radius.
- **Card Containers & Modules:** 12px (`0.75rem`) to 16px (`1rem`) corner radius (`rounded-lg`).
- **Pill Tags & Status Indicators:** Strict full-radius (`9999px`) roundedness to distinctly identify status pills and filter chips against rectangular inputs.

## Components

### Buttons
- **Primary Button:** Solid electric blue background (`#0052FF`), crisp optical white text, 8px corner radius, bold weight. Hover state initiates `#0040CC` background with an electric blue micro-glow (`0 0 12px rgba(0, 82, 255, 0.35)`).
- **Secondary Button:** Surface-matched fill with 1px border (`#E2E8F0` in light mode; `#1E293B` in dark mode). Text is obsidian primary in light mode, optical white in dark mode. Hover introduces `#F1F5F9` / `#1E293B` fills.
- **Ghost / Tertiary:** Borderless, zero fill. Electric blue text with an underlined interaction on hover.

### Inputs & Text Fields
- Height of 42px on desktop with 12px horizontal padding.
- Border is 1px solid (`#E2E8F0` / `#1E293B`).
- Active/Focused state triggers a crisp 1.5px border colored in `#0052FF`, complemented by an offset focus ring (`box-shadow: 0 0 0 3px rgba(0, 82, 255, 0.15)`). No layout shift occurs on focus.

### Cards & Data Panels
- Surface-backed with 16px internal padding. Hairline 1px border around the entire container perimeter.
- Header bars within cards are separated by a clean 1px horizontal rule, maintaining geometric compartmentalization.
- Hoverable cards exhibit a smooth 2px vertical translation (`transform: translateY(-2px)`) coupled with border illumination from subtle slate to primary electric blue.

### Chips, Tags & Status Pills
- Compact padding of 4px vertical by 10px horizontal.
- Integrated status dot (6px circle) preceding the text.
- Standard metadata tags utilize subtle neutral fills (`#F1F5F9` light, `#1E293B` dark) with `label-caps` or `label-code` typography.

### Checkboxes & Radio Controls
- Checkboxes feature a 4px corner radius; radio controls are true circular discs.
- Unchecked: 1.5px outline with transparent fill.
- Checked: Solid `#0052FF` fill housing an optical white geometric checkmark or inner core pip. Focus states exhibit the standard blue glow ring.

### Code & Telemetry Blocks
- Custom components optimized for technical suites: Dark obsidian slate background (`#070A0E`) regardless of global theme mode, 1px perimeter border (`#1E293B`), monospace typography via `label-code`, and syntax-highlighted accents utilizing vivid electric blue, cyan, and amber.
## Deviations from the original guideline

- **Fonts** stay Instrument Sans / Instrument Serif instead of Hanken Grotesk, by client decision.
- **Dark mode blue** is `#7AA3FF` with obsidian text on fills, because `#0052FF` fails as text on obsidian.
- **Muted text role:** the site's `muted-foreground` is used for body copy, so it maps to Text Secondary (`#475569` / `#94A3B8`), not Text Muted.
- **Logo navy:** the artwork keeps its own `#001923`; UI text uses obsidian `#0B0F17`.
- **Card corners:** buttons and inputs use the 8px radius. Cards are still square, pending a decision (the client asked for square cards on 26 August 2026).
