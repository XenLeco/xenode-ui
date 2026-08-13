import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { CARD } from './card';

@Component({
  imports: [CARD],
  template: `
    <div xnCard>
      <div xnCardHeader>
        <h3 xnCardTitle>Server status</h3>
        <p xnCardDescription>Last checked a minute ago</p>
      </div>
      <div xnCardContent>All systems nominal.</div>
      <div xnCardFooter>Footer actions</div>
    </div>
  `,
})
class FullCardHost {}

@Component({
  imports: [CARD],
  template: `<div xnCard class="border-red-500">Override</div>`,
})
class OverrideHost {}

describe('Card family', () => {
  it('renders every slot with its data-slot seam and projected content in order', async () => {
    const fixture = TestBed.createComponent(FullCardHost);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const slots = [...compiled.querySelectorAll('[data-slot]')].map(
      (el) => (el as HTMLElement).dataset['slot'],
    );
    expect(slots).toEqual([
      'card',
      'card-header',
      'card-title',
      'card-description',
      'card-content',
      'card-footer',
    ]);

    expect(compiled.querySelector('[data-slot="card-title"]')?.tagName).toBe('H3');
    expect(compiled.querySelector('[data-slot="card"]')?.textContent).toContain(
      'All systems nominal.',
    );
  });

  it('applies the base classes per slot', async () => {
    const fixture = TestBed.createComponent(FullCardHost);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-slot="card"]')?.classList).toContain('bg-card');
    expect(compiled.querySelector('[data-slot="card-description"]')?.classList).toContain(
      'text-muted-foreground',
    );
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const fixture = TestBed.createComponent(OverrideHost);
    await fixture.whenStable();
    const card = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="card"]');
    expect(card?.classList).toContain('border-red-500');
    expect(card?.classList).toContain('bg-card');
  });

  it('is axe-clean', async () => {
    const fixture = TestBed.createComponent(FullCardHost);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
