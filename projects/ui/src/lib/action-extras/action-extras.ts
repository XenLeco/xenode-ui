import { Directive, computed, input, signal } from '@angular/core';

import { cn } from '../cn';

/** Action parity pieces: copy button, FAB, loading overlay, visually hidden. */

/**
 * Copies its `xnCopyButton` text to the clipboard and flips `copied` for a
 * moment — style the feedback from data-copied or read the signal.
 * The button still needs an accessible name.
 */
@Directive({
  selector: 'button[xnCopyButton]',
  exportAs: 'xnCopyButton',
  host: {
    'data-slot': 'copy-button',
    type: 'button',
    '[attr.data-copied]': 'copied()',
    '(click)': 'copy()',
    '[class]': 'classes()',
  },
})
export class CopyButton {
  readonly text = input.required<string>({ alias: 'xnCopyButton' });

  readonly copied = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-medium transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[copied=true]:border-transparent data-[copied=true]:bg-success data-[copied=true]:text-success-foreground',
      this.userClass(),
    ),
  );

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard unavailable (permissions, insecure context) — stay silent;
      // the text remains selectable.
    }
  }
}

/** Floating action button pinned to the viewport corner. */
@Directive({
  selector: 'button[xnFab]',
  host: { 'data-slot': 'fab', type: 'button', '[class]': 'classes()' },
})
export class Fab {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'fixed right-6 bottom-6 z-40 inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-[background-color,scale] hover:bg-primary/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

/**
 * Dims and blocks a relative parent while work runs. Screen readers get the
 * state from the aria-busy you set on the parent, not from the dimming.
 */
@Directive({
  selector: '[xnLoadingOverlay]',
  host: { 'data-slot': 'loading-overlay', '[class]': 'classes()' },
})
export class LoadingOverlay {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]',
      this.userClass(),
    ),
  );
}

/** Screen-reader-only content on any element. */
@Directive({
  selector: '[xnVisuallyHidden]',
  host: { 'data-slot': 'visually-hidden', '[class]': 'classes()' },
})
export class VisuallyHidden {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('sr-only', this.userClass()));
}

export const ACTION_EXTRAS = [CopyButton, Fab, LoadingOverlay, VisuallyHidden] as const;
