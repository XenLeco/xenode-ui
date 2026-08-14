import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Page scaffold: the skeleton every full page hangs on. Compose with the
 * site families (navbar/hero/footer) and the sidebar family:
 *
 * ```html
 * <div xnPageLayout>
 *   <header xnPageHeader>…navbar…</header>
 *   <main xnPageMain><div xnContainer>…</div></main>
 *   <footer xnFooter>…</footer>
 * </div>
 * ```
 */

/** Centered content column. */
@Directive({ selector: '[xnContainer]', host: { 'data-slot': 'container', '[class]': 'classes()' } })
export class Container {
  readonly size = input<'sm' | 'default' | 'lg' | 'full'>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'mx-auto w-full px-4',
      { sm: 'max-w-3xl', default: 'max-w-5xl', lg: 'max-w-7xl', full: 'max-w-none' }[this.size()],
      this.userClass(),
    ),
  );
}

/** Full-height column: header, growing main, footer pinned low. */
@Directive({
  selector: '[xnPageLayout]',
  host: { 'data-slot': 'page-layout', '[class]': 'classes()' },
})
export class PageLayout {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex min-h-dvh flex-col', this.userClass()));
}

/** Sticky translucent top bar shell; put a navbar inside. */
@Directive({
  selector: 'header[xnPageHeader]',
  host: { 'data-slot': 'page-header', '[class]': 'classes()' },
})
export class PageHeader {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur',
      this.userClass(),
    ),
  );
}

/** The page body — grows to push the footer down. */
@Directive({
  selector: 'main[xnPageMain]',
  host: { 'data-slot': 'page-main', '[class]': 'classes()' },
})
export class PageMain {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('w-full flex-1', this.userClass()));
}

/** A vertical rhythm band inside the body. */
@Directive({
  selector: 'section[xnPageSection]',
  host: { 'data-slot': 'page-section', '[class]': 'classes()' },
})
export class PageSection {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('w-full py-12', this.userClass()));
}

/** Convenience for `imports: [LAYOUT]`. */
export const LAYOUT = [Container, PageLayout, PageHeader, PageMain, PageSection] as const;
