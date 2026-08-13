import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Pagination as navigation: a nav landmark of links. The current page
 * carries aria-current="page" (consumer's job) and is styled from that
 * attribute — accessible state and visual state cannot disagree.
 */

@Directive({
  selector: 'nav[xnPagination]',
  host: {
    'data-slot': 'pagination',
    'aria-label': 'pagination',
    '[class]': 'classes()',
  },
})
export class Pagination {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('mx-auto flex w-full justify-center', this.userClass()),
  );
}

@Directive({
  selector: 'ul[xnPaginationList]',
  host: {
    'data-slot': 'pagination-list',
    '[class]': 'classes()',
  },
})
export class PaginationList {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-row items-center gap-1', this.userClass()),
  );
}

@Directive({
  selector: 'a[xnPaginationLink]',
  host: {
    'data-slot': 'pagination-link',
    '[class]': 'classes()',
  },
})
export class PaginationLink {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:border aria-[current=page]:border-input',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [PAGINATION]`. */
export const PAGINATION = [Pagination, PaginationList, PaginationLink] as const;
