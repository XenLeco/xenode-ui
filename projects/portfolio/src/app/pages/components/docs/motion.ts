import { Component, signal } from '@angular/core';

import { Button, Callout, CalloutContent, CalloutTitle, RollingNumber } from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-motion',
  imports: [Button, Callout, CalloutTitle, CalloutContent, ExampleBox, RollingNumber],
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

    <section class="mt-10" aria-labelledby="rolling-number-h">
      <h2 id="rolling-number-h" class="text-lg font-semibold">Rolling number</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        Each digit is a 0-9 strip that translates into place. The strips are decoration
        (aria-hidden); the host carries the real value as sr-only text.
      </p>
      <button
        xnButton
        variant="outline"
        class="mt-3"
        (click)="rollingValue.set(rollingValue() + 137)"
      >
        +137
      </button>
      <app-example-box
        title="Rolling number example"
        [tabs]="rollingNumberTabs"
        class="mt-3 block max-w-xs"
      >
        <xn-rolling-number [value]="rollingValue()" class="text-3xl"></xn-rolling-number>
      </app-example-box>
    </section>
  `,
})
export class MotionDoc {
  protected readonly rollingValue = signal(2026);

  protected readonly rollingNumberTabs = [
    {
      label: 'Angular',
      code: `<xn-rolling-number [value]="score()" class="text-3xl"></xn-rolling-number>`,
    },
    {
      label: 'TypeScript',
      code: `import { RollingNumber } from '@xenode/ui';

@Component({
  imports: [RollingNumber],
  templateUrl: './scoreboard.html',
})
export class Scoreboard {
  protected readonly score = signal(0);
}`,
    },
  ] as const;

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
