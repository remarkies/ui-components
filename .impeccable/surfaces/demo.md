# Surface: demo page and component kit

Targets: `projects/demo/src/app/*`, `projects/ui/styles/theme.css`, `projects/ui/src/lib/**`

## Scope and mode

Operate. The components live inside other people's working apps; the demo is the catalogue a developer scans to find a component, see its states and copy the snippet. Familiar controls, product-grade density, identity through type, palette and one signature move.

## Audience and job

Angular developers (and the author) checking what a component looks like in every state, then copying the usage. They scan, jump to a section, toggle the theme, try the controls.

## Direction contract

THESIS: A Swiss hiking-trail sign system for UI: signal yellow on granite ink, read at a glance. It refuses the category default of an indigo accent on slate grays with soft rounded cards.

OWN-WORLD: Wanderweg signal yellow (#FFCC00 family) with near-black granite ink as the single action pairing; Swiss red for danger and the red-white-red mountain-trail blaze for errors; cool stone neutrals (never cream), alpine green for success. Tight 3–6px radii, 1px hairlines, flat surfaces, no glass, no gradients. One humanist signage sans (Source Sans 3, Frutiger lineage) for everything; system mono for code.

STORY: The visitor sees the whole kit as a signposted route: every component is a destination on the left signpost, the active one turns into a yellow trail sign, and each section shows the live component in all its states with the code beside it.

FIRST VIEWPORT: Sticky top bar with the name and theme toggle. Left: the signpost rail listing all components, the current one a pointed yellow sign. Right: a short title and one-paragraph intro, the install snippet, then the Buttons section starts within the first viewport.

FORM: Trail-sign system (position 1 of my ordered list: trail signs, topo map, railway timetable, banknote, ...). seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: scroll-spy on the signpost rail; the active entry morphs into a yellow sign with a pointed end (150–200ms ease-out). Focus rings everywhere use the sign pairing: ink inner line, yellow outer halo.

## Unresolved

Direction chosen by recommendation while the user's pick is pending.
