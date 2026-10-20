import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * File picker with drag and drop. The value is an array of `File`.
 * Supports `[(files)]`, `ngModel` and reactive forms.
 *
 * ```html
 * <ui-file-input accept="image/*" multiple [(files)]="images" />
 * ```
 */
@Component({
  selector: 'ui-file-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiFileInput), multi: true }],
  template: `
    <label
      class="drop"
      [class.dragging]="dragging()"
      [class.disabled]="isDisabled()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragging.set(false)"
      (drop)="onDrop($event)"
    >
      <input
        #picker
        type="file"
        [accept]="accept()"
        [multiple]="multiple()"
        [disabled]="isDisabled()"
        (change)="onPick(picker)"
        (blur)="onTouched()"
      />
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
      <span class="title"><strong>Click to upload</strong> or drag and drop</span>
      @if (hint()) {
        <span class="hint">{{ hint() }}</span>
      }
    </label>
    @if (files().length) {
      <ul class="list">
        @for (file of files(); track $index) {
          <li>
            <span class="name">{{ file.name }}</span>
            <span class="size">{{ formatSize(file.size) }}</span>
            <button type="button" class="remove" [attr.aria-label]="'Remove ' + file.name" (click)="remove($index)" [disabled]="isDisabled()">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 10px; font-family: var(--ui-font); }
    .drop {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 24px 16px;
      text-align: center;
      border: 1.5px dashed var(--ui-border-strong);
      border-radius: var(--ui-radius-lg);
      background: var(--ui-surface);
      cursor: pointer;
      transition: border-color var(--ui-transition), background var(--ui-transition);
    }
    .drop:hover, .drop.dragging { border-color: var(--ui-primary); background: var(--ui-primary-soft); }
    .drop:focus-within { box-shadow: var(--ui-focus-ring); border-color: var(--ui-primary); }
    .drop.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; }
    .icon { width: 28px; height: 28px; fill: none; stroke: var(--ui-primary); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .title { font-size: 14px; color: var(--ui-text-muted); }
    .title strong { color: var(--ui-primary); font-weight: 600; }
    .hint { font-size: 12px; color: var(--ui-text-muted); }
    .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 8px 8px 12px;
      font-size: 13px;
      border: 1px solid var(--ui-border);
      border-radius: var(--ui-radius);
      background: var(--ui-surface);
    }
    .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ui-text); }
    .size { color: var(--ui-text-muted); font-variant-numeric: tabular-nums; }
    .remove { display: grid; place-items: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: var(--ui-radius-sm); background: transparent; cursor: pointer; color: var(--ui-text-muted); }
    .remove:hover { background: var(--ui-surface-hover); color: var(--ui-danger); }
    .remove svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
  `,
})
export class UiFileInput implements ControlValueAccessor {
  readonly files = model<File[]>([]);
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly hint = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly dragging = signal(false);
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChangeFn: (v: File[]) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onPick(picker: HTMLInputElement) {
    this.add(Array.from(picker.files ?? []));
    picker.value = '';
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    if (this.isDisabled()) return;
    this.add(Array.from(event.dataTransfer?.files ?? []));
  }

  protected remove(index: number) {
    this.update(this.files().filter((_, i) => i !== index));
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  private add(picked: File[]) {
    if (!picked.length) return;
    this.update(this.multiple() ? [...this.files(), ...picked] : picked.slice(0, 1));
    this.onTouched();
  }

  private update(files: File[]) {
    this.files.set(files);
    this.onChangeFn(files);
  }

  writeValue(value: File[] | null): void {
    this.files.set(value ?? []);
  }
  registerOnChange(fn: (v: File[]) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
