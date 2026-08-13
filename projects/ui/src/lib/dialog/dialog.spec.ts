import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DIALOG } from './dialog';

@Component({
  imports: [DIALOG],
  template: `
    <dialog xnDialog class="max-w-sm" aria-labelledby="t">
      <div xnDialogHeader>
        <h2 xnDialogTitle id="t">Confirm</h2>
        <p xnDialogDescription>This cannot be undone.</p>
      </div>
      <div xnDialogFooter>
        <button type="button">Close</button>
      </div>
    </dialog>
  `,
})
class Host {}

describe('Dialog', () => {
  it('styles the native element with scoped open display and backdrop', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog');

    expect(dialog?.dataset['slot']).toBe('dialog');
    expect(dialog?.classList).toContain('open:grid');
    expect(dialog?.classList).toContain('backdrop:bg-black/50');
    expect(dialog?.classList).toContain('max-w-sm');
    expect(dialog?.classList).not.toContain('max-w-lg');
  });

  it('renders the slot family', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    for (const slot of ['dialog-header', 'dialog-title', 'dialog-description', 'dialog-footer']) {
      expect(compiled.querySelector(`[data-slot="${slot}"]`), slot).toBeTruthy();
    }
  });

  // show()/showModal()/close() are platform behavior jsdom does not
  // implement — like @angular/aria's keyboard nav, we do not test the
  // platform. Open/close, focus trapping and Esc are exercised against the
  // real browser (docs/a11y/overlays.md).
});
