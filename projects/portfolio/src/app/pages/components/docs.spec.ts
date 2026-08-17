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
    expect(nav?.querySelectorAll('a').length).toBe(13);
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
    // Scoped to the page's own tabs demo: an ExampleBox further down the page
    // renders its own aria tabs (data-slot="tab"/"tab-panel"), so unscoped
    // queries would over-match across both compositions.
    const tabsSection = compiled.querySelector<HTMLElement>('section[aria-labelledby="tabs-h"]');
    if (!tabsSection) throw new Error('No tabs section');

    const tabs = tabsSection.querySelectorAll<HTMLElement>('[data-slot="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    tabs[1].click();
    await fixture.whenStable();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    const panels = [...tabsSection.querySelectorAll<HTMLElement>('[data-slot="tab-panel"]')];
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

describe('DisclosureDoc — data-table recipe', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(DisclosureDoc);
    await fixture.whenStable();
    const section = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      'section[aria-labelledby="dt-h"]',
    );
    if (!section) throw new Error('No data-table section');
    return { fixture, section };
  };
  const firstNameCell = (section: HTMLElement) =>
    section.querySelector('tbody tr td:nth-child(2)')?.textContent?.trim();

  it('sorts by name through the header button', async () => {
    const { fixture, section } = await render();
    expect(firstNameCell(section)).toBe('skyblock-prod'); // insertion order

    const nameSort = section.querySelector<HTMLElement>('[data-slot="sort-button"]');
    nameSort?.click();
    await fixture.whenStable();
    expect(firstNameCell(section)).toBe('creative-flat'); // ascending

    nameSort?.click();
    await fixture.whenStable();
    expect(firstNameCell(section)).toBe('zomboid-main'); // descending
  });

  it('filtering narrows the rows and resets the page', async () => {
    const { fixture, section } = await render();
    const pageInfo = () => section.querySelector('[data-slot="dt-page"]')?.textContent;
    const next = [...section.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Next'),
    );
    next?.click();
    await fixture.whenStable();
    expect(pageInfo()).toContain('Page 2');

    const input = section.querySelector<HTMLInputElement>('input[type="search"]');
    if (!input) throw new Error('No filter input');
    input.value = 'zomboid';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(pageInfo()).toContain('Page 1');
    expect(section.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('select-all goes indeterminate on a partial page selection', async () => {
    const { fixture, section } = await render();
    const header = section.querySelector<HTMLInputElement>('thead input[type="checkbox"]');
    const firstRow = section.querySelector<HTMLInputElement>('tbody input[type="checkbox"]');
    if (!header || !firstRow) throw new Error('Missing checkboxes');

    firstRow.click();
    await fixture.whenStable();
    expect(section.querySelector('[data-slot="dt-selected"]')?.textContent).toContain('1 selected');
    expect(header.indeterminate).toBe(true);

    header.click();
    await fixture.whenStable();
    expect(section.querySelector('[data-slot="dt-selected"]')?.textContent).toContain('5 selected');
    expect(header.indeterminate).toBe(false);
    expect(header.checked).toBe(true);
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
    const example = compiled.querySelector('[data-slot="example-code"]');
    expect(example?.querySelector('[data-slot="code-block"]')?.textContent).toContain('xnCard');
    expect(example?.querySelector('[data-slot="copy-button"]')).toBeTruthy();
    expect(compiled.querySelector('[data-slot="example-preview"] [data-slot="card"]')).toBeTruthy();
  });
});

describe('ExampleBox — code flavors', () => {
  it('shows the first flavor by default and switches on tab click', async () => {
    const fixture = TestBed.createComponent(ButtonsDoc);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const box = compiled.querySelector('section[aria-label="Button example"]');
    if (!box) throw new Error('No example box');

    const tabs = [...box.querySelectorAll<HTMLElement>('[data-slot="tab"]')];
    expect(tabs.map((t) => t.textContent?.trim())).toEqual(['Angular', 'TypeScript', 'Plain HTML']);
    expect(box.querySelector('[data-slot="code-block"]')?.textContent).toContain('xnButton');

    tabs[2].click();
    await fixture.whenStable();
    const visiblePanel = [...box.querySelectorAll<HTMLElement>('[data-slot="tab-panel"]')].find(
      (p) => !p.hasAttribute('inert'),
    );
    // The Plain HTML flavor is generated from buttonVariants() itself.
    expect(visiblePanel?.textContent).toContain('bg-success');
    expect(visiblePanel?.querySelector('[data-slot="copy-button"]')).toBeTruthy();
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
