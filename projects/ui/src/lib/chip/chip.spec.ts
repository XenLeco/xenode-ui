import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Chip } from './chip';

@Component({
  imports: [Chip],
  template: `
    <div role="group" aria-label="Genres">
      <label xnChip class="capitalize"><input type="checkbox" checked /> Roguelike</label>
      <label xnChip><input type="checkbox" /> Sandbox</label>
      <label xnChip><input type="checkbox" disabled /> Early access</label>
    </div>
  `,
})
class Host {}

describe('Chip', () => {
  it('wraps a real checkbox: the checkbox IS the state, consumer class wins', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const labels = [...(fixture.nativeElement as HTMLElement).querySelectorAll('label')];

    expect(labels[0].dataset['slot']).toBe('chip');
    expect(labels[0].classList).toContain('capitalize');
    // The visually-hidden styling is a descendant rule on the label
    // ([&>input]:sr-only) — the checkbox itself carries no class of its
    // own, so the contract to check is on the label's classList.
    expect(labels[0].classList).toContain('[&>input]:sr-only');

    const checkbox = labels[1].querySelector('input') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    checkbox.click();
    expect(checkbox.checked).toBe(true);
  });

  it('the checked pill still has the plain label text — the check glyph is generated content, not real text', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const label = (fixture.nativeElement as HTMLElement).querySelector('label');
    // Real DOM text content, which is what the native label→checkbox
    // accessible-name computation reads. The has-checked check glyph is
    // CSS content with alt text ('' after the /) — it renders visually but
    // never lands here, so it can't double up the announced name.
    expect(label?.textContent?.trim()).toBe('Roguelike');
    expect(label?.textContent).not.toContain('✓');
  });

  it('is axe-clean as a checkbox group', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
