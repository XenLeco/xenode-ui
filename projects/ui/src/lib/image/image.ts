import { Directive, computed, input, signal } from '@angular/core';

import { cn } from '../cn';

/**
 * A single directive on the native `<img>` — unlike Avatar this is not a
 * two-element composition, since a plain content image has no separate
 * initials/icon slot to fall back to by default. `alt` stays the
 * accessible name in both states: a failed load only hides the visible
 * broken-image glyph (a text-indent push, the same trick that hides an
 * `<img>`'s fallback text) so `bg-muted` reads as an intentional
 * placeholder box instead of the platform's broken-icon. `exportAs` lets
 * a consumer wire a richer custom fallback (an icon, "no image" text) off
 * the same `failed` signal via a template reference when the muted
 * background alone isn't enough — the fallback-slot half of the pattern,
 * without forcing every plain `<img xnImage>` into a wrapper element.
 */
@Directive({
  selector: 'img[xnImage]',
  exportAs: 'xnImage',
  host: {
    'data-slot': 'image',
    '(error)': 'failed.set(true)',
    '(load)': 'failed.set(false)',
    '[class]': 'classes()',
  },
})
export class Image {
  readonly fit = input<'cover' | 'contain' | 'fill'>('cover');

  readonly failed = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(
      'block rounded-md bg-muted',
      { cover: 'object-cover', contain: 'object-contain', fill: 'object-fill' }[this.fit()],
      // 200vw, not a px constant: the indent must exceed the box width,
      // and no element is wider than twice the viewport.
      this.failed() && 'overflow-hidden indent-[200vw] whitespace-nowrap',
      this.userClass(),
    ),
  );
}
