# UI Components

A reusable Angular 21 component library with custom styling (no third-party design system), plus a one-page demo app.

```
projects/
  ui/      the library (published as the `ui` package)
  demo/    one-page showcase of every component
```

## Run the demo

```bash
npm install
npm start          # http://localhost:4200
```

The demo imports the library straight from source (`tsconfig.json` maps `ui` to `projects/ui/src/public-api.ts`), so edits to components show up live.

## Components

| Component | Selector | Notes |
| --- | --- | --- |
| Button | `button[uiButton]`, `a[uiButton]` | `variant`: primary, secondary, outline, ghost, danger · `size`: sm, md, lg · `loading`, `disabled`, `block`, `iconOnly` |
| Form field | `ui-form-field` | `label`, `hint`, `error`, `required`; `[uiPrefix]` / `[uiSuffix]` slots |
| Input | `input[uiInput]`, `textarea[uiInput]`, `select[uiInput]` | Every native type: text, email, password, number, tel, url, search, date, time, datetime-local, month, week, color |
| Checkbox | `ui-checkbox` | `[(checked)]`, `indeterminate`, forms |
| Radio | `ui-radio-group` + `ui-radio` | `[(value)]`, `direction`, per-option `description`, forms |
| Switch | `ui-switch` | `[(checked)]`, forms |
| Slider | `ui-slider` | `[(value)]`, `min`, `max`, `step`, `showValue`, `format`, forms |
| File input | `ui-file-input` | Drag and drop, `multiple`, `accept`, value is `File[]`, forms |
| Modal | `ui-modal` | Native `<dialog>`; `[(open)]`, `title`, `subtitle`, `size`, `closable`, `closeOnBackdrop`; `[uiModalFooter]` slot |
| Table | `ui-table` | `data`, `columns`, sorting, `pageSize`, `selectable` + `[(selection)]`, `trackBy`, `striped`, `dense`, `ng-template uiCell="key"` |

Every form control implements `ControlValueAccessor`, so it works with `formControlName`, `[formControl]` and `ngModel`. All components are standalone, use signals and `OnPush`, and work in zoneless apps.

## Use it in another Angular project

1. Build the library:

   ```bash
   npm run build:lib    # output in dist/ui
   ```

2. Install it in your app, either from a registry after `npm publish dist/ui`, or locally:

   ```bash
   npm install ../ui-components/dist/ui
   ```

3. Add the theme stylesheet in your app's `angular.json`:

   ```json
   "styles": ["node_modules/ui/styles/theme.css", "src/styles.scss"]
   ```

4. Import components where you need them:

   ```ts
   import { UI_COMPONENTS } from 'ui';           // everything
   import { UiButton, UiModal } from 'ui';       // or pick

   @Component({ imports: [UI_COMPONENTS], ... })
   ```

## Theming

All colors, radii and sizes are CSS variables in `projects/ui/styles/theme.css`. Override any of them in your global styles:

```css
:root {
  --ui-primary: #0d9488;
  --ui-primary-hover: #0f766e;
  --ui-radius: 4px;
}
```

Dark mode follows the OS setting automatically. Force a theme with `<html data-theme="dark">` or `data-theme="light"`.
