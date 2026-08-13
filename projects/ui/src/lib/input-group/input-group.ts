import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * An input with attached addons (prefixes/suffixes such as "https://" or a
 * unit). The addon is presentational; the input keeps its own label.
 *
 * ```html
 * <div xnInputGroup>
 *   <span xnInputAddon>https://</span>
 *   <input xnInput class="rounded-l-none" … />
 * </div>
 * ```
 */

@Directive({
  selector: '[xnInputGroup]',
  host: {
    'data-slot': 'input-group',
    '[class]': 'classes()',
  },
})
export class InputGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex w-full items-stretch', this.userClass()));
}

@Directive({
  selector: '[xnInputAddon]',
  host: {
    'data-slot': 'input-addon',
    '[class]': 'classes()',
  },
})
export class InputAddon {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground first:rounded-r-none first:border-r-0 last:rounded-l-none last:border-l-0',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [INPUT_GROUP]`. */
export const INPUT_GROUP = [InputGroup, InputAddon] as const;
