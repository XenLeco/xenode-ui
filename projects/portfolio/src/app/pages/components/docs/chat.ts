import { Component } from '@angular/core';

import { AVATAR, CHAT } from '@xenode/ui';

@Component({
  selector: 'app-docs-chat',
  imports: [CHAT, AVATAR],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Chat</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Bubbles, message rows, attachments and presence — the messaging set, specs defined for this
      system.
    </p>

    <section class="mt-8 max-w-md" aria-labelledby="chat-h">
      <h2 id="chat-h" class="text-lg font-semibold">Conversation</h2>
      <div
        xnMessageScroller
        #scroller="xnMessageScroller"
        class="mt-3 h-64 rounded-lg border p-4"
        tabindex="0"
        aria-label="Conversation with Dan"
      >
        <div xnMessage>
          <span xnMessageAvatar>
            <span xnAvatar><span xnAvatarFallback>DL</span></span>
          </span>
          <div xnMessageBody>
            <div xnMessageMeta>
              Dan <span xnMarker variant="active"></span> online
              <time xnMessageTime datetime="12:00">12:00</time>
            </div>
            <div xnBubbleGroup>
              <div xnBubble>Server is up — want to hop on?</div>
              <div xnBubble>World loaded in 0.28s off the old volume.</div>
            </div>
          </div>
        </div>
        <div xnMessage class="flex-row-reverse">
          <div xnMessageBody class="items-end">
            <div xnBubbleGroup class="items-end">
              <div xnBubble variant="sent">On my way!</div>
            </div>
            <span xnMessageStatus>Delivered</span>
          </div>
        </div>
        <span xnAttachment>
          <span xnAttachmentIcon>📦</span>
          <span xnAttachmentName>world-backup.zip</span>
          <span xnAttachmentSize>2.4 MB</span>
          <button xnAttachmentRemove aria-label="Remove attachment">✕</button>
        </span>
      </div>
      <button
        class="mt-2 cursor-pointer rounded-md border px-2 py-1 text-sm"
        (click)="scroller.scrollToBottom()"
      >
        Scroll to bottom
      </button>
    </section>

    <section class="mt-10 max-w-md" aria-labelledby="q-h">
      <h2 id="q-h" class="text-lg font-semibold">Questionnaire</h2>
      <div xnQuestionnaire class="mt-3">
        <fieldset xnQuestionnaireItem>
          <legend xnQuestionText>How was the server performance?</legend>
          <p xnQuestionHint>1 is unplayable, 5 is flawless.</p>
          <div class="flex gap-3 text-sm">
            @for (option of [1, 2, 3, 4, 5]; track option) {
              <label class="flex items-center gap-1">
                <input type="radio" name="perf" class="accent-primary" [value]="option" />
                {{ option }}
              </label>
            }
          </div>
        </fieldset>
        <div xnDirection dir="rtl" class="rounded-lg border p-3 text-sm">
          نص من اليمين إلى اليسار — the direction utility at work.
        </div>
      </div>
    </section>
  `,
})
export class ChatDoc {}
