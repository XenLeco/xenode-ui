import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { formatHex, parse } from 'culori';

import { CHART_FALLBACK_COLORS, ChartCard } from './chart';

@Component({
  imports: [ChartCard],
  template: `<div xnChartCard aria-label="Players per server" class="h-72">chart here</div>`,
})
class Host {}

describe('chart tokens', () => {
  it('the SSR fallback palette IS the dark-mode tokens (culori-locked)', () => {
    const css = readFileSync(join(process.cwd(), 'projects/ui/theme.css'), 'utf8');
    const darkBlock = css.match(/\.dark\s*\{([^}]*)\}/)?.[1] ?? '';
    const tokens = [1, 2, 3, 4, 5].map((i) =>
      darkBlock.match(new RegExp(`--chart-${i}:\\s*([^;]+);`))?.[1].trim(),
    );

    expect(tokens.every(Boolean), 'all five dark --chart-* tokens declared').toBe(true);
    tokens.forEach((token, i) => {
      expect(formatHex(parse(token as string)), `--chart-${i + 1}`).toBe(CHART_FALLBACK_COLORS[i]);
    });
  });
});

describe('ChartCard', () => {
  it('names itself as a figure and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const card = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="chart-card"]',
    );

    expect(card?.getAttribute('role')).toBe('figure');
    expect(card?.getAttribute('aria-label')).toBe('Players per server');
    expect(card?.classList).toContain('h-72');
    expect(card?.classList).toContain('bg-card');
  });

  it('serves the drift-locked fallback scheme where tokens cannot resolve (jsdom)', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const card = fixture.debugElement.children[0].injector.get(ChartCard);
    const scheme = card.scheme();

    // jsdom cannot resolve var() through the probe — the guard must keep
    // the fallback instead of feeding garbage to the chart library.
    expect(scheme.domain).toEqual([...CHART_FALLBACK_COLORS]);
    expect(scheme.group).toBe('ordinal');
    expect(scheme.selectable).toBe(false);
  });
});
