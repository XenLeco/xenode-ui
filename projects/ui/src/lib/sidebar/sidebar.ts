import { Directive, computed, input, model } from '@angular/core';

import { cn } from '../cn';

/**
 * App sidebar family. The Sidebar directive owns a `collapsed` model();
 * SidebarTrigger finds it through DI and toggles. Collapsed state styles
 * from data-collapsed, so custom styling keys off the same attribute.
 */

@Directive({
  selector: '[xnSidebarLayout]',
  host: { 'data-slot': 'sidebar-layout', '[class]': 'classes()' },
})
export class SidebarLayout {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex min-h-dvh w-full', this.userClass()));
}

@Directive({
  selector: 'aside[xnSidebar]',
  exportAs: 'xnSidebar',
  host: {
    'data-slot': 'sidebar',
    '[attr.data-collapsed]': 'collapsed()',
    '[class]': 'classes()',
  },
})
export class Sidebar {
  readonly collapsed = model(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex shrink-0 flex-col border-r border-border bg-card text-card-foreground transition-[width]',
      this.collapsed() ? 'w-14 overflow-hidden' : 'w-60',
      this.userClass(),
    ),
  );

  toggle(): void {
    this.collapsed.update((value) => !value);
  }
}

@Directive({
  selector: '[xnSidebarHeader]',
  host: { 'data-slot': 'sidebar-header', '[class]': 'classes()' },
})
export class SidebarHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex items-center gap-2 border-b border-border p-3', this.userClass()),
  );
}

@Directive({
  selector: '[xnSidebarContent]',
  host: { 'data-slot': 'sidebar-content', '[class]': 'classes()' },
})
export class SidebarContent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex flex-1 flex-col gap-4 overflow-y-auto p-3', this.userClass()),
  );
}

@Directive({
  selector: '[xnSidebarFooter]',
  host: { 'data-slot': 'sidebar-footer', '[class]': 'classes()' },
})
export class SidebarFooter {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('border-t border-border p-3', this.userClass()));
}

@Directive({
  selector: '[xnSidebarGroup]',
  host: { 'data-slot': 'sidebar-group', '[class]': 'classes()' },
})
export class SidebarGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-1', this.userClass()));
}

@Directive({
  selector: '[xnSidebarGroupLabel]',
  host: { 'data-slot': 'sidebar-group-label', '[class]': 'classes()' },
})
export class SidebarGroupLabel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase', this.userClass()),
  );
}

@Directive({
  selector: 'ul[xnSidebarMenu]',
  host: { 'data-slot': 'sidebar-menu', '[class]': 'classes()' },
})
export class SidebarMenu {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-0.5', this.userClass()));
}

@Directive({
  selector: 'li[xnSidebarMenuItem]',
  host: { 'data-slot': 'sidebar-menu-item', '[class]': 'classes()' },
})
export class SidebarMenuItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('list-none', this.userClass()));
}

@Directive({
  selector: '[xnSidebarMenuButton]',
  host: { 'data-slot': 'sidebar-menu-button', '[class]': 'classes()' },
})
export class SidebarMenuButton {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm whitespace-nowrap transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:bg-secondary aria-[current=page]:font-medium',
      this.userClass(),
    ),
  );
}

/**
 * Toggles a sidebar it receives by reference, so it can live anywhere —
 * typically a page header, not inside the aside it controls:
 * `<button [xnSidebarTriggerFor]="sb">` with `<aside xnSidebar #sb="xnSidebar">`.
 */
@Directive({
  selector: 'button[xnSidebarTriggerFor]',
  host: {
    'data-slot': 'sidebar-trigger',
    type: 'button',
    '(click)': 'sidebar().toggle()',
    '[attr.aria-expanded]': '!sidebar().collapsed()',
  },
})
export class SidebarTrigger {
  readonly sidebar = input.required<Sidebar>({ alias: 'xnSidebarTriggerFor' });
}

export const SIDEBAR = [
  SidebarLayout,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
] as const;
