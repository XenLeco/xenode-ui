import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { purgeOverlays } from '../../testing/overlay';

import { XN_HOVER_CARD } from './hover-card';

@Component({
  imports: [XN_HOVER_CARD],
  template: `
    <a href="/profile" [xnHoverCardTriggerFor]="card" openDelay="0" closeDelay="0">&#64;danleco</a>
    <ng-template #card="xnHoverCard" xnHoverCard>
      <div xnHoverCardPanel>Profile preview</div>
    </ng-template>
  `,
})
class Host {}

describe('HoverCard', () => {
  beforeEach(purgeOverlays);
  afterEach(purgeOverlays);

  const panel = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [data-slot="hover-card"]');
  const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

  it('opens on hover and closes on leave (zero delays for the test)', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('a');
    if (!trigger) throw new Error('No trigger rendered');
    expect(panel()).toBeNull();

    trigger.dispatchEvent(new Event('mouseenter'));
    await settle();
    await fixture.whenStable();
    expect(panel()?.textContent).toContain('Profile preview');

    trigger.dispatchEvent(new Event('mouseleave'));
    await settle();
    await fixture.whenStable();
    expect(panel()).toBeNull();
  });

  it('also opens on keyboard focus — hover is not the only path', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('a');

    trigger?.dispatchEvent(new Event('focus'));
    await settle();
    await fixture.whenStable();
    expect(panel()).toBeTruthy();
  });
});
