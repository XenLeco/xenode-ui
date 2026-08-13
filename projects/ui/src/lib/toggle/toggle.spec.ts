import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Toggle, ToggleGroup } from './toggle';

@Component({
  imports: [Toggle],
  template: `<button xnToggle [(pressed)]="bold">Bold</button>`,
})
class TwoWayHost {
  readonly bold = signal(false);
}

@Component({
  imports: [Toggle, ToggleGroup],
  template: `
    <div xnToggleGroup aria-label="Text style">
      <button xnToggle>Bold</button>
      <button xnToggle>Italic</button>
    </div>
  `,
})
class GroupHost {}

describe('Toggle', () => {
  it('flips aria-pressed and writes back through the two-way model', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');

    expect(button?.getAttribute('aria-pressed')).toBe('false');
    button?.click();
    await fixture.whenStable();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.componentInstance.bold()).toBe(true);

    fixture.componentInstance.bold.set(false);
    await fixture.whenStable();
    expect(button?.getAttribute('aria-pressed')).toBe('false');
  });

  it('works uncontrolled inside a group, with independent state', async () => {
    const fixture = TestBed.createComponent(GroupHost);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const group = compiled.querySelector('[data-slot="toggle-group"]');
    const toggles = compiled.querySelectorAll<HTMLButtonElement>('[data-slot="toggle"]');

    expect(group?.getAttribute('role')).toBe('group');
    toggles[0].click();
    await fixture.whenStable();
    expect(toggles[0].getAttribute('aria-pressed')).toBe('true');
    expect(toggles[1].getAttribute('aria-pressed')).toBe('false');
  });
});
