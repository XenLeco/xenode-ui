import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Native radios in a fieldset. Grouping semantics come from the shared
 * `name` attribute (consumer's job); the fieldset+legend give the group its
 * accessible name.
 */

@Directive({
  selector: 'fieldset[xnRadioGroup]',
  host: {
    'data-slot': 'radio-group',
    '[class]': 'classes()',
  },
})
export class RadioGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('m-0 grid gap-2 border-0 p-0', this.userClass()));
}

@Directive({
  selector: 'input[type="radio"][xnRadio]',
  host: {
    'data-slot': 'radio',
    '[class]': 'classes()',
  },
})
export class Radio {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [RADIO_GROUP]`. */
export const RADIO_GROUP = [RadioGroup, Radio] as const;
