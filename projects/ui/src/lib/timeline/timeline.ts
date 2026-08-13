import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Vertical event timeline on a semantic ordered list. */

@Directive({
  selector: 'ol[xnTimeline]',
  host: { 'data-slot': 'timeline', '[class]': 'classes()' },
})
export class Timeline {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col', this.userClass()));
}

@Directive({
  selector: 'li[xnTimelineItem]',
  host: { 'data-slot': 'timeline-item', '[class]': 'classes()' },
})
export class TimelineItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('relative flex gap-4 pb-6 last:pb-0', this.userClass()),
  );
}

@Directive({
  selector: '[xnTimelineDot]',
  host: { 'data-slot': 'timeline-dot', 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class TimelineDot {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('mt-1 size-2.5 shrink-0 rounded-full bg-primary', this.userClass()),
  );
}

@Directive({
  selector: '[xnTimelineConnector]',
  host: { 'data-slot': 'timeline-connector', 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class TimelineConnector {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('absolute top-4 left-[4px] h-full w-px bg-border', this.userClass()),
  );
}

@Directive({
  selector: '[xnTimelineContent]',
  host: { 'data-slot': 'timeline-content', '[class]': 'classes()' },
})
export class TimelineContent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-0.5 text-sm', this.userClass()),
  );
}

@Directive({
  selector: 'time[xnTimelineTime]',
  host: { 'data-slot': 'timeline-time', '[class]': 'classes()' },
})
export class TimelineTime {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs text-muted-foreground', this.userClass()),
  );
}

export const TIMELINE = [
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
] as const;
