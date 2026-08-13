import { Directive, ElementRef, computed, inject, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Horizontal resizable panels. The handle is a real separator: pointer drag
 * AND arrow keys (16px steps) resize the panel before it — keyboard users
 * resize too, per the separator pattern.
 */

@Directive({
  selector: '[xnResizableGroup]',
  host: { 'data-slot': 'resizable-group', '[class]': 'classes()' },
})
export class ResizableGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex w-full items-stretch', this.userClass()));
}

@Directive({
  selector: '[xnResizablePanel]',
  host: { 'data-slot': 'resizable-panel', '[class]': 'classes()' },
})
export class ResizablePanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('min-w-24 flex-1 overflow-auto', this.userClass()),
  );
}

@Directive({
  selector: '[xnResizableHandle]',
  host: {
    'data-slot': 'resizable-handle',
    role: 'separator',
    'aria-orientation': 'vertical',
    tabindex: '0',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown.arrowleft)': 'nudge(-16, $event)',
    '(keydown.arrowright)': 'nudge(16, $event)',
    '[class]': 'classes()',
  },
})
export class ResizableHandle {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'w-1 shrink-0 cursor-col-resize bg-border transition-[background-color] hover:bg-ring focus-visible:outline-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );

  private panelBefore(): HTMLElement | null {
    return this.elementRef.nativeElement.previousElementSibling as HTMLElement | null;
  }

  protected onPointerDown(event: PointerEvent): void {
    const panel = this.panelBefore();
    if (!panel) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = panel.getBoundingClientRect().width;
    const onMove = (move: PointerEvent): void => {
      panel.style.flex = 'none';
      panel.style.width = `${Math.max(96, startWidth + (move.clientX - startX))}px`;
    };
    const onUp = (): void => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  protected nudge(delta: number, event: Event): void {
    const panel = this.panelBefore();
    if (!panel) return;
    event.preventDefault();
    const width = panel.getBoundingClientRect().width;
    panel.style.flex = 'none';
    panel.style.width = `${Math.max(96, width + delta)}px`;
  }
}

export const RESIZABLE = [ResizableGroup, ResizablePanel, ResizableHandle] as const;
