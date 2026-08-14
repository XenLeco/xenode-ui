import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { XN_UI_VERSION } from '@xenode/ui';

/**
 * Docs shell: sticky category nav + a child outlet. Every category page is
 * its own lazy route so no single page carries the whole library.
 */
@Component({
  selector: 'app-components',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <!-- One nav, two shapes: scrollable pill row on phones, sticky column
           from sm up. Hiding it on mobile left phones with no navigation. -->
      <aside class="w-full shrink-0 sm:w-40">
        <nav
          aria-label="Component docs"
          class="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 sm:sticky sm:top-4 sm:mx-0 sm:flex-col sm:gap-0.5 sm:px-0 sm:pb-0"
        >
          @for (page of pages; track page.path) {
            <a
              [routerLink]="page.path"
              routerLinkActive="bg-secondary text-foreground"
              [routerLinkActiveOptions]="{ exact: page.exact }"
              ariaCurrentWhenActive="page"
              class="rounded-md px-2 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-[color,background-color] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >{{ page.label }}</a
            >
          }
          <span
            class="hidden px-2 text-xs text-muted-foreground sm:mt-3 sm:block"
            data-slot="docs-version"
            >&#64;xenode/ui v{{ version }}</span
          >
        </nav>
      </aside>
      <div class="min-w-0 flex-1">
        <router-outlet />
      </div>
    </div>
  `,
})
export class Components {
  protected readonly pages = [
    { path: '.', label: 'Overview', exact: true },
    { path: 'buttons', label: 'Buttons', exact: false },
    { path: 'forms', label: 'Forms', exact: false },
    { path: 'display', label: 'Display', exact: false },
    { path: 'feedback', label: 'Feedback', exact: false },
    { path: 'navigation', label: 'Navigation', exact: false },
    { path: 'overlays', label: 'Overlays', exact: false },
    { path: 'disclosure', label: 'Disclosure & data', exact: false },
    { path: 'typography', label: 'Typography', exact: false },
    { path: 'chat', label: 'Chat', exact: false },
    { path: 'blocks', label: 'Blocks', exact: false },
    { path: 'motion', label: 'Motion', exact: false },
    { path: 'layout', label: 'Layout', exact: false },
  ] as const;

  protected readonly version = XN_UI_VERSION;
}
