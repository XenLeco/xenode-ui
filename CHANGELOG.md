# Changelog

All notable changes to `@xenode/ui`. Format follows
[Keep a Changelog](https://keepachangelog.com); versioning is semver, with
the version mirrored in `projects/ui/src/lib/version.ts` (`XN_UI_VERSION`)
and shown in the docs shell.

## [Unreleased]

### Added

- Select (aria's non-editable combobox + `xnSelectTrigger`) and a command
  palette composition (dialog + combobox; `selectionMode="explicit"` — the
  follow-focus default auto-selected while typing).
- Page-scaffold family (`xnContainer`, `xnPageLayout`, `xnPageHeader`,
  `xnPageMain`, `xnPageSection`) and a full-page Layout docs composition.
- Bento family (grid, sized tiles, title/description) with staggered rises.
- Motion vocabulary: easing tokens (`--ease-out-expo`, `--ease-fluid`,
  `--ease-snappy`) and use-case presets (blur-in, fade-in-down, rise, pop,
  shake); `::selection` polish.
- ExampleBox docs pattern: boxed live previews with multi-flavor code tabs
  (Angular / TypeScript / Plain HTML — the HTML flavor generated from the
  variants function itself), now on every docs page (nine more pages:
  forms, display, disclosure, navigation, overlays, typography, chat,
  motion, layout).

### Fixed

- Seven of the ten Motion-page presets never animated: tile classes were
  built at runtime (`'animate-' + name`), which Tailwind's scanner cannot
  see, so those utilities were never emitted. Preset class names are now
  literal strings in source — the rule generalizes: dynamic class
  construction silently defeats Tailwind.

### Changed

- Overlay motion smoothed: dialogs fade+scale on expo with blurred
  backdrop, sheets/drawers on the fluid curve, menus/popovers on expo,
  tooltips snappy, toasts rise; Motion-page demos slowed 3x for inspection.

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
