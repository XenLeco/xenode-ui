import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * A scroll container with a slim token-colored scrollbar via the standard
 * scrollbar-width/scrollbar-color properties. Keyboard scrollability needs
 * focus: give it tabindex="0" and a label when the content itself has no
 * focusable elements.
 */
@Directive({
  selector: '[xnScrollArea]',
  host: {
    'data-slot': 'scroll-area',
    '[class]': 'classes()',
  },
})
export class ScrollArea {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative overflow-auto rounded-md [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]',
      this.userClass(),
    ),
  );
}
