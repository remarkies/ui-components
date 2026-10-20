import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UI_COMPONENTS, UiTableColumn } from 'ui';
import { User, USERS } from './users';
import { SNIPPETS } from './snippets';

@Component({
  selector: 'app-root',
  imports: [UI_COMPONENTS, FormsModule, ReactiveFormsModule, JsonPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly fb = inject(FormBuilder);
  protected readonly snippets = SNIPPETS;

  protected readonly sections = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Text inputs' },
    { id: 'selection', label: 'Selection controls' },
    { id: 'files', label: 'File upload' },
    { id: 'form', label: 'Form example' },
    { id: 'modal', label: 'Modal' },
    { id: 'table', label: 'Table' },
  ];

  // Theme
  protected readonly dark = signal(
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches,
  );
  constructor() {
    this.applyTheme();
  }
  protected toggleTheme() {
    this.dark.update((d) => !d);
    this.applyTheme();
  }
  private applyTheme() {
    document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }

  // Buttons
  protected readonly saving = signal(false);
  protected save() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }

  // Inputs
  protected readonly showPassword = signal(false);
  protected readonly nativeTypes = [
    { type: 'text', label: 'Text', placeholder: 'Jane Doe' },
    { type: 'email', label: 'Email', placeholder: 'jane@example.com' },
    { type: 'password', label: 'Password', placeholder: '••••••••' },
    { type: 'number', label: 'Number', placeholder: '42' },
    { type: 'tel', label: 'Phone', placeholder: '+41 79 123 45 67' },
    { type: 'url', label: 'URL', placeholder: 'https://example.com' },
    { type: 'search', label: 'Search', placeholder: 'Search…' },
    { type: 'date', label: 'Date', placeholder: '' },
    { type: 'time', label: 'Time', placeholder: '' },
    { type: 'datetime-local', label: 'Date and time', placeholder: '' },
    { type: 'month', label: 'Month', placeholder: '' },
    { type: 'week', label: 'Week', placeholder: '' },
  ];
  protected color = '#4f46e5';

  // Selection
  protected readonly toppings = signal([
    { name: 'Mozzarella', checked: true },
    { name: 'Basil', checked: true },
    { name: 'Mushrooms', checked: false },
  ]);
  protected readonly allToppings = computed(() => this.toppings().every((t) => t.checked));
  protected readonly someToppings = computed(
    () => !this.allToppings() && this.toppings().some((t) => t.checked),
  );
  protected setAllToppings(checked: boolean) {
    this.toppings.update((list) => list.map((t) => ({ ...t, checked })));
  }
  protected setTopping(index: number, checked: boolean) {
    this.toppings.update((list) => list.map((t, i) => (i === index ? { ...t, checked } : t)));
  }
  protected plan = signal<'free' | 'pro' | 'team'>('pro');
  protected size = signal('m');
  protected notifications = signal(true);
  protected marketing = signal(false);
  protected volume = signal(60);
  protected price = signal(250);
  protected readonly formatPercent = (v: number) => `${v}%`;
  protected readonly formatChf = (v: number) => `CHF ${v}`;

  // Files
  protected files = signal<File[]>([]);

  // Form
  protected readonly signup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    country: ['', Validators.required],
    bio: ['', Validators.maxLength(200)],
    plan: ['pro'],
    experience: [3],
    newsletter: [true],
    terms: [false, Validators.requiredTrue],
  });
  protected readonly submitted = signal<unknown>(null);

  protected errorFor(name: keyof typeof this.signup.controls): string | null {
    const c = this.signup.controls[name];
    if (!c.invalid || !(c.touched || c.dirty)) return null;
    if (c.errors?.['required']) return 'This field is required';
    if (c.errors?.['email']) return 'Enter a valid email address';
    if (c.errors?.['minlength']) return `At least ${c.errors['minlength'].requiredLength} characters`;
    if (c.errors?.['maxlength']) return `At most ${c.errors['maxlength'].requiredLength} characters`;
    return 'Invalid value';
  }

  protected submit() {
    if (this.signup.invalid) {
      this.signup.markAllAsTouched();
      return;
    }
    this.submitted.set(this.signup.getRawValue());
  }

  protected resetForm() {
    this.signup.reset();
    this.submitted.set(null);
  }

  // Modal
  protected readonly basicOpen = signal(false);
  protected readonly confirmOpen = signal(false);
  protected readonly formOpen = signal(false);
  protected readonly largeOpen = signal(false);
  protected readonly deleting = signal(false);
  protected readonly lastAction = signal('');
  protected inviteEmail = '';
  protected inviteRole = 'Editor';

  protected confirmDelete() {
    this.deleting.set(true);
    setTimeout(() => {
      this.deleting.set(false);
      this.confirmOpen.set(false);
      this.lastAction.set('Project deleted (not really).');
    }, 1000);
  }

  protected sendInvite() {
    this.formOpen.set(false);
    this.lastAction.set(`Invite sent to ${this.inviteEmail || 'nobody'} as ${this.inviteRole}.`);
    this.inviteEmail = '';
  }

  // Table
  protected readonly users = signal(USERS);
  protected readonly selected = signal<User[]>([]);
  protected readonly striped = signal(false);
  protected readonly dense = signal(false);
  protected readonly query = signal('');
  protected readonly filteredUsers = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q
      ? this.users().filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      : this.users();
  });
  protected readonly columns: UiTableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'projects', header: 'Projects', sortable: true, align: 'end' },
    { key: 'joined', header: 'Joined', sortable: true },
    { key: 'actions', header: '', align: 'end', width: '1%' },
  ];
  protected removeUser(user: User) {
    this.users.update((list) => list.filter((u) => u.id !== user.id));
    this.selected.update((list) => list.filter((u) => u.id !== user.id));
  }
  protected removeSelected() {
    const ids = new Set(this.selected().map((u) => u.id));
    this.users.update((list) => list.filter((u) => !ids.has(u.id)));
    this.selected.set([]);
  }
  protected initials(name: string) {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('');
  }
}
