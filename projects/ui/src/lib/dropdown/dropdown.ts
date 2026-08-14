import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling layer for a dropdown built on @angular/aria's menu — composed
 * beside ngMenuTrigger/ngMenu/ngMenuItem in the consumer's template, zero
 * imports from @angular/aria:
 *
 * ```html
 * <div xnDropdown>
 *   <button xnButton ngMenuTrigger [menu]="m">Options</button>
 *   <div ngMenu xnMenu #m="ngMenu" aria-label="Options">
 *     <ng-template ngMenuContent>
 *       <div ngMenuItem xnMenuItem value="edit">Edit</div>
 *     </ng-template>
 *   </div>
 * </div>
 * ```
 *
 * Positioning is plain CSS: the wrapper is the containing block, the menu
 * hangs below the trigger. The behavior layer owns keyboard navigation,
 * typeahead, Escape and visibility (inert on hidden — visual hiding is
 * ours, same contract as tabs and accordion).
 */

@Directive({
  selector: '[xnDropdown]',
  host: {
    'data-slot': 'dropdown',
    '[class]': 'classes()',
  },
})
export class Dropdown {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative inline-block', this.userClass()));
}

@Directive({
  selector: '[xnMenu]',
  host: {
    'data-slot': 'menu',
    '[class]': 'classes()',
  },
})
export class XnMenu {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute top-full left-0 z-50 mt-1 min-w-40 rounded-md border bg-background p-1 text-foreground shadow-md transition-[opacity,translate,scale,display] transition-discrete duration-200 ease-out-expo starting:-translate-y-2 starting:scale-[0.98] starting:opacity-0 [&[inert]]:hidden',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnMenuItem]',
  host: {
    'data-slot': 'menu-item',
    '[class]': 'classes()',
  },
})
export class XnMenuItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm whitespace-nowrap outline-none transition-[color,background-color] select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [XN_DROPDOWN]`. */
export const XN_DROPDOWN = [Dropdown, XnMenu, XnMenuItem] as const;
