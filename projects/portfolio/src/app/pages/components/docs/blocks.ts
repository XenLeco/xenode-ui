import { Component } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';

import { Badge, Button, CARD, FIELD, FORM_EXTRAS, Input, Label, XN_ACCORDION } from '@xenode/ui';

import { CodeSnippet } from './code-snippet';

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
    CodeSnippet,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Blocks</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Whole sections composed purely from library components — copy the markup, keep the system.
    </p>

    <section class="mt-8" aria-labelledby="login-h">
      <h2 id="login-h" class="text-lg font-semibold">Login</h2>
      <div class="mt-3 grid items-start gap-6 lg:grid-cols-2">
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
        <app-code-snippet [code]="loginSnippet" label="login block markup" />
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
            <p class="text-3xl font-semibold">€0<span class="text-sm text-muted-foreground">/mo</span></p>
          </div>
          <div xnCardFooter>
            <button xnButton variant="outline" class="w-full">Self-host</button>
          </div>
        </div>
        <div xnCard class="animate-fade-in-up border-ring [animation-delay:80ms]">
          <div xnCardHeader>
            <h3 xnCardTitle>Supporter <span xnBadge variant="success" class="ml-1">Popular</span></h3>
            <p xnCardDescription>Same software, plus warm feelings.</p>
          </div>
          <div xnCardContent>
            <p class="text-3xl font-semibold">€5<span class="text-sm text-muted-foreground">/mo</span></p>
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
  protected readonly loginSnippet = LOGIN_SNIPPET;
}
