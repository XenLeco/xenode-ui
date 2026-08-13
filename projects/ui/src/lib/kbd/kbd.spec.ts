import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Kbd } from './kbd';

@Component({
  imports: [Kbd],
  template: `<kbd xnKbd class="h-6">Ctrl</kbd>`,
})
class Host {}

describe('Kbd', () => {
  it('styles the native kbd element and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('kbd');
    expect(el?.dataset['slot']).toBe('kbd');
    expect(el?.classList).toContain('font-mono');
    expect(el?.classList).toContain('h-6');
    expect(el?.classList).not.toContain('h-5');
  });
});
