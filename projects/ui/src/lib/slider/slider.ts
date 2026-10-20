import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, model, numberAttribute, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Range slider. Supports `[(value)]`, `ngModel` and reactive forms.
 *
 * ```html
 * <ui-slider [(value)]="volume" [min]="0" [max]="100" label="Volume" showValue />
 * ```
 */
@Component({
  selector: 'ui-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSlider), multi: true }],
  template: `
    @if (label() || showValue()) {
      <div class="header">
        <span class="label">{{ label() }}</span>
        @if (showValue()) {
          <span class="value">{{ display() }}</span>
        }
      </div>
    }
    <input
      type="range"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="isDisabled()"
      [attr.aria-label]="label() ?? null"
      [style.--_pct]="percent() + '%'"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 8px; font-family: var(--ui-font); min-width: 160px; }
    .header { display: flex; justify-content: space-between; font-size: 13px; }
    .label { font-weight: 600; color: var(--ui-text); }
    .value { color: var(--ui-text-muted); font-variant-numeric: tabular-nums; }
    input {
      appearance: none;
      width: 100%;
      height: 20px;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }
    input:disabled { cursor: not-allowed; opacity: 0.5; }
    input:focus { outline: none; }
    input::-webkit-slider-runnable-track {
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(to right, var(--ui-primary) var(--_pct), var(--ui-border) var(--_pct));
    }
    input::-moz-range-track { height: 6px; border-radius: 999px; background: var(--ui-border); }
    input::-moz-range-progress { height: 6px; border-radius: 999px; background: var(--ui-primary); }
    input::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      margin-top: -6px;
      border-radius: 50%;
      background: var(--ui-surface);
      border: 2px solid var(--ui-primary);
      box-shadow: var(--ui-shadow-sm);
      transition: box-shadow var(--ui-transition);
    }
    input::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--ui-surface); border: 2px solid var(--ui-primary); }
    input:focus-visible::-webkit-slider-thumb { box-shadow: var(--ui-focus-ring); }
    input:focus-visible::-moz-range-thumb { box-shadow: var(--ui-focus-ring); }
  `,
})
export class UiSlider implements ControlValueAccessor {
  readonly value = model(0);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly label = input<string>();
  readonly showValue = input(false, { transform: booleanAttribute });
  /** Formats the displayed value, e.g. `v => v + '%'`. */
  readonly format = input<(value: number) => string>(String);
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly percent = computed(() => {
    const range = this.max() - this.min();
    return range > 0 ? ((this.value() - this.min()) / range) * 100 : 0;
  });
  protected readonly display = computed(() => this.format()(this.value()));

  private onChangeFn: (v: number) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.value.set(value);
    this.onChangeFn(value);
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? this.min());
  }
  registerOnChange(fn: (v: number) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
