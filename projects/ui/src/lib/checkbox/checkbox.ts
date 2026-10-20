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
    .root { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; color: var(--ui-text); }
    .root.disabled { cursor: not-allowed; color: var(--ui-text-disabled); }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
    .box {
      flex: none;
      display: grid;
      place-items: center;
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--ui-border-strong);
      border-radius: 5px;
      background: var(--ui-surface);
      transition: background var(--ui-transition), border-color var(--ui-transition), box-shadow var(--ui-transition);
    }
    svg { width: 14px; height: 14px; fill: none; stroke: var(--ui-on-primary); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transform: scale(0.6); transition: opacity var(--ui-transition), transform var(--ui-transition); }
    .root:hover .box { border-color: var(--ui-primary); }
    input:focus-visible + .box { box-shadow: var(--ui-focus-ring); }
    input:checked + .box, input:indeterminate + .box { background: var(--ui-primary); border-color: var(--ui-primary); }
    input:checked + .box svg, input:indeterminate + .box svg { opacity: 1; transform: none; }
    input:disabled + .box { opacity: 0.5; }
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
