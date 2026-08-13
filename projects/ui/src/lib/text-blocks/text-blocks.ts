import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Semantic text primitives: description list, figure, code, link, output, meter. */

@Directive({
  selector: 'dl[xnDescriptionList]',
  host: { 'data-slot': 'description-list', '[class]': 'classes()' },
})
export class DescriptionList {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm', this.userClass()),
  );
}

@Directive({
  selector: 'dt[xnDescriptionTerm]',
  host: { 'data-slot': 'description-term', '[class]': 'classes()' },
})
export class DescriptionTerm {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('font-medium text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'dd[xnDescriptionDetail]',
  host: { 'data-slot': 'description-detail', '[class]': 'classes()' },
})
export class DescriptionDetail {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('m-0', this.userClass()));
}

@Directive({
  selector: 'figure[xnFigure]',
  host: { 'data-slot': 'figure', '[class]': 'classes()' },
})
export class Figure {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-2', this.userClass()));
}

@Directive({
  selector: 'figcaption[xnFigCaption]',
  host: { 'data-slot': 'fig-caption', '[class]': 'classes()' },
})
export class FigCaption {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'pre[xnCodeBlock]',
  host: { 'data-slot': 'code-block', tabindex: '0', '[class]': 'classes()' },
})
export class CodeBlock {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-xs leading-relaxed',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'code[xnInlineCode]',
  host: { 'data-slot': 'inline-code', '[class]': 'classes()' },
})
export class InlineCode {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('rounded bg-muted px-1 py-0.5 font-mono text-xs', this.userClass()),
  );
}

@Directive({ selector: 'a[xnLink]', host: { 'data-slot': 'link', '[class]': 'classes()' } })
export class Link {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'font-medium underline underline-offset-4 transition-[color] hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: 'output[xnOutput]',
  host: { 'data-slot': 'output', '[class]': 'classes()' },
})
export class Output {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm tabular-nums', this.userClass()));
}

/** Native meter, token-accented. Not a progress bar — it shows a measurement. */
@Directive({ selector: 'meter[xnMeter]', host: { 'data-slot': 'meter', '[class]': 'classes()' } })
export class Meter {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('h-3 w-full accent-primary', this.userClass()));
}

export const TEXT_BLOCKS = [
  DescriptionList,
  DescriptionTerm,
  DescriptionDetail,
  Figure,
  FigCaption,
  CodeBlock,
  InlineCode,
  Link,
  Output,
  Meter,
] as const;
