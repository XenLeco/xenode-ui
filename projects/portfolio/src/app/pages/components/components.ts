import { Component, ElementRef, afterEveryRender, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { XN_UI_VERSION } from '@xenode/ui';

interface TocEntry {
  readonly id: string;
  readonly label: string;
}

/**
 * Docs shell: sticky category nav + a child outlet. Every category page is
 * its own lazy route so no single page carries the whole library.
 *
 * The "On this page" rail is DOM-derived — it lists whatever h2[id]
 * elements the routed page actually rendered, so it cannot drift from the
 * content. Collected after every render with an equality guard so the
 * signal write cannot re-trigger itself.
 */
@Component({
  selector: 'app-components',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <!-- One nav, two shapes: scrollable pill row on phones, sticky column
           from sm up. Hiding it on mobile left phones with no navigation.
           The mobile padding is focus-ring headroom: a scroll container
           clips outlines to its padding box (2px ring + 2px offset = 4px
           per side); sm+ drops the overflow so no headroom is needed. The
           fade zone lives in the padding so the first pill stays crisp. -->
      <aside class="w-full shrink-0 sm:w-40">
        <nav
          aria-label="Component docs"
          class="scroll-fade-x -mx-4 flex gap-1 overflow-x-auto px-4 pt-1 pb-2 sm:sticky sm:top-4 sm:mx-0 sm:mask-none sm:flex-col sm:gap-0.5 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0"
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

        @if (adjacent(); as adj) {
          <nav aria-label="Docs pages" class="mt-12 flex justify-between gap-4 border-t pt-6">
            @if (adj.prev; as prev) {
              <a
                [routerLink]="prev.path === '.' ? ['/components'] : ['/components', prev.path]"
                class="group rounded-md py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                data-slot="docs-prev"
              >
                <span class="text-xs text-muted-foreground">Previous</span>
                <span class="block font-medium group-hover:underline">{{ prev.label }}</span>
              </a>
            } @else {
              <span></span>
            }
            @if (adj.next; as next) {
              <a
                [routerLink]="['/components', next.path]"
                class="group rounded-md py-1 text-right text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                data-slot="docs-next"
              >
                <span class="text-xs text-muted-foreground">Next</span>
                <span class="block font-medium group-hover:underline">{{ next.label }}</span>
              </a>
            }
          </nav>
        }
      </div>
      <!-- The rail is harvested client-side (render hooks don't run while
           prerendering), so its column is reserved unconditionally at xl —
           otherwise the article visibly narrows when the TOC pops in. -->
      <aside class="hidden w-44 shrink-0 xl:block">
        @if (toc().length > 1) {
          <nav aria-label="On this page" class="sticky top-4 flex flex-col gap-0.5" data-slot="docs-toc">
            <span class="px-2 text-xs font-medium">On this page</span>
            @for (entry of toc(); track entry.id) {
              <a
                [routerLink]="[]"
                [fragment]="entry.id"
                class="rounded-md px-2 py-1 text-sm text-muted-foreground transition-[color] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >{{ entry.label }}</a
              >
            }
          </nav>
        }
      </aside>
    </div>
  `,
})
export class Components {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);

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

  protected readonly toc = signal<readonly TocEntry[]>([]);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly adjacent = computed(() => {
    const segment = this.url().split('#')[0].split('?')[0].replace(/^\/components\/?/, '') || '.';
    const index = this.pages.findIndex((page) => page.path === segment);
    if (index < 0) return undefined;
    return {
      prev: index > 0 ? this.pages[index - 1] : undefined,
      next: index < this.pages.length - 1 ? this.pages[index + 1] : undefined,
    };
  });

  constructor() {
    afterEveryRender(() => {
      // Closed dialogs and inert panels are in the DOM but unreadable —
      // their headings would be phantom links that scroll nowhere.
      const found = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('h2[id]'))
        .filter((heading) => !heading.closest('dialog:not([open]), [inert]'))
        .map((heading) => ({ id: heading.id, label: heading.textContent?.trim() ?? '' }));
      if (found.map((entry) => entry.id).join('|') !== this.toc().map((entry) => entry.id).join('|')) {
        this.toc.set(found);
      }
    });
  }
}
