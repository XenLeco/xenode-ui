import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { NumberField, NumberInput } from './number-input';

@Component({
  imports: [NumberInput],
  template: `
    <label for="qty">Quantity</label>
    <input xnNumberInput type="number" id="qty" class="w-20" />
  `,
})
class PlainHost {}

@Component({
  imports: [NumberField],
  template: `
    <xn-number-field
      [(value)]="value"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      ariaLabel="Players"
      decrementLabel="Fewer players"
      incrementLabel="More players"
    />
  `,
})
class FieldHost {
  readonly value = signal(4);
  readonly min = signal<number | undefined>(1);
  readonly max = signal<number | undefined>(8);
  readonly step = signal(1);
}

const createField = async (setup?: (host: FieldHost) => void) => {
  const fixture = TestBed.createComponent(FieldHost);
  if (setup) setup(fixture.componentInstance);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  return { fixture, host: fixture.componentInstance, el };
};

describe('NumberInput', () => {
  it('stays a real number input, hides spinners cross-browser, consumer class wins', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input');

    expect(input?.dataset['slot']).toBe('number-input');
    expect(input?.type).toBe('number');
    expect(input?.classList).toContain('[appearance:textfield]');
    expect(input?.classList).toContain('w-20');
  });
});

describe('NumberField', () => {
  it('renders +/- buttons as type=button with the configured labels', async () => {
    const { el } = await createField();
    const dec = el.querySelector<HTMLButtonElement>('[data-slot="number-field-decrement"]');
    const inc = el.querySelector<HTMLButtonElement>('[data-slot="number-field-increment"]');

    expect(dec?.type).toBe('button');
    expect(dec?.getAttribute('aria-label')).toBe('Fewer players');
    expect(inc?.type).toBe('button');
    expect(inc?.getAttribute('aria-label')).toBe('More players');
  });

  it('increment/decrement step the value model', async () => {
    const { el, host, fixture } = await createField();
    el.querySelector<HTMLButtonElement>('[data-slot="number-field-increment"]')?.click();
    await fixture.whenStable();
    expect(host.value()).toBe(5);

    el.querySelector<HTMLButtonElement>('[data-slot="number-field-decrement"]')?.click();
    await fixture.whenStable();
    expect(host.value()).toBe(4);
  });

  it('at max: aria-disabled but NOT disabled, and the click is a guarded no-op', async () => {
    const { el, host, fixture } = await createField((h) => h.value.set(8));
    const inc = el.querySelector<HTMLButtonElement>('[data-slot="number-field-increment"]');

    expect(inc?.getAttribute('aria-disabled')).toBe('true');
    expect(inc?.disabled).toBe(false); // stays in the tab order, focus can't fall off it

    inc?.click();
    await fixture.whenStable();
    expect(host.value()).toBe(8);
  });

  it('at min: aria-disabled but NOT disabled, and the click is a guarded no-op', async () => {
    const { el, host, fixture } = await createField((h) => h.value.set(1));
    const dec = el.querySelector<HTMLButtonElement>('[data-slot="number-field-decrement"]');

    expect(dec?.getAttribute('aria-disabled')).toBe('true');
    expect(dec?.disabled).toBe(false);

    dec?.click();
    await fixture.whenStable();
    expect(host.value()).toBe(1);
  });

  it('neither button is aria-disabled away from the boundary', async () => {
    const { el } = await createField((h) => h.value.set(4));
    const dec = el.querySelector('[data-slot="number-field-decrement"]');
    const inc = el.querySelector('[data-slot="number-field-increment"]');

    expect(dec?.getAttribute('aria-disabled')).toBeNull();
    expect(inc?.getAttribute('aria-disabled')).toBeNull();
  });

  it('typing a valid number updates the model live; an out-of-range value clamps on blur', async () => {
    const { el, host, fixture } = await createField();
    const input = el.querySelector('input');
    if (!input) throw new Error('No input rendered');

    input.value = '6';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value()).toBe(6);

    input.value = '99';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value()).toBe(99); // not clamped mid-type

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.value()).toBe(8); // clamped once the field settles
  });

  it('an incomplete typed value ("-") is left uncommitted, not coerced to NaN/0', async () => {
    const { el, host, fixture } = await createField();
    const input = el.querySelector('input');
    if (!input) throw new Error('No input rendered');

    input.value = '-';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value()).toBe(4); // untouched — still the last committed value
  });

  it('blurring a cleared field restores the rendered value, not just the model', async () => {
    const { el, host, fixture } = await createField();
    const input = el.querySelector('input');
    if (!input) throw new Error('No input rendered');

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    // Committing the unchanged model is a no-change signal write — the
    // [value] binding never re-renders, so the DOM must be written back
    // directly or the field stays visibly empty over a non-empty model.
    expect(host.value()).toBe(4);
    expect(input.value).toBe('4');
  });

  it('Enter commits and clamps before a form could submit', async () => {
    const { el, host, fixture } = await createField();
    const input = el.querySelector('input');
    if (!input) throw new Error('No input rendered');

    input.value = '99';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(host.value()).toBe(8);
    expect(input.value).toBe('8');
  });

  it('is axe-clean with its aria-label', async () => {
    const { fixture } = await createField();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
