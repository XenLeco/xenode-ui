import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOAST_POSITION_CLASSES, Toaster, ToastService, type ToastPosition } from './toast';

describe('Toaster position', () => {
  function container(fixture: ComponentFixture<Toaster>) {
    return (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
  }

  it('defaults to bottom-right and maps every position to its full placement class list', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Toaster);
    await fixture.whenStable();
    expect(container(fixture)?.classList).toContain('bottom-4');
    expect(container(fixture)?.classList).toContain('items-end');
    expect(container(fixture)?.classList).not.toContain('top-4');

    for (const position of Object.keys(TOAST_POSITION_CLASSES) as ToastPosition[]) {
      fixture.componentRef.setInput('position', position);
      await fixture.whenStable();
      const classList = container(fixture)?.classList;
      for (const cls of TOAST_POSITION_CLASSES[position].split(' ')) {
        expect(classList).toContain(cls);
      }
    }
  });

  it('rises from a bottom corner and falls from a top corner', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Toaster);
    const service = TestBed.inject(ToastService);

    fixture.componentRef.setInput('position', 'bottom-right');
    service.show('from below', { duration: 0 });
    await fixture.whenStable();
    const toast = () => container(fixture)?.querySelector('[data-slot="toast"]');
    expect(toast()?.classList).toContain('starting:translate-y-3');
    expect(toast()?.classList).not.toContain('starting:-translate-y-3');

    // Re-evaluates on the SAME rendered toast — classFor() reads the current
    // position signal on every change-detection pass, not just at creation.
    fixture.componentRef.setInput('position', 'top-center');
    await fixture.whenStable();
    expect(toast()?.classList).toContain('starting:-translate-y-3');
    expect(toast()?.classList).not.toContain('starting:translate-y-3');
  });
});
