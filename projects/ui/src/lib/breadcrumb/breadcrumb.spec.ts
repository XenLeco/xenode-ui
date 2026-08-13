import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { BREADCRUMB } from './breadcrumb';

@Component({
  imports: [BREADCRUMB],
  template: `
    <nav xnBreadcrumb>
      <ol xnBreadcrumbList>
        <li xnBreadcrumbItem>
          <a xnBreadcrumbLink href="/">Home</a>
        </li>
        <li xnBreadcrumbSeparator>/</li>
        <li xnBreadcrumbItem>
          <span xnBreadcrumbPage>Components</span>
        </li>
      </ol>
    </nav>
  `,
})
class Host {}

describe('Breadcrumb family', () => {
  it('wires the landmark, current page, and hides separators from AT', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('nav')?.getAttribute('aria-label')).toBe('breadcrumb');
    expect(compiled.querySelector('[data-slot="breadcrumb-page"]')?.getAttribute('aria-current')).toBe(
      'page',
    );
    const separator = compiled.querySelector('[data-slot="breadcrumb-separator"]');
    expect(separator?.getAttribute('aria-hidden')).toBe('true');
    expect(separator?.getAttribute('role')).toBe('presentation');
  });

  it('is axe-clean', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
