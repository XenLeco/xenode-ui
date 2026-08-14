import {
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { cn } from '../cn';

let nextTooltipId = 0;

/** Internal overlay content — positioned by the Tooltip directive. */
@Component({
  selector: 'xn-tooltip-content',
  template: `{{ text() }}`,
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
  protected readonly classes = computed(() =>
    cn(
      'z-50 block w-fit max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground transition-[opacity,scale] duration-150 ease-snappy starting:scale-[0.97] starting:opacity-0',
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
 * A tooltip must never be the only label: it supplements a control that
 * already has an accessible name.
 */
@Directive({
  selector: '[xnTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
    '(keydown.escape)': 'hide()',
    '[attr.aria-describedby]': 'visible() ? contentId : null',
  },
})
export class Tooltip implements OnDestroy {
  readonly text = input.required<string>({ alias: 'xnTooltip' });

  protected readonly contentId = `xn-tooltip-${nextTooltipId++}`;
  protected readonly visible = signal(false);

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private overlayRef: OverlayRef | null = null;

  protected show(): void {
    if (this.overlayRef?.hasAttached()) return;
    this.overlayRef ??= this.overlay.create({
      positionStrategy: this.overlay
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
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    const ref = this.overlayRef.attach(new ComponentPortal(TooltipContent));
    ref.setInput('text', this.text());
    ref.setInput('id', this.contentId);
    this.visible.set(true);
  }

  protected hide(): void {
    this.overlayRef?.detach();
    this.visible.set(false);
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}
