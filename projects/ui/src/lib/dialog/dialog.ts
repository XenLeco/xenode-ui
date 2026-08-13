import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling for the native <dialog> element. Behavior is entirely the
 * platform's: showModal() traps focus, Esc closes, the top layer handles
 * stacking, ::backdrop is a real pseudo-element. The consumer drives it
 * with a template reference:
 *
 * ```html
 * <button xnButton (click)="dlg.showModal()">Open</button>
 * <dialog xnDialog #dlg aria-labelledby="title-id">
 *   <div xnDialogHeader>
 *     <h2 xnDialogTitle id="title-id">Title</h2>
 *     <p xnDialogDescription>What this dialog is for.</p>
 *   </div>
 *   <div xnDialogFooter>
 *     <button xnButton variant="outline" (click)="dlg.close()">Close</button>
 *   </div>
 * </dialog>
 * ```
 *
 * `open:grid` on purpose: the UA hides closed dialogs with display:none,
 * and an unscoped display class would override that and show them.
 */
@Directive({
  selector: 'dialog[xnDialog]',
  host: {
    'data-slot': 'dialog',
    '[class]': 'classes()',
  },
})
export class Dialog {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'm-auto w-full max-w-lg scale-95 gap-4 rounded-lg border bg-background p-6 text-foreground opacity-0 shadow-lg transition-[opacity,scale,display,overlay] transition-discrete duration-200 open:grid open:scale-100 open:opacity-100 backdrop:bg-black/50 backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:backdrop:opacity-100 starting:open:scale-95 starting:open:opacity-0 starting:open:backdrop:opacity-0',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnDialogHeader]',
  host: {
    'data-slot': 'dialog-header',
    '[class]': 'classes()',
  },
})
export class DialogHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-1.5', this.userClass()));
}

@Directive({
  selector: '[xnDialogTitle]',
  host: {
    'data-slot': 'dialog-title',
    '[class]': 'classes()',
  },
})
export class DialogTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-lg leading-none font-semibold', this.userClass()),
  );
}

@Directive({
  selector: '[xnDialogDescription]',
  host: {
    'data-slot': 'dialog-description',
    '[class]': 'classes()',
  },
})
export class DialogDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnDialogFooter]',
  host: {
    'data-slot': 'dialog-footer',
    '[class]': 'classes()',
  },
})
export class DialogFooter {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex justify-end gap-2', this.userClass()));
}

/** Convenience for `imports: [DIALOG]`. */
export const DIALOG = [Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter] as const;
