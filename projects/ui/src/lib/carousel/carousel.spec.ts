import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CAROUSEL } from './carousel';

@Component({
  imports: [CAROUSEL],
  template: `
    <div xnCarousel>
      <div xnCarouselViewport tabindex="0" aria-label="Screenshots">
        <div xnCarouselItem>One</div>
        <div xnCarouselItem>Two</div>
      </div>
      <button type="button" xnCarouselPrev aria-label="Previous slide">‹</button>
      <button type="button" xnCarouselNext aria-label="Next slide">›</button>
    </div>
  `,
})
class Host {}

describe('Carousel', () => {
  it('renders snap slots and pages the viewport from the buttons', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const viewport = el.querySelector<HTMLElement>('[data-slot="carousel-viewport"]');
    if (!viewport) throw new Error('No viewport rendered');
    expect(viewport.classList).toContain('snap-x');
    expect(el.querySelectorAll('[data-slot="carousel-item"]')[0].classList).toContain('snap-start');

    // jsdom does no layout/scrolling; assert the wiring, not the pixels.
    const scrollBy = vi.fn();
    viewport.scrollBy = scrollBy as unknown as typeof viewport.scrollBy;

    el.querySelector<HTMLButtonElement>('[data-slot="carousel-next"]')?.click();
    expect(scrollBy).toHaveBeenCalledWith({ left: viewport.clientWidth, behavior: 'smooth' });

    el.querySelector<HTMLButtonElement>('[data-slot="carousel-prev"]')?.click();
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -viewport.clientWidth, behavior: 'smooth' });
  });
});
