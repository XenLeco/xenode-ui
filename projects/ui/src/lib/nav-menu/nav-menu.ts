import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

import { cn } from '../cn';

/** Simple horizontal site navigation; the current link uses aria-current. */

@Directive({
  selector: 'nav[xnNavMenu]',
  host: { 'data-slot': 'nav-menu', '[class]': 'classes()' },
})
export class NavMenu {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('w-fit', this.userClass()));
}

@Directive({
  selector: 'ul[xnNavMenuList]',
  host: { 'data-slot': 'nav-menu-list', '[class]': 'classes()' },
})
export class NavMenuList {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-center gap-1', this.userClass()));
}

@Directive({
  selector: 'li[xnNavMenuItem]',
  host: { 'data-slot': 'nav-menu-item', '[class]': 'classes()' },
})
export class NavMenuItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('list-none', this.userClass()));
}

@Directive({
  selector: 'a[xnNavMenuLink]',
  host: { 'data-slot': 'nav-menu-link', '[class]': 'classes()' },
})
export class NavMenuLink {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:bg-secondary aria-[current=page]:text-foreground',
      this.userClass(),
    ),
  );
}

export const NAV_MENU = [NavMenu, NavMenuList, NavMenuItem, NavMenuLink] as const;

/**
 * Panel tier: the APG disclosure-navigation pattern. Triggers are native
 * buttons carrying aria-expanded/aria-controls over panels of plain
 * links — deliberately NOT role=menu (menus are application commands;
 * navigation is links, and Tab is the navigation key). One panel open
 * at a time; outside click, Escape, and tabbing out of the nav all
 * close it, and Escape returns focus to the open panel's trigger.
 *
 * Panel ids are consumer-provided and must be document-unique (they are
 * real DOM ids wired through aria-controls).
 *
 * ```html
 * <nav xnNavPanels aria-label="Primary">
 *   <ul xnNavMenuList>
 *     <li xnNavMenuItem>
 *       <button [xnNavPanelTrigger]="'products'">Products</button>
 *       <div [xnNavPanel]="'products'">
 *         <a xnNavPanelLink href="...">…</a>
 *       </div>
 *     </li>
 *   </ul>
 * </nav>
 * ```
 */
@Directive({
  selector: 'nav[xnNavPanels]',
  exportAs: 'xnNavPanels',
  host: {
    'data-slot': 'nav-panels',
    '[class]': 'classes()',
    '(keydown.escape)': 'closeFromKeyboard()',
    '(focusout)': 'onFocusOut($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class NavPanels {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly openPanel = signal<string | undefined>(undefined);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative w-fit', this.userClass()));

  toggle(id: string): void {
    this.openPanel.update((open) => (open === id ? undefined : id));
  }

  close(): void {
    this.openPanel.set(undefined);
  }

  protected closeFromKeyboard(): void {
    const open = this.openPanel();
    if (!open) return;
    // Closing while focus sits inside the panel would drop it to <body>.
    const host = this.elementRef.nativeElement;
    const panel = host.querySelector(`#${CSS.escape(open)}`);
    if (panel?.contains(document.activeElement)) {
      host.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(open)}"]`)?.focus();
    }
    this.close();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && !this.elementRef.nativeElement.contains(next)) this.close();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.openPanel()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.close();
  }
}

@Directive({
  selector: 'button[xnNavPanelTrigger]',
  host: {
    'data-slot': 'nav-panel-trigger',
    type: 'button',
    '[attr.aria-expanded]': 'expanded()',
    '[attr.aria-controls]': 'panelId()',
    '(click)': 'root.toggle(panelId())',
    '[class]': 'classes()',
  },
})
export class NavPanelTrigger {
  // Selector-matching alias: the input IS the directive name.
  readonly panelId = input.required<string>({ alias: 'xnNavPanelTrigger' });

  protected readonly root = (() => {
    const root = inject(NavPanels, { optional: true });
    if (!root) {
      throw new Error('button[xnNavPanelTrigger] must be placed inside a nav[xnNavPanels].');
    }
    return root;
  })();

  readonly expanded = computed(() => this.root.openPanel() === this.panelId());

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      "inline-flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-[color,background-color] after:text-xs after:content-['⌄'] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-expanded:bg-secondary aria-expanded:text-foreground",
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnNavPanel]',
  host: {
    'data-slot': 'nav-panel',
    '[id]': 'panelId()',
    '[attr.inert]': "open() ? null : ''",
    '[class]': 'classes()',
  },
})
export class NavPanel {
  // Selector-matching alias: the input IS the directive name.
  readonly panelId = input.required<string>({ alias: 'xnNavPanel' });

  private readonly root = (() => {
    const root = inject(NavPanels, { optional: true });
    if (!root) {
      throw new Error('[xnNavPanel] must be placed inside a nav[xnNavPanels].');
    }
    return root;
  })();

  readonly open = computed(() => this.root.openPanel() === this.panelId());

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      // Behavior sets only inert; [&[inert]]:hidden is the styling half.
      // transition-discrete + starting: ride the display flip (the dialog
      // entrance lesson).
      'absolute top-full left-0 z-40 mt-2 w-max max-w-[min(90vw,40rem)] rounded-lg border bg-background p-4 shadow-md transition-[opacity,translate] transition-discrete duration-200 ease-out-expo starting:translate-y-1 starting:opacity-0 [&[inert]]:hidden',
      this.userClass(),
    ),
  );
}

/** Block link for panel content: title line + muted description slot. */
@Directive({
  selector: 'a[xnNavPanelLink]',
  host: { 'data-slot': 'nav-panel-link', '[class]': 'classes()' },
})
export class NavPanelLink {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'block rounded-md p-3 text-sm transition-[background-color] hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_[data-slot=nav-panel-link-desc]]:mt-1 [&_[data-slot=nav-panel-link-desc]]:text-xs [&_[data-slot=nav-panel-link-desc]]:text-muted-foreground [&_[data-slot=nav-panel-link-title]]:font-medium',
      this.userClass(),
    ),
  );
}

export const NAV_PANELS = [NavPanels, NavPanelTrigger, NavPanel, NavPanelLink] as const;
