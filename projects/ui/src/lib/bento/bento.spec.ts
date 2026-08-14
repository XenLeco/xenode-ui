import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BENTO } from './bento';

@Component({
  imports: [BENTO],
  template: `
    <div xnBento>
      <div xnBentoItem size="large">
        <span xnBentoTitle>Big</span>
        <span xnBentoDescription>2x2 tile</span>
      </div>
      <div xnBentoItem size="wide" class="bg-red-500">Wide</div>
      <div xnBentoItem>Small</div>
    </div>
  `,
})
class Host {}

describe('Bento', () => {
  it('lays out mixed footprints and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-slot="bento"]')?.classList).toContain('lg:grid-cols-4');
    const items = el.querySelectorAll<HTMLElement>('[data-slot="bento-item"]');
    expect(items[0].classList).toContain('col-span-2');
    expect(items[0].classList).toContain('row-span-2');
    expect(items[1].classList).toContain('col-span-2');
    expect(items[1].classList).not.toContain('row-span-2');
    expect(items[1].classList).toContain('bg-red-500');
    expect(items[1].classList).not.toContain('bg-card');
    expect(el.querySelector('[data-slot="bento-title"]')?.textContent).toContain('Big');
  });
});

@Component({
  imports: [BENTO],
  template: `
    <div xnBento>
      <div xnBentoItem size="hero" tone="gradient">
        <span xnBentoTitle>Banner</span>
        <span xnBentoDescription>Full-width blend</span>
      </div>
      <div xnBentoItem tone="glass">Frosted</div>
      <div xnBentoItem tone="glow" class="bg-red-500">Lit</div>
    </div>
  `,
})
class TonedHost {}

describe('BentoItem sizes and tones', () => {
  it('hero spans the full lg row and gradient replaces the card skin', async () => {
    const fixture = TestBed.createComponent(TonedHost);
    await fixture.whenStable();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-slot="bento-item"]',
    );

    expect(items[0].classList).toContain('lg:col-span-4');
    expect(items[0].classList).toContain('row-span-2');
    expect(items[0].classList).toContain('text-gradient-foreground');
    expect(items[0].classList).not.toContain('bg-card');

    expect(items[1].classList).toContain('backdrop-blur-md');
    expect(items[1].classList).not.toContain('bg-card');

    expect(items[2].classList).toContain('border-ring/50');
    expect(items[2].classList).toContain('bg-red-500');
    expect(items[2].classList).not.toContain('bg-card');
  });
});
