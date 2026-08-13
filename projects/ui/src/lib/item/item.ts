import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** The classic media-object list item: media | content | actions. */

@Directive({ selector: '[xnItem]', host: { 'data-slot': 'item', '[class]': 'classes()' } })
export class Item {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex w-full items-center gap-3 rounded-md p-2', this.userClass()),
  );
}

@Directive({
  selector: '[xnItemMedia]',
  host: { 'data-slot': 'item-media', '[class]': 'classes()' },
})
export class ItemMedia {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('shrink-0', this.userClass()));
}

@Directive({
  selector: '[xnItemContent]',
  host: { 'data-slot': 'item-content', '[class]': 'classes()' },
})
export class ItemContent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-1 flex-col gap-0.5', this.userClass()),
  );
}

@Directive({
  selector: '[xnItemTitle]',
  host: { 'data-slot': 'item-title', '[class]': 'classes()' },
})
export class ItemTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('truncate text-sm font-medium', this.userClass()));
}

@Directive({
  selector: '[xnItemDescription]',
  host: { 'data-slot': 'item-description', '[class]': 'classes()' },
})
export class ItemDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('truncate text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnItemActions]',
  host: { 'data-slot': 'item-actions', '[class]': 'classes()' },
})
export class ItemActions {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex shrink-0 items-center gap-2', this.userClass()),
  );
}

export const ITEM = [
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
] as const;
