import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XN_DROPDOWN } from './dropdown';

/** Styling seam only — behavior composition is covered on the showcase. */

@Component({
  imports: [XN_DROPDOWN],
  template: `
    <div xnDropdown>
      <button type="button">Open</button>
      <div xnMenu class="min-w-56">
        <div xnMenuItem>Edit</div>
        <div xnMenuItem aria-disabled="true">Delete</div>
      </div>
    </div>
  `,
})
class Host {}

describe('Dropdown styling family', () => {
  it('positions the menu under a relative wrapper and hides inert menus', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[data-slot="dropdown"]')?.classList).toContain('relative');
    const menu = el.querySelector('[data-slot="menu"]');
    expect(menu?.classList).toContain('absolute');
    expect(menu?.classList).toContain('[&[inert]]:hidden');
    expect(menu?.classList).toContain('min-w-56');
    expect(menu?.classList).not.toContain('min-w-40');
    expect(el.querySelectorAll('[data-slot="menu-item"]').length).toBe(2);
  });
});
