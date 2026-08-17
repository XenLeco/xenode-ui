import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Visually joins adjacent controls into one unit — buttons, inputs,
 * selects, or a mix of them — by squaring the inner corners and collapsing
 * shared borders (the daisyUI join pattern). Purely a styling container:
 * each child keeps its own element semantics, so there is no group role to
 * impose here. `:focus-within` (not `:focus-visible`) lifts a child's
 * z-index so its own border/ring never gets clipped under a neighbor,
 * whether the child is focused directly or wraps a focused descendant.
 */
@Directive({ selector: '[xnJoin]', host: { 'data-slot': 'join', '[class]': 'classes()' } })
export class Join {
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex [&>*]:relative [&>*]:rounded-none [&>*:focus-within]:z-10',
      this.direction() === 'vertical'
        ? 'flex-col [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:not(:first-child)]:-mt-px'
        : '[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:not(:first-child)]:-ml-px',
      this.userClass(),
    ),
  );
}
