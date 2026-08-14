import { Component } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

import {
  Badge,
  BENTO,
  Button,
  CARD,
  FIELD,
  FORM_EXTRAS,
  Input,
  Label,
  MOCKUPS,
  RadialProgress,
  XN_ACCORDION,
} from '@xenode/ui';

import { ExampleBox } from './example-box';

const LOGIN_SNIPPET = `<div xnCard class="max-w-sm">
  <div xnCardHeader>
    <h2 xnCardTitle>Sign in</h2>
    <p xnCardDescription>Local break-glass admin account.</p>
  </div>
  <form xnCardContent class="grid gap-4">
    <div xnField>
      <label xnLabel for="email">Email</label>
      <input xnInput id="email" type="email" autocomplete="username" />
    </div>
    <div xnField>
      <label xnLabel for="pw">Password</label>
      <input xnPasswordInput #pw="xnPasswordInput" id="pw"
        [type]="pw.visible() ? 'text' : 'password'" />
    </div>
    <button xnButton type="submit">Sign in</button>
  </form>
</div>`;

@Component({
  selector: 'app-docs-blocks',
  imports: [
    CARD,
    FIELD,
    Label,
    Input,
    FORM_EXTRAS,
    Button,
    Badge,
    XN_ACCORDION,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    ExampleBox,
    BENTO,
    MOCKUPS,
    RadialProgress,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Blocks</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Whole sections composed purely from library components — copy the markup, keep the system.
    </p>

    <section class="mt-8" aria-labelledby="login-h">
      <h2 id="login-h" class="text-lg font-semibold">Login</h2>
      <app-example-box title="Login block" [tabs]="loginTabs" class="mt-3 block max-w-2xl">
        <div xnCard class="max-w-sm animate-fade-in-up">
          <div xnCardHeader>
            <h3 xnCardTitle>Sign in</h3>
            <p xnCardDescription>Local break-glass admin account.</p>
          </div>
          <form xnCardContent class="grid gap-4" (submit)="$event.preventDefault()">
            <div xnField>
              <label xnLabel for="b-email">Email</label>
              <input xnInput id="b-email" type="email" autocomplete="username" />
            </div>
            <div xnField>
              <label xnLabel for="b-pw">Password</label>
              <div class="flex gap-2">
                <input
                  xnPasswordInput
                  #pw="xnPasswordInput"
                  id="b-pw"
                  [type]="pw.visible() ? 'text' : 'password'"
                  class="flex-1"
                />
                <button
                  xnButton
                  variant="outline"
                  size="icon"
                  type="button"
                  (click)="pw.toggle()"
                  [attr.aria-pressed]="pw.visible()"
                  aria-label="Show password"
                >
                  👁
                </button>
              </div>
            </div>
            <button xnButton type="submit">Sign in</button>
          </form>
        </div>
      </app-example-box>
    </section>

    <section class="mt-12" aria-labelledby="bento-h">
      <h2 id="bento-h" class="text-lg font-semibold">Bento</h2>
      <div xnBento class="mt-3">
        <div xnBentoItem size="hero" tone="gradient" class="animate-rise justify-center gap-3 p-8">
          <span xnBentoTitle class="max-w-md text-2xl sm:text-3xl">
            Run your worlds from one panel
          </span>
          <span xnBentoDescription class="max-w-md">
            Game servers, bots and tunnels behind one dark, honest dashboard.
          </span>
          <div class="mt-2 flex flex-wrap gap-3">
            <!-- Stock variants key off mode-flipping tokens; on this
                 mode-invariant dark blend the CTA pins the gradient's own
                 pair instead — consumer class wins by design. -->
            <button
              xnButton
              class="bg-gradient-foreground text-gradient-from hover:bg-gradient-foreground/90"
            >
              Get started
            </button>
            <button
              xnButton
              variant="glass"
              class="border-gradient-foreground/25 text-gradient-foreground"
            >
              Read the docs
            </button>
          </div>
        </div>
        <div xnBentoItem size="large" class="animate-rise [animation-delay:60ms]">
          <span xnBentoTitle>Live console</span>
          <pre
            xnTerminal
            aria-label="Console example"
          ><span xnTerminalLine>start minecraft</span><span
            xnTerminalLine kind="output">world loaded in 0.28s</span></pre>
          <span xnBentoDescription>SignalR streaming behind a bounded channel.</span>
        </div>
        <div xnBentoItem class="animate-rise [animation-delay:120ms]">
          <span xnBentoTitle>Players</span>
          <span class="text-3xl font-semibold">7</span>
          <span xnBentoDescription>online now</span>
        </div>
        <div xnBentoItem class="animate-rise [animation-delay:180ms]">
          <span xnBentoTitle>Storage</span>
          <span xnRadialProgress value="70" aria-label="Storage used">70%</span>
        </div>
        <div xnBentoItem tone="glass" class="animate-rise [animation-delay:240ms]">
          <span xnBentoTitle>Zero lock-in</span>
          <span xnBentoDescription>MIT everywhere. Copy the markup, keep the system.</span>
        </div>
        <div xnBentoItem tone="glow" class="animate-rise [animation-delay:300ms]">
          <span xnBentoTitle>Uptime</span>
          <span class="text-3xl font-semibold">99.98%</span>
          <span xnBentoDescription>rolling 90 days</span>
        </div>
        <div xnBentoItem size="wide" class="animate-rise [animation-delay:360ms]">
          <span xnBentoTitle>
            Accessible by proof <span xnBadge variant="success" class="ml-1">AA</span>
          </span>
          <span xnBentoDescription>Every token pair locked by a contrast test in CI.</span>
        </div>
        <div xnBentoItem size="wide" tone="glass" class="animate-rise [animation-delay:420ms]">
          <span xnBentoTitle>Blend, don't shout</span>
          <span xnBentoDescription>
            Glass, gradient and glow tones share one vocabulary with
            <code class="font-mono text-xs">xnSurface</code>.
          </span>
        </div>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="pricing-h">
      <h2 id="pricing-h" class="text-lg font-semibold">Pricing</h2>
      <div class="mt-3 grid gap-4 sm:grid-cols-2">
        <div xnCard class="animate-fade-in-up">
          <div xnCardHeader>
            <h3 xnCardTitle>Hobby</h3>
            <p xnCardDescription>One node, your own hardware.</p>
          </div>
          <div xnCardContent>
            <p class="text-3xl font-semibold">
              €0<span class="text-sm text-muted-foreground">/mo</span>
            </p>
          </div>
          <div xnCardFooter>
            <button xnButton variant="outline" class="w-full">Self-host</button>
          </div>
        </div>
        <div xnCard class="animate-fade-in-up border-ring [animation-delay:80ms]">
          <div xnCardHeader>
            <h3 xnCardTitle>
              Supporter <span xnBadge variant="success" class="ml-1">Popular</span>
            </h3>
            <p xnCardDescription>Same software, plus warm feelings.</p>
          </div>
          <div xnCardContent>
            <p class="text-3xl font-semibold">
              €5<span class="text-sm text-muted-foreground">/mo</span>
            </p>
          </div>
          <div xnCardFooter>
            <button xnButton class="w-full">Sponsor</button>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12 max-w-xl" aria-labelledby="faq-h">
      <h2 id="faq-h" class="text-lg font-semibold">FAQ</h2>
      <div ngAccordionGroup xnAccordion class="mt-3">
        <div xnAccordionItem>
          <h3 class="flex">
            <button ngAccordionTrigger xnAccordionTrigger [panel]="faqA">
              Is it free? <span data-chevron aria-hidden="true">⌄</span>
            </button>
          </h3>
          <div ngAccordionPanel xnAccordionPanel #faqA="ngAccordionPanel">
            <ng-template ngAccordionContent>MIT-licensed, forever.</ng-template>
          </div>
        </div>
        <div xnAccordionItem>
          <h3 class="flex">
            <button ngAccordionTrigger xnAccordionTrigger [panel]="faqB">
              Does dark mode work? <span data-chevron aria-hidden="true">⌄</span>
            </button>
          </h3>
          <div ngAccordionPanel xnAccordionPanel #faqB="ngAccordionPanel">
            <ng-template ngAccordionContent>
              Three states, no flash, contrast-tested in both.
            </ng-template>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BlocksDoc {
  protected readonly loginTabs = [
    { label: 'Angular', code: LOGIN_SNIPPET },
    {
      label: 'TypeScript',
      code: `import { Button, CARD, FIELD, FORM_EXTRAS, Input, Label } from '@xenode/ui';

@Component({
  imports: [CARD, FIELD, Label, Input, FORM_EXTRAS, Button],
  templateUrl: './login.html',
})
export class Login {}`,
    },
  ] as const;
}
