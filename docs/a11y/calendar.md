# Calendar — manual keyboard checklist

The harness cannot synthesize trusted key identity, so the grid's keyboard
contract needs a hand check. Automated coverage already proves (in
calendar.spec.ts, not just by hand): grid/row/gridcell roles, roving
tabindex (exactly one tabbable cell), full-date aria-labels, aria-selected
surviving a second activation, aria-disabled under min/max and on outside
days, and column alignment. What automation cannot prove is real key
activation below.

Axis note (per the grid source, confirmed by review): `colWrap` governs
Left/Right, `rowWrap` governs Up/Down. The calendar sets colWrap
continuous / rowWrap nowrap.

On `/components/forms` → Calendar:

- [ ] Tab reaches the grid once (one stop); Tab again leaves the grid.
- [ ] Arrow Right/Left walk days and continue across week boundaries
      (colWrap continuous — Sunday → next Monday); Arrow Up/Down walk
      weeks and stop at the month's first/last week (rowWrap nowrap).
- [ ] Home/End jump within the current week row.
- [ ] Space or Enter selects the focused day; the value line updates;
      aria-selected moves.
- [ ] Space/Enter again on the SAME day keeps the selection (the grid's
      toggle is written back — watch for a highlight flicker, there
      should be none).
- [ ] Disabled days (before the min, outside days) are focusable; Space/
      Enter on them commits nothing AND does not clear the existing
      selection's highlight.
- [ ] Prev/next month buttons are Tab stops with visible focus rings and
      react to Enter/Space.
- [ ] Narrator/NVDA: day announcement reads the full date ("Friday,
      August 14, 2026"), selection state, and disabled state; the month
      label change is announced (aria-live polite).
- [ ] Date picker: trigger opens the popover; Escape — including from a
      day cell inside the panel — closes it and returns focus to the
      trigger (implemented via the overlay's keydown stream).

Notes: PageUp/PageDown month paging is deliberately not implemented (not
in the grid primitive's vocabulary; we do not hand-roll keys — rule 1).
"Today" is marked client-side only; prerendered HTML carries no today
marking by design.
