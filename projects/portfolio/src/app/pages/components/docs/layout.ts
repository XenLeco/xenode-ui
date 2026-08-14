import { Component } from '@angular/core';

import { Badge, Button, CAROUSEL, LAYOUT, SIDEBAR, SITE, STAT } from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-layout',
  imports: [LAYOUT, SITE, SIDEBAR, CAROUSEL, STAT, Button, Badge, ExampleBox],
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
  `,
})
export class LayoutDoc {
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
