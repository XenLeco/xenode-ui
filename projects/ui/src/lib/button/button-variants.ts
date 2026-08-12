import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Pure variant definition — no Angular. The Button directive resolves its
 * classes from this, and the showcase renders its variant matrix from this
 * same object, so documentation cannot drift from behavior.
 *
 * Sizes keep every target at or above 24x24 CSS px (WCAG 2.2 SC 2.5.8).
 */
export const buttonVariantConfig = {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3',
      lg: 'h-10 px-6',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
} as const;

export const buttonVariants = cva(
  // transition-colors is deliberately absent: in Tailwind v4 it includes
  // outline-color, which makes the focus ring fade in from currentColor —
  // ~100ms of invisible ring on light backgrounds. Transition exactly what
  // should animate; the ring must snap.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50',
  buttonVariantConfig,
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
