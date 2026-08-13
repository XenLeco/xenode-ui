import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AVATAR } from './avatar';

@Component({
  imports: [AVATAR],
  template: `
    <span xnAvatar>
      <img xnAvatarImage src="missing.png" alt="Dan Leco" />
      <span xnAvatarFallback>DL</span>
    </span>
  `,
})
class Host {}

describe('Avatar', () => {
  it('renders image over fallback with the slot seams', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-slot="avatar"]')?.classList).toContain('rounded-full');
    expect(compiled.querySelector('[data-slot="avatar-image"]')?.classList).toContain('absolute');
    expect(compiled.querySelector('[data-slot="avatar-fallback"]')?.textContent?.trim()).toBe('DL');
  });

  it('hides the image on load error so the fallback shows', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    if (!img) throw new Error('No image rendered');

    expect(img.classList).not.toContain('hidden');
    img.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(img.classList).toContain('hidden');

    img.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(img.classList).not.toContain('hidden');
  });
});
