import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { ALERT } from './alert';
import { alertVariants } from './alert-variants';

describe('alertVariants (pure)', () => {
  it('resolves both variants without interactive-state styling', () => {
    expect(alertVariants()).toContain('bg-card');
    expect(alertVariants({ variant: 'destructive' })).toContain('bg-destructive');
    expect(alertVariants({ variant: 'destructive' })).not.toContain('focus-visible:');
  });
});

@Component({
  imports: [ALERT],
  template: `
    <div xnAlert variant="destructive" class="rounded-none">
      <h5 xnAlertTitle>Deploy failed</h5>
      <div xnAlertDescription><p>The build step exited non-zero.</p></div>
    </div>
  `,
})
class Host {}

describe('Alert', () => {
  it('renders the live region with slots, variant, and consumer class winning', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const alert = compiled.querySelector('[data-slot="alert"]');

    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.classList).toContain('bg-destructive');
    expect(alert?.classList).toContain('rounded-none');
    expect(alert?.classList).not.toContain('rounded-lg');
    expect(compiled.querySelector('[data-slot="alert-title"]')?.textContent).toContain(
      'Deploy failed',
    );
    expect(compiled.querySelector('[data-slot="alert-description"]')).toBeTruthy();
  });

  it('is axe-clean', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
