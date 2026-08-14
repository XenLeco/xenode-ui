import { Component } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

import {
  CAROUSEL,
  COLLAPSIBLE,
  RESIZABLE,
  ScrollArea,
  SortHeader,
  TABLE,
  XN_ACCORDION,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

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
              <th xnSortHeader>Name</th>
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
  `,
})
export class DisclosureDoc {
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
