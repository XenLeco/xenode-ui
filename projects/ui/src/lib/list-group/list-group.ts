import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Bordered stacked list (Bootstrap's list-group). Active via aria-current. */

@Directive({
  selector: 'ul[xnListGroup]',
  host: { 'data-slot': 'list-group', '[class]': 'classes()' },
})
export class ListGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex w-full flex-col overflow-hidden rounded-lg border', this.userClass()),
  );
}

@Directive({
  selector: '[xnListGroupItem]',
  host: { 'data-slot': 'list-group-item', '[class]': 'classes()' },
})
export class ListGroupItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'block w-full border-b px-4 py-2.5 text-left text-sm last:border-b-0 aria-[current]:bg-secondary aria-[current]:font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50 [&:is(a,button)]:cursor-pointer [&:is(a,button)]:transition-[background-color] [&:is(a,button)]:hover:bg-muted [&:is(a,button)]:focus-visible:outline-2 [&:is(a,button)]:focus-visible:-outline-offset-2 [&:is(a,button)]:focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

export const LIST_GROUP = [ListGroup, ListGroupItem] as const;
