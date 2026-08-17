import { Component, computed, input } from '@angular/core';

import { cn } from '../cn';
import { Mark } from '../inline-extras/inline-extras';

interface HighlightSegment {
  readonly text: string;
  readonly match: boolean;
}

/**
 * Splits `text` on case-insensitive occurrences of `query` and wraps
 * matches in the shared `xnMark` styling — same directive, same
 * `data-slot="mark"`, so a highlighted match is indistinguishable from a
 * hand-authored one. An empty query is a no-op segment, not a special case
 * downstream: everything renders through the same @for loop either way.
 */
@Component({
  selector: 'xn-highlight',
  imports: [Mark],
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.match) {
        <mark xnMark>{{ segment.text }}</mark>
      } @else {
        <ng-container>{{ segment.text }}</ng-container>
      }
    }
  `,
  host: { 'data-slot': 'highlight', '[class]': 'classes()' },
})
export class Highlight {
  readonly text = input.required<string>();
  readonly query = input('');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // No default classes — xn-highlight is plain inline text; cn() still runs
  // so a consumer class merges the same way it does on every other family.
  protected readonly classes = computed(() => cn(this.userClass()));

  protected readonly segments = computed<readonly HighlightSegment[]>(() => {
    const text = this.text();
    const query = this.query();
    if (!query) return [{ text, match: false }];

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const segments: HighlightSegment[] = [];
    let cursor = 0;
    let index = lowerText.indexOf(lowerQuery, cursor);
    while (index !== -1) {
      if (index > cursor) segments.push({ text: text.slice(cursor, index), match: false });
      segments.push({ text: text.slice(index, index + query.length), match: true });
      cursor = index + query.length;
      index = lowerText.indexOf(lowerQuery, cursor);
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });
    return segments;
  });
}
