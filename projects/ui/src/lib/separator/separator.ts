import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A decorative divider. role="none" keeps it out of the accessibility tree —
 * if a separator ever carries meaning, that page should use a native <hr>.
 */
@Directive({
  selector: '[xnSeparator]',
  host: {
    'data-slot': 'separator',
    role: 'none',
    '[class]': 'classes()',
  },
})
export class Separator {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      this.userClass(),
    ),
  );
}
