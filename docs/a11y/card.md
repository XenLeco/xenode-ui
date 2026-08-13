# Manual accessibility checklist — card

A card is a non-interactive grouping; its accessibility lives in the
consumer's element choices.

- [ ] `xnCardTitle` sits on a real heading element (h2/h3/…) that fits the
      page's heading outline — the showcase must demonstrate this
- [ ] Reading order (DOM order) matches visual order
- [ ] If a card is clickable as a whole (not built yet), the interactive
      element is a real link/button inside it — never a click handler on the
      card div

## Runs

| Date       | Mode(s)      | Result                    | Notes                                                                                                  |
| ---------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------ |
| 2026-08-13 | light + dark | pass (automated + review) | Heading element asserted in unit test; showcase uses h3 under the page's h2. No clickable cards exist. |
