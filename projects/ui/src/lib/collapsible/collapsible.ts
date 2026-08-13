import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Native <details>/<summary>: toggle behavior, keyboard support and state
 * announcement come from the platform. The `group` class on the details
 * element lets the trigger's chevron rotate via group-open:.
 *
 * For a single disclosure this beats the aria accordion — reach for the
 * accordion only when items must coordinate.
 */

@Directive({
  selector: 'details[xnCollapsible]',
  host: {
    'data-slot': 'collapsible',
    '[class]': 'classes()',
  },
})
export class Collapsible {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('group w-full', this.userClass()));
}

@Directive({
  selector: 'summary[xnCollapsibleTrigger]',
  host: {
    'data-slot': 'collapsible-trigger',
    '[class]': 'classes()',
  },
})
export class CollapsibleTrigger {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden [&>[data-chevron]]:transition-transform group-open:[&>[data-chevron]]:rotate-180',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [COLLAPSIBLE]`. */
export const COLLAPSIBLE = [Collapsible, CollapsibleTrigger] as const;
