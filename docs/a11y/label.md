# Manual accessibility checklist — label

- [ ] Every label is associated with a real control (`for` → `id`, or the
      control is nested) — the directive only accepts `<label>`, but the
      association is still the consumer's job
- [ ] Clicking the label focuses its control (proof the association works)
- [ ] No "label-shaped" styled divs anywhere in consuming pages

## Runs

| Date       | Mode(s)      | Result                    | Notes                                                                                                                         |
| ---------- | ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | pass (automated + review) | Association unit-tested (htmlFor) and axe-checked; showcase demonstrates for/id pairing. Click-to-focus pending a hand check. |
