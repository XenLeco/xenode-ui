# Manual accessibility checklist — badge

A badge is non-interactive, so there is no keyboard story. What can still go
wrong is semantic:

- [ ] Not focusable, not in the tab order (unit-tested; spot-check visually)
- [ ] The text carries the meaning — never color alone (SC 1.4.1): a
      `destructive` badge must say something like "Deprecated", not rely on
      being red
- [ ] Purely decorative badges (if any ever exist) get `aria-hidden="true"`
      — consumer responsibility
- [ ] Screen reader reads the badge text inline with its surroundings and it
      makes sense in that order

## Runs

| Date       | Mode(s)      | Result                    | Notes                                                                                                 |
| ---------- | ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | pass (automated + review) | Non-focusability unit-tested; variants named by text in the showcase; no decorative badges exist yet. |
