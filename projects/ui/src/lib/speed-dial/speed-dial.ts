import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

import { cn } from '../cn';

/**
 * A FAB that discloses stacked actions above it. Same host-listener
 * contract as `nav[xnNavPanels]` (Escape + outside click + focusout all
 * close it, Escape returns focus to the trigger when focus was inside) —
 * just collapsed to a single boolean since a speed dial has exactly one
 * panel, not an id-keyed set of them. Unlike NavPanels there is no
 * click-inside-closes-on-link-activation rule: actions are buttons that run
 * commands, not links that navigate, so closing on activation is the
 * consumer's call (call `close()` from the action's own handler).
 *
 * ```html
 * <div xnSpeedDial>
 *   <button xnSpeedDialTrigger aria-label="Create">+</button>
 *   <div xnSpeedDialActions>
 *     <button xnSpeedDialAction aria-label="New file">…</button>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[xnSpeedDial]',
  exportAs: 'xnSpeedDial',
  host: {
    'data-slot': 'speed-dial',
    '[class]': 'classes()',
    '(keydown.escape)': 'closeFromKeyboard($event)',
    '(focusout)': 'onFocusOut($event)',
    // Always attached, same tradeoff NavPanels documents: cheap for the
    // one-speed-dial-per-page case this is built for.
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SpeedDial {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly open = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative inline-block', this.userClass()));

  toggle(): void {
    this.open.update((open) => !open);
  }

  close(): void {
    this.open.set(false);
  }

  protected closeFromKeyboard(event: Event): void {
    if (!this.open()) return;
    // Consuming Escape: without preventDefault, a wrapping <dialog> would
    // close in the same keypress.
    event.preventDefault();
    if (this.elementRef.nativeElement.contains(document.activeElement)) {
      this.elementRef.nativeElement
        .querySelector<HTMLElement>('[data-slot="speed-dial-trigger"]')
        ?.focus();
    }
    this.close();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && !this.elementRef.nativeElement.contains(next)) this.close();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.close();
  }
}

@Directive({
  selector: 'button[xnSpeedDialTrigger]',
  host: {
    'data-slot': 'speed-dial-trigger',
    type: 'button',
    '[attr.aria-expanded]': 'root.open()',
    '(click)': 'root.toggle()',
    '[class]': 'classes()',
  },
})
export class SpeedDialTrigger {
  protected readonly root = (() => {
    const root = inject(SpeedDial, { optional: true });
    if (!root) {
      throw new Error('button[xnSpeedDialTrigger] must be placed inside a [xnSpeedDial].');
    }
    return root;
  })();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative z-10 inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-lg text-primary-foreground shadow-lg transition-[background-color,rotate] hover:bg-primary/90 aria-expanded:rotate-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

/** Stacks above the trigger; inert (and hidden) whenever the dial is closed. */
@Directive({
  selector: '[xnSpeedDialActions]',
  host: {
    'data-slot': 'speed-dial-actions',
    '[attr.inert]': "root.open() ? null : ''",
    '[class]': 'classes()',
  },
})
export class SpeedDialActions {
  protected readonly root = (() => {
    const root = inject(SpeedDial, { optional: true });
    if (!root) {
      throw new Error('[xnSpeedDialActions] must be placed inside a [xnSpeedDial].');
    }
    return root;
  })();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      // Stagger by DOM position, not per-action input: transition-delay on
      // each child fans the entrance out even though every child becomes
      // visible in the same tick (the inert->rendered flip on this
      // container), which is what makes @starting-style fire for all of
      // them at once. transition-discrete is unneeded — display isn't in
      // the child transition list, only the container's inert toggle uses it.
      'absolute bottom-full left-1/2 mb-3 flex w-max -translate-x-1/2 flex-col-reverse items-center gap-2 [&[inert]]:hidden [&>*:nth-child(2)]:delay-75 [&>*:nth-child(3)]:delay-150 [&>*:nth-child(4)]:delay-200 [&>*:nth-child(5)]:delay-300',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'button[xnSpeedDialAction]',
  host: {
    'data-slot': 'speed-dial-action',
    type: 'button',
    '[class]': 'classes()',
  },
})
export class SpeedDialAction {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex size-10 cursor-pointer items-center justify-center rounded-full border bg-card text-card-foreground shadow-md transition-[opacity,translate] duration-200 ease-out-expo starting:translate-y-2 starting:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [SPEED_DIAL]`. */
export const SPEED_DIAL = [SpeedDial, SpeedDialTrigger, SpeedDialActions, SpeedDialAction] as const;
