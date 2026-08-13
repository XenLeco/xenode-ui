import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling for the native <select>. The dropdown arrow and option list stay
 * the platform's (dark-aware via color-scheme); a custom listbox select is
 * a separate, @angular/aria-based component when a page needs one.
 */
@Directive({
  selector: 'select[xnNativeSelect]',
  host: {
    'data-slot': 'native-select',
    '[class]': 'classes()',
  },
})
export class NativeSelect {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-9 w-full min-w-0 cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
      this.userClass(),
    ),
  );
}
