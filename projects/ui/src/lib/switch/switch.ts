import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * On/off toggle. Supports `[(checked)]`, `ngModel` and reactive forms.
 *
 * ```html
 * <ui-switch [(checked)]="notifications">Email notifications</ui-switch>
 * ```
 */
@Component({
  selector: 'ui-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSwitch), multi: true }],
  template: `
    <label class="root" [class.disabled]="isDisabled()">
      <input
        type="checkbox"
        role="switch"
        [checked]="checked()"
        [disabled]="isDisabled()"
        [attr.aria-checked]="checked()"
        [attr.aria-label]="ariaLabel() ?? null"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="track" aria-hidden="true"><span class="thumb"></span></span>
      <span class="label"><ng-content /></span>
    </label>
  `,
  styles: `
    :host { display: inline-flex; font-family: var(--ui-font); }
    .root { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; color: var(--ui-text); }
    .root.disabled { cursor: not-allowed; color: var(--ui-text-disabled); }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
    .track {
      flex: none;
      position: relative;
      width: 38px;
      height: 22px;
      border-radius: 999px;
      background: var(--ui-border-strong);
      transition: background var(--ui-transition), box-shadow var(--ui-transition);
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
      transition: transform 180ms cubic-bezier(0.3, 0.7, 0.4, 1);
    }
    input:checked + .track { background: var(--ui-primary); }
    input:checked + .track .thumb { transform: translateX(16px); }
    input:focus-visible + .track { box-shadow: var(--ui-focus-ring); }
    input:disabled + .track { opacity: 0.5; }
    .label:empty { display: none; }
  `,
})
export class UiSwitch implements ControlValueAccessor {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChangeFn: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
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
