import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** KPI stat blocks. Delta trend colors stay inside the token system. */

@Directive({
  selector: '[xnStatGroup]',
  host: { 'data-slot': 'stat-group', '[class]': 'classes()' },
})
export class StatGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', this.userClass()),
  );
}

@Directive({ selector: '[xnStat]', host: { 'data-slot': 'stat', '[class]': 'classes()' } })
export class Stat {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-1 rounded-lg border bg-card p-4 text-card-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnStatLabel]',
  host: { 'data-slot': 'stat-label', '[class]': 'classes()' },
})
export class StatLabel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs font-medium tracking-wide text-muted-foreground uppercase', this.userClass()),
  );
}

@Directive({
  selector: '[xnStatValue]',
  host: { 'data-slot': 'stat-value', '[class]': 'classes()' },
})
export class StatValue {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-2xl font-semibold tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[xnStatDelta]',
  host: { 'data-slot': 'stat-delta', '[class]': 'classes()' },
})
export class StatDelta {
  /** Trend colors use the text-tuned status tokens. */
  readonly trend = input<'up' | 'down' | 'flat'>('up');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'text-xs font-medium',
      { up: 'text-success-text', down: 'text-danger', flat: 'text-muted-foreground' }[this.trend()],
      this.userClass(),
    ),
  );
}

export const STAT = [StatGroup, Stat, StatLabel, StatValue, StatDelta] as const;
