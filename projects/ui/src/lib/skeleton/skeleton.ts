import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** A loading placeholder block; size and shape come from consumer classes. */
@Directive({
  selector: '[xnSkeleton]',
  host: {
    'data-slot': 'skeleton',
    '[class]': 'classes()',
  },
})
export class Skeleton {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn('animate-pulse rounded-md bg-accent', this.userClass()),
  );
}
