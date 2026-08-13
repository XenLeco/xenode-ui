import { Directive, computed, input, signal } from '@angular/core';

import { cn } from '../cn';

/**
 * Avatar with graceful image fallback: the fallback fills the avatar in
 * normal flow, the image overlays it absolutely, and a failed load hides
 * the image so the fallback shows through. No state machine needed — the
 * browser's error event and one signal.
 */

@Directive({
  selector: 'span[xnAvatar]',
  host: {
    'data-slot': 'avatar',
    '[class]': 'classes()',
  },
})
export class Avatar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', this.userClass()),
  );
}

@Directive({
  selector: 'img[xnAvatarImage]',
  host: {
    'data-slot': 'avatar-image',
    '(error)': 'failed.set(true)',
    '(load)': 'failed.set(false)',
    '[class]': 'classes()',
  },
})
export class AvatarImage {
  protected readonly failed = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'absolute inset-0 aspect-square size-full object-cover',
      this.failed() && 'hidden',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'span[xnAvatarFallback]',
  host: {
    'data-slot': 'avatar-fallback',
    '[class]': 'classes()',
  },
})
export class AvatarFallback {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex size-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [AVATAR]`. */
export const AVATAR = [Avatar, AvatarImage, AvatarFallback] as const;
