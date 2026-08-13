import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Destructive is SOLID (destructive bg + its foreground) rather than
 * shadcn's red-text-on-page-background style: with these tokens the subtle
 * style measures under 4.5:1 in dark mode, while the solid pairing is
 * already locked by the contrast test.
 */
export const alertVariantConfig = {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
} as const;

export const alertVariants = cva(
  'relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-sm',
  alertVariantConfig,
);

export type AlertVariants = VariantProps<typeof alertVariants>;
