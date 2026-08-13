import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Checkbox } from './checkbox';

@Component({
  imports: [Checkbox],
  template: `
    <label for="terms">Accept the terms</label>
    <input xnCheckbox type="checkbox" id="terms" class="size-5" />
  `,
})
class Host {}

describe('Checkbox', () => {
  it('keeps the native input, token accent, and consumer class wins', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const box = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(box?.dataset['slot']).toBe('checkbox');
    expect(box?.classList).toContain('accent-primary');
    expect(box?.classList).toContain('size-5');
    expect(box?.classList).not.toContain('size-4');

    box?.click();
    expect(box?.checked).toBe(true);
  });

  it('is axe-clean with its label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
