import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Breadcrumb navigation. The nav landmark carries aria-label="breadcrumb";
 * the current page carries aria-current="page" instead of being a link;
 * separators are presentational and hidden from assistive tech.
 */

@Directive({
  selector: 'nav[xnBreadcrumb]',
  host: {
    'data-slot': 'breadcrumb',
    'aria-label': 'breadcrumb',
  },
})
export class Breadcrumb {}

@Directive({
  selector: 'ol[xnBreadcrumbList]',
  host: {
    'data-slot': 'breadcrumb-list',
    '[class]': 'classes()',
  },
})
export class BreadcrumbList {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'li[xnBreadcrumbItem]',
  host: {
    'data-slot': 'breadcrumb-item',
    '[class]': 'classes()',
  },
})
export class BreadcrumbItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('inline-flex items-center gap-1.5', this.userClass()),
  );
}

@Directive({
  selector: 'a[xnBreadcrumbLink]',
  host: {
    'data-slot': 'breadcrumb-link',
    '[class]': 'classes()',
  },
})
export class BreadcrumbLink {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('transition-[color] hover:text-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'span[xnBreadcrumbPage]',
  host: {
    'data-slot': 'breadcrumb-page',
    'aria-current': 'page',
    '[class]': 'classes()',
  },
})
export class BreadcrumbPage {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('font-normal text-foreground', this.userClass()));
}

@Directive({
  selector: 'li[xnBreadcrumbSeparator]',
  host: {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
})
export class BreadcrumbSeparator {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('[&>svg]:size-3.5', this.userClass()));
}

/** Convenience for `imports: [BREADCRUMB]` — the whole family. */
export const BREADCRUMB = [
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
] as const;
