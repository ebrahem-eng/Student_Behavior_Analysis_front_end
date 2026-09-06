---
name: Precision Intelligence (Refined)
colors:
  surface: '#f8f9ff'
  surface-dim: '#dad9e0'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f9'
  surface-container: '#e5eeff'
  surface-container-high: '#e9e7ee'
  surface-container-highest: '#e3e2e8'
  on-surface: '#0b1c30'
  on-surface-variant: '#444650'
  inverse-surface: '#2f3035'
  inverse-on-surface: '#f1f0f6'
  outline: '#757682'
  outline-variant: '#c5c6d2'
  surface-tint: '#445b9f'
  primary: '#001039'
  on-primary: '#ffffff'
  primary-container: '#003594'
  on-primary-container: '#87a4ff'
  inverse-primary: '#b4c5ff'
  secondary: '#5a5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dce0e4'
  on-secondary-container: '#5e6366'
  tertiary: '#0a1225'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f273b'
  on-tertiary-container: '#868ea6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#2a4386'
  secondary-fixed: '#dfe3e6'
  secondary-fixed-dim: '#c3c7ca'
  on-secondary-fixed: '#171c1f'
  on-secondary-fixed-variant: '#42474a'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2f'
  on-tertiary-fixed-variant: '#3e465c'
  background: '#faf8ff'
  on-background: '#1a1b20'
  surface-variant: '#e3e2e8'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system evolves from a purely technical aesthetic into a **Modern Tech / Professional** style. It balances authoritative precision with a soft, approachable veneer. By introducing extreme corner rounding while maintaining a high-contrast, structured color palette, the UI transitions from "industrial tool" to "sophisticated software."

The brand personality is high-performing, welcoming, and modern. It targets professional environments that value intelligence but desire a frictionless, friendly user experience. The emotional response is one of effortless capability—complex data presented through a gentle, human-centric lens. This is achieved by mixing the rigor of a technical grid with the organic fluidity of pill-shaped interactive elements.

## Colors

The palette utilizes a sophisticated range of cool-tinted neutrals to establish hierarchy and focus.

- **Primary Blue:** A deep, trustworthy navy used for core branding and high-importance actions.
- **Surface Tiers:** A logical progression of blue-grays is used to stack information. Lower tiers are brighter and more neutral, while container levels become increasingly saturated to define depth.
- **Semantic Logic:** Error states use a high-visibility red, while secondary and tertiary tones are reserved for utility actions and supporting UI elements.
- **Contrast:** The system prioritizes legibility, ensuring all text-on-background combinations meet high contrast standards for professional use cases.

## Typography

The system employs a dual-typeface strategy to distinguish between data and narrative.

- **Geist (Headlines & Labels):** Provides a mechanical, technical precision. It is used for headers, metrics, and short UI labels where a sense of modern engineering is required.
- **Inter (Body & Prose):** Used for all long-form text and secondary information. Its neutral character ensures high legibility across varied screen densities.
- **Technical Scale:** Smaller labels and code blocks maintain a monospace-adjacent feel to support data-heavy workflows without sacrificing the system's modern aesthetic.

## Layout & Spacing

The layout is built on a **12-column fluid grid** designed to accommodate complex data visualization and dashboard layouts.

- **Grid Strategy:** Use a 1280px max-width container for desktop. On mobile, the system collapses to a 4-column grid with 16px margins.
- **Rhythm:** A 4px base unit governs all spatial relationships. Use "Compact" (8px) gaps for related inputs and "Default" (24px) for page-level padding.
- **Reflow:** For high-density components, use a fluid-width approach that allows containers to stretch, while maintaining fixed internal paddings to preserve the integrity of the rounded shape language.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Shadows** to complement the curved shape language.

- **Surface Tiers:** Depth is primarily communicated by shifting background colors. Higher-elevation items (like modals) use lighter, more "luminous" surfaces.
- **Ambient Shadows:** Unlike the previous iteration, this design uses very soft, low-opacity shadows (e.g., 8% opacity, 12px blur) for floating elements like dropdowns and cards to enhance the "friendly" aesthetic.
- **Interaction Depth:** Hover states on interactive elements should involve a subtle lift (increased shadow) rather than just a color shift, emphasizing the tactile nature of the rounded components.

## Shapes

The design system utilizes a **Pill-shaped** (Full Rounding) language. This is a significant departure from previous strictness, intended to create a soft and friendly aesthetic.

- **Full Curve:** All buttons, chips, and small tags must use the `ROUND_FULL` (pill) style. 
- **Large Radius:** Cards and large containers utilize a high pixel radius (at least 24px-32px) to maintain a consistent "squishy" and modern feel across different scales.
- **Nested Rounding:** When nesting elements (e.g., a button inside a card), ensure the inner radius is smaller than the outer radius to maintain visual harmony.

## Components

Components are styled to be highly tactile and visually approachable through extreme rounding.

- **Buttons:** Fully pill-shaped. Primary buttons use a solid `primary` fill with white text. Secondary buttons use a thick 2px `outline` with matching text.
- **Input Fields:** Large 32px or 48px corner radius for a "stadium" shape. Padding should be increased on the horizontal axis to accommodate the deep curve of the ends.
- **Chips & Tags:** Small, pill-shaped badges used for status and filtering. Use high-saturation background tints from the container palette.
- **Cards:** Use a large 24px-32px corner radius. Borders should be kept thin (1px) or replaced entirely with subtle ambient shadows to emphasize the soft silhouette.
- **Checkboxes & Radios:** Both must be fully rounded. Checkboxes should use a "squircle" or high-radius rounded square, while radios are perfect circles.
- **Data Tables:** While the rows remain horizontal, the overall table container should have large rounded corners. Avoid vertical dividers; use horizontal stripes (`surface-container-low`) for clarity.