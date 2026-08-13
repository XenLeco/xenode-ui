import { Directive, ElementRef, computed, contentChild, inject, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A scroll-snap carousel: the browser owns scrolling, swiping and snap
 * physics; the buttons just scrollBy one viewport. The prev/next directives
 * find their viewport through DI + a contentChild signal query on the
 * ancestor Carousel.
 *
 * ```html
 * <div xnCarousel>
 *   <div xnCarouselViewport tabindex="0" aria-label="Screenshots">
 *     <div xnCarouselItem>…</div>
 *   </div>
 *   <button xnButton xnCarouselPrev aria-label="Previous slide">‹</button>
 *   <button xnButton xnCarouselNext aria-label="Next slide">›</button>
 * </div>
 * ```
 */

@Directive({
  selector: '[xnCarouselViewport]',
  host: {
    'data-slot': 'carousel-viewport',
    '[class]': 'classes()',
  },
})
export class CarouselViewport {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg [scrollbar-width:none]',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnCarousel]',
  host: {
    'data-slot': 'carousel',
    '[class]': 'classes()',
  },
})
export class Carousel {
  readonly viewport = contentChild(CarouselViewport);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative', this.userClass()));

  scrollByPage(direction: 1 | -1): void {
    const el = this.viewport()?.elementRef.nativeElement;
    el?.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  }
}

@Directive({
  selector: '[xnCarouselItem]',
  host: {
    'data-slot': 'carousel-item',
    '[class]': 'classes()',
  },
})
export class CarouselItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('min-w-0 shrink-0 grow-0 basis-full snap-start', this.userClass()),
  );
}

@Directive({
  selector: 'button[xnCarouselPrev]',
  host: {
    'data-slot': 'carousel-prev',
    '(click)': 'carousel.scrollByPage(-1)',
  },
})
export class CarouselPrev {
  protected readonly carousel = inject(Carousel);
}

@Directive({
  selector: 'button[xnCarouselNext]',
  host: {
    'data-slot': 'carousel-next',
    '(click)': 'carousel.scrollByPage(1)',
  },
})
export class CarouselNext {
  protected readonly carousel = inject(Carousel);
}

/** Convenience for `imports: [CAROUSEL]`. */
export const CAROUSEL = [
  Carousel,
  CarouselViewport,
  CarouselItem,
  CarouselPrev,
  CarouselNext,
] as const;
