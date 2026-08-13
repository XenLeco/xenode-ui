import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XN_ACCORDION } from './accordion';

/**
 * Styling seam only — keyboard behavior and aria wiring belong to
 * @angular/aria and are covered where the layers compose (showcase spec).
 */

@Component({
  imports: [XN_ACCORDION],
  template: `
    <div xnAccordion>
      <div xnAccordionItem>
        <button xnAccordionTrigger aria-expanded="true">One <span data-chevron>⌄</span></button>
        <div xnAccordionPanel>Open content</div>
      </div>
      <div xnAccordionItem class="border-b-4">
        <button xnAccordionTrigger aria-expanded="false">Two</button>
        <div xnAccordionPanel inert>Hidden content</div>
      </div>
    </div>
  `,
})
class Host {}

describe('Accordion styling family', () => {
  it('renders slots, chevron rotation seam and inert hiding', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-slot="accordion"]')).toBeTruthy();
    const trigger = compiled.querySelector('[data-slot="accordion-trigger"]');
    expect(trigger?.classList).toContain('[&[aria-expanded=true]>[data-chevron]]:rotate-180');
    const panels = compiled.querySelectorAll<HTMLElement>('[data-slot="accordion-panel"]');
    expect(panels[0].classList).toContain('[&[inert]]:hidden');
    expect(panels[1].hasAttribute('inert')).toBe(true);
  });

  it("merges the consumer's class last on items", async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="accordion-item"]',
    );
    expect(items[1].classList).toContain('border-b-4');
    expect(items[1].classList).not.toContain('border-b');
  });
});
