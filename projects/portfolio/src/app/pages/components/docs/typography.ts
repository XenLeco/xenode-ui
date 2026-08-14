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
