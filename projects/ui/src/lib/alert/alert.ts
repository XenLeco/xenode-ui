import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';
import { alertVariants, type AlertVariants } from './alert-variants';

/**
 * role="alert" makes this a live region: screen readers announce it when it
 * appears. Use it for messages that matter; static decorative callouts
 * should override the role.
 */
@Directive({
  selector: '[xnAlert]',
  host: {
    'data-slot': 'alert',
    role: 'alert',
    '[class]': 'classes()',
  },
})
export class Alert {
  readonly variant = input<AlertVariants['variant']>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(alertVariants({ variant: this.variant() }), this.userClass()),
  );
}

@Directive({
  selector: '[xnAlertTitle]',
  host: {
    'data-slot': 'alert-title',
    '[class]': 'classes()',
  },
})
export class AlertTitle {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('font-medium tracking-tight', this.userClass()),
  );
}

@Directive({
  selector: '[xnAlertDescription]',
  host: {
    'data-slot': 'alert-description',
    '[class]': 'classes()',
  },
})
export class AlertDescription {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  // Inherits the alert's own text color so it stays readable on solid
  // variants; consumers may mute it on the default variant.
  protected readonly classes = computed(() => cn('text-sm [&_p]:leading-relaxed', this.userClass()));
}

/** Convenience for `imports: [ALERT]`. */
export const ALERT = [Alert, AlertTitle, AlertDescription] as const;
