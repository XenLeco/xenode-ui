import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ScrollArea } from '../scroll-area/scroll-area';
import { DIALOG_DERIVATIVES } from './dialog-derivatives';

@Component({
  imports: [DIALOG_DERIVATIVES, ScrollArea],
  template: `
    <dialog xnAlertDialog aria-labelledby="ad-t"><h2 id="ad-t">Sure?</h2></dialog>
    <dialog xnSheet aria-label="Settings panel">Sheet</dialog>
    <dialog xnSheet side="left" aria-label="Nav panel" class="max-w-xs">Left sheet</dialog>
    <dialog xnDrawer aria-label="Details">Drawer</dialog>
    <div xnScrollArea class="h-24" tabindex="0" aria-label="Log output">tall content</div>
  `,
})
class Host {}

describe('Dialog derivatives & scroll area', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('alert dialog announces assertively on the same native shell', async () => {
    const el = await render();
    const alertDialog = el.querySelector('[data-slot="alert-dialog"]');
    expect(alertDialog?.getAttribute('role')).toBe('alertdialog');
    expect(alertDialog?.classList).toContain('open:grid');
    expect(alertDialog?.classList).toContain('backdrop:bg-black/50');
  });

  it('sheet pins to its side by margin override, drawer to the bottom', async () => {
    const el = await render();
    const sheets = el.querySelectorAll('[data-slot="sheet"]');
    expect(sheets[0].classList).toContain('ml-auto');
    expect(sheets[0].classList).toContain('border-l');
    expect(sheets[1].classList).toContain('mr-auto');
    expect(sheets[1].classList).toContain('max-w-xs');
    expect(sheets[1].classList).not.toContain('max-w-sm');
    expect(el.querySelector('[data-slot="drawer"]')?.classList).toContain('mt-auto');
  });

  it('scroll area styles the standard scrollbar properties', async () => {
    const el = await render();
    const area = el.querySelector('[data-slot="scroll-area"]');
    expect(area?.classList).toContain('[scrollbar-width:thin]');
    expect(area?.classList).toContain('h-24');
  });
});
