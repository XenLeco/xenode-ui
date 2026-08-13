import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Styling for the native <kbd> element — keyboard hints. */
@Directive({
  selector: 'kbd[xnKbd]',
  host: {
    'data-slot': 'kbd',
    '[class]': 'classes()',
  },
})
export class Kbd {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground',
      this.userClass(),
    ),
  );
}
