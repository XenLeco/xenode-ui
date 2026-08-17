import { Component, Service, computed, inject, input, signal } from '@angular/core';

import { cn } from '../cn';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';
export type ToastPosition = 'bottom-right' | 'bottom-center' | 'top-right' | 'top-center';

export interface ToastOptions {
  title?: string;
  variant?: ToastVariant;
  /** Milliseconds until auto-dismiss; 0 disables auto-dismiss. */
  duration?: number;
}

export interface ActiveToast {
  readonly id: number;
  readonly message: string;
  readonly title?: string;
  readonly variant: ToastVariant;
}

/**
 * Placement for the fixed stack, one literal string per corner so Tailwind's
 * source scan finds every class whole. Mobile stays full-bleed (inset-x-4);
 * sm+ collapses to a right-docked strip (right/left corners) or a
 * shrink-to-fit centered box (center: inset-x-0 + mx-auto on an explicit
 * w-fit — the classic centered-fixed-element trick).
 */
export const TOAST_POSITION_CLASSES: Record<ToastPosition, string> = {
  'bottom-right': 'inset-x-4 bottom-4 items-end sm:left-auto sm:right-4',
  'bottom-center': 'inset-x-4 bottom-4 items-center sm:inset-x-0 sm:mx-auto sm:w-fit',
  'top-right': 'inset-x-4 top-4 items-end sm:left-auto sm:right-4',
  'top-center': 'inset-x-4 top-4 items-center sm:inset-x-0 sm:mx-auto sm:w-fit',
};

/**
 * Holds the active toast list as a signal. The Toaster component renders
 * it; anything injectable can show(). No overlay machinery — a fixed
 * position stack is all a toast is.
 */
@Service()
export class ToastService {
  private nextId = 0;
  private readonly active = signal<readonly ActiveToast[]>([]);
  readonly toasts = computed(() => this.active());

  show(message: string, options: ToastOptions = {}): number {
    const id = this.nextId++;
    this.active.update((list) => [
      ...list,
      { id, message, title: options.title, variant: options.variant ?? 'default' },
    ]);
    const duration = options.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  dismiss(id: number): void {
    this.active.update((list) => list.filter((toast) => toast.id !== id));
  }
}

/**
 * Render once, in the app shell. role="status" + aria-live="polite" makes
 * additions announce without interrupting; each toast keeps a real dismiss
 * button so auto-dismiss is a convenience, not the only exit. `position`
 * picks the fixed corner; toasts from a bottom corner rise into place
 * (translate up from below), toasts from a top corner fall into place
 * (translate down from above) — the entrance direction always matches
 * which edge the stack is pinned to.
 */
@Component({
  selector: 'xn-toaster',
  template: `
    <div role="status" aria-live="polite" [class]="containerClasses()">
      @for (toast of service.toasts(); track toast.id) {
        <div data-slot="toast" [class]="classFor(toast.variant)">
          <div class="grid flex-1 gap-0.5">
            @if (toast.title) {
              <p data-slot="toast-title" class="text-sm font-medium">{{ toast.title }}</p>
            }
            <p data-slot="toast-message" class="text-sm">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            class="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            (click)="service.dismiss(toast.id)"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class Toaster {
  protected readonly service = inject(ToastService);

  readonly position = input<ToastPosition>('bottom-right');

  protected readonly containerClasses = computed(() =>
    cn(
      'pointer-events-none fixed z-50 flex flex-col gap-2',
      TOAST_POSITION_CLASSES[this.position()],
    ),
  );

  protected classFor(variant: ActiveToast['variant']): string {
    return cn(
      'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-[opacity,translate,scale] duration-300 ease-out-expo starting:scale-[0.98] starting:opacity-0',
      // Rise from a bottom-pinned stack, fall from a top-pinned one.
      this.position().startsWith('bottom') ? 'starting:translate-y-3' : 'starting:-translate-y-3',
      {
        default: 'bg-card text-card-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        info: 'border-transparent bg-info text-info-foreground',
      }[variant],
    );
  }
}
