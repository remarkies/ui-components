---
name: UI Components
description: Angular component kit themed like a Swiss hiking-trail sign, signal yellow carrying granite ink.
colors:
  signal-yellow: "#ffcc00"
  signal-yellow-hover: "#f2bd00"
  signal-yellow-soft: "#fff5c7"
  signal-yellow-dark: "#ffd21a"
  granite-ink: "#1c1e1d"
  sign-ink: "#1d1b10"
  stone-ground: "#eceeeb"
  stone-surface: "#fcfcfb"
  stone-muted: "#f2f3f1"
  stone-hover: "#e8eae7"
  hairline: "#d9dcd9"
  hairline-strong: "#868d89"
  text-muted: "#575d5a"
  text-disabled: "#9ba19e"
  swiss-red: "#c42b1c"
  swiss-red-soft: "#fcebe8"
  meadow-green: "#2a7546"
  night-ground: "#111312"
  night-surface: "#191c1b"
  night-text: "#e8eae6"
typography:
  display:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, Frutiger, Segoe UI, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, Frutiger, Segoe UI, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, Frutiger, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, Frutiger, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
  code:
    fontFamily: "ui-monospace, SF Mono, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  sm: "3px"
  md: "4px"
  lg: "6px"
  pill: "999px"
spacing:
  control-sm: "32px"
  control-md: "40px"
  control-lg: "48px"
  gap: "12px"
  panel: "28px"
components:
  button-primary:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "{spacing.control-md}"
  button-primary-hover:
    backgroundColor: "{colors.signal-yellow-hover}"
  button-secondary:
    backgroundColor: "{colors.stone-hover}"
    textColor: "{colors.granite-ink}"
    rounded: "{rounded.md}"
    height: "{spacing.control-md}"
  button-danger:
    backgroundColor: "{colors.swiss-red}"
    textColor: "{colors.stone-surface}"
    rounded: "{rounded.md}"
    height: "{spacing.control-md}"
  input:
    backgroundColor: "{colors.stone-surface}"
    textColor: "{colors.granite-ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "{spacing.control-md}"
  nav-sign-active:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.sign-ink}"
    height: "36px"
---

# Design System: UI Components

## Overview

The kit borrows from the Swiss hiking-trail sign: a yellow plate with black lettering, readable at a glance from across a valley. In the UI that becomes one action pairing, signal yellow carrying granite ink, on cool stone neutrals. Everything else stays quiet so the controls read as familiar, standard web controls (this is an Operate surface: the components live inside other people's apps).

Source of truth: `projects/ui/styles/theme.css`. Every color there is a `light-dark()` pair, so a single `--ui-*` override covers both themes. Values in the frontmatter are the light theme unless the name says `dark` or `night`.

## Colors

### Primary

**Signal yellow** (`--ui-primary`, #ffcc00 light / #ffd21a dark) fills primary buttons, checked checkboxes, radios, switches, the slider thumb, the current pagination page, the current signpost entry, and the outer halo of the focus ring. Text on it is always **sign ink** (`--ui-on-primary`, #1d1b10). On light surfaces a yellow fill is outlined with `--ui-primary-edge` (ink) so it holds 3:1 against the surface; in dark the edge is yellow itself.

### Secondary

**Swiss red** (`--ui-danger`) is reserved for destructive actions and errors. **Meadow green** (`--ui-success`) only marks success and valid states. Neither is decoration.

### Neutral

Cool stone, tinted slightly green: ground `--ui-bg`, surfaces `--ui-surface` / `--ui-surface-muted` / `--ui-surface-hover`, hairlines `--ui-border` and `--ui-border-strong` (the strong one is the 3:1 control boundary). Dark theme is granite night (#111312), not blue slate.

### Named Rules

- **One accent.** Yellow is the only accent. No second brand color, no gradients.
- **Ink on yellow, always.** Never white text on yellow, never yellow text on a light surface.
- **Errors carry the blaze.** Form errors show the red-white-red mountain-trail blaze before the message.

## Typography

One family, Source Sans 3 (a humanist sans in the Frutiger lineage that Swiss signage uses), self-hosted through `@fontsource-variable/source-sans-3`. System monospace only for code.

### Hierarchy

- Display 2.5rem/1.1, 700, -0.025em (demo h1 only)
- Heading 1.75rem/1.2, 700 (section titles)
- Group heading 17px, 700
- Label 14px, 600 (field labels, legends, table headers in normal case)
- Body and controls 15px; small controls 14px; hints 13px
- Tabular numerals in tables, sliders, number and date inputs

## Layout

Fixed rem scale, no fluid type. Demo: sticky 56px top bar, 220px signpost rail plus content column (max 1240px), collapsing below 900px into a horizontal strip of signs. Sections are separated by a strong hairline; live examples sit on one flat surface panel per section, never nested.

## Elevation & Depth

Flat. Surfaces are separated by hairlines, not shadows. Only the modal floats (`--ui-shadow-lg`, offset and soft blur). The backdrop is a plain dim with no blur.

## Shapes

Tight radii: 3px small controls and checkboxes, 4px controls, 6px panels, tables and modals. Pills only for switches. The pointed sign (a rectangle with a 14px arrow end, drawn with `clip-path`) is the one signature shape, used for the current signpost entry, section headings and the logo.

## Components

### Buttons

Primary yellow with ink text; secondary stone with ink; outline (strong hairline, ink on hover); ghost; danger red. Heights 32/40/48. Disabled turns neutral (muted surface, disabled text), never a faded accent. Pressing shifts the button down 1px.

### Inputs / Fields

Surface fill, strong hairline, ink border on hover and focus with a 3px yellow focus halo. Invalid: red border, red halo on focus, blaze plus message below. Labels sit above in 14px semibold.

### Selection controls

Checkbox, radio, and switch fill yellow with an ink edge when on. The check draws in with a stroke animation. Slider: ink fill on a hairline track, yellow thumb.

### Navigation

The signpost: a 3px pole with entries hanging off it. The section in view morphs into a yellow sign (clip-path, 260ms ease-out); scroll-spy picks the last section whose top has passed 40% of the viewport.

### Table

Header in normal case on the muted surface with a strong bottom hairline; selected rows in soft yellow; current page a yellow sign button. Edge shadows show only when there are more columns to scroll to.

### Focus

`--ui-focus-ring`: a 2px text-colored line, then a 3px yellow halo. Visible on every surface in both themes.

## Do's and Don'ts

### Do:

- Re-theme through `--ui-*` tokens with `light-dark()` pairs.
- Keep every state designed: hover, focus, active, disabled, loading, invalid, empty.
- Use 150–260ms transitions on `--ui-ease` (exponential ease-out); motion respects `prefers-reduced-motion`.

### Don't:

- Add a second accent color, gradients, glass or blur.
- Use uppercase tracked labels or eyebrow captions above headings.
- Put colored stripes on the side of cards, rows or alerts.
- Use emoji or Unicode glyphs as icons; icons are inline SVG with a 2px stroke.
