# Manual accessibility checklist — button

Automation (axe + the contrast test) covers roughly half. This is the rest.
Run against the live /components page, both themes, before calling the
component done. Record each run at the bottom.

## Keyboard

- [ ] `Tab` reaches every enabled button in document order
- [ ] Focus is clearly visible in **light** mode (ring ≥3:1 — token-tested,
      but verify it renders where you expect)
- [ ] Focus is clearly visible in **dark** mode
- [ ] `Enter` activates
- [ ] `Space` activates (pressed on keyup — native behavior, verify it wasn't
      broken by a handler)
- [ ] Disabled buttons are skipped by `Tab` (native `disabled` removes them
      from the tab order — this is expected, not a bug)

## Semantics

- [ ] Announced as a button with its visible label (native role; spot-check
      with Windows Narrator if available)
- [ ] Icon-only buttons (`size="icon"`) carry an `aria-label` — consumer
      responsibility; the showcase must demonstrate it

## Runs

| Date       | Mode(s)      | Result              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-12 | light + dark | partial (automated) | Real-Chrome checks: focus ring visible with correct token color in both modes — and this run caught a real bug: `transition-colors` includes `outline-color` in Tailwind v4, so the ring faded in from currentColor (~100 ms invisible on light). Fixed by scoping the transition; ring now snaps (same-tick computed = --ring). Disabled not tabbable + non-interactive and accessible names covered by unit tests. **Pending manual** (automation cannot synthesize real key activation): Enter/Space activation, full Tab-order walk, Narrator spot-check. |
