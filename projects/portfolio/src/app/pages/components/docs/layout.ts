import { Component, signal } from '@angular/core';

import {
  Affix,
  Badge,
  Button,
  CAROUSEL,
  DOCK,
  Input,
  Join,
  LAYOUT,
  MockupPhone,
  NativeSelect,
  SIDEBAR,
  SITE,
  SPEED_DIAL,
  STAT,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-layout',
  imports: [
    LAYOUT,
    SITE,
    SIDEBAR,
    CAROUSEL,
    STAT,
    Button,
    Badge,
    ExampleBox,
    Join,
    Input,
    NativeSelect,
    DOCK,
    MockupPhone,
    Affix,
    SPEED_DIAL,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Layout</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      The page scaffold — container, page layout, sticky header, body, sections — composed with
      navbar, hero, carousel, sidebar and footer into one full page. Everything below is one
      component tree.
    </p>

    <div class="mt-6 overflow-hidden rounded-lg border" data-slot="layout-demo">
      <div xnPageLayout class="min-h-0">
        <header xnPageHeader class="static">
          <div xnContainer class="flex items-center justify-between py-3">
            <nav xnNavbarNav aria-label="Demo main">
              <span xnNavbarBrand>xenode</span>
              <a xnNavbarLink href="/components/layout" aria-current="page">Home</a>
              <a xnNavbarLink href="/components/layout">Servers</a>
              <a xnNavbarLink href="/components/layout">Docs</a>
            </nav>
            <button xnButton size="sm" variant="outline">Sign in</button>
          </div>
        </header>

        <main xnPageMain>
          <section xnPageSection class="border-b">
            <div xnContainer>
              <section xnHero class="items-center py-6 text-center">
                <span xnBadge variant="info">v0.1.0</span>
                <h2 xnHeroTitle class="text-3xl">Run game servers like a grown-up</h2>
                <p xnHeroSubtitle class="mx-auto">
                  Dark-first, token-driven, accessible by default.
                </p>
                <div xnHeroActions class="justify-center">
                  <button xnButton>Get started</button>
                  <button xnButton variant="outline">GitHub</button>
                </div>
              </section>
            </div>
          </section>

          <section xnPageSection class="border-b">
            <div xnContainer>
              <div xnCarousel>
                <div xnCarouselViewport tabindex="0" aria-label="Screenshots">
                  <div xnCarouselItem>
                    <div class="flex h-28 items-center justify-center bg-muted text-sm">
                      Console screenshot
                    </div>
                  </div>
                  <div xnCarouselItem>
                    <div class="flex h-28 items-center justify-center bg-secondary text-sm">
                      Templates screenshot
                    </div>
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
            </div>
          </section>

          <section xnPageSection class="border-b py-0">
            <div xnSidebarLayout class="min-h-56">
              <aside xnSidebar #layoutSb="xnSidebar" class="border-r">
                <div xnSidebarContent>
                  <div xnSidebarGroup>
                    <span xnSidebarGroupLabel>Servers</span>
                    <ul xnSidebarMenu>
                      <li xnSidebarMenuItem>
                        <a xnSidebarMenuButton href="/components/layout" aria-current="page"
                          >Minecraft</a
                        >
                      </li>
                      <li xnSidebarMenuItem>
                        <a xnSidebarMenuButton href="/components/layout">Zomboid</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>
              <div class="flex-1 p-4">
                <button
                  [xnSidebarTriggerFor]="layoutSb"
                  aria-label="Toggle sidebar"
                  class="cursor-pointer rounded-md border px-2 py-1 text-sm"
                >
                  ☰
                </button>
                <div xnStatGroup class="mt-4">
                  <div xnStat>
                    <span xnStatLabel>Players</span><span xnStatValue>7</span>
                    <span xnStatDelta trend="up">+3 tonight</span>
                  </div>
                  <div xnStat>
                    <span xnStatLabel>Uptime</span><span xnStatValue>21d</span>
                    <span xnStatDelta trend="flat">steady</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer xnFooter class="px-0 py-0">
          <div xnContainer class="flex items-center justify-between py-6">
            <nav xnFooterNav aria-label="Demo footer">
              <a href="/components/layout" class="hover:text-foreground">Docs</a>
              <a href="/components/layout" class="hover:text-foreground">Status</a>
            </nav>
            <span xnFooterCopyright>© 2026 Dan Leco</span>
          </div>
        </footer>
      </div>
    </div>

    <section class="mt-10" aria-labelledby="scaffold-h">
      <h2 id="scaffold-h" class="text-lg font-semibold">Page scaffold</h2>
      <app-example-box title="Page scaffold" [tabs]="scaffoldTabs" class="mt-3 block max-w-xl">
        <div xnPageLayout class="min-h-40 w-full overflow-hidden rounded-md border">
          <header xnPageHeader class="static">
            <div xnContainer size="sm" class="flex items-center justify-between py-2 text-sm">
              <span class="font-semibold">xenode</span>
              <button xnButton size="sm" variant="outline">Sign in</button>
            </div>
          </header>
          <main xnPageMain>
            <div xnContainer size="sm" class="py-4 text-sm text-muted-foreground">Page content</div>
          </main>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="join-h">
      <h2 id="join-h" class="text-lg font-semibold">Join</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        Squares inner corners and collapses shared borders on whatever sits inside — buttons,
        inputs, selects, or a mix. Purely visual: each child keeps its own semantics.
      </p>
      <app-example-box title="Join example" [tabs]="joinTabs" class="mt-3 block max-w-xl">
        <div class="flex flex-col gap-4">
          <div xnJoin>
            <button xnButton variant="outline">Day</button>
            <button xnButton variant="outline">Week</button>
            <button xnButton variant="outline">Month</button>
          </div>
          <div xnJoin>
            <select xnNativeSelect class="w-28">
              <option>https://</option>
              <option>http://</option>
            </select>
            <input xnInput placeholder="example.com" aria-label="Domain" class="w-40" />
            <button xnButton>Go</button>
          </div>
          <div xnJoin direction="vertical" class="w-28">
            <button xnButton variant="outline">Top</button>
            <button xnButton variant="outline">Middle</button>
            <button xnButton variant="outline">Bottom</button>
          </div>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="dock-h">
      <h2 id="dock-h" class="text-lg font-semibold">Dock &amp; phone mockup</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        A bottom navigation bar for compact layouts, shown here
        <code class="font-mono text-xs">static</code> inside the phone mockup below — real usage
        binds it <code class="font-mono text-xs">fixed</code> to the viewport instead.
      </p>
      <app-example-box title="Dock example" [tabs]="dockTabs" class="mt-3 block max-w-xs">
        <div xnMockupPhone class="w-56">
          <div class="flex h-full flex-col">
            <div class="flex flex-1 items-center justify-center text-xs text-muted-foreground">
              Screen
            </div>
            <nav xnDock class="static pb-2">
              <a xnDockItem href="/components/layout" aria-current="page">
                <span aria-hidden="true">⌂</span>
                Home
              </a>
              <a xnDockItem href="/components/layout">
                <span aria-hidden="true">☰</span>
                Servers
              </a>
              <a xnDockItem href="/components/layout">
                <span aria-hidden="true">⚙</span>
                Settings
              </a>
            </nav>
          </div>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="burger-h">
      <h2 id="burger-h" class="text-lg font-semibold">Burger</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        Three lines from one button, no child spans: the middle line is the button's own
        background clipped to a thin content box, the outer two are pseudo-elements that rotate
        into an X when <code class="font-mono text-xs">aria-expanded</code> flips.
      </p>
      <app-example-box title="Burger example" [tabs]="burgerTabs" class="mt-3 block max-w-xs">
        <button
          type="button"
          xnBurger
          aria-label="Toggle menu"
          [attr.aria-expanded]="burgerOpen()"
          (click)="burgerOpen.set(!burgerOpen())"
        ></button>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="affix-h">
      <h2 id="affix-h" class="text-lg font-semibold">Affix</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        Pins content to a corner. The demo below uses
        <code class="font-mono text-xs">position="absolute"</code> inside a bounded box — the
        default is <code class="font-mono text-xs">fixed</code> to the viewport.
      </p>
      <app-example-box title="Affix example" [tabs]="affixTabs" class="mt-3 block max-w-xl">
        <div class="relative h-40 w-full overflow-hidden rounded-md border bg-muted/30">
          <div
            xnAffix
            position="absolute"
            corner="top-left"
            class="rounded-md border bg-card px-3 py-1.5 text-xs shadow-md"
          >
            top-left
          </div>
          <div
            xnAffix
            position="absolute"
            corner="bottom-right"
            class="rounded-md border bg-card px-3 py-1.5 text-xs shadow-md"
          >
            bottom-right
          </div>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="speed-dial-h">
      <h2 id="speed-dial-h" class="text-lg font-semibold">Speed dial</h2>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        A trigger that discloses stacked actions above it — Escape and an outside click both
        close it, the same host-listener contract as the nav panels.
      </p>
      <app-example-box title="Speed dial example" [tabs]="speedDialTabs" class="mt-3 block max-w-xs">
        <div class="relative flex h-40 w-full items-end justify-center">
          <div xnSpeedDial>
            <button xnSpeedDialTrigger aria-label="Create">+</button>
            <div xnSpeedDialActions>
              <button xnSpeedDialAction aria-label="New file">📄</button>
              <button xnSpeedDialAction aria-label="New folder">📁</button>
              <button xnSpeedDialAction aria-label="Upload">⬆</button>
            </div>
          </div>
        </div>
      </app-example-box>
    </section>
  `,
})
export class LayoutDoc {
  protected readonly burgerOpen = signal(false);

  protected readonly joinTabs = [
    {
      label: 'Angular',
      code: `<div xnJoin>
  <button xnButton variant="outline">Day</button>
  <button xnButton variant="outline">Week</button>
  <button xnButton variant="outline">Month</button>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { Join, Button } from '@xenode/ui';

@Component({
  imports: [Join, Button],
  templateUrl: './toolbar.html',
})
export class Toolbar {}`,
    },
  ] as const;

  protected readonly dockTabs = [
    {
      label: 'Angular',
      code: `<nav xnDock>
  <a xnDockItem href="/" aria-current="page">
    <span aria-hidden="true">⌂</span>
    Home
  </a>
  <a xnDockItem href="/servers">
    <span aria-hidden="true">☰</span>
    Servers
  </a>
</nav>`,
    },
    {
      label: 'TypeScript',
      code: `import { DOCK } from '@xenode/ui';

@Component({
  imports: [DOCK],
  templateUrl: './shell.html',
})
export class Shell {}`,
    },
  ] as const;

  protected readonly burgerTabs = [
    {
      label: 'Angular',
      code: `<button
  type="button"
  xnBurger
  aria-label="Toggle menu"
  [attr.aria-expanded]="open()"
  (click)="open.set(!open())"
></button>`,
    },
    {
      label: 'TypeScript',
      code: `import { Burger } from '@xenode/ui';

@Component({
  imports: [Burger],
  templateUrl: './nav-toggle.html',
})
export class NavToggle {
  protected readonly open = signal(false);
}`,
    },
  ] as const;

  protected readonly affixTabs = [
    {
      label: 'Angular',
      code: `<div class="relative h-40 w-full">
  <div xnAffix corner="bottom-right" position="absolute">Pinned</div>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { Affix } from '@xenode/ui';

@Component({
  imports: [Affix],
  templateUrl: './panel.html',
})
export class Panel {}`,
    },
  ] as const;

  protected readonly speedDialTabs = [
    {
      label: 'Angular',
      code: `<div xnSpeedDial>
  <button xnSpeedDialTrigger aria-label="Create">+</button>
  <div xnSpeedDialActions>
    <button xnSpeedDialAction aria-label="New file">📄</button>
    <button xnSpeedDialAction aria-label="Upload">⬆</button>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { SPEED_DIAL } from '@xenode/ui';

@Component({
  imports: [SPEED_DIAL],
  templateUrl: './create-menu.html',
})
export class CreateMenu {}`,
    },
  ] as const;

  protected readonly scaffoldTabs = [
    {
      label: 'Angular',
      code: `<div xnPageLayout class="min-h-40 w-full overflow-hidden rounded-md border">
  <header xnPageHeader class="static">
    <div xnContainer size="sm" class="flex items-center justify-between py-2 text-sm">
      <span class="font-semibold">xenode</span>
      <button xnButton size="sm" variant="outline">Sign in</button>
    </div>
  </header>
  <main xnPageMain>
    <div xnContainer size="sm" class="py-4 text-sm text-muted-foreground">
      Page content
    </div>
  </main>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { LAYOUT } from '@xenode/ui';

@Component({
  imports: [LAYOUT],
  templateUrl: './scaffold.html',
})
export class Scaffold {}`,
    },
  ] as const;
}
