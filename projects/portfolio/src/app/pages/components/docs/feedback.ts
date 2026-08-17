import { Component, inject, signal } from '@angular/core';

import {
  ALERT,
  alertVariantConfig,
  Banner,
  BannerAction,
  CALLOUT,
  RadialProgress,
  Skeleton,
  Spinner,
  Button,
  Toaster,
  type ToastPosition,
  ToastService,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

type AlertVariantName = keyof typeof alertVariantConfig.variants.variant;

/**
 * Providing ToastService locally scopes this demo's toasts (and their
 * position) to its own `<xn-toaster>` — independent of the app shell's
 * real one, so switching the picker here never fights that instance's
 * fixed default.
 */
@Component({
  selector: 'app-toast-position-demo',
  imports: [Button, Toaster],
  providers: [ToastService],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      @for (option of positions; track option) {
        <button
          xnButton
          variant="outline"
          class="aria-pressed:bg-secondary aria-pressed:text-foreground"
          [attr.aria-pressed]="position() === option"
          (click)="position.set(option)"
        >
          {{ option }}
        </button>
      }
      <button xnButton variant="secondary" (click)="show()">Show toast</button>
    </div>
    <xn-toaster [position]="position()" />
  `,
})
export class ToastPositionDemo {
  protected readonly positions: ToastPosition[] = [
    'bottom-right',
    'bottom-center',
    'top-right',
    'top-center',
  ];
  protected readonly position = signal<ToastPosition>('bottom-right');

  private readonly toastService = inject(ToastService);

  protected show(): void {
    this.toastService.show(`Rendered at ${this.position()}.`, { title: 'Position demo' });
  }
}

@Component({
  selector: 'app-docs-feedback',
  imports: [
    ALERT,
    CALLOUT,
    Banner,
    BannerAction,
    Skeleton,
    Spinner,
    Button,
    RadialProgress,
    ExampleBox,
    ToastPositionDemo,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Feedback</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Alert is a live region and announces on appearance; callout is its silent counterpart for
      static notes.
    </p>

    <section class="mt-8 grid max-w-xl gap-4" aria-labelledby="alert-h">
      <h2 id="alert-h" class="text-lg font-semibold">Alert</h2>
      @for (variant of alertVariants; track variant) {
        <div xnAlert [variant]="variant">
          <h5 xnAlertTitle class="capitalize">{{ variant }} alert</h5>
          <div xnAlertDescription><p>Reserve for messages that matter.</p></div>
        </div>
      }
    </section>

    <section class="mt-10 grid max-w-xl gap-4" aria-labelledby="callout-h">
      <h2 id="callout-h" class="text-lg font-semibold">Callout &amp; banner</h2>
      <div xnCallout variant="accent">
        <p xnCalloutTitle>Note</p>
        <div xnCalloutContent><p>Static note — screen readers are not interrupted.</p></div>
      </div>
      <div xnCallout variant="info">
        <p xnCalloutTitle>Dismissible</p>
        <div xnCalloutContent><p>Closes itself — the button hides its own ancestor callout.</p></div>
        <button xnCalloutDismiss>✕</button>
      </div>
      <div xnBanner>New release shipped <a xnBannerAction href="/components">read more</a></div>
    </section>

    <section class="mt-10" aria-labelledby="loading-h">
      <h2 id="loading-h" class="text-lg font-semibold">Loading states</h2>
      <div class="mt-3 flex items-center gap-4">
        <span xnSpinner aria-label="Loading example"></span>
        <div class="flex items-center gap-3">
          <div xnSkeleton class="size-10 rounded-full"></div>
          <div class="space-y-2">
            <div xnSkeleton class="h-4 w-40"></div>
            <div xnSkeleton class="h-4 w-24"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10 max-w-2xl" aria-labelledby="toast-h">
      <h2 id="toast-h" class="text-lg font-semibold">Toast</h2>
      <app-example-box title="Toast example" [tabs]="toastTabs" class="mt-3 block">
        <button xnButton variant="secondary" (click)="showToast()">Show toast</button>
        <button xnButton variant="destructive" (click)="showDestructiveToast()">
          Show destructive toast
        </button>
      </app-example-box>

      <h3 class="mt-6 text-sm font-semibold">Positions</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        The Toaster's <code>position</code> input picks the fixed corner; toasts rise from a
        bottom corner and fall from a top one.
      </p>
      <app-toast-position-demo class="mt-3 block" />
    </section>

    <section class="mt-10" aria-labelledby="radial-progress-h">
      <h2 id="radial-progress-h" class="text-lg font-semibold">Radial progress (semicircle)</h2>
      <p class="mt-2 max-w-prose text-muted-foreground">
        <code>arc="semi"</code> halves the same stroke-dasharray ring into a gauge — see also the
        full circle in use on the Blocks page.
      </p>
      <div class="mt-3 flex items-center gap-6">
        <span xnRadialProgress arc="semi" value="35" aria-label="Disk usage">35%</span>
        <span xnRadialProgress arc="semi" value="72" aria-label="Battery">72%</span>
        <span xnRadialProgress arc="semi" value="100" aria-label="Quest complete">100%</span>
      </div>
    </section>
  `,
})
export class FeedbackDoc {
  protected readonly alertVariants = Object.keys(
    alertVariantConfig.variants.variant,
  ) as AlertVariantName[];

  private readonly toastService = inject(ToastService);

  protected readonly toastTabs = [
    {
      label: 'Angular',
      code: `<button xnButton variant="secondary" (click)="save()">Show toast</button>`,
    },
    {
      label: 'TypeScript',
      code: `import { ToastService } from '@xenode/ui';

private readonly toast = inject(ToastService);

protected save(): void {
  this.toast.show('Changes saved.', { title: 'Saved', variant: 'success' });
}`,
    },
  ] as const;

  protected showToast(): void {
    this.toastService.show('Changes saved to the library.', { title: 'Saved' });
  }

  protected showDestructiveToast(): void {
    this.toastService.show('The deploy step exited non-zero.', {
      title: 'Deploy failed',
      variant: 'destructive',
    });
  }
}
