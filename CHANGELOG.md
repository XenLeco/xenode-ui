# Changelog

All notable changes to `@xenode/ui`. Format follows
[Keep a Changelog](https://keepachangelog.com); versioning is semver, with
the version mirrored in `projects/ui/src/lib/version.ts` (`XN_UI_VERSION`)
and shown in the docs shell.

## [Unreleased]

### Added

- Docs ⌘K search palette: Ctrl/⌘K, the sidebar Search button, or a pill
  in the phone nav opens a command palette over every docs page and
  section — the library's own dialog + combobox composition, with
  xn-highlight painting the match. The hand-maintained index cannot
  drift: a spec renders every docs page and asserts each entry resolves
  to that page's own rendered h2 (id, exact text, not buried in a closed
  dialog or inert panel); selection navigates by router fragment.
  Escape layers: first press closes the result list, second closes the
  dialog (platform behavior — on the manual checklist with focus
  restore, in docs/a11y/search-palette.md).

### Fixed

- Every composed combobox ran its popup listbox in the roving-tabindex
  DEFAULT, under which the aria pattern intentionally reports NO
  active-descendant id — roving moves focus, but a combobox keeps focus
  on the input, so aria-activedescendant stayed permanently null and
  arrow-key navigation was SILENT for screen readers. Visual navigation
  and click selection worked, which is why it survived every demo.
  `focusMode="activedescendant"` on all four composition sites (palette,
  command demo, game search, custom select) and in the recipe comment,
  pinned by a spec that arrows and asserts the id lands on the input and
  names the active option.
- The keyboard highlight was invisible on top of being silent:
  XnListboxOption styled only focus/hover/selection, and in
  activedescendant mode the option never receives focus —
  data-[active=true] now paints the same accent as focus (now pinned by
  a class-string spec: the attribute is written by aria, so a behavior
  test stays green even with the styling deleted).

### Fixed (palette review)

- The modal palette had no pointer/touch exit: on-screen keyboards have
  no Escape, so a phone user was trapped until they selected something.
  A ✕ close button is the guaranteed exit; `closedby="any"` adds
  backdrop light-dismiss where supported (also on the command demo).
- A pointer selection left the combobox expanded forever — focus moved
  INTO the popup, so the input's focusout never collapsed it — and the
  surviving listbox re-opened announcing the stale active row. The
  dialog's (close) now collapses the combobox, so every reopen presents
  the keyboard path's fresh state.
- Escape with real focus inside the popup (Tab, or a tap that focused an
  option) reached the dialog unconsumed and closed everything in one
  press. The popup consumes it, refocuses the input, and closes only the
  list — the documented two-step layering now holds from both places.
- Selecting the entry for the current URL did nothing: the router skips
  same-URL navigations, so no Scroll event ever fired — goTo now scrolls
  by hand when navigation reports skipped. (The docs.spec navigation
  test mocked router.navigate and could not see this.)
- Ctrl/⌘K while the palette is open now toggles it closed instead of
  silently wiping the typed query; Ctrl+K is no longer bound on macOS
  (kill-line), and the hint renders per platform.
- Zero results announced nothing while aria-activedescendant silently
  vanished — a visually-hidden role=status now reads "N results"/"No
  matches"; the empty-state div also moved OUT of the listbox element
  (role=listbox permits only option/group children) via a panel/listbox
  split at all three composition sites.
- The drift guarantee was one-directional (proven with a planted
  unindexed h2 that every suite missed): the index spec now also
  harvests each page's rendered h2 set and requires it to equal the
  indexed anchors — sections get added far more often than deleted.
  Plus: a key-uniqueness assertion, and zero-section pages now render in
  the suite instead of being skipped.
- Typeahead on the custom select was dead (pre-existing): the aria
  option's search term comes ONLY from its label input, which no site
  passed — the region options now carry [label].
- Recording the README demo GIF (real Chrome, real keys) caught what
  static review and value-assignment tests both missed: the review's ✕
  button had become the dialog's FIRST focusable, so showModal() focused
  it instead of the input and typing landed nowhere — the input now
  carries autofocus. The overview page also claimed a stale "201
  components across 60+ families"; it says 263/~91 like the README.

## [0.2.0] — 2026-08-17

The catalog cut: 263 components across ~91 families — parity-complete
against live shadcn/ui, Bootstrap 5.3 and daisyUI 5.7. First public push.

### Fixed (first CI run)

- The overlay specs were green by worker-assignment luck: the runner may
  execute several spec files sequentially in ONE worker's shared jsdom
  document, and on the two-core CI machine the tooltip files landed
  together — a leaked TooltipContent fixture host from one file (bare
  `id=""`, outside any overlay container) failed the other's "tooltip is
  absent" assertions. The cleanup idiom compounded it by removing only
  the FIRST `.cdk-overlay-container`, stranding the newest. All four
  overlay specs (tooltip ×2, popover, hover-card) now purge EVERY
  container in both beforeEach and afterEach (shared
  `testing/overlay.ts`) and scope panel queries under
  `.cdk-overlay-container` — a document-global [data-slot] query can
  match a neighboring file's leak that no container cleanup reaches.

### Fixed (charts review)

- The ChartsDoc smoke test could not fail: jsdom has no
  IntersectionObserver, so the viewport defer pinned on its placeholder
  with a swallowed error while the assertions only touched elements
  outside the block. Rewritten with manual defer control — it now mounts
  the real engine, and immediately caught a real integration gap
  (missing animation providers) on its first honest run.
- Brand law restored: the CSS reduced-motion collapse cannot reach a
  chart engine's Web Animations and d3 transitions — ChartCard now
  exposes `animations()` (live `prefers-reduced-motion`) and the docs
  bind it to every chart's `[animations]`.
- The bridge observes the ANCESTOR chain, not just documentElement (our
  own dark variant matches subtree `.dark` wrappers), plus
  `prefers-color-scheme` changes; unchanged resolutions no longer create
  a new scheme identity (every html-class mutation was forcing a full
  chart redraw); alpha survives the oklch converter as 8-digit hex; a
  public `refresh()` covers out-of-band token mutations.
- Charts size to the card's CONTENT box via an inner wrapper (the engine
  measures its parent's border-box — axis labels were rendered into the
  clipped padding zone), with overflow-hidden as the frame's backstop.
- A per-bundle `"any"` budget (300kB warn) now watches lazy chunks — the
  229kB charts chunk was invisible to the initial-only budgets; docs
  prose no longer implies @defer code-splits module components.
  `@angular/ssr` pinned exact, completing the family-pin invariant the
  changelog claimed. Known upstream limit: ngx-charts tooltip placement
  flips lag one CD under zoneless (bare setTimeout, no markForCheck).

### Added (charts — the final catalog gap)

- Charts as a composition: ngx-charts@25.0.0 (pinned exact; 25.0.1 was
  3 days old — the cooldown convention, same as aria) renders, the
  library ships the frame and the palette with ZERO chart imports.
  `--chart-1..5` tokens in both modes, each ≥3:1 against its background
  and locked into the contrast law (which grew digit support: the token
  parser's `[a-z-]` name pattern silently dropped `--chart-1` from the
  law entirely — a green suite hiding five unmeasured colors).
- `xnChartCard`: a labelled figure that tokens the chart chrome (axis
  text, gridlines) via CSS and bridges the palette through `scheme()` —
  resolved at runtime by a probe element plus an IN-HOUSE oklch→hex
  converter (Ottosson matrices): modern engines serialize computed oklch
  AS oklch through every API including canvas fillStyle round-trips, and
  chart engines' d3-color cannot parse it. Re-resolves on `.dark` flips
  (MutationObserver); prerender serves a culori-drift-locked dark
  fallback. New Charts docs route (14th) with every chart in
  `@defer (on viewport)` — prerender ships placeholders, ngx-charts
  never executes server-side.
- The whole Angular runtime family is now pinned exact at 22.1.1
  (ngx-charts' platform-browser-dynamic peer kept floating individual
  members to the 4-day-old 22.1.2 — under the cooldown as a set).

### Fixed (parity sweep review)

- NumberField: blurring a cleared/garbage field now restores the rendered
  value — committing the unchanged model is a no-change signal write the
  [value] binding never re-renders, so the DOM is written back directly;
  Enter commits and clamps before a form can submit.
- Sheet: the base's `max-h-none` moved into the side branches —
  tailwind-merge does not classify it into the max-h group, so it
  coexisted with top's `max-h-[80dvh]` and won the cascade (a dead cap
  with a green test asserting the class exists).
- Focus never strands: dismissing a callout hands focus to the next
  tabbable after it; SpeedDial's close() restores focus to the trigger on
  every path including the documented action-handler close; tooltip
  Escape consumes the event only while visible (a wrapping dialog
  survives); ButtonGroup adopts Join's focus-within z-lift so a focused
  button's ring is never painted over by its -1px neighbor.
- Highlight matches on the ORIGINAL string via case-insensitive regex —
  toLowerCase can change string length ('İ' → 'i̇'), drifting every index
  computed on a lowered copy.
- RollingNumber gains an opt-in `announce` (role=status) so user-triggered
  values are heard, not just seen; SpeedDial wires aria-controls; the
  semicircle gauge scales with its host like the full ring; the image
  fallback indent is viewport-relative (200vw beats any box); the Join
  demo's select got its name.

### Added (parity sweep — 19 items from the reference gap scan)

- Forms: NumberInput (native number input, spinners hidden via
  appearance) + NumberField (stepper with aria-disabled boundary buttons
  and blur-time clamping), Chip (native checkbox in a pill,
  `:has(:checked)` state, alt-text checkmark), Image (fallback-to-muted
  on error, `fit` input, `exportAs` failed signal), InputColor (styled
  native picker well); indeterminate checkbox documented as the DOM
  property it is.
- Feedback/overlays: Toaster `position` input (four corners, entrance
  direction follows), Tooltip `showDelay` + surface-matched arrow,
  dismissible Callout (`xnCalloutDismiss`, purposeful DI error),
  RadialProgress `arc="semi"` gauge, Sheet `side="top"` (the Bootstrap
  offcanvas gap).
- Site/statics: Join (border-radius joining container), Dock + DockItem
  (bottom navigation, safe-area padded), Affix (corner-anchored
  fixed/absolute wrapper, style-binding escape hatch), Burger (one
  element, three CSS bars, animates to an X off aria-expanded),
  RollingNumber (digit strips, sr-only real value), Highlight (substring
  matches through the shared Mark styling), SpeedDial (NavPanels dismiss
  contract on a boolean), MockupPhone (frame for the Dock demo).
- Split button documented as a composition on the Buttons page — a
  button group joining the action to a menu trigger (menus are correct
  there: those are commands, the deliberate contrast with nav panels).

### Fixed (data-table review)

- Popovers with interactive content were keyboard-unreachable: the panel
  lives at the end of `<body>`, so Tab from the trigger walked the whole
  page before reaching it. Popover now moves focus to the panel's first
  focusable element on open (read-only panels are untouched — nothing to
  focus), and the panel carries the `role="dialog"` its trigger always
  advertised. Escape/focus-restore already worked.
- Sort direction is now visible, not just announced: ↕/↑/↓ glyphs on the
  sort button driven by the th's aria-sort; the cycle gained its third
  step back to unsorted (matching Material/TanStack/shadcn — insertion
  order stays reachable) and `aria-sort` is emitted only while active
  (ARIA 1.2 single-sorted-header). SortButton outside a SortHeader now
  throws a purposeful error instead of a cryptic NullInjectorError.
- Recipe hardening: select-all disables on an empty filtered page (a
  click there set the DOM property while the false→false binding never
  rewrote it — a permanently stale checkmark); pager buttons use
  aria-disabled + clamped writes instead of [disabled] (a boundary
  button that disables itself under focus drops keyboard users to
  body) with a polite live page readout; hiding the sorted column
  resets the phantom sort; whitespace edits no longer reset the page
  (normalization is a shared memoizing computed); Clear-selection
  affordance + prose documenting that selection is global.
- Spec grew to pin what the review proved unpinned: sort-does-not-reset-
  page, cycle-to-none, empty-page select-all, selection persistence
  through filters until Clear.

### Fixed (nav panels review)

- Panel-link activation now closes the panel: an SPA routerLink click is
  inside the host (outside-click can't see it) and keeps focus (focusout
  never fires), so the route changed behind a still-open panel — the
  demo's full-reload hrefs had masked it. Non-link clicks inside the
  panel still keep it open.
- Escape now consumes the event (preventDefault): without it, a wrapping
  native dialog — a mobile nav sheet — closed in the same keypress.
- The chevron (and the sort-header's ↕/↑/↓ glyphs) use CSS alt text
  (`content: '⌄' / ''`): generated content joins the accessible name,
  and "Products down arrowhead" is not a name.
- Demo corrections: panels moved inside their trigger's li (Tab from an
  expanded trigger now enters its own panel, not the next top-level
  item); the gradient featured cell's focus ring reverted to
  `outline-ring` — the ring paints on the panel's background, not the
  blend, so the on-blend rule did not apply; widths clamped so the panel
  cannot push a horizontal scrollbar at 640–800px.
- A trigger pointing at a missing panel id warns in dev mode instead of
  failing silently with dangling aria-controls.
- The panel's `transition-discrete` was a no-op (display was never in
  the transition list) and its comment misattributed the entrance — the
  entrance is @starting-style alone, the instant exit is documented as
  intended, and the false mechanism is gone before it entered lore.
- Six new behavior tests pin all of it (207 total).

### Added (nav panels)

- Navigation menu with panels (big-four #3): the nav-menu family gains a
  disclosure tier — `nav[xnNavPanels]` owning single-open state,
  `button[xnNavPanelTrigger]` with aria-expanded/aria-controls,
  `[xnNavPanel]` (inert when closed, starting-style entrance riding
  transition-discrete), and `a[xnNavPanelLink]` block links with
  title/description slots. Deliberately the APG disclosure-navigation
  pattern, never `role="menu"` — navigation is links and Tab is the
  navigation key. Outside click, Escape and tabbing away close; Escape
  returns focus to the open panel's trigger. Docs demo composes a
  gradient Surface featured cell (with the documented on-blend focus
  ring).

### Added (data-table)

- Data table as a recipe, not a component (big-four #2): filtering,
  sorting, pagination, row selection and column visibility are
  `computed()` pipelines over the existing table/sort-header/checkbox/
  popover primitives — the engine is signals, zero new dependencies.
  Select-all uses the native checkbox's `indeterminate` DOM property.
  TanStack stays the documented scale-up path for grouping/virtualization.

### Changed (breaking, pre-publish)

- SortHeader activation moved to a native inner `button[xnSortButton]`
  (auto-wired via DI): the th kept `aria-sort` and styling but a th
  cannot receive focus, so click-only sorting locked keyboard users out.
  Enter/Space now come free with the platform.

### Fixed (calendar review)

- Arrow-key axes were inverted: in the grid source `colWrap` governs
  Left/Right and `rowWrap` governs Up/Down — the opposite of the shipped
  config, so days would have stopped at week boundaries. Now colWrap
  continuous / rowWrap nowrap, with the checklist corrected.
- A second activation of the selected day desynced aria-selected from the
  value (the grid toggles cell models directly; the binding's expression
  never changes, so it cannot write back) — the calendar now restores the
  cell model, also covering the deselect-all side effect of activating a
  softDisabled day. Regression-tested.
- Popover: Escape now closes from inside the panel (overlay keydown
  stream) and closing returns focus to the trigger when focus was inside
  — previously Escape only worked while focus sat on the trigger.
- The weekday header left the table: a thead inside role=grid made the
  pattern's authored aria-rowindex off-by-one against the implicit header
  row. Day cells carry full-date labels, so the visual row is aria-hidden.
- "Today" marks client-side only (prerendered HTML carried the build
  date's aria-current); empty-string values no longer throw mid-render;
  garbage months clamp; a NaN weekStartsOn falls back; non-padded
  min/max/value warn in dev mode (lexicographic comparisons need
  YYYY-MM-DD).
- Spec grew from 7 to 12 tests: column alignment, leap-year last cell,
  4-row months, year-boundary paging, roles/roving-tabindex contract,
  second-activation, empty-value survival.

### Added

- Calendar (`<xn-calendar>`), composed on `@angular/aria`'s grid — the
  first of the big-four gaps closed. Roving focus, arrow-key day walking
  (continuous across weeks), Home/End and explicit Space/Enter selection
  all come from the primitive; nothing hand-rolled. ISO `YYYY-MM-DD`
  value model (timezone-proof, lexicographically comparable), visible
  month follows outside value changes via linkedSignal, `min`/`max` and
  outside days disabled-but-focusable (`softDisabled`, per APG),
  Intl-driven labels with `locale`/`defaultMonth` inputs for
  deterministic prerender. Month paging is buttons only — PageUp/Down is
  not in the grid's vocabulary and stays un-hand-rolled (rule 1). Date
  picker ships as a documented composition (input + popover + calendar),
  not a component.

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

- Blend vocabulary: mode-invariant `--gradient-from`/`--gradient-to`/
  `--gradient-foreground` tokens (one dark blend in both modes, both
  endpoints contrast-locked at 4.5:1), `gradient` and `glass` variants on
  button and badge, and a new Surface skin family
  (`default`/`glass`/`gradient`/`glow`) — a skin, not a layout; cards keep
  slots. Gradient surfaces restyle nested `*-description` slots through the
  data-slot seam.
- Bento grew up: `hero` footprint (full-width 2-row banner), `tone` input
  sharing the Surface vocabulary, taller rows; the Blocks demo is now an
  8-tile mosaic led by a gradient hero.
- Streaming-aware MessageScroller (referencing shadcn's message-scroller):
  follows content growth only at the live edge, holds the reader's place
  when they scroll away, exposes `atLiveEdge()` for a jump-to-latest
  affordance; follow is instant, jump is smooth. Live demo on the Chat
  page.
- Prose rhythm is now three custom properties (the typeset model):
  `--prose-size`, `--prose-leading`, `--prose-flow` — heading sizes, list
  indents and block gaps all derive. Set `[--prose-size:1em]` to follow
  the surrounding container.
- `scroll-fade-x`/`scroll-fade-y` utilities: masked edges for scroll
  containers (static masks; scroll-driven variants wait on browser
  support). Applied to the message scroller and the mobile docs nav.
- Docs anatomy (referencing shadcn's): an "On this page" rail harvested
  from the rendered page's own `h2[id]` elements (cannot drift), and
  prev/next page navigation derived from the shell's pages array; router
  anchor scrolling enabled for fragment links.

### Changed

- Overlay motion smoothed: dialogs fade+scale on expo with blurred
  backdrop, sheets/drawers on the fluid curve, menus/popovers on expo,
  tooltips snappy, toasts rise; Motion-page demos slowed 3x for inspection.
- Docs shell nav is responsive: a scrollable pill row under `sm`, the
  sticky column above — previously the nav was simply hidden on phones
  with no alternative.
- Adversarial-review fixes (scroller wave): MessageScroller now pins to
  the newest message on mount (the initial live edge is measured, not
  assumed — an overflowing history no longer teleports the reader on the
  first chunk); a smooth jump's mid-flight positions no longer un-pin
  (wheel/touch/keys end the flight — the reference's user-intent model);
  `scroll-fade-y` is opt-in rather than baked (tailwind-merge cannot see
  custom-utility conflicts, so baking it defeated consumer mask
  overrides); the TOC filters headings inside closed dialogs and inert
  panels (Overlays had 4 phantom links) and its rail column is reserved
  to kill a hydration layout shift; chat demos gained `role="log"` and a
  focus handoff from the unmounting jump button; characterData follow,
  the exact 48px boundary and flight semantics are now spec-pinned.
  Known trade-off kept deliberately: `scrollPositionRestoration:
'enabled'` gives SPA back/forward restore at the cost of native
  reload-position restore.
- Adversarial-review fixes: nav focus rings no longer clip against the
  scroll container (headroom padding on mobile, `overflow-visible` from
  `sm`); on-blend controls carry `focus-visible:outline-gradient-foreground`
  (dark `--ring` measures 2.7:1 on the from-endpoint — documented on
  Surface); the gradient seam's descendant reach is a documented contract
  with a consumer-side escape hatch; the glass fill's muted-text composite
  joined the contrast law; a false comment claiming `filter: none` doesn't
  interpolate was removed along with its needless `brightness-100`.

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
