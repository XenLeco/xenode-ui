import { Component, signal } from '@angular/core';

import { Button, Callout, CalloutContent, CalloutTitle } from '@xenode/ui';

import { CodeSnippet } from './code-snippet';

@Component({
  selector: 'app-docs-motion',
  imports: [Button, Callout, CalloutTitle, CalloutContent, CodeSnippet],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Motion</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Named entrance presets from the theme (<code class="font-mono text-xs">--animate-*</code>
      tokens), plus the starting-style transitions the overlays use. Replay re-mounts the tiles.
    </p>

    <button xnButton variant="outline" class="mt-6" (click)="replay()">Replay</button>

    @if (visible()) {
      <div class="mt-4 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
        @for (preset of presets; track preset) {
          <div
            [class]="'flex h-20 items-center justify-center rounded-lg border bg-card text-xs ' + 'animate-' + preset"
          >
            animate-{{ preset }}
          </div>
        }
      </div>
    }

    <div class="mt-8 max-w-xl">
      <app-code-snippet
        [code]="'<div class=&quot;animate-fade-in-up&quot;>…</div>'"
        label="motion usage"
      />
    </div>

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
  protected readonly presets = [
    'fade-in',
    'fade-in-up',
    'zoom-in',
    'slide-in-left',
    'slide-in-right',
  ];

  protected readonly visible = signal(true);

  protected replay(): void {
    this.visible.set(false);
    setTimeout(() => this.visible.set(true), 30);
  }
}
