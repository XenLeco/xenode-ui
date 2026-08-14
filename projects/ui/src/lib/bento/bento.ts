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
    cn('grid auto-rows-[minmax(8rem,auto)] grid-cols-2 gap-4 lg:grid-cols-4', this.userClass()),
  );
}

@Directive({
  selector: '[xnBentoItem]',
  host: { 'data-slot': 'bento-item', '[class]': 'classes()' },
})
export class BentoItem {
  readonly size = input<'sm' | 'wide' | 'tall' | 'large' | 'hero'>('sm');
  readonly tone = input<'default' | 'glass' | 'gradient' | 'glow'>('default');

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
        hero: 'col-span-2 row-span-2 lg:col-span-4',
      }[this.size()],
      // Same blend vocabulary as Surface, bento-tuned: tone replaces the
      // card skin via cn conflict resolution within this single call.
      {
        default: '',
        glass: 'border-foreground/10 bg-foreground/5 backdrop-blur-md',
        // bg-transparent is load-bearing: tailwind-merge treats bg-card
        // (color) and bg-linear-* (image) as different groups, so the
        // gradient alone would layer over bg-card instead of replacing it.
        gradient:
          'border-transparent bg-transparent bg-linear-to-br from-gradient-from to-gradient-to text-gradient-foreground hover:border-transparent [&_[data-slot$=description]]:text-gradient-foreground/75',
        glow: 'border-ring/50 shadow-[0_0_32px_-8px_var(--ring)]',
      }[this.tone()],
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
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

/** Convenience for `imports: [BENTO]`. */
export const BENTO = [Bento, BentoItem, BentoTitle, BentoDescription] as const;
