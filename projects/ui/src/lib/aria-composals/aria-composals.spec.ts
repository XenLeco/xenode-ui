import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XnListboxOption } from './aria-composals';

@Component({
  imports: [XnListboxOption],
  template: `<div xnListboxOption>Option</div>`,
})
class Host {}

describe('XnListboxOption', () => {
  it('styles the active-descendant keyboard cursor, not just focus', async () => {
    // In a composed combobox (focusMode="activedescendant") the option
    // NEVER receives focus — the active row is marked only by the
    // data-active attribute @angular/aria writes. Losing these two
    // utilities makes arrow-key navigation invisible while every
    // behavior test stays green, so the class string itself is pinned.
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const option = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="listbox-option"]',
    );
    expect(option?.className).toContain('data-[active=true]:bg-accent');
    expect(option?.className).toContain('data-[active=true]:text-accent-foreground');
  });
});
