import { Component } from '@angular/core';

import {
  AVATAR,
  AvatarGroup,
  Badge,
  badgeVariantConfig,
  EMPTY,
  EmptyIcon,
  ITEM,
  Kbd,
  Meter,
  Output,
  Progress,
  Rating,
  STAT,
  STEPPER,
  Tag,
  TagRemove,
  TEXT_BLOCKS,
  TIMELINE,
} from '@xenode/ui';

type BadgeVariantName = keyof typeof badgeVariantConfig.variants.variant;

@Component({
  selector: 'app-docs-display',
  imports: [
    Badge,
    Tag,
    TagRemove,
    Kbd,
    AVATAR,
    AvatarGroup,
    Rating,
    STAT,
    ITEM,
    EMPTY,
    EmptyIcon,
    TIMELINE,
    STEPPER,
    TEXT_BLOCKS,
    Progress,
    Meter,
    Output,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Display</h1>

    <section class="mt-8" aria-labelledby="badge-h">
      <h2 id="badge-h" class="text-lg font-semibold">Badge, tag &amp; kbd</h2>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        @for (variant of badgeVariants; track variant) {
          <span xnBadge [variant]="variant" class="capitalize">{{ variant }}</span>
        }
        <span xnTag>angular <button xnTagRemove aria-label="Remove tag angular">✕</button></span>
        <kbd xnKbd>Ctrl</kbd>
        <kbd xnKbd>K</kbd>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="avatar-h">
      <h2 id="avatar-h" class="text-lg font-semibold">Avatar, rating &amp; progress</h2>
      <div class="mt-3 flex items-center gap-4">
        <span xnAvatar>
          <img xnAvatarImage src="does-not-exist.png" alt="" />
          <span xnAvatarFallback>DL</span>
        </span>
        <div xnAvatarGroup>
          <span xnAvatar><span xnAvatarFallback>A</span></span>
          <span xnAvatar><span xnAvatarFallback>B</span></span>
          <span xnAvatar><span xnAvatarFallback>C</span></span>
        </div>
        <span xnRating value="4" max="5"></span>
        <div class="w-48"><div xnProgress value="60" aria-label="Build progress"></div></div>
      </div>
      <div class="mt-3 flex max-w-sm items-center gap-3">
        <label for="d-disk" class="text-sm">Disk</label>
        <meter xnMeter id="d-disk" min="0" max="1" value="0.6"></meter>
        <output xnOutput>60%</output>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="stat-h">
      <h2 id="stat-h" class="text-lg font-semibold">Stats</h2>
      <div xnStatGroup class="mt-3 max-w-xl">
        <div xnStat>
          <span xnStatLabel>Tests</span><span xnStatValue>135</span>
          <span xnStatDelta trend="up">+14 this wave</span>
        </div>
        <div xnStat>
          <span xnStatLabel>Bundle</span><span xnStatValue>355 kB</span>
          <span xnStatDelta trend="down">near budget</span>
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="item-h">
      <h2 id="item-h" class="text-lg font-semibold">Item &amp; empty state</h2>
      <div class="mt-3 grid max-w-md gap-4">
        <div xnItem class="border">
          <span xnItemMedia><span xnAvatar><span xnAvatarFallback>MC</span></span></span>
          <div xnItemContent>
            <span xnItemTitle>Minecraft — survival world</span>
            <span xnItemDescription>Running · 3 players online</span>
          </div>
          <div xnItemActions><span xnBadge variant="secondary">1.21</span></div>
        </div>
        <div xnEmpty>
          <span xnEmptyIcon>∅</span>
          <p xnEmptyTitle>No servers yet</p>
          <p xnEmptyDescription>Create your first game server to see it here.</p>
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="timeline-h">
      <h2 id="timeline-h" class="text-lg font-semibold">Timeline &amp; stepper</h2>
      <ol xnTimeline class="mt-3 max-w-md">
        <li xnTimelineItem>
          <span xnTimelineDot></span><span xnTimelineConnector></span>
          <div xnTimelineContent>
            <time xnTimelineTime datetime="2026-08-12">Aug 12</time>
            Tokens locked to WCAG AA
          </div>
        </li>
        <li xnTimelineItem>
          <span xnTimelineDot></span>
          <div xnTimelineContent>
            <time xnTimelineTime datetime="2026-08-14">Aug 14</time>
            201 components reached
          </div>
        </li>
      </ol>
      <ol xnStepper class="mt-6">
        <li xnStep>
          <span xnStepIndicator>1</span>
          <span><span xnStepTitle>Scaffold</span><br /><span xnStepDescription>done</span></span>
        </li>
        <li xnStep aria-current="step">
          <span xnStepIndicator>2</span>
          <span><span xnStepTitle>Docs</span><br /><span xnStepDescription>in progress</span></span>
        </li>
        <li xnStep>
          <span xnStepIndicator>3</span>
          <span><span xnStepTitle>Deploy</span><br /><span xnStepDescription>pending</span></span>
        </li>
      </ol>
    </section>

    <section class="mt-10" aria-labelledby="dl-h">
      <h2 id="dl-h" class="text-lg font-semibold">Description list</h2>
      <dl xnDescriptionList class="mt-3 max-w-md">
        <dt xnDescriptionTerm>License</dt>
        <dd xnDescriptionDetail>MIT</dd>
        <dt xnDescriptionTerm>Framework</dt>
        <dd xnDescriptionDetail>Angular 22, zoneless</dd>
      </dl>
    </section>
  `,
})
export class DisplayDoc {
  protected readonly badgeVariants = Object.keys(
    badgeVariantConfig.variants.variant,
  ) as BadgeVariantName[];
}
