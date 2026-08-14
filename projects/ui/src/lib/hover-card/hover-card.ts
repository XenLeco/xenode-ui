import {
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { cn } from '../cn';

/**
 * A hover/focus preview panel (think GitHub profile cards):
 *
 * ```html
 * <a href="…" [xnHoverCardTriggerFor]="card">&#64;danleco</a>
 * <ng-template #card xnHoverCard>
 *   <div xnHoverCardPanel>…preview…</div>
 * </ng-template>
 * ```
 *
 * Opens after a short delay, and moving the pointer INTO the card cancels
 * the close — without that, the card is unreachable. Supplementary content
 * only: everything in it must be reachable some other way too.
 */

@Directive({ selector: 'ng-template[xnHoverCard]', exportAs: 'xnHoverCard' })
export class HoverCard {
  readonly templateRef = inject(TemplateRef);
}

@Directive({
  selector: '[xnHoverCardPanel]',
  host: {
    'data-slot': 'hover-card',
    '[class]': 'classes()',
  },
})
export class HoverCardPanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'z-50 block w-64 rounded-md border bg-background p-4 text-sm text-foreground shadow-md outline-none transition-[opacity,scale] duration-200 ease-out-expo starting:scale-[0.97] starting:opacity-0',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnHoverCardTriggerFor]',
  host: {
    '(mouseenter)': 'scheduleOpen()',
    '(mouseleave)': 'scheduleClose()',
    '(focus)': 'scheduleOpen()',
    '(blur)': 'scheduleClose()',
    '(keydown.escape)': 'closeNow()',
  },
})
export class HoverCardTrigger implements OnDestroy {
  readonly hoverCard = input.required<HoverCard>({ alias: 'xnHoverCardTriggerFor' });
  readonly openDelay = input(300, { transform: numberAttribute });
  readonly closeDelay = input(200, { transform: numberAttribute });

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected scheduleOpen(): void {
    this.cancelTimers();
    this.openTimer = setTimeout(() => this.openNow(), this.openDelay());
  }

  protected scheduleClose(): void {
    this.cancelTimers();
    this.closeTimer = setTimeout(() => this.closeNow(), this.closeDelay());
  }

  private openNow(): void {
    if (this.overlayRef?.hasAttached()) return;
    this.overlayRef ??= this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 6 },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -6,
          },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.attach(new TemplatePortal(this.hoverCard().templateRef, this.viewContainerRef));
    // Entering the card must cancel the close, or it can never be reached.
    this.overlayRef.overlayElement.addEventListener('mouseenter', this.cancelTimers);
    this.overlayRef.overlayElement.addEventListener('mouseleave', this.onOverlayLeave);
  }

  protected closeNow(): void {
    this.cancelTimers();
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.overlayElement.removeEventListener('mouseenter', this.cancelTimers);
      this.overlayRef.overlayElement.removeEventListener('mouseleave', this.onOverlayLeave);
      this.overlayRef.detach();
    }
  }

  private readonly cancelTimers = (): void => {
    if (this.openTimer !== null) clearTimeout(this.openTimer);
    if (this.closeTimer !== null) clearTimeout(this.closeTimer);
    this.openTimer = null;
    this.closeTimer = null;
  };

  private readonly onOverlayLeave = (): void => {
    this.scheduleClose();
  };

  ngOnDestroy(): void {
    this.cancelTimers();
    this.overlayRef?.dispose();
  }
}

/** Convenience for `imports: [XN_HOVER_CARD]`. */
export const XN_HOVER_CARD = [HoverCard, HoverCardPanel, HoverCardTrigger] as const;
