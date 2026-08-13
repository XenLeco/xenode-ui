import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XN_ARIA_COMPOSALS } from './aria-composals/aria-composals';
import { CALLOUT } from './callout/callout';
import { CHAT, MessageScroller } from './chat/chat';
import { EXTRAS } from './extras/extras';
import { INPUT_OTP } from './input-otp/input-otp';
import { ITEM } from './item/item';
import { NAV_MENU } from './nav-menu/nav-menu';
import { Rating } from './rating/rating';
import { RESIZABLE } from './resizable/resizable';
import { SIDEBAR } from './sidebar/sidebar';
import { SITE } from './site/site';
import { SortHeader } from './sort-header/sort-header';
import { STAT } from './stat/stat';
import { STEPPER } from './stepper/stepper';
import { TEXT_BLOCKS } from './text-blocks/text-blocks';
import { TIMELINE } from './timeline/timeline';

/**
 * Consolidated render coverage for the mega-wave families: every slot
 * renders with its seam, plus the behaviors that carry logic (sidebar
 * collapse, sort cycle, OTP advance/paste, resizable keyboard nudge,
 * rating aria). Families that later grow real behavior graduate to their
 * own spec files.
 */

@Component({
  imports: [
    XN_ARIA_COMPOSALS,
    TIMELINE,
    STEPPER,
    STAT,
    ITEM,
    TEXT_BLOCKS,
    CALLOUT,
    Rating,
    SITE,
    CHAT,
    SIDEBAR,
    NAV_MENU,
    RESIZABLE,
    INPUT_OTP,
    SortHeader,
    EXTRAS,
  ],
  template: `
    <div xnToolbar aria-label="Formatting"><button type="button">B</button></div>
    <div xnListbox><div xnListboxOption aria-selected="true">One</div></div>
    <div xnTree><div xnTreeItem aria-expanded="true">Node</div></div>
    <div xnMenubar aria-label="App menu"></div>
    <div xnContextMenuArea></div>

    <ol xnTimeline>
      <li xnTimelineItem>
        <span xnTimelineDot></span><span xnTimelineConnector></span>
        <div xnTimelineContent><time xnTimelineTime datetime="2026-08-14">today</time>Shipped</div>
      </li>
    </ol>

    <ol xnStepper>
      <li xnStep aria-current="step">
        <span xnStepIndicator>1</span>
        <span><span xnStepTitle>Scaffold</span><span xnStepDescription>done</span></span>
      </li>
    </ol>

    <div xnStatGroup>
      <div xnStat>
        <span xnStatLabel>Tests</span><span xnStatValue>128</span>
        <span xnStatDelta trend="down">-2</span>
      </div>
    </div>

    <div xnItem>
      <span xnItemMedia>I</span>
      <div xnItemContent><span xnItemTitle>Title</span><span xnItemDescription>Desc</span></div>
      <div xnItemActions><button type="button">Go</button></div>
    </div>

    <dl xnDescriptionList>
      <dt xnDescriptionTerm>License</dt>
      <dd xnDescriptionDetail>MIT</dd>
    </dl>
    <figure xnFigure><figcaption xnFigCaption>Caption</figcaption></figure>
    <pre xnCodeBlock aria-label="Example code"><code>npm test</code></pre>
    <p><code xnInlineCode>cn()</code> <a xnLink href="/">home</a></p>
    <output xnOutput>42</output>
    <label for="disk">Disk</label><meter xnMeter id="disk" value="0.6"></meter>

    <div xnCallout variant="accent">
      <p xnCalloutTitle>Note</p>
      <div xnCalloutContent><p>Body</p></div>
    </div>
    <div xnBanner>New release <a xnBannerAction href="/">read</a></div>
    <span xnTag>angular <button xnTagRemove aria-label="Remove tag angular">✕</button></span>

    <span xnRating value="4" max="5"></span>

    <header xnNavbar>
      <span xnNavbarBrand>brand</span>
      <nav xnNavbarNav aria-label="Main"><a xnNavbarLink href="/">Home</a></nav>
    </header>
    <footer xnFooter>
      <nav xnFooterNav aria-label="Footer"><a href="/">Docs</a></nav>
      <span xnFooterCopyright>© 2026</span>
    </footer>
    <section xnHero>
      <h1 xnHeroTitle>Title</h1>
      <p xnHeroSubtitle>Sub</p>
      <div xnHeroActions><button type="button">Go</button></div>
    </section>
    <div xnSectionHeader>
      <h2 xnSectionTitle>Section</h2>
      <p xnSectionDescription>About it</p>
    </div>

    <div xnBubbleGroup>
      <div xnBubble variant="sent">hi</div>
      <div xnBubble>hello</div>
    </div>
    <div xnMessage>
      <span xnMessageAvatar>A</span>
      <div xnMessageBody>
        <div xnMessageMeta>Dan <time xnMessageTime datetime="12:00">12:00</time></div>
        <span xnMessageStatus>Delivered</span>
      </div>
    </div>
    <div xnMessageScroller class="h-24" tabindex="0" aria-label="Messages"></div>
    <span xnAttachment>
      <span xnAttachmentIcon>📄</span><span xnAttachmentName>world.zip</span>
      <span xnAttachmentSize>2 MB</span>
      <button xnAttachmentRemove aria-label="Remove attachment">✕</button>
    </span>
    <span xnMarker variant="active"></span><span class="text-sm">Online</span>
    <div xnDirection dir="rtl">مرحبا</div>
    <div xnQuestionnaire>
      <fieldset xnQuestionnaireItem>
        <legend xnQuestionText>How was it?</legend>
        <p xnQuestionHint>Optional</p>
      </fieldset>
    </div>

    <div xnSidebarLayout>
      <aside xnSidebar #sb="xnSidebar">
        <div xnSidebarHeader>H</div>
        <div xnSidebarContent>
          <div xnSidebarGroup>
            <span xnSidebarGroupLabel>Servers</span>
            <ul xnSidebarMenu>
              <li xnSidebarMenuItem>
                <a xnSidebarMenuButton href="/" aria-current="page">Minecraft</a>
              </li>
            </ul>
          </div>
        </div>
        <div xnSidebarFooter>F</div>
      </aside>
      <button [xnSidebarTriggerFor]="sb" aria-label="Toggle sidebar">☰</button>
    </div>

    <nav xnNavMenu aria-label="Site">
      <ul xnNavMenuList>
        <li xnNavMenuItem><a xnNavMenuLink href="/" aria-current="page">Home</a></li>
      </ul>
    </nav>

    <div xnResizableGroup>
      <div xnResizablePanel>Left</div>
      <div xnResizableHandle aria-label="Resize panels"></div>
      <div xnResizablePanel>Right</div>
    </div>

    <div xnOtpGroup aria-label="Verification code">
      <input xnOtpSlot aria-label="Digit 1" />
      <input xnOtpSlot aria-label="Digit 2" />
      <input xnOtpSlot aria-label="Digit 3" />
    </div>

    <table>
      <thead>
        <tr>
          <th xnSortHeader>Name</th>
        </tr>
      </thead>
    </table>

    <span xnEmptyIcon>∅</span>
    <div xnCardAction>act</div>
    <button xnDialogClose aria-label="Close dialog">✕</button>
    <div xnAvatarGroup></div>
  `,
})
class Host {}

const ALL_SLOTS = [
  'toolbar',
  'listbox',
  'listbox-option',
  'tree',
  'tree-item',
  'menubar',
  'context-menu-area',
  'timeline',
  'timeline-item',
  'timeline-dot',
  'timeline-connector',
  'timeline-content',
  'timeline-time',
  'stepper',
  'step',
  'step-indicator',
  'step-title',
  'step-description',
  'stat-group',
  'stat',
  'stat-label',
  'stat-value',
  'stat-delta',
  'item',
  'item-media',
  'item-content',
  'item-title',
  'item-description',
  'item-actions',
  'description-list',
  'description-term',
  'description-detail',
  'figure',
  'fig-caption',
  'code-block',
  'inline-code',
  'link',
  'output',
  'meter',
  'callout',
  'callout-title',
  'callout-content',
  'banner',
  'banner-action',
  'tag',
  'tag-remove',
  'rating',
  'navbar',
  'navbar-brand',
  'navbar-nav',
  'navbar-link',
  'footer',
  'footer-nav',
  'footer-copyright',
  'hero',
  'hero-title',
  'hero-subtitle',
  'hero-actions',
  'section-header',
  'section-title',
  'section-description',
  'bubble-group',
  'bubble',
  'message',
  'message-avatar',
  'message-body',
  'message-meta',
  'message-time',
  'message-status',
  'message-scroller',
  'attachment',
  'attachment-icon',
  'attachment-name',
  'attachment-size',
  'attachment-remove',
  'marker',
  'direction',
  'questionnaire',
  'questionnaire-item',
  'question-text',
  'question-hint',
  'sidebar-layout',
  'sidebar',
  'sidebar-header',
  'sidebar-content',
  'sidebar-footer',
  'sidebar-group',
  'sidebar-group-label',
  'sidebar-menu',
  'sidebar-menu-item',
  'sidebar-menu-button',
  'sidebar-trigger',
  'nav-menu',
  'nav-menu-list',
  'nav-menu-item',
  'nav-menu-link',
  'resizable-group',
  'resizable-panel',
  'resizable-handle',
  'otp-group',
  'otp-slot',
  'sort-header',
  'empty-icon',
  'card-action',
  'dialog-close',
  'avatar-group',
];

describe('Mega-wave families', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders every slot seam', async () => {
    const { el } = await render();
    for (const slot of ALL_SLOTS) {
      expect(el.querySelector(`[data-slot="${slot}"]`), slot).toBeTruthy();
    }
  });

  it('sidebar trigger toggles collapse and reflects aria-expanded', async () => {
    const { fixture, el } = await render();
    const sidebar = el.querySelector('[data-slot="sidebar"]');
    const trigger = el.querySelector<HTMLButtonElement>('[data-slot="sidebar-trigger"]');
    expect(sidebar?.getAttribute('data-collapsed')).toBe('false');
    trigger?.click();
    await fixture.whenStable();
    expect(sidebar?.getAttribute('data-collapsed')).toBe('true');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('sort header cycles aria-sort none → ascending → descending', async () => {
    const { fixture, el } = await render();
    const th = el.querySelector<HTMLElement>('[data-slot="sort-header"]');
    expect(th?.getAttribute('aria-sort')).toBe('none');
    th?.click();
    await fixture.whenStable();
    expect(th?.getAttribute('aria-sort')).toBe('ascending');
    th?.click();
    await fixture.whenStable();
    expect(th?.getAttribute('aria-sort')).toBe('descending');
  });

  it('OTP advances focus on input and distributes a pasted code', async () => {
    const { el } = await render();
    const slots = [...el.querySelectorAll<HTMLInputElement>('[data-slot="otp-slot"]')];
    slots[0].focus();
    slots[0].value = '1';
    slots[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.activeElement).toBe(slots[1]);

    const paste = new Event('paste', { bubbles: true }) as ClipboardEvent;
    Object.defineProperty(paste, 'clipboardData', {
      value: { getData: () => '987' },
    });
    slots[0].dispatchEvent(paste);
    expect(slots.map((slot) => slot.value)).toEqual(['9', '8', '7']);
  });

  it('resizable handle nudges the previous panel with arrow keys', async () => {
    const { el } = await render();
    const handle = el.querySelector<HTMLElement>('[data-slot="resizable-handle"]');
    const panel = el.querySelector<HTMLElement>('[data-slot="resizable-panel"]');
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(panel?.style.width).toBe('96px');
  });

  it('rating exposes its value as an accessible label, stars hidden', async () => {
    const { el } = await render();
    const rating = el.querySelector('[data-slot="rating"]');
    expect(rating?.getAttribute('role')).toBe('img');
    expect(rating?.getAttribute('aria-label')).toBe('4 out of 5');
    expect(rating?.querySelectorAll('[aria-hidden="true"]').length).toBe(5);
  });

  it('message scroller renders and exposes scrollToBottom', async () => {
    const { el } = await render();
    expect(el.querySelector('[data-slot="message-scroller"]')).toBeTruthy();
    expect(typeof MessageScroller.prototype.scrollToBottom).toBe('function');
  });
});
