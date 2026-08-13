import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling for native table elements. The container provides horizontal
 * scrolling so a wide table never scrolls the page. Semantics stay entirely
 * native — the directives add classes and data-slots, nothing else.
 */

@Directive({
  selector: '[xnTableContainer]',
  host: {
    'data-slot': 'table-container',
    '[class]': 'classes()',
  },
})
export class TableContainer {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('relative w-full overflow-x-auto', this.userClass()),
  );
}

@Directive({
  selector: 'table[xnTable]',
  host: {
    'data-slot': 'table',
    '[class]': 'classes()',
  },
})
export class Table {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('w-full caption-bottom text-sm', this.userClass()),
  );
}

@Directive({
  selector: 'thead[xnTableHeader]',
  host: {
    'data-slot': 'table-header',
    '[class]': 'classes()',
  },
})
export class TableHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('[&_tr]:border-b', this.userClass()));
}

@Directive({
  selector: 'tbody[xnTableBody]',
  host: {
    'data-slot': 'table-body',
    '[class]': 'classes()',
  },
})
export class TableBody {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('[&_tr:last-child]:border-0', this.userClass()));
}

@Directive({
  selector: 'tfoot[xnTableFooter]',
  host: {
    'data-slot': 'table-footer',
    '[class]': 'classes()',
  },
})
export class TableFooter {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', this.userClass()),
  );
}

@Directive({
  selector: 'tr[xnTableRow]',
  host: {
    'data-slot': 'table-row',
    '[class]': 'classes()',
  },
})
export class TableRow {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('border-b transition-[background-color] hover:bg-muted/50', this.userClass()),
  );
}

@Directive({
  selector: 'th[xnTableHead]',
  host: {
    'data-slot': 'table-head',
    '[class]': 'classes()',
  },
})
export class TableHead {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'td[xnTableCell]',
  host: {
    'data-slot': 'table-cell',
    '[class]': 'classes()',
  },
})
export class TableCell {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('whitespace-nowrap p-2 align-middle', this.userClass()),
  );
}

@Directive({
  selector: 'caption[xnTableCaption]',
  host: {
    'data-slot': 'table-caption',
    '[class]': 'classes()',
  },
})
export class TableCaption {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('mt-4 text-sm text-muted-foreground', this.userClass()),
  );
}

/** Convenience for `imports: [TABLE]` — the whole family. */
export const TABLE = [
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
] as const;
