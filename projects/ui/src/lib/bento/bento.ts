import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Bento grid: a mosaic of mixed-size tiles. The grid owns rhythm; tiles
 * pick a footprint via `size` and lift subtly on hover. Pair tiles with
 * animate-rise + staggered [animation-delay] for the entrance.
 */

@Directive({ selector: '[xnBento]', host: { 'data-slot': 'bento', '[class]': 'classes()' } })
export class Bento {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('grid auto-rows-[minmax(7rem,auto)] grid-cols-2 gap-4 lg:grid-cols-4', this.userClass()),
  );
}

@Directive({ selector: '[xnBentoItem]', host: { 'data-slot': 'bento-item', '[class]': 'classes()' } })
export class BentoItem {
  readonly size = input<'sm' | 'wide' | 'tall' | 'large'>('sm');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-col justify-between gap-2 overflow-hidden rounded-xl border bg-card p-5 text-card-foreground transition-[border-color,translate] ease-snappy hover:-translate-y-0.5 hover:border-ring',
      {
        sm: '',
        wide: 'col-span-2',
        tall: 'row-span-2',
        large: 'col-span-2 row-span-2',
      }[this.size()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnBentoTitle]',
  host: { 'data-slot': 'bento-title', '[class]': 'classes()' },
})
export class BentoTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm font-semibold tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[xnBentoDescription]',
  host: { 'data-slot': 'bento-description', '[class]': 'classes()' },
})
export class BentoDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.userClass()));
}

/** Convenience for `imports: [BENTO]`. */
export const BENTO = [Bento, BentoItem, BentoTitle, BentoDescription] as const;
