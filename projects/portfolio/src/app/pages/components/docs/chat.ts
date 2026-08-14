import { Component, type OnDestroy, signal } from '@angular/core';

import { AVATAR, Button, CHAT } from '@xenode/ui';

import { ExampleBox } from './example-box';

const STREAM_LINES = [
  'Pulling the image…',
  'Layer 3/7 done.',
  'Volume mounted read-write.',
  'Networking up — port 25565 exposed.',
  'Loading world "skyblock-prod"…',
  'Spawn chunks ready in 0.31s.',
  'Server is live. 0 players online.',
];

@Component({
  selector: 'app-docs-chat',
  imports: [CHAT, AVATAR, Button, ExampleBox],
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
        class="scroll-fade-y mt-3 h-64 rounded-lg border p-4"
        tabindex="0"
        role="log"
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

    <section class="mt-10 max-w-md" aria-labelledby="example-h">
      <h2 id="example-h" class="text-lg font-semibold">Message example</h2>
      <app-example-box title="Message example" [tabs]="exampleTabs" class="mt-3 block">
        <div class="flex w-full flex-col gap-3">
          <div xnMessage>
            <span xnMessageAvatar>
              <span xnAvatar><span xnAvatarFallback>DL</span></span>
            </span>
            <div xnMessageBody>
              <div xnBubbleGroup>
                <div xnBubble>Server is up — want to hop on?</div>
              </div>
            </div>
          </div>
          <div xnMessage class="flex-row-reverse">
            <div xnMessageBody class="items-end">
              <div xnBubbleGroup class="items-end">
                <div xnBubble variant="sent">On my way!</div>
              </div>
            </div>
          </div>
        </div>
      </app-example-box>
    </section>

    <section class="mt-10 max-w-md" aria-labelledby="stream-h">
      <h2 id="stream-h" class="text-lg font-semibold">Streaming</h2>
      <p class="mt-2 max-w-prose text-sm text-muted-foreground">
        The scroller follows only while you are at the live edge. Scroll up mid-stream and it holds
        your place; the jump affordance appears and brings you back.
      </p>
      <div class="relative mt-3">
        <div
          xnMessageScroller
          #stream="xnMessageScroller"
          #streamBox
          class="scroll-fade-y h-64 rounded-lg border p-4"
          tabindex="0"
          role="log"
          aria-label="Streaming demo"
        >
          <div xnBubbleGroup>
            @for (line of streamed(); track $index) {
              <div xnBubble>{{ line }}</div>
            }
          </div>
        </div>
        @if (!stream.atLiveEdge()) {
          <!-- The button unmounts once pinned — hand focus to the scroller
               so a keyboard user's Tab position survives the jump. -->
          <button
            xnButton
            size="sm"
            variant="secondary"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-md"
            (click)="stream.scrollToBottom(); streamBox.focus()"
          >
            ↓ Latest
          </button>
        }
      </div>
      <button xnButton variant="outline" size="sm" class="mt-2" (click)="toggleStream()">
        {{ streaming() ? 'Stop stream' : 'Start stream' }}
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
export class ChatDoc implements OnDestroy {
  protected readonly streamed = signal<readonly string[]>(['Streaming demo — press start.']);
  protected readonly streaming = signal(false);
  private streamTimer: ReturnType<typeof setInterval> | undefined;
  private streamIndex = 0;

  protected toggleStream(): void {
    if (this.streaming()) {
      clearInterval(this.streamTimer);
      this.streaming.set(false);
      return;
    }
    this.streaming.set(true);
    this.streamTimer = setInterval(() => {
      this.streamed.update((lines) => [
        ...lines,
        STREAM_LINES[this.streamIndex++ % STREAM_LINES.length],
      ]);
    }, 600);
  }

  ngOnDestroy(): void {
    clearInterval(this.streamTimer);
  }

  protected readonly exampleTabs = [
    {
      label: 'Angular',
      code: `<div class="flex w-full flex-col gap-3">
  <div xnMessage>
    <span xnMessageAvatar>
      <span xnAvatar><span xnAvatarFallback>DL</span></span>
    </span>
    <div xnMessageBody>
      <div xnBubbleGroup>
        <div xnBubble>Server is up — want to hop on?</div>
      </div>
    </div>
  </div>
  <div xnMessage class="flex-row-reverse">
    <div xnMessageBody class="items-end">
      <div xnBubbleGroup class="items-end">
        <div xnBubble variant="sent">On my way!</div>
      </div>
    </div>
  </div>
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { AVATAR, CHAT } from '@xenode/ui';

@Component({
  imports: [CHAT, AVATAR],
  templateUrl: './conversation.html',
})
export class Conversation {}`,
    },
  ] as const;
}
