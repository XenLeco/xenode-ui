import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A read-only progress stepper on an ordered list. The current step carries
 * aria-current="step" (consumer's job) and is styled from that attribute.
 */

@Directive({ selector: 'ol[xnStepper]', host: { 'data-slot': 'stepper', '[class]': 'classes()' } })
export class Stepper {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-4 sm:flex-row sm:gap-6', this.userClass()),
  );
}

@Directive({
  selector: 'li[xnStep]',
  host: { 'data-slot': 'step', '[class]': 'classes()' },
})
export class Step {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'group flex items-start gap-3 text-muted-foreground aria-[current=step]:text-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnStepIndicator]',
  host: { 'data-slot': 'step-indicator', 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class StepIndicator {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium group-aria-[current=step]:border-primary group-aria-[current=step]:bg-primary group-aria-[current=step]:text-primary-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnStepTitle]',
  host: { 'data-slot': 'step-title', '[class]': 'classes()' },
})
export class StepTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm font-medium', this.userClass()));
}

@Directive({
  selector: '[xnStepDescription]',
  host: { 'data-slot': 'step-description', '[class]': 'classes()' },
})
export class StepDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs text-muted-foreground', this.userClass()),
  );
}

export const STEPPER = [Stepper, Step, StepIndicator, StepTitle, StepDescription] as const;
