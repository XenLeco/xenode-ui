import { Component } from '@angular/core';

import {
  Button,
  ButtonGroup,
  buttonVariantConfig,
  Toggle,
  ToggleGroup,
  Tooltip,
} from '@xenode/ui';

type VariantName = keyof typeof buttonVariantConfig.variants.variant;
type SizeName = keyof typeof buttonVariantConfig.variants.size;

@Component({
  selector: 'app-docs-buttons',
  imports: [Button, ButtonGroup, Toggle, ToggleGroup, Tooltip],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Buttons</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      The matrix below is generated from the component's own variants object.
    </p>

    <section class="mt-8" aria-labelledby="button-heading">
      <h2 id="button-heading" class="text-lg font-semibold">Button</h2>
      @for (size of sizes; track size) {
        <div class="mt-4">
          <h3 class="text-sm font-medium text-muted-foreground">size: {{ size }}</h3>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            @for (variant of variants; track variant) {
              @if (size === 'icon') {
                <button xnButton [variant]="variant" size="icon" [attr.aria-label]="variant + ' example'">✕</button>
              } @else {
                <button xnButton [variant]="variant" [size]="size" class="capitalize">{{ variant }}</button>
              }
            }
          </div>
        </div>
      }
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button xnButton class="rounded-full">class="rounded-full" wins</button>
        <button xnButton disabled>Disabled</button>
        <button xnButton variant="ghost" [xnTooltip]="'Tooltips supplement a label, never replace it'">
          Hover or focus me
        </button>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="group-heading">
      <h2 id="group-heading" class="text-lg font-semibold">Button group</h2>
      <div xnButtonGroup aria-label="View density" class="mt-3">
        <button xnButton variant="outline" size="sm">Compact</button>
        <button xnButton variant="outline" size="sm">Cozy</button>
        <button xnButton variant="outline" size="sm">Comfortable</button>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="toggle-heading">
      <h2 id="toggle-heading" class="text-lg font-semibold">Toggle</h2>
      <div xnToggleGroup aria-label="Text style" class="mt-3">
        <button xnToggle>Bold</button>
        <button xnToggle>Italic</button>
        <button xnToggle disabled>Locked</button>
      </div>
    </section>
  `,
})
export class ButtonsDoc {
  protected readonly variants = Object.keys(buttonVariantConfig.variants.variant) as VariantName[];
  protected readonly sizes = Object.keys(buttonVariantConfig.variants.size) as SizeName[];
}
