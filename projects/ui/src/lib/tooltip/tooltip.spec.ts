import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { purgeOverlays } from '../../testing/overlay';

import { Tooltip } from './tooltip';

@Component({
  imports: [Tooltip],
  template: `<button type="button" xnTooltip="Copies the link">Copy</button>`,
})
class Host {}

describe('Tooltip', () => {
  beforeEach(purgeOverlays);
  afterEach(purgeOverlays);

  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    if (!button) throw new Error('No trigger rendered');
    return { fixture, button };
  }

  const tooltipEl = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [data-slot="tooltip"]');

  it('shows on focus with role=tooltip and links via aria-describedby', async () => {
    const { fixture, button } = await render();
    expect(tooltipEl()).toBeNull();

    button.dispatchEvent(new Event('focus'));
    await fixture.whenStable();

    const tip = tooltipEl();
    expect(tip?.textContent).toContain('Copies the link');
    expect(tip?.getAttribute('role')).toBe('tooltip');
    expect(button.getAttribute('aria-describedby')).toBe(tip?.id);
  });

  it('hides on blur and removes the description link', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    expect(tooltipEl()).toBeTruthy();

    button.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(tooltipEl()).toBeNull();
    expect(button.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows on hover and hides on Escape', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('mouseenter'));
    await fixture.whenStable();
    expect(tooltipEl()).toBeTruthy();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(tooltipEl()).toBeNull();
  });
});
