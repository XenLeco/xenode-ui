import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

import { cn } from '../cn';

/**
 * Styling layers for further @angular/aria patterns — toolbar, listbox,
 * tree, menubar — plus a context-menu trigger. Same contract as tabs,
 * accordion and dropdown: behavior directives (ngToolbar, ngListbox,
 * ngTree, ngMenuBar…) compose beside these in the consumer's template;
 * nothing here imports @angular/aria.
 */

@Directive({
  selector: '[xnToolbar]',
  host: { 'data-slot': 'toolbar', '[class]': 'classes()' },
})
export class XnToolbar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex w-fit items-center gap-1 rounded-md border bg-background p-1', this.userClass()),
  );
}

@Directive({
  selector: '[xnListbox]',
  host: { 'data-slot': 'listbox', '[class]': 'classes()' },
})
export class XnListbox {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-0.5 rounded-md border bg-background p-1', this.userClass()),
  );
}

@Directive({
  selector: '[xnListboxOption]',
  host: { 'data-slot': 'listbox-option', '[class]': 'classes()' },
})
export class XnListboxOption {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground aria-selected:bg-secondary aria-selected:font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnTree]',
  host: { 'data-slot': 'tree', '[class]': 'classes()' },
})
export class XnTree {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-col gap-0.5 text-sm', this.userClass()),
  );
}

@Directive({
  selector: '[xnTreeItem]',
  host: { 'data-slot': 'tree-item', '[class]': 'classes()' },
})
export class XnTreeItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 outline-none select-none hover:bg-accent focus:bg-accent aria-selected:bg-secondary aria-expanded:font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.userClass(),
    ),
  );
}

/** Horizontal menu bar shell; items reuse xnMenuItem, submenus reuse xnMenu. */
@Directive({
  selector: '[xnMenubar]',
  host: { 'data-slot': 'menubar', '[class]': 'classes()' },
})
export class XnMenubar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex w-fit items-center gap-1 rounded-md border bg-background p-1', this.userClass()),
  );
}

/**
 * Opens its menu at the pointer on right-click. Composes with the dropdown
 * styling: place inside a [xnDropdown] wrapper whose menu is positioned by
 * the coordinates this trigger exposes.
 *
 * ```html
 * <div xnDropdown xnContextMenuArea #area="xnContextMenuArea" (contextmenu)="area.openAt($event, m)">
 *   …right-clickable content…
 *   <div ngMenu xnMenu #m="ngMenu" [style.left.px]="area.x()" [style.top.px]="area.y()" class="top-auto mt-0">…</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[xnContextMenuArea]',
  exportAs: 'xnContextMenuArea',
  host: { 'data-slot': 'context-menu-area' },
})
export class ContextMenuArea {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly x = signal(0);
  readonly y = signal(0);

  openAt(
    event: MouseEvent,
    menu: { open: (value?: never) => unknown } | { close: () => void },
  ): void {
    event.preventDefault();
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.x.set(event.clientX - rect.left);
    this.y.set(event.clientY - rect.top);
    (menu as { open?: (v?: never) => unknown }).open?.();
  }
}

/** Convenience for `imports: [XN_ARIA_COMPOSALS]`. */
export const XN_ARIA_COMPOSALS = [
  XnToolbar,
  XnListbox,
  XnListboxOption,
  XnTree,
  XnTreeItem,
  XnMenubar,
  ContextMenuArea,
] as const;
