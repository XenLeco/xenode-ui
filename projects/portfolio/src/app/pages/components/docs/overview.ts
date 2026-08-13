import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CARD } from '@xenode/ui';

@Component({
  selector: 'app-docs-overview',
  imports: [RouterLink, CARD],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Components</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      201 components across 60+ families. Every example is generated from the same variants
      objects the components use, so these pages cannot drift from the code. Pick a category:
    </p>
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      @for (section of sections; track section.path) {
        <a [routerLink]="section.path" class="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg">
          <div xnCard class="h-full gap-2 py-4 transition-[border-color] group-hover:border-ring">
            <div xnCardHeader>
              <h2 xnCardTitle class="text-base">{{ section.label }}</h2>
              <p xnCardDescription>{{ section.blurb }}</p>
            </div>
          </div>
        </a>
      }
    </div>
  `,
})
export class Overview {
  protected readonly sections = [
    { path: 'buttons', label: 'Buttons', blurb: 'Button variants, groups and toggles' },
    { path: 'forms', label: 'Forms', blurb: 'Inputs, native controls, fields and OTP' },
    { path: 'display', label: 'Display', blurb: 'Badges, stats, timelines, avatars and more' },
    { path: 'feedback', label: 'Feedback', blurb: 'Alerts, callouts, toasts and loading states' },
    { path: 'navigation', label: 'Navigation', blurb: 'Tabs, breadcrumbs, sidebars and menus' },
    { path: 'overlays', label: 'Overlays', blurb: 'Dialogs, sheets, tooltips and dropdowns' },
    { path: 'disclosure', label: 'Disclosure & data', blurb: 'Accordions, tables and panels' },
    { path: 'typography', label: 'Typography', blurb: 'Prose, code and page shells' },
    { path: 'chat', label: 'Chat', blurb: 'Bubbles, messages and attachments' },
  ] as const;
}
