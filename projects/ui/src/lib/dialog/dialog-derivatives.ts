import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Native-<dialog> derivatives. All reuse the platform's showModal focus
 * trap, Esc and top layer, and compose with the existing DialogHeader/
 * Title/Description/Footer slots. Placement works by overriding the UA's
 * auto-margins: ml-auto pins to the right edge, mt-auto to the bottom.
 */

/** A confirmation dialog: same shell, announced assertively. */
@Directive({
  selector: 'dialog[xnAlertDialog]',
  host: {
    'data-slot': 'alert-dialog',
    role: 'alertdialog',
    '[class]': 'classes()',
  },
})
export class AlertDialog {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'm-auto w-full max-w-md gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg open:grid backdrop:bg-black/50',
      this.userClass(),
    ),
  );
}

/** A side panel. */
@Directive({
  selector: 'dialog[xnSheet]',
  host: {
    'data-slot': 'sheet',
    '[class]': 'classes()',
  },
})
export class Sheet {
  readonly side = input<'right' | 'left'>('right');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'm-0 h-dvh max-h-none w-full max-w-sm gap-4 bg-background p-6 text-foreground shadow-lg open:flex open:flex-col backdrop:bg-black/50',
      this.side() === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
      this.userClass(),
    ),
  );
}

/** A bottom panel. */
@Directive({
  selector: 'dialog[xnDrawer]',
  host: {
    'data-slot': 'drawer',
    '[class]': 'classes()',
  },
})
export class Drawer {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'm-0 mt-auto max-h-[80dvh] w-full max-w-none gap-4 rounded-t-lg border-t bg-background p-6 text-foreground shadow-lg open:flex open:flex-col backdrop:bg-black/50',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [DIALOG_DERIVATIVES]`. */
export const DIALOG_DERIVATIVES = [AlertDialog, Sheet, Drawer] as const;
