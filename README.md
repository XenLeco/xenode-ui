# xenode-ui

<!-- badge row — OWNER filled in when the GitHub repo exists -->

[![CI](https://github.com/OWNER/xenode-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/xenode-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A shadcn-style component library for Angular 22 + Tailwind CSS v4, and the
personal site that consumes it. One workspace, so every component always has a
real consumer.

| Project      | Path                 | What it is                                                                                          |
| ------------ | -------------------- | --------------------------------------------------------------------------------------------------- |
| `@xenode/ui` | `projects/ui`        | The component library: utility-class components on native elements, shadcn-compatible design tokens |
| `portfolio`  | `projects/portfolio` | danleco.dev — prerendered static site, deployed to Cloudflare Workers                               |

**Stack:** Angular 22 (signals, zoneless), Tailwind CSS 4 (CSS-first `@theme`
tokens, dark mode via `.dark` class), Vitest, prerendered to static files.

## Status

Early, building in public. Working today: light/dark design tokens locked to
WCAG AA by a contrast test that runs in CI, three-state theme switching under
a strict hash-based CSP, and **201 components across 60+ families**: the shadcn core
(button, badge, card, label, input, textarea, alert, separator, skeleton,
kbd, table, breadcrumb, avatar, progress, spinner, aspect-ratio, typography,
empty, button group, input group, field, pagination), behavior composed
beside `@angular/aria` (tabs, accordion), native-platform controls
(checkbox, radio group, switch, slider, native select, toggle, collapsible
on details/summary, dialog on the native element), and overlay pieces
(toast, tooltip/popover/hover-card on CDK Overlay, alert-dialog/sheet/drawer
on the native dialog, dropdown-menu on `@angular/aria`'s menu, scroll-area,
scroll-snap carousel) — all on a live showcase at `/components` generated
from the same variants objects the components use.

<!-- demo GIF slot -->

## Getting started

```bash
npm ci
npm start
```

| Command                   | What it does                              |
| ------------------------- | ----------------------------------------- |
| `npm start`               | Dev server for the portfolio              |
| `npm test`                | Unit tests for both projects (Vitest)     |
| `npm run lint`            | ESLint (including Angular template rules) |
| `npm run build:portfolio` | Prerendered production build              |

## Notes

The workspace maps `@xenode/ui` to the library **source**, not build output,
so the portfolio picks up library changes live during development. This moves
to `dist/` only if the library is ever published.

## License

[MIT](LICENSE)
