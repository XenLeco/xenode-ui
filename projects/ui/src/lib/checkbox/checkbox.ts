import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Native checkbox, token-colored via accent-color — semantics, keyboard,
 * indeterminate state and form participation all stay the platform's.
 * Revisit with appearance-none only if the brand demands a custom glyph.
 */
@Directive({
  selector: 'input[type="checkbox"][xnCheckbox]',
  host: {
    'data-slot': 'checkbox',
    '[class]': 'classes()',
  },
})
export class Checkbox {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass(),
    ),
  );
}
