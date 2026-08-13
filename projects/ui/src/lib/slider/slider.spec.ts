import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Slider } from './slider';

@Component({
  imports: [Slider],
  template: `<input xnSlider type="range" min="0" max="100" value="40" aria-label="Volume" />`,
})
class Host {}

describe('Slider', () => {
  it('styles the native range input and keeps its value semantics', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(el?.dataset['slot']).toBe('slider');
    expect(el?.classList).toContain('appearance-none');
    expect(el?.value).toBe('40');
    expect(el?.max).toBe('100');
  });

  it('is axe-clean with its accessible name', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
