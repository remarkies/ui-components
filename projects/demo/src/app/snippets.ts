export const SNIPPETS = {
  setup: `// angular.json -> "styles": ["node_modules/ui/styles/theme.css", ...]
import { UI_COMPONENTS } from 'ui';

@Component({ imports: [UI_COMPONENTS], ... })`,
  buttons: `<button uiButton (click)="save()">Save</button>
<button uiButton variant="outline" size="sm">Cancel</button>
<button uiButton variant="danger" [loading]="saving()">Delete</button>
<a uiButton variant="ghost" href="/docs">Docs</a>`,
  inputs: `<ui-form-field label="Email" hint="We never share it" [error]="emailError()">
  <input uiInput type="email" [(ngModel)]="email" />
</ui-form-field>

<ui-form-field label="Search">
  <svg uiPrefix ...></svg>
  <input uiInput type="search" />
</ui-form-field>`,
  selection: `<ui-checkbox [(checked)]="agree">I agree</ui-checkbox>
<ui-switch [(checked)]="notifications">Notifications</ui-switch>

<ui-radio-group label="Plan" [(value)]="plan">
  <ui-radio value="free">Free</ui-radio>
  <ui-radio value="pro" description="For growing teams">Pro</ui-radio>
</ui-radio-group>

<ui-slider label="Volume" showValue [(value)]="volume" />`,
  files: `<ui-file-input accept="image/*,.pdf" multiple
  hint="PNG, JPG or PDF up to 10 MB" [(files)]="files" />`,
  form: `form = fb.group({
  email: ['', [Validators.required, Validators.email]],
  terms: [false, Validators.requiredTrue],
});

<ui-form-field label="Email" [error]="errorFor('email')">
  <input uiInput type="email" formControlName="email" />
</ui-form-field>
<ui-checkbox formControlName="terms">Accept terms</ui-checkbox>`,
  modal: `<button uiButton (click)="open.set(true)">Open</button>

<ui-modal [(open)]="open" title="Delete project?" size="sm">
  This cannot be undone.
  <div uiModalFooter>
    <button uiButton variant="ghost" (click)="open.set(false)">Cancel</button>
    <button uiButton variant="danger">Delete</button>
  </div>
</ui-modal>`,
  table: `columns: UiTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'projects', header: 'Projects', align: 'end' },
];

<ui-table [data]="users" [columns]="columns" trackBy="id"
  selectable [(selection)]="selected" [pageSize]="8">
  <ng-template uiCell="status" let-row>
    <span class="badge">{{ row.status }}</span>
  </ng-template>
</ui-table>`,
};
