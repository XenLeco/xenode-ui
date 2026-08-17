import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Mobile bottom navigation. `nav[xnDock]` is fixed to the viewport by
 * default (with safe-area padding for notched devices) — override the
 * position utility with a consumer class (`class="static"`) to demo it
 * inline, e.g. inside a phone mockup; `top`/`bottom`/`inset-*` are simply
 * inert once position is no longer fixed, so nothing else needs clearing.
 */
@Directive({
  selector: 'nav[xnDock]',
  host: { 'data-slot': 'dock', '[class]': 'classes()' },
})
export class Dock {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur',
      this.userClass(),
    ),
  );
}

/** Icon-over-label destination link; aria-current marks the active route. */
@Directive({
  selector: 'a[xnDockItem]',
  host: { 'data-slot': 'dock-item', '[class]': 'classes()' },
})
export class DockItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.65rem] font-medium text-muted-foreground transition-[color] hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=page]:text-foreground',
      this.userClass(),
    ),
  );
}

/** Convenience for `imports: [DOCK]`. */
export const DOCK = [Dock, DockItem] as const;
