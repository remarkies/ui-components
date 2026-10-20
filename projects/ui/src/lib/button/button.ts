import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';

export type UiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type UiSize = 'sm' | 'md' | 'lg';

/**
 * Button styling for native `<button>` and `<a>` elements.
 *
 * ```html
 * <button uiButton variant="primary" (click)="save()">Save</button>
 * <a uiButton variant="ghost" href="/docs">Docs</a>
 * ```
 */
@Component({
  selector: 'button[uiButton], a[uiButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  host: {
    class: 'ui-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-block]': 'block() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.disabled]': 'isButton && (disabled() || loading()) ? "" : null',
    '[attr.aria-disabled]': '!isButton && disabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() || null',
  },
  styles: `
    :host {
      --_bg: var(--ui-primary);
      --_bg-hover: var(--ui-primary-hover);
      --_fg: var(--ui-on-primary);
      --_border: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-sizing: border-box;
      height: var(--ui-control-h);
      padding: 0 16px;
      font-family: var(--ui-font);
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      text-decoration: none;
      color: var(--_fg);
      background: var(--_bg);
      border: 1px solid var(--_border);
      border-radius: var(--ui-radius);
      cursor: pointer;
      user-select: none;
      transition: background var(--ui-transition), border-color var(--ui-transition), box-shadow var(--ui-transition), transform 80ms ease;
    }
    :host(:hover) { background: var(--_bg-hover); }
    :host(:active) { transform: translateY(1px); }
    :host(:focus-visible) { outline: none; box-shadow: var(--ui-focus-ring); }
    :host([disabled]), :host([aria-disabled='true']) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    :host([aria-busy='true']) { opacity: 0.8; }

    :host([data-variant='secondary']) { --_bg: var(--ui-primary-soft); --_bg-hover: color-mix(in srgb, var(--ui-primary) 18%, transparent); --_fg: var(--ui-primary); }
    :host([data-variant='outline']) { --_bg: var(--ui-surface); --_bg-hover: var(--ui-surface-hover); --_fg: var(--ui-text); --_border: var(--ui-border-strong); }
    :host([data-variant='ghost']) { --_bg: transparent; --_bg-hover: var(--ui-surface-hover); --_fg: var(--ui-text); }
    :host([data-variant='danger']) { --_bg: var(--ui-danger); --_bg-hover: var(--ui-danger-hover); --_fg: var(--ui-on-danger); }

    :host([data-size='sm']) { height: var(--ui-control-h-sm); padding: 0 12px; font-size: 13px; border-radius: var(--ui-radius-sm); }
    :host([data-size='lg']) { height: var(--ui-control-h-lg); padding: 0 22px; font-size: 16px; }
    :host([data-block]) { display: flex; width: 100%; }
    :host([data-icon-only]) { padding: 0; width: var(--ui-control-h); }
    :host([data-icon-only][data-size='sm']) { width: var(--ui-control-h-sm); }
    :host([data-icon-only][data-size='lg']) { width: var(--ui-control-h-lg); }

    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: ui-spin 0.7s linear infinite;
    }
    @keyframes ui-spin { to { transform: rotate(360deg); } }
  `,
})
export class UiButton {
  readonly variant = input<UiButtonVariant>('primary');
  readonly size = input<UiSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  /** Stretch to the full width of the container. */
  readonly block = input(false, { transform: booleanAttribute });
  /** Square button for a single icon. Give it an aria-label. */
  readonly iconOnly = input(false, { transform: booleanAttribute });

  protected readonly isButton = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'BUTTON';
}
