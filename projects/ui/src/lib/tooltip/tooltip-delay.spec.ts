import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { purgeOverlays } from '../../testing/overlay';

import { Tooltip, TooltipContent } from './tooltip';

@Component({
  imports: [Tooltip],
  template: `<button type="button" xnTooltip="Delayed tip" [showDelay]="30">Hover</button>`,
})
class DelayedHost {}

describe('Tooltip showDelay', () => {
  beforeEach(purgeOverlays);
  afterEach(purgeOverlays);

  const tooltipEl = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [data-slot="tooltip"]');

  async function render() {
    const fixture = TestBed.createComponent(DelayedHost);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    if (!button) throw new Error('No trigger rendered');
    return { fixture, button };
  }

  it('does not show immediately when a delay is set', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('mouseenter'));
    await fixture.whenStable();
    expect(tooltipEl()).toBeNull();
  });

  it('shows once the delay elapses', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('mouseenter'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fixture.whenStable();
    expect(tooltipEl()?.textContent).toContain('Delayed tip');
  });

  it('cancels the pending show on mouseleave before the delay elapses', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('mouseenter'));
    button.dispatchEvent(new Event('mouseleave'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fixture.whenStable();
    expect(tooltipEl()).toBeNull();
  });

  it('cancels the pending show on blur before the delay elapses', async () => {
    const { fixture, button } = await render();
    button.dispatchEvent(new Event('focus'));
    button.dispatchEvent(new Event('blur'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fixture.whenStable();
    expect(tooltipEl()).toBeNull();
  });

  it('defaults showDelay to 0 (immediate) when unset', async () => {
    @Component({
      imports: [Tooltip],
      template: `<button type="button" xnTooltip="Instant">Hover</button>`,
    })
    class InstantHost {}

    const fixture = TestBed.createComponent(InstantHost);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    button.dispatchEvent(new Event('mouseenter'));
    await fixture.whenStable();
    expect(tooltipEl()).toBeTruthy();
  });
});

describe('TooltipContent arrow', () => {
  function render() {
    return TestBed.createComponent(TooltipContent);
  }

  it('renders a rotated-square arrow filled to match the bubble', async () => {
    const fixture = render();
    await fixture.whenStable();
    const arrow = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="tooltip-arrow"]',
    );
    expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    expect(arrow?.classList).toContain('bg-primary');
    expect(arrow?.classList).toContain('rotate-45');
  });

  it('sits at the bottom edge when the bubble is above the trigger (side=top)', async () => {
    const fixture = render();
    fixture.componentRef.setInput('side', 'top');
    await fixture.whenStable();
    const arrow = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="tooltip-arrow"]',
    );
    expect(arrow?.classList).toContain('-bottom-1');
    expect(arrow?.classList).not.toContain('-top-1');
  });

  it('sits at the top edge when the bubble is below the trigger (side=bottom)', async () => {
    const fixture = render();
    fixture.componentRef.setInput('side', 'bottom');
    await fixture.whenStable();
    const arrow = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="tooltip-arrow"]',
    );
    expect(arrow?.classList).toContain('-top-1');
    expect(arrow?.classList).not.toContain('-bottom-1');
  });
});
