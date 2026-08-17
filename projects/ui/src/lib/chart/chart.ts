import {
  Directive,
  ElementRef,
  type OnDestroy,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { cn } from '../cn';

/**
 * SSR fallback palette: the dark-mode `--chart-*` tokens as hex (dark is
 * the brand default, so the pre-hydration frame matches the likeliest
 * theme). Locked to theme.css by chart.spec.ts through the same culori
 * conversion — edit the tokens and the test tells you the new hexes.
 */
export const CHART_FALLBACK_COLORS = [
  '#5888fc',
  '#00b8a1',
  '#d6a62e',
  '#ed5350',
  '#56ae6c',
] as const;

/**
 * oklch(L C H) → #hex via Ottosson's OKLab matrices. In-house on purpose:
 * modern engines serialize computed oklch AS oklch (getComputedStyle and
 * even canvas fillStyle round-trips preserve it), so there is no browser
 * API that reliably hands back rgb — and chart engines' d3-color cannot
 * parse oklch. Only the token formats this theme uses are handled.
 */
const oklchToHex = (value: string): string | null => {
  const match = value.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return null;
  const [, l, c, h] = match.map(Number);
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const channels = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((linear) => {
    const gamma = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, gamma)) * 255);
  });

  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

/**
 * The chart tier is a COMPOSITION: `@xenode/ui` ships tokens, this card,
 * and the scheme bridge — the chart library itself (ngx-charts in the
 * docs) is the consumer's dependency, imported nowhere in this library.
 *
 * ChartCard does two jobs:
 * - Styles the frame and the chart chrome through the data the library
 *   renders (axis text, gridlines) via descendant selectors on
 *   `.ngx-charts` — one specificity step above the library's own rules.
 * - Bridges `--chart-1..5` into a concrete color scheme object
 *   (`scheme()`): tokens are oklch, and chart libraries' d3-color cannot
 *   parse oklch, so a hidden probe element resolves each token to the
 *   rgb() the browser computes. Re-resolves when the `.dark` class flips
 *   (MutationObserver); prerender serves the dark fallback above.
 *
 * ```html
 * <div xnChartCard #card="xnChartCard" class="h-72">
 *   <ngx-charts-bar-vertical [scheme]="$any(card.scheme())" … />
 * </div>
 * ```
 */
@Directive({
  selector: '[xnChartCard]',
  exportAs: 'xnChartCard',
  host: {
    'data-slot': 'chart-card',
    // A bare div cannot carry an accessible name; a chart is a figure.
    role: 'figure',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'classes()',
  },
})
export class ChartCard implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Accessible name for the chart region — charts are not self-labelling. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'block rounded-lg border bg-card p-4 text-card-foreground [&_.ngx-charts_.gridline-path]:stroke-border [&_.ngx-charts_text]:fill-muted-foreground',
      this.userClass(),
    ),
  );

  private readonly colors = signal<readonly string[]>(CHART_FALLBACK_COLORS);
  private observer: MutationObserver | undefined;

  /** ngx-charts-shaped color scheme fed from the theme tokens. */
  readonly scheme = computed(() => ({
    name: 'xenode',
    selectable: false,
    group: 'ordinal',
    domain: [...this.colors()],
  }));

  constructor() {
    afterNextRender(() => {
      this.resolveTokens();
      this.observer = new MutationObserver(() => this.resolveTokens());
      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private resolveTokens(): void {
    const probe = document.createElement('span');
    probe.style.display = 'none';
    this.elementRef.nativeElement.appendChild(probe);
    try {
      const resolved: string[] = [];
      for (let i = 1; i <= 5; i += 1) {
        probe.style.color = `var(--chart-${i})`;
        const computed = getComputedStyle(probe).color;
        // Accept what a chart engine can parse; convert what it cannot;
        // keep the fallback where nothing resolves (jsdom).
        const usable =
          computed && (computed.startsWith('#') || computed.startsWith('rgb'))
            ? computed
            : oklchToHex(computed ?? '');
        if (!usable) return;
        resolved.push(usable);
      }
      this.colors.set(resolved);
    } finally {
      probe.remove();
    }
  }
}
