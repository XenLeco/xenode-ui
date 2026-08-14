import { Component, signal } from '@angular/core';

import { Button, Callout, CalloutContent, CalloutTitle } from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-motion',
  imports: [Button, Callout, CalloutTitle, CalloutContent, ExampleBox],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Motion</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Named entrance presets from the theme (<code class="font-mono text-xs">--animate-*</code>
      tokens), plus the starting-style transitions the overlays use. Replay re-mounts the tiles.
    </p>

    <button xnButton variant="outline" class="mt-6" (click)="replay()">Replay</button>

    <p class="mt-2 text-xs text-muted-foreground">
      Demo runs each preset at 1.5s with a stagger so it can be inspected — production durations are
      0.2–0.5s.
    </p>

    @if (visible()) {
      <div class="mt-4 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
        @for (preset of presets; track preset) {
          <div
            [class]="
              'flex h-20 items-center justify-center rounded-lg border bg-card text-xs ' + preset
            "
            [style.animation-duration]="'1.5s'"
            [style.animation-delay]="$index * 200 + 'ms'"
          >
            {{ preset }}
          </div>
        }
      </div>
    }

    <app-example-box title="Motion usage" [tabs]="motionTabs" class="mt-8 block max-w-xl">
      <div
        class="flex h-20 w-40 items-center justify-center rounded-lg border bg-card text-xs animate-fade-in-up"
      >
        animate-fade-in-up
      </div>
    </app-example-box>

    <div xnCallout variant="accent" class="mt-8 max-w-xl">
      <p xnCalloutTitle>Reduced motion is respected globally</p>
      <div xnCalloutContent>
        <p>
          The theme collapses every animation and transition to ~0ms under
          <code class="font-mono text-xs">prefers-reduced-motion: reduce</code> — presets, overlay
          entrances and scroll behavior included. Motion is decoration here, never information.
        </p>
      </div>
    </div>
  `,
})
export class MotionDoc {
  // Full class names as literals — Tailwind only emits utilities it finds
  // whole in source; 'animate-' + name is invisible to the scanner.
  protected readonly presets = [
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-fade-in-down',
    'animate-zoom-in',
    'animate-slide-in-left',
    'animate-slide-in-right',
    'animate-blur-in',
    'animate-rise',
    'animate-pop',
    'animate-shake',
  ];

  protected readonly visible = signal(true);

  protected replay(): void {
    this.visible.set(false);
    setTimeout(() => this.visible.set(true), 30);
  }

  // Plain HTML is a literal class here — animate-* presets are the public
  // API, not a computed variants() function, so there's nothing to interpolate.
  protected readonly motionTabs = [
    {
      label: 'Angular',
      code: `<div class="flex h-20 w-40 items-center justify-center rounded-lg border bg-card text-xs animate-fade-in-up">
  animate-fade-in-up
</div>`,
    },
    {
      label: 'Plain HTML',
      code: `<!-- Works in any framework: Tailwind + theme.css carry the system -->
<div class="animate-fade-in-up">…</div>`,
    },
  ] as const;
}
