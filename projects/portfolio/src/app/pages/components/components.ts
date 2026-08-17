import {
  Component,
  ElementRef,
  afterEveryRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { filter, map } from 'rxjs';

import {
  ComboboxPanel,
  DIALOG,
  Highlight,
  Input,
  Kbd,
  XN_UI_VERSION,
  XnListboxOption,
} from '@xenode/ui';

import { SEARCH_INDEX, searchKey, type SearchEntry } from './docs/search-index';

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
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DIALOG,
    Input,
    Kbd,
    Highlight,
    ComboboxPanel,
    XnListboxOption,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
  ],
  host: {
    '(document:keydown.control.k)': 'onSearchShortcut($event)',
    '(document:keydown.meta.k)': 'onSearchShortcut($event)',
  },
  template: `
    <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <!-- One nav, two shapes: scrollable pill row on phones, sticky column
           from sm up. Hiding it on mobile left phones with no navigation.
           The mobile padding is focus-ring headroom: a scroll container
           clips outlines to its padding box (2px ring + 2px offset = 4px
           per side); sm+ drops the overflow so no headroom is needed. The
           fade zone lives in the padding so the first pill stays crisp. -->
      <aside class="w-full shrink-0 sm:w-40">
        <!-- ⌘K trigger. From sm up it is a field-shaped button above the
             column; on phones (no command key) it joins the pill row. -->
        <button
          type="button"
          data-slot="docs-search-trigger"
          class="mb-2 hidden w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input px-2.5 py-1.5 text-sm text-muted-foreground transition-[color,border-color] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex"
          (click)="openSearch()"
        >
          Search docs… <kbd xnKbd aria-hidden="true">⌘K</kbd>
        </button>
        <nav
          aria-label="Component docs"
          class="scroll-fade-x -mx-4 flex gap-1 overflow-x-auto px-4 pt-1 pb-2 sm:sticky sm:top-4 sm:mx-0 sm:mask-none sm:flex-col sm:gap-0.5 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0"
        >
          <button
            type="button"
            data-slot="docs-search-trigger-mobile"
            class="cursor-pointer rounded-md border border-input px-2 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-[color,border-color] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:hidden"
            (click)="openSearch()"
          >
            Search…
          </button>
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
          <nav
            aria-label="On this page"
            class="sticky top-4 flex flex-col gap-0.5"
            data-slot="docs-toc"
          >
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

      <dialog xnDialog #searchDlg aria-label="Search docs" class="max-w-md p-2">
        <div class="grid gap-1">
          <input
            xnInput
            ngCombobox
            #search="ngCombobox"
            [(value)]="searchQuery"
            placeholder="Search components…"
            aria-label="Search docs"
            class="border-0 focus-visible:outline-0"
          />
          <ng-template ngComboboxPopup [combobox]="search">
            <div
              xnComboboxPanel
              ngComboboxWidget
              ngListbox
              #slb="ngListbox"
              focusMode="activedescendant"
              selectionMode="explicit"
              [(value)]="searchSelection"
              (valueChange)="goTo($event); searchDlg.close()"
              [activeDescendant]="slb.activeDescendant()"
              aria-label="Docs sections"
              class="static mt-0 max-h-80 w-full border-0 shadow-none"
            >
              @for (entry of results(); track key(entry)) {
                <div
                  xnListboxOption
                  ngOption
                  [value]="key(entry)"
                  class="flex items-center gap-1.5"
                >
                  <xn-highlight
                    class="shrink-0 text-muted-foreground"
                    [text]="entry.pageLabel"
                    [query]="searchQuery()"
                  />
                  @if (entry.anchor) {
                    <span aria-hidden="true" class="text-muted-foreground/60">›</span>
                    <xn-highlight [text]="entry.label" [query]="searchQuery()" />
                  }
                </div>
              } @empty {
                <div class="px-2 py-1.5 text-sm text-muted-foreground">No matches.</div>
              }
            </div>
          </ng-template>
        </div>
      </dialog>
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
    { path: 'charts', label: 'Charts', exact: false },
    { path: 'motion', label: 'Motion', exact: false },
    { path: 'layout', label: 'Layout', exact: false },
  ] as const;

  protected readonly version = XN_UI_VERSION;

  protected readonly toc = signal<readonly TocEntry[]>([]);

  private readonly searchDialog = viewChild.required<ElementRef<HTMLDialogElement>>('searchDlg');
  protected readonly searchQuery = signal('');
  protected readonly searchSelection = signal<string[]>([]);
  protected readonly key = searchKey;

  protected readonly results = computed<readonly SearchEntry[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return SEARCH_INDEX;
    return SEARCH_INDEX.filter((entry) =>
      `${entry.pageLabel} ${entry.label}`.toLowerCase().includes(query),
    );
  });

  protected openSearch(): void {
    // Fresh search each time — a stale query from the last visit would
    // filter the list before the user has typed anything.
    this.searchQuery.set('');
    this.searchSelection.set([]);
    this.searchDialog().nativeElement.showModal();
  }

  protected onSearchShortcut(event: Event): void {
    // preventDefault: Ctrl/⌘K focuses the browser's own address bar.
    event.preventDefault();
    this.openSearch();
  }

  protected goTo(selection: readonly string[]): void {
    const entry = SEARCH_INDEX.find((candidate) => searchKey(candidate) === selection[0]);
    if (!entry) return;
    void this.router.navigate(
      entry.page ? ['/components', entry.page] : ['/components'],
      entry.anchor ? { fragment: entry.anchor } : {},
    );
  }

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly adjacent = computed(() => {
    const segment =
      this.url()
        .split('#')[0]
        .split('?')[0]
        .replace(/^\/components\/?/, '') || '.';
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
      if (
        found.map((entry) => entry.id).join('|') !==
        this.toc()
          .map((entry) => entry.id)
          .join('|')
      ) {
        this.toc.set(found);
      }
    });
  }
}
