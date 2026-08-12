import { buttonVariants } from './button-variants';

// Pure function tests — no TestBed, no DOM. Variant resolution is data.
describe('buttonVariants', () => {
  it('applies default variant and size when called without arguments', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('h-9');
  });

  it('resolves each variant to its distinguishing classes', () => {
    expect(buttonVariants({ variant: 'destructive' })).toContain('bg-destructive');
    expect(buttonVariants({ variant: 'outline' })).toContain('border-input');
    expect(buttonVariants({ variant: 'secondary' })).toContain('bg-secondary');
    expect(buttonVariants({ variant: 'ghost' })).toContain('hover:bg-accent');
    expect(buttonVariants({ variant: 'link' })).toContain('hover:underline');
  });

  it('resolves each size, all with ≥24px targets', () => {
    expect(buttonVariants({ size: 'sm' })).toContain('h-8');
    expect(buttonVariants({ size: 'lg' })).toContain('h-10');
    expect(buttonVariants({ size: 'icon' })).toContain('size-9');
  });

  it('always carries the focus-visible outline (SC 2.4.7)', () => {
    for (const variant of [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ] as const) {
      expect(buttonVariants({ variant })).toContain('focus-visible:outline-2');
    }
  });
});
