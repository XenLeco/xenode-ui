import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ACTION_EXTRAS, CopyButton } from './action-extras/action-extras';
import { Dropzone } from './dropzone/dropzone';
import { FORM_EXTRAS } from './form-extras/form-extras';
import { INDICATOR } from './indicator/indicator';
import { INLINE_EXTRAS } from './inline-extras/inline-extras';
import { LIST_GROUP } from './list-group/list-group';
import { MOCKUPS } from './mockups/mockups';
import { RadialProgress } from './radial-progress/radial-progress';
import { Scrollspy } from './scrollspy/scrollspy';
import { SEGMENTED } from './segmented/segmented';

/** Render coverage + the logic-bearing behaviors for the parity wave. */

@Component({
  imports: [
    LIST_GROUP,
    INDICATOR,
    RadialProgress,
    MOCKUPS,
    INLINE_EXTRAS,
    SEGMENTED,
    Dropzone,
    Scrollspy,
    FORM_EXTRAS,
    ACTION_EXTRAS,
  ],
  template: `
    <ul xnListGroup>
      <li xnListGroupItem aria-current="true">Active</li>
      <li xnListGroupItem>Plain</li>
    </ul>

    <span xnIndicator>
      <span xnIndicatorItem position="top-end">3</span>
      <button type="button">Inbox</button>
    </span>

    <span xnRadialProgress value="70" aria-label="Storage used">70%</span>

    <div xnMockupWindow>
      <div xnMockupBar>danleco.dev</div>
      <pre xnTerminal aria-label="Terminal example"><span xnTerminalLine>npm test</span><span
        xnTerminalLine kind="output">201 passing</span></pre>
      <div xnDiff aria-label="Diff example">
        <span xnDiffLine kind="removed">--ring: oklch(0.708 0 0);</span>
        <span xnDiffLine kind="added">--ring: oklch(0.62 0 0);</span>
        <span xnDiffLine kind="context">--radius: 0.5rem;</span>
      </div>
    </div>

    <p><mark xnMark>highlighted</mark> <span xnColorSwatch color="oklch(0.62 0 0)" aria-label="Ring grey"></span></p>
    <div xnSpoiler #spoiler="xnSpoiler"><p>Long content…</p></div>
    <button type="button" (click)="spoiler.expanded.set(!spoiler.expanded())">More</button>

    <fieldset xnSegmented>
      <legend class="sr-only">View</legend>
      <label xnSegmentedOption><input type="radio" name="view" checked /> List</label>
      <label xnSegmentedOption><input type="radio" name="view" /> Grid</label>
    </fieldset>

    <div xnDropzone (files)="dropped = $event">
      Drop files
      <input type="file" aria-label="Upload file" />
    </div>

    <main xnScrollspy #spy="xnScrollspy"><section id="s1">One</section></main>

    <input xnPasswordInput #pw="xnPasswordInput" [type]="pw.visible() ? 'text' : 'password'" aria-label="Password" />
    <button type="button" (click)="pw.toggle()" [attr.aria-pressed]="pw.visible()">Show password</button>
    <input xnFileInput type="file" aria-label="Attach save file" />
    <div xnFloatingLabel>
      <input id="fl" placeholder=" " class="h-12 w-full rounded-md border border-input px-3" />
      <label for="fl">Server name</label>
    </div>

    <button [xnCopyButton]="'npm i @xenode/ui'" aria-label="Copy install command">Copy</button>
    <button xnFab aria-label="New server">+</button>
    <div class="relative">
      busy content
      <div xnLoadingOverlay><span>Loading…</span></div>
    </div>
    <span xnVisuallyHidden>screen reader only</span>
  `,
})
class Host {
  dropped: FileList | null = null;
}

const SLOTS = [
  'list-group', 'list-group-item', 'indicator', 'indicator-item', 'radial-progress',
  'mockup-window', 'mockup-bar', 'terminal', 'terminal-line', 'diff', 'diff-line',
  'mark', 'color-swatch', 'spoiler', 'segmented', 'segmented-option', 'dropzone', 'scrollspy',
  'password-input', 'file-input', 'floating-label', 'copy-button', 'fab', 'loading-overlay',
  'visually-hidden',
];

describe('Parity wave', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders every slot seam', async () => {
    const { el } = await render();
    for (const slot of SLOTS) {
      expect(el.querySelector(`[data-slot="${slot}"]`), slot).toBeTruthy();
    }
  });

  it('radial progress exposes value through aria and draws the arc', async () => {
    const { el } = await render();
    const radial = el.querySelector('[data-slot="radial-progress"]');
    expect(radial?.getAttribute('role')).toBe('progressbar');
    expect(radial?.getAttribute('aria-valuenow')).toBe('70');
    expect(radial?.querySelectorAll('circle')[1]?.getAttribute('stroke-dasharray')).toBe('70 100');
  });

  it('dropzone tracks drag state and emits dropped files', async () => {
    const { fixture, el } = await render();
    const zone = el.querySelector<HTMLElement>('[data-slot="dropzone"]');
    if (!zone) throw new Error('No dropzone');

    zone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(zone.getAttribute('data-drag-active')).toBe('true');

    const fakeFiles = { length: 1, 0: new File(['x'], 'x.txt') } as unknown as FileList;
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', { value: { files: fakeFiles } });
    zone.dispatchEvent(drop);
    await fixture.whenStable();
    expect(zone.getAttribute('data-drag-active')).toBe('false');
    expect(fixture.componentInstance.dropped).toBe(fakeFiles);
  });

  it('spoiler clamps until expanded via its model', async () => {
    const { fixture, el } = await render();
    const spoiler = el.querySelector<HTMLElement>('[data-slot="spoiler"]');
    expect(spoiler?.classList).toContain('max-h-24');

    el.querySelectorAll('button')[1].click();
    await fixture.whenStable();
    expect(spoiler?.getAttribute('data-expanded')).toBe('true');
    expect(spoiler?.classList).toContain('max-h-none');
  });

  it('password input toggles its type through the exported directive', async () => {
    const { fixture, el } = await render();
    const password = el.querySelector<HTMLInputElement>('[data-slot="password-input"]');
    expect(password?.type).toBe('password');

    [...el.querySelectorAll('button')].find((b) => b.textContent?.includes('Show password'))?.click();
    await fixture.whenStable();
    expect(password?.type).toBe('text');
  });

  it('copy button writes to the clipboard and flips its copied state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { fixture, el } = await render();
    const copy = el.querySelector<HTMLButtonElement>('[data-slot="copy-button"]');

    copy?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    await fixture.whenStable();
    expect(writeText).toHaveBeenCalledWith('npm i @xenode/ui');
    expect(copy?.getAttribute('data-copied')).toBe('true');
    expect(typeof CopyButton.prototype.constructor).toBe('function');
  });
});
