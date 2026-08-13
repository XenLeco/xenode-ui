import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Label } from './label';

@Component({
  imports: [Label],
  template: `
    <label xnLabel for="name">Display name</label>
    <input id="name" type="text" />
  `,
})
class PlainHost {}

@Component({
  imports: [Label],
  template: `
    <label xnLabel class="text-lg" for="big">Large label</label>
    <input id="big" type="text" />
  `,
})
class OverrideHost {}

describe('Label', () => {
  it('renders base classes and the data-slot seam on the native element', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const label = (fixture.nativeElement as HTMLElement).querySelector('label');
    expect(label?.dataset['slot']).toBe('label');
    expect(label?.classList).toContain('text-sm');
    expect(label?.htmlFor).toBe('name');
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const fixture = TestBed.createComponent(OverrideHost);
    await fixture.whenStable();
    const label = (fixture.nativeElement as HTMLElement).querySelector('label');
    expect(label?.classList).toContain('text-lg');
    expect(label?.classList).not.toContain('text-sm');
    expect(label?.classList).toContain('font-medium');
  });

  it('is axe-clean with its associated control', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
