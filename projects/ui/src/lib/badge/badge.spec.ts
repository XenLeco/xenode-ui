import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Badge } from './badge';

@Component({
  imports: [Badge],
  template: `<span xnBadge>New</span>`,
})
class PlainHost {}

@Component({
  imports: [Badge],
  template: `<span xnBadge variant="destructive">Breaking</span>`,
})
class VariantHost {}

@Component({
  imports: [Badge],
  template: `<span xnBadge class="bg-red-500">Custom</span>`,
})
class OverrideHost {}

async function render<T>(host: new () => T) {
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  const badge = (fixture.nativeElement as HTMLElement).querySelector('span');
  if (!badge) throw new Error('No badge rendered');
  return { fixture, badge };
}

describe('Badge', () => {
  it('renders default variant classes and the data-slot seam', async () => {
    const { badge } = await render(PlainHost);
    expect(badge.dataset['slot']).toBe('badge');
    expect(badge.classList).toContain('bg-primary');
    expect(badge.textContent?.trim()).toBe('New');
  });

  it('resolves the variant input', async () => {
    const { badge } = await render(VariantHost);
    expect(badge.classList).toContain('bg-destructive');
    expect(badge.classList).not.toContain('bg-primary');
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const { badge } = await render(OverrideHost);
    expect(badge.classList).toContain('bg-red-500');
    expect(badge.classList).not.toContain('bg-primary');
    expect(badge.classList).toContain('rounded-md');
  });

  it('is not focusable — badges must stay out of the tab order', async () => {
    const { badge } = await render(PlainHost);
    expect(badge.tabIndex).toBeLessThan(0);
  });

  it('is axe-clean', async () => {
    const { fixture } = await render(PlainHost);
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
