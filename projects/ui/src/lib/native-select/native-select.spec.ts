import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { NativeSelect } from './native-select';

@Component({
  imports: [NativeSelect],
  template: `
    <label for="game">Game</label>
    <select xnNativeSelect id="game" class="w-48">
      <option value="mc">Minecraft</option>
      <option value="pz">Project Zomboid</option>
    </select>
  `,
})
class Host {}

describe('NativeSelect', () => {
  it('styles the native select and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('select');

    expect(el?.dataset['slot']).toBe('native-select');
    expect(el?.classList).toContain('border-input');
    expect(el?.classList).toContain('w-48');
    expect(el?.classList).not.toContain('w-full');
  });

  it('is axe-clean with its label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
