import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XN_POPOVER } from './popover';

@Component({
  imports: [XN_POPOVER],
  template: `
    <button type="button" [xnPopoverTriggerFor]="pop">Open settings</button>
    <ng-template #pop="xnPopover" xnPopover>
      <div xnPopoverPanel>Popover body</div>
    </ng-template>
  `,
})
class Host {}

describe('Popover', () => {
  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  const panel = () => document.querySelector<HTMLElement>('[data-slot="popover"]');

  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    if (!button) throw new Error('No trigger rendered');
    return { fixture, button };
  }

  it('toggles on trigger click with aria-expanded state', async () => {
    const { fixture, button } = await render();
    expect(panel()).toBeNull();
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');

    button.click();
    await fixture.whenStable();
    expect(panel()?.textContent).toContain('Popover body');
    expect(button.getAttribute('aria-expanded')).toBe('true');

    button.click();
    await fixture.whenStable();
    expect(panel()).toBeNull();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape from the trigger', async () => {
    const { fixture, button } = await render();
    button.click();
    await fixture.whenStable();
    expect(panel()).toBeTruthy();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(panel()).toBeNull();
  });
});
