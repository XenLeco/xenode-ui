import { Component, Directive, computed, input, model, numberAttribute } from '@angular/core';

import { cn } from '../cn';

/**
 * Absent min/max must stay absent — `numberAttribute`'s own fallback is
 * `NaN`, and `NaN` would poison every clamp comparison (`x <= NaN` is
 * always false), silently defeating the boundary. Empty string is the
 * "attribute removed" case an optional input can be handed.
 */
const optionalNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = numberAttribute(value);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * Native number input, styled: the spinner is hidden cross-browser through
 * `appearance` (the standard property, then webkit's shadow-DOM pseudo
 * elements) so it degrades gracefully — a browser that ignores the hack
 * still shows a working spinner, and arrow-key stepping is untouched
 * either way since none of this is JS.
 */
@Directive({
  selector: 'input[type="number"][xnNumberInput]',
  host: {
    'data-slot': 'number-input',
    '[class]': 'classes()',
  },
})
export class NumberInput {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,border-color] [appearance:textfield] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
      this.userClass(),
    ),
  );
}

/**
 * `xnNumberInput` plus real +/- buttons that clamp through the `value`
 * model — never the DOM's own `stepUp`/`stepDown`, which would require a
 * template ref just to read the result back out. Boundary buttons go
 * `aria-disabled`, never `disabled`: a native `disabled` button drops out
 * of the tab order and would boot focus off the control the moment the
 * limit is hit (e.g. holding the button, or the min/max input changing
 * under a focused button). `aria-disabled` keeps it focusable; the click
 * handlers carry the actual guard.
 */
@Component({
  selector: 'xn-number-field',
  imports: [NumberInput],
  host: { 'data-slot': 'number-field', '[class]': 'classes()' },
  template: `
    <button
      type="button"
      data-slot="number-field-decrement"
      [attr.aria-label]="decrementLabel()"
      [attr.aria-disabled]="atMin() ? true : null"
      (click)="decrement()"
      class="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-l-md rounded-r-none border border-input bg-transparent text-sm transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
    >
      −
    </button>
    <input
      xnNumberInput
      type="number"
      class="-ml-px w-16 shrink-0 rounded-none text-center focus-visible:z-10"
      [attr.min]="min()"
      [attr.max]="max()"
      [attr.step]="step()"
      [attr.aria-label]="ariaLabel()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
    <button
      type="button"
      data-slot="number-field-increment"
      [attr.aria-label]="incrementLabel()"
      [attr.aria-disabled]="atMax() ? true : null"
      (click)="increment()"
      class="-ml-px inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-l-none rounded-r-md border border-input bg-transparent text-sm transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
    >
      +
    </button>
  `,
})
export class NumberField {
  readonly value = model<number>(0);

  readonly min = input<number | undefined>(undefined, { transform: optionalNumber });
  readonly max = input<number | undefined>(undefined, { transform: optionalNumber });
  readonly step = input(1, { transform: numberAttribute });

  /** Accessible name for the input itself — the +/- buttons carry their own. */
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly decrementLabel = input('Decrease');
  readonly incrementLabel = input('Increase');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('inline-flex items-stretch', this.userClass()));

  protected readonly atMin = computed(() => {
    const min = this.min();
    return min !== undefined && this.value() <= min;
  });
  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== undefined && this.value() >= max;
  });

  protected decrement(): void {
    if (this.atMin()) return;
    this.commit(this.value() - this.step());
  }

  protected increment(): void {
    if (this.atMax()) return;
    this.commit(this.value() + this.step());
  }

  // Typing is not clamped live (that would fight a user still keying in a
  // digit); an incomplete/invalid value ("-", "") is left as un-committed
  // DOM state rather than coerced. onBlur is where an out-of-range value
  // finally gets pulled back in range, matching what stepUp/stepDown would
  // have produced.
  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).valueAsNumber;
    if (!Number.isNaN(next)) this.value.set(next);
  }

  protected onBlur(): void {
    this.commit(this.value());
  }

  private commit(next: number): void {
    if (!Number.isFinite(next)) return;
    const min = this.min();
    const max = this.max();
    let clamped = next;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    this.value.set(clamped);
  }
}

/** Convenience for `imports: [NUMBER_INPUT]`. */
export const NUMBER_INPUT = [NumberInput, NumberField] as const;
