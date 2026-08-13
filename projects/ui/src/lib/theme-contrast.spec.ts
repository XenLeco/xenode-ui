import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { formatHex, parse, rgb, wcagContrast, type Rgb } from 'culori';

/**
 * Locks the design tokens to WCAG 2.2 AA. Runs on every token change, which
 * is the whole point: a palette tweak that breaks contrast fails CI instead
 * of shipping. jsdom axe runs cannot cover this — axe's color-contrast rule
 * silently passes everything without real rendering.
 *
 * SC 1.4.3: text needs 4.5:1. SC 1.4.11: non-text UI boundaries and focus
 * indicators need 3:1. --border is exempt as decorative-only by design;
 * anything functional must use --input or --ring.
 */

const css = readFileSync(join(process.cwd(), 'projects/ui/theme.css'), 'utf8');

type Tokens = Record<string, string>;

const block = (selector: string): Tokens => {
  const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`No ${selector} block found in theme.css`);
  const tokens: Tokens = {};
  for (const [, name, value] of match[1].matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
};

const light = block(':root');
const dark = block('\\.dark');

// Browsers composite translucent colors in gamma-encoded sRGB per channel;
// contrast must be measured on the color the user actually sees.
const compositeOver = (fgCss: string, bgCss: string): Rgb => {
  const fg = rgb(parse(fgCss));
  const bg = rgb(parse(bgCss));
  if (!fg || !bg) throw new Error(`Unparseable color: ${fgCss} / ${bgCss}`);
  const alpha = fg.alpha ?? 1;
  if (alpha === 1) return fg;
  return {
    mode: 'rgb',
    r: alpha * fg.r + (1 - alpha) * bg.r,
    g: alpha * fg.g + (1 - alpha) * bg.g,
    b: alpha * fg.b + (1 - alpha) * bg.b,
  };
};

const TEXT_PAIRS: readonly (readonly [string, string])[] = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['muted-foreground', 'muted'],
  ['muted-foreground', 'background'],
  ['accent-foreground', 'accent'],
  ['destructive-foreground', 'destructive'],
  ['danger', 'background'],
  ['danger', 'card'],
  ['success-foreground', 'success'],
  ['warning-foreground', 'warning'],
  ['info-foreground', 'info'],
  ['success-text', 'background'],
  ['warning-text', 'background'],
  ['info-text', 'background'],
];

const NON_TEXT_PAIRS: readonly (readonly [string, string])[] = [
  ['ring', 'background'],
  ['input', 'background'],
];

describe('theme.css WCAG contrast', () => {
  it('declares the same tokens in both modes (radius is root-only)', () => {
    const lightNames = Object.keys(light).filter((name) => name !== 'radius');
    expect(Object.keys(dark).sort()).toEqual(lightNames.sort());
  });

  for (const [modeName, tokens] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    describe(`${modeName} mode`, () => {
      const resolve = (name: string): string => {
        const value = tokens[name];
        if (!value) throw new Error(`Token --${name} missing in ${modeName} mode`);
        return value;
      };
      const contrast = (fgName: string, bgName: string): number => {
        const bg = compositeOver(resolve(bgName), resolve('background'));
        const fg = compositeOver(resolve(fgName), formatHex(bg));
        return wcagContrast(fg, bg);
      };

      for (const [fg, bg] of TEXT_PAIRS) {
        it(`text: --${fg} on --${bg} ≥ 4.5:1`, () => {
          expect(contrast(fg, bg), `--${fg} on --${bg}`).toBeGreaterThanOrEqual(4.5);
        });
      }

      for (const [fg, bg] of NON_TEXT_PAIRS) {
        it(`non-text: --${fg} on --${bg} ≥ 3:1`, () => {
          expect(contrast(fg, bg), `--${fg} on --${bg}`).toBeGreaterThanOrEqual(3);
        });
      }
    });
  }
});
