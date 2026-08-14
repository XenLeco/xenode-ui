import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MessageScroller } from './chat';

@Component({
  imports: [MessageScroller],
  template: `
    <div xnMessageScroller>
      <p>one</p>
    </div>
  `,
})
class Host {
  readonly scroller = viewChild.required(MessageScroller);
}

/**
 * jsdom has no layout, so geometry is mocked: the tests exercise the
 * follow/hold state machine, not real scrolling. The browser demo on the
 * Chat docs page is the geometry check.
 */
describe('MessageScroller', () => {
  const setup = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="message-scroller"]',
    );
    if (!el) throw new Error('No scroller element');
    const scrollTo = vi.fn();
    el.scrollTo = scrollTo as never;
    Object.defineProperty(el, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
    return { fixture, el, scrollTo, settle, scroller: fixture.componentInstance.scroller() };
  };

  it('starts at the live edge and follows content growth instantly', async () => {
    const { el, scrollTo, settle, scroller } = await setup();
    expect(scroller.atLiveEdge()).toBe(true);

    el.appendChild(document.createElement('p'));
    await settle();
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'instant' });
  });

  it('scrolling away holds the stream; content growth no longer moves it', async () => {
    const { el, scrollTo, settle, scroller } = await setup();
    el.scrollTop = 0; // 500 - 0 - 100 = 400 from the bottom — reading history
    el.dispatchEvent(new Event('scroll'));
    expect(scroller.atLiveEdge()).toBe(false);

    el.appendChild(document.createElement('p'));
    await settle();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('returning within the threshold re-arms following', async () => {
    const { el, scroller } = await setup();
    el.scrollTop = 0;
    el.dispatchEvent(new Event('scroll'));
    expect(scroller.atLiveEdge()).toBe(false);

    el.scrollTop = 360; // 500 - 360 - 100 = 40 ≤ default threshold 48
    el.dispatchEvent(new Event('scroll'));
    expect(scroller.atLiveEdge()).toBe(true);
  });

  it('scrollToBottom jumps smoothly and re-pins the live edge', async () => {
    const { el, scrollTo, scroller } = await setup();
    el.scrollTop = 0;
    el.dispatchEvent(new Event('scroll'));

    scroller.scrollToBottom();
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
    expect(scroller.atLiveEdge()).toBe(true);
  });
});
