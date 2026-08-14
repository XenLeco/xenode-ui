import { Component } from '@angular/core';

import { Kbd, Prose, SITE, TEXT_BLOCKS } from '@xenode/ui';

import { ExampleBox } from './example-box';

@Component({
  selector: 'app-docs-typography',
  imports: [Prose, TEXT_BLOCKS, SITE, Kbd, ExampleBox],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Typography &amp; page shells</h1>

    <section class="mt-8" aria-labelledby="prose-h">
      <h2 id="prose-h" class="text-lg font-semibold">Prose</h2>
      <article xnProse class="mt-3">
        <h2>One wrapper, plain HTML</h2>
        <p>
          <code>xnProse</code> styles semantic markup — headings, lists, quotes and
          <a href="/components">links</a> — with no per-element classes.
        </p>
        <blockquote>Build it, then verify it against the real thing.</blockquote>
        <ul>
          <li>Zero component stylesheets</li>
          <li>Tokens all the way down</li>
        </ul>
      </article>

      <h3 class="mt-8 text-sm font-medium text-muted-foreground">
        Rhythm — three controls, everything derives
      </h3>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        <code class="font-mono text-xs">--prose-size</code>,
        <code class="font-mono text-xs">--prose-leading</code> and
        <code class="font-mono text-xs">--prose-flow</code> set the base; heading sizes, list
        indents and block gaps follow. Override per context with a class.
      </p>
      <div class="mt-3 grid gap-6 sm:grid-cols-2">
        <article xnProse class="rounded-lg border p-4">
          <h3>Default rhythm</h3>
          <p>Compact reading text for docs and cards.</p>
          <ul>
            <li>0.875rem base</li>
            <li>1.25em flow</li>
          </ul>
        </article>
        <article xnProse class="rounded-lg border p-4 [--prose-flow:1.75em] [--prose-size:1.05rem]">
          <h3>Article rhythm</h3>
          <p>Larger type, airier flow — one class each.</p>
          <ul>
            <li>1.05rem base</li>
            <li>1.75em flow</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="code-h">
      <h2 id="code-h" class="text-lg font-semibold">Code &amp; figure</h2>
      <figure xnFigure class="mt-3 max-w-xl">
        <pre xnCodeBlock aria-label="Install command"><code>npm i clsx tailwind-merge</code></pre>
        <figcaption xnFigCaption>The entire styling stack behind cn().</figcaption>
      </figure>
      <p class="mt-3 text-sm">
        Inline code like <code xnInlineCode>cn()</code> and links via
        <a xnLink href="/components">xnLink</a>.
      </p>

      <app-example-box
        title="Text primitives example"
        [tabs]="textTabs"
        class="mt-4 block max-w-2xl"
      >
        <p class="text-sm">
          Press <kbd xnKbd>Ctrl</kbd> + <kbd xnKbd>K</kbd> for the command palette, or read the
          <a xnLink href="/components">docs</a> and copy <code xnInlineCode>cn()</code> from the
          source.
        </p>
      </app-example-box>
    </section>

    <section class="mt-10" aria-labelledby="shell-h">
      <h2 id="shell-h" class="text-lg font-semibold">Hero, section header &amp; footer</h2>
      <div class="mt-3 overflow-hidden rounded-lg border">
        <section xnHero class="items-center px-6 py-10 text-center">
          <h3 xnHeroTitle class="text-2xl">Ship a design system</h3>
          <p xnHeroSubtitle class="mx-auto">Dark-first, token-driven, accessible by default.</p>
          <div xnHeroActions class="justify-center">
            <a xnLink href="/components">Browse components</a>
          </div>
        </section>
        <div class="border-t p-6">
          <div xnSectionHeader>
            <h3 xnSectionTitle>Section header</h3>
            <p xnSectionDescription>Title plus description, consistently spaced.</p>
          </div>
        </div>
        <footer xnFooter class="px-6">
          <nav xnFooterNav aria-label="Footer">
            <a xnLink href="/components" class="no-underline hover:underline">Docs</a>
            <a xnLink href="/" class="no-underline hover:underline">Home</a>
          </nav>
          <span xnFooterCopyright>© 2026 Dan Leco</span>
        </footer>
      </div>
    </section>
  `,
})
export class TypographyDoc {
  protected readonly textTabs = [
    {
      label: 'Angular',
      code: `<p class="text-sm">
  Press <kbd xnKbd>Ctrl</kbd> + <kbd xnKbd>K</kbd> for the command palette, or read the
  <a xnLink href="/components">docs</a> and copy <code xnInlineCode>cn()</code> from the
  source.
</p>`,
    },
    {
      label: 'TypeScript',
      code: `import { InlineCode, Kbd, Link } from '@xenode/ui';

@Component({
  imports: [InlineCode, Kbd, Link],
  templateUrl: './shortcut.html',
})
export class Shortcut {}`,
    },
  ] as const;
}
