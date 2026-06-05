---
name: Vibrant Utility
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#494457'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7a7489'
  outline-variant: '#cac3da'
  surface-tint: '#6723ff'
  primary: '#4700c1'
  on-primary: '#ffffff'
  primary-container: '#6000ff'
  on-primary-container: '#d4c7ff'
  inverse-primary: '#ccbdff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#3f4143'
  on-tertiary: '#ffffff'
  tertiary-container: '#56585b'
  on-tertiary-container: '#ceced1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7deff'
  primary-fixed-dim: '#ccbdff'
  on-primary-fixed: '#1f0060'
  on-primary-fixed-variant: '#4d00d2'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e5'
  tertiary-fixed-dim: '#c6c6c9'
  on-tertiary-fixed: '#1a1c1e'
  on-tertiary-fixed-variant: '#454749'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
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
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality is efficient, high-energy, and reliable. It aims to transform the mundane task of attendance tracking into a seamless, high-performance experience. The target audience includes HR administrators and employees who value speed and clarity.

The design style is **Corporate / Modern with a High-Contrast edge**. It utilizes expansive white space to ensure focus, paired with a singular, high-saturation brand color to drive action. The aesthetic is "tech-forward professional"—it feels like a modern SaaS tool that is both powerful and easy to navigate. Visual noise is minimized, favoring functional geometry and crisp typography over decorative elements.

## Colors

The palette is anchored by "Electric Purple" (#6000FF), used strategically for primary actions, active states, and brand presence. 

- **Primary:** #6000FF — Reserved for high-priority interactions like "Sign In" or "Clock In."
- **Secondary/Heading:** #000000 — Used for maximum legibility in titles and primary text.
- **Surface/Tertiary:** #F4F4F7 — A cool-toned off-white for subtle section backgrounds and input fills.
- **Neutral/Body:** #4B5563 — A deep slate for body text to maintain readability without the harshness of pure black on white.
- **Status Colors:** Use standard semantic colors (Success: #10B981, Error: #EF4444) but maintain the same high saturation to match the brand's energy.

## Typography

This design system uses **Inter** for all roles to achieve a clean, systematic look. 

Headings should use a bold weight (700) and tighter letter spacing to create a sense of authority. Body text scales down to a medium size for optimal readability in data-dense environments like timesheets. Use "Label SM" in uppercase for table headers and small metadata to provide clear structural hierarchy.

## Layout & Spacing

The system uses a **Fluid Grid** for the main dashboard and a **Centered Fixed Container** for authentication screens. 

- **Grid:** A 12-column system with 24px gutters. 
- **Margins:** 24px on mobile, scaling to 48px+ on desktop.
- **Rhythm:** An 8px linear scale ensures consistent vertical alignment.
- **Density:** Use "md" (16px) for standard internal component padding and "lg" (24px) for external section spacing. Data tables should allow for a "Compact" mode using "sm" (8px) vertical padding to maximize information density.

## Elevation & Depth

To maintain a clean and professional look, this design system avoids heavy shadows.

- **Low-Contrast Outlines:** Use 1px borders (#E5E7EB) for input fields and cards to define boundaries without adding visual weight.
- **Tonal Layers:** Distinguish the sidebar and header from the main content using subtle background shifts (Primary background is white #FFFFFF, secondary backgrounds are #F9FAFB).
- **Active Elevation:** Only use soft, ambient shadows (0px 4px 12px rgba(0,0,0,0.05)) for floating elements like dropdown menus or modals to make them appear to sit slightly above the interface.

## Shapes

The shape language is **Soft**. 

Standard components like buttons and inputs use a 0.25rem (4px) radius. Larger containers like cards or data modules use "rounded-lg" (8px) to soften the overall appearance of the dashboard. This balance maintains a professional, "squared-off" corporate look while feeling modern and approachable.

## Components

### Buttons
- **Primary:** Solid #6000FF background, white text. No shadow.
- **Secondary:** White background with a #E5E7EB border. Black text.
- **States:** Hover should darken the primary color slightly; active/click should add a 2px offset ring in the brand color.

### Input Fields
- **Default:** 1px border (#E5E7EB), white background. 
- **Active:** 1px border #6000FF with a faint purple glow (ring).
- **Labels:** Positioned above the input in Label-MD, using #111827.

### Data Tables
- **Header:** Light gray background (#F9FAFB), uppercase labels, 1px bottom border.
- **Rows:** White background with a subtle border-bottom. Highlight rows on hover with #F4F4F7.
- **Cells:** Use Body-MD for text; provide ample horizontal padding (16px) for readability.

### Chips / Badges
- **Status:** Small, rounded-pill shapes with low-opacity backgrounds (e.g., Success: 10% green fill with 100% green text). Avoid solid bright colors for badges to keep focus on the Primary buttons.