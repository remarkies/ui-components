import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Checkbox with label. Supports `[(checked)]`, `ngModel` and reactive forms.
 *
 * ```html
 * <ui-checkbox [(checked)]="agree">I agree to the terms</ui-checkbox>
 * ```
 */
@Component({
  selector: 'ui-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckbox), multi: true }],
  template: `
    <label class="root" [class.disabled]="isDisabled()">
      <input
        type="checkbox"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel() ?? null"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="box" aria-hidden="true">
        @if (indeterminate()) {
          <svg viewBox="0 0 16 16"><path d="M4 8h8" /></svg>
        } @else {
          <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" /></svg>
        }
      </span>
      <span class="label"><ng-content /></span>
    </label>
  `,
  styles: `
    :host { display: inline-flex; font-family: var(--ui-font); }
    .root { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; line-height: 1.35; color: var(--ui-text); }
    .root.disabled { cursor: not-allowed; color: var(--ui-text-disabled); }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
    .box {
      flex: none;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 1px solid var(--ui-border-strong);
      border-radius: var(--ui-radius-sm);
      background: var(--ui-surface);
      transition: background var(--ui-transition), border-color var(--ui-transition), box-shadow var(--ui-transition);
    }
    svg { width: 12px; height: 12px; fill: none; stroke: var(--ui-on-primary); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset 200ms var(--ui-ease); }
    .root:hover .box { border-color: var(--ui-primary); }
    input:focus-visible + .box { box-shadow: var(--ui-focus-ring); }
    input:checked + .box, input:indeterminate + .box { background: var(--ui-primary); border-color: var(--ui-primary-edge); }
    input:checked + .box svg, input:indeterminate + .box svg { stroke-dashoffset: 0; }
    input:disabled + .box { background: var(--ui-surface-muted); border-color: var(--ui-border); }
    input:disabled:checked + .box, input:disabled:indeterminate + .box { background: var(--ui-border); border-color: var(--ui-border); }
    input:disabled + .box svg { stroke: var(--ui-text-disabled); }
    .label:empty { display: none; }
  `,
})
export class UiCheckbox implements ControlValueAccessor {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChangeFn: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.indeterminate.set(false);
    this.checked.set(value);
    this.onChangeFn(value);
  }

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
