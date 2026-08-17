import { Component, computed, inject, signal } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';

import {
  Button,
  ComboboxPanel,
  DIALOG,
  DIALOG_DERIVATIVES,
  DialogClose,
  Input,
  ScrollArea,
  ToastService,
  Tooltip,
  XN_DROPDOWN,
  XN_HOVER_CARD,
  XN_POPOVER,
  XnListboxOption,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-overlays',
  imports: [
    Button,
    DIALOG,
    DIALOG_DERIVATIVES,
    DialogClose,
    ScrollArea,
    XN_DROPDOWN,
    Menu,
    MenuItem,
    MenuTrigger,
    MenuContent,
    XN_POPOVER,
    XN_HOVER_CARD,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
    ComboboxPanel,
    XnListboxOption,
    Input,
    Tooltip,
    ExampleBox,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Overlays</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Dialogs ride the native top layer with starting-style entrance animations; tooltips, popovers
      and hover cards animate in as their portals mount.
    </p>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button xnButton variant="outline" (click)="dlg.showModal()">Dialog</button>
      <button xnButton variant="outline" (click)="alertDlg.showModal()">Alert dialog</button>
      <button xnButton variant="outline" (click)="sheetDlg.showModal()">Sheet</button>
      <button xnButton variant="outline" (click)="topSheetDlg.showModal()">Top</button>
      <button xnButton variant="outline" (click)="drawerDlg.showModal()">Drawer</button>
      <div xnDropdown>
        <button xnButton variant="outline" ngMenuTrigger [menu]="demoMenu">Menu ▾</button>
        <div
          ngMenu
          xnMenu
          #demoMenu="ngMenu"
          aria-label="Server actions"
          (itemSelected)="onMenuSelect($event); demoMenu.close()"
        >
          <ng-template ngMenuContent>
            <div ngMenuItem xnMenuItem value="restart">Restart server</div>
            <div ngMenuItem xnMenuItem value="logs">View logs</div>
            <div ngMenuItem xnMenuItem value="delete" [disabled]="true">Delete (locked)</div>
          </ng-template>
        </div>
      </div>
      <button xnButton variant="outline" (click)="commandDlg.showModal()">Command ⌘K</button>
      <button xnButton variant="outline" [xnPopoverTriggerFor]="pop">Popover</button>
      <ng-template #pop="xnPopover" xnPopover>
        <div xnPopoverPanel>
          <p class="font-medium">Popover</p>
          <p class="mt-1 text-muted-foreground">Anchored, closes on outside click or Escape.</p>
        </div>
      </ng-template>
      <a
        href="https://github.com"
        class="text-sm font-medium underline underline-offset-4"
        [xnHoverCardTriggerFor]="card"
        >&#64;danleco</a
      >
      <ng-template #card="xnHoverCard" xnHoverCard>
        <div xnHoverCardPanel>
          <p class="font-medium">Dan Leco</p>
          <p class="mt-1 text-muted-foreground">Building xenode-ui in public.</p>
        </div>
      </ng-template>
    </div>

    <section class="mt-10" aria-labelledby="dropdown-example-h">
      <h2 id="dropdown-example-h" class="text-lg font-semibold">Dropdown menu example</h2>
      <app-example-box
        title="Dropdown menu example"
        [tabs]="dropdownTabs"
        class="mt-3 block max-w-2xl"
      >
        <div xnDropdown>
          <button xnButton variant="outline" ngMenuTrigger [menu]="exampleMenu">Menu ▾</button>
          <div
            ngMenu
            xnMenu
            #exampleMenu="ngMenu"
            aria-label="Server actions"
            (itemSelected)="onMenuSelect($event); exampleMenu.close()"
          >
            <ng-template ngMenuContent>
              <div ngMenuItem xnMenuItem value="restart">Restart server</div>
              <div ngMenuItem xnMenuItem value="logs">View logs</div>
              <div ngMenuItem xnMenuItem value="delete" [disabled]="true">Delete (locked)</div>
            </ng-template>
          </div>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="tooltip-h">
      <h2 id="tooltip-h" class="text-lg font-semibold">Tooltip</h2>
      <app-example-box title="Tooltip example" [tabs]="tooltipTabs" class="mt-3 block max-w-2xl">
        <button xnButton variant="outline" [xnTooltip]="'Instant — the default'">No delay</button>
        <button xnButton variant="outline" [xnTooltip]="'Waits before showing'" [showDelay]="400">
          400ms delay
        </button>
      </app-example-box>
    </section>

    <dialog xnDialog #commandDlg aria-label="Command palette" class="max-w-md p-2">
      <div class="grid gap-1">
        <input
          xnInput
          ngCombobox
          #cmd="ngCombobox"
          [(value)]="commandQuery"
          placeholder="Type a command…"
          aria-label="Search commands"
          class="border-0 focus-visible:outline-0"
        />
        <ng-template ngComboboxPopup [combobox]="cmd">
          <div
            xnComboboxPanel
            ngComboboxWidget
            ngListbox
            #clb="ngListbox"
            focusMode="activedescendant"
            selectionMode="explicit"
            [(value)]="commandSelection"
            (valueChange)="runCommand($event); commandDlg.close()"
            [activeDescendant]="clb.activeDescendant()"
            aria-label="Commands"
            class="static mt-0 w-full border-0 shadow-none"
          >
            @for (command of filteredCommands(); track command) {
              <div xnListboxOption ngOption [value]="command">{{ command }}</div>
            } @empty {
              <div class="px-2 py-1.5 text-sm text-muted-foreground">No commands.</div>
            }
          </div>
        </ng-template>
      </div>
    </dialog>

    <dialog xnDialog #dlg aria-labelledby="dlg-t">
      <button xnDialogClose aria-label="Close dialog" (click)="dlg.close()">✕</button>
      <div xnDialogHeader>
        <h2 xnDialogTitle id="dlg-t">Native dialog</h2>
        <p xnDialogDescription>
          showModal() traps focus, Esc closes, the backdrop fades — platform behavior plus
          starting-style animation.
        </p>
      </div>
      <div xnDialogFooter>
        <button xnButton variant="outline" (click)="dlg.close()">Close</button>
        <button xnButton (click)="dlg.close()">Confirm</button>
      </div>
    </dialog>

    <dialog xnAlertDialog #alertDlg aria-labelledby="ad-t">
      <div xnDialogHeader>
        <h2 xnDialogTitle id="ad-t">Stop the server?</h2>
        <p xnDialogDescription>Players will be disconnected. The world is saved first.</p>
      </div>
      <div xnDialogFooter>
        <button xnButton variant="outline" (click)="alertDlg.close()">Cancel</button>
        <button xnButton variant="destructive" (click)="alertDlg.close()">Stop server</button>
      </div>
    </dialog>

    <dialog xnSheet #sheetDlg aria-labelledby="sheet-t">
      <div xnDialogHeader>
        <h2 xnDialogTitle id="sheet-t">Side sheet</h2>
        <p xnDialogDescription>Slides in from the edge it is pinned to.</p>
      </div>
      <div xnScrollArea class="max-h-64 flex-1" tabindex="0" aria-label="Sheet content">
        <p class="text-sm text-muted-foreground">Scrollable content lives here.</p>
      </div>
      <div xnDialogFooter>
        <button xnButton variant="outline" (click)="sheetDlg.close()">Close</button>
      </div>
    </dialog>

    <dialog xnSheet side="top" #topSheetDlg aria-labelledby="top-sheet-t">
      <div xnDialogHeader>
        <h2 xnDialogTitle id="top-sheet-t">Top sheet</h2>
        <p xnDialogDescription>Same sheet, dropping from the top edge instead.</p>
      </div>
      <div xnDialogFooter>
        <button xnButton variant="outline" (click)="topSheetDlg.close()">Close</button>
      </div>
    </dialog>

    <dialog xnDrawer #drawerDlg aria-labelledby="drawer-t">
      <div xnDialogHeader>
        <h2 xnDialogTitle id="drawer-t">Bottom drawer</h2>
        <p xnDialogDescription>Same platform, different margins, upward slide.</p>
      </div>
      <div xnDialogFooter>
        <button xnButton variant="outline" (click)="drawerDlg.close()">Close</button>
      </div>
    </dialog>
  `,
})
export class OverlaysDoc {
  private readonly toastService = inject(ToastService);

  private readonly commands = ['Restart server', 'View logs', 'Toggle theme', 'Deploy portfolio'];

  protected readonly dropdownTabs = [
    {
      label: 'Angular',
      code: `<div xnDropdown>
  <button xnButton variant="outline" ngMenuTrigger [menu]="exampleMenu">Menu ▾</button>
  <div
    ngMenu
    xnMenu
    #exampleMenu="ngMenu"
    aria-label="Server actions"
    (itemSelected)="onMenuSelect($event); exampleMenu.close()"
  >
    <ng-template ngMenuContent>
      <div ngMenuItem xnMenuItem value="restart">Restart server</div>
      <div ngMenuItem xnMenuItem value="logs">View logs</div>
      <div ngMenuItem xnMenuItem value="delete" [disabled]="true">Delete (locked)</div>
    </ng-template>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { XN_DROPDOWN } from '@xenode/ui';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';

@Component({
  imports: [XN_DROPDOWN, Menu, MenuContent, MenuItem, MenuTrigger],
  templateUrl: './server-menu.html',
})
export class ServerMenu {
  onMenuSelect(action: string): void {
    // restart, logs, delete…
  }
}`,
    },
  ] as const;

  protected readonly tooltipTabs = [
    {
      label: 'Angular',
      code: `<button xnButton variant="outline" [xnTooltip]="'Waits before showing'" [showDelay]="400">
  400ms delay
</button>`,
    },
    {
      label: 'TypeScript',
      code: `import { Tooltip } from '@xenode/ui';

@Component({
  imports: [Tooltip],
  templateUrl: './toolbar.html',
})
export class Toolbar {}`,
    },
  ] as const;

  protected readonly commandQuery = signal('');
  protected readonly commandSelection = signal<string[]>([]);
  protected readonly filteredCommands = computed(() => {
    const query = this.commandQuery().trim().toLowerCase();
    return query ? this.commands.filter((c) => c.toLowerCase().includes(query)) : this.commands;
  });

  protected onMenuSelect(action: string): void {
    this.toastService.show(`Menu action: ${action}`, { title: 'Selected' });
  }

  protected runCommand(selection: string[]): void {
    if (selection[0]) {
      this.toastService.show(selection[0], { title: 'Command', variant: 'success' });
    }
  }
}
