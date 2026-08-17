import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Pins its content to a viewport (or nearest positioned ancestor) corner.
 * `inset` is a raw CSS length rather than a Tailwind step because Tailwind
 * only emits classes it finds whole in source — an interpolated arbitrary
 * value would be invisible to the scanner — so the two offsets go through
 * `[style.*]` bindings instead, the same escape hatch xnColorSwatch uses
 * for its genuinely dynamic color.
 */
@Directive({
  selector: '[xnAffix]',
  host: {
    'data-slot': 'affix',
    '[class]': 'classes()',
    '[style.top]': 'top()',
    '[style.bottom]': 'bottom()',
    '[style.left]': 'left()',
    '[style.right]': 'right()',
  },
})
export class Affix {
  readonly corner = input<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(
    'bottom-right',
  );
  /** 'fixed' pins to the viewport; 'absolute' pins to the nearest positioned ancestor. */
  readonly position = input<'fixed' | 'absolute'>('fixed');
  readonly inset = input('1rem');

  protected readonly top = computed(() => (this.corner().startsWith('top') ? this.inset() : null));
  protected readonly bottom = computed(() =>
    this.corner().startsWith('bottom') ? this.inset() : null,
  );
  protected readonly left = computed(() => (this.corner().endsWith('left') ? this.inset() : null));
  protected readonly right = computed(() =>
    this.corner().endsWith('right') ? this.inset() : null,
  );

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('z-40', this.position() === 'fixed' ? 'fixed' : 'absolute', this.userClass()),
  );
}
