import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

let nextId = 0;

/** Marks content to project into the modal footer. */
@Directive({ selector: '[uiModalFooter]' })
export class UiModalFooter {}

/**
 * Modal dialog built on the native `<dialog>` element, so focus trapping,
 * Escape to close and the top layer come from the browser.
 *
 * ```html
 * <button uiButton (click)="open.set(true)">Open</button>
 * <ui-modal [(open)]="open" title="Delete project?">
 *   This cannot be undone.
 *   <div uiModalFooter>
 *     <button uiButton variant="ghost" (click)="open.set(false)">Cancel</button>
 *     <button uiButton variant="danger">Delete</button>
 *   </div>
 * </ui-modal>
 * ```
 */
@Component({
  selector: 'ui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      [attr.data-size]="size()"
      [attr.aria-labelledby]="title() ? titleId : null"
      (close)="onNativeClose()"
      (cancel)="onCancel($event)"
      (click)="onBackdropClick($event)"
    >
      <div class="panel">
        @if (title() || closable()) {
          <header>
            <div class="heading">
              @if (title()) {
                <h2 [id]="titleId">{{ title() }}</h2>
              }
              @if (subtitle()) {
                <p>{{ subtitle() }}</p>
              }
            </div>
            @if (closable()) {
              <button type="button" class="close" aria-label="Close" (click)="close()">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            }
          </header>
        }
        <div class="body"><ng-content /></div>
        <footer><ng-content select="[uiModalFooter]" /></footer>
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      width: min(calc(100vw - 32px), var(--_w, 520px));
      max-height: calc(100dvh - 48px);
      padding: 0;
      border: 1px solid var(--ui-border);
      border-radius: var(--ui-radius-lg);
      background: var(--ui-surface);
      color: var(--ui-text);
      font-family: var(--ui-font);
      box-shadow: var(--ui-shadow-lg);
    }
    dialog[data-size='sm'] { --_w: 420px; }
    dialog[data-size='lg'] { --_w: 760px; }
    dialog::backdrop { background: var(--ui-backdrop); }
    dialog[open] { animation: ui-modal-in 260ms var(--ui-ease); }
    dialog[open]::backdrop { animation: ui-fade-in 200ms ease-out; }
    @keyframes ui-modal-in { from { opacity: 0; transform: translateY(12px); } }
    @keyframes ui-fade-in { from { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      dialog[open], dialog[open]::backdrop { animation: none; }
    }
    .panel { display: flex; flex-direction: column; max-height: inherit; }
    header { display: flex; align-items: flex-start; gap: 16px; padding: 22px 24px 0; }
    .heading { flex: 1; min-width: 0; }
    h2 { margin: 0; font-size: 20px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; text-wrap: balance; }
    .heading p { margin: 4px 0 0; font-size: 15px; color: var(--ui-text-muted); }
    .close { flex: none; display: grid; place-items: center; width: 32px; height: 32px; margin: -4px -8px 0 0; padding: 0; border: 0; border-radius: var(--ui-radius); background: transparent; color: var(--ui-text-muted); cursor: pointer; transition: background var(--ui-transition), color var(--ui-transition); }
    .close:hover { background: var(--ui-surface-hover); color: var(--ui-text); }
    .close:focus-visible { outline: none; box-shadow: var(--ui-focus-ring); }
    .close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
    .body { padding: 14px 24px 24px; overflow-y: auto; font-size: 15px; line-height: 1.6; }
    .body > ::ng-deep :first-child { margin-top: 0; }
    .body > ::ng-deep :last-child { margin-bottom: 0; }
    footer { padding: 14px 24px; border-top: 1px solid var(--ui-border); background: var(--ui-surface-muted); border-radius: 0 0 var(--ui-radius-lg) var(--ui-radius-lg); }
    footer:empty { display: none; }
    footer > ::ng-deep [uiModalFooter] { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
  `,
})
export class UiModal {
  readonly open = model(false);
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** Show the × button and allow Escape to close. */
  readonly closable = input(true, { transform: booleanAttribute });
  /** Close when the backdrop is clicked. */
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closed = output<void>();

  protected readonly titleId = `ui-modal-${nextId++}-title`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.open() && !el.open) el.showModal();
      else if (!this.open() && el.open) el.close();
    });
  }

  close() {
    this.open.set(false);
  }

  protected onNativeClose() {
    if (this.open()) this.open.set(false);
    this.closed.emit();
  }

  protected onCancel(event: Event) {
    if (!this.closable()) event.preventDefault();
  }

  protected onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdrop() && event.target === this.dialog().nativeElement) this.close();
  }
}
