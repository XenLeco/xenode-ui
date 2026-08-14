import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { badgeVariantConfig, buttonVariantConfig } from '@xenode/ui';

import { Components } from './components';
import { BlocksDoc } from './docs/blocks';
import { ButtonsDoc } from './docs/buttons';
import { FormsDoc } from './docs/forms';
import { MotionDoc } from './docs/motion';
import { DisclosureDoc } from './docs/disclosure';
import { DisplayDoc } from './docs/display';
import { FeedbackDoc } from './docs/feedback';
import { NavigationDoc } from './docs/navigation';
import { Overview } from './docs/overview';

describe('Docs shell', () => {
  it('renders the category nav with a link per page', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Components);
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Component docs');
    expect(nav?.querySelectorAll('a').length).toBe(12);
    expect(nav?.querySelector('[data-slot="docs-version"]')?.textContent).toContain('v0.1.0');
  });
});

describe('Overview', () => {
  it('links every category as a card', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Overview);
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a [data-slot="card"]').length,
    ).toBe(9);
  });
});

describe('ButtonsDoc', () => {
  it('renders one button per variant/size combination from the shared config', async () => {
    const fixture = TestBed.createComponent(ButtonsDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const variantCount = Object.keys(buttonVariantConfig.variants.variant).length;
    const sizeCount = Object.keys(buttonVariantConfig.variants.size).length;
    const matrix = compiled.querySelectorAll(
      'section[aria-labelledby="button-heading"] button[data-slot="button"]',
    );
    expect(matrix.length).toBe(variantCount * sizeCount + 3);

    for (const button of compiled.querySelectorAll<HTMLButtonElement>(
      'button[data-slot="button"]',
    )) {
      const name = button.textContent?.trim() || button.getAttribute('aria-label');
      expect(name, 'button without accessible name').toBeTruthy();
    }
  });
});

describe('DisplayDoc', () => {
  it('renders the badge matrix from the shared config', async () => {
    const fixture = TestBed.createComponent(DisplayDoc);
    await fixture.whenStable();
    const badgeCount = Object.keys(badgeVariantConfig.variants.variant).length;
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('span[data-slot="badge"]').length,
    ).toBeGreaterThanOrEqual(badgeCount);
  });
});

describe('NavigationDoc — aria tabs composition', () => {
  it('clicking a tab switches panels and aria-selected', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(NavigationDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const tabs = compiled.querySelectorAll<HTMLElement>('[data-slot="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    tabs[1].click();
    await fixture.whenStable();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    const panels = [...compiled.querySelectorAll<HTMLElement>('[data-slot="tab-panel"]')];
    expect(panels.filter((p) => p.hasAttribute('inert')).length).toBe(2);
  });
});

describe('DisclosureDoc — aria accordion composition', () => {
  it('expand toggles inert on the panel', async () => {
    const fixture = TestBed.createComponent(DisclosureDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector<HTMLElement>('[data-slot="accordion-trigger"]');
    const panel = compiled.querySelector<HTMLElement>('[data-slot="accordion-panel"]');
    expect(panel?.hasAttribute('inert')).toBe(true);

    trigger?.click();
    await fixture.whenStable();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(panel?.hasAttribute('inert')).toBe(false);
  });
});

describe('FormsDoc — aria combobox composition', () => {
  it('typing filters options and selecting one updates the value', async () => {
    const fixture = TestBed.createComponent(FormsDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector<HTMLInputElement>('#f-game-search');
    if (!input) throw new Error('No combobox input');

    input.focus();
    input.value = 'zomb';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    const options = compiled.querySelectorAll<HTMLElement>('[data-slot="listbox-option"]');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Project Zomboid');

    options[0].click();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Selected: Project Zomboid');
  });
});

describe('BlocksDoc', () => {
  it('renders composed blocks with a copyable snippet', async () => {
    const fixture = TestBed.createComponent(BlocksDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(3);
    const snippet = compiled.querySelector('[data-slot="code-snippet"]');
    expect(snippet?.querySelector('[data-slot="code-block"]')?.textContent).toContain('xnCard');
    expect(snippet?.querySelector('[data-slot="copy-button"]')).toBeTruthy();
  });
});

describe('MotionDoc', () => {
  it('renders one tile per motion preset and the reduced-motion note', async () => {
    const fixture = TestBed.createComponent(MotionDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.animate-fade-in-up')).toBeTruthy();
    expect(compiled.querySelector('.animate-slide-in-right')).toBeTruthy();
    expect(compiled.textContent).toContain('prefers-reduced-motion');
  });
});

describe('FeedbackDoc — toast wiring', () => {
  it('the toast buttons exist with accessible names', async () => {
    const fixture = TestBed.createComponent(FeedbackDoc);
    await fixture.whenStable();
    const buttons = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];
    expect(buttons.some((b) => b.textContent?.includes('Show toast'))).toBe(true);
  });
});
