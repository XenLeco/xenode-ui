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
      'm-auto w-full max-w-md scale-95 gap-4 rounded-lg border bg-background p-6 text-foreground opacity-0 shadow-lg transition-[opacity,scale,display,overlay] transition-discrete duration-200 open:grid open:scale-100 open:opacity-100 backdrop:bg-black/50 starting:open:scale-95 starting:open:opacity-0',
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
      'm-0 h-dvh max-h-none w-full max-w-sm gap-4 bg-background p-6 text-foreground shadow-lg transition-[opacity,translate,display,overlay] transition-discrete duration-300 open:flex open:translate-x-0 open:flex-col backdrop:bg-black/50',
      this.side() === 'right'
        ? 'ml-auto translate-x-full border-l starting:open:translate-x-full'
        : 'mr-auto -translate-x-full border-r starting:open:-translate-x-full',
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
      'm-0 mt-auto max-h-[80dvh] w-full max-w-none translate-y-full gap-4 rounded-t-lg border-t bg-background p-6 text-foreground shadow-lg transition-[opacity,translate,display,overlay] transition-discrete duration-300 open:flex open:translate-y-0 open:flex-col backdrop:bg-black/50 starting:open:translate-y-full',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [DIALOG_DERIVATIVES]`. */
export const DIALOG_DERIVATIVES = [AlertDialog, Sheet, Drawer] as const;
