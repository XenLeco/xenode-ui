import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Restricted to the native <label> element on purpose: association with a
 * control (via `for` or nesting) is the label's entire accessibility
 * function, and only the real element provides it.
 */
@Directive({
  selector: 'label[xnLabel]',
  host: {
    'data-slot': 'label',
    '[class]': 'classes()',
  },
})
export class Label {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'flex select-none items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.userClass(),
    ),
  );
}
