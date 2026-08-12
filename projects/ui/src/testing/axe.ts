import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe and fails the test on any violation. The color-contrast rule is
 * disabled deliberately: under jsdom axe cannot compute contrast and reports
 * false PASSES, which is worse than no result. Contrast is enforced for real
 * by theme-contrast.spec.ts (culori). Automation catches roughly half of
 * accessibility issues — the manual checklists in docs/a11y/ cover the rest.
 */
export async function expectAxeClean(root: Element): Promise<void> {
  const results = await axe.run(root, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results.violations).toEqual([]);
}
