import { Component, computed, input, numberAttribute } from '@angular/core';

import { cn } from '../cn';

/**
 * Read-only star rating. The stars are decoration; the accessible truth is
 * the aria-label ("4 out of 5"), generated from the same inputs.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- attribute-selector component; the attribute carries the prefix
  selector: 'span[xnRating]',
  template: `
    @for (star of stars(); track $index) {
      <span aria-hidden="true" [class]="star ? 'text-foreground' : 'text-muted-foreground/40'"
        >★</span
      >
    }
  `,
  host: {
    'data-slot': 'rating',
    role: 'img',
    '[attr.aria-label]': 'label()',
    '[class]': 'classes()',
  },
})
export class Rating {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(5, { transform: numberAttribute });

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly stars = computed(() =>
    Array.from({ length: Math.max(1, this.max()) }, (_, i) => i < this.value()),
  );
  protected readonly label = computed(() => `${this.value()} out of ${this.max()}`);
  protected readonly classes = computed(() =>
    cn('inline-flex items-center gap-0.5 text-sm', this.userClass()),
  );
}
