import { Component, computed, input, numberAttribute } from '@angular/core';

import { cn } from '../cn';

const GLYPHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * An odometer-style digit readout: each digit is a strip of 0-9 that
 * translates a whole row height (100% of its own box, so no magic em
 * number needs to track the font's line box) to reveal the current value.
 * The strips are decoration — aria-hidden — and the host carries the real
 * number as sr-only text so assistive tech reads one number, not ten
 * spinning columns. No bespoke reduced-motion handling: the theme already
 * collapses every transition globally, so the strips just snap instead of
 * rolling — adding a `motion-reduce:` override here would only fight it.
 *
 * Digit strips model non-negative integers only; fractional or negative
 * input is rounded/clamped rather than silently mis-rendered.
 */
@Component({
  selector: 'xn-rolling-number',
  template: `
    <span aria-hidden="true" class="inline-flex">
      @for (digit of digits(); track $index) {
        <span
          data-slot="rolling-number-digit"
          class="relative inline-block h-[1em] w-[0.6em] overflow-hidden leading-none"
        >
          <span
            class="absolute inset-x-0 top-0 transition-transform duration-500 ease-out-expo"
            [style.transform]="'translateY(-' + digit * 10 + '%)'"
          >
            @for (glyph of glyphs; track glyph) {
              <span class="flex h-[1em] items-center justify-center leading-none">{{ glyph }}</span>
            }
          </span>
        </span>
      }
    </span>
    <span class="sr-only">{{ value() }}</span>
  `,
  host: {
    'data-slot': 'rolling-number',
    '[class]': 'classes()',
  },
})
export class RollingNumber {
  readonly value = input(0, { transform: numberAttribute });

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly glyphs = GLYPHS;

  protected readonly digits = computed(() =>
    String(Math.max(0, Math.round(this.value())))
      .split('')
      .map(Number),
  );

  protected readonly classes = computed(() =>
    cn('inline-flex items-center font-semibold tabular-nums', this.userClass()),
  );
}
