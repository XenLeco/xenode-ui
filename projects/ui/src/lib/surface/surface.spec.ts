import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Surface, surfaceVariants } from './surface';

describe('surfaceVariants', () => {
  it('every variant is a non-empty class string on the shared radius', () => {
    for (const variant of ['default', 'glass', 'gradient', 'glow'] as const) {
      const classes = surfaceVariants({ variant });
      expect(classes).toContain('rounded-xl');
      expect(classes.length).toBeGreaterThan('rounded-xl'.length);
    }
  });

  it('gradient restyles nested description slots and carries its own text color', () => {
    const classes = surfaceVariants({ variant: 'gradient' });
    expect(classes).toContain('text-gradient-foreground');
    expect(classes).toContain('[&_[data-slot$=description]]:text-gradient-foreground/75');
  });
});

@Component({
  imports: [Surface],
  template: `
    <div xnSurface variant="glass">Panel</div>
    <div xnSurface variant="gradient" class="rounded-none">Hero</div>
  `,
})
class Host {}

describe('Surface', () => {
  it('applies the variant skin and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const surfaces = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-slot="surface"]',
    );

    expect(surfaces[0].classList).toContain('backdrop-blur-md');
    expect(surfaces[1].classList).toContain('text-gradient-foreground');
    expect(surfaces[1].classList).toContain('rounded-none');
    expect(surfaces[1].classList).not.toContain('rounded-xl');
  });
});
