import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';
import { buttonVariants, type ButtonVariants } from './button-variants';

/**
 * A directive on the native <button>, not a wrapper component: keyboard
 * activation, form participation and disabled semantics stay native.
 */
@Directive({
  selector: 'button[xnButton]',
  host: {
    'data-slot': 'button',
    '[class]': 'classes()',
  },
})
export class Button {
  readonly variant = input<ButtonVariants['variant']>('default');
  readonly size = input<ButtonVariants['size']>('default');

  // The consumer writes natural HTML (`class="..."`); the alias captures it
  // so it can be merged last and win conflicts.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );
}
