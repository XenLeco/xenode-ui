import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Pure variant definition — no Angular. Unlike button there is no focus or
 * disabled styling: a badge is non-interactive text, so those states cannot
 * exist. Every solid variant pairs tokens already locked by the contrast
 * test; `outline` inherits its border color from the base-layer default.
 */
export const badgeVariantConfig = {
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      success: 'border-transparent bg-success text-success-foreground',
      warning: 'border-transparent bg-warning text-warning-foreground',
      info: 'border-transparent bg-info text-info-foreground',
      outline: 'text-foreground',
      gradient:
        'border-transparent bg-linear-to-br from-gradient-from to-gradient-to text-gradient-foreground',
      glass: 'border-foreground/10 bg-foreground/5 text-foreground backdrop-blur-md',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
} as const;

export const badgeVariants = cva(
  'inline-flex w-fit items-center whitespace-nowrap rounded-md border px-2.5 py-0.5 text-xs font-semibold',
  badgeVariantConfig,
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
