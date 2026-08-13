import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Progress } from './progress';

@Component({
  imports: [Progress],
  template: `<div xnProgress [value]="value()" aria-label="Build progress"></div>`,
})
class Host {
  readonly value = signal(60);
}

@Component({
  imports: [Progress],
  template: `<div xnProgress value="250" max="200" aria-label="Clamped"></div>`,
})
class ClampHost {}

describe('Progress', () => {
  it('exposes value through aria and moves the indicator', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="progress"]');
    const indicator = bar?.querySelector<HTMLElement>('[data-slot="progress-indicator"]');

    expect(bar?.getAttribute('role')).toBe('progressbar');
    expect(bar?.getAttribute('aria-valuenow')).toBe('60');
    expect(bar?.getAttribute('aria-valuemax')).toBe('100');
    expect(indicator?.style.transform).toBe('translateX(-40%)');
  });

  it('updates reactively when the input changes', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.componentInstance.value.set(90);
    await fixture.whenStable();
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="progress"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe('90');
    expect(
      bar?.querySelector<HTMLElement>('[data-slot="progress-indicator"]')?.style.transform,
    ).toBe('translateX(-10%)');
  });

  it('coerces attribute strings and clamps to max', async () => {
    const fixture = TestBed.createComponent(ClampHost);
    await fixture.whenStable();
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="progress"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe('200');
    expect(bar?.getAttribute('aria-valuemax')).toBe('200');
  });

  it('is axe-clean with its accessible name', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
