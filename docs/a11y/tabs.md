# Manual accessibility checklist — tabs

Behavior belongs to @angular/aria; this checklist verifies the composition,
not their implementation. Automation covers click-selection and inert
hiding; the keyboard walk needs real keys.

- [ ] `Tab` lands on the selected tab only (roving tabindex), then the next
      `Tab` moves INTO the visible panel's content, not to the next tab
- [ ] `ArrowRight`/`ArrowLeft` move between tabs and select as they move
      (selectionMode defaults to follow)
- [ ] `Home`/`End` jump to first/last tab
- [ ] The disabled tab is skipped by arrow navigation
- [ ] Focus ring visible on tabs in both modes
- [ ] Screen reader announces "tab, 1 of 3, selected" semantics
      (role=tab/tablist/tabpanel wiring — spot-check with Narrator)

## Runs

| Date       | Mode(s)      | Result              | Notes                                                                                                                                                                                               |
| ---------- | ------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | partial (automated) | Click-selection, aria-selected state styling and inert visual hiding verified by unit + browser checks. Keyboard walk and Narrator pending the hand check (synthesized keys carry no key identity). |
