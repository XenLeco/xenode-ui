# Changelog

All notable changes to `@xenode/ui`. Format follows
[Keep a Changelog](https://keepachangelog.com); versioning is semver, with
the version mirrored in `projects/ui/src/lib/version.ts` (`XN_UI_VERSION`)
and shown in the docs shell.

## [0.1.0] — 2026-08-14

First versioned cut: 227 components across 75+ families.

### Added

- Design tokens in oklch with WCAG-AA contrast locked by a culori test
  (light + dark), including on-demand semantic pairs: `--danger`, and
  success/warning/info as surface + foreground + text-tuned triples.
- Three-state dark mode (no key = dark) behind a CSP-hashed inline script.
- Core families: button, badge, card, label, input, textarea, tabs,
  accordion (both composed beside `@angular/aria`), alert, separator,
  skeleton, kbd, table, breadcrumb, avatar, progress, and the rest of the
  shadcn catalog including its chat set.
- Native-platform behavior wherever it exists: dialog/alert-dialog/sheet/
  drawer on `<dialog>`, collapsible on `<details>`, checkbox/radio/switch/
  slider/select on native inputs, segmented control on `:has(:checked)`.
- CDK overlay tier: tooltip, popover, hover-card; aria compositions:
  dropdown menu, combobox; toast service with a polite live region.
- Catalog-parity wave (Bootstrap/daisyUI/Mantine scan): list-group,
  indicator, radial-progress, mockups (window/terminal/diff), segmented,
  dropzone, scrollspy, copy-button, password-input, file-input,
  floating-label, spoiler, mark, and more.
- Entrance animations on the overlay tier via `@starting-style` +
  `transition-discrete`, and named motion presets (`animate-fade-in-up`
  et al.) with a global `prefers-reduced-motion` collapse.
- Multi-page docs at `/components` with per-category lazy routes, variant
  matrices generated from the components' own config objects, and
  copy-paste code sections.

### Known limits

- Calendar/date-picker, full data-table, chart and panel navigation-menu
  are scoped for later releases (see CLAUDE.md active-work notes).
