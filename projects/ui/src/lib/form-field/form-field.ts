import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

let nextId = 0;

/** Implemented by controls that register with a surrounding `ui-form-field`. */
export interface UiFormFieldControl {
  resolvedId(): string;
  isInvalid(): boolean;
}

/**
 * Wraps a control with a label, hint, error message and optional prefix/suffix.
 *
 * ```html
 * <ui-form-field label="Email" hint="We never share it" [error]="emailError()">
 *   <input uiInput type="email" formControlName="email" />
 * </ui-form-field>
 * ```
 */
@Component({
  selector: 'ui-form-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'ui-form-field',
    '[class.ui-form-field--invalid]': 'showError()',
  },
  template: `
    @if (label()) {
      <label class="ui-form-field__label" [attr.for]="control()?.resolvedId() ?? inputId">
        {{ label() }}
        @if (required()) {
          <span class="ui-form-field__required" aria-hidden="true">*</span>
        }
      </label>
    }
    <div class="ui-form-field__control">
      <ng-content select="[uiPrefix]" />
      <ng-content />
      <ng-content select="[uiSuffix]" />
    </div>
    @if (showError()) {
      <p class="ui-form-field__error" [id]="messageId" role="alert">{{ error() }}</p>
    } @else if (hint()) {
      <p class="ui-form-field__hint" [id]="messageId">{{ hint() }}</p>
    }
  `,
  styles: `
    .ui-form-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--ui-font); min-width: 0; }
    .ui-form-field__label { font-size: 14px; font-weight: 600; line-height: 1.3; color: var(--ui-text); }
    .ui-form-field__required { color: var(--ui-danger); margin-left: 3px; }
    .ui-form-field__control { position: relative; display: flex; align-items: center; }
    .ui-form-field__control > [uiPrefix],
    .ui-form-field__control > [uiSuffix] {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      color: var(--ui-text-muted);
      font-size: 14px;
      font-weight: 600;
    }
    .ui-form-field__control > [uiPrefix] { left: 12px; pointer-events: none; }
    .ui-form-field__control > [uiSuffix] { right: 4px; }
    .ui-form-field__control:has(> [uiPrefix]) > .ui-input { padding-left: 38px; }
    .ui-form-field__control:has(> [uiSuffix]) > .ui-input { padding-right: 44px; }
    .ui-form-field__hint, .ui-form-field__error { margin: 0; font-size: 13px; line-height: 1.4; }
    .ui-form-field__hint { color: var(--ui-text-muted); }
    /* Red-white-red, the mountain-trail blaze, marks an error. */
    .ui-form-field__error { display: flex; align-items: baseline; gap: 7px; color: var(--ui-danger); font-weight: 600; }
    .ui-form-field__error::before {
      content: '';
      flex: none;
      width: 12px;
      height: 9px;
      border-radius: 1px;
      background: linear-gradient(var(--ui-danger) 33%, var(--ui-surface) 33% 67%, var(--ui-danger) 67%);
      box-shadow: 0 0 0 1px var(--ui-danger);
      transform: translateY(-1px);
    }
  `,
})
export class UiFormField {
  readonly label = input<string>();
  readonly hint = input<string>();
  /** Error message. Shown when set and the control is invalid (or always, if there is no form control). */
  readonly error = input<string | null>();
  readonly required = input(false, { transform: booleanAttribute });

  readonly inputId = `ui-field-${nextId++}`;
  readonly messageId = `${this.inputId}-msg`;
  readonly control = signal<UiFormFieldControl | null>(null);

  protected readonly showError = computed(() => !!this.error());

  /** Id of the hint/error element, for aria-describedby on the control. */
  describedBy(): string | null {
    return this.error() || this.hint() ? this.messageId : null;
  }
}
