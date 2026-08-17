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

/**
 * Native color input styled as a small swatch well: the OS/browser color
 * dialog stays native — only the swatch's own border/corners are
 * retouched (webkit's shadow-DOM color-swatch pseudo-elements; Firefox's
 * -moz equivalent) so the swatch doesn't look like a second nested box
 * inside the well. Safari exposes neither pseudo-element, so it falls
 * back to the browser's own swatch inside the same bordered well —
 * graceful degradation, not breakage. Pair with a text readout in the
 * consumer's markup; the swatch alone carries no readable value.
 */
@Directive({
  selector: 'input[type="color"][xnInputColor]',
  host: {
    'data-slot': 'input-color',
    '[class]': 'classes()',
  },
})
export class InputColor {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1 transition-[border-color] [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-sm [&::-webkit-color-swatch-wrapper]:p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass(),
    ),
  );
}

export const FORM_EXTRAS = [PasswordInput, FileInput, FloatingLabel, InputColor] as const;
