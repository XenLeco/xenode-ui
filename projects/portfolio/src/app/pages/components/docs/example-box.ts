import { Component, input, linkedSignal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

import { CodeBlock, CopyButton, XN_TABS } from '@xenode/ui';

export interface ExampleTab {
  /** Tab label — typically 'Angular', 'TypeScript' or 'Plain HTML'. */
  readonly label: string;
  readonly code: string;
}

/**
 * The docs example pattern: live preview in a box, code below it in
 * multiple flavors behind our own aria tabs, each one copy away. The
 * Plain HTML flavor is the framework-portable version — the system is
 * utility classes + tokens, which work anywhere Tailwind and theme.css do.
 */
@Component({
  selector: 'app-example-box',
  imports: [XN_TABS, Tabs, TabList, Tab, TabPanel, TabContent, CodeBlock, CopyButton],
  template: `
    <section class="overflow-hidden rounded-lg border" [attr.aria-label]="title()">
      <div
        data-slot="example-preview"
        class="flex min-h-36 flex-wrap items-center justify-center gap-3 border-b bg-background p-6"
      >
        <ng-content />
      </div>
      <div ngTabs xnTabs data-slot="example-code" class="gap-0 bg-card p-2">
        <ul ngTabList xnTabList [(selectedTab)]="selected" class="bg-transparent">
          @for (tab of tabs(); track tab.label) {
            <li ngTab xnTab [value]="tab.label">{{ tab.label }}</li>
          }
        </ul>
        @for (tab of tabs(); track tab.label) {
          <div ngTabPanel xnTabPanel [value]="tab.label" class="relative pb-0">
            <ng-template ngTabContent>
              <pre
                xnCodeBlock
                class="mt-2 rounded-md border-0"
                [attr.aria-label]="title() + ' — ' + tab.label"
              ><code>{{ tab.code }}</code></pre>
              <button
                [xnCopyButton]="tab.code"
                class="absolute top-4 right-2"
                [attr.aria-label]="'Copy ' + tab.label + ' code for ' + title()"
              >
                Copy
              </button>
            </ng-template>
          </div>
        }
      </div>
    </section>
  `,
})
export class ExampleBox {
  readonly title = input.required<string>();
  readonly tabs = input.required<readonly ExampleTab[]>();

  // linkedSignal: derived default (first tab) that the tab list's own
  // selection writes over — and it re-derives if the tabs input changes.
  protected readonly selected = linkedSignal<string | undefined>(() => this.tabs()[0]?.label);
}
