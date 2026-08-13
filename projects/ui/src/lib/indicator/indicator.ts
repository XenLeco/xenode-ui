import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Positions a badge/marker on a corner of its wrapped content:
 * `<span xnIndicator><span xnIndicatorItem>3</span><button …/></span>`
 */

@Directive({
  selector: '[xnIndicator]',
  host: { 'data-slot': 'indicator', '[class]': 'classes()' },
})
export class Indicator {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative inline-flex w-fit', this.userClass()));
}

@Directive({
  selector: '[xnIndicatorItem]',
  host: { 'data-slot': 'indicator-item', '[class]': 'classes()' },
})
export class IndicatorItem {
  readonly position = input<'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'>('top-end');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute z-10',
      {
        'top-end': '-top-1.5 -right-1.5',
        'top-start': '-top-1.5 -left-1.5',
        'bottom-end': '-bottom-1.5 -right-1.5',
        'bottom-start': '-bottom-1.5 -left-1.5',
      }[this.position()],
      this.userClass(),
    ),
  );
}

export const INDICATOR = [Indicator, IndicatorItem] as const;
