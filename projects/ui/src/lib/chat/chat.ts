import { Directive, ElementRef, computed, inject, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Chat/messaging set (not part of shadcn — specs defined for this system):
 * bubbles, message rows, a bottom-pinned scroller, attachments, presence
 * markers, a direction utility and questionnaire layout.
 */

@Directive({
  selector: '[xnBubbleGroup]',
  host: { 'data-slot': 'bubble-group', '[class]': 'classes()' },
})
export class BubbleGroup {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-1', this.userClass()));
}

@Directive({ selector: '[xnBubble]', host: { 'data-slot': 'bubble', '[class]': 'classes()' } })
export class Bubble {
  /** 'sent' aligns right on primary; 'received' aligns left on muted. */
  readonly variant = input<'sent' | 'received'>('received');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'w-fit max-w-[75%] rounded-lg px-3 py-2 text-sm',
      this.variant() === 'sent'
        ? 'self-end rounded-br-sm bg-primary text-primary-foreground'
        : 'self-start rounded-bl-sm bg-muted text-foreground',
      this.userClass(),
    ),
  );
}

@Directive({ selector: '[xnMessage]', host: { 'data-slot': 'message', '[class]': 'classes()' } })
export class Message {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex items-start gap-3', this.userClass()));
}

@Directive({
  selector: '[xnMessageAvatar]',
  host: { 'data-slot': 'message-avatar', '[class]': 'classes()' },
})
export class MessageAvatar {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('mt-0.5 shrink-0', this.userClass()));
}

@Directive({
  selector: '[xnMessageBody]',
  host: { 'data-slot': 'message-body', '[class]': 'classes()' },
})
export class MessageBody {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-1 flex-col gap-1', this.userClass()),
  );
}

@Directive({
  selector: '[xnMessageMeta]',
  host: { 'data-slot': 'message-meta', '[class]': 'classes()' },
})
export class MessageMeta {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex items-baseline gap-2 text-xs text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'time[xnMessageTime]',
  host: { 'data-slot': 'message-time', '[class]': 'classes()' },
})
export class MessageTime {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('tabular-nums', this.userClass()));
}

@Directive({
  selector: '[xnMessageStatus]',
  host: { 'data-slot': 'message-status', '[class]': 'classes()' },
})
export class MessageStatus {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs text-muted-foreground', this.userClass()),
  );
}

/**
 * Scroll container for a message list. Call scrollToBottom() after
 * appending (the consumer owns the list state, so it owns the moment).
 */
@Directive({
  selector: '[xnMessageScroller]',
  exportAs: 'xnMessageScroller',
  host: { 'data-slot': 'message-scroller', '[class]': 'classes()' },
})
export class MessageScroller {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-col gap-3 overflow-y-auto [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]',
      this.userClass(),
    ),
  );

  scrollToBottom(): void {
    const el = this.elementRef.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }
}

@Directive({
  selector: '[xnAttachment]',
  host: { 'data-slot': 'attachment', '[class]': 'classes()' },
})
export class Attachment {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex w-fit items-center gap-2 rounded-md border bg-card py-1.5 pr-1.5 pl-2 text-sm text-card-foreground',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[xnAttachmentIcon]',
  host: { 'data-slot': 'attachment-icon', 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class AttachmentIcon {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('shrink-0 text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: '[xnAttachmentName]',
  host: { 'data-slot': 'attachment-name', '[class]': 'classes()' },
})
export class AttachmentName {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('max-w-40 truncate font-medium', this.userClass()),
  );
}

@Directive({
  selector: '[xnAttachmentSize]',
  host: { 'data-slot': 'attachment-size', '[class]': 'classes()' },
})
export class AttachmentSize {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs whitespace-nowrap text-muted-foreground', this.userClass()),
  );
}

@Directive({
  selector: 'button[xnAttachmentRemove]',
  host: { 'data-slot': 'attachment-remove', type: 'button', '[class]': 'classes()' },
})
export class AttachmentRemove {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-flex size-5 cursor-pointer items-center justify-center rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ring',
      this.userClass(),
    ),
  );
}

/**
 * Presence/status dot. Color is never the only channel: pair it with text
 * or give it an aria-label.
 */
@Directive({ selector: '[xnMarker]', host: { 'data-slot': 'marker', '[class]': 'classes()' } })
export class Marker {
  readonly variant = input<'default' | 'active' | 'danger'>('default');

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'inline-block size-2 shrink-0 rounded-full',
      { default: 'bg-muted-foreground', active: 'bg-primary', danger: 'bg-destructive' }[
        this.variant()
      ],
      this.userClass(),
    ),
  );
}

/** Sets text direction for a subtree; 'auto' lets content decide. */
@Directive({
  selector: '[xnDirection]',
  host: { 'data-slot': 'direction', '[attr.dir]': 'dir()' },
})
export class Direction {
  readonly dir = input<'ltr' | 'rtl' | 'auto'>('auto');
}

@Directive({
  selector: '[xnQuestionnaire]',
  host: { 'data-slot': 'questionnaire', '[class]': 'classes()' },
})
export class Questionnaire {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-6', this.userClass()));
}

@Directive({
  selector: 'fieldset[xnQuestionnaireItem]',
  host: { 'data-slot': 'questionnaire-item', '[class]': 'classes()' },
})
export class QuestionnaireItem {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('m-0 grid gap-3 rounded-lg border p-4', this.userClass()),
  );
}

@Directive({
  selector: 'legend[xnQuestionText]',
  host: { 'data-slot': 'question-text', '[class]': 'classes()' },
})
export class QuestionText {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('float-left text-sm font-medium', this.userClass()),
  );
}

@Directive({
  selector: '[xnQuestionHint]',
  host: { 'data-slot': 'question-hint', '[class]': 'classes()' },
})
export class QuestionHint {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-xs text-muted-foreground', this.userClass()),
  );
}

export const CHAT = [
  BubbleGroup,
  Bubble,
  Message,
  MessageAvatar,
  MessageBody,
  MessageMeta,
  MessageTime,
  MessageStatus,
  MessageScroller,
  Attachment,
  AttachmentIcon,
  AttachmentName,
  AttachmentSize,
  AttachmentRemove,
  Marker,
  Direction,
  Questionnaire,
  QuestionnaireItem,
  QuestionText,
  QuestionHint,
] as const;
