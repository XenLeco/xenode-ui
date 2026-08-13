import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling layer for the @angular/aria accordion, composed beside
 * ngAccordionGroup/ngAccordionTrigger/ngAccordionPanel in the consumer's
 * template — zero imports from @angular/aria, same contract as tabs:
 *
 * ```html
 * <div ngAccordionGroup xnAccordion>
 *   <div xnAccordionItem>
 *     <h3 class="flex">
 *       <button ngAccordionTrigger xnAccordionTrigger [panel]="p">
 *         Question <span data-chevron aria-hidden="true">⌄</span>
 *       </button>
 *     </h3>
 *     <div ngAccordionPanel xnAccordionPanel #p="ngAccordionPanel">
 *       <ng-template ngAccordionContent>Answer</ng-template>
 *     </div>
 *   </div>
 * </div>
 * ```
 */

@Directive({
  selector: '[xnAccordion]',
  host: {
    'data-slot': 'accordion',
    '[class]': 'classes()',
  },
})
export class XnAccordion {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('w-full', this.userClass()));
}

@Directive({
  selector: '[xnAccordionItem]',
  host: {
    'data-slot': 'accordion-item',
    '[class]': 'classes()',
  },
})
export class XnAccordionItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('border-b last:border-b-0', this.userClass()));
}

@Directive({
  selector: '[xnAccordionTrigger]',
  host: {
    'data-slot': 'accordion-trigger',
    '[class]': 'classes()',
  },
})
export class XnAccordionTrigger {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // A child marked data-chevron rotates when the behavior layer flips
  // aria-expanded — state styling reads ARIA, never a parallel flag.
  protected readonly classes = computed(() =>
    cn(
      'flex w-full flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-[color] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>[data-chevron]]:transition-transform [&[aria-expanded=true]>[data-chevron]]:rotate-180',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnAccordionPanel]',
  host: {
    'data-slot': 'accordion-panel',
    '[class]': 'classes()',
  },
})
export class XnAccordionPanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // The behavior layer only sets the inert attribute on collapsed panels;
  // visual hiding is this styling layer's job.
  protected readonly classes = computed(() =>
    cn('overflow-hidden pb-4 text-sm [&[inert]]:hidden', this.userClass()),
  );
}

/** Convenience for `imports: [XN_ACCORDION]`. */
export const XN_ACCORDION = [
  XnAccordion,
  XnAccordionItem,
  XnAccordionTrigger,
  XnAccordionPanel,
] as const;
