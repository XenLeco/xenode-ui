import { Component, computed, input, linkedSignal, model, numberAttribute } from '@angular/core';
import { Grid, GridCell, GridRow } from '@angular/aria/grid';

import { cn } from '../cn';

/**
 * Dates as `YYYY-MM-DD` strings throughout: serializable, timezone-proof
 * (never parsed with Date.parse, which reads ISO as UTC), and comparable
 * with plain `<`/`>` because the format sorts lexicographically.
 */
const pad = (value: number): string => String(value).padStart(2, '0');
const toIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

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
 * arrow-key navigation (continuous across week boundaries), Home/End, and
 * explicit selection all come from the primitive — nothing hand-rolled
 * (library rule 1). Month paging is buttons only: PageUp/PageDown month
 * keys are not in the grid's vocabulary and will not be hand-rolled.
 *
 * The value is an ISO `YYYY-MM-DD` model. The visible month follows the
 * value when it changes from outside (linkedSignal) but navigates freely
 * in between. `defaultMonth` + `locale` exist so prerendered demos are
 * deterministic; apps can omit both.
 *
 * Out-of-range days (`min`/`max`) and adjacent-month days are disabled
 * but remain focusable (`softDisabled`), per the APG date-grid guidance.
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
    <table
      ngGrid
      enableSelection
      softDisabled
      selectionMode="explicit"
      rowWrap="continuous"
      colWrap="nowrap"
      data-slot="calendar-grid"
      class="w-full border-separate border-spacing-0.5"
      [attr.aria-label]="monthLabel()"
    >
      <thead>
        <tr>
          @for (weekday of weekdays(); track weekday.long) {
            <th
              scope="col"
              class="size-9 p-0 text-center text-xs font-normal text-muted-foreground"
              [attr.aria-label]="weekday.long"
            >
              {{ weekday.short }}
            </th>
          }
        </tr>
      </thead>
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
  readonly weekStartsOn = input(1, { transform: numberAttribute });

  /** BCP 47 locale for month/weekday labels. */
  readonly locale = input('en-US');

  /** Initial visible month as `YYYY-MM` — pin it for deterministic SSR. */
  readonly defaultMonth = input<string | undefined>(undefined);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly hostClasses = computed(() =>
    cn('block w-fit rounded-lg border bg-card p-3 text-card-foreground', this.userClass()),
  );

  private readonly todayIso = toIso(new Date());

  // The visible month re-derives when the value changes from outside, but
  // prev/next navigation writes over it freely until then.
  private readonly view = linkedSignal<{ year: number; month: number }>(() => {
    const anchor = this.value() ?? this.defaultMonth() ?? this.todayIso;
    const [year, month] = anchor.split('-').map(Number);
    return { year, month: month - 1 };
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
    const { year, month } = this.view();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() - this.weekStartsOn() + 7) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const label = new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' });

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
            today: iso === this.todayIso,
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
    // Explicit mode toggles; a calendar keeps its selection — only commits.
    if (selected) this.value.set(day.iso);
  }
}
