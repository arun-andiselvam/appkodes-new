---
name: Kinetic Modular
colors:
  surface: '#faf9ff'
  surface-dim: '#ccdaff'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#051a3e'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3054'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#914d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe8a00'
  on-secondary-container: '#613100'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77e'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#faf9ff'
  on-background: '#051a3e'
  surface-variant: '#d8e2ff'
  surface-alt: '#F4F5F7'
  border-subtle: '#DFE1E6'
  success-green: '#36B37E'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is centered on the concept of "Instant Entrepreneurship"—the idea that technology should be a ready-to-use catalyst rather than a barrier. The brand personality is efficient, empowering, and architecturally sound. It targets visionaries who need high-speed execution without sacrificing professional sophistication.

The visual style is **Minimalist and Tech-Forward**, leaning into a "Modular Grid" aesthetic. It utilizes generous whitespace to signify clarity of thought, sharp execution, and a systematic approach to building businesses. The interface should feel like a high-end precision tool: intentional, responsive, and stripped of any decorative excess that doesn't serve a functional purpose.

## Colors

The palette is anchored by **Trustworthy Blue (#0052CC)**, used for primary actions and structural branding to evoke stability and corporate readiness. **Innovative Orange (#FF8B00)** serves as a high-energy kinetic accent, reserved for secondary actions, "New" indicators, and moments of conversion that signify entrepreneurial "spark."

The neutral scale uses a deep navy-tinted charcoal (#091E42) for text to maintain a softer, more sophisticated contrast than pure black. Backgrounds should primarily be clean white, with light grey (#F4F5F7) used to define modular zones and containers.

## Typography

This design system employs a dual-font strategy to balance character with utility. **Montserrat** is used for headings to provide a geometric, confident, and modern architectural feel. Its wider tracking and bold weights emphasize the "Entrepreneurship" aspect of the brand.

**Inter** is used for all body copy and interface labels. Chosen for its exceptional legibility and neutral, "system-app" feel, it ensures that complex data and modular settings remain readable at any scale. Headlines should use tighter letter spacing as they grow in size to maintain a "locked-in" visual density.

## Layout & Spacing

The layout philosophy follows a **Rigid Fluid Grid**. Elements are placed on an 8px base unit system to ensure mathematical harmony and a "snapped-to-grid" modular appearance. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1280px.
- **Tablet:** 8-column grid with 20px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Spacing should favor "grouping by proximity" to reinforce the modularity concept. Use larger gaps (64px+) between distinct sections and smaller, tighter gaps (8px-16px) between elements within a single module or card.

## Elevation & Depth

To maintain a minimalist and sophisticated tech aesthetic, this design system avoids heavy shadows. Depth is conveyed through **Tonal Layering and Low-Contrast Outlines**.

- **Level 0 (Base):** White (#FFFFFF) or light grey (#F4F5F7).
- **Level 1 (Cards/Modules):** White surface with a 1px solid border (#DFE1E6). No shadow.
- **Level 2 (Hover/Active):** Primary color 1px border or a very subtle, high-diffusion "ambient" shadow (0px 4px 20px rgba(9, 30, 66, 0.08)).
- **Level 3 (Modals/Popovers):** Standard 1px border with a medium-diffusion shadow to separate the element from the backdrop.

Use semi-transparent overlays (Backdrop-blur 8px) for modals to maintain the "Tech-forward" feel of connectivity and transparency.

## Shapes

The shape language is **Soft (0.25rem/4px)**. This specific radius provides a "professional-industrial" feel—it is not as aggressive as sharp corners, yet it avoids the casual, consumer-focused look of fully rounded "pill" shapes. 

This geometric precision reinforces the "modular" concept, where components look like they can be perfectly stacked and assembled. Larger components like cards use `rounded-lg` (8px) for a slightly softer container feel, while buttons and inputs strictly follow the 4px standard.

## Components

### Buttons
Primary buttons use a solid Blue (#0052CC) fill with white text. Secondary buttons use an Orange (#FF8B00) outline with orange text to represent "Innovation" without overpowering the hierarchy. All buttons have a 4px corner radius and use `label-md` typography.

### Input Fields
Inputs are defined by a 1px border (#DFE1E6). On focus, the border transitions to Primary Blue with a 2px "inner glow" of light blue. Labels are always positioned above the field using `label-sm`.

### Modular Cards
Cards are the core of the system. They feature a white background and a subtle grey border. Header sections within cards should be separated by a 1px horizontal rule to emphasize the "built from parts" aesthetic.

### Progress & Speed Indicators
Use the Innovative Orange for progress bars and "Speed" metrics. These should be sleek, 4px tall lines with no rounded caps, reinforcing the geometric and technical nature of the platform.

### Chips & Tags
Used for modular categorization. Chips use a light-tinted background of the Primary Blue (8% opacity) with dark blue text, keeping the interface clean while allowing for easy information scanning.