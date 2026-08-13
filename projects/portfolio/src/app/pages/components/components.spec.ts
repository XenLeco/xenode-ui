import { TestBed } from '@angular/core/testing';

import { badgeVariantConfig, buttonVariantConfig } from '@xenode/ui';

import { Components } from './components';

describe('Components', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Components],
    }).compileComponents();
  });

  it('renders one button per variant/size combination from the shared config, plus the demos', async () => {
    const fixture = TestBed.createComponent(Components);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const variantCount = Object.keys(buttonVariantConfig.variants.variant).length;
    const sizeCount = Object.keys(buttonVariantConfig.variants.size).length;
    const buttons = compiled.querySelectorAll(
      'section[aria-labelledby="button-heading"] button[data-slot="button"]',
    );
    expect(buttons.length).toBe(variantCount * sizeCount + 2);
  });

  it('renders one badge per variant from the shared config, plus the override demo', async () => {
    const fixture = TestBed.createComponent(Components);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const badgeCount = Object.keys(badgeVariantConfig.variants.variant).length;
    expect(
      compiled.querySelectorAll('section[aria-labelledby="badge-heading"] span[data-slot="badge"]')
        .length,
    ).toBe(badgeCount + 1);
  });

  it('composes @angular/aria tabs with the styling layer: clicking switches panels', async () => {
    const fixture = TestBed.createComponent(Components);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const tabs = compiled.querySelectorAll<HTMLElement>('[data-slot="tab"]');
    const panels = () => [...compiled.querySelectorAll<HTMLElement>('[data-slot="tab-panel"]')];
    expect(tabs.length).toBe(3);

    // Initial state: first tab selected, the other panels are inert.
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(panels().filter((p) => p.hasAttribute('inert')).length).toBe(2);

    tabs[1].click();
    await fixture.whenStable();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    const styling = panels().find((p) => p.textContent?.includes('aria-selected'));
    expect(styling?.hasAttribute('inert')).toBe(false);
  });

  it('gives every rendered button an accessible name', async () => {
    const fixture = TestBed.createComponent(Components);
    await fixture.whenStable();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      'button[data-slot="button"]',
    );
    for (const button of buttons) {
      const name = button.textContent?.trim() || button.getAttribute('aria-label');
      expect(name, 'button without text or aria-label').toBeTruthy();
    }
  });
});
