# Surface: demo page and component kit

Targets: `projects/demo/src/app/*`, `projects/ui/styles/theme.css`, `projects/ui/src/lib/**`

## Scope and mode

Operate. The components live inside other people's working apps; the demo is the catalogue a developer scans to find a component, see its states and copy the snippet.

## Audience and job

Angular developers (and the author) checking what a component looks like in every state, then copying the usage. They scan, jump to a section, toggle the theme, try the controls.

## Direction contract

The user took the standing exit: the category standard, played straight (decision on 2026-10-20, replacing the first-built "trail sign" direction). The bar is Radix Themes and Linear.

THESIS: A neutral, conventional component kit at the craft level of Radix Themes and Linear. It refuses half-finished defaults (missing states, low-contrast boundaries, inconsistent sizing), not convention itself.

OWN-WORLD: Slate neutrals tinted slightly blue, one blue accent (#3e63dd) for primary actions, selection and focus only, red for danger, green for success. Inter for everything, system mono for code. 4/6/8px radii, 1px hairlines, flat surfaces, soft pill badges, a two-ring focus indicator (surface gap plus accent).

STORY: The visitor sees every component in all its states on one page, jumps there from the sidebar, and copies the snippet next to it.

FIRST VIEWPORT: Sticky top bar with logo, name, version pill and theme toggle. Left: sidebar of sections with the current one highlighted in soft accent. Right: title, one-paragraph intro, setup snippet, then the Buttons section starts.

FORM: Category standard (canon card, user-chosen). seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

None.
