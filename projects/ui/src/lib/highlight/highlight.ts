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

    // Matching runs on the ORIGINAL string via a case-insensitive regex:
    // toLowerCase can change string LENGTH ('İ' → 'i̇'), so indices found
    // in a lowered copy drift against the original.
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'gi');
    const segments: HighlightSegment[] = [];
    let cursor = 0;
    for (const found of text.matchAll(pattern)) {
      if (found[0].length === 0) break;
      if (found.index > cursor) segments.push({ text: text.slice(cursor, found.index), match: false });
      segments.push({ text: found[0], match: true });
      cursor = found.index + found[0].length;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false });
    return segments;
  });
}
