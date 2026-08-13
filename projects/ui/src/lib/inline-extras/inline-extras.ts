import { Directive, computed, input, model } from '@angular/core';

import { cn } from '../cn';

/** Inline utilities: highlight mark, color swatch, spoiler. */

/** Semantic <mark> highlight on the warning tint. */
@Directive({ selector: 'mark[xnMark]', host: { 'data-slot': 'mark', '[class]': 'classes()' } })
export class Mark {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('rounded-sm bg-warning/40 px-0.5 text-foreground', this.userClass()),
  );
}

/**
 * A color chip. Purely visual — give it an aria-label naming the color, and
 * never let the swatch be the only channel for meaning.
 */
@Directive({
  selector: '[xnColorSwatch]',
  host: {
    'data-slot': 'color-swatch',
    role: 'img',
    '[style.background-color]': 'color()',
    '[class]': 'classes()',
  },
})
export class ColorSwatch {
  readonly color = input.required<string>();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('inline-block size-5 shrink-0 rounded-md border', this.userClass()),
  );
}

/**
 * Collapsed-by-default content with a height clamp and fade-out hint.
 * Toggle by reference: `<div xnSpoiler #s="xnSpoiler">…</div>
 * <button (click)="s.expanded.set(!s.expanded())">…</button>`
 */
@Directive({
  selector: '[xnSpoiler]',
  exportAs: 'xnSpoiler',
  host: {
    'data-slot': 'spoiler',
    '[attr.data-expanded]': 'expanded()',
    '[class]': 'classes()',
  },
})
export class Spoiler {
  readonly expanded = model(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative overflow-hidden transition-[max-height]',
      this.expanded()
        ? 'max-h-none'
        : 'max-h-24 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]',
      this.userClass(),
    ),
  );
}

export const INLINE_EXTRAS = [Mark, ColorSwatch, Spoiler] as const;
