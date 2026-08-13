import { Component, computed, input, numberAttribute } from '@angular/core';

import { cn } from '../cn';

/**
 * The library's first component rather than directive: a progress bar OWNS
 * internal structure (the moving indicator), which is rule 5's exception.
 * The attribute selector still keeps the consumer's native <div>.
 *
 * role="progressbar" + aria-value* carry the state; the consumer must add
 * an aria-label (or aria-labelledby) naming what is progressing.
 */
@Component({
  // The rule inspects the element part of the selector; the attribute is
  // what carries the xn prefix in an attribute-selector component.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div[xnProgress]',
  template: `
    <div
      data-slot="progress-indicator"
      class="h-full w-full flex-1 transition-transform"
      [class]="indicatorClass()"
      [style.transform]="'translateX(-' + (100 - percent()) + '%)'"
    ></div>
  `,
  host: {
    'data-slot': 'progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'clamped()',
    '[class]': 'classes()',
  },
})
export class Progress {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly variant = input<'default' | 'success' | 'warning' | 'destructive'>('default');

  protected readonly indicatorClass = computed(
    () =>
      ({
        default: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        destructive: 'bg-destructive',
      })[this.variant()],
  );

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly clamped = computed(() =>
    Math.min(Math.max(0, this.value()), Math.max(1, this.max())),
  );
  protected readonly percent = computed(() => (this.clamped() / Math.max(1, this.max())) * 100);

  protected readonly classes = computed(() =>
    cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', this.userClass()),
  );
}
