import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Textarea } from './textarea';

@Component({
  imports: [Textarea],
  template: `
    <label for="notes">Notes</label>
    <textarea xnTextarea id="notes" class="min-h-32" aria-invalid="true"></textarea>
  `,
})
class Host {}

describe('Textarea', () => {
  it('mirrors the input contract on the native textarea', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('textarea');

    expect(el?.dataset['slot']).toBe('textarea');
    expect(el?.classList).toContain('border-input');
    expect(el?.classList).toContain('aria-invalid:border-destructive');
    expect(el?.classList).toContain('min-h-32');
    expect(el?.classList).not.toContain('min-h-16');
  });

  it('is axe-clean with its label', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
