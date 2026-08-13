# Manual accessibility checklist — accordion

Behavior belongs to @angular/aria; automation covers click-expand, inert
hiding and aria-expanded state styling. Hand checks:

- [ ] `Tab` reaches each trigger; `Enter`/`Space` toggle expansion
- [ ] Arrow keys move between triggers (group navigation)
- [ ] Collapsed panel content is skipped by screen readers (inert)
- [ ] Narrator announces expanded/collapsed on the trigger
- [ ] Trigger sits inside a real heading element (showcase uses h3)

## Runs

| Date       | Mode(s)      | Result              | Notes                                                                                                    |
| ---------- | ------------ | ------------------- | -------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | partial (automated) | Click-expand/collapse + inert verified by unit + browser; keyboard walk and Narrator pending hand check. |
