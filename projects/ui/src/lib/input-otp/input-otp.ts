import { Directive, ElementRef, computed, inject, input } from '@angular/core';

import { cn } from '../cn';

/**
 * One-time-code entry as real inputs — each slot is a native single-char
 * input, so autofill, focus and form participation stay native. The group
 * adds the ergonomics: typing advances, backspace retreats, pasting a code
 * distributes across slots.
 *
 * ```html
 * <div xnOtpGroup aria-label="Verification code">
 *   <input xnOtpSlot … /><input xnOtpSlot … />…
 * </div>
 * ```
 */

@Directive({
  selector: '[xnOtpGroup]',
  host: {
    'data-slot': 'otp-group',
    role: 'group',
    '(input)': 'onInput($event)',
    '(keydown.backspace)': 'onBackspace($event)',
    '(paste)': 'onPaste($event)',
    '[class]': 'classes()',
  },
})
export class OtpGroup {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-center gap-2', this.userClass()));

  private slots(): HTMLInputElement[] {
    return [...this.elementRef.nativeElement.querySelectorAll<HTMLInputElement>('input')];
  }

  /** The code across all slots — read it on submit. */
  value(): string {
    return this.slots()
      .map((slot) => slot.value)
      .join('');
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    const slots = this.slots();
    const index = slots.indexOf(target);
    slots[index + 1]?.focus();
  }

  protected onBackspace(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) return;
    const slots = this.slots();
    const index = slots.indexOf(target);
    slots[index - 1]?.focus();
  }

  protected onPaste(event: Event): void {
    const clipboard = (event as ClipboardEvent).clipboardData?.getData('text') ?? '';
    const chars = clipboard.replace(/\s/g, '').split('');
    if (!chars.length) return;
    event.preventDefault();
    const slots = this.slots();
    slots.forEach((slot, i) => {
      slot.value = chars[i] ?? slot.value;
    });
    slots[Math.min(chars.length, slots.length) - 1]?.focus();
  }
}

@Directive({
  selector: 'input[xnOtpSlot]',
  host: {
    'data-slot': 'otp-slot',
    maxlength: '1',
    inputmode: 'numeric',
    autocomplete: 'one-time-code',
    '[class]': 'classes()',
  },
})
export class OtpSlot {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'size-9 rounded-md border border-input bg-transparent text-center text-sm font-medium transition-[color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
      this.userClass(),
    ),
  );
}

export const INPUT_OTP = [OtpGroup, OtpSlot] as const;
