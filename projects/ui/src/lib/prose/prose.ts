import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Typography for long-form content: one wrapper styling plain semantic HTML
 * via descendant selectors, so markdown-ish output needs no per-element
 * classes.
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
      'max-w-prose text-sm leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&>:first-child]:mt-0',
      this.userClass(),
    ),
  );
}
