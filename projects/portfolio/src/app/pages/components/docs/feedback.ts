import { Component, inject } from '@angular/core';

import {
  ALERT,
  alertVariantConfig,
  Banner,
  BannerAction,
  CALLOUT,
  Skeleton,
  Spinner,
  Button,
  ToastService,
} from '@xenode/ui';

type AlertVariantName = keyof typeof alertVariantConfig.variants.variant;

@Component({
  selector: 'app-docs-feedback',
  imports: [ALERT, CALLOUT, Banner, BannerAction, Skeleton, Spinner, Button],
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

    <section class="mt-10" aria-labelledby="toast-h">
      <h2 id="toast-h" class="text-lg font-semibold">Toast</h2>
      <div class="mt-3 flex flex-wrap gap-3">
        <button xnButton variant="secondary" (click)="showToast()">Show toast</button>
        <button xnButton variant="destructive" (click)="showDestructiveToast()">
          Show destructive toast
        </button>
      </div>
    </section>
  `,
})
export class FeedbackDoc {
  protected readonly alertVariants = Object.keys(
    alertVariantConfig.variants.variant,
  ) as AlertVariantName[];

  private readonly toastService = inject(ToastService);

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
