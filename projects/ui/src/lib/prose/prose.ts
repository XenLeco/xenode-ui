import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Typography for long-form content: one wrapper styling plain semantic HTML
 * via descendant selectors, so markdown-ish output needs no per-element
 * classes.
 *
 * Rhythm is three custom properties — everything else derives from them
 * (the typeset model: nobody wants a dozen knobs to make markdown read
 * well):
 *   --prose-size     base text size (default 0.875rem; set 1em to follow
 *                    the surrounding container, e.g. inside a chat bubble)
 *   --prose-leading  line height (default 1.75)
 *   --prose-flow     space between blocks (default 1.25em — em on purpose,
 *                    so gaps scale with the type they separate)
 * Override per context with a class: `[--prose-size:1em]`.
 */
@Directive({
  selector: '[xnProse]',
  host: {
    'data-slot': 'prose',
    '[class]': 'classes()',
  },
})
export class Prose {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      '[--prose-size:0.875rem] [--prose-leading:1.75] [--prose-flow:1.25em] max-w-prose text-(length:--prose-size) leading-(--prose-leading) [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mt-(--prose-flow) [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:mt-[calc(var(--prose-flow)*1.6)] [&_h2]:text-[calc(var(--prose-size)*1.5)] [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-[calc(var(--prose-flow)*1.4)] [&_h3]:text-[calc(var(--prose-size)*1.25)] [&_h3]:leading-snug [&_h3]:font-semibold [&_hr]:my-[calc(var(--prose-flow)*1.5)] [&_li]:mt-[calc(var(--prose-flow)*0.25)] [&_ol]:mt-(--prose-flow) [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-(--prose-flow) [&_ul]:mt-(--prose-flow) [&_ul]:list-disc [&_ul]:pl-6 [&>:first-child]:mt-0',
      this.userClass(),
    ),
  );
}
