import { Directive, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../cn';

/**
 * Surface: a skin, not a layout. Cards have slots, bento has footprints —
 * Surface is the one place blend treatments (glass, gradient, glow) live,
 * applied to whatever element hosts a section, hero or panel.
 *
 * The gradient surface restyles nested `*-description` slots through the
 * data-slot seam: muted-foreground text is illegible on the dark blend.
 */
export const surfaceVariantConfig = {
  variants: {
    variant: {
      default: 'border bg-card text-card-foreground',
      glass: 'border border-foreground/10 bg-foreground/5 backdrop-blur-md',
      gradient:
        'border border-transparent bg-linear-to-br from-gradient-from to-gradient-to text-gradient-foreground [&_[data-slot$=description]]:text-gradient-foreground/75',
      glow: 'border border-ring/50 bg-card text-card-foreground shadow-[0_0_32px_-8px_var(--ring)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
} as const;

export const surfaceVariants = cva('rounded-xl', surfaceVariantConfig);

export type SurfaceVariants = VariantProps<typeof surfaceVariants>;

@Directive({
  selector: '[xnSurface]',
  host: {
    'data-slot': 'surface',
    '[class]': 'classes()',
  },
})
export class Surface {
  readonly variant = input<SurfaceVariants['variant']>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(surfaceVariants({ variant: this.variant() }), this.userClass()),
  );
}
