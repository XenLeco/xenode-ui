import { Component, Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Framed mockups for showing off code and screenshots: window/browser
 * chrome, a terminal block and a diff view. Decoration is aria-hidden; the
 * content stays real text.
 */

@Directive({
  selector: '[xnMockupWindow]',
  host: { 'data-slot': 'mockup-window', '[class]': 'classes()' },
})
export class MockupWindow {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('overflow-hidden rounded-lg border bg-card text-card-foreground', this.userClass()),
  );
}

/** Title bar with traffic lights; project an address/title after them. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- attribute-selector component
  selector: 'div[xnMockupBar]',
  template: `
    <span aria-hidden="true" class="flex gap-1.5">
      <span class="size-2.5 rounded-full bg-destructive/80"></span>
      <span class="size-2.5 rounded-full bg-warning/80"></span>
      <span class="size-2.5 rounded-full bg-success/80"></span>
    </span>
    <ng-content />
  `,
  host: { 'data-slot': 'mockup-bar', '[class]': 'classes()' },
})
export class MockupBar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex items-center gap-3 border-b bg-muted/50 px-3 py-2 text-xs text-muted-foreground',
      this.userClass(),
    ),
  );
}

/** Inverted terminal block; lines carry their own prompts. */
@Directive({
  selector: 'pre[xnTerminal]',
  host: { 'data-slot': 'terminal', tabindex: '0', '[class]': 'classes()' },
})
export class Terminal {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'overflow-x-auto rounded-lg bg-foreground p-4 font-mono text-xs leading-relaxed text-background',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnTerminalLine]',
  host: { 'data-slot': 'terminal-line', '[class]': 'classes()' },
})
export class TerminalLine {
  /** 'command' lines render a $ prompt; 'output' lines are dimmed. */
  readonly kind = input<'command' | 'output'>('command');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'block',
      this.kind() === 'command'
        ? "before:mr-2 before:opacity-60 before:content-['$']"
        : 'opacity-70',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnDiff]',
  host: { 'data-slot': 'diff', '[class]': 'classes()' },
})
export class Diff {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'overflow-x-auto rounded-lg border bg-card py-2 font-mono text-xs leading-relaxed',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnDiffLine]',
  host: { 'data-slot': 'diff-line', '[class]': 'classes()' },
})
export class DiffLine {
  readonly kind = input<'added' | 'removed' | 'context'>('context');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'block px-4 whitespace-pre',
      {
        added: "bg-success/15 text-success-text before:mr-2 before:content-['+']",
        removed: "bg-destructive/15 text-danger before:mr-2 before:content-['-']",
        context: "text-muted-foreground before:mr-2 before:content-['_'] before:opacity-0",
      }[this.kind()],
      this.userClass(),
    ),
  );
}

/** Phone frame: bezel + notch + a screen slot content projects into. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- attribute-selector component
  selector: 'div[xnMockupPhone]',
  template: `
    <span
      aria-hidden="true"
      data-slot="mockup-phone-notch"
      class="absolute top-1.5 left-1/2 z-10 h-4 w-20 -translate-x-1/2 rounded-b-lg bg-foreground"
    ></span>
    <div data-slot="mockup-phone-screen" class="size-full overflow-hidden rounded-[2rem] bg-background">
      <ng-content />
    </div>
  `,
  host: {
    'data-slot': 'mockup-phone',
    '[class]': 'classes()',
  },
})
export class MockupPhone {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative mx-auto aspect-[9/19.5] w-64 overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-foreground p-1.5 shadow-xl',
      this.userClass(),
    ),
  );
}

export const MOCKUPS = [
  MockupWindow,
  MockupBar,
  Terminal,
  TerminalLine,
  Diff,
  DiffLine,
  MockupPhone,
] as const;
