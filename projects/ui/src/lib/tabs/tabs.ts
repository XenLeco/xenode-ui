import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling layer for the @angular/aria tabs pattern. Behavior (roving focus,
 * keyboard navigation, aria wiring) belongs entirely to ngTabs/ngTabList/
 * ngTab/ngTabPanel — these directives are composed NEXT TO them in the
 * consumer's template and never import from @angular/aria:
 *
 * ```html
 * <div ngTabs xnTabs>
 *   <ul ngTabList xnTabList [(selectedTab)]="selected">
 *     <li ngTab xnTab value="one">One</li>
 *   </ul>
 *   <div ngTabPanel xnTabPanel value="one">
 *     <ng-template ngTabContent>…</ng-template>
 *   </div>
 * </div>
 * ```
 *
 * Class names are Xn-prefixed only because @angular/aria already exports
 * Tabs/TabList/Tab/TabPanel and consumers import both families together.
 */

@Directive({
  selector: '[xnTabs]',
  host: {
    'data-slot': 'tabs',
    '[class]': 'classes()',
  },
})
export class XnTabs {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-2', this.userClass()));
}

@Directive({
  selector: '[xnTabList]',
  host: {
    'data-slot': 'tab-list',
    '[class]': 'classes()',
  },
})
export class XnTabList {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnTab]',
  host: {
    'data-slot': 'tab',
    '[class]': 'classes()',
  },
})
export class XnTab {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // State styling reads the aria attributes the behavior layer manages, so
  // visual and accessible state cannot disagree.
  protected readonly classes = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap select-none transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-background aria-selected:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnTabPanel]',
  host: {
    'data-slot': 'tab-panel',
    '[class]': 'classes()',
  },
})
export class XnTabPanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // The behavior layer only sets the `inert` ATTRIBUTE on hidden panels and
  // documents that visual hiding is the styling layer's job — that is the
  // [&[inert]]:hidden below.
  protected readonly classes = computed(() =>
    cn('flex-1 text-sm outline-none [&[inert]]:hidden', this.userClass()),
  );
}

/** Convenience for `imports: [XN_TABS]` — the whole styling family. */
export const XN_TABS = [XnTabs, XnTabList, XnTab, XnTabPanel] as const;
