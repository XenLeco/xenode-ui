import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Mirrors Input's contract on the native <textarea>. Styling only. */
@Directive({
  selector: 'textarea[xnTextarea]',
  host: {
    'data-slot': 'textarea',
    '[class]': 'classes()',
  },
})
export class Textarea {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm transition-[color,border-color] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
      this.userClass(),
    ),
  );
}
