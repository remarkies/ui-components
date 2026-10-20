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
    .root { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; color: var(--ui-text); }
    .root.disabled { cursor: not-allowed; color: var(--ui-text-disabled); }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
    .track {
      flex: none;
      position: relative;
      box-sizing: border-box;
      width: 36px;
      height: 20px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--ui-border-strong) 55%, var(--ui-surface));
      transition: background var(--ui-transition), border-color var(--ui-transition), box-shadow var(--ui-transition);
    }
    .thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.2), 0 0 0 0.5px rgb(0 0 0 / 0.06);
      transition: transform 220ms var(--ui-ease), background var(--ui-transition), width 220ms var(--ui-ease);
    }
    .root:hover .track { background: color-mix(in srgb, var(--ui-border-strong) 75%, var(--ui-surface)); }
    .root:active .thumb { width: 19px; }
    input:checked + .track, .root:hover input:checked + .track { background: var(--ui-primary); }
    input:checked + .track .thumb { transform: translateX(16px); }
    .root:active input:checked + .track .thumb { transform: translateX(13px); }
    input:focus-visible + .track { box-shadow: var(--ui-focus-ring); }
    input:disabled + .track, input:disabled:checked + .track { background: var(--ui-surface-hover); }
    input:disabled + .track .thumb { box-shadow: none; background: var(--ui-border); }
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
