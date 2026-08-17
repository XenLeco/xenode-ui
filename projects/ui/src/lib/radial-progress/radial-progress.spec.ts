import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RadialProgress } from './radial-progress';

@Component({
  imports: [RadialProgress],
  template: `
    <span xnRadialProgress value="40" aria-label="Full">40%</span>
    <span xnRadialProgress arc="semi" value="40" aria-label="Semi">40%</span>
  `,
})
class Host {}

@Component({
  imports: [RadialProgress],
  template: `<span xnRadialProgress arc="semi" value="999" max="50" aria-label="Overflow"></span>`,
})
class OverflowHost {}

describe('RadialProgress', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const spans = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-slot="radial-progress"]',
    );
    return { fixture, full: spans[0], semi: spans[1] };
  }

  it('exposes the accessible progressbar contract regardless of arc', async () => {
    const { full, semi } = await render();
    for (const el of [full, semi]) {
      expect(el.getAttribute('role')).toBe('progressbar');
      expect(el.getAttribute('aria-valuemin')).toBe('0');
      expect(el.getAttribute('aria-valuemax')).toBe('100');
      expect(el.getAttribute('aria-valuenow')).toBe('40');
    }
  });

  it('full arc keeps the square host and a full, undashed track', async () => {
    const { full } = await render();
    expect(full.classList).toContain('size-16');
    expect(full.classList).not.toContain('overflow-hidden');
    const track = full.querySelector('circle');
    expect(track?.getAttribute('stroke-dasharray')).toBeNull();
    const svg = full.querySelector('svg');
    expect(svg?.classList).toContain('-rotate-90');
  });

  it('semi arc crops to a half-height host, halves the track and the sweep', async () => {
    const { semi } = await render();
    expect(semi.classList).toContain('h-8');
    expect(semi.classList).toContain('w-16');
    expect(semi.classList).toContain('overflow-hidden');

    const circles = semi.querySelectorAll('circle');
    const track = circles[0];
    const value = circles[1];
    // Track only ever draws half the ring; the value arc's 100% is 50 units,
    // so 40% is 20.
    expect(track.getAttribute('stroke-dasharray')).toBe('50 100');
    expect(value.getAttribute('stroke-dasharray')).toBe('20 100');

    const svg = semi.querySelector('svg');
    expect(svg?.classList).toContain('rotate-180');
    expect(svg?.classList).not.toContain('-rotate-90');
  });

  it('clamps value into [0, max] before computing arc length', async () => {
    const fixture = TestBed.createComponent(OverflowHost);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="radial-progress"]',
    );
    expect(el?.getAttribute('aria-valuenow')).toBe('50');
    const value = el?.querySelectorAll('circle')[1];
    // 100% of a semi arc is 50 units.
    expect(value?.getAttribute('stroke-dasharray')).toBe('50 100');
  });
});
