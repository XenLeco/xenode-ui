import { badgeVariants } from './badge-variants';

describe('badgeVariants', () => {
  it('applies the default variant when called without arguments', () => {
    expect(badgeVariants()).toContain('bg-primary');
  });

  it('resolves each variant to its distinguishing classes', () => {
    expect(badgeVariants({ variant: 'secondary' })).toContain('bg-secondary');
    expect(badgeVariants({ variant: 'destructive' })).toContain('bg-destructive');
    expect(badgeVariants({ variant: 'outline' })).toContain('text-foreground');
  });

  it('has no interactive-state styling — badges are not controls', () => {
    for (const variant of ['default', 'secondary', 'destructive', 'outline'] as const) {
      const classes = badgeVariants({ variant });
      expect(classes).not.toContain('focus-visible:');
      expect(classes).not.toContain('disabled:');
    }
  });
});
