import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Constrains children to a ratio via the CSS aspect-ratio property.
 * `<div xnAspectRatio ratio="16 / 9">…</div>`
 */
@Directive({
  selector: '[xnAspectRatio]',
  host: {
    'data-slot': 'aspect-ratio',
    '[style.aspect-ratio]': 'ratio()',
    '[class]': 'classes()',
  },
})
export class AspectRatio {
  readonly ratio = input('16 / 9');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('relative w-full overflow-hidden', this.userClass()),
  );
}
