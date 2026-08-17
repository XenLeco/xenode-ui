import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DIALOG_DERIVATIVES } from './dialog-derivatives';

@Component({
  imports: [DIALOG_DERIVATIVES],
  template: `
    <dialog xnSheet side="top" aria-label="Top sheet">Top</dialog>
    <dialog xnSheet side="right" aria-label="Right sheet">Right</dialog>
  `,
})
class Host {}

describe('Sheet side="top"', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const sheets = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-slot="sheet"]',
    );
    return { top: sheets[0], right: sheets[1] };
  }

  it('pins to the top edge by margin override, sliding on the y axis', async () => {
    const { top } = await render();
    expect(top.classList).toContain('mb-auto');
    expect(top.classList).toContain('-translate-y-full');
    expect(top.classList).toContain('border-b');
    expect(top.classList).toContain('open:translate-y-0');
    expect(top.classList).not.toContain('translate-x-full');
  });

  it('flips the footprint to a full-width, height-capped panel', async () => {
    const { top } = await render();
    expect(top.classList).toContain('max-w-none');
    expect(top.classList).not.toContain('max-w-sm');
    expect(top.classList).toContain('max-h-[80dvh]');
    // tailwind-merge does NOT classify max-h-none into the max-h group;
    // if the base leaked it here, the cap would be dead in the cascade.
    expect(top.classList).not.toContain('max-h-none');
    expect(top.classList).not.toContain('h-dvh');
  });

  it('leaves the right/left translate axis untouched for the other sides', async () => {
    const { right } = await render();
    expect(right.classList).toContain('ml-auto');
    expect(right.classList).toContain('translate-x-full');
    expect(right.classList).toContain('border-l');
    expect(right.classList).toContain('open:translate-x-0');
    expect(right.classList).not.toContain('open:translate-y-0');
    expect(right.classList).toContain('h-dvh');
    expect(right.classList).toContain('max-w-sm');
  });
});
