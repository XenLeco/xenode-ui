import { Directive, computed, input, model } from '@angular/core';

import { cn } from '../cn';

export type SortDirection = 'none' | 'ascending' | 'descending';

/**
 * Sortable column header for the table family. Clicking cycles
 * none → ascending → descending; aria-sort always reflects the state and
 * the consumer two-way binds `[(direction)]` and sorts its own data.
 */
@Directive({
  selector: 'th[xnSortHeader]',
  host: {
    'data-slot': 'sort-header',
    scope: 'col',
    '[attr.aria-sort]': 'direction()',
    '(click)': 'cycle()',
    '[class]': 'classes()',
  },
})
export class SortHeader {
  readonly direction = model<SortDirection>('none');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-10 cursor-pointer px-2 text-left align-middle font-medium whitespace-nowrap text-foreground select-none hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[sort=ascending]:underline aria-[sort=descending]:underline',
      this.userClass(),
    ),
  );

  protected cycle(): void {
    const next: Record<SortDirection, SortDirection> = {
      none: 'ascending',
      ascending: 'descending',
      descending: 'ascending',
    };
    this.direction.set(next[this.direction()]);
  }
}
