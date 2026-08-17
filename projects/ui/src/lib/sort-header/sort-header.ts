import { Directive, computed, inject, input, model } from '@angular/core';

import { cn } from '../cn';

export type SortDirection = 'none' | 'ascending' | 'descending';

/**
 * Sortable column header for the table family. The th owns `aria-sort`
 * (emitted only while a direction is active — ARIA 1.2 wants one sorted
 * header at a time); the inner native button owns activation — a th
 * cannot receive focus, and Enter/Space come free with the platform
 * (rule 1: keys are never hand-rolled).
 *
 * ```html
 * <th xnSortHeader [(direction)]="nameSort">
 *   <button xnSortButton>Name</button>
 * </th>
 * ```
 *
 * Activation cycles none → ascending → descending → none, matching the
 * reference implementations: the unsorted order stays reachable. The
 * consumer two-way binds `[(direction)]` and sorts its own data. The
 * button shows the direction visually (↕/↑/↓ via CSS) — aria-sort alone
 * would leave sighted users guessing.
 */
@Directive({
  selector: 'th[xnSortHeader]',
  exportAs: 'xnSortHeader',
  host: {
    'data-slot': 'sort-header',
    scope: 'col',
    '[attr.aria-sort]': "direction() === 'none' ? null : direction()",
    '[class]': 'classes()',
  },
})
export class SortHeader {
  readonly direction = model<SortDirection>('none');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
      this.userClass(),
    ),
  );

  cycle(): void {
    const next: Record<SortDirection, SortDirection> = {
      none: 'ascending',
      ascending: 'descending',
      descending: 'none',
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
  protected readonly header = (() => {
    const header = inject(SortHeader, { optional: true });
    if (!header) {
      throw new Error('button[xnSortButton] must be placed inside a th[xnSortHeader].');
    }
    return header;
  })();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      // The ↕/↑/↓ glyph is the visible sort state (aria-hidden by nature
      // of ::after); in-aria-* reads the ancestor th's attribute.
      "inline-flex cursor-pointer items-center gap-1 font-medium select-none after:text-xs after:text-muted-foreground after:content-['↕'] hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring in-aria-[sort=ascending]:underline in-aria-[sort=ascending]:after:content-['↑'] in-aria-[sort=descending]:underline in-aria-[sort=descending]:after:content-['↓']",
      this.userClass(),
    ),
  );
}
