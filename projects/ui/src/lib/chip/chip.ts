import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A pill wrapping a native checkbox: the checkbox IS the state — same
 * precedent as Segmented's radios — so keyboard, form participation and
 * the checked announcement all stay the platform's. `:has(:checked)`
 * drives the selected look; the check glyph is CSS alt text
 * (`content: '✓' / ''`) so it never joins the label's accessible name —
 * the wrapped checkbox's own checked state is already what assistive tech
 * reports, and a glyph folded into the name would double it up.
 *
 * ```html
 * <label xnChip><input type="checkbox" checked /> Roguelike</label>
 * ```
 */
@Directive({
  selector: 'label[xnChip]',
  host: { 'data-slot': 'chip', '[class]': 'classes()' },
})
export class Chip {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      "inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground transition-[color,background-color,border-color] select-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring has-checked:border-transparent has-checked:bg-primary has-checked:text-primary-foreground has-checked:after:text-xs has-checked:after:[content:'✓'_/_''] has-disabled:cursor-not-allowed has-disabled:opacity-50 [&>input]:sr-only",
      this.userClass(),
    ),
  );
}
