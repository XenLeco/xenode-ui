import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XN_TABS } from './tabs';

/**
 * These specs cover ONLY the styling seam. Keyboard navigation, roving
 * tabindex and aria wiring are @angular/aria's contract, tested by
 * @angular/aria — the composition of both layers is covered by the
 * showcase page spec, where they are actually composed.
 */

@Component({
  imports: [XN_TABS],
  template: `
    <div xnTabs>
      <ul xnTabList>
        <li xnTab aria-selected="true">Active</li>
        <li xnTab aria-selected="false">Idle</li>
        <li xnTab aria-disabled="true">Locked</li>
      </ul>
      <div xnTabPanel>Visible panel</div>
      <div xnTabPanel inert>Hidden panel</div>
    </div>
  `,
})
class StylingHost {}

@Component({
  imports: [XN_TABS],
  template: `<ul xnTabList class="bg-red-500"></ul>`,
})
class OverrideHost {}

describe('Tabs styling family', () => {
  it('renders every slot with its data-slot seam and base classes', async () => {
    const fixture = TestBed.createComponent(StylingHost);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-slot="tabs"]')).toBeTruthy();
    expect(compiled.querySelector('[data-slot="tab-list"]')?.classList).toContain('bg-muted');
    expect(compiled.querySelector('[data-slot="tab"]')?.classList).toContain(
      'aria-selected:bg-background',
    );
    expect(compiled.querySelector('[data-slot="tab-panel"]')?.classList).toContain(
      '[&[inert]]:hidden',
    );
  });

  it('hides inert panels visually — the behavior layer only sets the attribute', async () => {
    const fixture = TestBed.createComponent(StylingHost);
    await fixture.whenStable();
    const panels = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-slot="tab-panel"]',
    );
    expect(panels[0].hasAttribute('inert')).toBe(false);
    expect(panels[1].hasAttribute('inert')).toBe(true);
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const fixture = TestBed.createComponent(OverrideHost);
    await fixture.whenStable();
    const list = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="tab-list"]');
    expect(list?.classList).toContain('bg-red-500');
    expect(list?.classList).not.toContain('bg-muted');
    expect(list?.classList).toContain('rounded-lg');
  });
});
