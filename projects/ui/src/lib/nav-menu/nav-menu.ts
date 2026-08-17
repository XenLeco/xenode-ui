import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

import { cn } from '../cn';

declare const ngDevMode: boolean | undefined;

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
    '(click)': 'onInsideClick($event)',
    '(keydown.escape)': 'closeFromKeyboard($event)',
    '(focusout)': 'onFocusOut($event)',
    // Always attached (a CD schedule per page click); the single-shell-nav
    // use case makes that cheaper than managed subscribe-while-open.
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
    if (
      (typeof ngDevMode === 'undefined' || ngDevMode) &&
      !this.elementRef.nativeElement.querySelector(`#${CSS.escape(id)}`)
    ) {
      console.warn(
        `nav[xnNavPanels]: no [xnNavPanel] with id "${id}" — the trigger's aria-controls dangles.`,
      );
    }
    this.openPanel.update((open) => (open === id ? undefined : id));
  }

  close(): void {
    this.openPanel.set(undefined);
  }

  private openPanelElement(): Element | null {
    const open = this.openPanel();
    if (!open) return null;
    return this.elementRef.nativeElement.querySelector(`#${CSS.escape(open)}`);
  }

  protected onInsideClick(event: MouseEvent): void {
    // A panel LINK activation is navigation: close, or an SPA routerLink
    // changes the route behind a still-open panel (outside-click cannot
    // see it — the click is inside the host).
    const link = (event.target as Element | null)?.closest('a');
    if (link && this.openPanelElement()?.contains(link)) this.close();
  }

  protected closeFromKeyboard(event: Event): void {
    const open = this.openPanel();
    if (!open) return;
    // Consuming Escape: without preventDefault, a wrapping <dialog> (a
    // mobile nav sheet) would close in the same keypress.
    event.preventDefault();
    // Closing while focus sits inside the panel would drop it to <body>.
    if (this.openPanelElement()?.contains(document.activeElement)) {
      this.elementRef.nativeElement
        .querySelector<HTMLElement>(`[aria-controls="${CSS.escape(open)}"]`)
        ?.focus();
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
      // The chevron uses CSS alt text (content: '⌄' / '') so it stays out
      // of the accessible name — aria-expanded already announces state.
      "inline-flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-[color,background-color] after:text-xs after:[content:'⌄'_/_''] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-expanded:bg-secondary aria-expanded:text-foreground",
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
      // The entrance is @starting-style alone: a previously-unrendered
      // element transitions from its starting values on the display flip
      // (no transition-discrete needed — display is not in the list).
      // The EXIT is instant by design: inert applies display:none.
      'absolute top-full left-0 z-40 mt-2 w-max max-w-[min(90vw,40rem)] rounded-lg border bg-background p-4 shadow-md transition-[opacity,translate] duration-200 ease-out-expo starting:translate-y-1 starting:opacity-0 [&[inert]]:hidden',
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
