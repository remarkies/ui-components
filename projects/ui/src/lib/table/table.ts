import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UiCheckbox } from '../checkbox/checkbox';

export interface UiTableColumn<T> {
  /** Property of the row to display (also the sort key and the cell template name). */
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  /** Custom text for the cell. Use a `uiCell` template for richer content. */
  format?: (row: T) => string;
  /** Custom sort value; defaults to the row property. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
}

export type UiSortDirection = 'asc' | 'desc';
export interface UiSort {
  key: string;
  direction: UiSortDirection;
}

export interface UiCellContext<T> {
  $implicit: T;
  value: unknown;
  index: number;
}

/**
 * Custom cell template for a column.
 *
 * ```html
 * <ng-template uiCell="status" let-row>
 *   <span class="badge">{{ row.status }}</span>
 * </ng-template>
 * ```
 */
@Directive({ selector: 'ng-template[uiCell]' })
export class UiCellDef<T = any> {
  readonly name = input.required<string>({ alias: 'uiCell' });
  readonly template = inject<TemplateRef<UiCellContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(_dir: UiCellDef<T>, ctx: unknown): ctx is UiCellContext<T> {
    return true;
  }
}

/**
 * Data table with sorting, pagination, row selection and custom cell templates.
 *
 * ```html
 * <ui-table [data]="users" [columns]="columns" selectable [(selection)]="selected" [pageSize]="10" />
 * ```
 */
@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, UiCheckbox],
  host: {
    '[attr.data-striped]': 'striped() || null',
    '[attr.data-dense]': 'dense() || null',
  },
  template: `
    <div class="scroll">
      <table>
        <thead>
          <tr>
            @if (selectable()) {
              <th class="select">
                <ui-checkbox
                  ariaLabel="Select all rows on this page"
                  [checked]="allPageSelected()"
                  [indeterminate]="somePageSelected()"
                  (checkedChange)="togglePage($event)"
                />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                [style.width]="col.width"
                [attr.data-align]="col.align ?? 'start'"
                [attr.aria-sort]="ariaSort(col)"
              >
                @if (col.sortable) {
                  <button type="button" class="sort" (click)="toggleSort(col.key)">
                    {{ col.header }}
                    <svg viewBox="0 0 16 16" aria-hidden="true" [attr.data-dir]="sort()?.key === col.key ? sort()?.direction : null">
                      <path class="up" d="m5 6.5 3-3 3 3" />
                      <path class="down" d="m5 9.5 3 3 3-3" />
                    </svg>
                  </button>
                } @else {
                  {{ col.header }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of pageRows(); track trackKey(row, $index); let i = $index) {
            <tr
              [class.selected]="isSelected(row)"
              [class.clickable]="clickable()"
              (click)="rowClick.emit(row)"
            >
              @if (selectable()) {
                <td class="select" (click)="$event.stopPropagation()">
                  <ui-checkbox ariaLabel="Select row" [checked]="isSelected(row)" (checkedChange)="toggleRow(row, $event)" />
                </td>
              }
              @for (col of columns(); track col.key) {
                <td [attr.data-align]="col.align ?? 'start'">
                  @if (cellTemplates().get(col.key); as tpl) {
                    <ng-container
                      [ngTemplateOutlet]="tpl"
                      [ngTemplateOutletContext]="{ $implicit: row, value: valueOf(row, col.key), index: i }"
                    />
                  } @else {
                    {{ col.format ? col.format(row) : valueOf(row, col.key) }}
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td class="empty" [attr.colspan]="columns().length + (selectable() ? 1 : 0)">{{ emptyText() }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    @if (pageSize() > 0 && sortedRows().length > pageSize()) {
      <nav class="pager" aria-label="Pagination">
        <span class="range">{{ rangeLabel() }}</span>
        <div class="pages">
          <button type="button" aria-label="Previous page" [disabled]="page() === 0" (click)="page.set(page() - 1)">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4" /></svg>
          </button>
          @for (p of pageNumbers(); track p) {
            <button type="button" [class.current]="p === page()" [attr.aria-current]="p === page() ? 'page' : null" (click)="page.set(p)">
              {{ p + 1 }}
            </button>
          }
          <button type="button" aria-label="Next page" [disabled]="page() >= pageCount() - 1" (click)="page.set(page() + 1)">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
          </button>
        </div>
      </nav>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ui-font);
      font-size: 14px;
      color: var(--ui-text);
      border: 1px solid var(--ui-border);
      border-radius: var(--ui-radius-lg);
      background: var(--ui-surface);
      overflow: hidden;
    }
    .scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--ui-border); white-space: nowrap; }
    :host([data-dense]) th, :host([data-dense]) td { padding: 7px 12px; }
    th { font-size: 12px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; color: var(--ui-text-muted); background: var(--ui-surface-muted); }
    [data-align='center'] { text-align: center; }
    [data-align='end'] { text-align: right; font-variant-numeric: tabular-nums; }
    tbody tr:last-child td { border-bottom: 0; }
    :host([data-striped]) tbody tr:nth-child(even) { background: color-mix(in srgb, var(--ui-surface-muted) 55%, transparent); }
    tbody tr { transition: background var(--ui-transition); }
    tbody tr:hover { background: var(--ui-surface-hover); }
    tbody tr.selected { background: var(--ui-primary-soft); }
    tbody tr.clickable { cursor: pointer; }
    .select { width: 1%; padding-right: 0; }
    .empty { padding: 40px 16px; text-align: center; color: var(--ui-text-muted); }
    .sort { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: none; font: inherit; color: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer; }
    .sort:hover { color: var(--ui-text); }
    .sort:focus-visible { outline: none; box-shadow: var(--ui-focus-ring); border-radius: 4px; }
    .sort svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .sort svg path { opacity: 0.35; }
    .sort svg[data-dir='asc'] .up, .sort svg[data-dir='desc'] .down { opacity: 1; stroke: var(--ui-primary); }
    .pager { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 16px; border-top: 1px solid var(--ui-border); }
    .range { font-size: 13px; color: var(--ui-text-muted); }
    .pages { display: flex; gap: 4px; }
    .pages button { min-width: 32px; height: 32px; padding: 0 8px; display: grid; place-items: center; border: 1px solid transparent; border-radius: var(--ui-radius-sm); background: transparent; font: inherit; font-size: 13px; color: var(--ui-text); cursor: pointer; }
    .pages button:hover:not(:disabled) { background: var(--ui-surface-hover); }
    .pages button.current { border-color: var(--ui-primary); color: var(--ui-primary); font-weight: 600; }
    .pages button:disabled { opacity: 0.4; cursor: not-allowed; }
    .pages button:focus-visible { outline: none; box-shadow: var(--ui-focus-ring); }
    .pages svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  `,
})
export class UiTable<T extends object> {
  readonly data = input<readonly T[]>([]);
  readonly columns = input<readonly UiTableColumn<T>[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly dense = input(false, { transform: booleanAttribute });
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Pointer cursor on rows; listen to `rowClick`. */
  readonly clickable = input(false, { transform: booleanAttribute });
  /** Rows per page. 0 shows all rows. */
  readonly pageSize = input(0, { transform: numberAttribute });
  /** Row property used as identity for tracking and selection. */
  readonly trackBy = input<string>();
  readonly emptyText = input('No data');

  readonly selection = model<T[]>([]);
  readonly sort = model<UiSort | null>(null);
  readonly page = model(0);
  readonly rowClick = output<T>();

  private readonly cellDefs = contentChildren(UiCellDef);
  protected readonly cellTemplates = computed(
    () => new Map(this.cellDefs().map((d) => [d.name(), d.template] as const)),
  );

  protected readonly sortedRows = computed(() => {
    const rows = [...this.data()];
    const sort = this.sort();
    if (!sort) return rows;
    const col = this.columns().find((c) => c.key === sort.key);
    const get = col?.sortValue ?? ((row: T) => this.valueOf(row, sort.key) as string | number);
    const dir = sort.direction === 'asc' ? 1 : -1;
    return rows.sort((a, b) => compare(get(a), get(b)) * dir);
  });

  protected readonly pageCount = computed(() =>
    this.pageSize() > 0 ? Math.max(1, Math.ceil(this.sortedRows().length / this.pageSize())) : 1,
  );

  protected readonly pageRows = computed(() => {
    const size = this.pageSize();
    if (size <= 0) return this.sortedRows();
    const start = this.page() * size;
    return this.sortedRows().slice(start, start + size);
  });

  protected readonly pageNumbers = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i));

  protected readonly rangeLabel = computed(() => {
    const total = this.sortedRows().length;
    const start = this.page() * this.pageSize();
    return `${start + 1}–${Math.min(start + this.pageSize(), total)} of ${total}`;
  });

  private readonly selectedKeys = computed(() => new Set(this.selection().map((r) => this.keyOf(r))));
  protected readonly allPageSelected = computed(() => {
    const rows = this.pageRows();
    return rows.length > 0 && rows.every((r) => this.selectedKeys().has(this.keyOf(r)));
  });
  protected readonly somePageSelected = computed(
    () => !this.allPageSelected() && this.pageRows().some((r) => this.selectedKeys().has(this.keyOf(r))),
  );

  constructor() {
    // Keep the current page in range when data or page size changes.
    effect(() => {
      const last = this.pageCount() - 1;
      if (this.page() > last) this.page.set(last);
    });
  }

  protected valueOf(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  protected trackKey(row: T, index: number): unknown {
    return this.trackBy() ? this.valueOf(row, this.trackBy()!) : index;
  }

  protected isSelected(row: T): boolean {
    return this.selectedKeys().has(this.keyOf(row));
  }

  protected toggleSort(key: string) {
    const current = this.sort();
    if (current?.key !== key) this.sort.set({ key, direction: 'asc' });
    else if (current.direction === 'asc') this.sort.set({ key, direction: 'desc' });
    else this.sort.set(null);
    this.page.set(0);
  }

  protected ariaSort(col: UiTableColumn<T>): string | null {
    if (!col.sortable) return null;
    const sort = this.sort();
    if (sort?.key !== col.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleRow(row: T, checked: boolean) {
    const key = this.keyOf(row);
    this.selection.set(
      checked ? [...this.selection(), row] : this.selection().filter((r) => this.keyOf(r) !== key),
    );
  }

  protected togglePage(checked: boolean) {
    const pageKeys = new Set(this.pageRows().map((r) => this.keyOf(r)));
    const rest = this.selection().filter((r) => !pageKeys.has(this.keyOf(r)));
    this.selection.set(checked ? [...rest, ...this.pageRows()] : rest);
  }

  private keyOf(row: T): unknown {
    return this.trackBy() ? this.valueOf(row, this.trackBy()!) : row;
  }
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}
