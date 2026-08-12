import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `<button xnButton (click)="clicks = clicks + 1">Save</button>`,
})
class PlainHost {
  clicks = 0;
}

@Component({
  imports: [Button],
  template: `<button xnButton variant="destructive" size="lg">Delete</button>`,
})
class VariantHost {}

@Component({
  imports: [Button],
  template: `<button xnButton class="bg-red-500">Custom</button>`,
})
class OverrideHost {}

@Component({
  imports: [Button],
  template: `<button xnButton disabled (click)="clicks = clicks + 1">Blocked</button>`,
})
class DisabledHost {
  clicks = 0;
}

async function render<T>(host: new () => T) {
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button');
  if (!button) throw new Error('No button rendered');
  return { fixture, button };
}

describe('Button', () => {
  it('renders default variant classes and the data-slot seam', async () => {
    const { button } = await render(PlainHost);
    expect(button.dataset['slot']).toBe('button');
    expect(button.classList).toContain('bg-primary');
    expect(button.classList).toContain('h-9');
  });

  it('resolves variant and size inputs', async () => {
    const { button } = await render(VariantHost);
    expect(button.classList).toContain('bg-destructive');
    expect(button.classList).toContain('h-10');
    expect(button.classList).not.toContain('bg-primary');
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const { button } = await render(OverrideHost);
    expect(button.classList).toContain('bg-red-500');
    expect(button.classList).not.toContain('bg-primary');
    // Non-conflicting defaults survive the merge.
    expect(button.classList).toContain('rounded-md');
  });

  it('keeps native non-interaction when disabled', async () => {
    const { fixture, button } = await render(DisabledHost);
    expect(button.disabled).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.clicks).toBe(0);
  });

  it('fires the consumer click handler when enabled', async () => {
    const { fixture, button } = await render(PlainHost);
    button.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('is axe-clean', async () => {
    const { fixture } = await render(PlainHost);
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
