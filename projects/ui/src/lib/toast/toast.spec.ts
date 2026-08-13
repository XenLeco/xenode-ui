import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { Toaster, ToastService } from './toast';

describe('ToastService', () => {
  it('shows, dismisses, and auto-expires toasts', async () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(ToastService);

    const keeper = service.show('stays', { duration: 0 });
    service.show('goes', { duration: 20 });
    expect(service.toasts().length).toBe(2);

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(service.toasts().map((t) => t.message)).toEqual(['stays']);

    service.dismiss(keeper);
    expect(service.toasts().length).toBe(0);
  });
});

describe('Toaster', () => {
  it('renders toasts in a polite live region and dismisses via the button', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Toaster);
    const service = TestBed.inject(ToastService);
    await fixture.whenStable();

    const region = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.querySelectorAll('[data-slot="toast"]').length).toBe(0);

    service.show('Saved', { title: 'Success', duration: 0 });
    service.show('Deploy failed', { variant: 'destructive', duration: 0 });
    await fixture.whenStable();

    const toasts = region?.querySelectorAll<HTMLElement>('[data-slot="toast"]');
    expect(toasts?.length).toBe(2);
    expect(toasts?.[0].textContent).toContain('Success');
    expect(toasts?.[1].classList).toContain('bg-destructive');

    toasts?.[0].querySelector('button')?.click();
    await fixture.whenStable();
    expect(region?.querySelectorAll('[data-slot="toast"]').length).toBe(1);
  });

  it('is axe-clean with active toasts', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Toaster);
    const service = TestBed.inject(ToastService);
    service.show('Hello', { duration: 0 });
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
