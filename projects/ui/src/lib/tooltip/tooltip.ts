import {
  Component,
  Directive,
  ElementRef,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
  type ComponentRef,
  type OnDestroy,
} from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { cn } from '../cn';

let nextTooltipId = 0;

/** Internal overlay content — positioned by the Tooltip directive. */
@Component({
  selector: 'xn-tooltip-content',
  template: `
    {{ text() }}
    <span aria-hidden="true" data-slot="tooltip-arrow" [class]="arrowClasses()"></span>
  `,
  host: {
    'data-slot': 'tooltip',
    role: 'tooltip',
    '[id]': 'id()',
    '[class]': 'classes()',
  },
})
export class TooltipContent {
  readonly text = input('');
  readonly id = input('');
  /** Which side of the trigger the flexible strategy resolved to land on. */
  readonly side = input<'top' | 'bottom'>('top');

  protected readonly classes = computed(() =>
    cn(
      'relative z-50 block w-fit max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground transition-[opacity,scale] duration-150 ease-snappy starting:scale-[0.97] starting:opacity-0',
    ),
  );

  // A rotated square, half-hidden behind the bubble it's attached to and
  // half poking into the gap toward the trigger — same fill as the bubble
  // (no separate border token: the bubble itself has none to match).
  protected readonly arrowClasses = computed(() =>
    cn(
      'absolute left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-primary',
      this.side() === 'top' ? '-bottom-1' : '-top-1',
    ),
  );
}

/**
 * `<button xnButton [xnTooltip]="'Copy to clipboard'">…</button>`
 *
 * The one sanctioned selector-as-input alias. Shows on hover AND focus
 * (keyboard users hover nothing), hides on leave/blur/Escape, and links
 * trigger to content with aria-describedby only while visible.
 *
 * `showDelay` (ms) defers the show only — leaving, blurring or Escape
 * before the timer fires cancels it outright, and hiding itself is always
 * instant so the tooltip never lingers past its trigger.
 *
 * A tooltip must never be the only label: it supplements a control that
 * already has an accessible name.
 */
@Directive({
  selector: '[xnTooltip]',
  host: {
    '(mouseenter)': 'scheduleShow()',
    '(mouseleave)': 'cancelAndHide()',
    '(focus)': 'scheduleShow()',
    '(blur)': 'cancelAndHide()',
    '(keydown.escape)': 'onEscape($event)',
    '[attr.aria-describedby]': 'visible() ? contentId : null',
  },
})
export class Tooltip implements OnDestroy {
  readonly text = input.required<string>({ alias: 'xnTooltip' });
  readonly showDelay = input(0, { transform: numberAttribute });

  protected readonly contentId = `xn-tooltip-${nextTooltipId++}`;
  protected readonly visible = signal(false);
  /** Side resolved by the last positionChanges emission; seeds the arrow. */
  protected readonly side = signal<'top' | 'bottom'>('top');

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private contentRef: ComponentRef<TooltipContent> | null = null;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  protected scheduleShow(): void {
    this.clearPendingTimer();
    const delay = this.showDelay();
    if (delay <= 0) {
      this.show();
      return;
    }
    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null;
      this.show();
    }, delay);
  }

  protected cancelAndHide(): void {
    this.clearPendingTimer();
    this.hide();
  }

  protected onEscape(event: Event): void {
    // Consume Escape only while showing: dismissing just the tooltip must
    // not also close a wrapping <dialog> in the same keypress.
    if (this.visible()) event.preventDefault();
    this.cancelAndHide();
  }

  private show(): void {
    if (this.overlayRef?.hasAttached()) return;
    if (!this.overlayRef) {
      this.positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -6,
          },
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 6 },
        ]);
      // Subscribed once — the strategy (and this subscription) outlive
      // individual show/hide cycles, and OverlayRef.dispose() tears it
      // down via positionStrategy.dispose() in ngOnDestroy. Set up before
      // the first attach() so the synchronous first emission isn't missed.
      this.positionStrategy.positionChanges.subscribe((change) => {
        const resolved = change.connectionPair.overlayY === 'bottom' ? 'top' : 'bottom';
        this.side.set(resolved);
        this.contentRef?.setInput('side', resolved);
      });
      this.overlayRef = this.overlay.create({
        positionStrategy: this.positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }
    this.contentRef = this.overlayRef.attach(new ComponentPortal(TooltipContent));
    this.contentRef.setInput('text', this.text());
    this.contentRef.setInput('id', this.contentId);
    this.contentRef.setInput('side', this.side());
    this.visible.set(true);
  }

  private hide(): void {
    this.overlayRef?.detach();
    this.contentRef = null;
    this.visible.set(false);
  }

  private clearPendingTimer(): void {
    if (this.pendingTimer !== null) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearPendingTimer();
    this.overlayRef?.dispose();
  }
}
