import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { RADIO_GROUP } from './radio-group';

@Component({
  imports: [RADIO_GROUP],
  template: `
    <fieldset xnRadioGroup>
      <legend>Deployment target</legend>
      <div class="flex items-center gap-2">
        <input xnRadio type="radio" name="target" id="t-pi" value="pi" checked />
        <label for="t-pi">Raspberry Pi</label>
      </div>
      <div class="flex items-center gap-2">
        <input xnRadio type="radio" name="target" id="t-vps" value="vps" />
        <label for="t-vps">VPS</label>
      </div>
    </fieldset>
  `,
})
class Host {}

describe('RadioGroup', () => {
  it('keeps native grouping: selecting one deselects the other', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const radios = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input[data-slot="radio"]',
    );
    expect(radios.length).toBe(2);
    expect(radios[0].checked).toBe(true);

    radios[1].click();
    expect(radios[1].checked).toBe(true);
    expect(radios[0].checked).toBe(false);
  });

  it('is axe-clean with fieldset/legend naming', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
