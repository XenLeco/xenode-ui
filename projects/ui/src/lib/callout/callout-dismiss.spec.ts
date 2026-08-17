import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CALLOUT } from './callout';

@Component({
  imports: [CALLOUT],
  template: `
    <div xnCallout variant="accent" id="note">
      <p xnCalloutTitle>Heads up</p>
      <div xnCalloutContent><p>Closes on click.</p></div>
      <button xnCalloutDismiss>✕</button>
    </div>
  `,
})
class Host {}

@Component({
  imports: [CALLOUT],
  template: `
    <div xnCallout id="note">
      <button xnCalloutDismiss aria-label="Close this note">✕</button>
    </div>
  `,
})
class CustomLabelHost {}

@Component({
  imports: [CALLOUT],
  template: `<button xnCalloutDismiss>✕</button>`,
})
class OrphanHost {}

describe('CalloutDismiss', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      callout: root.querySelector('#note'),
      button: root.querySelector<HTMLButtonElement>('button[xnCalloutDismiss]'),
    };
  }

  it('defaults its aria-label to Dismiss', async () => {
    const { button } = await render();
    expect(button?.getAttribute('aria-label')).toBe('Dismiss');
    expect(button?.getAttribute('type')).toBe('button');
  });

  it('lets the consumer override the aria-label', async () => {
    const fixture = TestBed.createComponent(CustomLabelHost);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Close this note');
  });

  it('hides its ancestor callout via the hidden attribute when clicked', async () => {
    const { fixture, callout, button } = await render();
    expect(callout?.hasAttribute('hidden')).toBe(false);

    button?.click();
    await fixture.whenStable();
    expect(callout?.hasAttribute('hidden')).toBe(true);
  });

  it('throws a purposeful error when used outside a callout', () => {
    expect(() => TestBed.createComponent(OrphanHost)).toThrowError(
      /button\[xnCalloutDismiss\] must be placed inside a \[xnCallout\]/,
    );
  });
});
