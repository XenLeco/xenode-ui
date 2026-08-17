import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Image } from './image';

@Component({
  imports: [Image],
  template: `<img xnImage [fit]="fit()" class="size-16" alt="Server banner" src="missing.png" />`,
})
class Host {
  readonly fit = signal<'cover' | 'contain' | 'fill'>('cover');
}

@Component({
  imports: [Image],
  template: `
    <img xnImage #pic="xnImage" alt="Banner" src="missing.png" />
    <span [hidden]="!pic.failed()">Fallback content</span>
  `,
})
class WithFallback {}

describe('Image', () => {
  it('maps fit to object-* classes, rounded by default, consumer class wins', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');

    expect(img?.dataset['slot']).toBe('image');
    expect(img?.classList).toContain('rounded-md');
    expect(img?.classList).toContain('object-cover');
    expect(img?.classList).toContain('size-16');
  });

  it('switches between the object-fit classes as the fit input changes', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const img = () => (fixture.nativeElement as HTMLElement).querySelector('img');

    fixture.componentInstance.fit.set('contain');
    await fixture.whenStable();
    expect(img()?.classList).toContain('object-contain');
    expect(img()?.classList).not.toContain('object-cover');

    fixture.componentInstance.fit.set('fill');
    await fixture.whenStable();
    expect(img()?.classList).toContain('object-fill');
  });

  it('keeps alt as the accessible fallback and only hides the broken-image glyph on error', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    if (!img) throw new Error('No image rendered');

    expect(img.alt).toBe('Server banner'); // untouched by the failed state
    expect(img.classList).not.toContain('indent-[200vw]');

    img.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(img.classList).toContain('indent-[200vw]');
    expect(img.classList).toContain('overflow-hidden');
    expect(img.alt).toBe('Server banner'); // still the accessible name

    img.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(img.classList).not.toContain('indent-[200vw]');
  });

  it('exposes `failed` via exportAs so a consumer can wire a custom fallback slot', async () => {
    const fixture = TestBed.createComponent(WithFallback);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('span')?.hidden).toBe(true);

    el.querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(el.querySelector('span')?.hidden).toBe(false);
  });
});
