import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * The card family: six styling directives composed in the consumer's
 * template. Attribute selectors on purpose — the consumer chooses the
 * element, so a card title can be an h2 or h3 matching the page's heading
 * outline. No variants: cards have slots, not variants.
 */

@Directive({
  selector: '[xnCard]',
  host: {
    'data-slot': 'card',
    '[class]': 'classes()',
  },
})
export class Card {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-6 rounded-lg border bg-card py-6 text-card-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnCardHeader]',
  host: {
    'data-slot': 'card-header',
    '[class]': 'classes()',
  },
})
export class CardHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-1.5 px-6', this.userClass()));
}

@Directive({
  selector: '[xnCardTitle]',
  host: {
    'data-slot': 'card-title',
    '[class]': 'classes()',
  },
})
export class CardTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-lg leading-none font-semibold', this.userClass()),
  );
}

@Directive({
  selector: '[xnCardDescription]',
  host: {
    'data-slot': 'card-description',
    '[class]': 'classes()',
  },
})
export class CardDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnCardContent]',
  host: {
    'data-slot': 'card-content',
    '[class]': 'classes()',
  },
})
export class CardContent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('px-6', this.userClass()));
}

@Directive({
  selector: '[xnCardFooter]',
  host: {
    'data-slot': 'card-footer',
    '[class]': 'classes()',
  },
})
export class CardFooter {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-center px-6', this.userClass()));
}

/** Convenience for `imports: [CARD]` — the whole family at once. */
export const CARD = [
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
] as const;
