# Product

<!-- impeccable:product-schema 1 -->

> Written without an interview round. Facts marked _(inferred)_ come from the repository and the project brief, not from a confirmed answer. Correct them freely.

## Platform

web

## Users

- Angular developers building their own apps who want a ready set of common form controls, a modal and a data table that they can theme instead of writing these by hand. _(inferred from the project brief: "easy usable for other angular projects")_
- The library author (Luka), who uses the one-page demo app to see every component and state at a glance while building the library.

## Product Purpose

A reusable Angular 21 component library (`projects/ui`) covering the common UI elements: button, form field, input (every native type), checkbox, radio, switch, slider, file input, modal and table. A one-page demo (`projects/demo`) shows each component with its variants, states and a usage snippet. Success means a developer can drop the package into another Angular app, import `UI_COMPONENTS`, include `theme.css`, and get consistent, accessible controls that work with signals and forms.

## Positioning

No third-party design system underneath: native elements (`<button>`, `<input>`, `<dialog>`) carry the behavior, and the look comes entirely from `--ui-*` CSS variables, so a consuming app re-themes everything by overriding tokens. All components are standalone, signal-based, `OnPush`, zoneless-ready, and every form control implements `ControlValueAccessor`.

## Operating Context

- Consumed as an npm package built with ng-packagr (`npm run build:lib` writes `dist/ui`), plus a global stylesheet (`ui/styles/theme.css`).
- The demo runs with `npm start` and imports the library straight from source.
- Light and dark themes: OS preference by default, forced with `data-theme` on `<html>`.
- The demo's sample content is Swiss (CHF amounts, Swiss phone numbers, Switzerland first in country lists). _(inferred: the author's home context)_

## Capabilities and Constraints

- Public API: the selectors and inputs listed in README.md. Redesigns must not rename selectors, inputs, outputs or `--ui-*` token names a consumer may already override; new tokens may be added.
- Every component must keep working with reactive forms, template forms and two-way `model()` bindings.
- Not decided: package name for publishing (currently `ui`), versioning, a docs site beyond the demo page.

## Brand Commitments

None confirmed. The name is the working title "UI Components".

## Evidence on Hand

- Demo sample data: `projects/demo/src/app/users.ts` (synthetic users), snippets in `snippets.ts`.
- No real customers, adoption numbers, benchmarks or testimonials exist. Do not invent any.

## Product Principles

1. Native first: build on the platform element and its accessibility, never re-implement it.
2. Tokens are the contract: every visual decision is reachable through a `--ui-*` variable.
3. Familiar controls: a developer's end users should recognize every control instantly; identity lives in type, color and detail, not in strange affordances.
4. Every state is designed: default, hover, focus, active, disabled, loading, invalid, empty.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor _(inferred)_: 4.5:1 text contrast, 3:1 for control boundaries and focus indicators, visible keyboard focus on every interactive element, and `prefers-reduced-motion` respected.
