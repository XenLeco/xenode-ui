import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NAV_PANELS } from './nav-menu';

@Component({
  imports: [NAV_PANELS],
  template: `
    <nav xnNavPanels aria-label="Primary">
      <button [xnNavPanelTrigger]="'products'">Products</button>
      <button [xnNavPanelTrigger]="'resources'">Resources</button>
      <button [xnNavPanelTrigger]="'orphan'">Broken</button>
      <div [xnNavPanel]="'products'">
        <span id="plain">plain content</span>
        <a xnNavPanelLink href="#a">Panel A link</a>
      </div>
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

  it('focus moving from the trigger INTO the panel does not close it', async () => {
    const { fixture, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();

    const link = panels[0].querySelector<HTMLElement>('[data-slot="nav-panel-link"]');
    triggers[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: link }));
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(false);
  });

  it('a non-link click inside the panel keeps it open', async () => {
    const { fixture, panels, triggers } = await create();
    triggers[0].click();
    await fixture.whenStable();

    panels[0].querySelector<HTMLElement>('#plain')?.click();
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(false);
  });

  it('activating a panel link closes the panel (SPA links never reload)', async () => {
    const { fixture, panels, triggers } = await create();
    triggers[0].click();
    await fixture.whenStable();

    panels[0].querySelector<HTMLElement>('[data-slot="nav-panel-link"]')?.click();
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(true);
  });

  it('Escape with focus on the trigger closes, keeps focus, and consumes the event', async () => {
    const { fixture, triggers, panels } = await create();
    triggers[0].click();
    await fixture.whenStable();
    triggers[0].focus();

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    triggers[0].dispatchEvent(escape);
    await fixture.whenStable();
    expect(panels[0].hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(triggers[0]);
    // preventDefault keeps a wrapping <dialog> (mobile nav sheet) open.
    expect(escape.defaultPrevented).toBe(true);
  });

  it('a trigger with no matching panel warns in dev mode and opens nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { fixture, el, panels } = await create();
    const orphan = [...el.querySelectorAll<HTMLButtonElement>('[data-slot="nav-panel-trigger"]')]
      .find((t) => t.textContent?.includes('Broken'));

    orphan?.click();
    await fixture.whenStable();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('orphan'));
    expect(panels.every((panel) => panel.hasAttribute('inert'))).toBe(true);
    warn.mockRestore();
  });
});
