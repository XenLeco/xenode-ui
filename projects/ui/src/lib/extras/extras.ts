import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/** Slot extras rounding out existing families. */

/** Icon slot for the Empty state block. */
@Directive({
  selector: '[xnEmptyIcon]',
  host: { 'data-slot': 'empty-icon', 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class EmptyIcon {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('mb-1 text-2xl text-muted-foreground', this.userClass()),
  );
}

/** Action slot pinned to a card header's end (buttons, menus). */
@Directive({
  selector: '[xnCardAction]',
  host: { 'data-slot': 'card-action', '[class]': 'classes()' },
})
export class CardAction {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('ml-auto shrink-0', this.userClass()));
}

/** Corner close button for dialogs; wire (click)="dlg.close()" yourself. */
@Directive({
  selector: 'button[xnDialogClose]',
  host: { 'data-slot': 'dialog-close', type: 'button', '[class]': 'classes()' },
})
export class DialogClose {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute top-4 right-4 inline-flex size-6 cursor-pointer items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

/** Overlapping avatar stack. */
@Directive({
  selector: '[xnAvatarGroup]',
  host: { 'data-slot': 'avatar-group', '[class]': 'classes()' },
})
export class AvatarGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex -space-x-2 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-background',
      this.userClass(),
    ),
  );
}

export const EXTRAS = [EmptyIcon, CardAction, DialogClose, AvatarGroup] as const;
