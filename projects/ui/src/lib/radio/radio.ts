import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextGroupId = 0;

/**
 * Group of radio buttons. Supports `[(value)]`, `ngModel` and reactive forms.
 *
 * ```html
 * <ui-radio-group [(value)]="plan" label="Plan">
 *   <ui-radio value="free">Free</ui-radio>
 *   <ui-radio value="pro">Pro</ui-radio>
 * </ui-radio-group>
 * ```
 */
@Component({
  selector: 'ui-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioGroup), multi: true }],
  host: {
    role: 'radiogroup',
    '[attr.aria-label]': 'label() ?? null',
    '[attr.data-direction]': 'direction()',
  },
  template: `
    @if (label()) {
      <span class="legend" aria-hidden="true">{{ label() }}</span>
    }
    <div class="options"><ng-content /></div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 10px; font-family: var(--ui-font); }
    .legend { font-size: 14px; font-weight: 600; color: var(--ui-text); }
    .options { display: flex; flex-direction: column; gap: 10px; }
    :host([data-direction='horizontal']) .options { flex-direction: row; flex-wrap: wrap; gap: 8px 20px; }
  `,
})
export class UiRadioGroup<T = unknown> implements ControlValueAccessor {
  readonly value = model<T | null>(null);
  readonly label = input<string>();
  readonly name = input(`ui-radio-group-${nextGroupId++}`);
  readonly direction = input<'vertical' | 'horizontal'>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChangeFn: (v: T) => void = () => {};
  onTouched: () => void = () => {};

  select(value: T) {
    this.value.set(value);
    this.onChangeFn(value);
  }

  writeValue(value: T | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: (v: T) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}

/** A single option inside `ui-radio-group`. */
@Component({
  selector: 'ui-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="root" [class.disabled]="isDisabled()">
      <input
        type="radio"
        [name]="group.name()"
        [checked]="group.value() === value()"
        [disabled]="isDisabled()"
        (change)="group.select(value())"
        (blur)="group.onTouched()"
      />
      <span class="dot" aria-hidden="true"></span>
      <span class="text">
        <span class="label"><ng-content /></span>
        @if (description()) {
          <span class="description">{{ description() }}</span>
        }
      </span>
    </label>
  `,
  styles: `
    :host { display: inline-flex; font-family: var(--ui-font); }
    .root { position: relative; display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 15px; color: var(--ui-text); }
    .root.disabled { cursor: not-allowed; color: var(--ui-text-disabled); }
    input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
    .dot {
      flex: none;
      position: relative;
      width: 18px;
      height: 18px;
      margin-top: 1px;
      border: 1.5px solid var(--ui-border-strong);
      border-radius: 50%;
      background: var(--ui-surface);
      box-sizing: border-box;
      transition: border-color var(--ui-transition), background var(--ui-transition), box-shadow var(--ui-transition);
    }
    .dot::after {
      content: '';
      position: absolute;
      inset: 3.5px;
      border-radius: 50%;
      background: var(--ui-on-primary);
      transform: scale(0);
      transition: transform var(--ui-transition);
    }
    .root:hover .dot { border-color: var(--ui-text); }
    input:checked + .dot { background: var(--ui-primary); border-color: var(--ui-primary-edge); }
    input:checked + .dot::after { transform: scale(1); }
    input:focus-visible + .dot { box-shadow: var(--ui-focus-ring); }
    input:disabled + .dot { background: var(--ui-surface-muted); border-color: var(--ui-border); }
    input:disabled:checked + .dot { background: var(--ui-border); }
    input:disabled + .dot::after { background: var(--ui-text-disabled); }
    .text { display: flex; flex-direction: column; gap: 1px; line-height: 20px; }
    .description { font-size: 13px; line-height: 1.4; color: var(--ui-text-muted); }
    .root.disabled .description { color: var(--ui-text-disabled); }
  `,
})
export class UiRadio<T = unknown> {
  readonly value = input.required<T>();
  readonly description = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly group = inject<UiRadioGroup<T>>(UiRadioGroup);
  protected readonly isDisabled = computed(() => this.disabled() || this.group.isDisabled());
}
