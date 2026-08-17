import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NAV_PANELS } from './nav-menu';

@Component({
  imports: [NAV_PANELS],
  template: `
    <nav xnNavPanels aria-label="Primary">
      <button [xnNavPanelTrigger]="'products'">Products</button>
      <button [xnNavPanelTrigger]="'resources'">Resources</button>
      <div [xnNavPanel]="'products'"><a xnNavPanelLink href="#a">Panel A link</a></div>
      <div [xnNavPanel]="'resources'"><a xnNavPanelLink href="#b">Panel B link</a></div>
    </nav>
    <button id="outside" type="button">outside</button>
  `,
})
class Host {}

const create = async () => {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const triggers = [...el.querySelectorAll<HTMLButtonElement>('[data-slot="nav-panel-trigger"]')];
  const panels = [...el.querySelectorAll<HTMLElement>('[data-slot="nav-panel"]')];
  return { fixture, el, triggers, panels };
};

describe('NavPanels (disclosure navigation)', () => {
  it('wires triggers to panels: aria-expanded, aria-controls, inert', async () => {
    const { triggers, panels } = await create();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[0].getAttribute('aria-controls')).toBe('products');
    expect(panels[0].id).toBe('products');
    expect(panels[0].hasAttribute('inert')).toBe(true);
    // No menu semantics anywhere: this is the disclosure pattern.
    expect(panels[0].getAttribute('role')).toBeNull();
    expect(triggers[0].getAttribute('aria-haspopup')).toBeNull();
  });

  it('opens on click, one panel at a time', async () => {
    const { fixture, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(panels[0].hasAttribute('inert')).toBe(false);

    triggers[1].click();
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert'), 'first panel closes').toBe(true);
    expect(panels[1].hasAttribute('inert')).toBe(false);

    triggers[1].click();
    await fixture.whenStable();
    expect(panels[1].hasAttribute('inert'), 'toggle closes').toBe(true);
  });

  it('a click outside the nav closes the open panel', async () => {
    const { fixture, el, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();

    el.querySelector<HTMLElement>('#outside')?.click();
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(true);
  });

  it('Escape closes and returns focus to the trigger when focus was inside', async () => {
    const { fixture, el, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();

    const link = panels[0].querySelector<HTMLElement>('[data-slot="nav-panel-link"]');
    link?.focus();
    el
      .querySelector('nav')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(triggers[0]);
  });

  it('tabbing out of the nav closes the open panel', async () => {
    const { fixture, el, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();

    const outside = el.querySelector<HTMLElement>('#outside');
    triggers[0].dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }),
    );
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(true);
  });
});
