import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Affix } from './affix/affix';
import { Button } from './button/button';
import { DOCK } from './dock/dock';
import { Highlight } from './highlight/highlight';
import { Input } from './input/input';
import { Join } from './join/join';
import { MockupPhone } from './mockups/mockups';
import { NativeSelect } from './native-select/native-select';
import { RollingNumber } from './rolling-number/rolling-number';
import { Burger } from './site/site';
import { SPEED_DIAL } from './speed-dial/speed-dial';

/** Render coverage + the logic-bearing behaviors for the site/statics cluster. */

@Component({
  imports: [
    Join,
    Button,
    Input,
    NativeSelect,
    DOCK,
    Affix,
    Burger,
    RollingNumber,
    Highlight,
    SPEED_DIAL,
    MockupPhone,
  ],
  template: `
    <div xnJoin>
      <button type="button">A</button>
      <input aria-label="B" />
      <select aria-label="C"><option>1</option></select>
    </div>
    <div xnJoin direction="vertical" class="v-join">
      <button type="button">Top</button>
      <button type="button">Bottom</button>
    </div>

    <nav xnDock class="static">
      <a xnDockItem href="#" aria-current="page">Home</a>
      <a xnDockItem href="#">Servers</a>
    </nav>

    <div xnAffix corner="top-left" position="absolute">Pinned</div>

    <button type="button" xnBurger aria-label="Toggle menu"></button>

    <xn-rolling-number [value]="42"></xn-rolling-number>

    <xn-highlight text="Dark mode" query="dark"></xn-highlight>

    <div xnSpeedDial>
      <button xnSpeedDialTrigger aria-label="Create">+</button>
      <div xnSpeedDialActions>
        <button xnSpeedDialAction aria-label="New">N</button>
      </div>
    </div>

    <div xnMockupPhone>
      <span>Screen content</span>
    </div>
  `,
})
class Host {}

// Two fixed-template hosts rather than one host + post-creation mutation:
// a plain (non-signal) field assigned from test code after creation would
// never schedule change detection under zoneless — inputs must arrive
// through creation-time bindings for whenStable() to have anything to wait on.
@Component({
  imports: [Highlight],
  template: `<xn-highlight text="Dark-first, token-driven." query="DARK"></xn-highlight>`,
})
class HighlightMatchHost {}

@Component({
  imports: [Highlight],
  template: `<xn-highlight text="Dark-first, token-driven." query=""></xn-highlight>`,
})
class HighlightEmptyHost {}

@Component({
  imports: [SPEED_DIAL],
  template: `
    <div xnSpeedDial>
      <button xnSpeedDialTrigger aria-label="Create">+</button>
      <div xnSpeedDialActions>
        <button xnSpeedDialAction aria-label="New file">N</button>
      </div>
    </div>
    <button id="outside" type="button">outside</button>
  `,
})
class SpeedDialHost {}

const SLOTS = [
  'join',
  'dock',
  'dock-item',
  'affix',
  'burger',
  'rolling-number',
  'rolling-number-digit',
  'highlight',
  'speed-dial',
  'speed-dial-trigger',
  'speed-dial-actions',
  'speed-dial-action',
  'mockup-phone',
  'mockup-phone-notch',
  'mockup-phone-screen',
];

async function render() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('Site/statics parity wave', () => {
  it('renders every slot seam', async () => {
    const { el } = await render();
    for (const slot of SLOTS) {
      expect(el.querySelector(`[data-slot="${slot}"]`), slot).toBeTruthy();
    }
  });

  it('join squares inner corners and collapses borders per direction', async () => {
    const { el } = await render();
    const [horizontal, vertical] = [...el.querySelectorAll<HTMLElement>('[data-slot="join"]')];

    expect(horizontal.classList).toContain('[&>*:first-child]:rounded-l-md');
    expect(horizontal.classList).toContain('[&>*:last-child]:rounded-r-md');
    expect(horizontal.classList).toContain('[&>*:not(:first-child)]:-ml-px');
    expect(horizontal.classList).not.toContain('flex-col');

    expect(vertical.classList).toContain('flex-col');
    expect(vertical.classList).toContain('[&>*:first-child]:rounded-t-md');
    expect(vertical.classList).toContain('[&>*:not(:first-child)]:-mt-px');
    // Consumer class still wins alongside the direction-driven classes.
    expect(vertical.classList).toContain('v-join');
  });

  it('dock item styles the active route from aria-current, and a consumer class replaces fixed', async () => {
    const { el } = await render();
    const dock = el.querySelector<HTMLElement>('[data-slot="dock"]');
    expect(dock?.classList).toContain('static');
    expect(dock?.classList).not.toContain('fixed');

    const items = el.querySelectorAll('[data-slot="dock-item"]');
    expect(items[0].classList).toContain('aria-[current=page]:text-foreground');
  });

  it('affix offsets only the two sides the corner names, and null-clears the rest', async () => {
    const { el } = await render();
    const affix = el.querySelector<HTMLElement>('[data-slot="affix"]');
    if (!affix) throw new Error('No affix rendered');

    expect(affix.style.top).toBe('1rem');
    expect(affix.style.left).toBe('1rem');
    expect(affix.style.bottom).toBe('');
    expect(affix.style.right).toBe('');
    expect(affix.classList).toContain('absolute');
    expect(affix.classList).not.toContain('fixed');
  });

  it('burger is a real button whose middle bar is its own clipped background', async () => {
    const { el } = await render();
    const burger = el.querySelector<HTMLButtonElement>('[data-slot="burger"]');
    if (!burger) throw new Error('No burger rendered');

    expect(burger.type).toBe('button');
    expect(burger.classList).toContain('box-content');
    expect(burger.classList).toContain('bg-clip-content');
    expect(burger.classList).toContain('aria-expanded:before:rotate-45');
    expect(burger.classList).toContain('aria-expanded:after:-rotate-45');
  });

  it('rolling number strips translate to the value and the host carries the real text', async () => {
    const { el } = await render();
    const digits = el.querySelectorAll<HTMLElement>('[data-slot="rolling-number-digit"]');
    expect(digits).toHaveLength(2); // 42

    const strip = (i: number) => digits[i].querySelector<HTMLElement>('span');
    expect(strip(0)?.style.transform).toBe('translateY(-40%)'); // digit 4
    expect(strip(1)?.style.transform).toBe('translateY(-20%)'); // digit 2

    const srText = el.querySelector('[data-slot="rolling-number"] .sr-only');
    expect(srText?.textContent?.trim()).toBe('42');
  });

  it('mockup phone projects content into the screen slot', async () => {
    const { el } = await render();
    const screen = el.querySelector('[data-slot="mockup-phone-screen"]');
    expect(screen?.textContent).toContain('Screen content');
  });
});

describe('Highlight', () => {
  it('wraps a case-insensitive match in xnMark and leaves the rest untouched', async () => {
    const fixture = TestBed.createComponent(HighlightMatchHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const mark = el.querySelector('mark');
    expect(mark?.getAttribute('data-slot')).toBe('mark');
    expect(mark?.textContent?.trim()).toBe('Dark');
    // Whitespace-normalized: template formatting/indentation is not the
    // thing under test, only which characters ended up inside vs. outside
    // the <mark>.
    expect(el.textContent?.replace(/\s+/g, ' ').trim()).toBe('Dark-first, token-driven.');
  });

  it('an empty query renders the text with no marks', async () => {
    const fixture = TestBed.createComponent(HighlightEmptyHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('mark')).toBeNull();
    expect(el.textContent?.replace(/\s+/g, ' ').trim()).toBe('Dark-first, token-driven.');
  });
});

describe('SpeedDial', () => {
  const create = async () => {
    const fixture = TestBed.createComponent(SpeedDialHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLButtonElement>('[data-slot="speed-dial-trigger"]');
    const actions = el.querySelector<HTMLElement>('[data-slot="speed-dial-actions"]');
    if (!trigger || !actions) throw new Error('SpeedDial did not render');
    return { fixture, el, trigger, actions };
  };

  it('opens on trigger click: aria-expanded flips and the actions lose inert', async () => {
    const { fixture, trigger, actions } = await create();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(actions.hasAttribute('inert')).toBe(true);

    trigger.click();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(actions.hasAttribute('inert')).toBe(false);

    trigger.click();
    await fixture.whenStable();
    expect(actions.hasAttribute('inert')).toBe(true);
  });

  it('a click outside closes it', async () => {
    const { fixture, el, trigger, actions } = await create();
    trigger.click();
    await fixture.whenStable();

    el.querySelector<HTMLElement>('#outside')?.click();
    await fixture.whenStable();
    expect(actions.hasAttribute('inert')).toBe(true);
  });

  it('Escape closes and returns focus to the trigger, consuming the event', async () => {
    const { fixture, trigger, actions } = await create();
    trigger.click();
    await fixture.whenStable();

    const action = actions.querySelector<HTMLElement>('[data-slot="speed-dial-action"]');
    action?.focus();
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    action?.dispatchEvent(escape);
    await fixture.whenStable();

    expect(actions.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(trigger);
    expect(escape.defaultPrevented).toBe(true);
  });

  it('focus leaving the whole component closes it', async () => {
    const { fixture, el, trigger, actions } = await create();
    trigger.click();
    await fixture.whenStable();

    const outside = el.querySelector<HTMLElement>('#outside');
    trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    await fixture.whenStable();
    expect(actions.hasAttribute('inert')).toBe(true);
  });
});
