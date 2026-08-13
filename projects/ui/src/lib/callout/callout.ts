import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Callout, banner and tag. A callout is a static note block — unlike Alert
 * it is NOT a live region, so it never interrupts a screen reader.
 */

export const calloutVariantConfig = {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      accent: 'border-transparent bg-accent text-accent-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      success: 'border-transparent bg-success text-success-foreground',
      warning: 'border-transparent bg-warning text-warning-foreground',
      info: 'border-transparent bg-info text-info-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
} as const;

@Directive({ selector: '[xnCallout]', host: { 'data-slot': 'callout', '[class]': 'classes()' } })
export class Callout {
  readonly variant = input<keyof typeof calloutVariantConfig.variants.variant>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'grid gap-1 rounded-lg border px-4 py-3 text-sm',
      calloutVariantConfig.variants.variant[this.variant()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnCalloutTitle]',
  host: { 'data-slot': 'callout-title', '[class]': 'classes()' },
})
export class CalloutTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('font-medium', this.userClass()));
}

@Directive({
  selector: '[xnCalloutContent]',
  host: { 'data-slot': 'callout-content', '[class]': 'classes()' },
})
export class CalloutContent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('[&_p]:leading-relaxed', this.userClass()));
}

/** Full-width announcement bar for the top of a page. */
@Directive({ selector: '[xnBanner]', host: { 'data-slot': 'banner', '[class]': 'classes()' } })
export class Banner {
  readonly variant = input<'default' | 'success' | 'warning' | 'destructive' | 'info'>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex w-full items-center justify-center gap-3 px-4 py-2 text-sm',
      {
        default: 'bg-primary text-primary-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        info: 'bg-info text-info-foreground',
      }[this.variant()],
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnBannerAction]',
  host: { 'data-slot': 'banner-action', '[class]': 'classes()' },
})
export class BannerAction {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('font-medium underline underline-offset-4', this.userClass()),
  );
}

/** A dismissible tag/chip; removal state belongs to the consumer. */
@Directive({ selector: '[xnTag]', host: { 'data-slot': 'tag', '[class]': 'classes()' } })
export class Tag {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex w-fit items-center gap-1 rounded-md border bg-secondary py-0.5 pr-1 pl-2 text-xs font-medium text-secondary-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'button[xnTagRemove]',
  host: { 'data-slot': 'tag-remove', type: 'button', '[class]': 'classes()' },
})
export class TagRemove {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex size-4 cursor-pointer items-center justify-center rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

export const CALLOUT = [
  Callout,
  CalloutTitle,
  CalloutContent,
  Banner,
  BannerAction,
  Tag,
  TagRemove,
] as const;
