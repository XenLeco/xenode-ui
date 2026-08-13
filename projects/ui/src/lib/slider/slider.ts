import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Native range input: keyboard (arrows, Home/End), aria-valuenow and form
 * participation for free. Only the track/thumb pixels are ours, via the
 * vendor pseudo-element arbitrary variants.
 */
@Directive({
  selector: 'input[type="range"][xnSlider]',
  host: {
    'data-slot': 'slider',
    '[class]': 'classes()',
  },
})
export class Slider {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary',
      this.userClass(),
    ),
  );
}
