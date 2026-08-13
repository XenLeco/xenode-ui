import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A segmented control on NATIVE radios: each option is a label wrapping a
 * visually-hidden radio, and the selected look comes from the CSS
 * :has(:checked) state — arrow keys, form participation and announcement
 * all stay the platform's.
 *
 * ```html
 * <fieldset xnSegmented>
 *   <legend class="sr-only">View</legend>
 *   <label xnSegmentedOption><input type="radio" name="view" checked /> List</label>
 *   <label xnSegmentedOption><input type="radio" name="view" /> Grid</label>
 * </fieldset>
 * ```
 */

@Directive({
  selector: 'fieldset[xnSegmented]',
  host: { 'data-slot': 'segmented', '[class]': 'classes()' },
})
export class Segmented {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'm-0 inline-flex w-fit items-center gap-1 rounded-lg border-0 bg-muted p-1',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'label[xnSegmentedOption]',
  host: { 'data-slot': 'segmented-option', '[class]': 'classes()' },
})
export class SegmentedOption {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-[color,background-color] select-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring has-checked:bg-background has-checked:text-foreground [&>input]:sr-only',
      this.userClass(),
    ),
  );
}

export const SEGMENTED = [Segmented, SegmentedOption] as const;
