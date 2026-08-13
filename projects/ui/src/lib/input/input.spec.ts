import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Input } from './input';

@Component({
  imports: [Input],
  template: `
    <label for="email">Email</label>
    <input xnInput id="email" type="email" placeholder="you@example.com" />
  `,
})
class PlainHost {}

@Component({
  imports: [Input],
  template: `
    <label for="wide">Wide</label>
    <input xnInput id="wide" type="text" class="h-12" />
  `,
})
class OverrideHost {}

@Component({
  imports: [Input],
  template: `
    <label for="bad">With error</label>
    <input xnInput id="bad" type="text" aria-invalid="true" aria-describedby="bad-error" />
    <p id="bad-error">This field is required.</p>
  `,
})
class InvalidHost {}

async function render<T>(host: new () => T) {
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input');
  if (!inputEl) throw new Error('No input rendered');
  return { fixture, inputEl };
}

describe('Input', () => {
  it('renders base classes and the data-slot seam', async () => {
    const { inputEl } = await render(PlainHost);
    expect(inputEl.dataset['slot']).toBe('input');
    expect(inputEl.classList).toContain('border-input');
    expect(inputEl.classList).toContain('h-9');
  });

  it("merges the consumer's class last so it wins conflicts", async () => {
    const { inputEl } = await render(OverrideHost);
    expect(inputEl.classList).toContain('h-12');
    expect(inputEl.classList).not.toContain('h-9');
    expect(inputEl.classList).toContain('rounded-md');
  });

  it('carries the aria-driven state seam and preserves the ARIA linkage', async () => {
    const { inputEl } = await render(InvalidHost);
    expect(inputEl.getAttribute('aria-invalid')).toBe('true');
    expect(inputEl.getAttribute('aria-describedby')).toBe('bad-error');
    expect(inputEl.classList).toContain('aria-invalid:border-destructive');
  });

  it('is axe-clean with label and described-by error', async () => {
    const { fixture } = await render(InvalidHost);
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
