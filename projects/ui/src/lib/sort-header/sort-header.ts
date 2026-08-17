import { Directive, computed, inject, input, model } from '@angular/core';

import { cn } from '../cn';

export type SortDirection = 'none' | 'ascending' | 'descending';

/**
 * Sortable column header for the table family. The th owns `aria-sort`
 * (where the spec requires it); the inner native button owns activation —
 * a th cannot receive focus, and Enter/Space come free with the platform
 * (rule 1: keys are never hand-rolled).
 *
 * ```html
 * <th xnSortHeader [(direction)]="nameSort">
 *   <button xnSortButton>Name</button>
 * </th>
 * ```
 *
 * The consumer two-way binds `[(direction)]` and sorts its own data.
 */
@Directive({
  selector: 'th[xnSortHeader]',
  exportAs: 'xnSortHeader',
  host: {
    'data-slot': 'sort-header',
    scope: 'col',
    '[attr.aria-sort]': 'direction()',
    '[class]': 'classes()',
  },
})
export class SortHeader {
  readonly direction = model<SortDirection>('none');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground aria-[sort=ascending]:underline aria-[sort=descending]:underline',
      this.userClass(),
    ),
  );

  cycle(): void {
    const next: Record<SortDirection, SortDirection> = {
      none: 'ascending',
      ascending: 'descending',
      descending: 'ascending',
    };
    this.direction.set(next[this.direction()]);
  }
}

/** The activation half: wires itself to the ancestor header via DI. */
@Directive({
  selector: 'button[xnSortButton]',
  host: {
    'data-slot': 'sort-button',
    type: 'button',
    '(click)': 'header.cycle()',
    '[class]': 'classes()',
  },
})
export class SortButton {
  protected readonly header = inject(SortHeader);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center gap-1 font-medium select-none hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}
