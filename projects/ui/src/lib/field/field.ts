import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Layout for one form field: label + control + description/error. The aria
 * wiring stays explicit in the consumer's template (for/id,
 * aria-describedby, aria-invalid) — this family only arranges and colors.
 * Error text uses --danger, the text-tuned destructive pair.
 */

@Directive({
  selector: '[xnField]',
  host: {
    'data-slot': 'field',
    '[class]': 'classes()',
  },
})
export class Field {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('grid gap-2', this.userClass()));
}

@Directive({
  selector: '[xnFieldDescription]',
  host: {
    'data-slot': 'field-description',
    '[class]': 'classes()',
  },
})
export class FieldDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnFieldError]',
  host: {
    'data-slot': 'field-error',
    '[class]': 'classes()',
  },
})
export class FieldError {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm text-danger', this.userClass()));
}

/** Convenience for `imports: [FIELD]`. */
export const FIELD = [Field, FieldDescription, FieldError] as const;
