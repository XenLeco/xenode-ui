import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Calendar } from './calendar';

@Component({
  imports: [Calendar],
  template: `
    <xn-calendar [(value)]="value" [defaultMonth]="defaultMonth()" [min]="min()" [max]="max()" />
  `,
})
class Host {
  readonly value = signal<string | undefined>(undefined);
  readonly defaultMonth = signal<string | undefined>('2026-02');
  readonly min = signal<string | undefined>(undefined);
  readonly max = signal<string | undefined>(undefined);
}

const create = async (setup?: (host: Host) => void) => {
  const fixture = TestBed.createComponent(Host);
  if (setup) setup(fixture.componentInstance);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  return { fixture, host: fixture.componentInstance, el };
};

const inMonthDays = (el: HTMLElement) => [
  ...el.querySelectorAll<HTMLElement>('[data-slot="calendar-day"]:not([data-outside])'),
];

describe('Calendar', () => {
  it('renders seven weekday headers, Monday-first by default', async () => {
    const { el } = await create();
    const headers = [...el.querySelectorAll('th')];
    expect(headers.length).toBe(7);
    expect(headers[0].textContent?.trim()).toBe('Mon');
    expect(headers[6].textContent?.trim()).toBe('Sun');
  });

  it('gets month lengths right, leap years included', async () => {
    const { el, host, fixture } = await create();
    expect(inMonthDays(el).length).toBe(28); // 2026-02

    host.defaultMonth.set('2024-02');
    await fixture.whenStable();
    expect(inMonthDays(el).length).toBe(29); // leap
  });

  it('the value pins the visible month and marks the selected cell', async () => {
    const { el } = await create((host) => host.value.set('2026-08-14'));
    expect(el.querySelector('[data-slot="calendar-month"]')?.textContent).toContain('August 2026');
    const selected = el.querySelector('[data-slot="calendar-day"][aria-selected="true"]');
    expect(selected?.textContent?.trim()).toBe('14');
  });

  it('clicking a day commits it to the value model', async () => {
    const { el, host, fixture } = await create();
    const day = inMonthDays(el).find((cell) => cell.textContent?.trim() === '17');
    day?.click();
    await fixture.whenStable();
    expect(host.value()).toBe('2026-02-17');
  });

  it('min/max disable out-of-range days but keep them in the grid', async () => {
    const { el } = await create((host) => {
      host.min.set('2026-02-10');
      host.max.set('2026-02-20');
    });
    const day = (label: string) =>
      inMonthDays(el).find((cell) => cell.textContent?.trim() === label);
    expect(day('9')?.getAttribute('aria-disabled')).toBe('true');
    expect(day('10')?.getAttribute('aria-disabled')).not.toBe('true');
    expect(day('21')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('adjacent-month days render muted and disabled', async () => {
    const { el } = await create(); // Feb 2026 starts on a Sunday — Monday-first leaves 6 leading cells
    const outside = el.querySelectorAll('[data-slot="calendar-day"][data-outside]');
    expect(outside.length).toBeGreaterThan(0);
    for (const cell of outside) {
      expect(cell.getAttribute('aria-disabled')).toBe('true');
    }
  });

  it('prev/next buttons page the month without touching the value', async () => {
    const { el, host, fixture } = await create((h) => h.value.set('2026-08-14'));
    el.querySelector<HTMLElement>('[data-slot="calendar-prev"]')?.click();
    await fixture.whenStable();
    expect(el.querySelector('[data-slot="calendar-month"]')?.textContent).toContain('July 2026');
    expect(host.value()).toBe('2026-08-14');
  });
});
