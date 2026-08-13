import { Component } from '@angular/core';

import { Badge, badgeVariantConfig, Button, buttonVariantConfig, CARD } from '@xenode/ui';

type VariantName = keyof typeof buttonVariantConfig.variants.variant;
type SizeName = keyof typeof buttonVariantConfig.variants.size;
type BadgeVariantName = keyof typeof badgeVariantConfig.variants.variant;

@Component({
  selector: 'app-components',
  imports: [Button, Badge, CARD],
  templateUrl: './components.html',
})
export class Components {
  // Derived from the library's own variants objects: the matrices below
  // cannot drift from what the components actually support.
  protected readonly variants = Object.keys(buttonVariantConfig.variants.variant) as VariantName[];
  protected readonly sizes = Object.keys(buttonVariantConfig.variants.size) as SizeName[];
  protected readonly badgeVariants = Object.keys(
    badgeVariantConfig.variants.variant,
  ) as BadgeVariantName[];
}
