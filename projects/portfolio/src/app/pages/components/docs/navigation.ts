import { Component, signal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

import {
  BREADCRUMB,
  NAV_MENU,
  NAV_PANELS,
  PAGINATION,
  SIDEBAR,
  Surface,
  XN_TABS,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-navigation',
  imports: [
    XN_TABS,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    BREADCRUMB,
    PAGINATION,
    NAV_MENU,
    NAV_PANELS,
    Surface,
    SIDEBAR,
    ExampleBox,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Navigation</h1>

    <section class="mt-8" aria-labelledby="tabs-h">
      <h2 id="tabs-h" class="text-lg font-semibold">Tabs</h2>
      <div ngTabs xnTabs class="mt-3">
        <ul ngTabList xnTabList [(selectedTab)]="selectedTab">
          <li ngTab xnTab value="overview">Overview</li>
          <li ngTab xnTab value="styling">Styling</li>
          <li ngTab xnTab value="locked" disabled>Locked</li>
        </ul>
        <div ngTabPanel xnTabPanel value="overview">
          <ng-template ngTabContent>
            <p class="max-w-prose text-muted-foreground">
              Behavior comes from &#64;angular/aria; the library ships only the styling beside it.
            </p>
          </ng-template>
        </div>
        <div ngTabPanel xnTabPanel value="styling">
          <ng-template ngTabContent>
            <p class="max-w-prose text-muted-foreground">
              Selected-state styling reads aria-selected, so visual and accessible state cannot
              disagree.
            </p>
          </ng-template>
        </div>
        <div ngTabPanel xnTabPanel value="locked">
          <ng-template ngTabContent><p>Never rendered — the tab is disabled.</p></ng-template>
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="crumb-h">
      <h2 id="crumb-h" class="text-lg font-semibold">Breadcrumb &amp; pagination</h2>
      <nav xnBreadcrumb class="mt-3">
        <ol xnBreadcrumbList>
          <li xnBreadcrumbItem><a xnBreadcrumbLink href="/">Home</a></li>
          <li xnBreadcrumbSeparator>/</li>
          <li xnBreadcrumbItem><a xnBreadcrumbLink href="/components">Components</a></li>
          <li xnBreadcrumbSeparator>/</li>
          <li xnBreadcrumbItem><span xnBreadcrumbPage>Navigation</span></li>
        </ol>
      </nav>
      <nav xnPagination class="mt-4 justify-start">
        <ul xnPaginationList>
          <li><a xnPaginationLink href="/components/navigation">‹</a></li>
          <li><a xnPaginationLink href="/components/navigation" aria-current="page">1</a></li>
          <li><a xnPaginationLink href="/components/navigation">2</a></li>
          <li><a xnPaginationLink href="/components/navigation">›</a></li>
        </ul>
      </nav>

      <app-example-box
        title="Breadcrumb example"
        [tabs]="breadcrumbTabs"
        class="mt-4 block max-w-2xl"
      >
        <nav xnBreadcrumb>
          <ol xnBreadcrumbList>
            <li xnBreadcrumbItem><a xnBreadcrumbLink href="/">Home</a></li>
            <li xnBreadcrumbSeparator>/</li>
            <li xnBreadcrumbItem><a xnBreadcrumbLink href="/components">Components</a></li>
            <li xnBreadcrumbSeparator>/</li>
            <li xnBreadcrumbItem><span xnBreadcrumbPage>Navigation</span></li>
          </ol>
        </nav>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="navmenu-h">
      <h2 id="navmenu-h" class="text-lg font-semibold">Nav menu</h2>
      <nav xnNavMenu aria-label="Example site" class="mt-3">
        <ul xnNavMenuList>
          <li xnNavMenuItem>
            <a xnNavMenuLink href="/components/navigation" aria-current="page">Dashboard</a>
          </li>
          <li xnNavMenuItem><a xnNavMenuLink href="/components/navigation">Servers</a></li>
          <li xnNavMenuItem><a xnNavMenuLink href="/components/navigation">Settings</a></li>
        </ul>
      </nav>
    </section>

    <section class="mt-10" aria-labelledby="navpanels-h">
      <h2 id="navpanels-h" class="text-lg font-semibold">Navigation menu with panels</h2>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        The APG disclosure-navigation pattern — buttons with
        <code class="font-mono text-xs">aria-expanded</code> over panels of plain links, never
        <code class="font-mono text-xs">role="menu"</code>. One panel at a time; outside click,
        Escape and tabbing away close it.
      </p>
      <!-- min-height so the absolute panel has room inside the docs page -->
      <div class="mt-3 min-h-72">
        <nav xnNavPanels aria-label="Product example">
          <ul xnNavMenuList>
            <li xnNavMenuItem>
              <button [xnNavPanelTrigger]="'np-products'">Products</button>
            </li>
            <li xnNavMenuItem>
              <button [xnNavPanelTrigger]="'np-resources'">Resources</button>
            </li>
            <li xnNavMenuItem>
              <a xnNavMenuLink href="/components/navigation">Pricing</a>
            </li>
          </ul>
          <div [xnNavPanel]="'np-products'" class="grid w-[36rem] max-w-[85vw] grid-cols-2 gap-2">
            <a
              xnSurface
              variant="gradient"
              href="/components/blocks"
              class="row-span-3 flex flex-col justify-end p-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gradient-foreground"
            >
              <span class="text-base font-semibold">xenode panel</span>
              <span class="mt-1 text-gradient-foreground/75">
                Game servers, bots and tunnels behind one dashboard.
              </span>
            </a>
            <a xnNavPanelLink href="/components/buttons">
              <span data-slot="nav-panel-link-title">Components</span>
              <span data-slot="nav-panel-link-desc">239 primitives, contrast-locked tokens.</span>
            </a>
            <a xnNavPanelLink href="/components/blocks">
              <span data-slot="nav-panel-link-title">Blocks</span>
              <span data-slot="nav-panel-link-desc">Whole sections, copy the markup.</span>
            </a>
            <a xnNavPanelLink href="/components/motion">
              <span data-slot="nav-panel-link-title">Motion</span>
              <span data-slot="nav-panel-link-desc">Entrance presets and easing vocabulary.</span>
            </a>
          </div>
          <div [xnNavPanel]="'np-resources'" class="grid w-64 gap-1">
            <a xnNavPanelLink href="/components">
              <span data-slot="nav-panel-link-title">Docs</span>
              <span data-slot="nav-panel-link-desc">Every family, live and copyable.</span>
            </a>
            <a xnNavPanelLink href="/components/typography">
              <span data-slot="nav-panel-link-title">Typography</span>
              <span data-slot="nav-panel-link-desc">Prose rhythm in three variables.</span>
            </a>
          </div>
        </nav>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="sidebar-h">
      <h2 id="sidebar-h" class="text-lg font-semibold">Sidebar</h2>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        The trigger takes its sidebar by reference, so it can live anywhere — collapse animates on
        width.
      </p>
      <div class="mt-3 overflow-hidden rounded-lg border">
        <div xnSidebarLayout class="min-h-64">
          <aside xnSidebar #demoSidebar="xnSidebar">
            <div xnSidebarHeader>xenode</div>
            <div xnSidebarContent>
              <div xnSidebarGroup>
                <span xnSidebarGroupLabel>Servers</span>
                <ul xnSidebarMenu>
                  <li xnSidebarMenuItem>
                    <a xnSidebarMenuButton href="/components/navigation" aria-current="page"
                      >Minecraft</a
                    >
                  </li>
                  <li xnSidebarMenuItem>
                    <a xnSidebarMenuButton href="/components/navigation">Zomboid</a>
                  </li>
                </ul>
              </div>
            </div>
            <div xnSidebarFooter>v0.0.1</div>
          </aside>
          <div class="flex-1 p-4">
            <button
              [xnSidebarTriggerFor]="demoSidebar"
              aria-label="Toggle sidebar"
              class="cursor-pointer rounded-md border px-2 py-1 text-sm"
            >
              ☰ toggle
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NavigationDoc {
  protected readonly selectedTab = signal<string | undefined>('overview');

  protected readonly breadcrumbTabs = [
    {
      label: 'Angular',
      code: `<nav xnBreadcrumb>
  <ol xnBreadcrumbList>
    <li xnBreadcrumbItem><a xnBreadcrumbLink href="/">Home</a></li>
    <li xnBreadcrumbSeparator>/</li>
    <li xnBreadcrumbItem><a xnBreadcrumbLink href="/components">Components</a></li>
    <li xnBreadcrumbSeparator>/</li>
    <li xnBreadcrumbItem><span xnBreadcrumbPage>Navigation</span></li>
  </ol>
</nav>`,
    },
    {
      label: 'TypeScript',
      code: `import { BREADCRUMB } from '@xenode/ui';

@Component({
  imports: [BREADCRUMB],
  templateUrl: './breadcrumb.html',
})
export class BreadcrumbExample {}`,
    },
  ] as const;
}
