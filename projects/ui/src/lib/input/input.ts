import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling only — form integration (Signal Forms) is a later, separate step.
 * State styling reads from attributes the platform already manages:
 * `disabled:` from the native attribute, `aria-invalid:` from the ARIA
 * state, so visual and accessible state cannot disagree.
 */
@Directive({
  selector: 'input[xnInput]',
  host: {
    'data-slot': 'input',
    '[class]': 'classes()',
  },
})
export class Input {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,border-color] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
      this.userClass(),
    ),
  );
}
