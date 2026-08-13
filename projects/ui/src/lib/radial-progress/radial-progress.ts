import { Component, computed, input, numberAttribute } from '@angular/core';

import { cn } from '../cn';

/**
 * Circular progress as inline SVG — the ring is stroke-dasharray math, the
 * accessible truth is role=progressbar + aria-value*. Content projects into
 * the center (typically the percentage as text).
 */
@Component({
  // The rule inspects the element part of the selector; the attribute is
  // what carries the xn prefix in an attribute-selector component.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[xnRadialProgress]',
  template: `
    <svg aria-hidden="true" class="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9155" fill="none" class="stroke-primary/20" stroke-width="3" />
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        class="stroke-primary transition-[stroke-dasharray]"
        stroke-width="3"
        stroke-linecap="round"
        [attr.stroke-dasharray]="percent() + ' 100'"
      />
    </svg>
    <ng-content />
  `,
  host: {
    'data-slot': 'radial-progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'clamped()',
    '[class]': 'classes()',
  },
})
export class RadialProgress {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly clamped = computed(() =>
    Math.min(Math.max(0, this.value()), Math.max(1, this.max())),
  );
  protected readonly percent = computed(() => (this.clamped() / Math.max(1, this.max())) * 100);

  protected readonly classes = computed(() =>
    cn(
      'relative inline-flex size-16 items-center justify-center text-sm font-medium tabular-nums',
      this.userClass(),
    ),
  );
}
