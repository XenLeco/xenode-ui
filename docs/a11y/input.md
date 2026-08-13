# Manual accessibility checklist — input

- [ ] Every input has a real label (`xnLabel` with `for`, or `aria-label` as
      the exception) — a placeholder is NOT a label; it vanishes on typing
- [ ] Focus ring visible in both modes
- [ ] Error state: `aria-invalid="true"` plus `aria-describedby` pointing at
      the error text — never color alone (SC 1.4.1); the red border is the
      redundant channel, the described-by text is the primary one
- [ ] Disabled input skipped by Tab (native), and its meaning is clear
      without relying on the dimming alone

## Runs

| Date       | Mode(s)      | Result                    | Notes                                                                                                                                                                                                                |
| ---------- | ------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | pass (automated + review) | Label association + aria-invalid/aria-describedby linkage unit-tested and axe-checked; showcase pairs label+input and shows the error pattern with visible text. Keyboard walk pending the hand check with button's. |
