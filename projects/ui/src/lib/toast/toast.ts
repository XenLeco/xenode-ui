import { Component, Service, computed, inject, signal } from '@angular/core';

import { cn } from '../cn';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

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
 * button so auto-dismiss is a convenience, not the only exit.
 */
@Component({
  selector: 'xn-toaster',
  template: `
    <div
      role="status"
      aria-live="polite"
      class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:right-4"
    >
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

  protected classFor(variant: ActiveToast['variant']): string {
    return cn(
      'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-[opacity,translate] duration-200 starting:translate-y-2 starting:opacity-0',
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
