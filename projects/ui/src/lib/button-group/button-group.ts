import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Joins adjacent buttons into one visual unit: inner corners squared,
 * borders collapsed. Semantically just role=group — each button keeps its
 * own accessible identity.
 */
@Directive({
  selector: '[xnButtonGroup]',
  host: {
    'data-slot': 'button-group',
    role: 'group',
    '[class]': 'classes()',
  },
})
export class ButtonGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      // The relative + focus-within z-lift keeps a focused button's ring
      // above the -ml-px neighbor that would otherwise paint over it —
      // the same mechanism Join uses.
      'inline-flex items-center [&>button]:relative [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:first-child)]:-ml-px [&>button:focus-within]:z-10',
      this.userClass(),
    ),
  );
}
