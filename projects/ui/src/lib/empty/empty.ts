import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Empty-state block: dashed frame, centered title + description slots. */

@Directive({
  selector: '[xnEmpty]',
  host: {
    'data-slot': 'empty',
    '[class]': 'classes()',
  },
})
export class Empty {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-8 text-center',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnEmptyTitle]',
  host: {
    'data-slot': 'empty-title',
    '[class]': 'classes()',
  },
})
export class EmptyTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm font-medium', this.userClass()));
}

@Directive({
  selector: '[xnEmptyDescription]',
  host: {
    'data-slot': 'empty-description',
    '[class]': 'classes()',
  },
})
export class EmptyDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

/** Convenience for `imports: [EMPTY]`. */
export const EMPTY = [Empty, EmptyTitle, EmptyDescription] as const;
