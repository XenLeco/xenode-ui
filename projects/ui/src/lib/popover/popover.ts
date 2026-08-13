import {
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

import { cn } from '../cn';

/**
 * Click-toggled anchored panel with template content:
 *
 * ```html
 * <button xnButton [xnPopoverTriggerFor]="pop">Open</button>
 * <ng-template #pop xnPopover>
 *   <div xnPopoverPanel>Any content.</div>
 * </ng-template>
 * ```
 *
 * Non-modal: focus stays where it is, outside click and Escape close.
 */

@Directive({ selector: 'ng-template[xnPopover]', exportAs: 'xnPopover' })
export class Popover {
  readonly templateRef = inject(TemplateRef);
}

/** Styling for the panel root inside the template. */
@Directive({
  selector: '[xnPopoverPanel]',
  host: {
    'data-slot': 'popover',
    '[class]': 'classes()',
  },
})
export class PopoverPanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'z-50 block w-72 rounded-md border bg-background p-4 text-sm text-foreground shadow-md outline-none',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnPopoverTriggerFor]',
  host: {
    '(click)': 'toggle()',
    '(keydown.escape)': 'close()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'open()',
  },
})
export class PopoverTrigger implements OnDestroy {
  readonly popover = input.required<Popover>({ alias: 'xnPopoverTriggerFor' });

  protected readonly open = signal(false);

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;
  private outsideClicks: Subscription | null = null;

  protected toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.overlayRef ??= this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.attach(new TemplatePortal(this.popover().templateRef, this.viewContainerRef));
    this.outsideClicks = this.overlayRef.outsidePointerEvents().subscribe((event) => {
      if (!this.elementRef.nativeElement.contains(event.target as Node)) this.close();
    });
    this.open.set(true);
  }

  protected close(): void {
    this.outsideClicks?.unsubscribe();
    this.outsideClicks = null;
    this.overlayRef?.detach();
    this.open.set(false);
  }

  ngOnDestroy(): void {
    this.outsideClicks?.unsubscribe();
    this.overlayRef?.dispose();
  }
}

/** Convenience for `imports: [XN_POPOVER]`. */
export const XN_POPOVER = [Popover, PopoverPanel, PopoverTrigger] as const;
