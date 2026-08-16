import {
  Component,
  afterNextRender,
  computed,
  input,
  linkedSignal,
  model,
  numberAttribute,
  signal,
  viewChildren,
} from '@angular/core';
import { Grid, GridCell, GridRow } from '@angular/aria/grid';

import { cn } from '../cn';

declare const ngDevMode: boolean | undefined;

/**
 * Dates as `YYYY-MM-DD` strings throughout: serializable, timezone-proof
 * (never parsed with Date.parse, which reads ISO as UTC), and comparable
 * with plain `<`/`>` because the format sorts lexicographically.
 */
const pad = (value: number): string => String(value).padStart(2, '0');
const toIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

interface CalendarDay {
  readonly iso: string;
  readonly day: number;
  readonly inMonth: boolean;
  readonly today: boolean;
  readonly disabled: boolean;
  readonly label: string;
}

/**
 * A month calendar composed on `@angular/aria`'s grid: roving focus,
 * arrow-key navigation, Home/End and explicit selection all come from the
 * primitive — nothing hand-rolled (library rule 1). Axis semantics, per
 * the grid source: `colWrap` governs Left/Right (continuous, so days flow
 * across week boundaries) and `rowWrap` governs Up/Down (nowrap, so weeks
 * stop at the month's edges). Month paging is buttons only: PageUp/Down
 * is not in the grid's vocabulary and will not be hand-rolled.
 *
 * The value is an ISO `YYYY-MM-DD` model. The visible month follows the
 * value when it changes from outside (linkedSignal) but navigates freely
 * in between. A calendar keeps its selection: the grid's toggle/deselect
 * paths write cell models directly, so this component writes the truth
 * back whenever they disagree with the value.
 *
 * "Today" is marked client-side only — at prerender time it would be the
 * build date, and an honest absence beats a baked lie. `defaultMonth` +
 * `locale` exist so prerendered demos are deterministic; apps can omit
 * both. Out-of-range days (`min`/`max`) and adjacent-month days are
 * disabled but focusable (`softDisabled`), per the APG date-grid
 * guidance; the grid's selection layer refuses to commit them.
 */
@Component({
  selector: 'xn-calendar',
  imports: [Grid, GridRow, GridCell],
  host: { 'data-slot': 'calendar', '[class]': 'hostClasses()' },
  template: `
    <div data-slot="calendar-header" class="flex items-center justify-between gap-2 pb-3">
      <button
        type="button"
        aria-label="Previous month"
        data-slot="calendar-prev"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        (click)="addMonths(-1)"
      >
        ‹
      </button>
      <span data-slot="calendar-month" aria-live="polite" class="text-sm font-medium">
        {{ monthLabel() }}
      </span>
      <button
        type="button"
        aria-label="Next month"
        data-slot="calendar-next"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        (click)="addMonths(1)"
      >
        ›
      </button>
    </div>
    <!-- Visual-only weekday row: day cells carry full-date labels, so
         header cells would be redundant for readers — and a thead inside
         role=grid breaks the pattern's authored aria-rowindex (it counts
         only ngGridRow rows). -->
    <div aria-hidden="true" data-slot="calendar-weekdays" class="flex gap-0.5 px-0.5 pb-1">
      @for (weekday of weekdays(); track weekday.long) {
        <span class="size-9 text-center text-xs leading-9 font-normal text-muted-foreground">
          {{ weekday.short }}
        </span>
      }
    </div>
    <table
      ngGrid
      enableSelection
      softDisabled
      selectionMode="explicit"
      rowWrap="nowrap"
      colWrap="continuous"
      data-slot="calendar-grid"
      class="w-full border-separate border-spacing-0.5"
      [attr.aria-label]="monthLabel()"
    >
      <tbody>
        @for (week of weeks(); track week[0].iso) {
          <tr ngGridRow>
            @for (day of week; track day.iso) {
              <td
                ngGridCell
                data-slot="calendar-day"
                class="size-9 cursor-pointer rounded-md p-0 text-center text-sm transition-[color,background-color] aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-selected:bg-primary aria-selected:text-primary-foreground not-aria-selected:hover:bg-accent not-aria-selected:hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring data-outside:text-muted-foreground data-today:font-semibold"
                [disabled]="day.disabled"
                [selectable]="!day.disabled"
                [selected]="value() === day.iso"
                (selectedChange)="onSelected(day, $event)"
                [attr.data-iso]="day.iso"
                [attr.aria-label]="day.label"
                [attr.aria-current]="day.today ? 'date' : null"
                [attr.data-today]="day.today ? '' : null"
                [attr.data-outside]="day.inMonth ? null : ''"
              >
                {{ day.day }}
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class Calendar {
  /** Selected date as `YYYY-MM-DD`. */
  readonly value = model<string | undefined>(undefined);

  /** Earliest/latest selectable date, inclusive, as `YYYY-MM-DD`. */
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);

  /** First weekday: 0 = Sunday … 6 = Saturday. Defaults to Monday. */
  readonly weekStartsOn = input(1, {
    transform: (value: unknown) => {
      const n = numberAttribute(value);
      // NaN would build Invalid Dates and throw in Intl.format.
      return Number.isFinite(n) ? ((n % 7) + 7) % 7 : 1;
    },
  });

  /** BCP 47 locale for month/weekday labels. */
  readonly locale = input('en-US');

  /** Initial visible month as `YYYY-MM` — pin it for deterministic SSR. */
  readonly defaultMonth = input<string | undefined>(undefined);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly hostClasses = computed(() =>
    cn('block w-fit rounded-lg border bg-card p-3 text-card-foreground', this.userClass()),
  );

  private readonly cells = viewChildren(GridCell);

  // Anchors the view when nothing else does (a month must exist even at
  // prerender time); the visible "today" marking waits for the browser.
  private readonly constructionToday = toIso(new Date());
  private readonly clientToday = signal<string | undefined>(undefined);

  constructor() {
    afterNextRender(() => this.clientToday.set(toIso(new Date())));
  }

  // The visible month re-derives when the value changes from outside, but
  // prev/next navigation writes over it freely until then. `||` not `??`:
  // an empty string must fall through, not become an Invalid Date.
  private readonly view = linkedSignal<{ year: number; month: number }>(() => {
    const anchor = this.value() || this.defaultMonth() || this.constructionToday;
    const [year, month] = anchor.split('-').map(Number);
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      const [y, m] = this.constructionToday.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    return { year, month: Math.min(11, Math.max(0, month - 1)) };
  });

  protected readonly monthLabel = computed(() => {
    const { year, month } = this.view();
    return new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }).format(
      new Date(year, month, 1),
    );
  });

  protected readonly weekdays = computed(() => {
    const short = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const long = new Intl.DateTimeFormat(this.locale(), { weekday: 'long' });
    // 2023-01-01 was a Sunday; index from it so weekStartsOn maps cleanly.
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2023, 0, 1 + ((this.weekStartsOn() + i) % 7));
      return { short: short.format(date), long: long.format(date) };
    });
  });

  protected readonly weeks = computed(() => {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      for (const [name, v] of [
        ['value', this.value()],
        ['min', this.min()],
        ['max', this.max()],
      ] as const) {
        if (v && !ISO_DATE.test(v)) {
          console.warn(
            `xn-calendar: ${name}="${v}" is not zero-padded YYYY-MM-DD; ` +
              'comparisons are lexicographic and will silently misbehave.',
          );
        }
      }
    }

    const { year, month } = this.view();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() - this.weekStartsOn() + 7) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const label = new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' });
    const today = this.clientToday();

    const weeks: CalendarDay[][] = [];
    for (let start = 1 - offset; start <= daysInMonth; start += 7) {
      weeks.push(
        Array.from({ length: 7 }, (_, i) => {
          const date = new Date(year, month, start + i);
          const iso = toIso(date);
          const inMonth = date.getMonth() === month;
          const min = this.min();
          const max = this.max();
          return {
            iso,
            day: date.getDate(),
            inMonth,
            today: iso === today,
            disabled: !inMonth || (!!min && iso < min) || (!!max && iso > max),
            label: label.format(date),
          };
        }),
      );
    }
    return weeks;
  });

  protected addMonths(delta: number): void {
    const { year, month } = this.view();
    const next = new Date(year, month + delta, 1);
    this.view.set({ year: next.getFullYear(), month: next.getMonth() });
  }

  protected onSelected(day: CalendarDay, selected: boolean): void {
    if (selected) {
      this.value.set(day.iso);
      return;
    }
    // The grid's toggle (second activation) and deselectAll (activation on
    // a softDisabled cell) write cell models directly; the [selected]
    // binding cannot correct them because its expression value never
    // changed. A calendar keeps its selection — write the truth back.
    if (this.value() === day.iso) {
      this.cells()
        .find((cell) => cell.element.getAttribute('data-iso') === day.iso)
        ?.selected.set(true);
    }
  }
}
