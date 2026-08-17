# xenode-ui

[![CI](https://github.com/XenLeco/xenode-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/XenLeco/xenode-ui/actions/workflows/ci.yml)
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

Building in public. The catalog is complete — parity-checked against live
shadcn/ui, Bootstrap 5.3 and daisyUI 5.7: **263 components across ~91
families**, every wave adversarially reviewed. Working today: light/dark
design tokens locked to WCAG AA by a contrast test that runs in CI,
three-state theme switching under a strict hash-based CSP, the shadcn core,
behavior composed beside `@angular/aria` (tabs, accordion, dropdown-menu,
combobox, and a calendar on the grid primitive), native-platform controls
(checkbox, radio group, switch, slider, native select, collapsible on
details/summary, dialog and its derivatives on the native element), overlay
floats on CDK Overlay (tooltip, popover, hover-card), APG disclosure nav
panels, a signals-based data-table recipe, and charts as a composition —
ngx-charts renders, the library ships only design tokens and a `ChartCard`
bridge. All of it on a live docs site at `/components`, generated from the
same variants objects the components use.

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
