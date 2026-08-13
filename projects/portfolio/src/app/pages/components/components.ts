import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * Docs shell: sticky category nav + a child outlet. Every category page is
 * its own lazy route so no single page carries the whole library.
 */
@Component({
  selector: 'app-components',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex gap-8">
      <aside class="hidden w-40 shrink-0 sm:block">
        <nav aria-label="Component docs" class="sticky top-4 flex flex-col gap-0.5">
          @for (page of pages; track page.path) {
            <a
              [routerLink]="page.path"
              routerLinkActive="bg-secondary text-foreground"
              [routerLinkActiveOptions]="{ exact: page.exact }"
              ariaCurrentWhenActive="page"
              class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-[color,background-color] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >{{ page.label }}</a
            >
          }
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
  ] as const;
}
