import { type Type } from '@angular/core';
import { DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { DOCS_ROUTES } from '../docs.routes';

import { SEARCH_INDEX } from './search-index';

/**
 * The palette index is hand-maintained; this suite is why it cannot drift.
 * Every entry is resolved against the page it points at, RENDERED: the id
 * must exist, the heading text must match, and the target must not be
 * buried in a closed dialog or inert panel (a link that scrolls nowhere).
 */
describe('SEARCH_INDEX', () => {
  const pagePaths = [...new Set(SEARCH_INDEX.map((entry) => entry.page))];

  it('covers every docs route exactly once', () => {
    const routePaths = DOCS_ROUTES.map((route) => route.path ?? '');
    expect([...pagePaths].sort()).toEqual([...routePaths].sort());
  });

  it('has a page-level entry (empty anchor) for every page', () => {
    for (const path of pagePaths) {
      const pageEntry = SEARCH_INDEX.find((entry) => entry.page === path && entry.anchor === '');
      expect(pageEntry, `page '${path || 'overview'}' has no top-level entry`).toBeTruthy();
      expect(pageEntry?.label).toBe(pageEntry?.pageLabel);
    }
  });

  for (const path of pagePaths) {
    const entries = SEARCH_INDEX.filter((entry) => entry.page === path && entry.anchor !== '');
    if (entries.length === 0) continue;

    it(`every anchor on '${path}' is a rendered, reachable h2`, async () => {
      const route = DOCS_ROUTES.find((candidate) => candidate.path === path);
      if (!route?.loadComponent) throw new Error(`No route for '${path}'`);
      const component = await (route.loadComponent as () => Promise<Type<unknown>>)();

      // Manual defer + noop animations: the charts page defers its engine
      // behind a viewport trigger jsdom cannot fire; its headings live
      // outside the blocks, which simply stay unrendered here.
      TestBed.configureTestingModule({
        deferBlockBehavior: DeferBlockBehavior.Manual,
        providers: [provideRouter([]), provideNoopAnimations()],
      });
      const fixture = TestBed.createComponent(component);
      await fixture.whenStable();
      const host = fixture.nativeElement as HTMLElement;

      for (const entry of entries) {
        const heading = host.querySelector(`h2[id="${entry.anchor}"]`);
        expect(heading, `#${entry.anchor} missing on '${path}'`).not.toBeNull();
        expect(heading?.textContent?.replace(/\s+/g, ' ').trim()).toBe(entry.label);
        expect(
          heading?.closest('dialog:not([open]), [inert]'),
          `#${entry.anchor} on '${path}' is hidden — the palette would scroll nowhere`,
        ).toBeNull();
      }
    });
  }
});
