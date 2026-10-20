---
name: UI Components
description: Neutral Angular component kit in the Radix/Linear tradition, slate grays with one blue accent.
colors:
  accent: "#3e63dd"
  accent-hover: "#3358d4"
  accent-soft: "#edf2fe"
  accent-text: "#3a5bc7"
  accent-text-dark: "#9eb1ff"
  on-accent: "#ffffff"
  slate-ground: "#f9f9fb"
  slate-surface: "#ffffff"
  slate-hover: "#f0f0f3"
  hairline: "#e0e1e6"
  hairline-strong: "#8b8d98"
  text: "#1c2024"
  text-muted: "#60646c"
  text-disabled: "#b0b4ba"
  danger: "#ce2c31"
  danger-soft: "#ffebec"
  success: "#18794e"
  success-soft: "#e6f6eb"
  night-ground: "#111113"
  night-surface: "#18191b"
  night-text: "#edeef0"
typography:
  display:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  code:
    fontFamily: "ui-monospace, SF Mono, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "999px"
spacing:
  control-sm: "32px"
  control-md: "36px"
  control-lg: "44px"
  gap: "12px"
  panel: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.control-md}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    height: "{spacing.control-md}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    height: "{spacing.control-md}"
  input:
    backgroundColor: "{colors.slate-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "{spacing.control-md}"
  nav-item-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    height: "32px"
---

# Design System: UI Components

## Overview

A conventional, neutral component kit held to the craft level of Radix Themes and Linear. This is deliberate: the owner chose the category standard over a themed look, so familiarity is the goal and the quality shows in finish (every state designed, contrast that passes, consistent sizing), not in novelty. It is an Operate surface: the components live inside other people's apps.

Source of truth: `projects/ui/styles/theme.css`. Every color is a `light-dark()` pair, so one `--ui-*` override covers both themes. Frontmatter values are the light theme unless the name says `dark` or `night`.

## Colors

### Primary

**Accent blue** (`--ui-primary`, #3e63dd) for primary buttons, checked controls, slider fill, the focus ring and selection. Text on it is white. Where accent-colored text sits on a soft or neutral surface (secondary buttons, the current nav item, pagination, links) it uses `--ui-primary-text`, which lightens to #9eb1ff in dark mode for contrast.

### Secondary

**Danger red** (`--ui-danger`) for destructive actions and errors; in dark mode the danger button fill is deepened so white text keeps 4.5:1. **Success green** (`--ui-success`) for valid and success states only.

### Neutral

Slate, tinted slightly blue: ground `--ui-bg`, surfaces `--ui-surface` / `--ui-surface-muted` / `--ui-surface-hover`, hairlines `--ui-border` (decorative) and `--ui-border-strong` (control boundaries, 3:1). Dark mode is near-black slate (#111113 / #18191b).

### Named Rules

- **One accent.** Blue is the only accent; red and green carry meaning, never decoration.
- **Soft for secondary.** Secondary emphasis is a soft accent tint with accent text, never a second hue.

## Typography

Inter (self-hosted through `@fontsource-variable/inter`) for everything, with `cv11` and `ss01` in the demo. System monospace for code only.

### Hierarchy

- Display 2.25rem/1.15, 650 (demo title only)
- Section heading 1.5rem/1.25, 600
- Group heading 15px, 600
- Body and controls 14px; small controls and labels 13px, 500; hints and badges 12px
- Tabular numerals in tables, sliders, number and date inputs

## Layout

Fixed rem scale. Demo: sticky 56px top bar, 220px sidebar plus content (max 1240px), collapsing below 900px into a horizontal row of pill links. Sections separated by a hairline; live examples sit on one flat surface panel per section, never nested.

## Elevation & Depth

Flat with 1px hairlines. The modal is the only floating surface (`--ui-shadow-lg`). Switch thumbs and the slider thumb carry a small shadow; nothing else does. The backdrop is a plain dim.

## Shapes

Radii 4px (small controls, checkboxes), 6px (controls, nav items), 8px (panels, tables, modals). Pills for switches, badges, the version tag and mobile nav.

## Components

### Buttons

Primary (accent), secondary (soft accent), outline (strong hairline), ghost, danger. Heights 32/36/44, 14px medium text. Disabled is neutral (muted surface, disabled text). Press scales to 0.98.

### Inputs / Fields

White surface, strong hairline, darker border on hover, accent border plus a 3px translucent accent ring on focus. Invalid: red border and ring, alert icon plus message below. Labels above in 13px medium.

### Selection controls

Checkbox and radio fill with the accent when checked (white check or dot); the check draws in. Switch: gray track with a white thumb, accent track when on. Slider: accent fill, white thumb with hairline.

### Navigation

Sidebar links in muted text; hover is a neutral tint, the current section (scroll-spy, last section past 40% of the viewport) is a soft accent tint with accent text.

### Table

Header in 13px medium on the muted surface, hairline rows, selected rows in soft accent, pill status badges, current page as a soft accent button. Edge shadows show only when more columns are scrollable. Empty header cells can carry a hidden `ariaLabel`.

### Focus

`--ui-focus-ring`: a 2px surface-colored gap then a 2px accent ring.

## Do's and Don'ts

### Do:

- Re-theme through `--ui-*` tokens with `light-dark()` pairs.
- Design every state: hover, focus, active, disabled, loading, invalid, empty.
- Keep transitions at 150ms on `--ui-ease`; respect `prefers-reduced-motion`.

### Don't:

- Add a second accent, gradients, glass or blur.
- Use uppercase tracked labels or eyebrow captions above headings.
- Put colored stripes on the side of cards, rows or alerts.
- Use emoji or Unicode glyphs as icons; icons are inline SVG with a consistent stroke.
