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
      outline: 'text-foreground',
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
