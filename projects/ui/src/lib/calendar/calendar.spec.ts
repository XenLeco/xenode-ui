import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Calendar } from './calendar';

@Component({
  imports: [Calendar],
  template: `
    <xn-calendar
      [(value)]="value"
      [defaultMonth]="defaultMonth()"
      [min]="min()"
      [max]="max()"
      [weekStartsOn]="weekStartsOn()"
    />
  `,
})
class Host {
  readonly value = signal<string | undefined>(undefined);
  readonly defaultMonth = signal<string | undefined>('2026-02');
  readonly min = signal<string | undefined>(undefined);
  readonly max = signal<string | undefined>(undefined);
  readonly weekStartsOn = signal<number | string>(1);
}

const create = async (setup?: (host: Host) => void) => {
  const fixture = TestBed.createComponent(Host);
  if (setup) setup(fixture.componentInstance);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  return { fixture, host: fixture.componentInstance, el };
};

const allDays = (el: HTMLElement) => [
  ...el.querySelectorAll<HTMLElement>('[data-slot="calendar-day"]'),
];
const inMonthDays = (el: HTMLElement) =>
  allDays(el).filter((cell) => !cell.hasAttribute('data-outside'));
const monthLabel = (el: HTMLElement) =>
  el.querySelector('[data-slot="calendar-month"]')?.textContent?.trim();

describe('Calendar', () => {
  it('renders seven weekday headers honoring weekStartsOn', async () => {
    const { el, host, fixture } = await create();
    const headers = () => [...el.querySelectorAll('[data-slot="calendar-weekdays"] span')];
    expect(headers().length).toBe(7);
    expect(headers()[0].textContent?.trim()).toBe('Mon');
    expect(headers()[6].textContent?.trim()).toBe('Sun');

    host.weekStartsOn.set(0);
    await fixture.whenStable();
    expect(headers()[0].textContent?.trim()).toBe('Sun');

    // A typo'd attribute must fall back, not build Invalid Dates.
    host.weekStartsOn.set('mon');
    await fixture.whenStable();
    expect(headers()[0].textContent?.trim()).toBe('Mon');
  });

  it('aligns the grid: Feb 2026 (starts Sunday) has exactly 6 leading outside days', async () => {
    const { el } = await create();
    const days = allDays(el);
    const leadingOutside = days.findIndex((cell) => !cell.hasAttribute('data-outside'));
    expect(leadingOutside).toBe(6);
    expect(days[0].getAttribute('data-iso')).toBe('2026-01-26');
    expect(days[6].getAttribute('data-iso')).toBe('2026-02-01');
  });

  it('gets month lengths right; Feb 29 is the last in-month cell of a leap February', async () => {
    const { el, host, fixture } = await create();
    expect(inMonthDays(el).length).toBe(28); // 2026-02

    host.defaultMonth.set('2024-02');
    await fixture.whenStable();
    const days = inMonthDays(el);
    expect(days.length).toBe(29);
    expect(days[days.length - 1].getAttribute('data-iso')).toBe('2024-02-29');
  });

  it('renders a 4-row month with zero outside days (Feb 2027 starts Monday)', async () => {
    const { el } = await create((host) => host.defaultMonth.set('2027-02'));
    expect(el.querySelectorAll('tbody tr').length).toBe(4);
    expect(allDays(el).length).toBe(28);
    expect(el.querySelectorAll('[data-outside]').length).toBe(0);
  });

  it('exposes the grid contract: roles, roving tabindex, full-date labels', async () => {
    const { el } = await create((host) => host.value.set('2026-02-14'));
    expect(el.querySelector('table')?.getAttribute('role')).toBe('grid');
    expect(el.querySelectorAll('tr[role="row"]').length).toBeGreaterThanOrEqual(5);
    const days = allDays(el);
    expect(days.every((cell) => cell.getAttribute('role') === 'gridcell')).toBe(true);
    expect(days.filter((cell) => cell.tabIndex === 0).length).toBe(1);
    const selected = el.querySelector('[data-slot="calendar-day"][aria-selected="true"]');
    expect(selected?.getAttribute('aria-label')).toBe('Saturday, February 14, 2026');
  });

  it('the value pins the visible month and marks the selected cell', async () => {
    const { el } = await create((host) => host.value.set('2026-08-14'));
    expect(monthLabel(el)).toContain('August 2026');
    const selected = el.querySelector('[data-slot="calendar-day"][aria-selected="true"]');
    expect(selected?.textContent?.trim()).toBe('14');
  });

  it('clicking a day commits it to the value model', async () => {
    const { el, host, fixture } = await create();
    inMonthDays(el)
      .find((cell) => cell.textContent?.trim() === '17')
      ?.click();
    await fixture.whenStable();
    expect(host.value()).toBe('2026-02-17');
  });

  it('a second activation of the selected day keeps both the value AND the highlight', async () => {
    const { el, host, fixture } = await create();
    const day17 = () => inMonthDays(el).find((cell) => cell.textContent?.trim() === '17');
    day17()?.click();
    await fixture.whenStable();
    expect(host.value()).toBe('2026-02-17');

    // The grid's toggle deselects the cell model directly; the calendar
    // must write the truth back or aria-selected desyncs from the value.
    day17()?.click();
    await fixture.whenStable();
    expect(host.value()).toBe('2026-02-17');
    expect(day17()?.getAttribute('aria-selected')).toBe('true');
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
    const { el } = await create();
    const outside = el.querySelectorAll('[data-slot="calendar-day"][data-outside]');
    expect(outside.length).toBeGreaterThan(0);
    for (const cell of outside) {
      expect(cell.getAttribute('aria-disabled')).toBe('true');
    }
  });

  it('pages across year boundaries in both directions without touching the value', async () => {
    const { el, host, fixture } = await create((h) => {
      h.value.set('2026-01-10');
    });
    el.querySelector<HTMLElement>('[data-slot="calendar-prev"]')?.click();
    await fixture.whenStable();
    expect(monthLabel(el)).toContain('December 2025');

    el.querySelector<HTMLElement>('[data-slot="calendar-next"]')?.click();
    await fixture.whenStable();
    expect(monthLabel(el)).toContain('January 2026');
    expect(host.value()).toBe('2026-01-10');
  });

  it('survives an empty-string value (cleared input) without throwing', async () => {
    const { el } = await create((host) => {
      host.value.set('');
      host.defaultMonth.set(undefined);
    });
    // '' must fall through the anchor chain instead of becoming an
    // Invalid Date inside Intl.format.
    expect(monthLabel(el)).toBeTruthy();
    expect(allDays(el).length).toBeGreaterThanOrEqual(28);
  });
});
