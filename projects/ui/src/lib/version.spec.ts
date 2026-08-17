import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { XN_UI_VERSION } from './version';

describe('XN_UI_VERSION', () => {
  // The release ritual claims the constant mirrors the package version;
  // a claim without a test drifts, so the mirror is law.
  it('mirrors projects/ui/package.json', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'projects/ui/package.json'), 'utf8'),
    ) as { version: string };
    expect(XN_UI_VERSION).toBe(pkg.version);
  });
});
