import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { UiFormField, UiFormFieldControl } from '../form-field/form-field';
import { UiSize } from '../button/button';

/**
 * Styles a native `<input>`, `<textarea>` or `<select>`. Works with every native
 * input type (text, email, password, number, search, tel, url, date, time,
 * datetime-local, month, week, color) and with both reactive and template forms.
 *
 * ```html
 * <input uiInput type="email" placeholder="you@example.com" />
 * <select uiInput><option>One</option></select>
 * ```
 */
@Directive({
  selector: 'input[uiInput], textarea[uiInput], select[uiInput]',
  host: {
    class: 'ui-input',
    '[attr.id]': 'resolvedId() || null',
    '[attr.data-size]': 'size()',
    '[attr.aria-invalid]': 'isInvalid() || null',
    '[attr.aria-describedby]': 'field?.describedBy() ?? null',
  },
})
export class UiInput implements UiFormFieldControl {
  readonly id = input<string>();
  readonly size = input<UiSize>('md');
  /** Force the invalid style regardless of form control state. */
  readonly invalid = input(false, { transform: booleanAttribute });

  protected readonly field = inject(UiFormField, { optional: true });
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    this.field?.control.set(this);
  }

  resolvedId(): string {
    return this.id() ?? this.field?.inputId ?? '';
  }

  isInvalid(): boolean {
    if (this.invalid()) return true;
    const c = this.ngControl;
    return !!c && !!c.invalid && !!(c.touched || c.dirty);
  }
}
