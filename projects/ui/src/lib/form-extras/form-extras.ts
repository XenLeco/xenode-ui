import { Directive, computed, input, signal } from '@angular/core';

import { cn } from '../cn';

/** Form parity pieces: password visibility, styled file input, floating label. */

/**
 * Password input with a consumer-wired visibility toggle:
 * `<input xnPasswordInput #p="xnPasswordInput" [type]="p.visible() ? 'text' : 'password'" />`
 * `<button (click)="p.toggle()" [attr.aria-pressed]="p.visible()">…</button>`
 * The toggle button needs an accessible name ("Show password").
 */
@Directive({
  selector: 'input[xnPasswordInput]',
  exportAs: 'xnPasswordInput',
  host: {
    'data-slot': 'password-input',
    autocomplete: 'current-password',
    '[class]': 'classes()',
  },
})
export class PasswordInput {
  readonly visible = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,border-color] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
      this.userClass(),
    ),
  );

  toggle(): void {
    this.visible.update((value) => !value);
  }
}

/** Native file input styled through the file: button modifier. */
@Directive({
  selector: 'input[type="file"][xnFileInput]',
  host: { 'data-slot': 'file-input', '[class]': 'classes()' },
})
export class FileInput {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'w-full cursor-pointer rounded-md border border-input text-sm text-muted-foreground transition-[border-color] file:mr-3 file:cursor-pointer file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass(),
    ),
  );
}

/**
 * Floating label, pure CSS: wrap input + label; the label floats up when
 * the input is focused or filled (:placeholder-shown does the sensing —
 * the input needs placeholder=" ").
 */
@Directive({
  selector: '[xnFloatingLabel]',
  host: { 'data-slot': 'floating-label', '[class]': 'classes()' },
})
export class FloatingLabel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative [&>input]:pt-5 [&>input]:pb-1 [&>label]:pointer-events-none [&>label]:absolute [&>label]:top-1/2 [&>label]:left-3 [&>label]:-translate-y-1/2 [&>label]:text-sm [&>label]:text-muted-foreground [&>label]:transition-all [&>input:focus+label]:top-3 [&>input:focus+label]:text-xs [&>input:not(:placeholder-shown)+label]:top-3 [&>input:not(:placeholder-shown)+label]:text-xs',
      this.userClass(),
    ),
  );
}

export const FORM_EXTRAS = [PasswordInput, FileInput, FloatingLabel] as const;
