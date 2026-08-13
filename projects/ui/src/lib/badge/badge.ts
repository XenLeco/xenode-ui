import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';
import { badgeVariants, type BadgeVariants } from './badge-variants';

/**
 * A directive on a native <span>: a badge is inline text metadata, not a
 * control, so there is nothing interactive to wrap.
 */
@Directive({
  selector: 'span[xnBadge]',
  host: {
    'data-slot': 'badge',
    '[class]': 'classes()',
  },
})
export class Badge {
  readonly variant = input<BadgeVariants['variant']>('default');

  // The consumer writes natural HTML (`class="..."`); the alias captures it
  // so it can be merged last and win conflicts.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(badgeVariants({ variant: this.variant() }), this.userClass()),
  );
}
