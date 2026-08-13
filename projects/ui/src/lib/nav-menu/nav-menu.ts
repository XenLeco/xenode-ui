import { Directive, computed, input } from '@angular/core';

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
