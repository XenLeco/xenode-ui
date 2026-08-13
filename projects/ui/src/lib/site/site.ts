import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Page-level shells: navbar, footer, hero, section header. */

@Directive({
  selector: 'header[xnNavbar]',
  host: { 'data-slot': 'navbar', '[class]': 'classes()' },
})
export class Navbar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('w-full border-b border-border bg-background', this.userClass()),
  );
}

@Directive({
  selector: '[xnNavbarBrand]',
  host: { 'data-slot': 'navbar-brand', '[class]': 'classes()' },
})
export class NavbarBrand {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm font-semibold tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: 'nav[xnNavbarNav]',
  host: { 'data-slot': 'navbar-nav', '[class]': 'classes()' },
})
export class NavbarNav {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-baseline gap-6', this.userClass()));
}

@Directive({
  selector: 'a[xnNavbarLink]',
  host: { 'data-slot': 'navbar-link', '[class]': 'classes()' },
})
export class NavbarLink {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'text-sm text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'footer[xnFooter]',
  host: { 'data-slot': 'footer', '[class]': 'classes()' },
})
export class Footer {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('w-full border-t border-border py-8 text-sm text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'nav[xnFooterNav]',
  host: { 'data-slot': 'footer-nav', '[class]': 'classes()' },
})
export class FooterNav {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-wrap gap-4', this.userClass()));
}

@Directive({
  selector: '[xnFooterCopyright]',
  host: { 'data-slot': 'footer-copyright', '[class]': 'classes()' },
})
export class FooterCopyright {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-xs', this.userClass()));
}

@Directive({ selector: 'section[xnHero]', host: { 'data-slot': 'hero', '[class]': 'classes()' } })
export class Hero {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-4 py-16', this.userClass()));
}

@Directive({
  selector: '[xnHeroTitle]',
  host: { 'data-slot': 'hero-title', '[class]': 'classes()' },
})
export class HeroTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-4xl font-semibold tracking-tight text-balance', this.userClass()),
  );
}

@Directive({
  selector: '[xnHeroSubtitle]',
  host: { 'data-slot': 'hero-subtitle', '[class]': 'classes()' },
})
export class HeroSubtitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('max-w-prose text-lg text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnHeroActions]',
  host: { 'data-slot': 'hero-actions', '[class]': 'classes()' },
})
export class HeroActions {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-wrap gap-3', this.userClass()));
}

@Directive({
  selector: '[xnSectionHeader]',
  host: { 'data-slot': 'section-header', '[class]': 'classes()' },
})
export class SectionHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-1', this.userClass()));
}

@Directive({
  selector: '[xnSectionTitle]',
  host: { 'data-slot': 'section-title', '[class]': 'classes()' },
})
export class SectionTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-lg font-semibold tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[xnSectionDescription]',
  host: { 'data-slot': 'section-description', '[class]': 'classes()' },
})
export class SectionDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground', this.userClass()),
  );
}

export const SITE = [
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarLink,
  Footer,
  FooterNav,
  FooterCopyright,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  SectionHeader,
  SectionTitle,
  SectionDescription,
] as const;
