import { Component, computed, linkedSignal, signal } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

import {
  Badge,
  Button,
  CAROUSEL,
  Checkbox,
  COLLAPSIBLE,
  Input,
  Popover,
  PopoverPanel,
  PopoverTrigger,
  RESIZABLE,
  ScrollArea,
  SortButton,
  type SortDirection,
  SortHeader,
  TABLE,
  XN_ACCORDION,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

type SortColumn = 'name' | 'players';

interface ServerRow {
  readonly id: number;
  readonly name: string;
  readonly region: string;
  readonly status: 'online' | 'offline' | 'updating';
  readonly players: number;
}

const SERVERS: readonly ServerRow[] = [
  { id: 1, name: 'skyblock-prod', region: 'eu-west', status: 'online', players: 42 },
  { id: 2, name: 'zomboid-main', region: 'eu-west', status: 'online', players: 12 },
  { id: 3, name: 'valheim-crew', region: 'us-east', status: 'offline', players: 0 },
  { id: 4, name: 'creative-flat', region: 'eu-west', status: 'online', players: 7 },
  { id: 5, name: 'terraria-hard', region: 'us-west', status: 'updating', players: 0 },
  { id: 6, name: 'palworld-test', region: 'us-east', status: 'offline', players: 0 },
  { id: 7, name: 'skyblock-dev', region: 'eu-west', status: 'online', players: 3 },
  { id: 8, name: 'minigames-hub', region: 'eu-north', status: 'online', players: 58 },
  { id: 9, name: 'zomboid-hcore', region: 'us-west', status: 'online', players: 9 },
  { id: 10, name: 'vanilla-smp', region: 'eu-west', status: 'updating', players: 0 },
  { id: 11, name: 'modded-create', region: 'us-east', status: 'online', players: 21 },
  { id: 12, name: 'events-arena', region: 'eu-north', status: 'offline', players: 0 },
];

@Component({
  selector: 'app-docs-disclosure',
  imports: [
    XN_ACCORDION,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    COLLAPSIBLE,
    ScrollArea,
    RESIZABLE,
    CAROUSEL,
    TABLE,
    SortHeader,
    SortButton,
    Badge,
    Button,
    Checkbox,
    Input,
    Popover,
    PopoverPanel,
    PopoverTrigger,
    ExampleBox,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Disclosure &amp; data</h1>

    <section class="mt-8" aria-labelledby="acc-h">
      <h2 id="acc-h" class="text-lg font-semibold">Accordion</h2>
      <div ngAccordionGroup xnAccordion class="mt-3 max-w-xl">
        <div xnAccordionItem>
          <h3 class="flex">
            <button ngAccordionTrigger xnAccordionTrigger [panel]="faqOne">
              Why no component stylesheets?
              <span data-chevron aria-hidden="true">⌄</span>
            </button>
          </h3>
          <div ngAccordionPanel xnAccordionPanel #faqOne="ngAccordionPanel">
            <ng-template ngAccordionContent>
              Angular injects component CSS unlayered into the head, where it beats every Tailwind
              utility — so the library emits utility class strings only.
            </ng-template>
          </div>
        </div>
        <div xnAccordionItem>
          <h3 class="flex">
            <button ngAccordionTrigger xnAccordionTrigger [panel]="faqTwo">
              Where does behavior come from?
              <span data-chevron aria-hidden="true">⌄</span>
            </button>
          </h3>
          <div ngAccordionPanel xnAccordionPanel #faqTwo="ngAccordionPanel">
            <ng-template ngAccordionContent>
              &#64;angular/aria — keyboard navigation, aria wiring and expansion state.
            </ng-template>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-8 max-w-xl">
      <app-example-box title="Accordion example" [tabs]="accordionExampleTabs" class="block">
        <div ngAccordionGroup xnAccordion class="w-full">
          <div xnAccordionItem>
            <h3 class="flex">
              <button ngAccordionTrigger xnAccordionTrigger [panel]="exFaq">
                What ships in v0.1.0?
                <span data-chevron aria-hidden="true">⌄</span>
              </button>
            </h3>
            <div ngAccordionPanel xnAccordionPanel #exFaq="ngAccordionPanel">
              <ng-template ngAccordionContent>237 components across ~80 families.</ng-template>
            </div>
          </div>
        </div>
      </app-example-box>
    </div>

    <section class="mt-10" aria-labelledby="coll-h">
      <h2 id="coll-h" class="text-lg font-semibold">Collapsible</h2>
      <details xnCollapsible class="mt-3 max-w-xl">
        <summary xnCollapsibleTrigger>
          Advanced options <span data-chevron aria-hidden="true">⌄</span>
        </summary>
        <p class="pb-2 text-sm text-muted-foreground">
          Native details/summary — the platform toggles it, the library only styles it.
        </p>
      </details>
    </section>

    <section class="mt-10" aria-labelledby="resize-h">
      <h2 id="resize-h" class="text-lg font-semibold">Resizable &amp; scroll area</h2>
      <div xnResizableGroup class="mt-3 h-32 max-w-xl overflow-hidden rounded-lg border">
        <div xnResizablePanel class="p-3 text-sm">
          Drag the handle — or focus it and use arrows.
        </div>
        <div xnResizableHandle aria-label="Resize panels"></div>
        <div xnResizablePanel>
          <div xnScrollArea class="h-full p-3" tabindex="0" aria-label="Scrollable log">
            <p class="text-sm text-muted-foreground">
              A tall scrollable region with a slim token-colored scrollbar. Line two. Line three.
              Line four. Line five. Line six. Line seven. Line eight.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="car-h">
      <h2 id="car-h" class="text-lg font-semibold">Carousel</h2>
      <div xnCarousel class="mt-3 max-w-md">
        <div xnCarouselViewport tabindex="0" aria-label="Example slides">
          <div xnCarouselItem>
            <div class="flex h-28 items-center justify-center bg-muted text-sm">Slide one</div>
          </div>
          <div xnCarouselItem>
            <div class="flex h-28 items-center justify-center bg-secondary text-sm">Slide two</div>
          </div>
          <div xnCarouselItem>
            <div class="flex h-28 items-center justify-center bg-muted text-sm">Slide three</div>
          </div>
        </div>
        <div class="mt-2 flex justify-end gap-2">
          <button
            xnCarouselPrev
            aria-label="Previous slide"
            class="cursor-pointer rounded-md border px-2 py-0.5"
          >
            ‹
          </button>
          <button
            xnCarouselNext
            aria-label="Next slide"
            class="cursor-pointer rounded-md border px-2 py-0.5"
          >
            ›
          </button>
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="table-h">
      <h2 id="table-h" class="text-lg font-semibold">Table with sortable header</h2>
      <div xnTableContainer class="mt-3 max-w-xl">
        <table xnTable>
          <caption xnTableCaption>
            Click the Name header to cycle aria-sort.
          </caption>
          <thead xnTableHeader>
            <tr xnTableRow>
              <th xnSortHeader><button xnSortButton>Name</button></th>
              <th xnTableHead scope="col">Status</th>
            </tr>
          </thead>
          <tbody xnTableBody>
            <tr xnTableRow>
              <td xnTableCell>Minecraft</td>
              <td xnTableCell>running</td>
            </tr>
            <tr xnTableRow>
              <td xnTableCell>Zomboid</td>
              <td xnTableCell>stopped</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="dt-h">
      <h2 id="dt-h" class="text-lg font-semibold">Data table</h2>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        A recipe, not a component: filtering, sorting, pagination and selection are
        <code class="font-mono text-xs">computed()</code> pipelines over the table primitives — the
        engine is signals. Reach for a headless table library only when you need grouping or
        virtualization. Selection persists across filters and pages — the count is global, and
        Clear is the way out.
      </p>
      <div class="mt-3 max-w-2xl">
        <div class="flex flex-wrap items-center gap-2 pb-3">
          <input
            xnInput
            type="search"
            class="w-56"
            placeholder="Filter by name or region"
            aria-label="Filter servers"
            [value]="dtQuery()"
            (input)="dtQuery.set($any($event.target).value)"
          />
          <button xnButton variant="outline" size="sm" [xnPopoverTriggerFor]="colPop">
            Columns
          </button>
          <ng-template #colPop="xnPopover" xnPopover>
            <div xnPopoverPanel class="grid w-44 gap-1" aria-label="Column visibility">
              <label class="flex items-center gap-2 py-0.5 text-sm">
                <input
                  type="checkbox"
                  xnCheckbox
                  [checked]="dtCols().has('region')"
                  (change)="dtToggleCol('region', $any($event.target).checked)"
                />
                Region
              </label>
              <label class="flex items-center gap-2 py-0.5 text-sm">
                <input
                  type="checkbox"
                  xnCheckbox
                  [checked]="dtCols().has('players')"
                  (change)="dtToggleCol('players', $any($event.target).checked)"
                />
                Players
              </label>
            </div>
          </ng-template>
          <span class="ml-auto text-xs text-muted-foreground" data-slot="dt-selected"
            >{{ dtSelected().size }} selected</span
          >
          @if (dtSelected().size > 0) {
            <button xnButton variant="ghost" size="sm" (click)="dtClearSelection()">Clear</button>
          }
        </div>
        <div xnTableContainer>
          <table xnTable>
            <thead xnTableHeader>
              <tr xnTableRow>
                <th xnTableHead scope="col" class="w-10">
                  <!-- indeterminate is a DOM property — the platform's own
                       tri-state, no library code needed. -->
                  <!-- Disabled on an empty page: a click would set the DOM
                       property while the false-to-false binding never
                       rewrites it — a permanently stale checkmark. -->
                  <input
                    type="checkbox"
                    xnCheckbox
                    aria-label="Select all on this page"
                    [disabled]="dtRows().length === 0"
                    [checked]="dtPageAllSelected()"
                    [indeterminate]="dtPageSomeSelected() && !dtPageAllSelected()"
                    (change)="dtTogglePage($any($event.target).checked)"
                  />
                </th>
                <th
                  xnSortHeader
                  [direction]="dtDirection('name')"
                  (directionChange)="dtSetSort('name', $event)"
                >
                  <button xnSortButton>Name</button>
                </th>
                @if (dtCols().has('region')) {
                  <th xnTableHead scope="col">Region</th>
                }
                <th xnTableHead scope="col">Status</th>
                @if (dtCols().has('players')) {
                  <th
                    xnSortHeader
                    class="text-right"
                    [direction]="dtDirection('players')"
                    (directionChange)="dtSetSort('players', $event)"
                  >
                    <button xnSortButton>Players</button>
                  </th>
                }
              </tr>
            </thead>
            <tbody xnTableBody>
              @for (row of dtRows(); track row.id) {
                <tr
                  xnTableRow
                  class="data-[state=selected]:bg-muted"
                  [attr.data-state]="dtSelected().has(row.id) ? 'selected' : null"
                >
                  <td xnTableCell>
                    <input
                      type="checkbox"
                      xnCheckbox
                      [attr.aria-label]="'Select ' + row.name"
                      [checked]="dtSelected().has(row.id)"
                      (change)="dtToggleRow(row.id, $any($event.target).checked)"
                    />
                  </td>
                  <td xnTableCell class="font-medium">{{ row.name }}</td>
                  @if (dtCols().has('region')) {
                    <td xnTableCell>{{ row.region }}</td>
                  }
                  <td xnTableCell>
                    <span
                      xnBadge
                      [variant]="
                        row.status === 'online'
                          ? 'success'
                          : row.status === 'updating'
                            ? 'info'
                            : 'secondary'
                      "
                      >{{ row.status }}</span
                    >
                  </td>
                  @if (dtCols().has('players')) {
                    <td xnTableCell class="text-right tabular-nums">{{ row.players }}</td>
                  }
                </tr>
              } @empty {
                <tr xnTableRow>
                  <td
                    xnTableCell
                    class="h-24 text-center text-muted-foreground"
                    [attr.colspan]="3 + dtCols().size"
                  >
                    No servers match "{{ dtQuery() }}".
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between pt-3">
          <span class="text-xs text-muted-foreground" data-slot="dt-page" aria-live="polite">
            Page {{ dtPage() }} of {{ dtPageCount() }} — {{ dtSorted().length }} servers
          </span>
          <!-- aria-disabled + click guard, not [disabled]: a boundary
               button that disables itself under focus drops the keyboard
               user to <body>. -->
          <div class="flex gap-2">
            <button
              xnButton
              variant="outline"
              size="sm"
              class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              [attr.aria-disabled]="dtPage() === 1"
              (click)="dtPrevPage()"
            >
              Previous
            </button>
            <button
              xnButton
              variant="outline"
              size="sm"
              class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              [attr.aria-disabled]="dtPage() >= dtPageCount()"
              (click)="dtNextPage()"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DisclosureDoc {
  // ——— Data-table engine: each stage is one computed over the previous.
  // filtered → sorted → (page-clamped) → sliced. State that must reset on
  // upstream changes is a linkedSignal; everything else derives.
  private readonly servers: readonly ServerRow[] = SERVERS;
  private readonly dtPageSize = 5;

  protected readonly dtQuery = signal('');
  protected readonly dtSort = signal<{ column: SortColumn; direction: SortDirection }>({
    column: 'name',
    direction: 'none',
  });
  protected readonly dtCols = signal<ReadonlySet<'region' | 'players'>>(
    new Set(['region', 'players'] as const),
  );
  protected readonly dtSelected = signal<ReadonlySet<number>>(new Set());

  // Shared normalization: computed memoizes on the RESULT, so a
  // whitespace-only edit changes dtQuery but not this — and therefore
  // does not reset the page.
  private readonly dtQueryNormalized = computed(() => this.dtQuery().trim().toLowerCase());

  private readonly dtFiltered = computed(() => {
    const query = this.dtQueryNormalized();
    if (!query) return this.servers;
    return this.servers.filter(
      (server) =>
        server.name.toLowerCase().includes(query) || server.region.toLowerCase().includes(query),
    );
  });

  protected readonly dtSorted = computed(() => {
    const { column, direction } = this.dtSort();
    if (direction === 'none') return this.dtFiltered();
    const sign = direction === 'ascending' ? 1 : -1;
    return [...this.dtFiltered()].sort((a, b) =>
      column === 'players' ? sign * (a.players - b.players) : sign * a.name.localeCompare(b.name),
    );
  });

  // Re-derives to 1 whenever the filter changes; the pager writes over it.
  protected readonly dtPage = linkedSignal(() => {
    this.dtQueryNormalized();
    return 1;
  });
  protected readonly dtPageCount = computed(() =>
    Math.max(1, Math.ceil(this.dtSorted().length / this.dtPageSize)),
  );
  protected readonly dtRows = computed(() =>
    this.dtSorted().slice(
      (this.dtPage() - 1) * this.dtPageSize,
      this.dtPage() * this.dtPageSize,
    ),
  );

  protected readonly dtPageAllSelected = computed(
    () => this.dtRows().length > 0 && this.dtRows().every((row) => this.dtSelected().has(row.id)),
  );
  protected readonly dtPageSomeSelected = computed(() =>
    this.dtRows().some((row) => this.dtSelected().has(row.id)),
  );

  protected dtDirection(column: SortColumn): SortDirection {
    const sort = this.dtSort();
    return sort.column === column ? sort.direction : 'none';
  }

  protected dtSetSort(column: SortColumn, direction: SortDirection): void {
    this.dtSort.set({ column, direction });
  }

  protected dtToggleRow(id: number, checked: boolean): void {
    this.dtSelected.update((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  protected dtTogglePage(checked: boolean): void {
    this.dtSelected.update((previous) => {
      const next = new Set(previous);
      for (const row of this.dtRows()) {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      }
      return next;
    });
  }

  protected dtToggleCol(column: 'region' | 'players', checked: boolean): void {
    this.dtCols.update((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(column);
      } else {
        next.delete(column);
      }
      return next;
    });
    // Hiding the sorted column would leave a phantom order no visible
    // header accounts for.
    if (!checked && this.dtSort().column === column) {
      this.dtSort.set({ column: 'name', direction: 'none' });
    }
  }

  protected dtClearSelection(): void {
    this.dtSelected.set(new Set());
  }

  // Clamped writes make page > pageCount unrepresentable, whatever
  // dispatches the click.
  protected dtPrevPage(): void {
    this.dtPage.set(Math.max(1, this.dtPage() - 1));
  }

  protected dtNextPage(): void {
    this.dtPage.set(Math.min(this.dtPageCount(), this.dtPage() + 1));
  }

  // No Plain HTML flavor: accordion is @angular/aria composition, not a
  // variants function — there is nothing to generate a portable snippet from.
  protected readonly accordionExampleTabs = [
    {
      label: 'Angular',
      code: `<div ngAccordionGroup xnAccordion>
  <div xnAccordionItem>
    <h3 class="flex">
      <button ngAccordionTrigger xnAccordionTrigger [panel]="faq">
        What ships in v0.1.0?
        <span data-chevron aria-hidden="true">⌄</span>
      </button>
    </h3>
    <div ngAccordionPanel xnAccordionPanel #faq="ngAccordionPanel">
      <ng-template ngAccordionContent>237 components across ~80 families.</ng-template>
    </div>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { XN_ACCORDION } from '@xenode/ui';

@Component({
  imports: [XN_ACCORDION, AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent],
  templateUrl: './changelog.html',
})
export class Changelog {}`,
    },
  ] as const;
}
