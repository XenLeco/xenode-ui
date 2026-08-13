import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A border-spin loading indicator. role="status" announces it; give it an
 * aria-label ("Loading projects") — motion alone is not information.
 */
@Directive({
  selector: '[xnSpinner]',
  host: {
    'data-slot': 'spinner',
    role: 'status',
    '[class]': 'classes()',
  },
})
export class Spinner {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
      this.userClass(),
    ),
  );
}
