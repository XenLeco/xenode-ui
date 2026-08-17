import { Component, computed, input, numberAttribute } from '@angular/core';

import { cn } from '../cn';

/**
 * Circular progress as inline SVG — the ring is stroke-dasharray math, the
 * accessible truth is role=progressbar + aria-value*. Content projects into
 * the center (typically the percentage as text).
 *
 * `arc="semi"` reuses the same r=15.9155 circle (circumference ≈100, the
 * standard shadcn trick) but only reveals its top half: the value arc's
 * dasharray is halved so 100% covers 50 units instead of 100, the track
 * gets its own 50/100 dasharray so only a half-ring ever draws, the sweep
 * starts at 9 o'clock instead of 12 (rotate-180 vs -rotate-90), and the
 * host crops to a half-height box (overflow-hidden) instead of a square.
 */
@Component({
  // The rule inspects the element part of the selector; the attribute is
  // what carries the xn prefix in an attribute-selector component.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[xnRadialProgress]',
  template: `
    <svg aria-hidden="true" [class]="svgClasses()" viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        class="stroke-primary/20"
        stroke-width="3"
        [attr.stroke-dasharray]="arc() === 'semi' ? '50 100' : null"
      />
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        class="stroke-primary transition-[stroke-dasharray]"
        stroke-width="3"
        stroke-linecap="round"
        [attr.stroke-dasharray]="arcLength() + ' 100'"
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
  readonly arc = input<'full' | 'semi'>('full');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly clamped = computed(() =>
    Math.min(Math.max(0, this.value()), Math.max(1, this.max())),
  );
  protected readonly percent = computed(() => (this.clamped() / Math.max(1, this.max())) * 100);
  // Semi draws over half the circumference, so 100% is 50 units, not 100.
  protected readonly arcLength = computed(() =>
    this.arc() === 'semi' ? this.percent() / 2 : this.percent(),
  );

  protected readonly svgClasses = computed(() =>
    cn(
      'absolute',
      this.arc() === 'semi' ? 'top-0 left-0 size-16 rotate-180' : 'inset-0 -rotate-90',
    ),
  );

  protected readonly classes = computed(() =>
    cn(
      'relative inline-flex justify-center text-sm font-medium tabular-nums',
      this.arc() === 'semi' ? 'h-8 w-16 items-end overflow-hidden' : 'size-16 items-center',
      this.userClass(),
    ),
  );
}
