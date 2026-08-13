import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A switch is the one control that genuinely needs appearance-none — there
 * is no native switch rendering. Underneath it stays a real checkbox
 * (keyboard, forms, checked state all native); role="switch" corrects the
 * announcement, and the thumb is a before: pseudo-element that translates
 * on :checked.
 */
@Directive({
  selector: 'input[type="checkbox"][xnSwitch]',
  host: {
    'data-slot': 'switch',
    role: 'switch',
    '[class]': 'classes()',
  },
})
export class Switch {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      "relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-input transition-[background-color] before:absolute before:top-0.5 before:left-0.5 before:size-4 before:rounded-full before:bg-background before:transition-transform before:content-[''] checked:bg-primary checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
      this.userClass(),
    ),
  );
}
