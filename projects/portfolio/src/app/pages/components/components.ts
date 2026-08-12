import { Component } from '@angular/core';

import { Button, buttonVariantConfig } from '@xenode/ui';

type VariantName = keyof typeof buttonVariantConfig.variants.variant;
type SizeName = keyof typeof buttonVariantConfig.variants.size;

@Component({
  selector: 'app-components',
  imports: [Button],
  templateUrl: './components.html',
})
export class Components {
  // Derived from the library's own variants object: the matrix below cannot
  // drift from what the component actually supports.
  protected readonly variants = Object.keys(buttonVariantConfig.variants.variant) as VariantName[];
  protected readonly sizes = Object.keys(buttonVariantConfig.variants.size) as SizeName[];
}
