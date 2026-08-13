import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { COLLAPSIBLE } from './collapsible';

@Component({
  imports: [COLLAPSIBLE],
  template: `
    <details xnCollapsible>
      <summary xnCollapsibleTrigger>
        Advanced options <span data-chevron aria-hidden="true">⌄</span>
      </summary>
      <p>Hidden until opened.</p>
    </details>
  `,
})
class Host {}

describe('Collapsible', () => {
  it('styles details/summary with the group chevron seam', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const details = (fixture.nativeElement as HTMLElement).querySelector('details');
    const summary = details?.querySelector('summary');

    expect(details?.dataset['slot']).toBe('collapsible');
    expect(details?.classList).toContain('group');
    expect(summary?.classList).toContain('group-open:[&>[data-chevron]]:rotate-180');
    expect(summary?.classList).toContain('[&::-webkit-details-marker]:hidden');

    // Toggle behavior is the platform's; we only assert the open reflection
    // our styling keys off. Real activation is browser-verified.
    details!.open = true;
    expect(details?.hasAttribute('open')).toBe(true);
  });
});
