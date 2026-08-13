import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Separator } from './separator';

@Component({
  imports: [Separator],
  template: `
    <div xnSeparator></div>
    <div xnSeparator orientation="vertical" class="bg-red-500"></div>
  `,
})
class Host {}

describe('Separator', () => {
  it('renders decorative, orientation-aware, and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const [horizontal, vertical] = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="separator"]',
    );

    expect(horizontal.getAttribute('role')).toBe('none');
    expect(horizontal.classList).toContain('h-px');
    expect(vertical.classList).toContain('w-px');
    expect(vertical.classList).toContain('bg-red-500');
    expect(vertical.classList).not.toContain('bg-border');
  });
});
