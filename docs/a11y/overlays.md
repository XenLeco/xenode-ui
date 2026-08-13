# Manual accessibility checklist — dialog, toast & tooltip

## Tooltip (CDK Overlay)

Browser-verified 2026-08-13: shows on hover, positions above with fallback
below, role=tooltip, aria-describedby linked while visible.

- [ ] Shows on keyboard focus alone (no mouse) — verify by hand
- [ ] `Esc` hides it (real key needed)
- [ ] Narrator reads the tooltip text as the control's description
- [ ] Consumer rule: the trigger has its own accessible name; the tooltip
      only supplements it

## Dialog (native <dialog>)

Verified in real Chrome: showModal() opens into the top layer (`:modal`
matched), focus moves inside automatically, close() restores. jsdom does
not implement the dialog methods, so unit tests cover only the styling
contract.

- [x] Opens modal, focus moves inside (browser-verified 2026-08-13)
- [ ] `Esc` closes (platform behavior; harness cannot synthesize real key
      identity — verify by hand)
- [ ] `Tab` cycles inside the open dialog and cannot escape it
- [ ] Focus returns to the opening button on close
- [ ] Narrator announces the dialog with its aria-labelledby title
- [ ] Consumer rule: every xnDialog carries aria-labelledby pointing at its
      xnDialogTitle

## Toast

Verified in real Chrome: show/dismiss/auto-expire, destructive styling,
polite live region.

- [x] role="status" aria-live="polite" region present (unit-tested)
- [x] Every toast keeps a labeled dismiss button — auto-dismiss is a
      convenience, not the only exit (unit-tested)
- [ ] Narrator announces new toasts without stealing focus
- [ ] Toast text is meaningful without the color (SC 1.4.1)

## Runs

| Date       | Mode(s) | Result              | Notes                                                                                                                |
| ---------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light   | partial (automated) | Dialog modal/focus + toast lifecycle browser-verified; Esc, focus-return, Tab-cycle and Narrator pending hand check. |
