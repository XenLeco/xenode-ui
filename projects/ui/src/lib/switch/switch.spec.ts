import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Switch } from './switch';

@Component({
  imports: [Switch],
  template: `
    <label for="notify">Email notifications</label>
    <input xnSwitch type="checkbox" id="notify" />
  `,
})
class Host {}

describe('Switch', () => {
  it('announces as a switch while staying a native checkbox underneath', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(el?.getAttribute('role')).toBe('switch');
    expect(el?.classList).toContain('appearance-none');
    expect(el?.classList).toContain('checked:before:translate-x-4');

    el?.click();
    expect(el?.checked).toBe(true);
  });

  it('is axe-clean with its label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
