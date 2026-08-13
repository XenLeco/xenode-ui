import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Skeleton } from './skeleton';

@Component({
  imports: [Skeleton],
  template: `<div xnSkeleton class="h-4 w-32 rounded-full"></div>`,
})
class Host {}

describe('Skeleton', () => {
  it('renders the pulse block and lets the consumer class win', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="skeleton"]');
    expect(el?.classList).toContain('animate-pulse');
    expect(el?.classList).toContain('rounded-full');
    expect(el?.classList).not.toContain('rounded-md');
  });
});
