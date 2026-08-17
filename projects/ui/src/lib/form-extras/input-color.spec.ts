import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { InputColor } from './form-extras';

@Component({
  imports: [InputColor],
  template: `
    <input
      xnInputColor
      type="color"
      id="accent"
      aria-label="Accent color"
      value="#6366f1"
      class="size-12"
    />
  `,
})
class Host {}

describe('InputColor', () => {
  it('stays a real color input, well-styled via classes, consumer class wins', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.dataset['slot']).toBe('input-color');
    expect(input?.type).toBe('color');
    expect(input?.value).toBe('#6366f1');
    expect(input?.classList).toContain('rounded-md');
    expect(input?.classList).toContain('size-12');
    expect(input?.classList).not.toContain('size-9');
  });

  it('is axe-clean with its aria-label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
