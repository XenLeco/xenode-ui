import { Directive, computed, input, model } from '@angular/core';

import { cn } from '../cn';

/**
 * A pressed-state button. `pressed` is a model(): consumers may two-way
 * bind `[(pressed)]` or leave it uncontrolled — the directive keeps its own
 * state either way, and aria-pressed always reflects it.
 */
@Directive({
  selector: 'button[xnToggle]',
  host: {
    'data-slot': 'toggle',
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'toggle()',
    '[class]': 'classes()',
  },
})
export class Toggle {
  readonly pressed = model(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected toggle(): void {
    this.pressed.update((value) => !value);
  }

  protected readonly classes = computed(() =>
    cn(
      'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-[color,background-color] hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-accent aria-pressed:text-accent-foreground',
      this.userClass(),
    ),
  );
}

/** Layout for a set of toggles; each toggle keeps independent state. */
@Directive({
  selector: '[xnToggleGroup]',
  host: {
    'data-slot': 'toggle-group',
    role: 'group',
    '[class]': 'classes()',
  },
})
export class ToggleGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-center gap-1', this.userClass()));
}
